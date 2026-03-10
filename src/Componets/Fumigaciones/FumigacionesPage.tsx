import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import { GlobalContext } from "../../Context/GlobalContext";
import { IFCliente, IFDroga, IFRubro, IFVeh, ITalonario } from "../../Utils/Interfaces";


export default function FumigacionesPage () {

    const global = useContext(GlobalContext)
    const [clientes, setClientes] = useState<IFCliente[]>([])
    const [rubros, setRubros] = useState<IFRubro[]>([])
    const [filteredClientes, setFilteredClientes] = useState<IFCliente[]>([])
    const [vehiculos, setVehiculos] = useState<IFVeh[]>([])
    const [servicios, setServicios] = useState<string[]>([])
    const [searchServicio, setSearchSetvicio] = useState("")
    const [searchCliente, setSearchCliente] = useState("")
    const [searchRubro, setSearchRubro] = useState("")
    const [vehiculo, setVehiculo] = useState(0)
    const [talonario, setTalonario] = useState("")
    const [talonarios, setTalonarios] = useState<ITalonario[]>([])
    const [servicio, setServicio] = useState(false)
    const [selectedCliente, setSelectedCliente] = useState(-1)
    const [drogas, setDrogas] = useState<IFDroga[]>([])
    const [selectedDroga, setSelectedDroga] = useState(0)

    useEffect(() =>{
        if(global) {
            global.getClientesFumi().then(cls => setClientes(cls))
            global.getClientesFumi().then(cls => setFilteredClientes(cls))
            global.getVehFumi().then(vhs => setVehiculos(vhs))
            global.getDrogasFumi().then(drg => setDrogas(drg))
            global.getServiciosFumi().then(srvs => setServicios(srvs))
            global.getRubrosFumi().then(rbr => setRubros(rbr))
        }
    },[])

    useEffect(() =>{
        setTalonario("")
        setVehiculo(0)
    },[servicio,selectedCliente])

    useEffect(() =>{
        setTalonario("")
        setVehiculo(0)
        setServicio(false)
        setTalonarios([])
    },[selectedCliente])

    useEffect(() => {
        let arr = clientes
        if(searchCliente.length > 3) arr = arr.filter(c => c.razon_soc.toLocaleLowerCase().includes(searchCliente.toLocaleLowerCase()))
        if(searchServicio.length > 0) arr = arr.filter(c => c.servicio === searchServicio)
        if(searchRubro.length > 0) arr = arr.filter(c => c.rubro === searchRubro)
        setFilteredClientes(arr)
    },[searchCliente,searchServicio,searchRubro])

    const getTaloraniosCliente = async (id:number) => {
        if(id && global) {
            const talonariosCliente = await global.getTalonariosFumi(id)
            if(talonariosCliente.length > 0) setTalonarios(talonariosCliente)
            else alert("Cliente no posee talonarios.")
        }
    }

    const confirmarServicio = async () => {
        let talo = talonario
        const id = clientes[selectedCliente].cliente_id
        const veh = vehiculo ? vehiculo : 0
        const drogaToTalonario = drogas[selectedDroga].d2 ? drogas[selectedDroga].d1+"-"+drogas[selectedDroga].d2 : drogas[selectedDroga].d1
        if(global && confirm("¿Quieres confirmar el servicio?")) {
            if(!clientes[selectedCliente].oficial && clientes[selectedCliente].servicio === "TANQUE") {
                const currentDate = new Date()
                const dateToAddd = ""+currentDate.getMonth()+1+currentDate.getDate()
                talo = "TQ"+clientes[selectedCliente].cliente_id+""+dateToAddd
                const res = await global.createServicioFumi(id,global.user.rol,veh,talo,true,drogaToTalonario)
                alert(res)
            }
            else if(!clientes[selectedCliente].oficial && clientes[selectedCliente].servicio === "ESCUELA") {
                const currentDate = new Date()
                const dateToAddd = ""+currentDate.getMonth()+1+currentDate.getDate()
                talo = "ES"+clientes[selectedCliente].cliente_id+""+dateToAddd
                const res = await global.createServicioFumi(id,global.user.rol,veh,talo,true,drogaToTalonario)
                alert(res)
            }
            else {
                const res = await global.createServicioFumi(id,global.user.rol,veh,talo,false,drogaToTalonario)
                alert(res)
            }
        }

    }

    return(
        <div>
            <div>
                <Header/>
            </div>
            <hr color='#3399ff' className='hr-line'/>
            <h4 className='title-Homepage'>CLIENTES</h4>
            <div style={{display:"flex",justifyContent: "space-evenly"}}>
                <div>
                     <h5 className='title-Homepage' style={{margin:2}}>Nombre:</h5>
                     <input type="text" value={searchCliente} style={{width: 80}} onChange={(e) => setSearchCliente(e.target.value)}/>
                </div>
                <div>
                    <h5 className='title-Homepage' style={{margin:2}}>Servicio:</h5>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <select name="estados" value={searchServicio} onChange={(e) => setSearchSetvicio(e.target.value)}>
                            <option value={""} key={"none"}>----</option>
                            {servicios.map((v) => (
                                <option value={v} key={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <h5 className='title-Homepage' style={{margin:2}}>Rubro:</h5>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <select name="estados" value={searchRubro} onChange={(e) => setSearchRubro(e.target.value)}>
                            <option value={""} key={"none"}>----</option>
                            {rubros.map((v) => (
                                <option value={v.rubro} key={v.rubro}>{v.rubro}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <hr color='#3399ff' className='hr-line'/>
            <div style={{maxHeight: 450,overflow:"scroll"}}>
                <table style={{fontSize: "small", width: 500}}>
                    <tbody>
                        <tr >
                            <th style={{border: "1px solid", width: "20%"}}>CLIENTE</th>
                            <th style={{border: "1px solid", width: "20%"}}>SERVICIO</th>
                            <th style={{border: "1px solid", width: "20%"}}>RUBRO</th>
                            <th style={{border: "1px solid", width: "20%"}}>ULT. SERV</th>
                            <th style={{border: "1px solid", width: "20%"}}>PROX. SERV</th>
                        </tr>
                        {filteredClientes.map((c,i) => (
                        <tr key={i} style={{backgroundColor: c.empresa ? "Highlight": "white"}}
                        onClick={() => setSelectedCliente(i)}>
                            <th style={{border: "1px solid", width: "20%"}}>{c.razon_soc}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{c.servicio}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{c.rubro}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{c.ultimo_serv.split("T")[0]}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{c.prox_serv.split("T")[0]}</th>
                        </tr>
                        ))}
                    </tbody>
                </table> 
            </div>
            <div>
                <hr color='#3399ff' className='hr-line'/>
            </div>
            {selectedCliente >= 0 ? (
                <div>
                    <h4 className='title-Homepage'>{clientes[selectedCliente].razon_soc+" - "+clientes[selectedCliente].servicio}</h4>
                    <div style={{textAlign: "left"}}>
                        <h5 className='title-Homepage'>RUBRO: {clientes[selectedCliente].rubro}</h5>
                        <h5 className='title-Homepage'>COTIZACION: {clientes[selectedCliente].cotizacion}</h5>
                        <h5 className='title-Homepage'>FORMA DE PAGO: {clientes[selectedCliente].forma_pago}</h5>
                        <h5 className='title-Homepage'>DIRECCION: {clientes[selectedCliente].direccion}</h5>
                        <h5 className='title-Homepage'>CONTACTO: {clientes[selectedCliente].contacto}</h5>
                    </div>
                    <div style={{display: "flex",justifyContent:"space-evenly"}}>
                        <button className='btn-export-pdf' onClick={() => getTaloraniosCliente(clientes[selectedCliente].cliente_id)}>TALONARIOS</button>
                        <button className='btn-export-pdf' onClick={() => setServicio(!servicio)}>{servicio ? "CANCELAR" : "CONFIRMAR SERVICIO"}</button>
                    </div>
                    <hr color='#3399ff' className='hr-line'/>
                    {talonarios.length > 0 && (
                        <div style={{maxHeight: 450,overflow:"scroll"}}>
                            <h4 className='title-Homepage'>TALONARIOS DEL CLIENTE</h4>
                            <table style={{fontSize: "small", width: 500,tableLayout: "fixed"}}>
                                <tbody>
                                    <tr >
                                        <th style={{border: "1px solid", width: "20%"}}>TALONARIO</th>
                                        <th style={{border: "1px solid", width: "20%"}}>VEHICULO ASOCIADO</th>
                                        <th style={{border: "1px solid", width: "20%"}}>FECHA</th>
                                        <th style={{border: "1px solid", width: "20%"}}>DROGA</th>
                                    </tr>
                                    {talonarios.map((c,i) => (
                                    <tr key={i}>
                                        <th style={{border: "1px solid", width: "20%"}}>{c.numero}</th>
                                        <th style={{border: "1px solid", width: "20%"}}>{c.patente ? c.patente : "Ninguno"}</th>
                                        <th style={{border: "1px solid", width: "20%"}}>{c.fecha.split("T")[0]}</th>
                                        <th style={{border: "1px solid", width: "20%"}}>{c.droga}</th>
                                    </tr>
                                    ))}
                                </tbody>
                            </table> 
                        </div>
                    )}
                    {servicio && (
                        <div>
                            {clientes[selectedCliente].oficial && (
                                <div>
                                    <h5 className='title-Homepage'>Ingrese el talonario del certificado:</h5>
                                    <input type="text" value={talonario} style={{width: 80}} onChange={(e) => setTalonario(e.target.value)}/>
                                </div>
                            )}
                            {clientes[selectedCliente].rubro === "TRANSPORTE" && (
                                <div>
                                    <h5 className='title-Homepage'>Seleccion el vehiculo:</h5>
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <select name="estados" value={vehiculo} onChange={(e) => setVehiculo(parseInt(e.target.value))}>
                                                <option value={0}>---</option>
                                                {vehiculos.map(v => (
                                                    <option value={v.veh_id}>{v.patente}</option>
                                                ))}
                                            </select>
                                        </div>
                                </div>
                            )}
                            <div>
                                <h5 className='title-Homepage'>Selecciona la droga:</h5>
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <select name="estados" value={selectedDroga} onChange={(e) => setSelectedDroga(parseInt(e.target.value))}>
                                            {drogas.map((v,i) => (
                                                <option value={i}>{v.d2 ? v.d1+"-"+v.d2 : v.d1}</option>
                                            ))}
                                        </select>
                                    </div>
                            </div>
                            <button className='btn-export-pdf' onClick={() => confirmarServicio()}>REGISTRAR SERVICIO</button>
                        </div>
                    )}
                </div>
            ) : <h4 className='title-Homepage'>SELECCIONE UN CLIENTE</h4>}
        </div>
    )
}