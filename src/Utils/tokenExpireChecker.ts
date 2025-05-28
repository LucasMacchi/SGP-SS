import { jwtDecode } from "jwt-decode"

export default function (): boolean {
    const token = localStorage.getItem('jwToken')
    if(token) {
        const currentDateTime = Math.floor(Date.now() / 1000)
        const data = jwtDecode(token)
        if(data['exp'] && data['exp'] < currentDateTime){
          localStorage.removeItem('jwToken')
          return true
        }
        else return false
    }
    else return true
}