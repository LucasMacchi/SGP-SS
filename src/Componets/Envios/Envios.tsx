import { ChangeEvent, useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import { GlobalContext } from "../../Context/GlobalContext";
import saveAs from "file-saver";
import { pdf } from "@react-pdf/renderer";
import DesglosePdf from "../pdfs/desgloses";
import createTxtEnvio from "../../Utils/createTxtEnvio";
import RutaPdf from "../pdfs/rutaEnvioPdf";
import ActaConformidadPDF from "../pdfs/actaConformidad";
import ExcelParserEnvios from "../../Utils/excelParser";
import { IChangeEnvioInsumo, IChangeEnvioInsumoPlan, ICreateFactura, ICreateInsumo, IDesglosesReturner, IEnvioInsumos, ILentrega, IPlanComplete, IRemitosEnvio, IReportEnvio, IrequestEnvioCom, rolesNum } from "../../Utils/Interfaces";
import informeEnviosTxt from "../../Utils/informeEnviosTxt";
import RemitoEnvioPdf from "../pdfs/remitoEnvio";
import InformeFacturacionPDF from "../pdfs/facturacionInformepdf";
import paletPrevisualizer from "../../Utils/paletPrevisualizer";
import desglosesParser from "../../Utils/desglosesParser";
import refillEmptySpace from "../../Utils/refillEmptySpace";
import reportesCategoriasJSON from "./reporteCategorias.json";


export default function Envios () {

    const global = useContext(GlobalContext)
    const [display, setDisplay] = useState(9)
    const [updater, setUpdater] = useState(0)
    const [tanda, setTanda] = useState(0)
    const [pv, setPv] = useState(8)
    const [cai, setCai] = useState(0)
    const [venc, setVenc] = useState(0)
    const [startRt, setStartRt] = useState(0)
    const [endRt, setEndtRt] = useState(0)
    const [endTal, setEndTal] = useState(0)
    const [fecha, setFecha] = useState("")
    const [delkey, setDelkey] = useState("")
    const [selectedPlan, setSelectedPlan] = useState(1000)
    const [planes, setPlanes] = useState<IPlanComplete[]>([])
    const [insumos, setInsumos] = useState<IEnvioInsumos[]>([])
    const [selectedIns, setSelectedIns] = useState(0)
    const [departamentos, setDepartamentos] = useState<string[]>([])
    const [selectedDep, setSelectedDep] = useState("")
    const [customDate, setCustomDate] = useState("")
    const [lugaresEntrega, setLugaresEntrega] = useState<IDesglosesReturner[]>([])
    const [selectedLgsEnt, setSelectedLgsEnt] = useState<IDesglosesReturner[]>([])
    const [cabeceras, setCabeceras] = useState<ILentrega[]>([])
    const [selectedCabecera, setSelectedCabecera] = useState(0)
    const [filteredDesgloses, setFilteredDesgloses] = useState<IDesglosesReturner[]>([])
    const [totalPalets, setTotalPalets] = useState({palets: 0, racs: 0,totalRemitos: 0})
    const [lastRt, setLastRt] = useState(0)
    const [fortificado, setFortificado] = useState(0)
    const [customCheck, setCustomCheck] = useState(false)
    const [customRt, setCustomRt] = useState<string[]>([])
    const [remitosView, setRemitosView] = useState<IRemitosEnvio[][]>([])
    const [remitoPage, setRemitoPage] = useState(0)
    const [filteredRemitosView, setFilteredRemitosView] = useState<IRemitosEnvio[]>([])
    const [remitosReport, setRemitoReport] = useState<IReportEnvio[]>([])
    const [selectedRemito, setSelectedRemito] = useState<IRemitosEnvio | null>(null)
    const [selectedReporte, setSelectedReporte] = useState(10000)
    const [createReporte, setCreateReporte] = useState({titulo: "", des: ""})
    const [searchRemito, setSearchRemito] = useState("")
    const [searchPv, setSearchPv] = useState("")
    const [searchState, setSearchState] = useState("")
    const [searchFac, setSearchFac] = useState(0)
    const [Crt, setCRt] = useState("")
    const [createInsumo, setCreateIns] = useState<ICreateInsumo>({
        des: "",caja_palet: 0,unidades_caja: 0,gr_racion: 0,gr_total: 0,racbolsa: 0,raccaja: 0,cod1:"",cod2:""
    })
    const [createFactura, setCreateFactura] = useState<ICreateFactura>({
        factura_cod1: "",factura_cod2:"",remitos:[],fecha:""
    })
    useEffect(() => {
        if(global) {
            global?.sessionFn()
            global.getInsumosEnvios().then(i => setInsumos(i))
            global.getEnviosPlanes().then(p => setPlanes(p))
            global.getPv().then(pv => setPv(pv ? pv : 8))
            global.getCai().then(caiNro => setCai(caiNro ? caiNro : 0))
            global.getVenc().then(venci => setVenc(venci ? venci : 0))
            global.getLastRt().then(rt => setLastRt(rt ? rt : 0))
            global.getFinTalo().then(end => setEndTal(end ? end : 0))
            global.getDepartamentos().then(dep => setDepartamentos(dep))
            global.getEnviosRemitos().then(rts => setRemitosView(rts))
        }
    },[])

    useEffect(() => {
        setDelkey("")
        setTanda(0)
        setSelectedPlan(1000)
        setSelectedIns(0)
        setStartRt(0)
        setEndtRt(0)
        setFortificado(0)
        setSelectedDep("")
        setTotalPalets({palets: 0, racs: 0,totalRemitos: 0})
        setCRt("")
        setCustomRt([])
        setCustomCheck(false)
        setSelectedLgsEnt([])
        setRemitoPage(0)
        setRemitoReport([])
        setSelectedReporte(10000)
        setCustomDate("")
        setSearchFac(0)
        setSearchPv("")
        setSearchRemito("")
        setSearchState("")
        setCreateIns({des: "",caja_palet: 0,unidades_caja: 0,gr_racion: 0,gr_total: 0,racbolsa: 0,raccaja: 0,cod1:"",cod2:""})
    },[display])

    useEffect(() => {
        setSelectedDep("")
        setCRt("")
        setCustomRt([])
    },[selectedPlan, customCheck])

    useEffect(() => {
        setSelectedDep("")
    },[fortificado])

    useEffect(() => {
        setLugaresEntrega([])
        setFilteredDesgloses([])
        setSelectedCabecera(0)
        setCabeceras([])
    },[selectedDep])

    useEffect(() => {
        const palets = paletPrevisualizer(selectedLgsEnt,planes,insumos)
        setTotalPalets(palets)
    },[selectedLgsEnt])

    useEffect(() => {
        if(selectedCabecera && global) {
            let arr = lugaresEntrega
            arr = arr.filter(lg => lg.lentrega_id === selectedCabecera)
            setFilteredDesgloses(arr)
        }
    },[selectedCabecera])

    useEffect(() => {
        const remain = endTal - lastRt
        if(endTal && lastRt && remain <= 100) alert("Remitos restantes hasta el final del talonario: "+remain)
    }, [lastRt])

    useEffect(() => {
        setUpdater(updater+1)
        setCustomDate("")
    },[remitosView])

    useEffect(() =>  {
        setRemitoReport([])
        setSelectedReporte(10000)
        setCustomDate("")
    },[selectedRemito])

    useEffect(() => {
        setCreateReporte({titulo: "",des: ""})
    },[selectedReporte])


    const limpiarTodo = () => {
        setDelkey("")
        setTanda(0)
        setSelectedPlan(1000)
        setSelectedIns(0)
        setStartRt(0)
        setEndtRt(0)
        setFortificado(0)
        setSelectedDep("")
        setTotalPalets({palets: 0, racs: 0,totalRemitos: 0})
        setCRt("")
        setCustomRt([])
        setCustomCheck(false)
        setSelectedLgsEnt([])
        setRemitoReport([])
        setSelectedReporte(10000)
    }

    const remitosRemain = () => {
        const remain = endTal - lastRt
        return remain
    }


    const displayGenerarEnvioExcel = () => {
        const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
            if(e.target.files && e.target.files[0] && global && confirm("¿Quieres crear las tandas de este excel?")) {
                const updater = confirm("¿Quieres que se actualicen los remitos?")
                const data: IrequestEnvioCom[][] = await ExcelParserEnvios(e.target.files[0], insumos, planes[selectedPlan],fortificado ? true: false)
                let lineas = []
                console.log(data)
                for (let index = 0; index < data.length; index++) {
                    const res = await global.createEnvios(data[index], updater)
                    lineas.push(res)
                }
                informeEnviosTxt(lineas)
            }
        };

        const displayPlan = () => {
            if(selectedPlan !== 1000){
                return(
                    <table style={{fontSize: "small", width: 380}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "90%"}}>Insumo</th>
                                <th style={{border: "1px solid", width: "10%"}}>Dias</th>
                            </tr>
                            {planes[selectedPlan].details.map((d) => (
                            <tr key={d.detail_id}>
                                <th style={{border: "1px solid", width: "90%"}}>{d.des}</th>
                                <th style={{border: "1px solid", width: "10%"}}>{d.dias}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Cargar un envio 
                    </h2>
                    {remitosRemain() <= 100 && <h4 className='title-Homepage' style={{color: "red"}}>Remitos restantes del talonario {remitosRemain()}</h4>}
                    <h4 className='title-Homepage'>Seleccione el plan a utilizar</h4>
                    <select name="plan" className='filter-sub' value={selectedPlan} onChange={(e) => setSelectedPlan(parseInt(e.target.value))}>
                        <option value={1000}>---</option>
                        {planes.map((p,i) => (
                            <option value={i}>{p.des + " x "+p.dias}</option>
                        ))}
                    </select>
                    <select name="plan" className='filter-sub' value={fortificado} onChange={(e) => setFortificado(parseInt(e.target.value))}>
                        <option value={0}>COPA DE LECHE</option>
                        <option value={1}>ALMUERZO</option>
                    </select>
                    {displayPlan()}
                    <div style={{marginTop: 50}}>
                        <h4 className='title-Homepage'>Seleccione el archivo excel a cargar</h4>
                        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} disabled={selectedPlan === 1000}/>
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
            const envios = customRt.length > 0 ? await global?.getEnviosTandaCustom(customRt) : await global?.getEnviosTanda(startRt, endRt, pv)
            if(envios && envios.length > 0) {
                const blob: Blob = await pdf(<DesglosePdf envios={envios} />).toBlob()
                if(customCheck && customRt.length > 0) saveAs(blob, 'SGP_TANDA_PERSONALIZADA')
                else saveAs(blob, 'SGP_TANDA_'+startRt+"_"+endRt)
            }
        }
        const getHojaRuta = async () => {
            const hojaRuta = customRt.length > 0 ? await global?.getRutaEnvioCustom(customRt) : await global?.getRutaEnvio(startRt, endRt, pv)
            if(hojaRuta) {
                const blobR = await pdf(<RutaPdf ruta={hojaRuta}/>).toBlob()
                if(customCheck && customRt.length > 0) saveAs(blobR, 'SGP_HR_PERSONALIZADA')
                else saveAs(blobR, 'SGP_HR_'+startRt+"_"+endRt)

            }
        }
        const exportEnvio = async () => {
            const txt = await global?.getTxtEnvio(startRt, endRt, pv)
            if(txt && txt.cabecera.length > 0 && txt.items.length > 0) {
                createTxtEnvio(txt, startRt,endRt)
            }
            else alert("No existen envios en esa tanda.")
        }

        const getActas = async () => {
            const actas = customRt.length > 0 ? await global?.getConformidadEnvioCustom(customRt) : await global?.getConformidadEnvio(startRt, endRt, pv)
            if(actas) {
                const blobR = await pdf(<ActaConformidadPDF actas={actas}/>).toBlob()
                if(customCheck && customRt.length > 0) saveAs(blobR, 'SGP_ACTAS_PERSONALIZADA')
                else saveAs(blobR, 'SGP_ACTAS_'+startRt+"_"+endRt)

            }
        }

        const getRemitos = async () => {
            const envios = customRt.length > 0 ? await global?.getRemitosDataCustom(customRt) : await global?.getRemitosData(startRt, endRt, pv)
            if(envios) {
                const blobR = await pdf(<RemitoEnvioPdf envios={envios}/>).toBlob()
                if(customCheck && customRt.length > 0) saveAs(blobR, 'SGP_REMITOS_PERSONALIZADO')
                else saveAs(blobR, 'SGP_REMITOS_'+startRt+"_"+endRt)

            }
        }
        const addRemito = () => {
            const format = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,parseInt(Crt))
            setCustomRt(rt => [...rt, format])
            setCRt("")
        }

        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Generar Envio 
                    </h2>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <h4 className='title-Homepage'>Envio personalizado:</h4>
                        <input type="checkbox" checked={customCheck} onChange={(e) => setCustomCheck(e.target.checked)}/>
                    </div>
                    <h4 className='title-Homepage'>Punto de venta actual {pv}</h4>
                    <h4 className='title-Homepage'>Ultimo Remito {lastRt}</h4>
                    {customCheck && (
                    <div>
                        <h4 className='title-Homepage'>Ingrese el remito</h4>
                        <input type="number" id='startrt' className="data-div-select" value={Crt} min={1}
                        style={{width: "35%"}} onChange={(e) => setCRt(e.target.value)}/>
                        <button className='btn-export-pdf' onClick={() => addRemito()}>+</button>
                    </div>
                    )}
                    {!customCheck && (
                    <div>
                        <h4 className='title-Homepage'>Ingrese el remito inicial - final</h4>
                        <input type="number" id='startrt' className="data-div-select" value={startRt} min={1}
                        style={{width: "35%"}} onChange={(e) => setStartRt((e.target.value) ? parseInt(e.target.value) : 0)}/>
                        <input type="number" id='startrt' className="data-div-select" value={endRt} min={1}
                        style={{width: "35%"}} onChange={(e) => setEndtRt((e.target.value) ? parseInt(e.target.value) : 0)}/>
                    </div>
                    )}
                    <div>
                    </div>
                    {customRt.length > 0 && (
                    <div style={{marginTop: 20}}>
                    <h4 className='title-Homepage'>Remitos:</h4>
                    <table style={{fontSize: "small", width: 380}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "25%"}}>Remitos</th>
                            </tr>
                            {customRt.map((rt) => (
                            <tr>
                                <th style={{border: "1px solid", width: "25%"}}>{rt}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>  
                    )}
                    <div>
                        {((startRt > 0 && endRt > 0 && endRt >= startRt) || customRt.length > 0) && <button className='btn-big' style={{width: "85%"}} onClick={() => getEnvios()}>Desgloses</button>}
                    </div>
                    <div>
                        {((startRt > 0 && endRt > 0 && endRt >= startRt) || customRt.length > 0) && <button className='btn-big' style={{width: "85%"}} onClick={() => getHojaRuta()}>Hoja de Ruta</button>}
                    </div>
                    <div>
                        {((startRt > 0 && endRt > 0 && endRt >= startRt) || customRt.length > 0) && <button className='btn-big' style={{width: "85%"}} onClick={() => getActas()}>Actas</button>}
                    </div>
                    <div>
                        {(startRt > 0 && endRt > 0 && endRt >= startRt) && <button className='btn-big' style={{width: "85%"}} onClick={() => exportEnvio()}>Exportar</button>}
                    </div>
                    <div>
                        {((startRt > 0 && endRt > 0 && endRt >= startRt) || customRt.length > 0) && <button className='btn-big' style={{width: "85%"}} onClick={() => getRemitos()}>Remitos</button>}
                    </div>

                </div>
            </div>
        )
    }
    const displayInsumos = () => {
        const changeInsumoStats = async (ins_id: number, stat: string, def: number) => {
            let newVal = prompt("Ingrese el nuevo valor: ", def.toString())
            if(newVal !== undefined && newVal !== null && global) {
                const data: IChangeEnvioInsumo = {ins_id,stat,newVal: parseFloat(newVal)}
                console.log(data)
                await global.patchInsumoEnvio(data)
            }
            else alert("No se cambio ningun valor.")
        }
        const createNewInsumoFn = async () => {
            if(global && createInsumo.des.length > 0 && createInsumo.cod1.length > 0 && createInsumo.cod2.length > 0 && createInsumo.gr_racion && createInsumo.gr_total && createInsumo.racbolsa
                && confirm("¿Quieres crear este nuevo insumo?")) {
                    await global.postNewInsumoEnvio(createInsumo)
                    setCreateIns({des: "",caja_palet: 0,unidades_caja: 0,gr_racion: 0,gr_total: 0,racbolsa: 0,raccaja: 0,cod1:"",cod2:""})
                }
            else alert("Faltan datos para crear el insumo.")
        }
        const displayInsumosStats = () => {
            if(selectedIns){
                const insumo = insumos.filter((insI) => insI.ins_id === selectedIns)[0]
                if(insumo) {
                    return (
                    <table style={{fontSize: "small", width: 380}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "20%"}}>Caja x palet</th>
                                <th style={{border: "1px solid", width: "20%"}}>Bolsa x caja</th>
                                <th style={{border: "1px solid", width: "20%"}}>Gr x racion</th>
                                <th style={{border: "1px solid", width: "20%"}}>Rac x bolsa</th>
                                <th style={{border: "1px solid", width: "20%"}}>Rac x Caja</th>
                            </tr>
                            <tr>
                                <th style={{border: "1px solid", width: "20%"}}
                                onClick={() => changeInsumoStats(selectedIns,"caja_palet",insumo.caja_palet)}>
                                    {insumo.caja_palet}
                                    </th>
                                <th style={{border: "1px solid", width: "20%"}}
                                onClick={() => changeInsumoStats(selectedIns,"unidades_caja",insumo.unidades_caja)}>
                                    {insumo.unidades_caja}
                                    </th>
                                <th style={{border: "1px solid", width: "20%"}}
                                onClick={() => changeInsumoStats(selectedIns,"gr_racion",insumo.gr_racion)}>
                                    {insumo.gr_racion}
                                </th>
                                <th style={{border: "1px solid", width: "20%"}}
                                onClick={() => changeInsumoStats(selectedIns,"racbolsa",insumo.racbolsa)}>
                                    {insumo.racbolsa}
                                </th>
                                <th style={{border: "1px solid", width: "20%"}}
                                onClick={() => changeInsumoStats(selectedIns,"raccaja",insumo.raccaja)}>
                                    {insumo.raccaja}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    )
                }
            }
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Insumos 
                    </h2>
                    <h4 className='title-Homepage'>Seleccione el insumo a consultar</h4>
                    <select name="plan" className='filter-sub' value={selectedIns} onChange={(e) => setSelectedIns(parseInt(e.target.value))}>
                        <option value={0}>---</option>
                        {insumos.map((ins) => (
                            <option value={ins.ins_id}>{ins.des}</option>
                        ))}
                    </select>
                    {displayInsumosStats()}
                    <div>
                        <h4 className='title-Homepage'>Agregar Insumo</h4>
                        <div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Codigo: </h5>
                                <input type="number" value={createInsumo.cod1} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, cod1:e.target.value})}/>
                                <h5 className='title-Homepage'>-</h5>
                                <input type="number" value={createInsumo.cod2} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, cod2:e.target.value})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Descripcion: </h5>
                                <input type="text" value={createInsumo.des} onChange={(e) => setCreateIns({...createInsumo, des:e.target.value})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Unidades por caja: </h5>
                                <input type="number" value={createInsumo.unidades_caja} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, unidades_caja:parseInt(e.target.value)})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Raciones unidad: </h5>
                                <input type="number" value={createInsumo.racbolsa} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, racbolsa:parseInt(e.target.value)})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Raciones Caja: </h5>
                                <input type="number" value={createInsumo.raccaja} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, raccaja:parseInt(e.target.value)})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Gramos por racion: </h5>
                                <input type="number" value={createInsumo.gr_racion} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, gr_racion:parseFloat(e.target.value)})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Gramos totales: </h5>
                                <input type="number" value={createInsumo.gr_total} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, gr_total:parseInt(e.target.value)})}/>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                                <h5 className='title-Homepage'>Cajas por palet: </h5>
                                <input type="number" value={createInsumo.caja_palet} style={{width: 80}} onChange={(e) => setCreateIns({...createInsumo, caja_palet:parseInt(e.target.value)})}/>
                            </div>
                            <button className='btn-export-pdf' onClick={() => createNewInsumoFn()}>CREAR</button>
                        </div>

                    </div>                
                </div>
            </div>
        )
    }
    const displayPlanes = () => { 
        const changeInsumoStats = async (detail_id: number, def: number) => {
            let newVal = prompt("Ingrese el nuevo valor: ", def.toString())
            if(newVal !== undefined && newVal !== null && global) {
                const data: IChangeEnvioInsumoPlan = {detail_id,newVal: parseInt(newVal)}
                await global.patchInsumoEnvioPlan(data)

            }
            else alert("No se cambio ningun valor.")
        }
        const deleteInsumoStat = async (detail_id: number, index: number) => {
            if(confirm("Quieres eliminar este insumo? "+planes[selectedPlan].details[index].des) && global) {
                await global.deleteInsumoEnvioPlan(detail_id)
            }
        }
        const createPlan = async () => {
            const des = prompt("¿Ingrese la descripcion del nuevo plan?")
            if(des && confirm(`¿Quieres crear un nuevo plan llamado ${des}?`)){
                const dias = prompt("Ingrese los dias habiles del plan:")
                if(dias && parseInt(dias) && confirm(`¿Plan ${des} por ${dias} dias?`) && global){
                    await global.addPlan(des, parseInt(dias))
                }
            }
        }
        const addInsumo = async (index: number) => {
            const plan_id = planes[selectedPlan].plan_id
            const insumo = insumos[index]
            if(confirm("¿Quieres agregar "+insumo.des+"?")){
                const dias = prompt("Dias a asignar: ")
                if(dias !== undefined && dias !== null && global) {
                    if(confirm(`¿Quieres agregar ${insumo.des} con ${dias} al plan?`)){
                        await global.addInsumoEnvioPlan(plan_id,insumo.ins_id, parseInt(dias))
                    }
                }
            }
        }
        const displayPlan = () => {
            if(selectedPlan !== 1000){
                return(
                    <div>
                    <table style={{fontSize: "small", width: 380}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "80%"}}>Insumo (Apreta para eliminar)</th>
                                <th style={{border: "1px solid", width: "20%"}}>Dias (e)</th>
                            </tr>
                            {planes[selectedPlan].details.map((d,i) => (
                            <tr key={d.detail_id}>
                                <th style={{border: "1px solid", width: "80%"}}
                                onClick={() => deleteInsumoStat(d.detail_id,i)}>
                                    {d.des}
                                </th>
                                <th style={{border: "1px solid", width: "20%"}}
                                onClick={() => changeInsumoStats(d.detail_id,d.dias)}>
                                    {d.dias}
                                </th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='btn-export-pdf' onClick={() => {window.location.reload()}}>Actualizar</button>
                    <h4 className='title-Homepage'>Seleccione el insumo a agregar</h4>
                    <select name="plan" className='filter-sub' value={selectedIns} onChange={(e) => addInsumo(parseInt(e.target.value))}>
                        <option value={0}>---</option>
                        {insumos.map((ins,i) => (
                            <option value={i}>{ins.des}</option>
                        ))}
                    </select>
                    </div>
                )
            }
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Planes 
                    </h2>
                    <h4 className='title-Homepage'>Seleccione el plan a utilizar</h4>
                    <select name="plan" className='filter-sub' value={selectedPlan} onChange={(e) => setSelectedPlan(parseInt(e.target.value))}>
                        <option value={1000}>---</option>
                        {planes.map((p,i) => (
                            <option value={i}>{p.des + " x "+p.dias}</option>
                        ))}
                    </select>
                    <button className='btn-export-pdf' onClick={() => {createPlan()}}>Crear Plan</button>
                    {displayPlan()}               
                </div>
            </div>
        )
    }
    const displayInformes = () => {
        const getInformeFecha = async () => {
            const lienas = await global?.getInformeDate(fecha)
            if(lienas) {
                setFecha("")
                informeEnviosTxt(lienas)
            }
        }
        const informeFacturacion = async () => {
            if(global && createFactura.factura_cod1.length > 0 && createFactura.factura_cod2.length > 0) {
                const format = refillEmptySpace(5,parseInt(createFactura.factura_cod1))+"-"+refillEmptySpace(8,parseInt(createFactura.factura_cod2))
                const informFac = await global.getFacturaInfFn(format)
                if(informFac.length > 0){
                    let checkCL = true
                    informFac.forEach(fac => {if(fac.fortificado) checkCL=false});
                    if(checkCL) {
                        const titulo = 'Detalle de Relaciones de Refrigerios Fortificados Reforzados\nAnexo Factura Nro. FC B '+format
                        const blob: Blob = await pdf(<InformeFacturacionPDF data={informFac} title={titulo} fecha={informFac[0].fecha}/>).toBlob()
                        saveAs(blob, 'SGP_FACTURA_'+format)
                    }
                    else {
                        const titulo = 'Detalle de Relaciones de Almuerzos Fortificados Reforzados\nAnexo Factura Nro. FC B '+format
                        const blob: Blob = await pdf(<InformeFacturacionPDF data={informFac} title={titulo} fecha={informFac[0].fecha}/>).toBlob()
                        saveAs(blob, 'SGP_FACTURA_'+format)
                    }
                }
                else alert("No existe remitos en esta factura.")
            }
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Generar informes de Envio 
                    </h2>
                    <div>
                        <h4 className='title-Homepage'>Ingrese la fecha</h4>
                        <input type="date" id='otherins' className="data-div-select" value={fecha}
                        style={{width: "35%"}} onChange={(e) => setFecha(e.target.value)}/>
                    </div>
                    <div>
                        {fecha && <button className='btn-big' onClick={() => getInformeFecha()}>Informe fecha</button>}
                    </div>

                </div>
                <div>
                    <h2 className='title-Homepage' >
                        Generar informes de Facturacion 
                    </h2>
                    <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                        <h5 className='title-Homepage'>Factura: </h5>
                        <input type="number" value={createFactura.factura_cod1} style={{width: 40}} onChange={(e) => setCreateFactura({...createFactura, factura_cod1:e.target.value})}/>
                        <h5 className='title-Homepage'>-</h5>
                        <input type="number" value={createFactura.factura_cod2} style={{width: 80}} onChange={(e) => setCreateFactura({...createFactura, factura_cod2:e.target.value})}/>
                    </div>
                    <div>
                        {(createFactura.factura_cod1.length > 0 && createFactura.factura_cod2.length > 0) && <button className='btn-big' onClick={() => informeFacturacion()}>Informe Factura</button>}
                    </div>

                </div>
            </div>
        )
    }
    const displayData = () => {
        const modData = async (id: number) => {
            const payload = prompt("Ingrese el nuevo valor numerico")
            if(payload !== undefined && payload !== null && global) {
                await global.editDataEnvios(id,parseInt(payload))
            }
            else alert("No se cambio ningun valor.")
        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Datos 
                    </h2>
                    <div>
                        <h4 className='title-Homepage'>Siguiente Remito: {lastRt + 1}</h4>
                        <button className='btn-export-pdf' onClick={() => modData(1)}>Modificar</button>
                    </div>
                    <div>
                        <h4 className='title-Homepage'>Fin de Talonario: {endTal}</h4>
                        <button className='btn-export-pdf' onClick={() => modData(6)}>Modificar</button>
                    </div>
                    <div>
                        <h4 className='title-Homepage'>PV: {pv}</h4>
                        <button className='btn-export-pdf' onClick={() => modData(2)}>Modificar</button>
                    </div>
                    <div>
                        <h4 className='title-Homepage'>CAI: {cai}</h4>
                        <button className='btn-export-pdf' onClick={() => modData(4)}>Modificar</button>
                    </div>
                    <div>
                        <h4 className='title-Homepage'>Fecha de Vencimiento: {venc}</h4>
                        <button className='btn-export-pdf' onClick={() => modData(5)}>Modificar</button>
                    </div>
                </div>
            </div>
        )
    }
    const displayGenerarEnvio = () => {
        const getDesgloses = async () => {
            global?.getLugaresEntreFn(selectedDep, fortificado).then(lgs => {
                setCabeceras(lgs.cabeceras)
                setLugaresEntrega(lgs.desgloses)
            })
        }
        const addTotalLugar = () => {
            filteredDesgloses.forEach((fd) => {
                addLugar(parseInt(fd.cue))
            })
        }
        const addLugar = (cue: number) => {
            let newArr:IDesglosesReturner[] = []
            let check = false

            selectedLgsEnt.forEach(lg => {
                if(parseInt(lg.cue) === cue && Boolean(fortificado) === lg.fortificado) {
                    alert("Dependencia ya agregada.")
                    check = true
                }
            });
            if(!check) {
                filteredDesgloses.forEach(element => {
                    if(parseInt(element.cue) === cue) {
                        element.planId = planes[selectedPlan].plan_id
                        element.fortificado = fortificado > 0 ? true : false
                        setSelectedLgsEnt(lgrs => [...lgrs, element])
                    }
                    else {
                        newArr.push(element)
                    }
                });
                setFilteredDesgloses(newArr)
            }

        }
        const deleteLugar = (index: number,lgr: IDesglosesReturner) => {
            if(confirm(`¿Quieres eliminar el lugar "${lgr.des}"?`)) {
                const arr = selectedLgsEnt
                arr.splice(index,1)
                setSelectedLgsEnt(arr)
                setFilteredDesgloses(lgrs => [...lgrs, lgr])
                setUpdater(updater+1)
            }
        }
        const racReturner = (lgs: IDesglosesReturner): number | string => {
            let racionesFinal = 0
            planes.forEach(p => {
                if(p.plan_id === lgs.planId) {
                    if(p){
                        if(lgs.fortificado) {
                            racionesFinal = lgs.rac_al ? lgs.rac_al * p.dias : 0
                        }
                        else {
                            racionesFinal = lgs.rac_cl ? lgs.rac_cl * p.dias : 0
                        }
                    }
                    else return "NaN"
                }
            });
            return racionesFinal
        }
        const createEnvios = async () => {
            const data = desglosesParser(selectedLgsEnt,insumos,planes)
            console.log(data)
            let lineas = []
            if(data && global) {
                const updater = confirm("¿Quieres que se actualicen los remitos?")
                const res = await global.createEnvios(data, updater)
                lineas.push(res)
                informeEnviosTxt(lineas)
            }

        }
        return(
            <div>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Cargar un envio 
                    </h2>
                    <button className='btn-export-pdf' onClick={() => limpiarTodo()}>LIMPIAR</button>
                    {remitosRemain() <= 100 && <h4 className='title-Homepage' style={{color: "red"}}>Remitos restantes del talonario {remitosRemain()}</h4>}
                    <h4 className='title-Homepage'>Seleccione el plan a utilizar</h4>
                    <select name="plan" className='filter-sub' value={selectedPlan} onChange={(e) => setSelectedPlan(parseInt(e.target.value))}>
                        <option value={1000}>---</option>
                        {planes.map((p,i) => (
                            <option value={i}>{p.des + " x "+p.dias}</option>
                        ))}
                    </select>
                    <select name="plan" className='filter-sub' value={fortificado} onChange={(e) => setFortificado(parseInt(e.target.value))}>
                        <option value={0}>COPA DE LECHE</option>
                        <option value={1}>ALMUERZO</option>
                    </select>
                    <div style={{marginTop: 20}}>
                        <h4 className='title-Homepage'>Seleccione el departamento</h4>
                        <select name="plan" className='filter-sub' value={selectedDep} onChange={(e) => setSelectedDep(e.target.value)} disabled={selectedPlan < 1000 ? false : true}>
                            <option value={""}>---</option>
                            {departamentos.map((p) => (
                                <option value={p}>{p}</option>
                            ))}
                        </select>
                        <button className='btn-export-pdf' onClick={() => getDesgloses()} 
                        disabled={selectedDep.length > 0 ? false : true}>Buscar</button>
                    </div>
                    {(cabeceras.length > 0 && selectedDep.length > 0) && (
                    <div style={{marginTop: 20}}>
                        <h4 className='title-Homepage'>Seleccione la Cabecera</h4>
                        <select name="plan" className='select-small-cco' value={selectedCabecera} onChange={(e) => setSelectedCabecera(parseInt(e.target.value))}>
                            <option value={0}>---</option>
                            {cabeceras.map((p) => (
                                <option value={p.lentrega_id}>{p.lentrega_id+"-"+p.completo}</option>
                            ))}
                        </select>
                    </div>  
                    )}
                    {(lugaresEntrega.length > 0 && selectedCabecera > 0) && (
                    <div style={{marginTop: 20}}>
                        <h4 className='title-Homepage'>Seleccione la Dependencia</h4>
                        <select name="plan" className='select-small-cco' style={{width: 200}} value={selectedDep} onChange={(e) => addLugar(parseInt(e.target.value))} disabled={selectedPlan < 1000 ? false : true}>
                            <option value={0}>---</option>
                            {filteredDesgloses.map((p) => (
                                <option value={p.cue}>{p.des}</option>
                            ))}
                        </select>
                        <button className='btn-export-pdf' onClick={() => addTotalLugar()}>Agregar todos</button>

                    </div>  
                    )}
                    {selectedLgsEnt.length > 0 && (
                    <div style={{marginTop: 20}}>
                    <h4 className='title-Homepage'>Resumen de envio:</h4>
                    <table style={{fontSize: "small", width: 420}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "25%"}}>Desgloses</th>
                                <th style={{border: "1px solid", width: "25%"}}>Remitos</th>
                                <th style={{border: "1px solid", width: "25%"}}>Palets aprx.</th>
                                <th style={{border: "1px solid", width: "25%"}}>Raciones aprx</th>
                            </tr>
                            <tr>
                                <th style={{border: "1px solid", width: "25%"}}>{selectedLgsEnt.length}</th>
                                <th style={{border: "1px solid", width: "25%"}}>{totalPalets.totalRemitos}</th>
                                <th style={{border: "1px solid", width: "25%"}}>{totalPalets.palets}</th>
                                <th style={{border: "1px solid", width: "25%"}}>{totalPalets.racs}</th>
                            </tr>
                        </tbody>
                    </table>
                    </div>  
                    )}
                    {selectedLgsEnt.length > 0 && (
                    <div style={{marginTop: 20}}>
                    <h4 className='title-Homepage'>Lugares Cargados:</h4>
                    <table style={{fontSize: "small", width: 420}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "10%"}}>ID</th>
                                <th style={{border: "1px solid", width: "40%"}}>Dependencia</th>
                                <th style={{border: "1px solid", width: "40%"}}>Localidad</th>
                                <th style={{border: "1px solid", width: "10%"}}>Raciones</th>
                                <th style={{border: "1px solid", width: "10%"}}>Tipo</th>
                            </tr>
                            {selectedLgsEnt.map((d,i) => (
                            <tr key={d.cue} onClick={() => deleteLugar(i,d)}>
                                <th style={{border: "1px solid", width: "10%"}}>{d.lentrega_id}</th>
                                <th style={{border: "1px solid", width: "40%"}}>{d.des}</th>
                                <th style={{border: "1px solid", width: "40%"}}>{d.localidad}</th>
                                <th style={{border: "1px solid", width: "10%"}}>{racReturner(d)}</th>
                                <th style={{border: "1px solid", width: "10%"}}>{d.fortificado ? "AL" : "CL"}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>  
                    )}
                    {selectedLgsEnt.length > 0 && <button className='btn-big' onClick={() => createEnvios()}>CREAR ENVIOS</button>}
                </div>
            </div>
        )
    }
    const displayRemitos = () => {
        
        const colorChange = (state: string) => {
            if(state === "PENDIENTE") {
                return "gold"
            }
            else if(state === "PREPARADO") {
                return "lightgreen"
            }
            else if(state === "DESPACHADO") {
                return "Tan"
            }
            else if(state === "ENTREGADO") {
                return "Lime"
            }
            else if(state === "NO ENTREGADO" || state === "EXTRAVIADO" || state === "DEVOLUCION") {
                return "Tomato"
            }
            else if(state === "ENTRADA"){
                return "Orange"
            } 
        }

        const stateManagement = (state: string,rt: string) => {
            if(state === "PENDIENTE") {
                const newState = "PREPARADO"
                return <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState),borderColor: colorChange(newState)}} onClick={() => changeState(rt,newState)}>PREPARADO</button>
            }
            else if(state === "PREPARADO") {
                const newState = "DESPACHADO"
                return <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState),borderColor: colorChange(newState)}} onClick={() => changeState(rt,newState)}>DESPACHADO</button>
            }
            else if(state === "DESPACHADO") {
                const newState = "ENTREGADO"
                const newState2 = "NO ENTREGADO"
                return (
                    <div>
                        <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState),borderColor: colorChange(newState)}} onClick={() => changeState(rt,newState)}>ENTREGADO</button>
                        <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState2),borderColor: colorChange(newState2)}} onClick={() => changeState(rt,newState2)}>NO ENTREGADO</button>
                    </div>
                )
            }
            else if(state === "ENTREGADO") {
                const newState = "ENTRADA"
                const newState2 = "EXTRAVIADO"
                const newState3 = "DEVOLUCION"
                return (
                    <div>
                        <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState),borderColor: colorChange(newState)}} onClick={() => changeState(rt,newState)}>ENTRADA</button>
                        <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState2),borderColor: colorChange(newState2)}} onClick={() => changeState(rt,newState2)}>EXTRAVIADO</button>
                        <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState3),borderColor: colorChange(newState3)}} onClick={() => changeState(rt,newState3)}>DEVOLUCION</button>
                    </div>
                )
            }
            else if(state === "DEVOLUCION") {
                const newState = "ENTRADA"
                return (
                    <div>
                        <button className='btn-export-pdf' style={{backgroundColor: colorChange(newState),borderColor: colorChange(newState)}} onClick={() => changeState(rt,newState)}>ENTRADA</button>
                    </div>
                )    
            }
        }


        const searchRemitoFn = () => {
            setSearchRemito("")
            let totalRemitos: IRemitosEnvio[] = []
            remitosView.forEach(rtv => {
                rtv.forEach((rts) => totalRemitos.push(rts))
            });
            if(searchRemito.length > 0 && searchPv.length > 0) {
                const format = refillEmptySpace(5,parseInt(searchPv))+"-"+refillEmptySpace(8,parseInt(searchRemito))
                console.log(format)
                totalRemitos = totalRemitos.filter(rts => rts.nro_remito === format)
            }
            if(searchState.length > 0) {
                totalRemitos = totalRemitos.filter(rts => rts.estado === searchState)
            }
            if(searchFac === 1) {
                totalRemitos = totalRemitos.filter(rts => rts.factura && rts.factura.length > 0)
            }
            if(searchFac === 2) {
                totalRemitos = totalRemitos.filter(rts => rts.factura === null)
            }
            if(totalRemitos.length === 0) alert("No se encontraron remitos")
            setFilteredRemitosView(totalRemitos)
        }

        const changeState = async (remito: string, newstate: string) => {
            if(customCheck) {
                if(confirm("Quieres cambiar el estado de los remitos a "+newstate+"?") && global && customDate.length > 0) {
                    global.changeEnviosStateRemitosMultiple(newstate,customRt)
                    setCustomDate("")
                    setCustomRt([])
                }
                else alert("No se cambio el estado")
            }
            else {
                if(confirm("Quieres cambiar el estado del remito "+remito+"?") && global) {
                    global.changeEnviosStateRemitos(newstate,remito,customDate.length > 0 ? customDate : "" )
                    remitosView.forEach(rts => {
                        rts.forEach(rt => {
                            if(rt.nro_remito === remito) rt.estado = newstate
                        });
                    });
                    setCustomDate("")
                    //setRemitosView(remitosView)
                    setUpdater(updater+1)
                }
            }

        }

        const addRt = (rt: string) => {
            let check = false
            customRt.forEach(ret => {
                if(rt === ret){
                    alert("Remito ya agregado")
                    check = true
                }
            });
            if(check) return 0
            setCustomRt(rts => [...rts, rt])
        }

        const traerReportes = async () => {
            if(global && selectedRemito) {
                global.getReportesEnvio(selectedRemito.nro_remito).then(rpts => setRemitoReport(rpts))
            }
        }

        const createReporteFn = async () => {
            console.log(selectedRemito?.nro_remito,createReporte.des,createReporte.titulo)
            if(global &&  selectedRemito && createReporte.titulo.length > 0 && createReporte.des.length > 0 && selectedRemito.nro_remito.length > 0 && confirm("¿Quieres crear el reporte?")) {
                global.createReportesEnvio(selectedRemito?.nro_remito,createReporte.titulo,createReporte.des)
                setCreateReporte({titulo: "",des: ""})
                setSelectedReporte(10000)
            }
        }
        const delRt = (index: number) => {
            const arr = customRt
            arr.splice(index,1)
            setCustomRt(arr)
            setUpdater(updater+1)
        }

        return (
            <div>
                <hr color='#3399ff' className='hr-line'/>
                    <h2 className='title-Homepage' >
                        Remitos 
                    </h2>
                    <hr color='#3399ff' className='hr-line'/>
                    <div style={{minHeight: 80, marginLeft: 80}}>
                        {selectedRemito && (
                            <div style={{textAlign:"left"}}>
                                <h4 className='title-Homepage'>Remito: {selectedRemito.nro_remito}</h4>
                                <h5 className='title-Homepage'>Estado: {selectedRemito.estado}</h5>
                                {selectedRemito.factura && <h5 className='title-Homepage'>Factura: {selectedRemito.factura}</h5>}
                                <h5 className='title-Homepage'>Dias habiles de cobertura: {selectedRemito.dias}</h5>
                                <h5 className='title-Homepage'>Ultimo movimiento: {selectedRemito.ultima_mod.split("T")[0]}</h5>
                                <div>
                                    <h5 className='title-Homepage'>Fecha de cambio de estado (dejar vacio si quiere la fecha de hoy)</h5>
                                    <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)}/>
                                </div>
                                <h5 className='title-Homepage'>Cambiar Estado:{stateManagement(selectedRemito.estado,selectedRemito.nro_remito)}</h5>
                                <button className='btn-export-pdf' onClick={() => traerReportes()}>REPORTES</button>
                                <button className='btn-export-pdf' onClick={() => setSelectedReporte(-1)}>CREAR REPORTE</button>
                                <div>
                                {remitosReport.length > 0 && (
                                    <table style={{fontSize: "small", width: 350,tableLayout: "fixed"}}>
                                        <tbody>
                                            <tr >
                                                <th style={{border: "1px solid", width: "50%"}}>Titulo</th>
                                                <th style={{border: "1px solid", width: "50%"}}>Fecha</th>
                                            </tr>
                                            { remitosReport.map((d,i) => (
                                            <tr key={i} style={{backgroundColor: selectedReporte === i ? "grey": "white"}}
                                            onClick={() => setSelectedReporte(i)}>
                                                <th style={{border: "1px solid", width: "50%"}}>{d.titulo}</th>
                                                <th style={{border: "1px solid", width: "50%"}}>{d.fecha.split("T")[0]}</th>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table> 
                                )}
                                {selectedReporte === -1 && (
                                    <div>
                                        <hr color='#3399ff' className='hr-line'/>
                                        <div>
                                            <h4 className='title-Homepage'>Categoria:</h4>
                                            <select name="plan" className='filter-sub' value={createReporte.titulo} onChange={(e) => setCreateReporte({...createReporte, titulo: e.target.value})}>
                                                <option key={"nada"} value={""}>----</option>
                                                {reportesCategoriasJSON.cats.map((ct) => (
                                                    <option key={ct} value={ct}>{ct}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <textarea value={createReporte.des} className='texarea-details-big' style={{height: 120}} onChange={(e) => setCreateReporte({...createReporte, des: e.target.value})}/>
                                        </div>
                                        <button className='btn-export-pdf' onClick={() => createReporteFn()}>REGISTRAR REPORTE</button>
                                    </div>
                                )}
                                {(selectedReporte < 10000 && selectedReporte >= 0) && (
                                    <div>
                                        <hr color='#3399ff' className='hr-line'/>
                                        <h4 className='title-Homepage'>Descripcion:</h4>
                                        <p className='description-report'>
                                            {remitosReport[selectedReporte].des}
                                        </p>
                                    </div>
                                )}

                                </div>
                            </div>
                        )}
                    </div>
                    <hr color='#3399ff' className='hr-line'/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <h4 className='title-Homepage'>Seleccion de remitos:</h4>
                        <input type="checkbox" checked={customCheck} onChange={(e) => setCustomCheck(e.target.checked)}/>
                    </div>
                    {customRt.length > 0 && (
                        <div>
                            <h5 className='title-Homepage'>Seleccion el nuevo estado:</h5>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <select name="estados" value={customDate} onChange={(e) => setCustomDate(e.target.value)}>
                                        <option value={""}>---</option>
                                        <option value={"PREPARADO"}>PREPARADO</option>
                                        <option value={"DESPACHADO"}>DESPACHADO</option>
                                        <option value={"ENTRADA"}>ENTRADA</option>
                                    </select>
                                </div>
                            <button className='btn-export-pdf' onClick={() => changeState("",customDate)}>CAMBIAR</button>
                        </div>

                    )}
                    {customRt.length > 0 && (
                    <div >
                        <table style={{fontSize: "small", width: 380}}>
                            <tbody>
                                <tr><th style={{border: "1px solid", width: "25%"}}>Remitos Agregados</th></tr>
                                {customRt.map((rt,i) => (<tr onClick={() => delRt(i)}><th style={{border: "1px solid", width: "25%"}}>{rt}</th></tr>))}
                            </tbody>
                        </table>
                    </div>

                    )}
                    {!customCheck && (
                        <div >
                            <h4 className='title-Homepage' style={{alignContent: "center"}}>REMITO</h4>
                            <input type="number" value={searchPv} className="data-div-select" style={{width: 30}} onChange={(e) => setSearchPv(e.target.value)}/>
                            <input type="number" value={searchRemito} className="data-div-select" style={{width: 50}} onChange={(e) => setSearchRemito(e.target.value)}/>
                            <h4 className='title-Homepage'>Estado:</h4>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <select name="estados" value={searchState} onChange={(e) => setSearchState(e.target.value)}>
                                        <option value={""}>---</option>
                                        <option value={"PENDIENTE"}>PENDIENTE</option>
                                        <option value={"PREPARADO"}>PREPARADO</option>
                                        <option value={"DESPACHADO"}>DESPACHADO</option>
                                        <option value={"ENTREGADO"}>ENTREGADO</option>
                                        <option value={"NO ENTREGADO"}>NO ENTREGADO</option>
                                        <option value={"EXTRAVIADO"}>EXTRAVIADO</option>
                                        <option value={"DEVOLUCION"}>DEVOLUCION</option>
                                        <option value={"ENTRADA"}>ENTRADA</option>
                                    </select>
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <h4 className='title-Homepage'>Facturado:</h4>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <select name="estados" value={searchFac} onChange={(e) => setSearchFac(parseInt(e.target.value))}>
                                        <option value={0}>---</option>
                                        <option value={1}>SI</option>
                                        <option value={2}>NO</option>
                                    </select>
                                </div>
                                </div>
                            <button className='btn-export-pdf' onClick={() => searchRemitoFn()}>BUSCAR</button>
                            <button className='btn-export-pdf' onClick={() => setFilteredRemitosView([])}>BORRAR</button>
                        </div>
                    )}
                    <div style={{overflow: "scroll",width: "auto", minHeight: 600,maxHeight: 800}}>
                    <table style={{fontSize: 9, width: "100%", tableLayout: "fixed", textOverflow: "ellipsis"}}>
                        <tbody>
                            <tr >
                                <th style={{border: "1px solid", width: "20%"}}>Remito</th>
                                <th style={{border: "1px solid", width: "20%"}}>Localidad</th>
                                <th style={{border: "1px solid", width: "20%"}}>Depart.</th>
                                <th style={{border: "1px solid", width: "20%"}}>Estado</th>
                                <th style={{border: "1px solid", width: "8%"}}>Rep.</th>
                                <th style={{border: "1px solid", width: "8%"}}>Fac.</th>
                            </tr>
                            { filteredRemitosView.length > 0 ? 
                            filteredRemitosView.map((d) => (
                            <tr key={d.nro_remito} onClick={() => customCheck ? addRt(d.nro_remito) : setSelectedRemito(d)} style={{backgroundColor: colorChange(d.estado)}}>
                                <th style={{border: "1px solid", width: "20%"}}>{d.nro_remito}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{d.localidad.toUpperCase()}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{d.departamento}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{d.estado}</th>
                                <th style={{border: "1px solid", width: "8%"}}>{d.reportes}</th>
                                <th style={{border: "1px solid", width: "8%"}}>{d.factura ? "SI" : "NO"}</th>
                            </tr>
                            )) 
                            : remitosView[remitoPage] && remitosView[remitoPage].map((d) => (
                            <tr key={d.nro_remito} onClick={() => customCheck ? addRt(d.nro_remito) : setSelectedRemito(d)} style={{backgroundColor: colorChange(d.estado)}}>
                                <th style={{border: "1px solid", width: "20%"}}>{d.nro_remito}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{d.localidad.toUpperCase()}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{d.departamento}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{d.estado}</th>
                                <th style={{border: "1px solid", width: "8%"}}>{d.reportes}</th>
                                <th style={{border: "1px solid", width: "8%"}}>{d.factura ? "SI" : "NO"}</th>

                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    {filteredRemitosView.length === 0 && (
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {remitoPage > 0 && <button className='btn-export-pdf' onClick={() => setRemitoPage(remitoPage - 1)}>{"<---"}</button>}
                        <h4 className='title-Homepage'>{remitoPage + 1}</h4>
                        {remitoPage < remitosView.length - 1 && <button className='btn-export-pdf' onClick={() => setRemitoPage(remitoPage + 1)}>{"--->"}</button>}
                    </div>
                    )}
            </div>
        )
    }
    const displayFacturacion = () => {

        const addRt = async () => {
            if(searchPv.length > 0 && Crt.length > 0) {
                const format = refillEmptySpace(5,parseInt(searchPv))+"-"+refillEmptySpace(8,parseInt(Crt))
                const check = await global?.checkRemitoFacturacionFn(format)
                const checkRt = customRt.includes(format)
                if(check && !checkRt) {
                    setCustomRt(rt => [...rt, format])
                    setCRt("")
                    setSearchPv("")
                }
                else alert("Remito ya tiene asignada una factura o ya esta agregado en la lista.")
            }
            else {
                alert("Remito no existente")
                setCRt("")
            }
        }

        const delRt = (index: number) => {
            const arr = customRt
            arr.splice(index,1)
            setCustomRt(arr)
            setUpdater(updater+1)
        }

        const createFacturacion = () => {
            if(global && createFactura.factura_cod1.length > 0 && createFactura.factura_cod2.length > 0 && customRt.length > 0 && createFactura.fecha.length > 0){
                const format = refillEmptySpace(5,parseInt(createFactura.factura_cod1))+"-"+refillEmptySpace(8,parseInt(createFactura.factura_cod2))
                if(confirm("¿Quieres facturar "+format+"?") && global) {
                    global.postFacturaRemito(format,createFactura.fecha,customRt)
                    setCustomRt([])
                    setCreateFactura({factura_cod1: "",factura_cod2:"",remitos:[],fecha:""})
                }
            }
            else alert("Faltan datos.")
        }

        const checkCountFactura = async () => {
            if(global && createFactura.factura_cod1.length > 0 && createFactura.factura_cod2.length > 0) {
                const format = refillEmptySpace(5,parseInt(createFactura.factura_cod1))+"-"+refillEmptySpace(8,parseInt(createFactura.factura_cod2))
                const amount = await global.getFacturaCountFn(format)
                alert(amount ? "Cantidad de Remitos facturados en "+format+" : "+amount.count+"\nRaciones: "+amount.raciones+"\nFacturado: "+Intl.NumberFormat("es-AR",{style: "currency", currency: "ARS"}).format(amount.raciones * 1000) : "No existen remitos facturados en "+format)
            }
            else alert("Ingrese una factura valida")

        }

        return (
            <div>
                <hr color='#3399ff' className='hr-line'/>
                    <h2 className='title-Homepage' >
                        Facturar 
                    </h2>
                    <div>
                        <div style={{display: "flex", justifyContent: "center", height: 25, alignItems: "center"}}>
                            <h5 className='title-Homepage'>Factura: </h5>
                            <input type="number" value={createFactura.factura_cod1} style={{width: 40}} onChange={(e) => setCreateFactura({...createFactura, factura_cod1:e.target.value})}/>
                            <h5 className='title-Homepage'>-</h5>
                            <input type="number" value={createFactura.factura_cod2} style={{width: 80}} onChange={(e) => setCreateFactura({...createFactura, factura_cod2:e.target.value})}/>
                            <button className='btn-export-pdf' onClick={() => checkCountFactura()}>?</button>
                        </div>
                        <div>
                            <h5 className='title-Homepage' style={{margin: 5}}>Fecha de facturacion: </h5>
                            <input type="date" value={createFactura.fecha} style={{width: 120}} onChange={(e) => setCreateFactura({...createFactura, fecha:e.target.value})}/>
                        </div>
                        <div>
                            <h5 className='title-Homepage' style={{margin: 5}}>Remito: </h5>
                            <input type="number" id='startrt' className="data-div-select" value={searchPv} min={1} style={{width: "8%"}} onChange={(e) => setSearchPv(e.target.value)}/>
                            <input type="number" id='startrt' className="data-div-select" value={Crt} min={1} style={{width: "15%"}} onChange={(e) => setCRt(e.target.value)}/>
                            <button className='btn-export-pdf' onClick={() => addRt()}>+</button>
                        </div>
                    </div>
                    <button className='btn-export-pdf' onClick={() => createFacturacion()}>CREAR FACTURACION</button>
                    {customRt.length > 0 && (
                    <div style={{marginTop: 20}}>
                    <h4 className='title-Homepage'>Remitos a Facturar:</h4>
                    <h5 className='title-Homepage' style={{margin: 5}}>(Click para eliminar)</h5>
                    <table style={{fontSize: "small", width: 380}}>
                        <tbody>
                            <tr><th style={{border: "1px solid", width: "25%"}}>Remitos</th></tr>
                            {customRt.map((rt,i) => (<tr onClick={() => delRt(i)}><th style={{border: "1px solid", width: "25%"}}>{rt}</th></tr>))}
                        </tbody>
                    </table>
                    </div>  
                    )}
            </div>
        )
    }
    return(
        <div>
            <Header />
            <div>
                <div>
                   <hr color='#3399ff' className='hr-line'/>
                   {(global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin) ? (
                        <div>
                            <h4 className='title-Homepage'>Seleccione la accion a realizar</h4>
                            <select name="display" className='filter-sub'
                            onChange={(e)=>setDisplay(parseInt(e.target.value))}>
                                <option value={0}>---</option>
                                <option value={1}>Generar envios Excel</option>
                                <option value={8}>Generar envios</option>
                                <option value={2}>Eliminar envios</option>
                                <option value={3}>Traer envios</option>
                                <option value={9}>Ver remitos</option>
                                <option value={4}>Insumos</option>
                                <option value={5}>Planes</option>
                                <option value={6}>Informes</option>
                                <option value={10}>Facturacion</option>
                                <option value={7}>Datos</option>
                            </select>
                        </div>
                   ) : 
                   (
                        <div>
                            <h4 className='title-Homepage'>NO TIENE PERMITIDO</h4>
                        </div>
                   )}

                    <div style={{maxWidth: 800}}>
                        {(display === 1 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayGenerarEnvioExcel()}
                        {(display === 2 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayDeleteTanda()}
                        {(display === 3 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayTraerEnvios()}
                        {(display === 4 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayInsumos()}
                        {(display === 5 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayPlanes()}
                        {(display === 6 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayInformes()}
                        {(display === 7 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayData()}
                        {(display === 8 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayGenerarEnvio()}
                        {(display === 9 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayRemitos()}
                        {(display === 10 && (global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.admin)) && displayFacturacion()}
                    </div>
                </div>
            </div>
        </div>
    )
}
