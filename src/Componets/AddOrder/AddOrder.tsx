import "./AddOrder.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IPedido, IInsumo, IAddPedido } from '../../Utils/Interfaces'

const LOGS = import.meta.env.VITE_USE_LOGS
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)


export default function AddOrder () {
    const navigator = useNavigate()
    const global = useContext(GlobalContext)
    const params = useParams()
    const id = params.orderId
    const [btn, setBtn] = useState(true)
    const [insumos, setInsumos] = useState('')
    const [amount, setAmount] = useState(0)
    const [showForm, setShowForm] = useState(false)
    const [newOrder, setOrder] = useState<IAddPedido>({
        requester: '',
        service_id: 0,
        client_id: 0,
        insumos: [],
        user_id: 0
    })

    useEffect(() => {
        if(global) {
            if(global.insumos.length === 0) global?.insumosFn()
            if(global.ccos.length === 0) global?.ccosFn()
            if(global.pedidos.length === 0 ) global.pedidosFn(global.user.rol)
            setTimeout(() => {
                setShowForm(true)
            }, waitTime);
            if(id){
                global.uniqPedido(id, global.pedidos, false)
            }
        }
    },[])

    useEffect(() => {
        if(global?.pedidoDetail) setOrder(global?.pedidoDetail)
    },[global?.pedidoDetail])

    const handleData = (data: string, prop: string) => {
        setOrder({
            ...newOrder,
            [prop]: data
        })
    }

    useEffect(() => {
        if(newOrder.service_id && newOrder.insumos.length > 0){
            setBtn(false)
        }
        else setBtn(true)
    },[newOrder])

    const addIns = () => {
        if(amount && insumos) {
            const insu: IInsumo = {insumo_des: insumos, amount: amount ? amount : 1}
            newOrder.insumos.push(insu)
            setOrder({...newOrder})
            setAmount(0)
            setInsumos('')
        }
    }
    const delIns = () => {
        newOrder.insumos.pop()
        setOrder({...newOrder})
    }

    const displayForms = () => {
        if(showForm) {
            return(
                <div className="add-form-page">
                    <hr color='#666666' className='hr-line'/>
                    <div className='data-div-add'>
                        <h4>Centro de Costo: </h4>
                        <select defaultValue={''} value={newOrder.service_id} className="data-div-select"
                        onChange={e => handleData(e.target.value, 'cco')}>
                        <option value={''}>---</option>
                        {
                            global?.ccos.map((c) => (
                                <option key={c.service_id} value={c.service_id}>{c.service_des}</option>
                            ))
                        }
                        </select>
                    </div>
                    <div className='data-div-add'>
                        <h4>Insumos: </h4>
                        <select defaultValue={''} value={insumos} className="data-div-select"
                        onChange={e => setInsumos(e.target.value)}>
                        <option value={''}>---</option>
                        {
                            global?.insumos.map((i, index) => (
                                <option key={index} value={i.insumo_des}>{i.insumo_des}</option>
                            ))
                        }
                        </select>
                        <input type="number" id='amount' defaultValue={0}
                        value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="data-div-texfield"/>
                    </div>
                    <div className="data-div-btn-insumo">
                        <button className='data-del-btn-insumo' onClick={() => delIns()}>
                            Eliminar
                        </button>   
                        <button className='data-add-btn-insumo' onClick={() => addIns()}>
                            Agregar
                        </button>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                            </tr>
                            {newOrder.insumos.map((i, index) => (
                                <tr key={index}>
                                    <th>{i.insumo_des}</th>
                                    <th>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='btn-big-forms' disabled={btn}
                    onClick={() => console.log('asdas')}>
                        Nuevo Pedido
                    </button>
                </div>
            )
        }
        else return (<h3 className='title-Homepage'>Cargando...</h3>)
    }

    return(
        <div>
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <div className='div-header-pedidos'>
                <button className='btn-small-logout' onClick={() => navigator('/pedidos')}>
                    Volver
                </button>
                <h1 className='title-Homepage' >
                    {'Nuevo Pedido'}
                </h1>
            </div>
            <hr color='#666666' className='hr-line'/>
            {displayForms()}
        </div>
    )
}