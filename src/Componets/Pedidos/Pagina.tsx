import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IPedido } from '../../Utils/Interfaces'
import "./Pagina.css"
import dateParser from '../../Utils/dateParser'

export default function PaginaPedidos () {

    const global = useContext(GlobalContext)
    const [fpedidos, setFpedidos] = useState<IPedido[]>([])
    const [cco, setCco] = useState('')
    const [nro, setNro] = useState(0)
    useEffect(() => {
        global?.sessionFn()
    },[])
    useEffect(() => {
        setTimeout(() => {
            global?.pedidosFn( global.user.rol)
        }, 2000);
    },[global?.login])

    useEffect(() => {
        if(global?.pedidos) {
            setFpedidos(global?.pedidos)
        }
    },[global?.pedidos])

    const displayLoading = () => {
        return (<h3 className='title-Homepage'>Cargando...</h3>)
    }

    const displayDate = (date: string): string => {
        const d = dateParser(date)
        return d.day + '/'+d.month+'/'+d.year
    }

    const displayPedidos = () => (
        fpedidos.map((p) => {
            if(nro && nro === p.numero) {
                console.log('acacaca')
                return                 (
                    <div key={p.numero} className='pedido-component'>
                        <h5>{"Nro: "+p.numero}</h5>
                        <h5>{displayDate(p.date_requested)}</h5>
                        <h5>{p.state}</h5>
                    </div>
                )
            }else{
                if(cco){
                    if(p.cco === cco){
                        return(
                            <div key={p.numero} className='pedido-component'>
                                <h5>{"Nro: "+p.numero}</h5>
                                <h5>{displayDate(p.date_requested)}</h5>
                                <h5>{p.state}</h5>
                            </div>
                        )
                    }
                }
                else{
                    return(
                        <div key={p.numero} className='pedido-component'>
                            <h5>{"Nro: "+p.numero}</h5>
                            <h5>{displayDate(p.date_requested)}</h5>
                            <h5>{p.state}</h5>
                        </div>
                    )
                }
    
            }

        })
    )

    const ccoSearch = (): Array<string> => {
        const ccoSet = new Set<string>(global?.pedidos.map(p => p.cco))
        const arr = Array.from(ccoSet)
        return arr
    }

    return(
        <div>
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <h1 className='title-Homepage' >
                Pedidos
            </h1>
            <hr color='#3399ff'/>
            <button className='btn-big'>
                Nuevo Pedido
            </button>
            <div className='div-filter'>
                <div>
                    <h5 className='filter-sub'>Nro Pedido</h5>
                    <input type='number' id='nro_pedido' size={2} className=''
                    value={nro} onChange={e => setNro(parseInt(e.target.value))}/>
                </div>
                <div>
                    <h5 className='filter-sub'>CCO</h5>
                    <select defaultValue={''} 
                    value={cco} onChange={(e) => setCco(e.target.value)} className='texfield-small'>
                        <option value={''}>---</option>
                        {
                            ccoSearch().map((cco) => (
                                <option key={cco} value={cco}>{cco}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className='div-list'>
                {
                global?.pedidos.length && global?.pedidos.length >= 0 ? displayPedidos() : displayLoading()
                }
            </div>
        </div>
    )
}