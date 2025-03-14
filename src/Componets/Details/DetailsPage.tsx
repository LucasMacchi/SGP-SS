import './Details.css'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IPedido } from '../../Utils/Interfaces'
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
                if(p.numero === parseInt(id)) {
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
        if(global?.user.rol === 2 && order?.state === 'Pendiente'){
            return(
                <div className='div-btns'>
                    <button className='btn-neutral'>Editar</button>
                    <button className='btn-negative'>Cancelar</button>
                </div>
            )
        }
        else if (global?.user.rol === 2 && order?.state === 'Aprobado') {
            return(
                <div className='div-btns'>
                    <button className='btn-accept'>RECIBIDO</button>
                </div>
            )
        }
        else if (global?.user.rol === 2) {
            return(
                <div className='div-btns'>
                    <button className='btn-neutral'>REPETIR</button>
                </div>
            )
        } 
        else if(global?.user.rol === 1 || global?.user.rol === 0 && order?.state === 'Pendiente') {
            return(
                <div className='div-btns'>
                    <button className='btn-accept'>Aprobar</button>
                    <button className='btn-negative'>Rechazar</button>
                </div>
            )
        }
        else if(global?.user.rol === 1 || global?.user.rol === 0) {
            return(
                <div className='div-btns'>
                    <button className='btn-accept'>Archivar</button>
                    <button className='btn-negative'>Rechazar</button>
                </div>
            ) 
        }
        else navigator('/')
    }
    const dataDisplay = () => {
        if(order) {
            return(
                <div className='data-div'>
                    <h3>Estado del Pedido: </h3>
                    <h4>{order.state}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>CCO: </h3>
                    <h4>{order.cco}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Solicitante: </h3>
                    <h4>{order.requester}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Fecha:</h3>
                    <h4>{"Ordenado: "+order.date_delivered}</h4>
                    <h4>{order.date_aproved ? 'Aprobado: '+order.date_aproved : 'Aprobacion pendiente'}</h4>
                    <h4>{"Recibido: "+order.date_delivered}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <table>
                        <tbody>
                            <tr>
                                <th>Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                            {order.insumos.map((i) => (
                                <tr key={i.name}>
                                    <th>{i.name}</th>
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