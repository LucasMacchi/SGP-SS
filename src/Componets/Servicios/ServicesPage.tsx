import "./services.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IDataPdf, IServicio } from "../../Utils/Interfaces"
import departamentoReturner from "../../Utils/departamentoReturner"
import clientesReturner from "../../Utils/clientesReturner"
import Header from '../Header/Header'
import { pdf } from "@react-pdf/renderer"
import DataDocument from "../pdfs/dataPdf"
import saveAs from "file-saver"


export default function ServicesPage () {

    const global = useContext(GlobalContext)
    const [filterClient, setFilterClient] = useState(0)
    const [filterDepartment, setDepartment] = useState('')
    const [filterServ, setFilterServ] = useState<IServicio[]>([])
    const [filteredInsumos, setFilteredInsumos] = useState<string[]>([])
    const [searchServ, setSearchServ] = useState('')
    const [displayType, setDisplayType] = useState(true)

    useEffect(() => {
        if(global) {
            if(global.login === false) global.sessionFn()
            if(global.insumos.length === 0) global?.insumosFn(false)
            if(global.ccos.length === 0) global?.ccosFn()
        }
    },[])

    useEffect(() => {
        setSearchServ("")
        setFilterClient(0)
        setDepartment("")
    },[displayType])

    useEffect(() => {
        if(displayType){
            let arr = global?.ccos
            const search = searchServ.toLowerCase()
            if(arr) {
                if(filterClient > 0) arr = arr.filter(c => c.client_id === filterClient)
                if(filterDepartment) arr = arr.filter(c => c.localidad === filterDepartment)
                if(searchServ.length > 2)  arr = arr.filter(c => c.service_des.toLowerCase().includes(search))

                setFilterServ(arr)
            }
        }
        else {
            let arr = global?.insumos
            const search = searchServ.toLowerCase()
            if(arr){
                if(searchServ.length > 2)  arr = arr.filter(c => c.toLowerCase().includes(search))
                setFilteredInsumos(arr)
            }
            
        }

    },[filterClient, filterDepartment, global?.ccos, searchServ, displayType])

    const printDataPDF = async () => {
        let des = ""
        if(displayType) {
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
        else {
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

    return(
        <div className="service-div">
            <div >
                <Header />
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{margin: 20}}>
                    <h4>Servicios</h4>
                    <input type="radio" checked={displayType} onChange={(e) => setDisplayType(e.target.checked)}/>
                </div>
                <div style={{margin: 20}}>
                    <h4>Insumos</h4>
                    <input type="radio" checked={!displayType} onChange={(e) => setDisplayType(!e.target.checked)}/>
                </div>
            </div>
            <button className="info-popup" onClick={() => printDataPDF()}>IMPRIMIR</button>
            {displayType ? displayServicios() : displayInsumos()}
        </div>
    )

}
