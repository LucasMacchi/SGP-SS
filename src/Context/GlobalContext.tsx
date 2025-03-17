//import { useReducer } from "react";
import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, IPedido, IPropsChildren, IUser, rolesNum } from "../Utils/Interfaces"
import ac from "./Actions"
//Mocks
import usersMock from "../Mocks/usersMock.json"
import pedidosMock from "../Mocks/pedidosMocks.json"
import insumosMock from "../Mocks/insumosMock.json"
import ccosMock from "../Mocks/ccoMock.json"

export const GlobalContext = createContext<IGlobalContext | null>(null)
const use_mock = import.meta.env.VITE_USE_MOCK
const use_logs = import.meta.env.VITE_USE_LOGS

console.log('MOCK STATUS: ', use_mock)
console.log('MOCK LOGS: ', use_logs)

const globalReducer = (state: IGlobalContext, action: IAction): IGlobalContext => {
    const {type, payload} = action

    switch(type){
        case ac.GET_ALL_USERS:
            return {...state, sysUsers: payload}
        case ac.GET_CCOS:
            return {...state, ccos: payload}
        case ac.GET_INSUMOS:
            return {...state, insumos: payload}
        case ac.GET_USER:
            return {...state, user: payload}
        case ac.GET_PEDIDOS:
            return {...state, pedidos: payload}
        case ac.LOGSTATUS_CHN:
            return {...state, login: payload} 
        default:
            return state
    }

}

export default function GlobalState (props: IPropsChildren) {

    const navigation = useNavigate()

    //Funcion para hacer login
    function loginFn (username: string) {
        let status = false
        if(use_mock === "1"){
            usersMock.users.forEach(u => {
                if(username === u.username){
                    status = true
                    dispatch({
                        payload: true,
                        type: ac.LOGSTATUS_CHN
                    })
                    if(use_logs === "1") console.log("User " +username+ " logged in")
                    localStorage.setItem('jwToken', '1')
                    localStorage.setItem("usrname", u.username)
                    window.location.reload()
                }
            });
        }
        if(!status) alert("Error a iniciar sesion: usuario incorrecto")
    }
    //Funcion para hacer logout
    function logoutFn () {
        dispatch({
            payload: false,
            type: ac.LOGSTATUS_CHN
        })
        dispatch({
            payload: { nombre: "", apellido: "", mail: "", rol: 3 },
            type: ac.GET_USER
        })
        try {
            localStorage.removeItem('jwToken')
            localStorage.removeItem('usrname')
            window.location.reload()
        } catch (error) {
            console.log(error)
            localStorage.removeItem('jwToken')
            localStorage.removeItem('usrname')
            window.location.reload()
        }
    }
    //Funcion para la sesion
    function sessionFn () {
        if(localStorage.getItem('jwToken') && localStorage.getItem('usrname')){
            if(use_mock === "1"){
                usersMock.users.forEach(u => {
                    if(u.username === localStorage.getItem('usrname')){
                        console.log("USER: ",u)
                        dispatch({
                            payload: {username: u.username, first_name: u.first_name, last_name: u.last_name, rol: u.rol},
                            type: ac.GET_USER
                        })
                        dispatch({
                            payload: true,
                            type: ac.LOGSTATUS_CHN
                        })
                        
                    }
                });
            }

            if(use_logs === "1") console.log("User logged in by session ")
                navigation("/pedidos")
        }
        else {
            if(use_logs === "1") console.log("No session detected")
            navigation('/')
        }
    }

    //Funcion para conseguir todos los pedidos
    function pedidosFn ( rol: number) {
        if(use_logs === "1") console.log('ROL ',rol)
        if(use_mock === "1") {
            if(rol === rolesNum.encargado){
                const username = localStorage.getItem('usrname')
                const pedidos: IPedido[] = pedidosMock.pedidos.filter(p => p.requester === username)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidos
                })
                if(use_logs === "1") console.log("Pedidos rol 2",pedidos)
            }
            else if(rol === rolesNum.administrativo || rol === rolesNum.admin){
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidosMock.pedidos
                })
                if(use_logs === "1") console.log("Pedidos ",pedidosMock.pedidos)
            }
        else console.log("No role")

        }
    }
    //Trae todos los insumos para la creacion de nuevos pedidos
    function insumosFn () {
        if(use_mock === "1") {
            dispatch({
                type: ac.GET_INSUMOS,
                payload: insumosMock.array
            })
        }
        if(use_logs === "1") console.log("Insumos Cargados",insumosMock.array)
    }
    //Trae los Centros de Costos para la creacion de pedidos
    function ccosFn () {
        if(use_mock === "1") {
            dispatch({
                type: ac.GET_CCOS,
                payload: ccosMock.ccos
            })
        }
        if(use_logs === "1") console.log("Ccos Cargados",ccosMock.ccos)
    }
    //Trae todos los usuarios
    function sysUsersFn () {
        if(use_mock === "1") {
            const users: IUser[] = usersMock.users
            dispatch({
                type: ac.GET_ALL_USERS,
                payload: users
            })
        }
    }
    //Aprueba pedido
    function orderAproveFn () {
        if(use_logs === "1") console.log("Orden Aprobada")
        return 0;
    }
    //Rechaza pedido
    function orderRejectFn () {
        if(use_logs === "1") console.log("Orden Rechazada")
        return 0;
    }
    //Cancela pedido
    function orderCancelFn () {
        if(use_logs === "1") console.log("Orden Cancelada")
        return 0;
    }
    //Entrega pedido
    function orderDeliveredFn () {
        if(use_logs === "1") console.log("Orden Entregada")
        return 0;
    }
    //Edita pedido
    function orderEditFn () {
        if(use_logs === "1") console.log("Orden a Editar")
        return 0;
    }
    //Repetir pedido
    function orderRepFn () {
        if(use_logs === "1") console.log("Orden a Editar")
        return 0;
    }
    //AArchivar pedido
    function orderArchFn () {
        if(use_logs === "1") console.log("Orden a Archivar")
        return 0;
    }
    //Eliminar/activar Usuario
    function delUser (username: string, state: boolean) {
        if(state) {
            if(use_logs === "1") console.log("Usuario Activado: "+username)
            
        }
        else{
            if(use_logs === "1") console.log("Usuario elminado: "+username)
        }
        
        return 0;
    }
    //Da de alta a un nuevo usuario
    function addUser (user: IUser) {
        if(use_logs === "1") console.log("Nuevo usuario: ",user)
            return 0
    }

    const innitialState: IGlobalContext = {
        user: {username: '', first_name: '', last_name: '', rol: 3, activated: false},
        sysUsers: [],
        login: false,
        pedidos: [],
        ccos: [],
        insumos: [],
        loginFn,
        logoutFn,
        sessionFn,
        pedidosFn,
        insumosFn,
        ccosFn,
        sysUsersFn,
        orderAproveFn,
        orderRejectFn,
        orderCancelFn,
        orderDeliveredFn,
        orderEditFn,
        orderRepFn,
        orderArchFn,
        delUser,
        addUser
    }




    const [state, dispatch] = useReducer(globalReducer, innitialState)
    return(
        <GlobalContext.Provider value={state}>
            {props.children}
        </GlobalContext.Provider>
    )
}



interface IGlobalContext{
    user: IUser,
    login: boolean,
    pedidos: IPedido[],
    insumos: string[],
    sysUsers: IUser[],
    ccos: string[],
    loginFn: (username: string) => void,
    logoutFn: () => void,
    sessionFn: () => void,
    pedidosFn: (rol: number) => void,
    insumosFn: () => void,
    ccosFn: () => void,
    sysUsersFn: () => void,
    orderAproveFn: () => void,
    orderRejectFn: () => void,
    orderCancelFn: () => void,
    orderEditFn: () => void,
    orderDeliveredFn: () => void,
    orderRepFn: () => void,
    orderArchFn: () => void,
    delUser: (username: string, state: boolean) => void,
    addUser: (user: IUser) => void,
}