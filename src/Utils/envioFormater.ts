import { IEndCode, IEnvio } from "./Interfaces";
import insumos from "../Componets/Envios/insumos.json"


function dateReturner(): IEndCode {
  const currentDate = new Date()
  const end: IEndCode = {
    month: '',
    year: '',
    day: '',
    hour: '',
    sec: 0,
    dayWeek: 0
  }
  switch(currentDate.getMonth()){
    case 0:
      end.month = 'EN'
      break;
    case 1:
      end.month = 'FE'
      break;
    case 2:
      end.month = 'MA'
      break;
    case 3:
      end.month = 'AB'
      break;
    case 4:
      end.month = 'MY'
      break;
    case 5: 
      end.month = 'JN'
      break;
    case 6:
      end.month = 'JL'
      break;
    case 7:
      end.month = 'AG'
      break;
    case 8:
      end.month = 'SE'
      break;
    case 9:
      end.month = 'OC'
      break;
    case 10:
      end.month = 'NO'
      break;
    case 11:
      end.month = 'DI'
      break;
    default:
      end.month = 'ZU'
  }
  const current = new Date()
  end.year += current.getFullYear() - 2000  
  end.day += current.getDate().toString()
  end.hour += current.getHours().toString()
  end.sec = current.getSeconds()
  end.dayWeek = current.getDay() + 1
  return end
}

function indenReturner(envios: IEnvio[]): string {
    const date = dateReturner()
    let base = 0
    let formatter = 0
    envios.map((en) => {
        base += en.productos.length
        formatter += en.desgloseId
    })
    const iden = "IE" + date.hour + date.dayWeek.toString() + (formatter + base) + date.month + date.year
    return iden
}

export default function (envios: IEnvio[]): IEnvio[] {
    const ident = indenReturner(envios)
    envios.forEach(envio => {
        envio.identificador = ident
        envio.productos.forEach((p) => {
            if(p.sel) p.des = insumos.insumos[p.sel].cod+p.des
        })
    });
    return envios
}