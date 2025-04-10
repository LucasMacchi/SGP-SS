import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { IEmailSender, IToken } from '../../Utils/Interfaces'
import { jwtDecode } from 'jwt-decode'
import Header from '../Header/Header'

const waitTime = parseInt(import.meta.env.VITE_WAITTIME)
const use_logs = import.meta.env.VITE_USE_LOGS

export default function Correopage () {
    const global = useContext(GlobalContext)
    const navigator = useNavigate()
    const [email, setEmail] = useState('')
    const [message, setMsg] = useState('')
    const [load, setLoad] = useState(true)

    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
        if(global?.sysUsers.length === 0) { 
            setTimeout(() => {
                global?.sysUsersFn()
                if(use_logs === "1") console.log(global.sysUsers)
            }, waitTime);
        }
        setTimeout(() => {
            setLoad(false)
        }, waitTime);
    },[])

    const sendEmail = async () => {
        const token = localStorage.getItem('jwToken')
        const dataUser: IToken = jwtDecode(token ?? '')
        try {
            if(email === 'Todos') {
                setLoad(true)
                setEmail('')
                setMsg('')
                global?.sysUsers.forEach( async (u) => {
                    const data: IEmailSender = {
                        to_send: u.email ?? 'none',
                        msg: message,
                        sender: dataUser.first_name + ' ' + dataUser.last_name
                    }
                    await global?.sendEmail(data)
                    console.log('Correo enviado a: ',u.email)
                });
                alert('Correos enviados a todos los usuarios.')
                navigator('/')
            }
            else {
                const data: IEmailSender = {
                    to_send: email,
                    msg: message,
                    sender: dataUser.first_name + ' ' + dataUser.last_name
                }
                setLoad(true)
                setEmail('')
                setMsg('')
                await global?.sendEmail(data)
                alert('Correo enviado')
                navigator('/')
            }

        } catch (error) {
            setEmail('')
            setMsg('')
            alert('Error al enviar el correo')
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
                    <h4>Correos de los Usuarios: </h4>
                    <select defaultValue={''} value={email} className="filter-sub"
                    onChange={e => setEmail(e.target.value)}>
                    <option value={''}>---</option>
                    {global?.user.rol === 1 && <option key={'Todos'} value={'Todos'}>Todos</option>}
                    {
                        global?.sysUsers.map((u) => (
                            <option key={u.username} value={u.email}>{u.first_name + ' ' + u.last_name + ' - '+u.email}</option>
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
                {'Correo'}
            </h1>
            <hr color='#3399ff' className='hr-line'/>
            {selectDisplayer()}
            <textarea value={message} className='texarea-details' onChange={(e) => setMsg(e.target.value)}/>
            <div className='div-btns'>
                {load ? <h3 className='title-Homepage'>Cargando...</h3> : <button className='btn-neutral' onClick={() => message && email ? sendEmail() : alert('Es necesario escribir un mensaje y seleccionar un correo.')}>MANDAR</button>}
            </div>
        </div>
    )
}
