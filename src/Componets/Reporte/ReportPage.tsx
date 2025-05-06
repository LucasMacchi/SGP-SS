import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import Header from '../Header/Header'
import dateParser from '../../Utils/dateParser'
import "./reportpage.css"


export default function ReportPage () {

    const global = useContext(GlobalContext)
    const [nro, setNro] = useState('')
    const [details, setDetails] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
    },[])

    const searchReports = async () => {
        if(global){
            global.getReports(nro)
        }
        
    }

    const displayDate = (date: string): string => {
        const d = dateParser(date)
        return d.day + '/'+d.month+'/'+d.year
    }

    const displayReports = () => {
        if(global?.reports.length !== 0){
            return(
                <div>
                    <h2 className='title-Homepage' >
                        {'Reportes del pedido nro: '+global?.reports[0].pedido_numero}
                    </h2>
                    <hr color='#3399ff' className='hr-line'/>
                    <table >
                        <tbody>
                            <tr>
                                <th>Categoria</th>
                                <th>Fecha</th>
                            </tr>
                            {global?.reports.map((i) => (
                                <tr key={i.report_id} className='table-report' onClick={() => {
                                    setDetails(i.descripcion)
                                    setName(i.fullname ? i.fullname : 'DESCONOCIDO')
                                }}>
                                    <th className='data-div-category'>{i.category}</th>
                                    <th className='data-div-date'>{displayDate(i.fecha ? i.fecha : "")}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        else return(<h3 className='title-Homepage'>Ningun reporte solicitado.</h3>)
    }

    const detailsReportDisplay = () => {
        if(details) {
            return(
                <div>
                    <h2 className='title-Homepage' >
                        {'Detalles del Reporte'}
                    </h2>
                    <hr color='#3399ff' className='hr-line'/>
                        <p>Reportado por: {name}</p>
                        <p className='description-report'>
                            {details}
                        </p>
                    </div>
            )
        }
    }
    return(
        <div>
            <div className='div-header-pedidos'>
                <Header />
            </div>
            <h1 className='title-Homepage' >
                {'Reportes'}
            </h1>
            <hr color='#3399ff' className='hr-line'/>
            <div>
                <h5 className='filter-sub'>Nro Pedido</h5>
                <input type='number' id='nro_pedido' className='textfield-search' min={0}
                value={nro} onChange={e => setNro(e.target.value)}/>
            </div>
            <button className='btn-small-logout' onClick={() => searchReports()}>
                Buscar
            </button>
            {displayReports()}
            {detailsReportDisplay()}
        </div>
    )
}
