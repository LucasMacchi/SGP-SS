import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import "./Users.css"
import { IUser, rolesNum } from '../../Utils/Interfaces'
import Header from '../Header/Header'

const waitTime = parseInt(import.meta.env.VITE_WAITTIME)

export default function UsersPagina () {
    const global = useContext(GlobalContext)
    const navigator = useNavigate()
    const [newUser, setNewUser] = useState<IUser>({
        username: '',
        first_name: '',
        last_name: '',
        activated: false,
        rol : 0,
        email: ''
    })

    const handleData = (data: string | number, prop: string) => {
        setNewUser({
            ...newUser,
            [prop]: data
        })

    }

    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
        if(global?.user.rol !== 1) {
            navigator("/pedidos")
        }
        if(global?.sysUsers.length === 0) { 
            setTimeout(() => {
                global?.sysUsersFn()
            }, waitTime);
        }
    },[])

    const delUser = (a: boolean, usrnm: string, activated: boolean) => {
        if(a) global?.delUser(usrnm, activated)
    }

    const createUser = async () => {
        global?.sysUsers.forEach(u => {
            if(u.username === newUser.username) {
                alert("Usuario ya existe")
                setNewUser({
                    username: '',
                    first_name: '',
                    last_name: '',
                    activated: false,
                    rol : 0,
                    email: ''
                })
                return 0
            }
        });
        if(newUser.username  && newUser.first_name && newUser.last_name && newUser.rol && newUser.email) {
            global?.addUser(newUser)
            setNewUser({
                username: '',
                first_name: '',
                last_name: '',
                activated: false,
                rol : 0,
                email: ''
            })
            alert('Nuevo Usuario dado de Alta')
        }
        else {
            alert("Faltan Datos")
            return 0
        }
    }

    const rolDisplayer = (rol: number): string => {
        if(rol === rolesNum.admin) return 'Admin'
        else if(rol === rolesNum.administrativo) return 'Administrativo'
        else if(rol === rolesNum.encargado) return 'Encargado'
        else if(rol === rolesNum.en_deposito) return 'Deposito'
        else return 'NaN'
    }

    return(
        <div>
            <div className='div-header-pedidos'>
                <Header />
            </div>
            <h1 className='title-Homepage' >
                    {'Usuarios'}
            </h1>
            <hr color='#3399ff' className='hr-line'/>

            <h3 className='title-Homepage'>Usuarios Activos</h3>
            <hr color='#3399ff' className='hr-line'/>
            <table className='table-users'>
                <tbody>
                    <tr>
                        <th className='tr-user'>Username</th>
                        <th className='tr-user'>Nombre</th>
                        <th className='tr-user'>Apellido</th>
                        <th className='tr-user'>Rol</th>
                    </tr>
                    { global?.sysUsers.length === 0 ? 
                    <h3 className='title-Homepage'>Cargando...</h3> :
                        global?.sysUsers.map((u, i) => {
                            if(u.activated) return(
                                <tr key={u.username+i} className='tr-user'
                                onClick={() => delUser(confirm("Seguro que quieres eliminar a "+u.username), u.username, false)}>
                                    <th className='tr-user'>{u.username}</th>
                                    <th className='tr-user'>{u.first_name}</th>
                                    <th className='tr-user'>{u.last_name}</th>
                                    <th className='tr-user'>{rolDisplayer(u.rol)}</th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <h3 className='title-Homepage'>Usuarios Desactivados</h3>
            <hr color='#3399ff' className='hr-line'/>
            <table className='table-users'>
                <tbody>
                    <tr>
                        <th className='tr-user'>Username</th>
                        <th className='tr-user'>Nombre</th>
                        <th className='tr-user'>Apellido</th>
                        <th className='tr-user'>Rol</th>
                    </tr>
                    { global?.sysUsers.length === 0 ? 
                    <h3 className='title-Homepage'>Cargando...</h3> :
                        global?.sysUsers.map((u, i) => {
                            if(!u.activated) return(
                                <tr key={u.username+i} className='tr-user'
                                onClick={() => delUser(confirm("Seguro que quieres reactivar a "+u.username), u.username, true)}>
                                    <th className='tr-user'>{u.username}</th>
                                    <th className='tr-user'>{u.first_name}</th>
                                    <th className='tr-user'>{u.last_name}</th>
                                    <th className='tr-user'>{rolDisplayer(u.rol)}</th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <h3 className='title-Homepage'>Nuevo Usuario: </h3>
            <hr color='#3399ff' className='hr-line'/>
            <div className="data-div-add">
                <h4 className="input-label-add-usr">Username:</h4>
                <input type="text" name="usrnm" id="usrnm" className='data-div-texfield'
                onChange={e => handleData(e.target.value, "username")} value={newUser.username}/>
            </div>
            <div className="data-div-add">
                <h4 className="input-label-add-usr">Email:</h4>
                <input type="text" name="email" id="email" className='data-div-texfield'
                onChange={e => handleData(e.target.value, "email")} value={newUser.email}/>
            </div>
            <div className="data-div-add">
                <h4 className="input-label-add-usr">Nombre:</h4>
                <input type="text" name="fName" id="fName" className='data-div-texfield'
                onChange={e => handleData(e.target.value, "first_name")} value={newUser.first_name}/>
            </div>
            <div className="data-div-add">
                <h4 className="input-label-add-usr">Apellido:</h4>
                <input type="text" name="fName" id="fName" className='data-div-texfield'
                onChange={e => handleData(e.target.value, "last_name")} value={newUser.last_name}/>
            </div>
            <div className="data-div-add">
                <h4 className="input-label-add-usr">Rol:</h4>
                <select name="rolS" id="rolS" defaultValue={''} value={newUser.rol} 
                className="data-div-select" onChange={e => handleData(parseInt(e.target.value), 'rol')}>
                    <option value={0}>---</option>
                    <option value={1}>Admin</option>
                    <option value={2}>Administrativo</option>
                    <option value={3}>Encargado</option>
                    <option value={4}>Encargado de Deposito</option>
                    <option value={5}>Cocina</option>
                </select>
            </div>
                <div className='div-btns'>
                    <button className='btn-accept' onClick={() => createUser()}>Alta Nuevo Usuario</button>
                </div>
        </div>
    )
}