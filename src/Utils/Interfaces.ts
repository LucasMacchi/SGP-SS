import { JSX } from "react"

export const rolesNum = {
    admin: 1,
    administrativo: 2,
    encargado: 3,
    en_deposito: 4
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
    user_id: number,
    insumos: IInsumo[]

}
export interface IToken {
    user: string,
    rol: number,
    first_name: string,
    last_name: string,
    exp: number,
    iat: number,
    usuario_id: number
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
    user_id: number,
    client_id: number,
    archive: boolean | number,
    insumos: IInsumo[],
    first_name: string,
    last_name: string,
    email: string
}

export interface IInsumo {
    detail_id?: number,
    amount: number,
    insumo_id?: number,
    ins_cod1?: number,
    ins_cod2?: number,
    ins_cod3?: number,
    order_id?: number,
    insumo_des: string
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
    email?: string
}

export interface IServicio {
    service_id: number,
    client_id: number,
    service_des: string,
    client_des: string
}

export interface IPedidoRequest {
    usuario_id: number,
    requester: string,
    service_id: number,
    client_id: number,
    insumos: IInsumo[]
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
export interface IPedidoPDF {
    pedido: IpedidoDataPDF
}