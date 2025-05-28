import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import {IReport, IToken } from '../../Utils/Interfaces'
import { jwtDecode } from 'jwt-decode'
import Header from '../Header/Header'
const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function Soporte () {

    const global = useContext(GlobalContext)
    const navigator = useNavigate()
    const [cat, setCat] = useState('')
    const [message, setMsg] = useState('')
    const [load, setLoad] = useState(true)

    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
        if(global?.errorCat.length === 0) global.errorsCatGet()
            setTimeout(() => {
                setLoad(false)
            }, waitTime);
    },[])

    const sendEmail = async () => {
        const token = localStorage.getItem('jwToken')
        const dataUser: IToken = jwtDecode(token ?? '')
        try {
            const data: IReport = {
                descripcion: message,
                category: cat,
                pedido_numero: 'NaN',
                user_id: 1,
                nombre_completo: dataUser.first_name+' '+dataUser.last_name,
                email: 'NaN',
                order_id: 1
            }
            setLoad(true)
            setCat('')
            setMsg('')
            await global?.emailError(data)
            navigator('/')

        } catch (error) {
            setCat('')
            setMsg('')
            setLoad(false)
        }


    }

    const selectDisplayer = () => {
        if(load){
            return (
                <h3 className='title-Homepage'>Cargando...</h3>
            )
        }
        else {
            return (
                <div className='data-div-add'>
                <h4>Selecciona el asunto: </h4>
                <select defaultValue={''} value={cat} className="filter-sub"
                onChange={e => setCat(e.target.value)}>
                <option value={''}>---</option>
                {
                    global?.errorCat.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))
                }
                </select>
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
        {'Soporte Tecnico'}
        </h1>
        <hr color='#3399ff' className='hr-line'/>
        <h5 className='filter-sub'>En caso de informar un error, sea los mas especifico </h5>
        <h5 className='filter-sub'>posible y detalle el paso a paso para replicarlo.</h5>
        <hr color='#3399ff' className='hr-line'/>
        {selectDisplayer()}
        <textarea value={message} className='texarea-details-big' onChange={(e) => setMsg(e.target.value)}/>
        <div className='div-btns'>
        {load ? <h3 className='title-Homepage'>Cargando...</h3> : <button className='btn-neutral' onClick={() => message && cat ? sendEmail() : alert('Es necesario escribir un mensaje y seleccionar un asunto.')}>MANDAR</button>}
        </div>
        </div>
    )
}
