import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useParams } from 'react-router-dom'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'
import { IReport, IToken } from '../../Utils/Interfaces'
import { jwtDecode } from 'jwt-decode'
import './reportpage.css'

const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function Report () {

    const global = useContext(GlobalContext)
    const [report, setReport] = useState('')
    const [category, setCategory] = useState('')
    const [load, setLoad] = useState(true)
    const navigator = useNavigate()

        useEffect(() => {
            if(global?.login === false) global?.sessionFn()
            if(global?.categories.length === 0) global.categoriesGet()
            if(!global?.pedidoDetail.order_id) navigator('/')
            setTimeout(() => {
                setLoad(false)
            }, waitTime);
        },[])

        const makeReport = async () => {
            if(confirm("¿Quiere realizar el reporte?") && global){
                const token = localStorage.getItem('jwToken')
                const dataUser: IToken = jwtDecode(token ?? "")
                setLoad(true)
                const data: IReport = {
                    pedido_numero: global.pedidoDetail.numero,
                    descripcion: report,
                    category: category,
                    order_id: global.pedidoDetail.order_id,
                    nombre_completo: dataUser.first_name +' '+dataUser.last_name,
                    user_id: dataUser.usuario_id,
                    email: dataUser.email
                }
                global.createReport(data, true)
                
            }
        }

    return(
        <div>
            <div className='div-header-pedidos'>
                <Header />
            </div>
            <h2 className='title-Homepage' >
                {'Reporte'}
            </h2>
            <hr color='#3399ff' className='hr-line'/>
            <h2 className='title-Homepage' >
                {'Pedido Nro: '+global?.pedidoDetail.numero}
            </h2>
            <hr color='#3399ff' className='hr-line'/>
            {
                !load ? 
                <div className='data-div-add'>
                <h4>Categoria del Informe: </h4>
                    <select defaultValue={''} value={category} className="select-category"
                    onChange={e => setCategory(e.target.value)}>
                    <option value={''}>---</option>
                    {global?.categories.map((c) => (
                            <option value={c}>{c}</option>
                    ))
                    }
                    </select>
                </div>
                : <h3 className='title-Homepage'>Cargando...</h3>
            }
            <textarea value={report} className='texarea-details-big' onChange={(e) => setReport(e.target.value)}/>
            <div className='div-btns'>
                {load ? <h3 className='title-Homepage'>Cargando...</h3> : <button className='btn-neutral' onClick={() => report && category ? makeReport() : alert('Es necesario escribir un mensaje y seleccionar una categoria.')}>Realizar Reporte</button>}
            </div>
        </div>
    )
}
