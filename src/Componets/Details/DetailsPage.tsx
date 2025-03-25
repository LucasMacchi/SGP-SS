import './Details.css'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IPedido, rolesNum } from '../../Utils/Interfaces'
import dbDateParser from '../../Utils/dbDateParser'

//const use_logs = import.meta.env.VITE_USE_LOGS

export default function DetailsPage () {
    
    const navigator = useNavigate()
    const params = useParams()
    const id = params.orderId
    const global = useContext(GlobalContext)
    const [order, setOrder] = useState<IPedido | null>(null)

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

    const btnDisplay = () => {
        if(global?.user.rol === rolesNum.encargado 
            && order?.state === 'Pendiente'){
            return(
                <div className='div-btns'>
                    <button className='btn-negative' onClick={() => global.orderCancelFn(order.order_id)}>CANCELAR</button>
                </div>
            )
        }
        else if (global?.user.rol === rolesNum.encargado 
            && order?.state === 'Aprobado') {
            return(
                <div className='div-btns'>
                    <button className='btn-accept' onClick={() => global.orderDeliveredFn(order.order_id)}>RECIBIDO</button>
                </div>
            )
        }
        else if (global?.user.rol === rolesNum.encargado) {
            return(
                <div className='div-btns'>
                    <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
                </div>
            )
        } 
        else if(global?.user.rol === rolesNum.administrativo 
            || global?.user.rol === rolesNum.admin 
            && order?.state === 'Pendiente') {
            return(
                <div className='div-btns'>
                    <button className='btn-accept' onClick={() => global.orderAproveFn(order ? order.order_id : 0)}>APROBAR</button>
                    <button className='btn-negative' onClick={() => global.orderRejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                </div>
            )
        }
        else if(global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin) {
            return(
                <div className='div-btns'>
                    <button className='btn-neutral' onClick={() => global.orderArchFn(order? order.order_id : 0)}>ARCHIVAR</button>
                </div>
            ) 
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
            <hr color='#3399ff' className='hr-line'/>
            {dataDisplay()}
            {btnDisplay()}

        </div>
    )
}