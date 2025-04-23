import './Details.css'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IDetailChange, IInsumo, IPedido, IpedidoDataPDF, rolesNum } from '../../Utils/Interfaces'
import dbDateParser from '../../Utils/dbDateParser'
import {pdf} from '@react-pdf/renderer';
import PedidoDocument from '../pdfs/pedido'
import { saveAs } from 'file-saver'
import Header from '../Header/Header'

export default function DetailsPage () {
    
    const navigator = useNavigate()
    const params = useParams()
    const id = params.orderId
    const global = useContext(GlobalContext)
    const [order, setOrder] = useState<IPedido | null>(null)
    const [loading, setLoad] = useState(false)
    const [details, _setDetails] = useState<number[]>([])
    const [detailsChange, _setChange] = useState<IDetailChange[]>([])
    const [commnet, setComment] = useState<string>('')


    useEffect(() => {
        if(global && global.pedidos.length > 0 && id){
            global.pedidos.forEach(p => {
                if(p.numero === id) {
                    setOrder(p)
                }
            });
            if(global.insumos.length === 0) global?.insumosFn()
        }else{

            navigator('/')
        }
    },[])

    const rejectFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres rechazar el pedido?')) global?.orderRejectFn(order_id, commnet)
        else setLoad(false)
    }
    const aproveFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres aprobar el pedido?')) global?.orderAproveFn(order_id, commnet , details, detailsChange)
        else setLoad(false)

    }
    const cancelFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres cancelar el pedido?')) global?.orderCancelFn(order_id)
        else setLoad(false)
    }
    const deliverFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres informar la entrega del pedido? Al hacerlo, declara que el pedido se entrego correctamente.')) global?.orderDeliveredFn(order_id, commnet)
        else setLoad(false)
    }
    const problemFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres informar un problema? Al hacerlo, declara que el pedido no se entrego correctamente.')) global?.problemFn(order_id, commnet)
        else setLoad(false)
    }
    const readyFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres informar que el pedido esta Listo?')) global?.orderReadyFn(order_id)
        else setLoad(false)
    }
    const archiveFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres archivar el pedido?')) global?.orderArchFn(order_id)
        else setLoad(false)
    }
    const exportPdf = async () => {
        if(order) {
            const insumosFormat: IInsumo[] = order.insumos.map((i) => {
                const format = i.insumo_des.split('-')
                const cod = parseInt(format[0])
                const cod1 = parseInt(format[1])
                const cod2 = parseInt(format[2])
                const cod3 = parseInt(format[3])
                const data: IInsumo = {
                    insumo_id: Number.isNaN(cod) ? 0 : cod,
                    ins_cod1: Number.isNaN(cod1) ? 0 : cod1,
                    ins_cod2: Number.isNaN(cod2) ? 0 : cod2,
                    ins_cod3: Number.isNaN(cod3) ? 0 : cod3,
                    insumo_des: format[4],
                    amount: i.amount
                }
                return data
            })
            const serv = servData(order?.service_id)
            const pedido: IpedidoDataPDF = {
                solicitante_email: order.email,
                solicitante_nombre: order.first_name,
                solicitante_apellido: order.last_name,
                solicitante_usuario: order.requester,
                pedido_numero: order.numero,
                pedido_req: order.date_requested,
                pedido_deli: order.date_delivered,
                pedido_apr: order.date_aproved,
                pedido_client: serv.clientdes,
                pedido_service: serv.serdes,
                pedido_client_id: serv.clientid,
                pedido_service_id: serv.serid,
                pedido_state: order.state,
                pedido_insumos: insumosFormat
            }
            const blob: Blob = await pdf(<PedidoDocument pedido={pedido}/>).toBlob()
            saveAs(blob, 'SGP-'+order.numero+'.pdf')
        }
    }

    const deleteInsumoRow = (index: number, insumo: string, details_id: number | undefined) => {
        if(order && order.insumos.length > 1 && order.state === 'Pendiente' && global?.user.rol !== rolesNum.encargado && details_id) {
            if(confirm('¿Quiere eliminar el insumo '+insumo+ "?")){
                order.insumos.splice(index, 1)
                setOrder({...order})
                details.push(details_id)
            }
        }
    }

    const btnDisplay = () => {
        if(loading){
            return(
                <h3 className='title-Homepage'>Cargando...</h3>
            )
        }
        else if(global?.user.rol === rolesNum.encargado) {
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => cancelFn(order.order_id)}>CANCELAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Esperando a que el pedido este listo.</h3>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-problem' onClick={() => problemFn(order.order_id)}>PROBLEMA</button>
                            <button className='btn-neutral' onClick={() => deliverFn(order.order_id)}>ENTREGADO</button>
                        </div>
                    )
                case 'Rechazado':
                    return(
                    <div className='div-btns'>
                        <h3 className='title-Homepage'>Pedido rechazado.</h3>
                    </div>
                    )
                default:
                    return (
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
                        </div>
                    )

            }
        }
        else if(global?.user.rol === rolesNum.administrativo) {
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => archiveFn(order? order.order_id : 0)}>ARCHIVAR</button>
                        </div>
                    ) 

            }
        }
        else if(global?.user.rol === rolesNum.admin) {
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => aproveFn(order ? order.order_id : 0)}>APROBAR</button>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => readyFn(order ? order.order_id : 0)}>LISTO</button>
                            <button className='btn-negative' onClick={() => cancelFn(order? order.order_id : 0)}>CANCELAR</button>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => deliverFn(order.order_id)}>ENTREGADO</button>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => archiveFn(order? order.order_id : 0)}>ARCHIVAR</button>
                            <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
                        </div>
                    ) 

            }
        }
        else if(global?.user.rol === rolesNum.en_deposito){
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => aproveFn(order ? order.order_id : 0)}>APROBAR</button>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                    case 'Cancelado':
                        return(
                            <div className='div-btns'>
                                <h3 className='title-Homepage'>Pedido Cancelado</h3>
                            </div>
                        )
                    case 'Rechazado':
                        return(
                            <div className='div-btns'>
                                <h3 className='title-Homepage'>Pedido Rechazado</h3>
                            </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => readyFn(order ? order.order_id : 0)}>LISTO</button>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Pedido listo, esperando entrega</h3>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Pedido entregado</h3>
                        </div>
                    ) 

            }
        }
        else navigator('/')
    }

    const serviceDisplayer = (id: number): string => {
        let srv = 'Servicio'
        global?.ccos.forEach(s => {
            if(id === s.service_id) srv= s.service_id+'-'+s.service_des
        });
        return srv
    }

    const servData = (id: number) => {
        const data = {
            serdes: '',
            clientdes: '',
            serid: 0,
            clientid: 0
        }
        global?.ccos.forEach(s => {
            if(id === s.service_id) {
                data.clientdes = s.client_des
                data.clientid = s.client_id
                data.serdes = s.service_des,
                data.serid = s.service_id
            }
        });
        return data
    }

    const classChange = (): string => {
        if(global?.user.rol !== 3){
            if(order?.state === 'Pendiente' && order.insumos.length > 1) return 'data-div-insumo-name-row'
            else return 'table-users'
        }
        else return 'table-users'
    }
    const commentText = () => {
        if((global?.user.rol === rolesNum.admin || global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.en_deposito) 
            && order?.state === "Pendiente"){
                return(
                    <div>
                        <h4 className='delete-text'>Comentarios</h4>
                        <textarea value={commnet} className='texarea-details'
                        onChange={(e) => setComment(e.target.value)}/>
                    </div>

                )
        }
        else if(global?.user.rol === rolesNum.encargado && order?.state === 'Listo'){
            return(
                <div>
                    <h4 className='delete-text'>Comentarios</h4>
                    <textarea value={commnet} className='texarea-details'
                    onChange={(e) => setComment(e.target.value)}/>
                </div>

            )
        }
    }
    const changeAmount = (nm: number, index: number, detail_id: number | undefined) => {
        if(order && detail_id && order.state === 'Pendiente' && global?.user.rol !== 3) {
            const newA = prompt('Ingrese la nueva cantidad: ',nm.toString()) ?? nm.toString()
            if(newA && parseFloat(newA)) {
                const newAmNum: number = parseFloat(newA)
                order.insumos[index].amount = newAmNum
                setOrder({...order})
                const chang: IDetailChange = {
                    detail_id: detail_id,
                    amount: parseFloat(newA)
                }
                detailsChange.push(chang)
                return 0
            } else changeAmount(nm, index, detail_id)
        }
    }

    const dataDisplay = () => {
        if(order) {
            return(
                <div className='data-div'>
                    <h3>CCO: </h3>
                    <h4>{serviceDisplayer(order.service_id)}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Solicitante: </h3>
                    <h4>{order.requester}</h4>
                    <h4>{order.email}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Estado del Pedido: </h3>
                    <h4>{order.state}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Fecha:</h3>
                    <h4>{'Ordenado: '+dbDateParser(order.date_requested, false)}</h4>
                    <h4>{order.date_aproved ? 'Aprobado: '+dbDateParser(order.date_aproved, false) : 'Aprobacion: pendiente'}</h4>
                    <h4>{order.date_delivered ? "Recibido: "+dbDateParser(order.date_delivered,false) : 'Entrega: pendiente'}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <table >
                        <tbody>
                            <tr>
                                <th>Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                            {order.insumos.map((i, index) => (
                                <tr key={i.insumo_id} className={classChange()}>
                                    <th className='data-div-insumo-name-row' onClick={() => deleteInsumoRow(index, i.insumo_des, i.detail_id)}>{i.insumo_des}</th>
                                    <th className='data-div-insumo-amount-row' onClick={() => changeAmount(i.amount, index, i.detail_id)}>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/*insumoAdder()*/}
                </div>
            )
        }
        else{
            return(<h3 className='title-Homepage'>Cargando...</h3>)
        }
    }

    const provBtn = () => {
        if(order?.prov && global?.user.rol === 1){
            return(<button className='btn-export-pdf' onClick={() => navigator('/provisorio/'+order?.numero)}>Provisorio</button>)
        }
    }

    return(
        <div className='detaail-all-div'>
            <div className='div-header-pedidos'>
                <Header />
            </div>
            <h1 className='title-Homepage' >
                {'Pedido Nro: '+id}
            </h1>
            <div className='export-div'>
                <button disabled={global?.user.rol === 1 ? false : true}
                className={global?.user.rol === 1 ? 'btn-export-txt': 'btn-export-txt-none'}>
                    Exportar txt
                </button>
                <button className='btn-export-pdf' onClick={() => exportPdf()}>Exportar pdf</button>
                <button className='btn-export-pdf' onClick={() => navigator('/reportar/'+order?.numero)}>Reportar</button>
                {provBtn()}
            </div>
            <hr color='#3399ff' className='hr-line'/>
            {dataDisplay()}
            {commentText()}
            {btnDisplay()}

        </div>
    )
}