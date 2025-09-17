import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { IconformidadDataPdf } from '../../Utils/Interfaces';
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
    titleActa: {
        fontSize: 34,
        fontWeight: 800,
        marginBottom: 40
    },
    subtitleActa: {
        fontSize: 18,
    },
    subtitleActaData: {
        fontSize: 18,
        fontWeight: 800,
        textDecoration: "underline"
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 10
    },
    view: {
        padding: 50,
        paddingBottom: 30,
        textAlign: "justify"
    },
    viewData: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 25,
        textAlign: "justify"
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


Font.registerHyphenationCallback(word => [word]);
const ActaConformidadPDF: React.FC<IconformidadDataPdf> = ({actas}) => (
    <Document>
        {actas.map((acta) => (
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
            <View style={stylePedido.view}>
                <Text style={stylePedido.titleActa}>ACTA DE CONFORMIDAD</Text>  
                <Text style={stylePedido.subtitleActa}>
                    En la ciudad de <Text style={stylePedido.subtitleActaData}>{acta.localidad}</Text> (Localidad),
                    lugar <Text style={stylePedido.subtitleActaData}>{acta.completo} </Text>
                    (Establecimiento) de la Provincia de Corrientes; se deja constancia que se 
                    recibe de conformidad las mercaderías detalladas en Remitos Soluciones y 
                    Servicios N° <Text style={stylePedido.subtitleActaData}>{acta.nro_remito} </Text> 
                    firmando al pie de la misma el/la responsable de recepción dejando 
                    fehacientemente aceptada la conformidad de la correspondiente partida, 
                    sin lugar a reclamos una vez retirado la unidad de reparto. 

                </Text>  
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>Firma:______________</Text>
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>DNI N°:______________</Text>  
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>Aclaracion:______________</Text> 
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>Cargo:______________</Text>
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>Fecha:___/___/_____</Text> 
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>Sello:</Text> 
            </View>
        </Page>
        ))}
    </Document>
)

export default ActaConformidadPDF
