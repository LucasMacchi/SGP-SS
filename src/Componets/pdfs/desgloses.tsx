import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { desglosesDataPdf, IDetalleEnvio, IrequestEnvio } from '../../Utils/Interfaces';
import logoBig from "../../assets/logo_big.png"

const stylePedido = StyleSheet.create({
    logo: {
        width: 90
    },
    page: {
        padding: 6,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 10
    },
    view: {
        padding: 2,
        paddingLeft: 5
    },
    view_title: {
        display: 'flex',
        paddingLeft: 40
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
      tableRow: {
        flexDirection: 'row',
      },
      tableRow_header: {
        flexDirection: 'row',
        backgroundColor: '#65b1fc'
      },
      tableColIns: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableColcod: {
        width: '18%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableColCant: {
        width: '7%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderLeftWidth: 0,
        borderTopWidth: 0,
      },
      tableCell: {
        margin: 5,
        fontSize: 10,
        textAlign: 'left',
      },
      viewdata: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'flex-start',
        paddingLeft: 5
      },
      viewdataHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'space-between',
        
      },
      viewdataReq: {
        marginLeft: 20
      }
})


const insumosDisplayer = (insumos: IDetalleEnvio[]) => {
    const elements = []
    const amount = insumos.length > 8 ? insumos.length : 8
    for (let i = 0; i < amount; i++) {
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].des.split("-")[2] : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].kilos.toFixed(2) : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].cajas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].bolsas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].raciones : " "}</Text>
                </View>
            </View>
        )
    
    }
    return elements
}

const pageContruct = (e: IrequestEnvio, copia: boolean) => (
        <Page size={'A4'} style={stylePedido.page}>
            <Image src={logoBig} style={stylePedido.logo}/>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata}>
                <View >
                    <Text style={stylePedido.title}>Desglose de Entrega - {copia ? "Copia" : "Original"}</Text>
                    <Text style={stylePedido.body}>Cabecera: {e.completo}</Text>
                    <Text style={stylePedido.body}>Dependencia: {e.dependencia}</Text>
                    <Text style={stylePedido.body}>Fecha: {new Date().toISOString()}</Text>
                    <Text style={stylePedido.body}>Remito: {e.nro_remito}</Text>
                    <Text style={stylePedido.body}>Localidad: {e.localidad}</Text>
                    <Text style={stylePedido.body}>Direccion: {e.direccion}</Text>
                    <Text style={stylePedido.title}>Datos de Contacto</Text>
                    <Text style={stylePedido.body}>Telefono: 3794-586633</Text>
                    <Text style={stylePedido.body}>Correo: info@solucionesyservicios.com.ar</Text>
                </View>
            </View>
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Insumo</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Kilos</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Caja</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Unidades</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Raciones</Text>
                    </View>
                </View>
                </View>
                {insumosDisplayer(e.detalles)}
            </View>
        </Page>

)


const DesglosePdf: React.FC<desglosesDataPdf> = ({envios}) => (
    <Document>
        {envios.flatMap((e) => [
            pageContruct(e,false),
            pageContruct(e,true)
        ])}

    </Document>
)

export default DesglosePdf
