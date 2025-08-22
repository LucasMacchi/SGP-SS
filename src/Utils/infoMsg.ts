
enum EalertType{
    ADD_SERVICE = 1,
    ADD_SERVICE_FILTER,
    ADD_SAVE_LOAD_ORDER,
    ADD_LEGAJO,
    ADD_SEARCH_INS,
    DETAIL_ACTIONS,
    DETAIL_INSTRUCCIONES_INSUMOS,
    DETAIL_ADD_INSUMO,
    INFO_COLECCION

}

export default function (type: EalertType) {
    switch (type) {
        case EalertType.ADD_SERVICE:
            alert('Elegir un servicio es obligatorio.')
            break;
        case EalertType.ADD_SERVICE_FILTER:
            alert('"Busqueda", "Cliente" y "Departamento" sirven como filtros para reducir la cantidad de servicio finales en "Servicio".')
            break;
        case EalertType.ADD_SAVE_LOAD_ORDER:
            alert('Al apretar en guardar, se guarda el pedido actual para uso posterior. Al apretar cargar, se carga el pedido guardado y se elimina el guardado.')
            break;
        case EalertType.ADD_LEGAJO:
            alert('Podras seleccionar el "Sector" del trabajador y despues "Buscar" mas especificamente para reducir la cantidad de trabajadores. Si se selecciona PROVISORIO, te dejara agregar un trabajador sin legajo.')
            break;
        case EalertType.ADD_SEARCH_INS:
            alert('Puedes usar el campo "Busqueda" para reducir la cantidad de resultados posibles.')
            break;
        case EalertType.DETAIL_ACTIONS:
            alert(`Te dejara elegir acciones secundarias: "Exporta" el pedido a un pdf. "Reportar" el pedido por cualquier informacion adicional. "Provisional", aqui se le asiganara un servicio a un pedido con un servicio provisorio, "Agregar a Coleccion" te dejara agregar el pedido a una coleccion especifica.`)
            break;
        case EalertType.DETAIL_INSTRUCCIONES_INSUMOS:
            alert(`Al hacer click en el insumo, el mismo se eliminar del pedido definitivamente. Al hacer click en el monto del pedido, se puede modificar.`)
            break;
        case EalertType.DETAIL_ADD_INSUMO:
            alert(`Para agregar un pedido, se debe seleccionar el "rubro", despues seleccionar el "insumo" y al final la "cantidad". Esto agregara un insumo al pedido.`)
            break;
        case EalertType.INFO_COLECCION:
            alert(`Selecciona que coleccion quieres ver, puedes hacer click en la coleccion para eliminar los pedidos en la coleccion, puedes eliminar todos los pedidos apretando el boton "eliminar".`)
            break;
        default:
            console.log('No alert')
            break;
    }
    return 0;
}