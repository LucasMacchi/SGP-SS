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
import { IChangeEnvioInsumo, IChangeEnvioInsumoPlan, IDesglosesReturner, IEnvioInsumos, ILentrega, IPlanComplete, IRemitosEnvio, IrequestEnvioCom } from "../../Utils/Interfaces";
import informeEnviosTxt from "../../Utils/informeEnviosTxt";
import RemitoEnvioPdf from "../pdfs/remitoEnvio";
import paletPrevisualizer from "../../Utils/paletPrevisualizer";
import desglosesParser from "../../Utils/desglosesParser";
import refillEmptySpace from "../../Utils/refillEmptySpace";


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
    const [dias, setDias] = useState(30)
    const [selectedPlan, setSelectedPlan] = useState(1000)
    const [planes, setPlanes] = useState<IPlanComplete[]>([])
    const [insumos, setInsumos] = useState<IEnvioInsumos[]>([])
    const [selectedIns, setSelectedIns] = useState(0)
    const [departamentos, setDepartamentos] = useState<string[]>([])
    const [selectedDep, setSelectedDep] = useState("")
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
    const [selectedRemito, setSelectedRemito] = useState<IRemitosEnvio | null>(null)
    const [Crt, setCRt] = useState("")
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
    },[remitosView])


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
            const txt = await global?.getTxtEnvio(startRt, endRt, pv, dias)
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
            const format = refillEmptySpace(5,pv)+"-"+refillEmptySpace(6,parseInt(Crt))
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
                    <div>
                        <h4 className='title-Homepage'>Seleccione los dias</h4>
                        <input type="number" id='otherins' className="data-div-select" value={dias} min={1}
                        style={{width: "35%"}} onChange={(e) => setDias((e.target.value) ? parseInt(e.target.value) : 0)}/>
                    </div>
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
                        {((startRt > 0 && endRt > 0 && endRt >= startRt) || customRt.length > 0) && <button className='btn-big' style={{width: "85%"}} onClick={() => getRemitos()}>Remitos WIP</button>}
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
                const dias = prompt("¿Ingrese la descripcion del nuevo plan?")
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
                    </div>
                    <div>
                        {fecha && <button className='btn-big' onClick={() => getInformeFecha()}>Informe fecha</button>}
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
                        <select name="plan" className='select-small-cco' value={selectedDep} onChange={(e) => addLugar(parseInt(e.target.value))} disabled={selectedPlan < 1000 ? false : true}>
                            <option value={0}>---</option>
                            {filteredDesgloses.map((p) => (
                                <option value={p.cue}>{p.des}</option>
                            ))}
                        </select>
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
            else if(state === "NO ENTREGADO") {
                return "Tomato"
            }
            else if(state === "ENTRADA"){
                return "Orange"
            } 
        }

        const stateManagement = (state: string,rt: string) => {
            if(state === "PENDIENTE") {
                return <button className='btn-export-pdf' onClick={() => changeState(rt,"PREPARADO")}>PREPARADO</button>
            }
            else if(state === "PREPARADO") {
                return <button className='btn-export-pdf' onClick={() => changeState(rt,"DESPACHADO")}>DESPACHADO</button>
            }
            else if(state === "DESPACHADO") {
                return (
                    <div>
                        <button className='btn-export-pdf' onClick={() => changeState(rt,"ENTREGADO")}>ENTREGADO</button>
                        <button className='btn-export-pdf' onClick={() => changeState(rt,"NO ENTREGADO")}>NO ENTREGADO</button>
                    </div>
                )
            }
            else if(state === "ENTREGADO") {
                return <button className='btn-export-pdf' onClick={() => changeState(rt,"ENTRADA")}>ENTRADA</button>
            }
        }

        const changeState = async (remito: string, newstate: string) => {
            if(confirm("Quieres cambiar el estado del remito "+remito+"?") && global) {
                global.changeEnviosStateRemitos(newstate,remito)
                remitosView.forEach(rts => {
                    rts.forEach(rt => {
                        if(rt.nro_remito === remito) rt.estado = newstate
                    });
                });
                //setRemitosView(remitosView)
                setUpdater(updater+1)
            }
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
                                <h5 className='title-Homepage'>Ultimo movimiento: {selectedRemito.ultima_mod.split("T")[0]}</h5>
                                <h5 className='title-Homepage'>Cambiar Estado:{stateManagement(selectedRemito.estado,selectedRemito.nro_remito)}</h5>
                                
                            </div>
                        )}
                    </div>
                    <hr color='#3399ff' className='hr-line'/>
                    <div style={{overflow: "scroll",width: 500, minHeight: 600,maxHeight: 800}}>
                    <table style={{fontSize: "small", width: "100%", tableLayout: "fixed", textOverflow: "ellipsis"}}>
                        <tbody>
                            <tr >
                                <th style={{border: "1px solid", width: "25%"}}>Remito</th>
                                <th style={{border: "1px solid", width: "25%"}}>Localidad</th>
                                <th style={{border: "1px solid", width: "25%"}}>Depart.</th>
                                <th style={{border: "1px solid", width: "25%"}}>Estado</th>
                            </tr>
                            { remitosView[remitoPage] && remitosView[remitoPage].map((d) => (
                            <tr key={d.nro_remito} onClick={() => setSelectedRemito(d)} style={{backgroundColor: colorChange(d.estado)}}>
                                <th style={{border: "1px solid", width: "25%"}}>{d.nro_remito}</th>
                                <th style={{border: "1px solid", width: "25%"}}>{d.localidad.toUpperCase()}</th>
                                <th style={{border: "1px solid", width: "25%"}}>{d.departamento}</th>
                                <th style={{border: "1px solid", width: "25%"}}>{d.estado}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>

                    <div style={{display: "flex", justifyContent: "center"}}>
                        {remitoPage > 0 && <button className='btn-export-pdf' onClick={() => setRemitoPage(remitoPage - 1)}>{"<---"}</button>}
                        <h4 className='title-Homepage'>{remitoPage + 1}</h4>
                        {remitoPage < remitosView.length - 1 && <button className='btn-export-pdf' onClick={() => setRemitoPage(remitoPage + 1)}>{"--->"}</button>}
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
                            <option value={1}>Generar envios Excel</option>
                            <option value={8}>Generar envios</option>
                            <option value={2}>Eliminar envios</option>
                            <option value={3}>Traer envios</option>
                            <option value={9}>Ver remitos</option>
                            <option value={4}>Insumos</option>
                            <option value={5}>Planes</option>
                            <option value={6}>Informes</option>
                            <option value={7}>Datos</option>
                        </select>
                    </div>
                    <div style={{maxWidth: 800}}>
                        {display === 1 && displayGenerarEnvioExcel()}
                        {display === 2 && displayDeleteTanda()}
                        {display === 3 && displayTraerEnvios()}
                        {display === 4 && displayInsumos()}
                        {display === 5 && displayPlanes()}
                        {display === 6 && displayInformes()}
                        {display === 7 && displayData()}
                        {display === 8 && displayGenerarEnvio()}
                        {display === 9 && displayRemitos()}
                    </div>
                </div>
            </div>
        </div>
    )
}
