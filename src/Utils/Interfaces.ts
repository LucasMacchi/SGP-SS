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
export interface IPedido {
    state: 'Pendiente' | 'Aprobado' | 'Cancelado' | 'Rechazado' | 'Entregado' | string,
    numero?: number,
    date_aproved?: string,
    date_requested: string,
    date_delivered?: string,
    requester: string,
    cco: string,
    insumos: IInsumo[]
}

export interface IInsumo {
    name: string,
    amount: number
}
// 0 Admin / 2 encargado / 1 administrativo / 3 invitado
export interface IUser {
    username: string,
    first_name: string,
    last_name: string,
    rol: number,
    cuil?: number,
    dni?: number,
    activated: boolean
}