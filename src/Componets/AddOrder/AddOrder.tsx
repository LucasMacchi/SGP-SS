import "./AddOrder.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useParams, useNavigate } from 'react-router-dom'
import { IInsumo, IAddPedido, IServicio } from '../../Utils/Interfaces'
import clientSearcher from "../../Utils/clientSearcher"
import Header from "../Header/Header"
import clientesReturner from "../../Utils/clientesReturner"
import departamentoReturner from "../../Utils/departamentoReturner"
import tokenExpireChecker from "../../Utils/tokenExpireChecker"
import serviceDescription from "../../Utils/serviceDescription"
//import sectoresPersonal from "../Details/sectores.json"
import infoMsg from "../../Utils/infoMsg"


const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function AddOrder () {
    const global = useContext(GlobalContext)
    const params = useParams()
    const id = params.orderId
    const navigator = useNavigate()
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
        usuario_id: 0,
        service_des: '',
        legajo: 0
    })

    useEffect(() => {
        if(global && !tokenExpireChecker()) {
            if(global.insCategroies.categorias.length === 0) global.getCategoriasInsumos()
            if(global.ccos.length === 0) {
                global?.ccosFn()
            }
            if(global.insumos.length === 0) global.insumosFn(false)
            setTimeout(() => {
                setShowForm(true)
            }, waitTime);
            if(id) setOrder(global.pedidoDetail)
            else global?.uniqPedido(0,true)
        } else navigator('/')
    },[])

    useEffect(() => {
        setService('')
    },[custom])

    useEffect(() => {
        setInsumos2('')
    },[customIn])

    
    const handleData = (data: string | number, prop: string) => {
        setOrder({
            ...newOrder,
            [prop]: data
        })
    }

    useEffect(() => {
      if(custom){
        if(newOrder.insumos.length === 0 || service.length < 3) setBtn(true)
        else setBtn(false)
      }
      else if(newOrder.insumos.length === 0 || !newOrder.service_id) setBtn(true)
      else setBtn(false)
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
        if(global) {
            let arr = global.insumos
            if(searchIns.length > 2){
                arr = global?.insumos.filter(c => c.toUpperCase().includes(searchIns.toUpperCase()))
            }
            setFilterIns(arr)
        }

    },[searchIns, global?.insumos])

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
        newOrder.prov = false
        newOrder.prov_des = ``
        if(service && custom) {
            newOrder.client_id = -1
            newOrder.service_id = -1
            newOrder.prov = true
            newOrder.prov_des = service
            newOrder.service_des = ``
        }
        if(global){
          newOrder.service_des = serviceDescription(global.ccos, newOrder.service_id)
          newOrder.client_id = clientSearcher(global.ccos, newOrder.service_id)
          setTimeout(() => {
              console.log('aca')
              global?.addPedido(newOrder)
          }, 1000);
          
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
                <div className='data-div-add-border'>
                    <h4>Centro de Costo: </h4>
                    <div className='data-div-add-special'>
                        <h4>Servicio Especial: </h4>
                        <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)}/>
                    </div>
                    <div className='data-div-add' >
                        <h6>Servicio personalizado </h6>
                        <input type="text" id='otherins' className="data-div-select" 
                        onChange={(e) => setService(e.target.value)} value={service}/>
                    </div>
                </div>
            )
        } else {
            return (
            <div className='data-div-add-border'>
                <h4>Centro de Costo: </h4>
                <div className='data-div-add-special'>
                    <h4>Servicio Especial: </h4>
                    <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)}/>
                </div>
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
                <button className="info-popup" onClick={() => infoMsg(2)}>?</button>
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
                <h6>Servicio - Obligatorio</h6>
                <select disabled={id ? true : false} defaultValue={''} value={newOrder.service_id} className="data-div-select"
                onChange={e => handleData(parseInt(e.target.value), 'service_id')}>
                <option value={''}>---</option>
                {
                    filterServ.map((c) => {
                        return(<option key={c.service_id} value={c.service_id}>{c.service_des}</option>)
                    })
                }
                </select>
                <button className="info-popup" onClick={() => infoMsg(1)}>?</button>
                </div>

            </div>
            )
        }
    }

    const displayCustomInsumo = () => {
        if(customIn) {
            return(
                <div className='data-div-add-border'>
                <h4>Insumos: </h4>
                <div className='data-div-add-special'>
                    <h4>Insumo Personalizado: </h4>
                    <input type="checkbox" checked={customIn} onChange={(e) => setCustomIn(e.target.checked)}/>
                </div>
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
                <div className='data-div-add-border'>
                <h4>Insumos: </h4>
                <div className='data-div-add-special'>
                    <h4>Insumo Personalizado: </h4>
                    <input type="checkbox" checked={customIn} onChange={(e) => setCustomIn(e.target.checked)}/>
                </div>
                <div className='data-div-add' >
                    <h6>Busqueda</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setSearchIns(e.target.value)} value={searchIns}/>
                    <button className="info-popup" onClick={() => infoMsg(5)}>?</button>
                </div>
                <div>
                <h6>Insumo - {filterIns.length > 0 ? filterIns.length + " Encontrados" : 0 + " Encontrados"}</h6>
                <select defaultValue={''} value={insumos} className="data-div-select"
                onChange={e => setInsumos(e.target.value)}>
                <option value={''}>---</option>
                {
                    filterIns.map((i, index) => (
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
                                <th className="data-div-insumo-number">Nro</th>
                                <th className="data-div-table-sections">Producto</th>
                                <th className="data-div-table-sections">Cantidad</th>
                            </tr>
                            {newOrder.insumos.map((i, index) => (
                                <tr  key={index} >
                                    <th className="data-div-insumo-number">{index + 1}</th>
                                    <th className="data-div-insumo-name-row" onClick={() => deleteInsumoRow(index, i.insumo_des)}>{i.insumo_des}</th>
                                    <th className="data-div-insumo-amount-row" onClick={() => changeAmount(i.amount, index)}>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading ? <h3 className='title-Homepage'>Cargando...</h3> : 
                        <button className={btn ? 'btn-big-forms-disable' : 'btn-big-forms'} disabled={btn}
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
            <button className="info-popup" onClick={() => infoMsg(3)}>?</button>
            <hr color='#666666' className='hr-line'/>
            {displayForms()}
        </div>
    )
}
