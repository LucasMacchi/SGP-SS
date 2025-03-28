import "./AddOrder.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IInsumo, IAddPedido, IToken } from '../../Utils/Interfaces'
import clientSearcher from "../../Utils/clientSearcher"
import { jwtDecode } from "jwt-decode"

//const LOGS = import.meta.env.VITE_USE_LOGS
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)


export default function AddOrder () {
    const navigator = useNavigate()
    const global = useContext(GlobalContext)
    const params = useParams()
    const id = params.orderId
    const [btn, setBtn] = useState(true)
    const [insumos, setInsumos] = useState('')
    const [insumos2, setInsumos2] = useState('')
    const [amount, setAmount] = useState(0)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoad] = useState(false)
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
        if(amount && insumos2) {
            const insu: IInsumo = {insumo_des: insumos2, amount: amount ? amount : 1}
            newOrder.insumos.push(insu)
            setOrder({...newOrder})
            setAmount(0)
            setInsumos('')
        }
        else if(amount && insumos) {
            const insu: IInsumo = {insumo_des: insumos, amount: amount ? amount : 1}
            newOrder.insumos.push(insu)
            setOrder({...newOrder})
            setAmount(0)
            setInsumos('')
        }
        else alert('Error a agregar Insumo.')
    }
    const delIns = () => {
        newOrder.insumos.pop()
        setOrder({...newOrder})
    }

    const createOrder = async () => {
        setLoad(true)
        const token = localStorage.getItem('jwToken')
        const dataUser: IToken = jwtDecode(token ?? "")
        global?.addPedido(dataUser.usuario_id, dataUser.user, newOrder.service_id, clientSearcher(global.ccos, newOrder.service_id), newOrder.insumos)
        setInterval(() => {
            setLoad(false)
        }, waitTime);
    }

    const deleteInsumoRow = (index: number, insumo: string) => {
        
        if(confirm('¿Quiere eliminar el insumo '+insumo+ "?")){
            newOrder.insumos.splice(index, 1)
            setOrder({...newOrder})
        }

    }

    const changeAmount = (nm: number, index: number) => {
        const newA = prompt('Ingrese el nuevo monto: ',nm.toString())
        if(newA && parseInt(newA)) {
            console.log('aaa')
            const newAmNum: number = parseInt(newA)
            newOrder.insumos[index].amount = newAmNum
            setOrder({...newOrder})
            return 0
        }
        else changeAmount(nm, index)
    }

    const displayForms = () => {
        if(showForm) {
            return(
                <div className="add-form-page">
                    <hr color='#666666' className='hr-line'/>
                    <div className='data-div-add'>
                        <h4>Centro de Costo: </h4>
                        <select disabled={id ? true : false} defaultValue={''} value={newOrder.service_id} className="data-div-select"
                        onChange={e => handleData(e.target.value, 'service_id')}>
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
                        disabled={insumos2 ? true : false}
                        onChange={e => setInsumos(e.target.value)}>
                        <option value={''}>---</option>
                        {
                            global?.insumos.map((i, index) => (
                                <option key={index} value={i}>{i}</option>
                            ))
                        }
                        </select>
                        <input type="number" id='amount' defaultValue={0}
                        value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="data-div-textfield-amount"/>
                    </div>
                    <div className='data-div-add' >
                        <h6>Insumo personalizado </h6>
                        <input type="text" id='otherins' className="data-div-select" 
                        onChange={(e) => setInsumos2(e.target.value)} value={insumos2}/>
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
                                <tr className="data-row-insumo" key={index} >
                                    <th className="data-div-insumo-name-row" onClick={() => deleteInsumoRow(index, i.insumo_des)}>{i.insumo_des}</th>
                                    <th className="data-div-insumo-amount-row" onClick={() => changeAmount(i.amount, index)}>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading ? <h3 className='title-Homepage'>Cargando...</h3> : 
                        <button className='btn-big-forms' disabled={btn}
                        onClick={() => createOrder()}>
                            Nuevo Pedido
                        </button>
                    }

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
                <button className='btn-small-logout' onClick={() => {
                    setOrder({
                        requester: '',
                        service_id: 0,
                        client_id: 0,
                        insumos: newOrder.insumos.splice(0, newOrder.insumos.length),
                        user_id: 0
                    })
                    navigator('/pedidos')
                    }}>
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