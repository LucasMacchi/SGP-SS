import { IServicio } from "./Interfaces";

interface Iclient {
    client_id: number,
    client_des: string
}

export default function (services: IServicio[]): Iclient[] {
    const arrD = services.map((s) => {
        const data: Iclient = {
        client_des: s.client_des,
        client_id: s.client_id
        }
        return data
    })
    let aux = 0
    const arr = arrD.filter((s) => {
        if(aux === 0 ){
            aux = s.client_id
            return s
        }
        if(s.client_id !== aux) {
            aux = s.client_id
            return s
        }
    })
    return arr
}
