import { useContext, useEffect, useState } from "react"
import Header from "../Header/Header"
import { GlobalContext } from "../../Context/GlobalContext"
import { ICompra, ICompraDto, IInsumoComp, IinsumoCompra, rolesNum } from "../../Utils/Interfaces"

export default function Compras () {
    
    const global = useContext(GlobalContext)
    const [display, setDisplay] = useState(0)
    const [custom, setCustom] = useState(false)
    const [areas, setAreas] = useState<string[]>([])
    const [insumosComp, setInsumosComp] = useState<IInsumoComp[]>([])
    const [filteredIns, setFilteredIns] = useState<IInsumoComp[]>([])
    const [search, setSearch] = useState("")
    const [nro, setNro] = useState("")
    const [compra, setCompra] = useState<ICompraDto>({
        area: '',
        tipo: '',
        descripcion: '',
        lugar: '',
        fullname: '',
        compras: [],
        proveedor: '',
        date: ""
    })
    const [insumo, setInsumo] = useState<IinsumoCompra>({
        descripcion: '',
        cantidad: 0
    })

    useEffect(() => {
        if(global) {
            if(global.login === false) global?.sessionFn()
            global.getInsumosComplete().then(ins => setInsumosComp(ins))
            global.getAreasFn().then(ars => setAreas(ars))
        }

    },[])

    useEffect(() => {
        setCompra({area: '',tipo: '',descripcion: '',lugar: '',fullname: '',
            compras: [],proveedor: ''})
        setInsumo({descripcion: '', cantidad: 0})
        setNro("")
        if(display === 2) {
            if(global?.user.rol !== rolesNum.admin && global?.user.rol !== rolesNum.administrativo) {
                global?.getAllCompras(true, global.user.last_name+" "+global.user.first_name) 
            }
            else {
               global?.getAllCompras(true) 
            }
        }
        else if(display === 3) {
            if(global?.user.rol !== rolesNum.admin && global?.user.rol !== rolesNum.administrativo) {
                global?.getAllCompras(false, global.user.last_name+" "+global.user.first_name) 
            }
            else {
               global?.getAllCompras(false) 
            }
        }

    },[display])

    useEffect(() => {
        if(global) {
            let arr: IInsumoComp[] = insumosComp
            if(search.length>3) {
                arr = arr.filter(ins => ins.descripcion.toLowerCase().includes(search.toLowerCase()))
            }
            if(compra.area === "Limpieza"){
                arr = arr.filter(ins => ins.categoria === "Limpieza")
            }
            if(compra.area === "Seguridad"){
                arr = arr.filter(ins => ins.categoria === "Seguridad")
            }
            if(compra.area === "Racionamiento"){
                arr = arr.filter(ins => ins.categoria === "Racionamiento")
            }
            if(compra.area === "Mantenimiento"){
                arr = arr.filter(ins => ins.categoria === "Mantenimiento")
            }
            if(compra.tipo === "Indumentaria"){
                arr = arr.filter(ins => ins.rubro === "Indumentar")
            }
            setFilteredIns(arr)
        }

    },[insumosComp,search,compra.area, compra.tipo])

    useEffect(() => {
        setCustom(true)
        if(compra.tipo === "Insumo" || compra.tipo === "Indumentaria") {
            setCustom(false)
        }
    },[compra.tipo])

    const addInsumo = () => {
        if(insumo.cantidad && insumo.descripcion.length > 3){
            compra.compras.push(insumo)
            setInsumo({descripcion: '',cantidad: 0})
        }
        else {
            alert("Ingrese una descripcion mas larga y una cantidad")
        }
    }

    const deleteInsumo = (index: number) => {
        if(confirm("Quieres eliminar el insumo/servicio?")) {
            console.log("INDEX ",index)
            compra.compras.splice(index,1)
            setCompra({...compra})
        }
    }

    const registrarCompra = () => {
        if(compra.area.length>0 && compra.tipo.length>0 && compra.lugar.length>0 && 
            compra.compras.length >0 && global){
            if(compra.proveedor.length>0) compra.proveedor = "A eleccion"
            compra.fullname = global.user.last_name+" "+global.user.first_name
            global.registerCompra(compra)

            setCompra({area: '',tipo: '',descripcion: '',lugar: '',fullname: '',
            compras: [],proveedor: '', date: ""})
            setInsumo({descripcion: '', cantidad: 0})
        }
        else {
            console.log(compra, global?.user)
            alert("Faltan datos para registrar la compra.")
        }
    }

    const descripcionChange = () => {
        if(!custom) {
            return(
                <div>
                    <h5 style={{margin: "2px"}}>Eliga el insumo: </h5>
                    <div>
                        <label htmlFor="">Insumo Personalizado</label>
                        <input type="checkbox" onChange={(e) => setCustom(e.target.checked )} checked={custom}/>
                    </div>
                    <div>
                        <label htmlFor="">Buscar: </label>
                        <input type='text' className='textfield-search' style={{width: "100px"}}
                        value={search} onChange={e => setSearch(e.target.value)}/>
                    </div> 
                    <select defaultValue={''} value={insumo.descripcion} className="data-div-select"
                    style={{width: "280px"}}
                    onChange={e => setInsumo({...insumo, descripcion: e.target.value})}>
                    <option value={''}>---</option>
                    {
                        filteredIns.map((i, index) => (
                            <option key={index} value={i.descripcion}>{i.descripcion}</option>
                        ))
                    }
                    </select>
                </div>
            )
        }
        else {
            return(
                <div>
                    <h5 style={{margin: "2px"}}>Descripcion: </h5>
                    {compra.tipo === "Insumo" && 
                    <div>
                        <label htmlFor="">Insumo Personalizado</label>
                        <input type="checkbox" onChange={(e) => setCustom(e.target.checked )} checked={custom}/>
                    </div>
                    }
                    <input type='text' className='textfield-search' style={{width: "280px"}}
                    value={insumo.descripcion} onChange={e => setInsumo({...insumo, descripcion: e.target.value})}/>
                </div>
            )
        }
    }

    const colorCheck = (compra: ICompra): string => {
        if(compra.aprobado) {
            return "#32CD32"
        }
        else if(compra.anulado) {
            return "#FF0000"
        }
        else return "white"
    }

    const displayCompras = () => {
        
        if(display === 1) {
            return(
                <div>
                    <hr color='#3399ff' className='hr-line'/>
                    <div className='data-div-add'>
                        <h5 style={{margin: "2px"}}>Area*: </h5>
                        <select name="area" className='filter-sub' value={compra.area}
                        onChange={(e) => setCompra({...compra, area: e.target.value})}>
                            <option value={""}>---</option>
                            {areas.map((ar) => (
                                <option value={ar} key={ar}>{ar}</option>
                            ))}
                        </select>
                    </div>
                    <div className='data-div-add'>
                        <h5 style={{margin: "2px"}}>Fecha: </h5>
                        <input type='date' id='date_start' className='date-input'
                        value={compra.date} onChange={e => setCompra({...compra, date: e.target.value})}/>
                    </div>
                    <div className='data-div-add'>
                        <h5 style={{margin: "2px"}}>Tipo*: </h5>
                        <select name="area" className='filter-sub' value={compra.tipo}
                        onChange={(e) => setCompra({...compra, tipo: e.target.value})}>
                            <option value={""}>---</option>
                            <option value={"Servicio"}>Servicio</option>
                            <option value={"Insumo"}>Insumo</option>
                            <option value={"Maquinaria"}>Maquinaria</option>
                            <option value={"Equipamiento"}>Equipamiento</option>
                            <option value={"Indumentaria"}>Indumentaria</option>
                        </select>
                    </div>
                    <div className='data-div-add'>
                        <h5 style={{margin: "2px"}}>Lugar*: </h5>
                        <input type='text' className='textfield-search'
                        value={compra.lugar} onChange={e => setCompra({...compra, lugar: e.target.value})}/>
                    </div>
                    <div className='data-div-add'>
                        <h5 style={{margin: "2px"}}>Proveedor sugerido: </h5>
                        <input type='text' className='textfield-search'
                        value={compra.proveedor} onChange={e => setCompra({...compra, proveedor: e.target.value})}/>
                    </div>
                    <div className='data-div-add'>
                        <h5>Descripcion / Motivo*: </h5>
                        <textarea value={compra.descripcion} className='texarea-details'
                        onChange={(e) => setCompra({...compra, descripcion: e.target.value})}/>
                    </div>
                    <hr color='#3399ff' className='hr-line'/>
                    <h4 className='title-Homepage'>Agregue los insumos/servicios</h4>
                    <div className='data-div-add'>
                        {descripcionChange()}
                        <h5 style={{margin: "2px"}}>Cantidad: </h5>
                        <input type='number' className='textfield-search' style={{width: "80px"}}
                        value={insumo.cantidad} onChange={e => setInsumo({...insumo, cantidad: parseInt(e.target.value)})}/>
                        <button className='btn-small-logout' style={{width: "80px"}} onClick={() => addInsumo()}>
                            Agregar
                        </button>
                    </div>
                    <div>
                        <table style={{fontSize: "small", width: "100%"}}>
                            <tbody>
                                <tr>
                                    <th style={{border: "1px solid", width: "92%"}}>Descripcion</th>
                                    <th style={{border: "1px solid", width: "8%"}}>Cant</th>
                                </tr>
                                {compra.compras.map((c,i) => (
                                <tr key={i} onClick={() => deleteInsumo(i)}>
                                    <th style={{border: "1px solid"}}>{c.descripcion}</th>
                                    <th style={{border: "1px solid"}}>{c.cantidad}</th>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <hr color='#3399ff' className='hr-line'/>
                    <button className='btn-small-logout' style={{width: "80px", margin: "20px"}} onClick={() => registrarCompra()}>
                        Registrar
                    </button>
                </div>
            )
        }
        else if(display === 2 || display === 3) {
            return(
                <div style={{width: "380px", margin: "3px"}}>
                    <table style={{fontSize: "small"}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "10%"}}>ID</th>
                                <th style={{border: "1px solid", width: "22%"}}>Area</th>
                                <th style={{border: "1px solid", width: "22%"}}>Lugar</th>
                                <th style={{border: "1px solid", width: "22%"}}>Fecha</th>
                            </tr>
                            {global?.compras.map((c) => (
                            <tr style={{backgroundColor: colorCheck(c)}} key={c.compra_id}
                            onClick={() => window.location.href = "/compras/"+c.compra_id}>
                                <th style={{border: "1px solid", width: "10%"}}>{c.nro}</th>
                                <th style={{border: "1px solid", width: "22%"}}>{c.area}</th>
                                <th style={{border: "1px solid", width: "22%"}}>{c.lugar}</th>
                                <th style={{border: "1px solid", width: "22%"}}>{c.fecha.split("T")[0]}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        else if(display === 4) {
            return (
                <div className='data-div-add'>
                    <h5 style={{margin: "2px"}}>Ingrese el Numero de Compra: </h5>
                    <input type='text' className='textfield-search'
                    value={nro} onChange={e => setNro(e.target.value)}/>
                    <button className='btn-export-pdf' onClick={() => {
                        global?.getUniqCompraNro(nro)
                        setNro("")
                    }}>Buscar</button>
                </div>
            )
        }
        else {
            return(
                <div>
                    <h4 className='title-Homepage'>Selecciona una opcion</h4>
                </div>
            )
        }
    }

    return (
        <div>
            <div>
                <Header />
                <div style={{marginBottom: "25px"}}>
                <h1 className='title-Homepage' >
                        Compras
                </h1>
                    <hr color='#3399ff' className='hr-line'/>
                    <div>
                        <select name="display" className='filter-sub'
                        onChange={(e)=>setDisplay(parseInt(e.target.value))}>
                            <option value={0}>---</option>
                            <option value={1}>Solicitar una Compra</option>
                            <option value={2}>Compras Pendientes</option>
                            <option value={3}>Compras Aprobadas o nulas</option>
                            <option value={4}>Buscar una Compra</option>
                        </select>
                    </div>
                    {displayCompras()}
                </div>
            </div>
        </div>
    )
}