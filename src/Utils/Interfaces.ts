import { JSX } from "react"

export const rolesNum = {
    admin: 1,
    administrativo: 2,
    encargado: 3,
    en_deposito: 4,
    cocina: 5,
}

export type TEstado = 'Pendiente' | 'Aprobado' | 'Cancelado' | 'Rechazado' | 'Entregado';
export interface IToken {
    token: string
};

export interface IPropsChildren {
    children: React.ReactNode | JSX.Element | JSX.Element[]
};

export interface IAction {
    type: string,
    payload: any
}
export interface IAddPedido {
  requester: string,
  service_id: number,
  client_id: number,
  usuario_id: number,
  insumos: IInsumo[],
  prov?: boolean,
  prov_des?: string,
  service_des: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  legajo?: number
}
export interface IToken {
    user: string,
    rol: number,
    first_name: string,
    last_name: string,
    exp: number,
    iat: number,
    usuario_id: number,
    email: string
}
export interface IPedido {
    state: 'Listo' | 'Pendiente' | 'Aprobado' | 'Cancelado' | 'Rechazado' | 'Entregado' | 'Problemas' | string,
    order_id: number,
    numero: string,
    date_aproved?: string | null,
    date_requested: string ,
    date_delivered?: string | null,
    requester: string,
    service_id: number,
    usuario_id: number,
    client_id: number,
    archive: boolean | number,
    insumos: IInsumo[],
    first_name: string,
    last_name: string,
    email: string,
    prov?: boolean,
    prov_des?: string,
    legajo?: number,
    service_des: string
}

export interface IInsumo {
    detail_id?: number,
    amount: number,
    insumo_id?: number,
    ins_cod1?: number,
    ins_cod2?: number,
    ins_cod3?: number,
    order_id?: number,
    insumo_des: string,
    categoria?: string
}

export interface IInsumoComp {
    insumo_id: number,
    ins_cod1: number,
    ins_cod2: number,
    ins_cod3: number,
    descripcion: string,
    categoria: string,
    rubro: string
}

export interface IResponseInsumo {
    insumo: string
}


// 1 admin / 2 administrativo / 3 encargado

export interface IUser {
    username: string,
    first_name: string,
    last_name: string,
    rol: number,
    activated?: boolean,
    date_creation?: string
    email?: string,
    usuario_id?: number
}

export interface IServicio {
    service_id: number,
    client_id: number,
    service_des: string,
    client_des: string,
    localidad: string
}

export interface IDetailChange {
    detail_id: number,
    amount: number
}
export interface IpedidoDataPDF {
    solicitante_email: string,
    solicitante_nombre: string,
    solicitante_apellido: string,
    solicitante_usuario: string,
    pedido_numero: string,
    pedido_req: string,
    pedido_deli: string | undefined | null,
    pedido_apr: string | undefined | null,
    pedido_client: string,
    pedido_service: string,
    pedido_client_id: number,
    pedido_service_id: number,
    pedido_state: string,
    pedido_insumos: IInsumo[]
}

export interface IpedidoRacDataPDF {
    solicitante_usuario: string,
    pedido_req: string,
    pedido_service: string,
    pedido_client_id: number,
    pedido_service_id: number,
    pedido_local: string,
    pedido_insumos: IInsumoRac[],
    pedido_desglose: string,
    remito_nro: string
}

export interface IDataPdf {
    solicitado: string,
    datos: string[],
    descripcion: string
}

export interface IAddProd {
    descripcion: string,
    compraID: number,
    cantidad: number
}

export interface IInsumoRac {
    des: string,
    kg: number,
    cajas: number,
    bolsas: number,
    rac: number,
    sel?: number
}

export interface IPedidosPDF {
    pedidos: IpedidoDataPDF[]
}
export interface IPedidoPDF {
    pedido: IpedidoDataPDF
}
export interface IPedidoRacPDF {
    pedido: IpedidoRacDataPDF
}
export interface IpedidoClientDataPDF {
    pedido_start: string,
    pedido_end: string,
    pedido_client: string,
    pedido_client_id: number,
    pedido_requester: string,
    pedido_insumos: IInsumo[]
}
export interface IPedidoClientPDF {
    pedido: IpedidoClientDataPDF
}
export interface IClientIns {
    insumo_des: string,
    sum: number,
    insumo_id?: number,
    ins_cod1?: number,
    ins_cod2?: number,
    ins_cod3?: number,
}
export interface ICollectionInsumo {
    insumo_des: string,
    sum: number
}
export interface ICollectionsServ {
    numero: string,
    service_des: string,
    requester: string
}
export interface ICollectionoRes {
    insumos: ICollectionInsumo[],
    servicios: ICollectionsServ []
}
export interface IClientResponse {
    insumos: IClientIns[]
}
export interface ICategoriesRes {
    categorias: string[]
}
export interface ICollectionPDF {
    collection: {
        insumos: IClientIns[],
        orders: ICollectionsServ []
    }
}
export interface IEmailSender {
    to_send:string,
    msg:string,
    sender:string
}
export interface IReport {
    order_id?: number,
    descripcion: string,
    category: string
    pedido_numero: string,
    report_id?: number,
    fecha?: string,
    user_id: number,
    nombre_completo: string,
    email: string,
    fullname?: string
}
export interface IChangeData {
    client_id: number,
    service_id: number
}
export interface IFilter {
    limit: number,
    client: number,
    service: number,
    numero: string
    state: string
    dateStart: string
    dateEnd: string,
    user_id: number
}
export interface IEntrega {
  entrega: {
    fullname: string,
    dni: number,
    service: string,
    fecha_entrega: string,
    insumos: IInsumo[]
  }
}

export interface ICompraDocu {
    c: ICompra  
}

export interface IPersonal {
  legajo: number,
  fullname: string,
  cuil: number,
  sector: string
}

export interface ICatRub {
    categorias: string[],
    rubros: string[]
}

export interface ICollection {
    collection1: string[],
    collection2: string[],
    collection3: string[],
    collection4: string[],
    collection5: string[],
}

export interface IinsumoCompra {
    descripcion: string,
    cantidad: number,
    detail_id?: number
}

export interface ICompra {
    area: string,
    tipo: string,
    compras: IinsumoCompra[],
    descripcion: string,
    lugar: string
    fecha_aprobado?: string,
    activado: boolean,
    aprobado: boolean,
    anulado: boolean,
    fullname: string,
    proveedor: string,
    compra_id: number,
    fecha: string,
    comentario: string,
    nro: string,
    preaprobado: boolean

}

export interface ICompraDto {
    area: string,
    tipo: string,
    descripcion: string,
    lugar: string
    fullname: string,
    proveedor: string,
    compras: IinsumoCompra[],
    date: string
}

export interface IOrderRemito {
    order_id: number,
    numero: number,
    client_des: string,
    service_des: string,
    localidad: string,
    insumos: IInsumo[]
}

export interface ILgarEntrega {
    lentrega_id: number,
    service_id?: number,
    client_id?: number,
    localidad: string,
    direccion: string,
    lat?: number,
    long?: number,
    descripcion: string
}

export interface IDesglose {
    descripcion: string,
    localidad: string,
    desglose_id: number
}