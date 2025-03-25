export default function () {
    const token = localStorage.getItem('jwToken')
    return {headers:{'Authorization': `Bearer ${token}`}}
}