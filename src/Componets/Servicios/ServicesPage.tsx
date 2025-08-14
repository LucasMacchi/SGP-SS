import "./services.css"
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IServicio } from "../../Utils/Interfaces"
import departamentoReturner from "../../Utils/departamentoReturner"
import clientesReturner from "../../Utils/clientesReturner"
import Header from '../Header/Header'


export default function ServicesPage () {

    const global = useContext(GlobalContext)
    const [filterClient, setFilterClient] = useState(0)
    const [filterDepartment, setDepartment] = useState('')
    const [filterServ, setFilterServ] = useState<IServicio[]>([])

    useEffect(() => {
        if(global) {
            if(global.login === false) global.sessionFn()
            //if(global.insumos.length === 0) global?.insumosFn()
            if(global.ccos.length === 0) global?.ccosFn()
        }
    },[])

    useEffect(() => {
        let arr = global?.ccos
        if(arr) {
            if(filterClient > 0) {
                arr = arr.filter(c => c.client_id === filterClient)
            }
            if(filterDepartment) {
                arr = arr.filter(c => c.localidad === filterDepartment)
            }

            setFilterServ(arr)
        }
    },[filterClient, filterDepartment, global?.ccos])

    return(
        <div className="service-div">
            <div >
                <Header />
            </div>
            <h2 className='title-Homepage' >
            Servicios
            </h2>
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
                <table className="service-table">
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
