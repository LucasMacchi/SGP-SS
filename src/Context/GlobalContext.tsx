//import { useReducer } from "react";
import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, IInsumo, IPedido, IPedidoRequest, IPropsChildren, IResponseInsumo, IServicio, IToken, IUser, rolesNum } from "../Utils/Interfaces"
import ac from "./Actions"
import { jwtDecode } from "jwt-decode";
//Mocks
import usersMock from "../Mocks/usersMock.json"
import pedidosMock from "../Mocks/pedidosMocks.json"
import insumosMock from "../Mocks/insumosMock.json"
import ccosMock from "../Mocks/ccoMock.json"
import axios, { AxiosResponse } from "axios";
import authReturner from "../Utils/authReturner";

export const GlobalContext = createContext<IGlobalContext | null>(null)
const MOCK = import.meta.env.VITE_USE_MOCK
const LOGS = import.meta.env.VITE_USE_LOGS
const SERVER = import.meta.env.VITE_SERVER

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
        if(MOCK === "1"){
            usersMock.users.forEach(u => {
                if(username === u.username){
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
            try {
                const token: AxiosResponse = await axios.post(SERVER+'/user/login', {username: username})
                localStorage.setItem('jwToken', token.data)
                window.location.reload()
            } catch (error) {
                alert("Error a iniciar sesion: usuario incorrecto")
            }
        }
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
        const token = localStorage.getItem('jwToken')
        if(token){
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
            else{

                dispatch({
                    payload: true,
                    type: ac.LOGSTATUS_CHN
                })
                const dataUser: IToken = jwtDecode(token)
                const currentDateTime = Math.floor(Date.now() / 1000)
                if(dataUser.exp < currentDateTime) {
                    logoutFn()
                    return 0
                }  
                else{
                    dispatch({
                        payload: {username: dataUser.user, first_name: dataUser.first_name, last_name: dataUser.last_name, rol: dataUser.rol},
                        type: ac.GET_USER
                    })
                }
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
    async function pedidosFn ( rol: number) {
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
        else {
            const token = localStorage.getItem('jwToken')
            const dataUser: IToken = jwtDecode(token ?? "")
            if(rol === rolesNum.encargado){
                console.log("USERNER ",dataUser.user)
                const pedidos: AxiosResponse<IPedido[]> = await axios.get(SERVER+'/pedido/all', authReturner())
                const pedidosFiltered = pedidos.data.filter(p => p.requester === dataUser.user)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidosFiltered
                })
            }
            else if(rol === rolesNum.admin || rol === rolesNum.administrativo || rol === rolesNum.en_deposito){
                const pedidos: AxiosResponse<IPedido[]> = await axios.get(SERVER+'/pedido/all', authReturner())
                console.log(pedidos)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidos.data
                })
            }
            else alert('No valid rol')
        }
    }
    //Trae todos los insumos para la creacion de nuevos pedidos
    async function insumosFn () {
        if(MOCK === "1") {
            dispatch({
                type: ac.GET_INSUMOS,
                payload: insumosMock.array
            })
        }
        else {
            const insumos: AxiosResponse<IResponseInsumo[]> = await axios.get(SERVER+'/data/insumos', authReturner())
            
            const filtered = insumos.data.map(i => i.insumo)
            if(LOGS === "1") console.log("INSUMOS ",filtered)
            dispatch({
                type: ac.GET_INSUMOS,
                payload: filtered
            })
        }
    }
    //Trae los Centros de Costos para la creacion de pedidos
    async function ccosFn () {
        if(MOCK === "1") {
            dispatch({
                type: ac.GET_CCOS,
                payload: ccosMock.ccos
            })
        }
        else {
            const ccos: AxiosResponse<IServicio[]> = await axios.get(SERVER+'/data/cco', authReturner())
            dispatch({
                type: ac.GET_CCOS,
                payload: ccos.data
            })
        }
    }
    //Trae todos los usuarios
    async function sysUsersFn () {
        if(MOCK === "1") {
            const users: IUser[] = usersMock.users
            dispatch({
                type: ac.GET_ALL_USERS,
                payload: users
            })
        }
        else {
            const users: AxiosResponse<IUser[]> = await axios.get(SERVER+'/user/all',authReturner())
            console.log("USERS ",users)
            dispatch({
                type: ac.GET_ALL_USERS,
                payload: users.data
            })
        }
    }
    //Aprueba pedido
    async function orderAproveFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Aprobada")
        await axios.patch(SERVER+'/pedido/aprove/'+order_id, {},authReturner())
        window.location.reload()
        return true;
    }
    //Rechaza pedido
    async function orderRejectFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Rechazada")
        await axios.patch(SERVER+'/pedido/reject/'+order_id, {},authReturner())
        window.location.reload()
        return true;
    }
    //Cancela pedido
    async function orderCancelFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Cancelada")
        await axios.patch(SERVER+'/pedido/cancel/'+order_id, {},authReturner())
        window.location.reload()
        return true;
    }
    //Entrega pedido
    async function orderDeliveredFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Entregada")
        await axios.patch(SERVER+'/pedido/delivered/'+order_id, {},authReturner())
        window.location.reload()
        return true;
    }
    //Edita pedido
    async function orderEditFn () {
        if(LOGS === "1") console.log("Orden a Editar")
        return 0;
    }
    //Repetir pedido
    async function orderReadyFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Lista")
        await axios.patch(SERVER+'/pedido/ready/'+order_id, {},authReturner())
        window.location.reload()
        return true;
    }
    //AArchivar pedido
    async function orderArchFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden a Archivar")
        await axios.patch(SERVER+'/pedido/archive/'+order_id, {},authReturner())
        window.location.reload()
        return true;
    }
    //Eliminar/activar Usuario
    async function delUser (username: string, state: boolean) {
        try {
            if(state) {
                if(LOGS === "1") console.log("Usuario Activado: "+username)
                await axios.patch(SERVER+'/user/activar/'+username, {}, authReturner())
            }
            else{
                if(LOGS === "1") console.log("Usuario elminado: "+username)
                await axios.patch(SERVER+'/user/desactivar/'+username, {}, authReturner())
            }
            window.location.reload()
        } catch (error) {
            alert("Error a cambiar estado de usuario")
        }
        return 0;
    }
    //Da de alta a un nuevo usuario
    async function addUser (user: IUser) {
        if(LOGS === "1") console.log("Nuevo usuario: ",user)
        await axios.post(SERVER+'/user/register', user, authReturner())
        window.location.reload()
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

    //Crea un nuevo pedido
    async function addPedido (usuario_id: number, requester: string, service_id: number, client_id: number,
        insumos: IInsumo[]
    ) {
        const ser: number = service_id
        try {
            const data: IPedidoRequest = {
                usuario_id,
                requester,
                service_id: +ser,
                client_id,
                insumos
            }
            
            if(LOGS) console.log("Order to create",data)
            await axios.post(SERVER+'/pedido/add',data,authReturner())
            alert("Pedido Creado!")
            window.location.reload()
        } catch (error) {
            alert("Error al intentar crear pedido")
        }
    }

    async function pingServer() {
        const pingRes: AxiosResponse<string> = await axios.get(SERVER+'/data/ping')
        if(pingRes.data) return pingRes.data + ' / '+SERVER     
        else return 'Cannot ping the server '+SERVER 
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
        orderReadyFn,
        orderArchFn,
        delUser,
        addUser,
        uniqPedido,
        addPedido,
        pingServer
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
    insumos: string[],
    sysUsers: IUser[],
    ccos: IServicio[],
    loginFn: (username: string) => void,
    logoutFn: () => void,
    sessionFn: () => void,
    pedidosFn: (rol: number) => void,
    insumosFn: () => void,
    ccosFn: () => void,
    sysUsersFn: () => void,
    orderAproveFn: (order_id: number) => void,
    orderRejectFn: (order_id: number) => void,
    orderCancelFn: (order_id: number) => void,
    orderEditFn: () => void,
    orderDeliveredFn: (order_id: number) => void,
    orderArchFn: (order_id: number) => void,
    delUser: (username: string, state: boolean) => void,
    addUser: (user: IUser) => void,
    uniqPedido: (id: string, pedidos: IPedido[],empty: boolean) => void,
    addPedido: (user_id: number, requester: string, service_id: number, client_id: number,
        insumos: IInsumo[]) => void,
    orderReadyFn: (order_id: number) => void,
    pingServer: () => void
}