import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IPedido, rolesNum } from '../../Utils/Interfaces'
import "./Pagina.css"
import dateParser from '../../Utils/dateParser'
import { useNavigate } from 'react-router-dom'
const use_logs = import.meta.env.VITE_USE_LOGS
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function PaginaPedidos () {

    const navigator = useNavigate()
    const global = useContext(GlobalContext)
    const [fpedidos, setFpedidos] = useState<IPedido[]>([])
    const [cco, setCco] = useState(0)
    const [nro, setNro] = useState('')
    const [req, setReq] = useState('')
    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')

    useEffect(() => {
        if(!global?.login) global?.sessionFn()
    },[])
    useEffect(() => {
        setTimeout(() => {
            if(global){
                if(global.pedidos.length === 0) global?.pedidosFn( global.user.rol)
                if(global.ccos.length === 0 ) global.ccosFn()
            }
        }, waitTime);
    },[global?.user])

    
    useEffect(() => {
        if(global?.pedidos) {
            setFpedidos(global?.pedidos)
        }
    },[global?.pedidos])
    

    const filterArray = () => {
        if(global?.pedidos){
            let array = global?.pedidos
            if(nro){
                array = array?.filter(a => a.numero === nro)
                if(use_logs === "1") console.log("nro "+nro,array)
            }
            else {
                if(cco){
                    array = array.filter(a => a.service_id === cco)
                    if(use_logs === "1") console.log('cco '+cco,array)
                }
                if(req) {
                    array = array.filter(a => a.requester === req)
                    if(use_logs === "1") console.log('req '+req,array)
                }
                if(dateStart) {
                    const date = new Date(dateStart)
                    array = array.filter(a => new Date(a.date_requested).getTime() >= date.getTime())
                    if(use_logs === "1") console.log('date start ',date.getTime())

                }
                if(dateEnd) {
                    const date = new Date(dateEnd)
                    array = array.filter(a => new Date(a.date_requested).getTime() <= date.getTime())
                    if(use_logs === "1") console.log('date end ',date)  
                }
            }
            if(use_logs === "1") console.log('ARRAY ==',array)
            setFpedidos(array)
            setDateEnd('')
            setDateStart('')
            setCco(0)
            setNro('')
            setReq('')

        }
    }

    const displayLoading = () => {
        return (<h3 className='title-Homepage'>Cargando...</h3>)
    }

    const displayDate = (date: string): string => {
        const d = dateParser(date)
        return d.day + '/'+d.month+'/'+d.year
    }

    const displayPedidos = () => (
        fpedidos.map((p) => {
            return(
                <div key={p.numero} className='pedido-component' 
                onClick={() => navigator('/pedidos/'+p.numero)}>
                    <h5>{"Nro: "+p.numero}</h5>
                    <h5>{displayDate(p.date_requested)}</h5>
                    <h5>{p.state}</h5>
                </div>
            )
        })
    )

    const ccoSearch = (): Array<string> => {
        const ccoSet = new Set<string>(global?.ccos.map(p => p.service_id+'-'+p.service_des))
        const arr = Array.from(ccoSet)
        return arr
    }
    const requesterSearch = (): Array<string> => {
        const reqSet = new Set<string>(global?.pedidos.map(p => p.requester))
        const arr = Array.from(reqSet)
        return arr
    }

    return(
        <div >
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <div className='div-pedidos'>
                <div className='div-header-pedidos'>
                    <button className='btn-small-logout' onClick={() => global?.logoutFn()}>
                        Cerrar Sesion
                    </button>
                    <h1 className='title-Homepage' >
                        Pedidos
                    </h1>
                    <button className='btn-small-logout' 
                    disabled={global?.user.rol === rolesNum.admin ? false : true}
                    onClick={() => navigator('/admin')}>
                        Admin
                    </button>
                </div>
            </div>
            <hr color='#3399ff' className='hr-line'/>
            <button className='btn-big' onClick={() => navigator('/add')}>
                Nuevo Pedido
            </button>
            <hr color='#3399ff' className='hr-line'/>
            <div className='div-filter'>
                <div>
                    <h5 className='filter-sub'>Nro Pedido</h5>
                    <input type='number' id='nro_pedido' className='textfield-search'
                    value={nro} onChange={e => setNro(e.target.value)}/>
                </div>
                <div>
                    <h5 className='filter-sub'>CCO</h5>
                    <select defaultValue={''} disabled={nro ? true : false}
                    value={cco} onChange={(e) => setCco(parseInt(e.target.value))} className='select-small'>
                        <option value={''}>---</option>
                        {
                            ccoSearch().map((cco) => (
                                <option key={cco} value={cco}>{cco}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <h5 className='filter-sub'>Solicitante</h5>
                    <select defaultValue={''} disabled={nro ||  global?.user.rol === rolesNum.encargado ? true : false}
                    value={req} onChange={(e) => setReq(e.target.value)} className='select-small'>
                        <option value={''}>---</option>
                        {
                            requesterSearch().map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <h5 className='filter-sub'>Fecha de inicio y Final</h5>
                    <input disabled={nro ? true : false} 
                    type='date' id='date_start' className='date-input'
                    value={dateStart} onChange={e => setDateStart(e.target.value)}/>
                    <a> - </a>
                    <input disabled={nro ? true : false} 
                    type='date' id='date_end' className='date-input'
                    value={dateEnd} onChange={e => setDateEnd(e.target.value)}/>
                </div>
                <button className='btn-small-logout' onClick={() => filterArray()}>
                    Filtrar
                </button>
            </div>
            <div className='div-list'>
                {
                global?.pedidos.length && global?.pedidos.length >= 0 ? displayPedidos() : displayLoading()
                }
            </div>
        </div>
    )
}