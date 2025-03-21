import { JSX } from "react"

export const rolesNum = {
    admin: 1,
    administrativo: 2,
    encargado: 3
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
export interface IPedido {
    state: 'Pendiente' | 'Aprobado' | 'Cancelado' | 'Rechazado' | 'Entregado' | string,
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
    insumos: IInsumo[]
}

export interface IInsumo {
    detail_id?: number,
    amount: number,
    cod_insumo?: number,
    order_id?: number,
    insumo_des: string
}
// 1 admin / 2 administrativo / 3 encargado

export interface IUser {
    username: string,
    first_name: string,
    last_name: string,
    rol: number,
    cuil?: number,
    dni?: number,
    activated: boolean
}

export interface IServicio {
    service_id: number,
    client_id: number,
    service_des: number
}