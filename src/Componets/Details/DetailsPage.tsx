import './Details.css'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IEntrega, IInsumo, IPedido, IpedidoDataPDF, IPersonal, rolesNum } from '../../Utils/Interfaces'
import dbDateParser from '../../Utils/dbDateParser'
import {pdf} from '@react-pdf/renderer';
import PedidoDocument from '../pdfs/pedido'
import Entrega from '../pdfs/entrega'
import { saveAs } from 'file-saver'
import Header from '../Header/Header'
import tokenExpireChecker from '../../Utils/tokenExpireChecker'
import dateParser from '../../Utils/dateParser'
//import sectoresPersonal from "./sectores.json"
import infoMsg from '../../Utils/infoMsg'
import RemitoDocument from '../pdfs/remito'
import { divisionTable } from '../pdfs/remito'


export default function DetailsPage () {
    
    const navigator = useNavigate()
    const params = useParams()
    const id = params.orderId
    const global = useContext(GlobalContext)
    const [order, setOrder] = useState<IPedido | null>(null)
    const [loading, setLoad] = useState(false)
    const [addIns, setAddIns] = useState(false)
    const [newIns, setNewAdd] = useState('')
    const [newAmount, setNewAmount] = useState(0)
    const [commnet, setComment] = useState<string>('')
    const [action, setAction] = useState(0)
    const [dateEntrega, setDateEntrega] = useState('')
    const [collection, setCollectionArr] = useState('')
    const [searchIns, setSearchIns] = useState('')
    const [filteredIns, setFilteredIns] = useState<string[]>([])
    const [addPer, setAddPer] = useState(false)

    useEffect(() => {
      if(global && id && !tokenExpireChecker()){
          global.uniqPedido(parseInt(id), false)
          if(global.insCategroies.rubros.length === 0) global.getCategoriasInsumos()
          if(global.ccos.length === 0) global.ccosFn()
          if(global.insumos.length === 0) global.insumosFn(false)  
      }else{
          navigator('/')
      }
    },[])
    
    useEffect(() => {
      if(global) {
        setOrder(global?.pedidoDetail)
        getPersonal()
      }
    },[global?.pedidoDetail])
    useEffect(() => {
        if(global && global.insumos.length > 0) {
            let arr = global?.insumos
            if(searchIns.length > 2) {
                arr = arr.filter(c => c.toUpperCase().includes(searchIns.toUpperCase()))
            }
            setFilteredIns(arr)
        }
    },[global?.insumos, searchIns])
    
    const getPersonal = async (): Promise<IPersonal> => {
      if(global && order && order.legajo) {
        const persona = await global.getPersona(order.legajo)
        return persona
      }
      else return {legajo:0,fullname:'',cuil:0,sector:``}
    }

    const createRemito = async () => {
        if(order){
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
                    amount: Math.round(i.amount * 100) / 100
                }
                return data
            })
            const dataF = divisionTable(insumosFormat)
            const blob: Blob = await pdf(<RemitoDocument c={dataF} />).toBlob()
            saveAs(blob, 'REMITO_'+order?.numero)
        }
    }

    const rejectFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres rechazar el pedido?')) global?.orderRejectFn(order_id, commnet)
        else setLoad(false)
    }
    const aproveFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres aprobar el pedido?')) global?.orderAproveFn(order_id, commnet)
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
    
    const exportPdfEntrega = async () => {
        if(order && order.legajo && dateEntrega) {
          const d = dateParser(dateEntrega)
          const personal = await getPersonal()
          const entrega:IEntrega = {
            entrega: {
              fullname: personal.fullname,
              dni: personal.cuil,
              service: serviceDisplayer(order.service_id),
              fecha_entrega: d.day+'/'+d.month+'/'+d.year,
              insumos: order.insumos
            }
          } 
          const blob: Blob = 
            await pdf(<Entrega entrega={entrega.entrega}/>).toBlob()
            saveAs(blob, 'SGP-Plantilla-'+order.numero+'.pdf')
        }
        else {
          alert('Seleccione una fecha de entrega.')
        }
    }

    const deleteInsumoRow = async (_index: number, insumo: string, details_id: number | undefined) => {
        if(order && order.insumos.length > 1 && order.state === 'Pendiente' && global?.user.rol !== rolesNum.encargado && details_id) {
            if(confirm('¿Quiere eliminar el insumo '+insumo+ "?")){
                await global?.deleteInsumo(details_id)
            }
        }
    }

    const btnDisplay = () => {
        if(loading){
            return(
                <h3 className='title-Homepage'>Cargando...</h3>
            )
        }
        else if(global?.user.rol === rolesNum.encargado || global?.user.rol === rolesNum.cocina) {
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
                default:
                    return (
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
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
                            <button className='btn-neutral' onClick={() => deliverFn(order.order_id)}>ENTREGADO</button>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
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
                data.clientdes = s.client_des + ' - ' +s.localidad
                data.clientid = s.client_id
                data.serid = s.service_id
                data.serdes = s.service_des
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
    const changeAmount = async (nm: number, detail_id: number | undefined) => {
        if(order && detail_id && order.state === 'Pendiente' && global?.user.rol !== rolesNum.encargado && global?.user.rol !== rolesNum.cocina) {
          const newA = prompt('Ingrese la nueva cantidad (utilize . en vez de ,) ', nm.toString()) ?? 0;
            if(newA === 0) return 0
            else if(newA && parseFloat(newA)) {
                const newAmNum = parseFloat(newA)
                await global?.changeAmountFn(detail_id, newAmNum)
                return 0
            } else changeAmount(nm, detail_id)
        }
    }

    const addNewInsumo = async () => {
        if(order && global && newIns && newAmount) {
            global.addInsumo( newIns, order.order_id,newAmount)
        }
        else alert('Ingrese un insumo y monto correcto.')
    }

    const checkToAdd = (): boolean => {
        if(order?.state === "Pendiente" && global?.user.rol === rolesNum.en_deposito) return true
        else return false
    }

    const deletePedido = () => {
        if(global && order && order.order_id) {
            if(prompt('Ingrese el numero de pedido para eliminar: ') === order.numero) {
                if(confirm('Seguro que quieres eliminar el pedido '+order.numero+'? (Esto sera permanente y el pedido no podra repertirse.)')) global.eliminarPedido(order.order_id)
                else alert('Pedido no eliminado')
            }
            else alert('Pedido no eliminado')
        }
    }

    const setColeccion = () => {
        if(global && order && collection) {
            const col: string | null = localStorage.getItem(collection)
            if(localStorage.getItem(collection) && col) {
                const orders: string [] = JSON.parse(col)
                if(!orders.includes(order.numero)){
                    orders.push(order.numero)
                    localStorage.setItem(collection, JSON.stringify(orders))
                    alert(`Pedido ${order.numero} agregado a la coleccion ${collection}`)
                }
                else alert('Pedido ya esta en la coleccion.')
            }
            else {
                const orders: string[] = [order.numero]
                localStorage.setItem(collection, JSON.stringify(orders))
                alert(`Pedido ${order.numero} agregado a la coleccion ${collection}`)
            }
        }
    }

    const displayActions = () => {
      if(action === 1) {
        return(
          <div>
            <div>
              <h5 className='filter-sub'>Fecha de entrega</h5>
              <input type='date' id='date_start' className='date-input'
              value={dateEntrega} onChange={e => setDateEntrega(e.target.value)}/>
            </div>
            <button className='btn-export-pdf' onClick={() => exportPdfEntrega()}>Exportar</button>
          </div>
        )
      }
      else if(action === 2) {
        return(
          <button className='btn-export-pdf' onClick={() => exportPdf()}>Exportar</button>
        )
      }
      else if(action === 3) {
        return(
          <button className='btn-export-pdf' onClick={() => navigator('/reportar/'+order?.numero)}>Reportar</button>
        )
      }
      else if(action === 4) {
        return(
          <button className='btn-export-txt'>Exportar</button>
        )
      }
      else if(action === 5) {
        return(
          <button className='btn-export-pdf' onClick={() => navigator('/provisorio/'+order?.numero)}>Asignar Servicio</button>
        )
      }
        else if(action === 6) {
        return(
          <button className='btn-export-pdf' onClick={() => deletePedido()}>Eliminar Pedido</button>
        )
      }
      else if(action === 7) {
        return (
            <div>
                <h5 className='filter-sub'>Selecciona la Coleccion</h5>
                <select value={collection} onChange={(e) => setCollectionArr(e.target.value)} className='select-actions'>
                  <option value={''}>---</option>
                  <option value={'Coleccion1'}>Coleccion 1</option>
                  <option value={'Coleccion2'}>Coleccion 2</option>
                  <option value={'Coleccion3'}>Coleccion 3</option>
                  <option value={'Coleccion4'}>Coleccion 4</option>
                  <option value={'Coleccion5'}>Coleccion 5</option>
                </select>
                <button className='btn-export-pdf' onClick={() => setColeccion()}>Agregar</button>
            </div>
        )
      }
      else if(action === 8) {
        return(
          <button className='btn-export-pdf' onClick={() => createRemito()}>Crear Remito</button>
        )
      }
      else {
        return(
          <></>
        )
      }
    }
    const dataDisplay = () => {
        if(order) {
            return(
                <div className='data-div'>
                  <div className='data-div-info'>
                    <div>
                        <h5 className='filter-sub'>Otras Acciones</h5>
                        <select value={action} onChange={(e) => setAction(parseInt(e.target.value))} className='select-actions'>
                          <option value={0}>---</option>
                          {(order.legajo && global?.user.rol === rolesNum.en_deposito) && <option value={1}>Exportar plantilla de entrega</option>}
                          <option value={2}>Exportar a pdf</option>
                          <option value={8}>Crear remito</option>
                          <option value={3}>Reportar</option>
                          {global?.user.rol === rolesNum.admin && <option value={4}>Exportar a TXT</option>}
                          {order.prov && <option value={5}>Provisional</option>}
                          {global?.user.rol === rolesNum.admin && <option value={6}>Eliminar Pedido</option>}
                            {global?.user.rol === rolesNum.en_deposito && <option value={7}>Agregar a Coleccion</option>}
                        </select>
                        <button className="info-popup" onClick={() => infoMsg(6)}>?</button>
                    </div>
                    <div>
                      {displayActions()}
                    </div>
                  </div>
                    <div className='data-div-info'>
                        <h3>CCO: </h3>
                        <h4>{serviceDisplayer(order.service_id)}</h4>
                        {order.prov && <h4>{order.prov_des}</h4>}
                    </div>
                    <div className='data-div-info'>
                        <h3>Solicitante: </h3>
                        <h4>{order.requester}</h4>
                        <h4>{order.email}</h4>
                    </div>
                    <div className='data-div-info'>
                        <h3>Estado del Pedido: </h3>
                        <h4>{order.state}</h4>
                    </div>
                    {order.legajo ?
                      <div className='data-div-info'> 
                        <h3>Entregar a legajo: {order.legajo}</h3>
                        <hr color='#666666' className='hr-details'/>
                      </div>
                      :
                      ''
                    }
                    <div className='data-div-info'>
                        <h3>Fecha:</h3>
                        <h4>{'Ordenado: '+dbDateParser(order.date_requested, false)}</h4>
                        <h4>{order.date_aproved ? 'Aprobado: '+dbDateParser(order.date_aproved, false) : 'Aprobacion: pendiente'}</h4>
                        <h4>{order.date_delivered ? "Recibido: "+dbDateParser(order.date_delivered,false) : 'Entrega: pendiente'}</h4>
                    </div>
                    {checkToAdd() &&
                        <div className='data-div-add-special'>
                            <h4>Agregar insumo: </h4>
                            <div>
                                <input type="checkbox" checked={addIns} onChange={(e) => setAddIns(e.target.checked)}/>
                            </div>
                            
                        </div>
                    }

                    {addIns &&
                        <div>
                            <div>
                                <h4>Personalizado: <input type="checkbox" checked={addPer} onChange={(e) => setAddPer(e.target.checked)}/></h4>
                                {addPer ? 
                                <div>
                                    <input type="text" id='otherins' className="data-div-select" 
                                    onChange={(e) => setNewAdd(e.target.value)} value={newIns}/>
                                </div>
                                :
                                <div>
                                    <div>
                                        <h6>Busqueda</h6>
                                        <input type="text" id='otherins' className="data-div-select" 
                                        onChange={(e) => setSearchIns(e.target.value)} value={searchIns}/>
                                        <button className="info-popup" onClick={() => infoMsg(5)}>?</button>
                                    </div>
                                    <h6>Insumo - {filteredIns && filteredIns.length > 0 ? filteredIns.length + " Encontrados" : 0 + " Encontrados"}</h6>
                                    <select defaultValue={''} value={newIns} className="data-div-select"
                                    onChange={e => setNewAdd(e.target.value)}>
                                    <option value={''}>---</option>
                                    {
                                        filteredIns.map((i, index) => (
                                            <option key={index} value={i}>{i}</option>
                                        ))
                                    }
                                    </select>
                                </div>
                                }

                                <input type="number" step='any' id='amount' min={0}
                                value={newAmount} onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                                className="data-div-textfield-amount"/>
                                <button className='btn-export-pdf' onClick={() => addNewInsumo()}>Agregar</button>
                            </div>

                        </div>
                    }
                    <hr color='#666666' className='hr-details'/>

                    {global?.user.rol === rolesNum.en_deposito && <button className="info-popup" onClick={() => infoMsg(7)}>?</button>}
                    <table >
                        <tbody>
                            <tr>
                                <th>Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                            {order.insumos.map((i, index) => (
                                <tr key={i.insumo_id} className={classChange()}>
                                    <th className='data-div-insumo-name-row' onClick={() => deleteInsumoRow(index, i.insumo_des, i.detail_id)}>{i.insumo_des}</th>
                                    <th className='data-div-insumo-amount-row' onClick={() => changeAmount(i.amount, i.detail_id)}>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        else{
            return(<h3 className='title-Homepage'>Cargando...</h3>)
        }
    }


    return(
        <div className='detaail-all-div'>
            <div >
                <Header />
            </div>
            <h1 className='title-Homepage' >
                {'Pedido: '+global?.pedidoDetail.numero}
            </h1>
            <hr color='#3399ff' className='hr-line'/>
            {dataDisplay()}
            {commentText()}
            {btnDisplay()}

        </div>
    )
}
