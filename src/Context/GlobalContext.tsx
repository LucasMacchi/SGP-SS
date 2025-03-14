//import { useReducer } from "react";
import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, IPedido, IPropsChildren, IUser } from "../Utils/Interfaces"
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
                    }
                });
            }

            if(use_logs === "1") console.log("User logged in by session ")
            navigation('/pedidos')
        }
        else {
            if(use_logs === "1") console.log("No session detected")
            navigation('/')
        }
    }

    //Funcion para conseguir todos los pedidos
    function pedidosFn ( rol: number) {
        console.log('ROL ',rol)
        if(use_mock === "1") {
            if(rol === 2){
                const username = localStorage.getItem('usrname')
                const pedidos: IPedido[] = pedidosMock.pedidos.filter(p => p.requester === username)
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidos
                })
                if(use_logs === "1") console.log("Pedidos rol 2",pedidos)
            }
            else if(rol === 1 || rol === 0){
                dispatch({
                    type: ac.GET_PEDIDOS,
                    payload: pedidosMock.pedidos
                })
                if(use_logs === "1") console.log("Pedidos ",pedidosMock.pedidos)
            }
        else console.log("No role")

        }
    }

    function insumosFn () {
        if(use_mock === "1") {
            dispatch({
                type: ac.GET_INSUMOS,
                payload: insumosMock.array
            })
        }
        if(use_logs === "1") console.log("Insumos Cargados",insumosMock.array)
    }
    function ccosFn () {
        if(use_mock === "1") {
            dispatch({
                type: ac.GET_CCOS,
                payload: ccosMock.ccos
            })
        }
        if(use_logs === "1") console.log("Ccos Cargados",ccosMock.ccos)
    }

    const innitialState: IGlobalContext = {
        user: {username: '', first_name: '', last_name: '', rol: 3},
        login: false,
        pedidos: [],
        ccos: [],
        insumos: [],
        loginFn,
        logoutFn,
        sessionFn,
        pedidosFn,
        insumosFn,
        ccosFn
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
    ccos: string[],
    loginFn: (username: string) => void,
    logoutFn: () => void,
    sessionFn: () => void,
    pedidosFn: (rol: number) => void,
    insumosFn: () => void,
    ccosFn: () => void
}