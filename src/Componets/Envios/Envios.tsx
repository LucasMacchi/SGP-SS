import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import { IDesglose, IEnvio, IInsumoRac, ILgarEntrega, IpedidoRacDataPDF, IPedidoRacPDF } from "../../Utils/Interfaces";
import lentregaService from "../../Utils/lentregaService";
import { GlobalContext } from "../../Context/GlobalContext";
import PedidoRacPdf from "../pdfs/pedidoRac";
import saveAs from "file-saver";
import { pdf } from "@react-pdf/renderer";
import insRacionamieto from "./insumos.json"
import desgloseReturner from "../../Utils/desgloseReturner";
import DesglosePdf from "../pdfs/desgloses";
import createTxtEnvio from "../../Utils/createTxtEnvio";
import RutaPdf from "../pdfs/rutaEnvioPdf";
import ActaConformidadPDF from "../pdfs/actaConformidad";


export default function Envios () {

    const global = useContext(GlobalContext)
    const [display, setDisplay] = useState(0)
    const [lgaresF, setLgaresF] = useState<ILgarEntrega[]>([])
    const [desglosesF, setDesglosesF] = useState<IDesglose[]>([])
    const [desglosesS, setDesglosesS] = useState("")
    const [lgaresS, setLgaresS] = useState("")
    const [lgarSel, setLgarSel] = useState(0)
    const [desSel, setDesSel] = useState(0)
    const [newEnvios, setNewEnvios] = useState<IEnvio[]>([])
    const [displayDes, setDisplayDes] = useState(false)
    const [updater, setUpdater] = useState(0)
    const [tanda, setTanda] = useState(0)
    const [dias, setDias] = useState(0)
    const [insRac, setInsRac] = useState<IInsumoRac>({
        des: "",kg: 0,cajas: 0,
        bolsas: 0,rac: 0,sel: 0
    })
    const [remitoRac, setReRac] = useState<IpedidoRacDataPDF>({
        solicitante_usuario: "",pedido_req: "",pedido_service: "",
        pedido_client_id: 0,pedido_service_id: 0,pedido_insumos: [],
        pedido_desglose: "",remito_nro: "",pedido_local: ""
    })
    const racionesCalc = (c: number, b:number, cr: number, br: number): number => {
        return c*cr+b*br
    }
    const racionesKilosCalc = (r: number, w: number, b: number): number => {
        return r*(w/b)
    }
    useEffect(() => {
        if(global?.lentregas.length === 0) global.getLugaresEntreFn()
        if(global?.desgloses.length === 0) global.getDesglosesFn()
    },[])

    useEffect(() => {
        setReRac({solicitante_usuario: "",pedido_req: "",pedido_service: "",pedido_client_id: 0,
        pedido_service_id: 0,pedido_insumos: [],pedido_desglose: "",remito_nro: "",pedido_local: ""})
        setInsRac({des: "",kg: 0,cajas: 0,bolsas: 0,rac: 0,sel: 0})
        setLgaresS("")
        setDesglosesS("")
    },[display])

    useEffect(() => {
        if(global){
            let arr = global?.lentregas
            const search = lgaresS.toLowerCase()
            if(lgaresS.length > 0) arr = arr?.filter(s => s.descripcion.toLowerCase().includes(search))
            setLgaresF(arr)
        }
    },[lgaresS, global?.lentregas])

    useEffect(() => {
        if(global){
            let arr = global?.desgloses
            const search = desglosesS.toLowerCase()
            if(desglosesS.length > 0) arr = arr?.filter(s => s.descripcion.toLowerCase().includes(search))
            setDesglosesF(arr)
        }
    },[desglosesS, global?.desgloses])

    useEffect(() => {
        if(insRac.sel) {
            const ins = insRacionamieto.insumos[insRac.sel]
            const bolsas = insRac.bolsas
            const cajas = insRac.cajas
            const raciones = racionesCalc(cajas,bolsas,ins.c,ins.b)
            const kilos = (racionesKilosCalc(raciones, ins.w, ins.b) / 1000).toFixed(2)
            setInsRac({...insRac ,rac: raciones, kg: parseFloat(kilos)})
        }
    },[insRac.bolsas, insRac.cajas])

    useEffect(() => {
        if(lgarSel > 0) setDisplayDes(true)
        else setDisplayDes(false)
    },[lgarSel])


    const displayDesglosadoGn = () => {
        const addInsRac = () => {
            if(insRac.des.length > 0) {
                remitoRac.pedido_insumos.push(insRac)
                setReRac({...remitoRac})
                setInsRac({des: "", rac: 0, kg: 0, cajas: 0, bolsas: 0, sel: 0})
            } else alert("Ingrese un insumo valido.")
        }
        const deleteInsumoRowRemitoRac = (index: number, ins: string) => {
            if(confirm('¿Quiere eliminar el insumo '+ins+ "?")){
                remitoRac.pedido_insumos.splice(index, 1)
                setReRac(remitoRac)
                setInsRac({des: "", rac: 0, kg: 0, cajas: 0, bolsas: 0, sel: 0})
            }
        }
        const generateRacEnvioPdf = async () => {
            if(global && remitoRac.pedido_insumos.length > 0 && remitoRac.pedido_service_id && remitoRac.remito_nro.length > 0 && remitoRac.pedido_desglose.length > 0) {
                remitoRac.pedido_client_id = 1
                remitoRac.solicitante_usuario = global.user.username
                remitoRac.pedido_req = new Date().toISOString()
                remitoRac.pedido_service = lentregaService(global.lentregas, remitoRac.pedido_service_id).descripcion
                remitoRac.pedido_local = lentregaService(global.lentregas, remitoRac.pedido_service_id).localidad
                const data: IPedidoRacPDF = {pedido:remitoRac}
                const blob: Blob = await pdf(<PedidoRacPdf pedido={data.pedido}/>).toBlob()
                saveAs(blob, 'SGP_REMITODES_'+remitoRac.remito_nro)
                setReRac({
                ...remitoRac,
                solicitante_usuario: "",pedido_req: "",
                pedido_insumos: [],pedido_desglose: ""})
                setInsRac({des: "", rac: 0, kg: 0, cajas: 0, bolsas: 0,sel: 0})

                
                
            } else alert("Faltan datos.")
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Remito detalle 
                    </h2>
                    <div>
                        <h4 className='title-Homepage'>Cabeceras encontrados - {lgaresF.length}</h4>
                        <div style={{ display: "flex",flexDirection: "row"}}>
                            <h4 className='title-Homepage'>Buscar: </h4>
                            <input type="text" id='otherins' className="data-div-select" value={lgaresS}
                            style={{width: "58%"}} onChange={(e) => setLgaresS(e.target.value)}/>
                        </div>
                        <select defaultValue={0}
                        value={remitoRac.pedido_service_id} onChange={(e) => setReRac({...remitoRac, pedido_service_id: parseInt(e.target.value)})} className='select-small-cco'>
                            <option value={0}>---</option>
                            {
                                lgaresF.map((lg,i) => (<option key={i} value={lg.lentrega_id}>{lg.lentrega_id+"-"+lg.descripcion}</option>))
                            }
                        </select>
                    </div>
                    <div>
                        <h4 className='title-Homepage'>Desgloses encontrados - {desglosesF.length}</h4>
                        <div style={{ display: "flex",flexDirection: "row"}}>
                            <h4 className='title-Homepage'>Buscar: </h4>
                            <input type="text" id='otherins' className="data-div-select" value={desglosesS}
                            style={{width: "58%"}} onChange={(e) => setDesglosesS(e.target.value)}/>
                        </div>
                        <select defaultValue={""}
                        value={remitoRac.pedido_desglose} onChange={(e) => setReRac({...remitoRac, pedido_desglose: e.target.value})} className='select-small-cco'>
                            <option value={""}>---</option>
                            {(global && remitoRac.pedido_service_id) && 
                            <option value={lentregaService(global.lentregas, remitoRac.pedido_service_id).descripcion}>
                                {lentregaService(global.lentregas, remitoRac.pedido_service_id).descripcion}
                            </option>}
                            
                            {
                                desglosesF.map((lg,i) => (<option key={i} value={lg.descripcion}>{lg.descripcion}</option>))
                            }
                        </select>
                    </div>

                    <div style={{ display: "flex",flexDirection: "row"}}>
                        <h4 className='title-Homepage'>Nro Remito: </h4>
                        <input type="text" id='otherins' className="data-div-select" value={remitoRac.remito_nro}
                        style={{width: "25%"}} onChange={(e) => setReRac({...remitoRac, remito_nro: e.target.value})}/>
                    </div>
                    <div>
                        <div style={{ display: "flex",flexDirection: "row"}}>
                            <h4 className='title-Homepage'>Insumo: </h4>
                            <select value={insRac.sel} name="remitodes" onChange={(e) => setInsRac({...insRac, sel: parseInt(e.target.value),des: insRacionamieto.insumos[parseInt(e.target.value)].des})}>
                                {insRacionamieto.insumos.map((ins, i) => (
                                    <option value={i}>{ins.des}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", width: 410}}>
                            <div >
                                <h4 className='title-Homepage'>Cajas: </h4>
                                <input type="number" id='otherins' className="data-div-select" value={insRac.cajas} min={1}
                                style={{width: "35%"}} onChange={(e) => setInsRac({...insRac, cajas: parseInt(e.target.value) ? parseInt(e.target.value) : 0})}/>
                            </div>
                            <div >
                                <h4 className='title-Homepage'>Bolsas: </h4>
                                <input type="number" id='otherins' className="data-div-select" value={insRac.bolsas} min={1}
                                style={{width: "35%"}} onChange={(e) => setInsRac({...insRac, bolsas: parseInt(e.target.value) ? parseInt(e.target.value) : 0})}/>
                            </div>
                            <div >
                                <h4 className='title-Homepage'>Raciones: </h4>
                                <input type="number" id='otherins' className="data-div-select" value={insRac.rac} min={1}
                                style={{width: "50%"}} disabled/>
                            </div>
                            <div >
                                <h4 className='title-Homepage'>Kilos: </h4>
                                <input type="number" id='otherins' className="data-div-select" value={insRac.kg} min={1}
                                style={{width: "50%"}} disabled/>
                            </div>
                        </div>

                        <button className="info-popup" style={{ margin: 5}} onClick={() => addInsRac()}>Agregar</button>
                    </div>
                    <div>
                        <h5 className='filter-sub'>Presione en un insumo para eliminarlo.</h5>
                        <table style={{width: 360, alignItems: "center"}}>
                            <tbody>
                                <tr >
                                    <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 320}}>Insumo</th>
                                    <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Kilos</th>
                                    <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Cajas</th>
                                    <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Bolsas</th>
                                    <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Rac</th>
                                </tr>
                                {remitoRac.pedido_insumos.map((ins,i) => (
                                    <tr onClick={() => deleteInsumoRowRemitoRac(i, ins.des)}>
                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 320}}>{ins.des}</th>
                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.kg}</th>
                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.cajas}</th>
                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.bolsas}</th>
                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.rac}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className='btn-big' onClick={() => generateRacEnvioPdf()}>
                            Generar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const displayNewEnvio = () => {
        const checkEnvios = () : boolean => {
            let res = true
            newEnvios.map((en) => {
                if(en.productos.length === 0) res = false
            })
            console.log(res)
            return res
        }
        const addEnvio = () => {
            if(desSel) {
                const newEnv:IEnvio = {
                    lentregaId: lgarSel,
                    desgloseId: desSel,
                    userId: 0,
                    nro: "",
                    identificador: "",
                    estado: "",
                    productos:[],
                    addprod: {des: "",kg: 0,cajas: 0,bolsas: 0,rac: 0,sel: 0}
                }
                newEnvios.push(newEnv)
                setDesSel(0)
            } else alert("")
        }
        const deleteEnvio = (index: number) => {
            if(confirm("Quieres eliminar el envio?")) {
                const arr = newEnvios.filter((_en,i) => i !== index)
                newEnvios.splice(index, 1)
                setNewEnvios(arr)
            }
        }
        const deleteProducto = (indexE: number, index: number) => {
            if(confirm("Quieres eliminar el producto?")){
                newEnvios[indexE].productos.splice(index,1)
                const up = updater + 1
                setUpdater(up)
            }
        }
        const clearSelection = () => {
            if(confirm("Quieres seleccionar devuelta el lugar de entrega? Esto limpiara todo el envio.")) {
                setNewEnvios([])
                setLgarSel(0)
            }
        }
        const handlerCaja = (index: number, payload: number) => {
            const modEnv = newEnvios[index]
            modEnv.addprod.cajas = payload
            newEnvios[index] = modEnv
            setNewEnvios(newEnvios)
            const up = updater + 1
            setUpdater(up)
        }
        const handlerBolsa = (index: number, payload: number) => {
            const modEnv = newEnvios[index]
            modEnv.addprod.bolsas = payload
            newEnvios[index] = modEnv
            setNewEnvios(newEnvios)
            const up = updater + 1
            setUpdater(up)
        }
        const handlerSel = (index: number, payload: number) => {
            const modEnv = newEnvios[index]
            modEnv.addprod.sel = payload
            newEnvios[index] = modEnv
            setNewEnvios(newEnvios)
            const up = updater + 1
            setUpdater(up)
        }
        const addInsumo = (i: number) => {
            const insumo = newEnvios[i].addprod
            if(insumo.sel && (insumo.bolsas || insumo.cajas)) {
                const racion = insRacionamieto.insumos[insumo.sel]
                const raciones = racionesCalc(insumo.cajas, insumo.bolsas, racion.c,racion.b)
                const kilos = (racionesKilosCalc(raciones,racion.w, racion.b) / 1000).toFixed(2)
                const data: IInsumoRac = {
                    bolsas: insumo.bolsas,
                    cajas: insumo.cajas,
                    rac: raciones,
                    kg: parseFloat(kilos),
                    des: racion.des
                }
                newEnvios[i].productos.push(data)
                handlerBolsa(i,0)
                handlerCaja(i,0),
                handlerSel(i,0)
                const up = updater + 1
                setUpdater(up)
            }

        }
        const createEnvios = async () => {
            if(checkEnvios()) {
                global?.registerEnvio(newEnvios)
                //setNewEnvios([])
                //setLgarSel(0)
            }
            else alert("Asegurese que todos los envios tengan insumos.")
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Generar Envio 
                    </h2>
                    <div>
                        <h4 className='title-Homepage'>Seleccione la cabecera - encontrados - {lgaresF.length}</h4>
                        <div style={{ display: "flex",flexDirection: "row"}}>
                            <h4 className='title-Homepage'>Buscar: </h4>
                            <input type="text" id='otherins' className="data-div-select" value={lgaresS}
                            style={{width: "58%"}} onChange={(e) => setLgaresS(e.target.value)}/>
                        </div>
                        <div>
                            <select defaultValue={0}
                            value={lgarSel} disabled={lgarSel > 0 ? true : false} onChange={(e) => setLgarSel(parseInt(e.target.value))} className='select-small-cco'>
                                <option value={0}>---</option>
                                {
                                    lgaresF.map((lg,i) => (<option key={i} value={lg.lentrega_id}>{lg.lentrega_id+"-"+lg.descripcion}</option>))
                                }
                            </select>
                            <button className='btn-export-pdf' onClick={() => clearSelection()}>Limpiar</button>
                        </div>
                        <div>
                            {displayDes && 
                            <div>
                                <h4 className='title-Homepage'>Desgloses encontrados - {desglosesF.length}</h4>
                                <div style={{ display: "flex",flexDirection: "row"}}>
                                    <h4 className='title-Homepage'>Buscar: </h4>
                                    <input type="text" id='otherins' className="data-div-select" value={desglosesS}
                                    style={{width: "58%"}} onChange={(e) => setDesglosesS(e.target.value)}/>
                                </div>
                                <select defaultValue={""}
                                value={desSel} onChange={(e) => setDesSel(parseInt(e.target.value))} className='select-small-cco'>
                                    <option value={""}>---</option>
                                    {
                                        desglosesF.map((lg,i) => (<option key={i} value={lg.desglose_id}>{lg.descripcion}</option>))
                                    }
                                </select>
                                <button className='btn-export-pdf' onClick={() => addEnvio()}>Agregar</button>
                            </div>
                            }
                            <div>
                                {global && newEnvios.map((en, i) =>(
                                    <div key={i} style={{border: "1px solid", borderColor: "#3399ff"}}>
                                        <div style={{display: "flex" ,justifyContent: "space-between", alignItems: "center"}}>
                                            <h3 className='title-Homepage' style={{margin: 2}}>{desgloseReturner(en.desgloseId, global.desgloses)}</h3>
                                            <button className='btn-export-pdf' style={{backgroundColor: "red", borderColor: "red"}} onClick={() => deleteEnvio(i)}>X</button>
                                        </div>
                                        <div style={{ display: "flex",flexDirection: "column"}}>
                                            <h4 className='title-Homepage'>Insumo: </h4>
                                            <select value={newEnvios[i].addprod.sel} name="remitodes" onChange={(e) => handlerSel( i,parseInt(e.target.value))}>
                                                {insRacionamieto.insumos.map((ins, i) => (
                                                    <option value={i}>{ins.des}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <div >
                                                <h4 className='title-Homepage'>Cajas: </h4>
                                                <input type="number" id='otherins' className="data-div-select" min={0} value={newEnvios[i].addprod.cajas}
                                                style={{width: "45%"}} onChange={(e) => handlerCaja(i, parseInt(e.target.value))}/>
                                            </div>
                                            <div >
                                                <h4 className='title-Homepage'>Bolsas: </h4>
                                                <input type="number" id='otherins' className="data-div-select" min={0} value={newEnvios[i].addprod.bolsas}
                                                style={{width: "45%"}} onChange={(e) => handlerBolsa(i, parseInt(e.target.value))}/>
                                            </div>
                                            <button className='btn-export-pdf' onClick={() => addInsumo(i)}>+</button>
                                        </div>
                                        <div>
                                            <h5 className='filter-sub'>Presione en un insumo para eliminarlo.</h5>
                                            <table style={{width: 330, alignItems: "center"}}>
                                                <tbody>
                                                    <tr>
                                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 260}}>Insumo</th>
                                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Kilos</th>
                                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Cajas</th>
                                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Bolsas</th>
                                                        <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>Rac</th>
                                                    </tr>
                                                    {en.productos.map((ins,i2) => (
                                                        <tr onClick={() => deleteProducto(i,i2)}>
                                                            <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 260}}>{ins.des}</th>
                                                            <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.kg}</th>
                                                            <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.cajas}</th>
                                                            <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.bolsas}</th>
                                                            <th style={{borderWidth: 1, borderColor: "black", borderStyle: "solid", width: 20}}>{ins.rac}</th>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        
                                    </div>
                                    
                                ))}
                            </div>
                            {newEnvios.length > 0 && <button className='btn-big' onClick={() => createEnvios()}>Generar</button>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const displayTraerEnvios = () => {

        const getEnvios = async () => {
            const envios = await global?.getEnviosTanda(tanda)
            if(envios && envios.length > 0) {
                const blob: Blob = await pdf(<DesglosePdf envios={envios} />).toBlob()
                saveAs(blob, 'SGP_TANDA_'+tanda)
                setTanda(0)
            }
        }
        const getHojaRuta = async () => {
            const hojaRuta = await global?.getRutaEnvio(tanda)
            if(hojaRuta) {
                const blobR = await pdf(<RutaPdf ruta={hojaRuta}/>).toBlob()
                saveAs(blobR, 'SGP_HR_'+tanda)
                setTanda(0)
            }
        }
        const exportEnvio = async () => {
            const txt = await global?.getTxtEnvio(tanda, dias)
            if(txt && txt.cabecera.length > 0 && txt.items.length > 0) {
                createTxtEnvio(txt, tanda)
                setDias(0)
                setTanda(0)
            }
            else alert("No existen envios en esa tanda.")
        }

        const getActas = async () => {
            const actas = await global?.getConformidadEnvio(tanda)
            if(actas) {
                const blobR = await pdf(<ActaConformidadPDF actas={actas}/>).toBlob()
                saveAs(blobR, 'SGP_ACTAS_'+tanda)
                setTanda(0)
            }
        }

        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Generar Envio 
                    </h2>
                    <div>
                        <h4 className='title-Homepage'>Seleccione la tanda a traer</h4>
                        <input type="number" id='otherins' className="data-div-select" value={tanda} min={1}
                        style={{width: "35%"}} onChange={(e) => setTanda((e.target.value) ? parseInt(e.target.value) : 0)}/>
                    </div>
                    <div>
                    <div>
                        <h4 className='title-Homepage'>Seleccione los dias</h4>
                        <input type="number" id='otherins' className="data-div-select" value={dias} min={1}
                        style={{width: "35%"}} onChange={(e) => setDias((e.target.value) ? parseInt(e.target.value) : 0)}/>
                    </div>
                    </div>
                    <div>
                        {tanda > 0 && <button className='btn-big' onClick={() => getEnvios()}>Desgloses</button>}
                    </div>
                    <div>
                        {tanda > 0 && <button className='btn-big' onClick={() => getHojaRuta()}>Hoja de Ruta</button>}
                    </div>
                    <div>
                        {tanda > 0 && <button className='btn-big' onClick={() => getActas()}>Actas</button>}
                    </div>
                    <div>
                        {tanda > 0 && <button className='btn-big' onClick={() => exportEnvio()}>Exportar</button>}
                    </div>

                </div>
            </div>
        )
    }

    return(
        <div>
            <Header />
            <div>
                <div>
                   <hr color='#3399ff' className='hr-line'/>
                    <div>
                        <h4 className='title-Homepage'>Seleccione la accion a realizar</h4>
                        <select name="display" className='filter-sub'
                        onChange={(e)=>setDisplay(parseInt(e.target.value))}>
                            <option value={0}>---</option>
                            <option value={1}>Generar desglosado de envio</option>
                            <option value={3}>Traer envios</option>
                        </select>
                    </div>
                    <div style={{maxWidth: 400}}>
                        {display === 1 && displayDesglosadoGn()}
                        {display === 2 && displayNewEnvio()}
                        {display === 3 && displayTraerEnvios()}
                    </div>
                </div>
            </div>
        </div>
    )
}
//<option value={2}>Generar nuevo envio</option>
