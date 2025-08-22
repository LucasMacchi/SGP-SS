import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IPedidoRacPDF } from '../../Utils/Interfaces';

const stylePedido = StyleSheet.create({
    logo: {
        width: 90
    },
    page: {
        padding: 10,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 12
    },
    view: {
        padding: 2,
        paddingLeft: 40
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
        paddingLeft: 40
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

const dateParser = (fecha: string) => {
    const dateFr = new Date(fecha)
    return dateFr.getDate() + "/" + (dateFr.getMonth()+1) + "/" + dateFr.getFullYear()
}

const PedidoRacPdf: React.FC<IPedidoRacPDF> = ({pedido}) => (
    <Document>
        <Page size={'A4'} style={stylePedido.page}>
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
                    <Text style={stylePedido.title}>Desglose de Entrega</Text>
                    <Text style={stylePedido.body}>Cabecera: {pedido.pedido_service_id+'-'+pedido.pedido_service}</Text>
                    <Text style={stylePedido.body}>Desglose: {pedido.pedido_desglose}</Text>
                    <Text style={stylePedido.body}>Fecha: {dateParser(pedido.pedido_req)}</Text>
                    <Text style={stylePedido.body}>Remito: {pedido.remito_nro}</Text>
                </View>
                <View style={stylePedido.viewdataReq}>
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
                        <Text style={stylePedido.tableCell}>Bolsas</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Raciones</Text>
                    </View>
                </View>
                </View>
                {pedido.pedido_insumos.map((i) => (
                    <View style={stylePedido.tableRow}>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.des}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.kg}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.cajas}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.bolsas}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.rac}</Text>
                        </View>
                    </View>
                ))}
                
            </View>
        </Page>
    </Document>
)

export default PedidoRacPdf
