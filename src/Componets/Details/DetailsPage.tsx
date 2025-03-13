
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

    const dataDisplay = () => {
        if(order) {
            return(
                <h4>{order.date_delivered}</h4>
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
                <div/>
            </div>
            <hr color='#3399ff' className='hr-line'/>
            {dataDisplay()}
        </div>
    )
}