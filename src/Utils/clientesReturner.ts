import { IServicio } from "./Interfaces";

export default function (services: IServicio[]) {
    let aux: number = 0
    const data = services.map((s) => {
        if(s.client_id > 0) {
            if(!aux) {
                aux = s.client_id
                return {cliente_id: s.client_id, cliente_des: s.client_des}
            }
            else{
                if(s.client_id !== aux) {
                    aux = s.client_id
                    return {cliente_id: s.client_id, cliente_des: s.client_des}
                }
            }
        }

    })
    return data.filter(s => s)
}
