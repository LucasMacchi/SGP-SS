import { ILgarEntrega } from "./Interfaces";

export default function (lugares: ILgarEntrega[], lentregaId: number) : ILgarEntrega {
    let service_des:ILgarEntrega = {} as ILgarEntrega
    lugares.forEach(s => {
        if(s.lentrega_id == lentregaId) {
            service_des = s
        }
    });
    return service_des
}