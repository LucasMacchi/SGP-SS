import { IServicio } from "./Interfaces";

export default function (services: IServicio[], service_id: number) : string {
    let service_des = ``
    services.forEach(s => {
        if(s.service_id == service_id) {
            service_des = s.service_des
        }
    });
    return service_des
}