import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoG from '../../assets/logo_big.png'
import { IEntrega, IInsumo } from '../../Utils/Interfaces';
const stylePedido = StyleSheet.create({
    logo: {
        width: 90,
        paddingLeft: 10

    },
    page: {
        padding: 10,
        fontFamily: 'Helvetica',
    },
    globalView: {
      borderWidth: 1
    },
    headerView: {
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1
    },
    title: {
        fontSize: 13,
    },
    subtitle_header: {
        fontSize: 10,
        fontWeight: 'heavy',
        textAlign: 'center'
    },
    body_header: {
        fontSize: 8,
        paddingRight: 10,
        fontWeight: 'heavy',
        textAlign: 'center'
    },
    viewSec0: {
      borderBottomWidth: 1,
      padding: 5,
      backgroundColor: '#65b1fc'
    },
    viewSec1: {
      flexDirection: "row"
    },
    viewSec2: {
      flexDirection: "row",
    },
    viewSec2_1: {
      borderWidth: 1,
      flexDirection: "row",
      width: '100%'
    },
    viewSec3_name: {
      borderWidth: 1,
      flexDirection: "row",
      width: '70%'
    },
    viewSec4_lugar: {
      borderWidth: 1,
      flexDirection: "row",
      width: '50%'
    },
    viewSec4_dir: {
      borderWidth: 1,
      flexDirection: "row",
      width: '50%'
    },
    viewSec3_dni: {
      borderWidth: 1,
      flexDirection: "row",
      width: '30%'
    },
    viewSec5: {
      borderWidth: 1,
      flexDirection: "row",
      width: '50%',
    },
    subtitle: {
        fontSize: 12
    },
    subtitle_Heavy: {
        fontSize: 12,
        fontWeight: 'heavy',
    },
    body: {
      fontSize: 10
    },
    table: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableColcod: {
      width: '20.6%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 0,
    },
    tableColSmall: {
      width: '4%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 0,
    },
    tableColMed: {
      width: '10%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 0,
    },
    tableTxt: {
      fontSize: 12,
      textAlign: 'center'
    }
})

const tableElementsReturner = (insumos: IInsumo[], entrega: string) => {
  const min = insumos.length > 18 ? insumos.length - 1 : 18
  const elements = []
  
  const formated:IInsumo[] = insumos.map((i) => {
    const des = i.insumo_des.split('-')[4]
    const data:IInsumo = {
      insumo_des: des,
      amount: i.amount
    }
    return data
  })
  console.log(formated)
  for (let i = 0; i < min; i++){
    elements.push(
      <View style={stylePedido.tableRow}>
        <View style={stylePedido.tableColSmall}>
          <Text style={stylePedido.tableTxt}>{i+1}</Text>
        </View>
        <View style={stylePedido.tableColcod}>
          <Text style={stylePedido.tableTxt}>{formated[i] ? formated[i].insumo_des : ''}</Text>
        </View>
        <View style={stylePedido.tableColMed}>
            <Text style={stylePedido.tableTxt}>{''}</Text>
        </View>
        <View style={stylePedido.tableColMed}>
            <Text style={stylePedido.tableTxt}>{''}</Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxt}>{''}</Text>
        </View>
        <View style={stylePedido.tableColMed}>
            <Text style={stylePedido.tableTxt}>{formated[i] ? formated[i].amount : ''}</Text>
        </View>
        <View style={stylePedido.tableColcod}>
          <Text style={stylePedido.tableTxt}>{formated[i] ? entrega : ''}</Text>
        </View>
        <View style={stylePedido.tableColcod}>
            <Text style={stylePedido.tableTxt}>{''}</Text>
        </View>
      </View>
    )
  }
  return elements
}

const EntregaDocument: React.FC<IEntrega> = ({entrega}) => (
    <Document>
        <Page size={'A4'} style={stylePedido.page} orientation='landscape'>
          <View style={stylePedido.globalView}>
            <View style={stylePedido.headerView}>
              <Image style={stylePedido.logo} source={'logoss'} src={logoG}/>
              <View>
                <Text style={stylePedido.subtitle_header}>ENTREGA DE ROPA DE TRABAJO Y ELEMENTOS DE </Text>
                <Text style={stylePedido.subtitle_header}>PROTECCION PERSONAL</Text>
              </View>
              <View>
                <Text style={stylePedido.body_header}>REG-RHS-011</Text>
                <Text style={stylePedido.body_header}>Abril 2022</Text>
                <Text style={stylePedido.body_header}>Version 00</Text>
                <Text style={stylePedido.body_header}>Pagina 1 de 1</Text>
              </View>
            </View>
            <View style={stylePedido.viewSec0}></View>
            <View style={stylePedido.viewSec1}>
              <Text style={stylePedido.subtitle}>Razon Social: </Text>
              <Text style={stylePedido.subtitle_Heavy}>Soluciones y Servicios S.A</Text>
            </View>
            <View style={stylePedido.viewSec2}>
              <View style={stylePedido.viewSec2_1}>
                <Text style={stylePedido.subtitle}>Direccion: </Text>
                <Text style={stylePedido.subtitle_Heavy}>Mendoza 707</Text>
              </View>
              <View style={stylePedido.viewSec2_1}>
                <Text style={stylePedido.subtitle}>Localidad: </Text>
                <Text style={stylePedido.subtitle_Heavy}>Corrientes</Text>
              </View>
              <View style={stylePedido.viewSec2_1}>
                <Text style={stylePedido.subtitle}>C.P: </Text>
                <Text style={stylePedido.subtitle_Heavy}>3400</Text>
              </View>
              <View style={stylePedido.viewSec2_1}>
                <Text style={stylePedido.subtitle}>Provincia: </Text>
                <Text style={stylePedido.subtitle_Heavy}>Corrientes</Text>
              </View>
            </View>
            <View style={stylePedido.viewSec2}>
              <View style={stylePedido.viewSec3_name}>
                <Text style={stylePedido.subtitle}>Apellido y Nombre del Trabajador: </Text>
              </View>
              <View style={stylePedido.viewSec3_dni}>
                <Text style={stylePedido.subtitle}>D.N.I: </Text>
              </View>
            </View>
            <View style={stylePedido.viewSec2}>
              <View style={stylePedido.viewSec4_lugar}>
                <Text style={stylePedido.subtitle}>Lugar de Trabajo: </Text>
              </View>
              <View style={stylePedido.viewSec4_dir}>
                <Text style={stylePedido.subtitle}>Direccion: </Text>
              </View>
            </View>
            <View style={stylePedido.viewSec2}>
              <View style={stylePedido.viewSec5}>
                <Text style={stylePedido.body}>Descripcion breve del puesto/s de trabajo en el/los cuales se desempeña en trabajador: </Text>
                <Text>{'\n\n'}</Text>
              </View>
              <View style={stylePedido.viewSec5}>
                <Text style={stylePedido.body}>Elementos de proteccion personal, necesarios para el trabajador, segun el puesto de trabajo: </Text>
                <Text>{'\n\n'}</Text>
              </View>
            </View>
            <View style={stylePedido.table}>
              <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColSmall}>
                    <Text></Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableTxt}>Producto</Text>
                </View>
                <View style={stylePedido.tableColMed}>
                    <Text style={stylePedido.tableTxt}>Tipo / Modelo</Text>
                </View>
                <View style={stylePedido.tableColMed}>
                    <Text style={stylePedido.tableTxt}>Marca</Text>
                </View>
                <View style={stylePedido.tableColSmall}>
                    <Text style={stylePedido.tableTxt}>Posee Cert. SI/NO</Text>
                </View>
                <View style={stylePedido.tableColMed}>
                    <Text style={stylePedido.tableTxt}>Cantidad</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableTxt}>Fecha de Entrega</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableTxt}>Firma del Trabajador</Text>
                </View>
              </View>
              {tableElementsReturner(entrega.insumos, entrega.fecha_entrega)}
            </View>
            <View style={stylePedido.viewSec1}>
          <Text style={stylePedido.subtitle}>Informacion adicional: {'\n\n\n'}</Text>
            </View>
          </View>
        </Page>
    </Document>
)

export default EntregaDocument
