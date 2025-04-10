import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IInsumo, IPedido, IpedidoDataPDF, rolesNum } from '../../Utils/Interfaces'
import "./Pagina.css"
import dateParser from '../../Utils/dateParser'
import { useNavigate } from 'react-router-dom'
import lastMonth from '../../Utils/lastMonth'
import PedidosDocument from '../pdfs/multiPedidos'
import Header from '../Header/Header'
import { pdf } from '@react-pdf/renderer'
import saveAs from 'file-saver'
const use_logs = import.meta.env.VITE_USE_LOGS
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function PaginaPedidos () {

    const navigator = useNavigate()
    const global = useContext(GlobalContext)
    const [fpedidos, setFpedidos] = useState<IPedido[]>([])
    const [cco, setCco] = useState(0)
    const [client, setClient] = useState(0)
    const [nro, setNro] = useState('')
    const [req, setReq] = useState('')
    const [state, setState] = useState('')
    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')
    
    useEffect(() => {
        if(!global?.login) global?.sessionFn()
            setDateStart(lastMonth())
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
            const date = new Date(lastMonth())
            const arr = global.pedidos.filter(a => new Date(a.date_requested).getTime() >= date.getTime())
            if(global.user.rol === 4) {
                const arr2 = arr.filter(p => p.state !== 'Cancelado' && p.state !== 'Rechazado')
                setFpedidos(arr2)
            }
            else {
                setFpedidos(arr)
            }

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
                if(client){
                    array = array.filter(a => a.client_id === client)
                }
                if(state) {
                    array = array.filter(a => a.state === state)
                }
                    
            }
            if(use_logs === "1") console.log('ARRAY ==',array)
            setFpedidos(array)
            setDateEnd('')
            setDateStart('')
            setCco(0)
            setNro('')
            setReq('')
            setClient(0)

        }
    }

    const displayLoading = () => {
        return (<h3 className='title-Homepage'>Cargando...</h3>)
    }

    const displayDate = (date: string): string => {
        const d = dateParser(date)
        return d.day + '/'+d.month+'/'+d.year
    }

    const colorChange = (state: string): string => {
        switch(state) {
            case 'Pendiente':
                return 'pedido-component-yellow'
            case 'Aprobado':
                return 'pedido-component-green'
            case 'Cancelado':
                return 'pedido-component-red'
            case 'Rechazado':
                return 'pedido-component-red'
            case 'Listo':
                return 'pedido-component-green-black'
            case 'Entregado':
                return 'pedido-component-neutral'
            case 'Problemas':
                return 'pedido-componen-problem'
            default:
                return 'pedido-component'
        }
    }
    const displayPedidos = () => (
        fpedidos.map((p) => {
            return(
                <div key={p.numero} 
                className={colorChange(p.state)} 
                onClick={() => navigator('/pedidos/'+p.numero)}>
                    <h5>{"Nro: "+p.numero}</h5>
                    <h5>{displayDate(p.date_requested)}</h5>
                    <h5>{p.state}</h5>
                </div>
            )
        })
    )
    const requesterSearch = (): Array<string> => {
        const reqSet = new Set<string>(global?.pedidos.map(p => p.requester))
        const arr = Array.from(reqSet)
        return arr
    }
    const stateSearch = () => {
        const stSet = new Set<string>(global?.pedidos.map(p => p.state))
        const arr = Array.from(stSet)
        return arr
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
    const imprimirPedidos = async () => {
        if(confirm('¿Quieres imprimir los pedidos?')) {
            const newArray = fpedidos.map((order) => {
                const serv = servData(order?.service_id)
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
                return pedido
            })
            const blob: Blob = await pdf(<PedidosDocument pedidos={newArray}/>).toBlob()
            saveAs(blob, 'SGP-Pedidos.pdf')
        }
    }

    const setClientsSelect = () => {
        let aux: number = 0
        const data = global?.ccos.map((s) => {
            if(!aux) {
                aux = s.client_id
                return {cliente_id: s.client_id, cliente_des: s.client_des}
            }
            else{
                if(s.client_id !== aux) {
                    aux = s.client_id
                    return {cliente_id: s.client_id, cliente_des: s.client_des}
                }
            }
        })
        return data?.filter(s => s)
    }

    return(
        <div >
            <div className='div-pedidos'>
                <Header />
            </div>
            <hr color='#3399ff' className='hr-line'/>
            <div className='div-filter'>
                <div>
                    <h5 className='filter-sub'>Nro Pedido</h5>
                    <input type='number' id='nro_pedido' className='textfield-search' min={0}
                    value={nro} onChange={e => setNro(e.target.value)}/>
                </div>
                <div>
                    <h5 className='filter-sub'>CCO</h5>
                    <select defaultValue={''} disabled={parseInt(nro) ? true : false}
                    value={cco} onChange={(e) => setCco(parseInt(e.target.value))} className='select-small-cco'>
                        <option value={''}>---</option>
                        {
                            global?.ccos.map((cco) => (
                                <option key={cco.service_id} value={cco.service_id}>{cco.service_id+'-'+cco.service_des}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <h5 className='filter-sub'>Cliente</h5>
                    <select defaultValue={''} disabled={parseInt(nro) ? true : false}
                    value={client} onChange={(e) => setClient(parseInt(e.target.value))} className='select-small-cco'>
                        <option value={''}>---</option>
                        {
                            setClientsSelect()?.map((cco) => (
                                <option key={cco?.cliente_id} value={cco?.cliente_id}>{cco?.cliente_id+'-'+cco?.cliente_des}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <h5 className='filter-sub'>Solicitante</h5>
                    <select defaultValue={''} disabled={parseInt(nro) ||  global?.user.rol === rolesNum.encargado ? true : false}
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
                    <h5 className='filter-sub'>Estado</h5>
                    <select defaultValue={''} disabled={parseInt(nro) ||  global?.user.rol === rolesNum.encargado ? true : false}
                    value={state} onChange={(e) => setState(e.target.value)} className='select-small'>
                        <option value={''}>---</option>
                        {
                            stateSearch().map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <h5 className='filter-sub'>Fecha de inicio y Final</h5>
                    <input disabled={parseInt(nro) ? true : false} 
                    type='date' id='date_start' className='date-input'
                    value={dateStart} onChange={e => setDateStart(e.target.value)}/>
                    <a> - </a>
                    <input disabled={parseInt(nro) ? true : false} 
                    type='date' id='date_end' className='date-input'
                    value={dateEnd} onChange={e => setDateEnd(e.target.value)}/>
                </div>
                <button className='btn-small-logout' onClick={() => imprimirPedidos()}>
                    Imprimir
                </button>
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