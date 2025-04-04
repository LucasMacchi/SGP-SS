import { Page, Image, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IPedidoClientPDF } from '../../Utils/Interfaces';

const stylePedido = StyleSheet.create({
    logo: {
        width: 90
    },
    page: {
        padding: 10,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 13,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 8
    },
    view: {
        padding: 2,
    },
    view_title: {
        display: 'flex'
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
        width: '8%',
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
        fontSize: 8,
        textAlign: 'left',
      },
      viewdata: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'flex-start',
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

const ClientDocument: React.FC<IPedidoClientPDF> = ({pedido}) => (
    <Document>
        <Page size={'A4'} style={stylePedido.page}>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Image style={stylePedido.logo} src={'/src/assets/logo_big.png'}/>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata}>
                <View >
                    <Text style={stylePedido.title}>Datos del Informe</Text>
                    <Text style={stylePedido.body}>Cliente: {pedido.pedido_client_id+'-'+pedido.pedido_client}</Text>
                </View>
                <View style={stylePedido.viewdataReq}>
                    <Text style={stylePedido.title}>Fechas de pedidos</Text>
                    <Text style={stylePedido.body}>Incio: {pedido.pedido_start}</Text>
                    <Text style={stylePedido.body}>Final: {pedido.pedido_end}</Text>
                </View>
            </View>

            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod 1</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod 2</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod 3</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Insumo</Text>
                    </View>
                    <View style={stylePedido.tableColCant}>
                        <Text style={stylePedido.tableCell}>Cant</Text>
                    </View>
                </View>
                </View>
                {pedido.pedido_insumos.map((i) => (
                    <View style={stylePedido.tableRow}>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.insumo_id}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.ins_cod1 === 0 ? ' ' : i.ins_cod1}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.ins_cod2 === 0 ? ' ' : i.ins_cod2}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.ins_cod3 === 0 ? ' ' : i.ins_cod3}</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.insumo_des}</Text>
                        </View>
                        <View style={stylePedido.tableColCant}>
                            <Text style={stylePedido.tableCell}>{i.amount}</Text>
                        </View>
                    </View>
                ))}
                
            </View>
        </Page>
    </Document>
)

export default ClientDocument
