import './Admin.css'
import { useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { rolesNum } from '../../Utils/Interfaces'

//const use_logs = import.meta.env.VITE_USE_LOGS

export default function AdminPagina () {

    const global = useContext(GlobalContext)
    const navigator = useNavigate()
    
    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
        if(global?.user.rol !== rolesNum.admin) {
            navigator("/pedidos")
        }

    },[])

    return(
        <div>
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <hr color='#3399ff' className='hr-line'/>
            <button className='btn-big' onClick={() => navigator('/pedidos')}>
                    Pedidos
                </button>
                <p></p>
                <button className='btn-big' onClick={() => navigator('/admin/users')}>
                    Usuarios
                </button>
        </div>
    )
}