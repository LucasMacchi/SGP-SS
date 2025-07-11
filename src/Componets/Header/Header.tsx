import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../Context/GlobalContext'
import './Header.css'
import { useContext, useEffect, useState } from 'react'
import { rolesNum } from '../../Utils/Interfaces'

export default function Header () {

    const [drop, setDrop] = useState(false)
    const global = useContext(GlobalContext)
    const navigator = useNavigate()


    const navigateTo = (link: string) => {
        setDrop(false)
        navigator(link)
    }

    useEffect(() => {if(global)if(!global.login) global.sessionFn()},[])

    const logOutHeader = () => {
        if(confirm('¿Seguro que quieres cerrar sesion?')) {
            global?.logoutFn()
        }
        else setDrop(false)
    }

    return(
        <div className='div-header'>
            <div className='div-logo'>
                <img src="/logo_big.webp" alt="" className='logo-big-home'/>
            </div>
            {global?.user.username &&
                <h5 className='delete-text'>{global.user.username}</h5>}
            <div className="dropdown">
                <button className='btn-menu-header' onClick={() => setDrop(!drop)}>Menu</button>
                {drop && (
                    <ul className='dropdown-ul'>
                        <li className='dropdown-li' onClick={() => logOutHeader()}>
                            Cerrar Sesion
                            </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/pedidos')}>
                            Pedidos
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/add')}>
                            Nuevo Pedido
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/informes')}>
                            Generar Informes
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/services')}>
                        Servicios
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/correo')}>
                            Correo
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/reportes')}>
                            Buscar Reportes
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/soporte')}>
                        Soporte Tecnico
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/compras')}>
                            Compras
                        </li>
                        {global?.user.rol === rolesNum.admin && 
                        <li className='dropdown-li' onClick={() => navigateTo('/admin/users')}>
                            Admin - Usuarios
                        </li>
                        }
                    </ul>
                )}
            </div>
        </div>
    )
}
