import { IDesglose } from "./Interfaces";

export default function (id: number, desgloses: IDesglose[]): string {
    let service_des = ""
    desgloses.forEach(s => {
        if(s.desglose_id == id) {
            service_des = s.descripcion
        }
    });
    return service_des
}