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
import { IChangeEnvioInsumo, IChangeEnvioInsumoPlan, IEnvioInsumos, IPlanComplete, IrequestEnvioCom } from "../../Utils/Interfaces";
import informeEnviosTxt from "../../Utils/informeEnviosTxt";



export default function Envios () {

    const global = useContext(GlobalContext)
    const [display, setDisplay] = useState(0)
    const [tanda, setTanda] = useState(0)
    const [delkey, setDelkey] = useState("")
    const [dias, setDias] = useState(30)
    const [selectedPlan, setSelectedPlan] = useState(1000)
    const [planes, setPlanes] = useState<IPlanComplete[]>([])
    const [insumos, setInsumos] = useState<IEnvioInsumos[]>([])
    const [selectedIns, setSelectedIns] = useState(0)
    useEffect(() => {
        if(global) {
            if(global?.lentregas.length === 0) global.getLugaresEntreFn()
            if(global?.desgloses.length === 0) global.getDesglosesFn()
            global.getInsumosEnvios().then(i => setInsumos(i))
            global.getEnviosPlanes().then(p => setPlanes(p)) 
        }
    },[])

    useEffect(() => {
        setDelkey("")
        setTanda(0)
        setSelectedPlan(1000)
        setSelectedIns(0)
    },[display])



    const displayDesglosadoGn = () => {
        const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
            if(e.target.files && e.target.files[0] && global && confirm("¿Quieres crear las tandas de este excel?")) {
                const updater = confirm("¿Quieres que se actualicen los remitos?")
                const data: IrequestEnvioCom[][] = await ExcelParserEnvios(e.target.files[0], insumos, planes[selectedPlan])
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
                    <h4 className='title-Homepage'>Seleccione el plan a utilizar</h4>
                    <select name="plan" className='filter-sub' value={selectedPlan} onChange={(e) => setSelectedPlan(parseInt(e.target.value))}>
                        <option value={1000}>---</option>
                        {planes.map((p,i) => (
                            <option value={i}>{p.des + " x "+p.dias}</option>
                        ))}
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
                    const bolsasRatio = insumo.gr_total / insumo.gr_racion
                    const cajaRatio = insumo.unidades_caja * bolsasRatio
                    return (
                    <table style={{fontSize: "small", width: 380}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "20%"}}>Caja x palet (e)</th>
                                <th style={{border: "1px solid", width: "20%"}}>Bolsa x caja (e)</th>
                                <th style={{border: "1px solid", width: "20%"}}>Gr x racion (e)</th>
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
                                <th style={{border: "1px solid", width: "20%"}}>{bolsasRatio}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{cajaRatio}</th>
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
                            <option value={1}>Generar envios</option>
                            <option value={2}>Eliminar envios</option>
                            <option value={3}>Traer envios</option>
                            <option value={4}>Insumos</option>
                            <option value={5}>Planes</option>
                        </select>
                    </div>
                    <div style={{maxWidth: 400}}>
                        {display === 1 && displayDesglosadoGn()}
                        {display === 2 && displayDeleteTanda()}
                        {display === 3 && displayTraerEnvios()}
                        {display === 4 && displayInsumos()}
                        {display === 5 && displayPlanes()}
                    </div>
                </div>
            </div>
        </div>
    )
}
//<option value={2}>Generar nuevo envio</option>
