import './Details.css'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IPedido, rolesNum } from '../../Utils/Interfaces'
import dbDateParser from '../../Utils/dbDateParser'

//const use_logs = import.meta.env.VITE_USE_LOGS
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function DetailsPage () {
    
    const navigator = useNavigate()
    const params = useParams()
    const id = params.orderId
    const global = useContext(GlobalContext)
    const [order, setOrder] = useState<IPedido | null>(null)
    const [loading, setLoad] = useState(false)

    useEffect(() => {
        if(global && global.pedidos.length > 0 && id){
            console.log(id)
            console.log(global?.pedidos)
            global.pedidos.forEach(p => {
                if(p.numero === id) {
                    console.log(p)
                    setOrder(p)
                }
            });
        }else{
            console.log(id)
            console.log(global?.pedidos)
            navigator('/')
        }
    },[])

    const rejectFn = (order_id: number) => {
        setLoad(true)
        global?.orderRejectFn(order_id)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }
    const aproveFn = (order_id: number) => {
        setLoad(true)
        global?.orderAproveFn(order_id)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }
    const cancelFn = (order_id: number) => {
        setLoad(true)
        global?.orderCancelFn(order_id)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }
    const deliverFn = (order_id: number) => {
        setLoad(true)
        global?.orderDeliveredFn(order_id)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }
    const readyFn = (order_id: number) => {
        setLoad(true)
        global?.orderReadyFn(order_id)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }
    const archiveFn = (order_id: number) => {
        setLoad(true)
        global?.orderArchFn(order_id)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }

    const btnDisplay = () => {
        console.log('LOAD ',loading)
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
                            <button className='btn-negative' onClick={() => rejectFn(order.order_id)}>CANCELAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Esperando a que el pedido este listo</h3>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => deliverFn(order.order_id)}>RECIBIDO</button>
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
        else if(global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin) {
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
                            <h3 className='title-Homepage'>Pedido preparandose</h3>
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
                            <button className='btn-neutral' onClick={() => archiveFn(order? order.order_id : 0)}>ARCHIVAR</button>
                        </div>
                    ) 

            }
        }
        else if(global?.user.rol === rolesNum.en_deposito){
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Esperando aprobacion del pedido</h3>
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
    const dataDisplay = () => {
        if(order) {
            return(
                <div className='data-div'>
                    <h3>Estado del Pedido: </h3>
                    <h4>{order.state}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>CCO: </h3>
                    <h4>{serviceDisplayer(order.service_id)}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Solicitante: </h3>
                    <h4>{order.requester}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Fecha:</h3>
                    <h4>{'Ordenado: '+dbDateParser(order.date_requested, false)}</h4>
                    <h4>{order.date_aproved ? 'Aprobado: '+dbDateParser(order.date_aproved, false) : 'Aprobacion pendiente'}</h4>
                    <h4>{order.date_delivered ? "Recibido: "+dbDateParser(order.date_delivered,false) : 'Entrega pendiente'}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <table>
                        <tbody>
                            <tr>
                                <th>Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                            {order.insumos.map((i) => (
                                <tr key={i.cod_insumo}>
                                    <th>{i.insumo_des}</th>
                                    <th>{i.amount}</th>
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
        <div>
            <img src="/logo_big.webp" alt="" className='logo-big-home'/>
            <div className='div-header-pedidos'>
                <button className='btn-small-logout' onClick={() => navigator('/pedidos')}>
                    Volver
                </button>
                <h1 className='title-Homepage' >
                    {'Pedido Nro: '+id}
                </h1>
            </div>
            <div>
                <button disabled={global?.user.rol === 1 ? false : true}
                className={global?.user.rol === 1 ? 'btn-export': 'btn-export-disable'}>
                    Exportar txt
                    </button>
                <button className='btn-export'>Exportar pdf</button>
            </div>
            <hr color='#3399ff' className='hr-line'/>
            {dataDisplay()}
            {btnDisplay()}

        </div>
    )
}