import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import { IDesglose, IInsumoRac, ILgarEntrega, IpedidoRacDataPDF, IPedidoRacPDF } from "../../Utils/Interfaces";
import lentregaService from "../../Utils/lentregaService";
import { GlobalContext } from "../../Context/GlobalContext";
import PedidoRacPdf from "../pdfs/pedidoRac";
import saveAs from "file-saver";
import { pdf } from "@react-pdf/renderer";
import insRacionamieto from "./insumos.json"
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
    const [tanda, setTanda] = useState(0)
    const [delkey, setDelkey] = useState("")
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
        setDelkey("")
        setTanda(0)
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

    const displayDeleteTanda = () => {

        const deleteEnvio = async () => {
            await global?.deleteTandaFn(tanda, delkey)
            setDelkey("")
            setTanda(0)
        }
        return (
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Eliminar Envio 
                    </h2>
                    <div>
                        <h4 className='title-Homepage'>Seleccione la tanda a eliminar</h4>
                        <input type="number" id='otherins' className="data-div-select" value={tanda} min={1}
                        style={{width: "35%"}} onChange={(e) => setTanda((e.target.value) ? parseInt(e.target.value) : 0)}/>
                    </div>
                    <div>
                    <div>
                        <h4 className='title-Homepage'>Escriba la clave</h4>
                        <input type="text" id='otherins' className="data-div-select" value={delkey}
                        style={{width: "35%"}} onChange={(e) => setDelkey(e.target.value)}/>
                    </div>
                    </div>
                    <div>
                        {tanda > 0 && <button className='btn-big' onClick={() => deleteEnvio()}>Eliminar</button>}
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
                            <option value={2}>Eliminar envios</option>
                            <option value={3}>Traer envios</option>
                        </select>
                    </div>
                    <div style={{maxWidth: 400}}>
                        {display === 1 && displayDesglosadoGn()}
                        {display === 2 && displayDeleteTanda()}
                        {display === 3 && displayTraerEnvios()}
                    </div>
                </div>
            </div>
        </div>
    )
}
//<option value={2}>Generar nuevo envio</option>
