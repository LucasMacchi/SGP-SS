//import { useReducer } from "react";
import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {
  IAction,
  IAddPedido,
  IAddProd,
  ICategoriesRes,
  ICatRub,
  IChangeData,
  IChangeEnvioInsumo,
  IChangeEnvioInsumoPlan,
  IClientIns,
  ICollection,
  ICollectionoRes,
  ICompra,
  ICompraDto,
  IConformidad,
  ICreateInsumo,
  IDateExport,
  IDesglose,
  IEmailSender,
  IEnvio,
  IEnvioInsumos,
  IEXCELDateExport,
  IEXCELMovimientos,
  IEXCELTotalEnviosInforme,
  IFacturacionData,
  IFacturacionDataInforme,
  IFilter,
  IInsumoComp,
  ILgarEntrega,
  ILugaresResponse,
  IMovimientos,
  IOrderRemito,
  IPedido,
  IPersonal,
  IPlanComplete,
  IPropsChildren,
  IRemitoEnvio,
  IRemitosEnvio,
  IReport,
  IReportEnvio,
  IrequestEnvio,
  IrequestEnvioCom,
  IResponseInsumo,
  IResponseRutas,
  IServicio,
  IToken,
  ITotalEnviosInforme,
  ITxtEnvios,
  IUser,
  rolesNum,
} from "../Utils/Interfaces";
import ac from "./Actions";
import { jwtDecode } from "jwt-decode";
import axios, { AxiosResponse } from "axios";
import authReturner from "../Utils/authReturner";
import envioFormater from "../Utils/envioFormater";
import refillEmptySpace from "../Utils/refillEmptySpace";
export const GlobalContext = createContext<IGlobalContext | null>(null);
const LOGS = import.meta.env.VITE_USE_LOGS;
const SERVER = import.meta.env.VITE_SERVER;

const globalReducer = (
  state: IGlobalContext,
  action: IAction,
): IGlobalContext => {
  const { type, payload } = action;

  switch (type) {
    case ac.GET_ERROR_CATEGORIES:
      return { ...state, errorCat: payload };
    case ac.GET_PERSONAL:
      return { ...state, personal: payload };
    case ac.GET_UNIQUE_PEDIDO:
      return { ...state, pedidoDetail: payload };
    case ac.GET_ALL_USERS:
      return { ...state, sysUsers: payload };
    case ac.GET_CCOS:
      return { ...state, ccos: payload };
    case ac.GET_INSUMOS:
      return { ...state, insumos: payload };
    case ac.GET_USER:
      return { ...state, user: payload };
    case ac.GET_PEDIDOS:
      return { ...state, pedidos: payload };
    case ac.LOGSTATUS_CHN:
      return { ...state, login: payload };
    case ac.GET_CATEGORIES:
      return { ...state, categories: payload };
    case ac.GET_REPORTS:
      return { ...state, reports: payload };
    case ac.GET_INS_CATEGROIES:
      return { ...state, insCategroies: payload };
    case ac.GET_COMPRAS:
      return {...state, compras: payload}
    case ac.SET_COMPRA_DETAIL:
      return {...state, compraDetail: payload};
    case ac.SET_MENU:
      return {...state, menu: payload}
    case ac.SET_LENTREGAS:
      return {...state, lentregas: payload}
    case ac.SET_DESGLOSES:
      return {...state, desgloses: payload}
    default:
      return state;
  }
};

export default function GlobalState(props: IPropsChildren) {
  const navigation = useNavigate();

  //Funcion para hacer login
  async function loginFn(username: string) {
    try {
      const token: AxiosResponse = await axios.post(SERVER + "/user/login", {
        username: username,
      });
      localStorage.setItem("jwToken", token.data);
      window.location.reload();
      navigation("/pedidos");
    } catch (error) {
      console.log(error)
      alert("Error a iniciar sesion: usuario incorrecto");
    }
  }
  //Funcion para hacer logout
  function logoutFn() {
    dispatch({
      payload: false,
      type: ac.LOGSTATUS_CHN,
    });
    dispatch({
      payload: { nombre: "", apellido: "", mail: "", rol: 3 },
      type: ac.GET_USER,
    });
    try {
      localStorage.removeItem("jwToken");
      localStorage.removeItem("usrname");
      navigation("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      localStorage.removeItem("jwToken");
      localStorage.removeItem("usrname");
      navigation("/");
      window.location.reload();
    }
  }
  //Funcion para la sesion
  function sessionFn() {
    const token = localStorage.getItem("jwToken");
    if (token) {
      dispatch({
        payload: true,
        type: ac.LOGSTATUS_CHN,
      });
      const dataUser: IToken = jwtDecode(token);
      const currentDateTime = Math.floor(Date.now() / 1000);
      if (dataUser.exp < currentDateTime) {
        logoutFn();
        return 0;
      } else {
        dispatch({
          payload: {
            username: dataUser.user,
            first_name: dataUser.first_name,
            last_name: dataUser.last_name,
            rol: dataUser.rol,
          },
          type: ac.GET_USER,
        });
      }

      //console.log("User logged in by session ")
      if (window.location.pathname === "/") navigation("/pedidos");
    } else {
      //console.log("No session detected")
      navigation("/");
    }
  }

  //Funcion para conseguir todos los pedidos
  async function pedidosFn(rol: number, filter: IFilter) {
    if (LOGS === "1") console.log("ROL ", rol);
    const token = localStorage.getItem("jwToken");
    const dataUser: IToken = jwtDecode(token ?? "");
    if (rol === rolesNum.encargado || rol === rolesNum.cocina) {
      filter.user_id = dataUser.usuario_id;
      const pedidos: AxiosResponse<IPedido[]> = await axios.post(
        SERVER + "/pedido/all",
        filter,
        authReturner(),
      );
      dispatch({
        type: ac.GET_PEDIDOS,
        payload: pedidos.data,
      });
    } else if (
      rol === rolesNum.admin ||
      rol === rolesNum.administrativo ||
      rol === rolesNum.en_deposito
    ) {
      const pedidos: AxiosResponse<IPedido[]> = await axios.post(
        SERVER + "/pedido/all",
        filter,
        authReturner(),
      );
      dispatch({
        type: ac.GET_PEDIDOS,
        payload: pedidos.data,
      });
    } else alert("No valid rol");
  }
  //Trae todos los insumos para la creacion de nuevos pedidos
  async function insumosFn(empty: boolean) {
    if(!empty) {
    const insumos: AxiosResponse<IResponseInsumo[]> = await axios.get(
      SERVER + "/data/insumos",
      authReturner(),
    );
    console.log(insumos)
    const filtered = insumos.data.map((i) => i.insumo);
    dispatch({
      type: ac.GET_INSUMOS,
      payload: filtered,
    });
    }
    else {
      dispatch({
      type: ac.GET_INSUMOS,
      payload: [],
    });
    }

  }
  //Trae los Centros de Costos para la creacion de pedidos
  async function ccosFn() {
    const ccos: AxiosResponse<IServicio[]> = await axios.get(
      SERVER + "/data/cco",
      authReturner(),
    );
    dispatch({
      type: ac.GET_CCOS,
      payload: ccos.data,
    });
  }
  //Trae todos los usuarios
  async function sysUsersFn() {
    const users: AxiosResponse<IUser[]> = await axios.get(
      SERVER + "/user/all",
      authReturner(),
    );
    dispatch({
      type: ac.GET_ALL_USERS,
      payload: users.data,
    });
  }
  //Aprueba pedido
  async function orderAproveFn(
    order_id: number,
    comentario: string,
  ): Promise<boolean> {
    if (LOGS === "1") console.log("Orden Aprobada");
    const detailsToDelete = {
      comment: comentario
    };
    await axios.patch(
      SERVER + "/pedido/aprove/" + order_id,
      detailsToDelete,
      authReturner(),
    );
    window.location.reload();
    return true;
  }
  async function createPersonal (personal: IPersonal) {
    try{
      await axios.post(
        SERVER + `/data/personal`,personal,
        authReturner()
      );
    }catch(error){
      console.log(error);
      alert("Error al crear personal.");
    }
  }
  async function deletePersonal (legajo: number) {
    try{
      await axios.delete(
        SERVER + `/data/personal/`+legajo,
        authReturner()
      );
    }catch(error){
      console.log(error);
      alert("Error al eliminar personal provisorio.");
    }
  }
  async function orderLegajo (id:number, legajo: number) {
    try{
      await axios.patch(
        SERVER + `/pedido/legajo/${id}/${legajo}`,{},
        authReturner()
      );
      window.location.reload()
    }catch(error){
      console.log(error);
      alert("Error a asignar un legajo.");
    }
  }
  //Rechaza pedido
  async function orderRejectFn(
    order_id: number,
    comentario: string,
  ): Promise<boolean> {
    if (LOGS === "1") console.log("Orden Rechazada");
    const data = {
      comment: comentario,
    };
    await axios.patch(
      SERVER + "/pedido/reject/" + order_id,
      data,
      authReturner(),
    );
    window.location.reload();
    return true;
  }
  //Cancela pedido
  async function orderCancelFn(order_id: number): Promise<boolean> {
    if (LOGS === "1") console.log("Orden Cancelada");
    await axios.patch(
      SERVER + "/pedido/cancel/" + order_id,
      {},
      authReturner(),
    );
    navigation("/");
    window.location.reload();
    return true;
  }
  //Problema pedido
  async function problemFn(
    order_id: number,
    comentario: string,
  ): Promise<boolean> {
    if (LOGS === "1") console.log("Orden informa problemas");
    const data = {
      comment: comentario,
    };
    await axios.patch(
      SERVER + "/pedido/problem/" + order_id,
      data,
      authReturner(),
    );
    navigation("/");
    window.location.reload();
    return true;
  }
  //Entrega pedido
  async function orderDeliveredFn(
    order_id: number,
    comentario: string,
  ): Promise<boolean> {
    if (LOGS === "1") console.log("Orden Entregada, coment: ", comentario);
    const data = {
      comment: comentario,
    };
    await axios.patch(
      SERVER + "/pedido/delivered/" + order_id,
      data,
      authReturner(),
    );
    navigation("/");
    window.location.reload();
    return true;
  }
  //Edita pedido
  async function orderEditFn() {
    if (LOGS === "1") console.log("Orden a Editar");
    return 0;
  }
  //Repetir pedido
  async function orderReadyFn(order_id: number): Promise<boolean> {
    if (LOGS === "1") console.log("Orden Lista");

    await axios.patch(SERVER + "/pedido/ready/" + order_id, {}, authReturner());
    navigation("/");
    window.location.reload();
    return true;
  }
  //AArchivar pedido
  async function orderArchFn(order_id: number): Promise<boolean> {
    if (LOGS === "1") console.log("Orden a Archivar");
    await axios.patch(
      SERVER + "/pedido/archive/" + order_id,
      {},
      authReturner(),
    );
    navigation("/");
    window.location.reload();
    return true;
  }
  //Eliminar/activar Usuario
  async function delUser(username: string, state: boolean) {
    try {
      if (state) {
        if (LOGS === "1") console.log("Usuario Activado: " + username);
        await axios.patch(
          SERVER + "/user/activar/" + username,
          {},
          authReturner(),
        );
      } else {
        if (LOGS === "1") console.log("Usuario elminado: " + username);
        await axios.patch(
          SERVER + "/user/desactivar/" + username,
          {},
          authReturner(),
        );
      }
      navigation("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Error a cambiar estado de usuario");
    }
    return 0;
  }
  //Da de alta a un nuevo usuario
  async function addUser(user: IUser) {
    if (LOGS === "1") console.log("Nuevo usuario: ", user);
    await axios.post(SERVER + "/user/register", user, authReturner());
    navigation("/");
    window.location.reload();
    return 0;
  }

  //Retorna un pedido especifico
  async function uniqPedido(id: number, empty: boolean) {
    try {
      if (empty) {
        dispatch({
          type: ac.GET_UNIQUE_PEDIDO,
          payload: {
            requester: "",
            date_requested: "",
            insumos: [],
            state: "Pendiente",
            cco: "",
          },
        });
      } else {
        const pedido: IPedido[] = await (
          await axios.get(SERVER + "/pedido/detail/" + id)
        ).data[0];
        dispatch({
          type: ac.GET_UNIQUE_PEDIDO,
          payload: pedido,
        });
      }
    } catch (error) {
      console.log(error)
      alert("No se puedo conseguir los datos del pedido.");
      navigation("/");
    }
  }

  //Crea un nuevo pedido
  async function addPedido(
    pedido: IAddPedido
  ) {
    try {
      const token = localStorage.getItem("jwToken");
      const dataUser: IToken = jwtDecode(token ?? "");
      console.log(pedido)
      pedido.first_name = dataUser.first_name
      pedido.last_name = dataUser.last_name
      pedido.email = dataUser.email
      pedido.usuario_id = dataUser.usuario_id
      pedido.requester = dataUser.user
      console.log("Order to create", pedido);
      await axios.post(SERVER + "/pedido/add", pedido, authReturner());
      alert("Pedido Creado!");
      navigation("/");
      window.location.reload();
    } catch (error) {
      console.log(error)
      alert("Error al intentar crear pedido");
    }
  }

  async function pingServer() {
    const pingRes: AxiosResponse<string> = await axios.get(
      SERVER + "/data/ping",
    );
    if (pingRes.data) return pingRes.data + " / " + SERVER;
    else return "Cannot ping the server " + SERVER;
  }

  async function collectionOrders(orders:string []): Promise<ICollectionoRes> {
    
    const collectionInsumos: ICollectionoRes = (await axios.post(SERVER+'/data/collection',{orders},authReturner())).data
    return collectionInsumos

  }

  async function generateClientPDF(
    client_id: number,
    dateStart: string,
    dateEnd: string,
    user_id: number,
  ): Promise<IClientIns[] | undefined> {
    try {
      const data = {
        client_id,
        dateEnd,
        dateStart,
        user_id,
      };
      const clientInsumos: AxiosResponse<IClientIns[]> = await axios.post(
        SERVER + "/data/client",
        data,
        authReturner(),
      );
      return clientInsumos.data;
    } catch (error) {
      console.log(error)
      alert("Error generando pdf.");
      return undefined;
    }
  }

  async function sendEmail(data: IEmailSender) {
    await axios.post(SERVER + "/user/email", data, authReturner());
  }

  //Trae todos las categorias
  async function categoriesGet() {
    const res: ICategoriesRes = await (
      await axios.get(SERVER + "/data/categories", authReturner())
    ).data;
    dispatch({
      type: ac.GET_CATEGORIES,
      payload: res.categorias,
    });
  }

  //Crea un nuevo reporte
  async function createReport(data: IReport, reload: boolean) {
    try {
      await axios.post(SERVER + "/pedido/report", data, authReturner());
      alert("Reporte Creado!");
      if (reload) {
        navigation("/");
        window.location.reload();
      }
      return 0;
    } catch (error) {
      console.log(error)
      alert("Error al crear el reporte.");
    }
  }
  //Trae todos reportes
  async function getReports(numero: string) {
    const res: AxiosResponse<IReport[]> = await (
      await axios.get(SERVER + "/data/reports/" + numero, authReturner())
    ).data;
    console.log(res);
    dispatch({
      type: ac.GET_REPORTS,
      payload: res,
    });
  }

  //Modifica los provisorios
  async function modProvisorios(data: IChangeData, id: number) {
    await axios.patch(
      SERVER + "/pedido/provisional/" + id,
      data,
      authReturner(),
    );
    alert("Pedido modificado");
    navigation("/");
    window.location.reload();
  }

  //Agrega un insumo al pedido
  async function addInsumo(insumo: string, orderId: number, amount: number) {
    try {
      const data = {
        insumo,
        cantidad: amount
      }
      await axios.post(
        SERVER + `/pedido/insumo/${orderId}`,
        data,
        authReturner(),
      );
      alert("Insumo agregado a la orden correctamente.");
      window.location.reload();
    } catch (error) {
      console.log(error)
      alert("Error a agregar insumo al pedido.");
    }
  }
  //Delete Insumo
  async function deleteInsumo(orderId: number) {
    try {
      await axios.delete(SERVER + `/pedido/insumo/${orderId}`, authReturner());
      alert("Insumo eliminado de la orden correctamente.");
      window.location.reload();
    } catch (error) {
      console.log(error)
      alert("Error a eliminar insumo al pedido.");
    }
  }
  //Trae todos las categorias de errores
  async function errorsCatGet() {
    const res: ICategoriesRes = await (
      await axios.get(SERVER + "/data/errors", authReturner())
    ).data;
    dispatch({
      type: ac.GET_ERROR_CATEGORIES,
      payload: res.categorias,
    });
  }

  //Cambia el monto del insumo
  async function changeAmountFn (id: number, cantidad: number) {
    try{
      await axios.patch(SERVER + `/pedido/cantidad/${id}/${cantidad}`, {} ,authReturner())
      alert("Cantidad modificada correctamente.");
      window.location.reload();
    }catch(error){
      console.log(error)
      alert("Error al modificar la cantidad.");
    }
  }
  
  //Envia correo a soporte IT
  async function emailError(data: IReport) {
    try {
      await axios.post(SERVER + "/data/errors", data, authReturner());
      alert("Reporte enviado.");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Error al mandar el reporte.");
    }
  }
  
  //Trae todo el personal por sector
  async function getPersonalBySector (sector: string, empty: boolean) {
    try{
      if(empty) {
        dispatch({
          payload: [],
          type: ac.GET_PERSONAL,
        });
      }
      else {
        const res: IPersonal[] = await (
          await axios.get(SERVER + "/data/legajos/"+sector, authReturner())
        ).data;
        dispatch({
          payload: res,
          type: ac.GET_PERSONAL,
        });
      }

    }catch(error) {
      console.log(error);
      alert("Error al traer el personal del sector "+sector);
    }
  }
  
  //Trae los datos de un trabajador especifico
  async function getPersona (legajo: number): Promise<IPersonal> {
    try{
      const res: IPersonal = await (
        await axios.get(SERVER + "/data/legajo/"+legajo, authReturner())
      ).data;
      return res
    }catch(error) {
      console.log(error);
      alert("Error al traer el personal de legajo "+legajo);
      return {legajo:0,fullname:'',cuil:0,sector:``}
    }
  }

  //Trae toda las categorias de los insumos
  async function getCategoriasInsumos() {
    try {
        const res: string[] = await (await axios.get(SERVER + "/data/categories/insumos", authReturner())).data;
        dispatch({
          payload: res,
          type: ac.GET_INS_CATEGROIES
        })
    } catch (error) {
      console.log(error);
      alert("Error al traer las categorias de los insumos.");
    }
  }

  //Eliminar pedido
  async function eliminarPedido(id:number) {
    try {
      await axios.delete(SERVER+'/pedido/eliminar/'+id,authReturner())
      alert('Pedido eliminado')
      navigation("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Error al eliminar pedido.");
    }   
  }

  //Check if order exists
  async function checkExistsPedido(nro:string): Promise<boolean> {
    const resAx: boolean = (await axios.get(SERVER+'/pedido/uniq/'+nro, authReturner())).data
    console.log(resAx)
    if(resAx) return resAx
    else resAx 
    return false
  }

  //Get areas for compras
  async function getAreasFn(): Promise<string[]> {
    const areas: string[] = (await axios.get(SERVER+"/compras/areas", authReturner())).data
    return areas
  }

  //Register Compra
  async function registerCompra(data: ICompraDto) {
    try {
      await axios.post(SERVER+"/compras/registrar",data,authReturner())
      alert("Compra creada")
    } catch (error) {
      console.log(error);
      alert("Error al crear una compra.");
    }
  }

  //Cambiar estado compra
  async function changeStateCompra(aprobar:boolean, id: number, comentario: string) {
    try {
      if(aprobar) {
        await axios.patch(SERVER+"/compras/aprove/"+id,{comentario},authReturner())
        alert("Compra aprobada")
        window.location.reload()
      }
      else {
        await axios.patch(SERVER+"/compras/null/"+id,{comentario},authReturner())
        alert("Compra anulada")
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
      alert("Error al cambiar la compra.");
    }
  }

  //Traer todos las compras
  async function getAllCompras(revised:boolean,fullname?: string) {
    try {
      const compras: ICompra[] = await (await axios.get(SERVER+"/compras/all", authReturner())).data
      if(revised) {
        let newArr = compras.filter((c) => c.anulado === false && c.aprobado === false)
        if(fullname) {
          newArr = newArr.filter((c) => c.fullname === fullname)
          console.log("Compras de "+fullname)
        }
        dispatch({
          payload: newArr,
          type: ac.GET_COMPRAS
        })
        console.log(newArr)
      }
      else {
        let newArr = compras.filter((c) => c.anulado === true || c.aprobado === true)
        if(fullname) {
          newArr = newArr.filter((c) => c.fullname === fullname)
          console.log("Compras de "+fullname)
        }
        dispatch({
          payload: newArr,
          type: ac.GET_COMPRAS
        })
        console.log(newArr)
      }
    } catch (error) {
      console.log(error);
      alert("Error al traer las compras.");
    }
  }

  async function getUniqCompra(id:number) {
    try {
      const compra: ICompra = await (await axios.get(SERVER+"/compras/uniq/"+id, authReturner())).data
        dispatch({
          payload: compra,
          type: ac.SET_COMPRA_DETAIL
        })
        console.log(compra)
    } catch (error) {
      console.log(error);
      alert("Error al traer la compra.");
    }
  }

  async function getUniqCompraNro(nro: string) {
    try {
      const compraID: number = await (await axios.get(SERVER+"/compras/uniqbynro/"+nro, authReturner())).data
      if(compraID) {
        window.location.href = "/compras/"+compraID
      }
      else {
        alert("Error al encontrar la compra.");
      }
    } catch (error) {
      console.log(error);
      alert("Error al encontrar la compra.");
    }
    return 0
  }

  async function editDesProdCompra(detailID: number, descripcion: string) {
    try {
      await axios.patch(SERVER+"/compras/edit/des",{detailID,descripcion}, authReturner())
      alert("Compra modificada")
      window.location.reload()
    } catch (error) {
      console.log(error);
      alert("Error al editar la compra.");
    }
  }

  async function editCantProdCompra(detailID: number, cantidad: number) {
    try {
      await axios.patch(SERVER+"/compras/edit/cant",{detailID,cantidad}, authReturner())
      alert("Compra modificada")
      window.location.reload()
    } catch (error) {
      console.log(error);
      alert("Error al editar la compra.");
    }
  }
  async function addProdCompra (data: IAddProd) {
    try {
      await axios.post(SERVER+"/compras/add",data, authReturner())
      alert("Compra modificada.")
      window.location.reload()
    } catch (error) {
      console.log(error);
      alert("Error al editar la compra.");
    }
  }
  async function deleteProdCompra(detailID: number) {
    try {
      await axios.delete(SERVER+"/compras/delete/"+detailID, authReturner())
      alert("Compra modificada")
      window.location.reload()
    } catch (error) {
      console.log(error);
      alert("Error al editar la compra.");
    }
  }

  async function collectionRemito(orders:string []): Promise<IOrderRemito[]> {
    try {
      const collection: IOrderRemito[] = await (await axios.post(SERVER+"/data/collection/remito", {orders}, authReturner())).data
      return collection
    } catch (error) {
      console.log(error);
      alert("Error al generar remito.");
      return []
    }
  }

  async function  getInsumosComplete(): Promise<IInsumoComp[]> {
    try {
      const insumos: IInsumoComp[] = (await axios.get(SERVER+"/data/insumos/complete",authReturner())).data
      return insumos
    } catch (error) {
      return []
    }
  }

  async function preaproveCompraFn (id: number, comentario: string) {
    try {
      await axios.patch(SERVER+"/compras/preaprove/"+id,{comentario},authReturner())
      alert("Compra preaprobada")
      window.location.reload()
    } catch (error) {
      console.log(error);
      alert("Error al cambiar la compra.");
    }
  }
  async function lugaresDeEntrega () : Promise<ILgarEntrega[]> {
    try {
      const lugares:ILgarEntrega[] = (await axios.get(SERVER+"/envios/lentrega",authReturner())).data
      dispatch({
        payload: lugares,
        type: ac.SET_LENTREGAS,
      });
      return lugares
    } catch (error) {
      console.log(error);
      return []
    }
  }
  async function getLugaresEntreFn(departamento: string, fort: number): Promise<ILugaresResponse> {
    try {
      const entregas: ILugaresResponse = (await axios.get(SERVER+"/envios/entregas/"+departamento+"/"+fort,authReturner())).data
      entregas.cabeceras.sort((a,b) => a.lentrega_id-b.lentrega_id)
      return entregas
    } catch (error) {
      console.log(error);
      return {cabeceras: [],desgloses: []}
    }
  }
  async function getDesglosesFn() {
    try {
      const desgloses: IDesglose[] = (await axios.get(SERVER+"/envios/desgloses",authReturner())).data
      dispatch({
        payload: desgloses,
        type: ac.SET_DESGLOSES,
      });
    } catch (error) {
      console.log(error);
      alert("Error al traer lugares de entrega.");
    }
  }

  function changeMenu (v: number) {
    dispatch({
      payload: v,
      type: ac.SET_MENU,
    });
  }

  async function registerEnvio(envios: IEnvio[]) {
    try {
      const formatedEnvios = envioFormater(envios)
      console.log(formatedEnvios)
      alert("Envios creados!. Numero "+formatedEnvios[0].identificador)
    } catch (error) {
      console.log(error)
      alert("Error al crear envios.")
    }
    
  }

  async function getEnviosTanda(start: number, end: number, pv: number): Promise<IrequestEnvio[]> {
    try {
      const parsedStart = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,start)
      const parsedEnd = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,end)
      const envios: IrequestEnvio[] = (await axios.get(SERVER+`/envios/tanda/${parsedStart}/${parsedEnd}`,authReturner())).data
      return envios
    } catch (error) {
      console.log(error);
      alert("Error al traer los envios.");
      return []
    }
  }
  async function getEnviosTandaCustom(remitos: string[]): Promise<IrequestEnvio[]> {
    try {
      const envios: IrequestEnvio[] = (await axios.post(SERVER+`/envios/custom/tanda`,{remitos},authReturner())).data
      return envios
    } catch (error) {
      console.log(error);
      alert("Error al traer los envios.");
      return []
    }
  }
    async function getTxtEnvio(start: number, end: number, pv: number): Promise<ITxtEnvios> {
      try {
        const parsedStart = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,start)
        const parsedEnd = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,end)
        const envios: ITxtEnvios = (await axios.get(SERVER+`/envios/txt/${parsedStart}/${parsedEnd}`,authReturner())).data
        return envios
      } catch (error) {
        console.log(error);
        alert("Error al traer los envios.");
        return {cabecera: [], items: [], informe: [] }
      }
    }
    async function getRutaEnvio(start: number, end: number, pv: number): Promise<IResponseRutas | null> {
      try {
        const parsedStart = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,start)
        const parsedEnd = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,end)
        const ruta: IResponseRutas = (await axios.get(SERVER+`/envios/ruta/${parsedStart}/${parsedEnd}`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        alert("Error al traer los datos para la ruta.");
        return null
      }
    }
    async function getRutaEnvioCustom(remitos: string[]): Promise<IResponseRutas | null> {
      try {
        const ruta: IResponseRutas = (await axios.post(SERVER+`/envios/custom/ruta`,{remitos},authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        alert("Error al traer los datos para la ruta.");
        return null
      }
    }
    async function getPv(): Promise<number | null> {
      try {
        const ruta: number = (await axios.get(SERVER+`/envios/pv`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        return null
      }
    }
    async function getCurrentPlan(): Promise<number | null> {
      try {
        const ruta: number = (await axios.get(SERVER+`/envios/plan`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        return null
      }
    }
    async function getLastRt(): Promise<number | null> {
      try {
        const ruta: number = (await axios.get(SERVER+`/envios/rt`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        return null
      }
    }
    async function getReportesEnvio(remito: string): Promise<IReportEnvio[]> {
      try {
        const reps: IReportEnvio[] = (await axios.get(SERVER+`/envios/reportes/${remito}`,authReturner())).data
        return reps
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function createReportesEnvio(remito: string,titulo:string, des:string) {
      try {
        const data = {
          remito,
          titulo,
          des
        }
        await axios.post(SERVER+`/envios/reportes/create`,data,authReturner())
        alert("Reporte creado.")
      } catch (error) {
        console.log(error);
        alert("Error en  crear Reporte.")
      }
    }
    async function getConformidadEnvio(start: number, end: number, pv: number): Promise<IConformidad[]> {
      try {
        const parsedStart = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,start)
        const parsedEnd = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,end)
        const ruta: IConformidad[] = (await axios.get(SERVER+`/envios/actas/${parsedStart}/${parsedEnd}`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        alert("Error al traer los datos para la ruta.");
        return []
      }
    }
    async function getConformidadEnvioCustom(remitos: string[]): Promise<IConformidad[]> {
      try {
        const ruta: IConformidad[] = (await axios.post(SERVER+`/envios/custom/actas`,{remitos},authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        alert("Error al traer los datos para la ruta.");
        return []
      }
    }
    
    async function deleteTandaFn (tanda: number, key: string) {
      try {
        const response: string = (await axios.delete(SERVER+`/envios/del/tanda/${tanda}/${key}`,authReturner())).data
        alert(response)
      } catch (error) {
        console.log(error);
        alert("Error al eliminar la tanda.");
      }
    }
    async function getInsumosEnvios (): Promise<IEnvioInsumos[]> {
      try {
        const response: IEnvioInsumos[] = (await axios.get(SERVER+`/envios/insumos`,authReturner())).data
        return response
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function getEnviosPlanes (): Promise<IPlanComplete[]> {
      try {
        const response: IPlanComplete[] = (await axios.get(SERVER+`/envios/planes`,authReturner())).data
        return response
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function getEnviosRemitos (limit: number): Promise<IRemitosEnvio[][]> {
      try {
        const response: IRemitosEnvio[] = (await axios.get(SERVER+`/envios/remitos/${limit}`,authReturner())).data
        const pages: IRemitosEnvio[][] = []
        const paginasCount = 100
        if(response.length > paginasCount) {
          for (let i = 0; i < response.length; i += paginasCount) {
            const arr = response.slice(i,i + paginasCount)
            pages.push(arr)
          }
        }
        else {
          for (let i = 0; i < response.length; i += paginasCount) {
            pages.push(response)
          }
        }
        return pages
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function getEnvioRemitoUniq (remito: string): Promise<IRemitosEnvio | null> {
      try {
        const response: IRemitosEnvio = (await axios.get(SERVER+`/envios/uniq/remito/${remito}`,authReturner())).data
        return response
      } catch (error) {
        console.log(error);
        return null
      }
    }
    async function changeEnviosStateRemitos (state: string, remito: string,date?:string) {
      try {
        const dateP = (date && date.length > 0) ? "/"+date : "/non"
        await axios.patch(SERVER+`/envios/remitos/estado/${state}/${remito}`+dateP,{},authReturner())
        alert(`Remito ${remito} cambiado al estado ${state}`)
        //window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al cambiar el estado del remito "+remito)
      }
    }

    async function changeEnviosStateRemitosMultiple (state: string, remitos: string[]) {
      try {
        const data = {
          estado: state,
          remitos
        }
        await axios.patch(SERVER+`/envios/remitos/multiple/estado`,data,authReturner())
        alert(`Remitos han cambiado al estado ${state}`)
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al cambiar el estado de los remitos")
      }
    }

    async function createEnvios (data: IrequestEnvioCom[], update: boolean): Promise<string> {
      try {
        const enviadosCL = data.filter(env => !env.fortificado)
        const enviadosAL = data.filter(env => env.fortificado)
        const parsed = {
          enviadosCL,
          enviadosAL,
          update        
        }
        const response: string = (await axios.post(SERVER+`/envios/create`,parsed,authReturner())).data
        return response
      } catch (error) {
        console.log(error);
        return "ERROR"
      }
    }
    async function patchInsumoEnvio (data: IChangeEnvioInsumo): Promise<void> {
      try {
        const response: string = (await axios.patch(SERVER+`/envios/insumos`,data,authReturner())).data
        alert(response);
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al modificar insumo.");
      }
    }
    async function patchInsumoEnvioPlan (data: IChangeEnvioInsumoPlan): Promise<void> {
      try {
        const response: string = (await axios.patch(SERVER+`/envios/plan/edit/insumo`,data,authReturner())).data
        alert(response);
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al modificar insumo del plan.");
      }
    }
    async function deleteInsumoEnvioPlan (id: number): Promise<void> {
      try {
        const response: string = (await axios.delete(SERVER+`/envios/plan/del/insumo/`+id,authReturner())).data
        alert(response);
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al modificar insumo del plan.");
      }
    }
    async function addInsumoEnvioPlan (plan: number, ins: number, dias: number): Promise<void> {
      try {
        const response: string = (await axios.post(SERVER+`/envios/plan/add/insumo/${plan}/${ins}/${dias}`,{},authReturner())).data
        alert(response);
      } catch (error) {
        console.log(error);
        alert("Error al agregar insumo al plan.");
      }
    }
    async function addPlan (des: string, dias: number): Promise<void> {
      try {
        const response: string = (await axios.post(SERVER+`/envios/add/plan/${des}/${dias}`,{},authReturner())).data
        alert(response);
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al agregar insumo al plan.");
      }
    }
    async function getInformeDate (fecha: string): Promise<IEXCELDateExport[]> {
      try {
        const response: IDateExport[] = (await axios.get(SERVER+`/envios/informe/${fecha}`,authReturner())).data
        const parsedData: IEXCELDateExport[] = []
        response.forEach(r => {
          parsedData.push({
            REMITO: r.nro_remito,
            ENTREGA: r.lentrega_id,
            COMPLETO: r.completo,
            DEPENDENCIA: r.dependencia,
            LOCALIDAD: r.localidad,
            DIRECCION: r.direccion,
            FECHA: r.fecha_created.split("T")[0],
            TANDA: r.tanda
          })
        });
        return parsedData
      } catch (error) {
        console.log(error);
        return []
      }
    }

    async function getRemitosData(start: number, end: number,pv: number): Promise<IRemitoEnvio[]> {
        const parsedStart = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,start)
        const parsedEnd = refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,end)
        try {
          const data: IRemitoEnvio[] = (await axios.get(SERVER+`/envios/remitos/${parsedStart}/${parsedEnd}`,authReturner())).data
          return data
        } catch (error) {
          console.log(error);
          return []
        }
    }
    async function getRemitosDataCustom(remitos: string[]): Promise<IRemitoEnvio[]> {
        try {
          const data: IRemitoEnvio[] = (await axios.post(SERVER+`/envios/custom/remitos`,{remitos},authReturner())).data
          return data
        } catch (error) {
          console.log(error);
          return []
        }
    }
    async function getCai(): Promise<number | null> {
      try {
        const ruta: number = (await axios.get(SERVER+`/envios/cai`,authReturner())).data
        console.log("Load CAI...")
        return ruta
      } catch (error) {
        console.log(error);
        return null
      }
    }
    async function getVenc(): Promise<number | null> {
      try {
        const ruta: number = (await axios.get(SERVER+`/envios/vencimiento`,authReturner())).data
        console.log("Load Vencimiento...")
        return ruta
      } catch (error) {
        console.log(error);
        return null
      }
    }

    async function editDataEnvios (id: number, payload: number) {
      try {
        await axios.patch(SERVER+`/envios/edit/data/${id}/${payload}`,{},authReturner())
        alert("Datos actualizados")
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al modificar el valor.");
      }
    }
    async function postNewInsumoEnvio (data: ICreateInsumo) {
      try {
        await axios.post(SERVER+`/envios/insumos`,data,authReturner())
        alert("Insumo creado.")
        window.location.reload()
      } catch (error) {
        console.log(error);
        alert("Error al crear el insumo.");
      }
    }
    async function postFacturaRemito (fact: string, fecha: string, remitos: string[]) {
      try {
        const data = {
          factura: fact,
          fechaF: fecha,
          remitos: remitos
        }
        await axios.post(SERVER+`/envios/facturacion`,data,authReturner())
        alert("Facturacion creada.")
      } catch (error) {
        console.log(error);
        alert("Error al crear la Facturacion.");
      }
    }
    async function getFinTalo(): Promise<number | null> {
      try {
        const ruta: number = (await axios.get(SERVER+`/envios/fintalo`,authReturner())).data
        console.log("Load Talonario End...")
        return ruta
      } catch (error) {
        console.log(error);
        return null
      }
    }
    async function getDepartamentos(): Promise<string[]> {
      try {
        const ruta: string[] = (await axios.get(SERVER+`/envios/departamentos`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function checkRemitoFacturacionFn(remito: string): Promise<boolean> {
      try {
        const ruta: boolean = (await axios.get(SERVER+`/envios/facturacion/check/${remito}`,authReturner())).data
        return ruta
      } catch (error) {
        console.log(error);
        return false
      }
    }

    async function getFacturaCountFn(factura: string): Promise<IFacturacionData> {
      try {
        const count: IFacturacionData = (await axios.get(SERVER+`/envios/facturacion/count/${factura}`,authReturner())).data
        return count
      } catch (error) {
        console.log(error);
        return {count: 0, raciones: 0}
      }
    }

    async function getFacturaInfFn(factura: string): Promise<IFacturacionDataInforme[]> {
      try {
        const data: IFacturacionDataInforme[] = (await axios.get(SERVER+`/envios/facturacion/inf/${factura}`,authReturner())).data
        return data
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function getMovimientosFn(start: string, end: string): Promise<IEXCELMovimientos[]> {
      try {
        const data: IMovimientos[] = (await axios.get(SERVER+`/envios/movimientos/${start}/${end}`,authReturner())).data
        const dataParsed:IEXCELMovimientos[] = []
        data.forEach(d => {
          dataParsed.push({
            INSUMO: d.insumo,
            RACIONES: d.raciones,
            UNIDADES: d.unidades
          })
        });
        return dataParsed
      } catch (error) {
        console.log(error);
        return []
      }
    }
    async function getEnviosTotalExclFn(): Promise<IEXCELTotalEnviosInforme[]> {
      try {
        const data: ITotalEnviosInforme[] = (await axios.get(SERVER+`/envios/total/informe`,authReturner())).data
        const dataParsed:IEXCELTotalEnviosInforme[] = []
        data.forEach(d => {
          dataParsed.push({
            REMITO: d.nro_remito,
            ENTREGA: d.lentrega_id,
            COMPLETO: d.completo,
            DEPENDENCIA: d.dependencia,
            FECHA: d.fecha_created.split("T")[0],
            ESTADO: d.estado,
            TANDA: d.tanda,
            TIPO: d.fortificado ? "AL" : "CL"
          })
        });
        return dataParsed
      } catch (error) {
        console.log(error);
        return []
      }
    }

  
  
  const innitialState: IGlobalContext = {
    user: {
      username: "",
      first_name: "",
      last_name: "",
      rol: 3,
      activated: false,
    },
    menu: 1,
    pedidoDetail: {
      order_id: 0,
      requester: "",
      date_requested: "",
      insumos: [],
      state: "",
      service_id: 0,
      client_id: 0,
      archive: false,
      numero: "",
      usuario_id: 0,
      first_name: "",
      last_name: "",
      email: "",
      service_des: ``
    },
    compraDetail: {
        area: "",
        tipo: "",
        compras: [],
        descripcion: "",
        lugar: "",
        fecha_aprobado: "",
        activado: true,
        aprobado: false,
        anulado: false,
        preaprobado: false,
        fullname: "",
        proveedor: "",
        compra_id: 0,
        fecha: "",
        comentario: "",
        nro: ""
    },
    personal: [],
    sysUsers: [],
    coleccion: {collection1: [],collection2: [],
      collection3: [],collection5: [],collection4: [],
    },
    login: false,
    pedidos: [],
    ccos: [],
    lentregas: [],
    compras: [],
    insumos: [],
    categories: [],
    reports: [],
    insCategroies: {rubros: [], categorias: []},
    errorCat: [],
    desgloses: [],
    loginFn,
    logoutFn,
    sessionFn,
    pedidosFn,
    getConformidadEnvio,
    getInsumosComplete,
    insumosFn,
    ccosFn,
    collectionRemito,
    sysUsersFn,
    registerEnvio,
    changeMenu,
    editDataEnvios,
    getCai,
    orderAproveFn,
    preaproveCompraFn,
    orderRejectFn,
    orderCancelFn,
    orderDeliveredFn,
    orderEditFn,
    orderReadyFn,
    getPersonalBySector,
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
    addInsumo,
    errorsCatGet,
    emailError,
    deleteInsumo,
    changeAmountFn,
    getPersona,
    orderLegajo,
    createPersonal,
    deletePersonal,
    getCategoriasInsumos,
    eliminarPedido,
    checkExistsPedido,
    collectionOrders,
    getAreasFn,
    registerCompra,
    changeStateCompra,
    getAllCompras,
    getUniqCompra,
    editDesProdCompra,
    editCantProdCompra,
    deleteProdCompra,
    getUniqCompraNro,
    addProdCompra,
    getLugaresEntreFn,
    getDesglosesFn,
    getEnviosTanda,
    getTxtEnvio,
    getRutaEnvio,
    deleteTandaFn,
    getInsumosEnvios,
    getEnviosPlanes,
    createEnvios,
    patchInsumoEnvio,
    patchInsumoEnvioPlan,
    deleteInsumoEnvioPlan,
    addInsumoEnvioPlan,
    addPlan,
    getPv,
    getInformeDate,
    getLastRt,
    getRemitosData,
    getVenc,
    getFinTalo,
    getDepartamentos,
    getEnviosTandaCustom,
    getRutaEnvioCustom,
    getRemitosDataCustom,
    getConformidadEnvioCustom,
    getEnviosRemitos,
    changeEnviosStateRemitos,
    lugaresDeEntrega,
    getReportesEnvio,
    createReportesEnvio,
    postNewInsumoEnvio,
    postFacturaRemito,
    checkRemitoFacturacionFn,
    getFacturaCountFn,
    getFacturaInfFn,
    changeEnviosStateRemitosMultiple,
    getMovimientosFn,
    getEnviosTotalExclFn,
    getCurrentPlan,
    getEnvioRemitoUniq
  };

  const [state, dispatch] = useReducer(globalReducer, innitialState);
  return (
    <GlobalContext.Provider value={state}>
      {props.children}
    </GlobalContext.Provider>
  );
}

interface IGlobalContext {
  user: IUser;
  menu: number;
  lentregas: ILgarEntrega[];
  createPersonal: (personal: IPersonal) => void;
  personal: IPersonal[];
  categories: string[];
  desgloses: IDesglose[];
  insCategroies: ICatRub,
  errorCat: string[];
  pedidoDetail: IPedido;
  login: boolean;
  compras: ICompra[];
  pedidos: IPedido[];
  insumos: string[];
  sysUsers: IUser[];
  coleccion: ICollection;
  ccos: IServicio[];
  reports: IReport[];
  compraDetail: ICompra,
  loginFn: (username: string) => void;
  logoutFn: () => void;
  sessionFn: () => void;
  pedidosFn: (rol: number, filter: IFilter) => void;
  insumosFn: ( empty: boolean) => void;
  ccosFn: () => void;
  sysUsersFn: () => void;
  orderAproveFn: (
    order_id: number,
    comentario: string,
  ) => void;
  registerEnvio: (envios: IEnvio[]) => void;
  orderRejectFn: (order_id: number, comentario: string) => void;
  orderCancelFn: (order_id: number) => void;
  orderEditFn: () => void;
  orderDeliveredFn: (order_id: number, comentario: string) => void;
  orderArchFn: (order_id: number) => void;
  delUser: (username: string, state: boolean) => void;
  addUser: (user: IUser) => void;
  uniqPedido: (id: number, empty: boolean) => void;
  addPedido: (pedido: IAddPedido) => void;
  orderReadyFn: (order_id: number) => void;
  pingServer: () => void;
  problemFn: (order_id: number, comentario: string) => void;
  generateClientPDF: (
    client_id: number,
    dateStart: string,
    dateEnd: string,
    user_id: number,
  ) => Promise<IClientIns[] | undefined>;
  sendEmail: (data: IEmailSender) => void;
  categoriesGet: () => void;
  errorsCatGet: () => void;
  createReport: (data: IReport, reload: boolean) => void;
  getReports: (numero: string) => void;
  modProvisorios: (data: IChangeData, id: number) => void;
  addInsumo: (insumo: string, orderId: number, amount: number) => void;
  emailError: (data: IReport) => void;
  deleteInsumo: (orderId: number) => void;
  changeAmountFn: (id: number, cantidad: number) => void;
  getPersonalBySector: (sector: string, empty: boolean) => void;
  getPersona: (legajo: number) => Promise<IPersonal>;
  orderLegajo: (id: number, legajo: number) => void;
  deletePersonal: (legajo: number) => void;
  getCategoriasInsumos: () => void;
  getAreasFn: () => Promise<string[]>;
  eliminarPedido: (id: number) => void;
  checkExistsPedido: (nro: string) => Promise<boolean>;
  collectionOrders: (orders:string []) => Promise<ICollectionoRes>;
  registerCompra: (data: ICompraDto) => void;
  changeStateCompra: (aprobar:boolean, id: number,comentario: string) => void;
  preaproveCompraFn: (id: number, comentario: string) => void;
  getAllCompras: (revised:boolean, fullname?: string) => void;
  getUniqCompra: (id:number) => void;
  getLugaresEntreFn: (departamento: string, fort: number) => Promise<ILugaresResponse>;
  editDesProdCompra: (detailID: number, descripcion: string) => void;
  editCantProdCompra: (detailID: number, cantidad: number) => void;
  deleteProdCompra: (detailID: number) => void;
  getUniqCompraNro: (nro: string) => void;
  collectionRemito: (orders:string []) => Promise<IOrderRemito[]>;
  getInsumosComplete: () => Promise<IInsumoComp[]>;
  changeMenu: (v: number) => void;
  getDesglosesFn: () => void;
  addProdCompra: (data: IAddProd) => void;
  getEnviosTanda: (start: number, end: number, pv: number) => Promise<IrequestEnvio[]>;
  getTxtEnvio: (start: number, end: number, pv: number) => Promise<ITxtEnvios>;
  getRutaEnvio:(start: number, end: number, pv: number) => Promise<IResponseRutas | null>;
  getConformidadEnvio: (start: number, end: number, pv: number) => Promise<IConformidad[]>;
  deleteTandaFn: (tanda: number, key: string) => void;
  getInsumosEnvios: () => Promise<IEnvioInsumos[]>;
  getEnviosPlanes: () => Promise<IPlanComplete[]>;
  createEnvios: (data: IrequestEnvioCom[],update: boolean) => Promise<string>;
  patchInsumoEnvio: (data: IChangeEnvioInsumo) => Promise<void>;
  patchInsumoEnvioPlan: (data: IChangeEnvioInsumoPlan) => Promise<void>;
  deleteInsumoEnvioPlan: (id: number) => Promise<void>;
  addInsumoEnvioPlan: (plan: number, ins: number, dias: number) => Promise<void>;
  addPlan: (des: string, dias: number) => Promise<void>;
  getPv:() => Promise<number | null>;
  getLastRt:() => Promise<number | null>;
  getInformeDate: (fecha: string) => Promise<IEXCELDateExport[]>;
  getRemitosData: (start: number, end: number,pv: number) => Promise<IRemitoEnvio[]>;
  getCai: () => Promise<number | null>;
  getFinTalo: () => Promise<number | null>;
  getVenc: () => Promise<number | null>;
  editDataEnvios: (id: number, payload: number) => void;
  getDepartamentos: () => Promise<string[]>;
  getEnviosTandaCustom: (remitos: string[]) => Promise<IrequestEnvio[]>;
  getRutaEnvioCustom: (remitos: string[]) => Promise<IResponseRutas | null>;
  getRemitosDataCustom: (remitos: string[]) => Promise<IRemitoEnvio[]>;
  getConformidadEnvioCustom: (remitos: string[]) => Promise<IConformidad[]>;
  getEnviosRemitos: (limit: number) => Promise<IRemitosEnvio[][]>;
  changeEnviosStateRemitos: (state: string, remito: string,date?:string) => void;
  lugaresDeEntrega: () => Promise<ILgarEntrega[]>;
  getReportesEnvio: (remito: string) => Promise<IReportEnvio[]>;
  createReportesEnvio: (remito: string,titulo:string, des:string) => Promise<void>;
  postNewInsumoEnvio: (data: ICreateInsumo) => Promise<void>;
  postFacturaRemito: (fact: string, fecha: string, remitos: string[]) => Promise<void>;
  checkRemitoFacturacionFn: (remito: string) => Promise<boolean> ;
  getFacturaCountFn: (factura: string) => Promise<IFacturacionData>;
  getFacturaInfFn: (factura: string) => Promise<IFacturacionDataInforme[]>;
  changeEnviosStateRemitosMultiple: (state: string, remitos: string[]) => Promise<void>;
  getMovimientosFn: (start: string, end: string) => Promise<IEXCELMovimientos[]>;
  getEnviosTotalExclFn: () => Promise<IEXCELTotalEnviosInforme[]>;
  getCurrentPlan: () => Promise<number | null>;
  getEnvioRemitoUniq: (remito: string) => Promise<IRemitosEnvio | null>
}
