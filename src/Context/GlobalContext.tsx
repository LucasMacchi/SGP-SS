//import { useReducer } from "react";
import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, IInsumo, IPedido, IPropsChildren, IServicio, IUser, rolesNum } from "../Utils/Interfaces"
import ac from "./Actions"
//Mocks
import usersMock from "../Mocks/usersMock.json"
import pedidosMock from "../Mocks/pedidosMocks.json"
import insumosMock from "../Mocks/insumosMock.json"
import ccosMock from "../Mocks/ccoMock.json"
import axios from "axios";

export const GlobalContext = createContext<IGlobalContext | null>(null)
const MOCK = import.meta.env.VITE_USE_MOCK
const LOGS = import.meta.env.VITE_USE_LOGS
const SERVER = import.meta.env.VITE_SERVER

console.log('MOCK STATUS: ', MOCK)
console.log('MOCK LOGS: ', LOGS)

const globalReducer = (state: IGlobalContext, action: IAction): IGlobalContext => {
    const {type, payload} = action

    switch(type){
        case ac.GET_UNIQUE_PEDIDO:
            return {...state, pedidoDetail: payload}
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
    async function loginFn (username: string) {
        let status = false
        if(MOCK === "1"){
            usersMock.users.forEach(u => {
                if(username === u.username){
                    status = true
                    dispatch({
                        payload: true,
                        type: ac.LOGSTATUS_CHN
                    })
                    if(LOGS === "1") console.log("User " +username+ " logged in")
                    localStorage.setItem('jwToken', '1')
                    localStorage.setItem("usrname", u.username)
                    window.location.reload()
                }
            });
        }
        else {
            const token = axios.post<string>(SERVER+'/user/login', {username: username})
            // WIP localStorage.setItem('jwToken', token)

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
            if(MOCK === "1"){
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

            if(LOGS === "1") console.log("User logged in by session ")
                navigation("/pedidos")
        }
        else {
            if(LOGS === "1") console.log("No session detected")
            navigation('/')
        }
    }

    //Funcion para conseguir todos los pedidos
    function pedidosFn ( rol: number) {
        if(LOGS === "1") console.log('ROL ',rol)
        if(MOCK === "1") {
            if(rol === rolesNum.encargado){
                const username = localStorage.getItem('usrname')
                const pedidos: IPedido[] = pedidosMock.pedidos.filter(p => p.requester === username)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidos
                })
                if(LOGS === "1") console.log("Pedidos rol 2",pedidos)
            }
            else if(rol === rolesNum.administrativo || rol === rolesNum.admin){
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidosMock.pedidos
                })
                if(LOGS === "1") console.log("Pedidos ",pedidosMock.pedidos)
            }
        else console.log("No role")

        }
    }
    //Trae todos los insumos para la creacion de nuevos pedidos
    function insumosFn () {
        if(MOCK === "1") {
            dispatch({
                type: ac.GET_INSUMOS,
                payload: insumosMock.array
            })
        }
        if(MOCK === "1") console.log("Insumos Cargados",insumosMock.array)
    }
    //Trae los Centros de Costos para la creacion de pedidos
    function ccosFn () {
        if(MOCK === "1") {
            dispatch({
                type: ac.GET_CCOS,
                payload: ccosMock.ccos
            })
        }
        if(LOGS === "1") console.log("Ccos Cargados",ccosMock.ccos)
    }
    //Trae todos los usuarios
    function sysUsersFn () {
        if(MOCK === "1") {
            const users: IUser[] = usersMock.users
            dispatch({
                type: ac.GET_ALL_USERS,
                payload: users
            })
        }
    }
    //Aprueba pedido
    function orderAproveFn () {
        if(LOGS === "1") console.log("Orden Aprobada")
        return 0;
    }
    //Rechaza pedido
    function orderRejectFn () {
        if(LOGS === "1") console.log("Orden Rechazada")
        return 0;
    }
    //Cancela pedido
    function orderCancelFn () {
        if(LOGS === "1") console.log("Orden Cancelada")
        return 0;
    }
    //Entrega pedido
    function orderDeliveredFn () {
        if(LOGS === "1") console.log("Orden Entregada")
        return 0;
    }
    //Edita pedido
    function orderEditFn () {
        if(LOGS === "1") console.log("Orden a Editar")
        return 0;
    }
    //Repetir pedido
    function orderRepFn () {
        if(LOGS === "1") console.log("Orden a Editar")
        return 0;
    }
    //AArchivar pedido
    function orderArchFn () {
        if(LOGS === "1") console.log("Orden a Archivar")
        return 0;
    }
    //Eliminar/activar Usuario
    function delUser (username: string, state: boolean) {
        if(state) {
            if(LOGS === "1") console.log("Usuario Activado: "+username)
            
        }
        else{
            if(LOGS === "1") console.log("Usuario elminado: "+username)
        }
        
        return 0;
    }
    //Da de alta a un nuevo usuario
    function addUser (user: IUser) {
        if(LOGS === "1") console.log("Nuevo usuario: ",user)
        return 0
    }

    //Retorna un pedido especifico
    function uniqPedido (id: string, pedidos: IPedido[], empty: boolean) {
        if(empty) {
            dispatch({
                type: ac.GET_UNIQUE_PEDIDO,
                payload: {requester: '', date_requested: '', insumos: [], state: 'Pendiente', cco: ''}
            })
        }
        if(LOGS) console.log("STATE PEDIDO ",pedidos)
        pedidos.forEach(p => {
            if(p.numero === id) {
                if(LOGS) console.log("ORDER TO RETURN ",p)
                dispatch({
                    type: ac.GET_UNIQUE_PEDIDO,
                    payload: p
                })
            }
        });
        
    }

    const innitialState: IGlobalContext = {
        user: {username: '', first_name: '', last_name: '', rol: 3, activated: false},
        pedidoDetail: {order_id: 0, requester: '', date_requested: '', insumos: [], state: '', service_id: 0, client_id: 0, archive: false, numero: '', user_id: 0},
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
        addUser,
        uniqPedido
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
    pedidoDetail: IPedido,
    login: boolean,
    pedidos: IPedido[],
    insumos: IInsumo[],
    sysUsers: IUser[],
    ccos: IServicio[],
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
    uniqPedido: (id: string, pedidos: IPedido[],empty: boolean) => void
}