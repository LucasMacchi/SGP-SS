import { IServicio } from "./Interfaces";

export default function (services: IServicio[]): string[] {
    const arrD = services.map(s => s.localidad)
    const setD = new Set(arrD)
    const arr = Array.from(setD)
    return arr
}
