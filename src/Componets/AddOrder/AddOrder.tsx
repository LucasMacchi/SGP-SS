import "./AddOrder.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useParams } from 'react-router-dom'
import { IInsumo, IAddPedido, IToken, IServicio } from '../../Utils/Interfaces'
import clientSearcher from "../../Utils/clientSearcher"
import { jwtDecode } from "jwt-decode"
import Header from "../Header/Header"
import clientesReturner from "../../Utils/clientesReturner"
import departamentoReturner from "../../Utils/departamentoReturner"

const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function AddOrder () {
    const global = useContext(GlobalContext)
    const params = useParams()
    const id = params.orderId
    const [btn, setBtn] = useState(true)
    const [searchIns, setSearchIns] = useState('')
    const [searchServ, setSearchServ] = useState('')
    const [filterClient, setFilterClient] = useState(0)
    const [filterDepartment, setDepartment] = useState('')
    const [filterIns, setFilterIns] = useState<string[]>([])
    const [filterServ, setFilterServ] = useState<IServicio[]>([])
    const [insumos, setInsumos] = useState('')
    const [insumos2, setInsumos2] = useState('')
    const [amount, setAmount] = useState(0)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoad] = useState(false)
    const [custom, setCustom] = useState(false)
    const [customIn, setCustomIn] = useState(false)
    const [service, setService] = useState('')
    const [newOrder, setOrder] = useState<IAddPedido>({
        requester: '',
        service_id: 0,
        client_id: 0,
        insumos: [],
        user_id: 0,
    })

    useEffect(() => {
        if(global) {
            if(global.insumos.length === 0) global?.insumosFn()
            if(global.ccos.length === 0) {
                global?.ccosFn()
            }
            setTimeout(() => {
                setShowForm(true)
            }, waitTime);
            if(id) setOrder(global.pedidoDetail)
            else global?.uniqPedido(0,true)
        }
    },[])

    useEffect(() => {
        setService('')
    },[custom])

    useEffect(() => {
        setInsumos2('')
    },[customIn])


    const handleData = (data: string, prop: string) => {
        setOrder({
            ...newOrder,
            [prop]: data
        })

    }

    useEffect(() => {
        if((newOrder.service_id && newOrder.insumos.length > 0) || (newOrder.insumos.length > 0 && service && custom)){
            setBtn(false)
        }
        else setBtn(true)
    },[newOrder, service])

    useEffect(() => {
        let arr = global?.ccos
        if(arr) {
            if(searchServ.length > 2){
                arr = arr.filter(c => c.service_des.toUpperCase().includes(searchServ.toUpperCase()))

            }
            if(filterClient > 0) {
                arr = arr.filter(c => c.client_id === filterClient)
            }
            if(filterDepartment) {
                arr = arr.filter(c => c.localidad === filterDepartment)
            }
            setFilterServ(arr)
        }
    },[searchServ, filterClient, filterDepartment, global?.ccos])

    useEffect(() => {
        if(searchIns.length > 2){
            const filtered = global?.insumos.filter(c => c.toUpperCase().includes(searchIns.toUpperCase()))
            if(filtered) setFilterIns(filtered)
        }
    },[searchIns])

    const addIns = () => {
        if(amount && insumos2) {
            const formatedIn = '----'+insumos2
            const insu: IInsumo = {insumo_des: formatedIn, amount: amount ? amount : 1}
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

    const saveOrder = () => {
        if(confirm('¿Quieres guardar el pedido? Podria reescribir otro guardado.')) {
            localStorage.setItem("savedOrder", JSON.stringify(newOrder));
            alert('Pedido guardado.')
        }
        
    }

    const loadOrder = () => {
        const data = localStorage.getItem("savedOrder");
        if(data && confirm('¿Quieres cargar el pedido? Esto remplazara el pedido actual y eliminara el guardado.')) {
            setOrder(JSON.parse(data))
            localStorage.removeItem('savedOrder');
            alert('Pedido cargado.')

        }
        else{
            alert('No existe un pedido guardado.')
        }
    }

    const createOrder = async () => {
        setLoad(true)
        const token = localStorage.getItem('jwToken')
        const dataUser: IToken = jwtDecode(token ?? "")
        if(service && custom) {
            newOrder.client_id = -1
            newOrder.service_id = -1
            newOrder.prov = true
            newOrder.prov_des = service
            console.log(newOrder)
            global?.addPedido(dataUser.usuario_id, dataUser.user, newOrder.service_id, clientSearcher(global.ccos, newOrder.service_id), newOrder.insumos, newOrder.prov, newOrder.prov_des)
        }
        else if (custom) {
            alert("Ingrese un servicio personalizado valido.")
        }
        else {
            global?.addPedido(dataUser.usuario_id, dataUser.user, newOrder.service_id, clientSearcher(global.ccos, newOrder.service_id), newOrder.insumos, false, '')
        }
    }

    const deleteInsumoRow = (index: number, insumo: string) => {
        if(confirm('¿Quiere eliminar el insumo '+insumo+ "?")){
            newOrder.insumos.splice(index, 1)
            setOrder({...newOrder})
        }
    }

    const changeAmount = (nm: number, index: number) => {
        const newA = prompt('Ingrese la nueva cantidad: ',nm.toString()) ?? nm.toString()
        if(newA && parseFloat(newA)) {
            const newAmNum: number = parseFloat(newA)
            newOrder.insumos[index].amount = newAmNum
            setOrder({...newOrder})
            return 0
        }
        else changeAmount(nm, index)
    }

    const displayCustomService = () => {
        if(custom) {
            return(
                <div className='data-div-add'>
                    <div className='data-div-add' >
                        <h6>Servicio personalizado </h6>
                        <input type="text" id='otherins' className="data-div-select" 
                        onChange={(e) => setService(e.target.value)} value={service}/>
                    </div>
                </div>
            )
        } else {
            return (
            <div className='data-div-add'>
                <h4>Centro de Costo: </h4>
                <div className='data-div-add' >
                    <h6>Busqueda</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setSearchServ(e.target.value)} value={searchServ}/>
                </div>
                <div>
                <h6>Cliente</h6>
                <select disabled={id ? true : false} defaultValue={''} value={filterClient} className="data-div-select"
                onChange={e => setFilterClient(parseInt(e.target.value))}>
                <option value={0}>---</option>
                {global?.ccos &&
                    clientesReturner(global?.ccos).map((c) => {
                        return(<option key={c.client_id} value={c.client_id}>{c.client_id+'-'+c.client_des}</option>)
                    })
                }
                </select>
                </div>
                <div>
                <h6>Departamento</h6>
                <select disabled={id ? true : false} defaultValue={''} value={filterDepartment} className="data-div-select"
                onChange={e => setDepartment(e.target.value)}>
                <option value={''}>---</option>
                {global?.ccos &&
                    departamentoReturner(global?.ccos).map((d) => {
                        return(<option key={d} value={d}>{d}</option>)
                    })
                }
                </select>
                </div>
                <div>
                <h6>Servicio</h6>
                <select disabled={id ? true : false} defaultValue={''} value={newOrder.service_id} className="data-div-select"
                onChange={e => handleData(e.target.value, 'service_id')}>
                <option value={''}>---</option>
                {
                    filterServ.map((c) => {
                        return(<option key={c.service_id} value={c.service_id}>{c.service_des}</option>)
                    })
                }
                </select>
                </div>

            </div>
            )
        }
    }

    const displayCustomInsumo = () => {
        if(customIn) {
            return(
                <div className='data-div-add'>
                <h4>Insumos: </h4>
                <div className='data-div-add' >
                    <h6>Insumo personalizado </h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setInsumos2(e.target.value)} value={insumos2}/>
                    <input type="number" step='any' id='amount' min={0}
                    value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="data-div-textfield-amount"/>
                </div>
            </div>
            )
        }
        else{
            return(
                <div className='data-div-add'>
                <h4>Insumos: </h4>
                <div className='data-div-add' >
                    <h6>Busqueda</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setSearchIns(e.target.value)} value={searchIns}/>
                </div>
                <div>
                <h6>Insumo</h6>
                <select defaultValue={''} value={insumos} className="data-div-select"
                disabled={insumos2 ? true : false}
                onChange={e => setInsumos(e.target.value)}>
                <option value={''}>---</option>
                {
                    searchIns.length > 2 ?
                    filterIns.map((i, index) => (
                        <option key={index} value={i}>{i}</option>
                    ))
                    :
                    global?.insumos.map((i, index) => (
                        <option key={index} value={i}>{i}</option>
                    ))
                }
                </select>
                <input type="number" step='any' id='amount' min={0}
                value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="data-div-textfield-amount"/>
                </div>


            </div>
            )
        }
    }

    const displayForms = () => {
        if(showForm) {
            return(
                <div className="add-form-page">
                    <div className='data-div-add-special'>
                        <h4>Servicio Especial: </h4>
                        <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)}/>
                    </div>
                    <div className='data-div-add-special'>
                        <h4>Insumo Personalizado: </h4>
                        <input type="checkbox" checked={customIn} onChange={(e) => setCustomIn(e.target.checked)}/>
                    </div>
                    {displayCustomService()}
                    {displayCustomInsumo()}
                    <div className="data-div-btn-insumo">  
                        <button className='data-add-btn-insumo' onClick={() => addIns()}>
                            Agregar
                        </button>
                    </div>
                    <h5 className='delete-text'>Para eliminar apreta en el nombre del insumo</h5>
                    <h5 className='delete-text'>Para cambiar la cantidad, aprete en el numero</h5>
                    <table >
                        <tbody>
                            <tr>
                                <th className="data-div-table-sections">Producto</th>
                                <th className="data-div-table-sections">Cantidad</th>
                            </tr>
                            {newOrder.insumos.map((i, index) => (
                                <tr  key={index} >
                                    <th className="data-div-insumo-name-row" onClick={() => deleteInsumoRow(index, i.insumo_des)}>{i.insumo_des}</th>
                                    <th className="data-div-insumo-amount-row" onClick={() => changeAmount(i.amount, index)}>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading ? <h3 className='title-Homepage'>Cargando...</h3> : 
                        <button className='btn-big-forms' disabled={btn}
                        onClick={() => createOrder()}>
                            Registrar
                        </button>
                    }

                </div>
            )
        }
        else return (<h3 className='title-Homepage'>Cargando...</h3>)
    }

    return(
        <div>
            <div className='div-header-pedidos'>
                <Header/>
            </div>
            <h1 className='title-Homepage' >
                    {'Nuevo Pedido'}
            </h1>
            <hr color='#666666' className='hr-line'/>
            <button className='btn-export-pdf' onClick={() => saveOrder()}>Guardar Pedido</button>
            <button className='btn-export-pdf' onClick={() => loadOrder()}>Cargar Pedido</button>
            <hr color='#666666' className='hr-line'/>
            {displayForms()}
        </div>
    )
}
