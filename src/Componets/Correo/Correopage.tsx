import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { IEmailSender, IToken } from '../../Utils/Interfaces'
import { jwtDecode } from 'jwt-decode'

const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function Correopage () {
    const global = useContext(GlobalContext)
    const navigator = useNavigate()
    const [email, setEmail] = useState('')
    const [message, setMsg] = useState('')

    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
        if(global?.user.rol !== 1) {
            navigator("/pedidos")
        }
        if(global?.sysUsers.length === 0) { 
            setTimeout(() => {
                global?.sysUsersFn()
                console.log(global.sysUsers)
            }, waitTime);
        }
    },[])

    const sendEmail = async () => {
        const token = localStorage.getItem('jwToken')
        const dataUser: IToken = jwtDecode(token ?? '')
        const data: IEmailSender = {
            to_send: email,
            msg: message,
            sender: dataUser.first_name + ' ' + dataUser.last_name
        }
        try {
            setEmail('')
            setMsg('')
            await global?.sendEmail(data)
            alert('Correo enviado')
            navigator('/')
        } catch (error) {
            setEmail('')
            setMsg('')
            alert('Error al enviar el correo')
        }


    }

    return(
        <div>
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <hr color='#3399ff' className='hr-line'/>
            <div className='div-header-pedidos'>
                <button className='btn-small-logout' onClick={() => navigator('/admin')}>
                    Volver
                </button>
                <h1 className='title-Homepage' >
                    {'Correo'}
                </h1>
            </div>
            <div className='data-div-add'>
                <h4>Correos de los Usuarios: </h4>
                <select defaultValue={''} value={email} className="filter-sub"
                onChange={e => setEmail(e.target.value)}>
                <option value={''}>---</option>
                {
                    global?.sysUsers.map((u) => (
                        <option key={u.username} value={u.email}>{u.email}</option>
                    ))
                }
                </select>
                
            </div>
            <textarea value={message} className='texarea-details' onChange={(e) => setMsg(e.target.value)}/>
            <div className='div-btns'>
                <button className='btn-neutral' onClick={() => sendEmail()}>MANDAR</button>
            </div>
        </div>
    )
}
