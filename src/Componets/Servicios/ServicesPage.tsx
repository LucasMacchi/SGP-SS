import "./services.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IDataEntregaPdf, IDataPdf, ILgarEntrega, IServicio } from "../../Utils/Interfaces"
import departamentoReturner from "../../Utils/departamentoReturner"
import clientesReturner from "../../Utils/clientesReturner"
import Header from '../Header/Header'
import { pdf } from "@react-pdf/renderer"
import DataDocument from "../pdfs/dataPdf"
import saveAs from "file-saver"
import DataDocumentEntrega from "../pdfs/dataEntregasPdf"


export default function ServicesPage () {

    const global = useContext(GlobalContext)
    const [filterClient, setFilterClient] = useState(0)
    const [filterDepartment, setDepartment] = useState('')
    const [filterServ, setFilterServ] = useState<IServicio[]>([])
    const [filteredInsumos, setFilteredInsumos] = useState<string[]>([])
    const [filteredLentregas, setFilteredLentregas] = useState<ILgarEntrega[]>([])
    const [searchServ, setSearchServ] = useState('')
    const [displayType, setDisplayType] = useState(0)

    useEffect(() => {
        if(global) {
            if(global.login === false) global.sessionFn()
            if(global.insumos.length === 0) global?.insumosFn(false)
            if(global.ccos.length === 0) global?.ccosFn()
            if(global.lentregas.length === 0) global.getLugaresEntreFn()
        }
    },[])

    useEffect(() => {
        setSearchServ("")
        setFilterClient(0)
        setDepartment("")
    },[displayType])

    useEffect(() => {
        if(displayType === 1){
            let arr = global?.ccos
            const search = searchServ.toLowerCase()
            if(arr) {
                if(filterClient > 0) arr = arr.filter(c => c.client_id === filterClient)
                if(filterDepartment) arr = arr.filter(c => c.localidad === filterDepartment)
                if(searchServ.length > 2)  arr = arr.filter(c => c.service_des.toLowerCase().includes(search))

                setFilterServ(arr)
            }
        }
        else if (displayType === 2) {
            let arr = global?.insumos
            const search = searchServ.toLowerCase()
            if(arr){
                if(searchServ.length > 2)  arr = arr.filter(c => c.toLowerCase().includes(search))
                setFilteredInsumos(arr)
            }
            
        }
        else if (displayType === 3) {
            let arr = global?.lentregas
            const search = searchServ.toLowerCase()
            if(arr){
                if(searchServ.length > 2)  arr = arr.filter(c => c.completo.toLowerCase().includes(search))
                setFilteredLentregas(arr)
            }
            
        }

    },[filterClient, filterDepartment, global?.ccos, global?.lentregas, searchServ, displayType])

    const printDataPDF = async () => {
        let des = ""
        if(displayType === 1) {
            const servicesFormated = filterServ.map(s => s.client_id.toString()+"-"+s.service_id+"-"+s.service_des+"-"+s.localidad)
            if(filterClient) des +="Cliente: "+filterClient+" -"
            if(filterDepartment) des += "Departamento: "+filterDepartment+" -"
            if(searchServ.length > 2) des += "Busqueda: "+searchServ+" -"
            const data: IDataPdf = {
                solicitado: "SERVICIOS",
                datos: servicesFormated,
                descripcion: des
            }
            const blob: Blob = await pdf(<DataDocument datos={data.datos} solicitado={data.solicitado} 
                descripcion={data.descripcion}/>).toBlob()
            saveAs(blob, 'SGP_'+data.solicitado)
        }
        else if (displayType === 2){
            if(searchServ.length > 2) des += "Busqueda: "+searchServ
            const data: IDataPdf = {
                solicitado: "INSUMOS",
                datos: filteredInsumos,
                descripcion: des
            }
            const blob: Blob = await pdf(<DataDocument datos={data.datos} solicitado={data.solicitado} 
                descripcion={data.descripcion}/>).toBlob()
            saveAs(blob, 'SGP_'+data.solicitado)
        }
        else if(displayType === 3) {
            if(searchServ.length > 2) des += "Busqueda: "+searchServ
            const data: IDataEntregaPdf = {
                solicitado: "Lentregas",
                datos: filteredLentregas,
                descripcion: des
            }
            const blob: Blob = await pdf(<DataDocumentEntrega datos={data.datos} solicitado={data.solicitado} 
                descripcion={data.descripcion}/>).toBlob()
            saveAs(blob, 'SGP_'+data.solicitado)
        }
    }


    const displayServicios = () => {
        return(
            <div>
                <h2 className='title-Homepage' >
                Servicios
                </h2>
                <div>
                    <h6>Busqueda</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setSearchServ(e.target.value)} value={searchServ}/>
                </div>
                <div>
                <h6>Cliente</h6>
                <select defaultValue={''} value={filterClient} className="data-div-select"
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
                <select  defaultValue={''} value={filterDepartment} className="data-div-select"
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
                    <table className="service-table" >
                        <tbody>
                        <tr>
                            <th className='service-table-row'>CCO ID</th>
                            <th className='service-table-row'>CCO Nombre</th>
                            <th className='service-table-row'>Departamento</th>
                        </tr>
                        {filterServ.map((c) => (
                            <tr key={c.service_id} >
                                <th className='service-table-row'>{c.service_id}</th>
                                <th className='service-table-row'>{c.service_des}</th>
                                <th className='service-table-row'>{c.localidad}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const displayInsumos = () => {
        return(
            <div>
                <h2 className='title-Homepage' >
                Insumos
                </h2>
                <div>
                    <h6>Busqueda</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setSearchServ(e.target.value)} value={searchServ}/>
                </div>
                <div>
                    <table className="service-table">
                        <tbody>
                        <tr>
                            <th className='service-table-row'>Insumos</th>
                        </tr>
                        {filteredInsumos.map((c,i) => (
                            <tr key={i} >
                                <th className='service-table-row'>{c}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    const displayLgaresEntrega = () => {
        return(
            <div>
                <h2 className='title-Homepage' >
                Insumos
                </h2>
                <div>
                    <h6>Busqueda</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setSearchServ(e.target.value)} value={searchServ}/>
                </div>
                <div>
                    <table className="service-table" >
                        <tbody>
                        <tr>
                            <th className='service-table-row'>ID</th>
                            <th className='service-table-row'>Nombre</th>
                            <th className='service-table-row'>Localidad</th>
                        </tr>
                        {filteredLentregas.map((c) => (
                            <tr key={c.service_id} >
                                <th className='service-table-row'>{c.lentrega_id}</th>
                                <th className='service-table-row'>{c.completo}</th>
                                <th className='service-table-row'>{c.localidad}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return(
        <div className="service-div">
            <div >
                <Header />
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <select name="displryType" onChange={(e) => setDisplayType(parseInt(e.target.value))}>
                    <option value={1}>Servicios</option>
                    <option value={2}>Insumos</option>
                    <option value={3}>Lugares Entrega</option>
                </select>
            </div>
            <button className="info-popup" onClick={() => printDataPDF()}>IMPRIMIR</button>
            {displayType === 1 && displayServicios()}
            {displayType === 2 && displayInsumos()}
            {displayType === 3 && displayLgaresEntrega()}
        </div>
    )

}
