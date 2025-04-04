
export default function () {
    const currentDate = new Date()
    const month = currentDate.getMonth()
    const date = currentDate.getDate()
    const year = currentDate.getFullYear()
    if(month === 0){
        const newM = 12
        const newY = year - 1
        return newY+(newM < 10 ? '-0' : '-')+newM+'-'+(date < 10 ? '-0' : '-')+date
    }
    else {
        const newM = month 
        return year+(newM < 10 ? '-0' : '-')+newM+(date < 10 ? '-0' : '-')+date
    }
}