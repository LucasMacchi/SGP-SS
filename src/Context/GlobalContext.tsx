//import { useReducer } from "react";
import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, ICategoriesRes, IChangeData, IClientIns, IDetailChange, IEmailSender, IFilter, IInsumo, IPedido, IPedidoRequest, IPropsChildren, IReport, IResponseInsumo, IServicio, IToken, IUser, rolesNum } from "../Utils/Interfaces"
import ac from "./Actions"
import { jwtDecode } from "jwt-decode"; 
import axios, { AxiosResponse } from "axios";
import authReturner from "../Utils/authReturner";

export const GlobalContext = createContext<IGlobalContext | null>(null)
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
        case ac.GET_CATEGORIES:
            return {...state, categories: payload}
        case ac.GET_REPORTS:
            return {...state, reports: payload}
        default:
            return state
    }

}

export default function GlobalState (props: IPropsChildren) {
    const navigation = useNavigate()

    //Funcion para hacer login
    async function loginFn (username: string) {
        try {
            const token: AxiosResponse = await axios.post(SERVER+'/user/login', {username: username})
            localStorage.setItem('jwToken', token.data)
            window.location.reload()
        } catch (error) {
            alert("Error a iniciar sesion: usuario incorrecto")
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
            navigation('/')
            window.location.reload()
        } catch (error) {
            console.log(error)
            localStorage.removeItem('jwToken')
            localStorage.removeItem('usrname')
            navigation('/')
            window.location.reload()
        }
    }
    //Funcion para la sesion
    function sessionFn () {
        const token = localStorage.getItem('jwToken')
        if(token){
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

            if(LOGS === "1") console.log("User logged in by session ")
                navigation("/pedidos")
        }
        else {
            if(LOGS === "1") console.log("No session detected")
            navigation('/')
        }
    }

    //Funcion para conseguir todos los pedidos
    async function pedidosFn ( rol: number, filter: IFilter) {
        if(LOGS === "1") console.log('ROL ',rol)
            const token = localStorage.getItem('jwToken')
            const dataUser: IToken = jwtDecode(token ?? "")
            if(rol === rolesNum.encargado){
                filter.requester = dataUser.user
                const pedidos: AxiosResponse<IPedido[]> = await axios.post(SERVER+'/pedido/all', filter,authReturner())
                const pedidosFiltered = pedidos.data.filter(p => p.requester === dataUser.user)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidosFiltered
                })
            }
            else if(rol === rolesNum.admin || rol === rolesNum.administrativo || rol === rolesNum.en_deposito){
                const pedidos: AxiosResponse<IPedido[]> = await axios.post(SERVER+'/pedido/all',filter ,authReturner())
                console.log(pedidos)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidos.data
                })
            }
            else alert('No valid rol')
    }
    //Trae todos los insumos para la creacion de nuevos pedidos
    async function insumosFn () {
        const insumos: AxiosResponse<IResponseInsumo[]> = await axios.get(SERVER+'/data/insumos', authReturner())

        const filtered = insumos.data.map(i => i.insumo)
        dispatch({
            type: ac.GET_INSUMOS,
            payload: filtered
        })
    }
    //Trae los Centros de Costos para la creacion de pedidos
    async function ccosFn () {
        const ccos: AxiosResponse<IServicio[]> = await axios.get(SERVER+'/data/cco', authReturner())
        dispatch({
            type: ac.GET_CCOS,
            payload: ccos.data
        })
    }
    //Trae todos los usuarios
    async function sysUsersFn () {
        const users: AxiosResponse<IUser[]> = await axios.get(SERVER+'/user/all',authReturner())
        dispatch({
            type: ac.GET_ALL_USERS,
            payload: users.data
        })
    }
    //Aprueba pedido
    async function orderAproveFn (order_id: number, comentario: string, detailsDel?: number[], detailsChange?: IDetailChange[]): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Aprobada")
            const detailsToDelete = {
                details: detailsDel,
                comment: comentario,
                change: detailsChange
            }
        await axios.patch(SERVER+'/pedido/aprove/'+order_id, detailsToDelete,authReturner())
        navigation('/')
        window.location.reload()
        return true;
    }
    //Rechaza pedido
    async function orderRejectFn (order_id: number, comentario: string): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Rechazada")
        const data = {
            comment: comentario
        }
        await axios.patch(SERVER+'/pedido/reject/'+order_id, data,authReturner())
        navigation('/')
        window.location.reload()
        return true;
    }
    //Cancela pedido
    async function orderCancelFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Cancelada")
        await axios.patch(SERVER+'/pedido/cancel/'+order_id, {},authReturner())
        navigation('/')
        window.location.reload()
        return true;
    }
    //Problema pedido
    async function problemFn (order_id: number, comentario: string): Promise<boolean> {
        if(LOGS === "1") console.log("Orden informa problemas")
        const data = {
            comment: comentario
        }
        await axios.patch(SERVER+'/pedido/problem/'+order_id, data,authReturner())
        navigation('/')
        window.location.reload()
        return true;
    }
    //Entrega pedido
    async function orderDeliveredFn (order_id: number, comentario: string): Promise<boolean> {
        if(LOGS === "1") console.log("Orden Entregada, coment: ",comentario)
            const data = {
                comment: comentario
            }
        await axios.patch(SERVER+'/pedido/delivered/'+order_id, data,authReturner())
        navigation('/')
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

        await axios.patch(SERVER+'/pedido/ready/'+order_id, {}, authReturner())
        navigation('/')
        window.location.reload()
        return true;
    }
    //AArchivar pedido
    async function orderArchFn (order_id: number): Promise<boolean> {
        if(LOGS === "1") console.log("Orden a Archivar")
        await axios.patch(SERVER+'/pedido/archive/'+order_id, {},authReturner())
        navigation('/')
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
            navigation('/')
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
        navigation('/')
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
        insumos: IInsumo[], prov: boolean, prov_des: string | null
    ) {
        const ser: number = service_id
        try {
            const data: IPedidoRequest = {
                usuario_id,
                requester,
                service_id: +ser,
                client_id,
                insumos,
                prov: prov,
                prov_des: prov_des
            }
            
            if(LOGS) console.log("Order to create",data)
            await axios.post(SERVER+'/pedido/add',data,authReturner())
            alert("Pedido Creado!")
            navigation('/')
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

    async function generateClientPDF (client_id: number, dateStart: string, dateEnd: string, user_id: number): Promise<IClientIns[] | undefined> {
        try {
            const data = {
                client_id,
                dateEnd,
                dateStart,
                user_id
            }
            const clientInsumos: AxiosResponse<IClientIns[]> = await axios.post(SERVER+'/data/client',data,authReturner())
            return clientInsumos.data
        } catch (error) {
            alert('Error generando pdf.')
            return undefined
        }
    }

    async function sendEmail(data:IEmailSender) {
        await axios.post(SERVER+'/user/email',data,authReturner())
    }

    //Trae todos las categorias 
    async function categoriesGet () {
        const res: ICategoriesRes = await (await axios.get(SERVER+'/data/categories', authReturner())).data
        dispatch({
            type: ac.GET_CATEGORIES,
            payload: res.categorias
        })
    }

    //Crea un nuevo reporte
    async function createReport(data: IReport, reload: boolean) {
        try {
            await axios.post(SERVER+'/pedido/report',data,authReturner())
            alert("Reporte Creado!")
            if(reload) {
                navigation('/')
                window.location.reload()
            }
            return 0
        } catch (error) {
            alert("Error al crear el reporte.")
        }

    }
    //Trae todos reportes
    async function getReports(numero:string) {
        const res: AxiosResponse<IReport[]> = await (await axios.get(SERVER+'/data/reports/'+numero, authReturner())).data
        console.log(res)
        dispatch({
            type: ac.GET_REPORTS,
            payload: res
        })
    }

    //Modifica los provisorios
    async function modProvisorios(data:IChangeData, id: number) {
        await axios.patch(SERVER+'/pedido/provisional/'+id,data,authReturner())
        alert("Pedido modificado")
        navigation('/')
        window.location.reload()
    }

    //Agrega un insumo al pedido
    async function addInsumo (insumo: string, orderId: number, amount: number) {
        try{
            await axios.post(SERVER+`/pedido/insumo/${orderId}/${insumo}/${amount}`,{} ,authReturner())
            alert("Insumo agregado a la orden correctamente.")
            navigation('/')
            window.location.reload()
        }catch(error){
            alert("Error a agregar insumo al pedido.")
        }
    }

    const innitialState: IGlobalContext = {
        user: {username: '', first_name: '', last_name: '', rol: 3, activated: false},
        pedidoDetail: {order_id: 0, requester: '', date_requested: '', insumos: [], state: '', service_id: 0, client_id: 0, archive: false, numero: '', user_id: 0, first_name: '', last_name: '', email: ''},
        sysUsers: [],
        login: false,
        pedidos: [],
        ccos: [],
        insumos: [],
        categories: [],
        reports: [],
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
        pingServer,
        problemFn,
        generateClientPDF,
        sendEmail,
        categoriesGet,
        createReport,
        getReports,
        modProvisorios,
        addInsumo
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
    categories: string[],
    pedidoDetail: IPedido,
    login: boolean,
    pedidos: IPedido[],
    insumos: string[],
    sysUsers: IUser[],
    ccos: IServicio[],
    reports: IReport[],
    loginFn: (username: string) => void,
    logoutFn: () => void,
    sessionFn: () => void,
    pedidosFn: (rol: number, filter: IFilter) => void,
    insumosFn: () => void,
    ccosFn: () => void,
    sysUsersFn: () => void,
    orderAproveFn: (order_id: number, comentario: string, detailsDel?: number[], detailsChange?: IDetailChange[]) => void,
    orderRejectFn: (order_id: number, comentario: string) => void,
    orderCancelFn: (order_id: number) => void,
    orderEditFn: () => void,
    orderDeliveredFn: (order_id: number,comentario: string) => void,
    orderArchFn: (order_id: number) => void,
    delUser: (username: string, state: boolean) => void,
    addUser: (user: IUser) => void,
    uniqPedido: (id: string, pedidos: IPedido[],empty: boolean) => void,
    addPedido: (user_id: number, requester: string, service_id: number, client_id: number,
        insumos: IInsumo[], prov: boolean, prov_des: string | null) => void,
    orderReadyFn: (order_id: number) => void,
    pingServer: () => void,
    problemFn: (order_id: number, comentario: string) => void,
    generateClientPDF: (client_id: number, dateStart: string, dateEnd: string, user_id: number) => Promise<IClientIns[] | undefined>,
    sendEmail: (data:IEmailSender) => void,
    categoriesGet: () => void,
    createReport: (data: IReport, reload: boolean) => void,
    getReports: (numero:string) => void,
    modProvisorios : (data:IChangeData, id: number) => void,
    addInsumo: (insumo: string, orderId: number, amount: number) => void
}
