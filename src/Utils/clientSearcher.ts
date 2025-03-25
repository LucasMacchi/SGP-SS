import { IServicio } from "./Interfaces";

export default function (services: IServicio[], service_id: number) : number {
    let client_id = 0
    services.forEach(s => {
        if(s.service_id == service_id) {
            client_id = s.client_id
        }
    });
    return client_id
}