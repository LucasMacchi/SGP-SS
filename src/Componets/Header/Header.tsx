import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../Context/GlobalContext'
import './Header.css'
import { useContext, useEffect } from 'react'

export default function Header () {

    //const [drop, setDrop] = useState(false)
    const global = useContext(GlobalContext)
    const navigator = useNavigate()


    const navigateTo = (link: string) => {
        //setDrop(false)
        navigator(link)
    }

    useEffect(() => {
        if(global)if(!global.login) global.sessionFn()
    },[])

    const logOutHeader = () => {
        if(confirm('¿Seguro que quieres cerrar sesion?')) {
            global?.logoutFn()
        }
        //else setDrop(false)
    }

    const hidderHeader = (roles: number[]) => {
        const hidderStyle: React.CSSProperties = {
            display: "none"
        }
        if(global && roles.includes(global.user.rol)) return hidderStyle
    }


    const navigatorFn = (v: number) => {
        switch(v){
            case 0:
                logOutHeader()
                break;
            case 1:
                navigateTo('/pedidos')
                break;
            case 2:
                navigateTo('/add')
                break;
            case 3:
                navigateTo('/informes')
                break;
            case 4:
                navigateTo('/services')
                break;
            case 5:
                navigateTo('/correo')
                break;
            case 6:
                navigateTo('/reportes')
                break;
            case 7:
                navigateTo('/soporte')
                break;
            case 8:
                navigateTo('/compras')
                break;
            case 9:
                navigateTo('/admin/users')
                break;
            case 10:
                navigateTo('/envio')
                break;
            default:
                navigateTo('/pedidos')
                break;
        }
    }

    return(
        <div className='div-header'>
            <div className='div-logo'>
                <img src="/logo_big.webp" alt="" className='logo-big-home'/>
            </div>
            <div >
                <select className='dropdown' value={99} onChange={(e) => {
                    global?.changeMenu(parseInt(e.target.value))
                    navigatorFn(parseInt(e.target.value))
                    console.log(e.target.value)
                }}>
                    <option className='dropdown-txt-none' value={99}>MENU</option>
                    <option className='dropdown-txt' value={0}>CERRAR SESION</option>
                    <option className='dropdown-txt' style={hidderHeader([5])} value={1}>PEDIDOS</option>
                    <option className='dropdown-txt' style={hidderHeader([5])} value={2}>NUEVO PEDIDO</option>
                    <option className='dropdown-txt' value={3}>GENERAR INFORME</option>
                    <option className='dropdown-txt' style={hidderHeader([5])} value={4}>SERVICIOS / INSUMOS</option>
                    <option className='dropdown-txt' style={hidderHeader([5])} value={10}>ENVIOS</option>
                    <option className='dropdown-txt' value={5}>CORREO</option>
                    <option className='dropdown-txt' style={hidderHeader([5])} value={6}>BUSCAR REPORTES</option>
                    <option className='dropdown-txt' value={7}>SOPORTE TECNICO</option>
                    <option className='dropdown-txt' value={8}>COMPRAS</option>
                    <option className='dropdown-txt' style={hidderHeader([5,4,3,2])} value={9}>ADMIN - USUARIOS</option>
                </select>
            </div>
        </div>
    )
}