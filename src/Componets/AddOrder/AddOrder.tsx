import "./AddOrder.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { IPedido, IInsumo } from '../../Utils/Interfaces'

//const use_logs = import.meta.env.VITE_USE_LOGS
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)


export default function AddOrder () {
    const navigator = useNavigate()
    const global = useContext(GlobalContext)
    const [btn, setBtn] = useState(true)
    const [insumos, setInsumos] = useState('')
    const [amount, setAmount] = useState(0)
    const [showForm, setShowForm] = useState(false)
    const [newOrder, setOrder] = useState<IPedido>({
        requester: '',
        date_requested: '',
        cco: '',
        insumos: [],
        state: "Pendiente"
    })

    useEffect(() => {
        if(global) {
            if(global.insumos.length === 0) global?.insumosFn()
            if(global.ccos.length === 0) global?.ccosFn()
            setTimeout(() => {
                setShowForm(true)
            }, waitTime);
        }
    },[])

    const handleData = (data: string, prop: string) => {
        setOrder({
            ...newOrder,
            [prop]: data
        })
    }

    useEffect(() => {
        if(newOrder.cco && newOrder.date_requested && newOrder.insumos.length > 0){
            setBtn(false)
        }
        else setBtn(true)
    },[newOrder])

    const addIns = () => {
        if(amount && insumos) {
            const insu: IInsumo = {name: insumos, amount: amount ? amount : 1}
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
                    <div className='data-div-add'>
                        <h4>Fecha de Entrega: </h4>
                        <input type='date' id='date_start' className='data-div-add-date'
                        value={newOrder.date_requested} onChange={e => handleData(e.target.value, 'date_requested')}/>
                    </div>
                    <hr color='#666666' className='hr-line'/>
                    <div className='data-div-add'>
                        <h4>Centro de Costo: </h4>
                        <select defaultValue={''} value={newOrder.cco} className="data-div-select"
                        onChange={e => handleData(e.target.value, 'cco')}>
                        <option value={''}>---</option>
                        {
                            global?.ccos.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))
                        }
                        </select>
                    </div>
                    <hr color='#666666' className='hr-line'/>
                    <div className='data-div-add'>
                        <h4>Insumos: </h4>
                        <select defaultValue={''} value={insumos} className="data-div-select"
                        onChange={e => setInsumos(e.target.value)}>
                        <option value={''}>---</option>
                        {
                            global?.insumos.map((c) => (
                                <option key={c} value={c}>{c}</option>
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
                                    <th>{i.name}</th>
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