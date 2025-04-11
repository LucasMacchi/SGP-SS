import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../Context/GlobalContext'
import './Header.css'
import { useContext, useState } from 'react'
export default function Header () {

    const [drop, setDrop] = useState(false)
    const global = useContext(GlobalContext)
    const navigator = useNavigate()


    const navigateTo = (link: string) => {
        setDrop(false)
        navigator(link)
    }

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
                        <li className='dropdown-li' onClick={() => navigateTo('/correo')}>
                            Correo
                        </li>
                        <li className='dropdown-li' onClick={() => navigateTo('/reportes')}>
                            Buscar Reportes
                        </li>
                        {global?.user.rol === 1 && 
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