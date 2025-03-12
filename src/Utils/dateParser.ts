// El proposito de esta funcion es parsear las fechas de string a tipo
// Date y despues ordenarlo en un objeto
interface IparseredDate {
    day: number,
    month: number,
    year: number
}
export default function dateParser (date: string): IparseredDate {
    const newDate = new Date(date)
    const parsered: IparseredDate = {
        day: newDate.getDate(),
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear()
    }
    return parsered
}