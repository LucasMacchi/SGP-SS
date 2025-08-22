import { ILgarEntrega } from "./Interfaces";

export default function (lugares: ILgarEntrega[], lentregaId: number) : string {
    let service_des = ``
    lugares.forEach(s => {
        if(s.lentrega_id == lentregaId) {
            service_des = s.descripcion
        }
    });
    return service_des
}