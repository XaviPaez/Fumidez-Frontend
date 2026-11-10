import {
  api,
  apiUrl
} from "@/config/api";


const API_GASTOS =
  apiUrl("/gastos");


const API_COMPRAS =
  apiUrl("/gastos/compras-productos");


// =========================================================
// RESUMEN MENSUAL
// =========================================================

export const obtenerResumenGastosFachada =
  async (anio, mes) => {

    const response =
      await api.get(
        `${API_GASTOS}/resumen`,
        {
          params: {
            anio,
            mes
          }
        }
      );


    return response.data;
  };


// =========================================================
// GASTOS MANUALES DEL MES
// =========================================================

export const obtenerGastosMesFachada =
  async (anio, mes) => {

    const response =
      await api.get(
        `${API_GASTOS}/mes`,
        {
          params: {
            anio,
            mes
          }
        }
      );


    return response.data;
  };


// =========================================================
// REGISTRAR GASTO
// =========================================================

export const crearGastoFachada =
  async (gasto, comprobante = null) => {

    return await crearGasto(
      gasto,
      comprobante
    );
  };


const crearGasto =
  async (gasto, comprobante) => {

    const formData =
      new FormData();


    formData.append(
      "monto",
      gasto.monto
    );


    formData.append(
      "categoria",
      gasto.categoria
    );


    if (gasto.descripcion) {

      formData.append(
        "descripcion",
        gasto.descripcion
      );
    }


    if (gasto.formaPago) {

      formData.append(
        "formaPago",
        gasto.formaPago
      );
    }


    if (
      gasto.idOrden !== null &&
      gasto.idOrden !== undefined &&
      gasto.idOrden !== ""
    ) {

      formData.append(
        "idOrden",
        gasto.idOrden
      );
    }


    formData.append(
      "operativo",
      String(
        Boolean(
          gasto.operativo
        )
      )
    );


    if (comprobante) {

      formData.append(
        "comprobante",
        comprobante
      );
    }


    const response =
      await api.post(
        API_GASTOS,
        formData
      );


    return response.data;
  };


// =========================================================
// GASTOS DE UNA ORDEN
// =========================================================

export const obtenerGastosOrdenFachada =
  async (idOrden) => {

    const response =
      await api.get(
        `${API_GASTOS}/orden/${idOrden}`
      );


    return response.data;
  };


// =========================================================
// COMPRAS DEL MES
// =========================================================

export const obtenerComprasMesFachada =
  async (anio, mes) => {

    const response =
      await api.get(
        `${API_COMPRAS}/mes`,
        {
          params: {
            anio,
            mes
          }
        }
      );


    return response.data;
  };

export const obtenerComprobanteGastoFachada = async (idGasto) => {

  const response = await api.get(
    `${API_GASTOS}/${idGasto}/comprobante`,
    {
      responseType: "blob"
    }
  );

  return response.data;
};
// =========================================================
// OBTENER GASTO POR ID
// =========================================================

export const obtenerGastoPorIdFachada =
  async (id) => {

    const response =
      await api.get(
        `${API_GASTOS}/${id}`
      );

    return response.data;
  };


// =========================================================
// ACTUALIZAR GASTO
// =========================================================

export const actualizarGastoFachada =
  async (
    id,
    gasto,
    comprobante = null
  ) => {

    const formData =
      new FormData();


    formData.append(
      "monto",
      gasto.monto
    );


    formData.append(
      "categoria",
      gasto.categoria
    );


    if (gasto.descripcion) {

      formData.append(
        "descripcion",
        gasto.descripcion
      );
    }


    if (gasto.formaPago) {

      formData.append(
        "formaPago",
        gasto.formaPago
      );
    }


    if (
      gasto.idOrden !== null &&
      gasto.idOrden !== undefined &&
      gasto.idOrden !== ""
    ) {

      formData.append(
        "idOrden",
        gasto.idOrden
      );
    }


    formData.append(
      "operativo",
      String(
        Boolean(
          gasto.operativo
        )
      )
    );


    // Solamente se envía si el usuario seleccionó
    // un comprobante nuevo.
    if (comprobante) {

      formData.append(
        "comprobante",
        comprobante
      );
    }


    const response =
      await api.put(
        `${API_GASTOS}/${id}`,
        formData
      );


    return response.data;
  };
// =========================================================
// REGISTRAR COMPRA
// =========================================================

export const crearCompraProductoFachada =
  async (
    compra,
    comprobante = null
  ) => {

    const formData =
      new FormData();


    formData.append(
      "idProducto",
      compra.idProducto
    );


    if (
      compra.idProveedor !== null &&
      compra.idProveedor !== undefined &&
      compra.idProveedor !== ""
    ) {

      formData.append(
        "idProveedor",
        compra.idProveedor
      );
      if (
  compra.idOrden !== null &&
  compra.idOrden !== undefined &&
  compra.idOrden !== ""
) {

  formData.append(
    "idOrden",
    compra.idOrden
  );
}
    }


    formData.append(
      "cantidad",
      compra.cantidad
    );


    formData.append(
      "costoUnitario",
      compra.costoUnitario
    );


    if (
      compra.numeroDocumento
    ) {

      formData.append(
        "numeroDocumento",
        compra.numeroDocumento
      );
    }


    if (
      compra.observacion
    ) {

      formData.append(
        "observacion",
        compra.observacion
      );
    }


    if (
      compra.formaPago
    ) {

      formData.append(
        "formaPago",
        compra.formaPago
      );
    }


    if (
      comprobante
    ) {

      formData.append(
        "comprobante",
        comprobante
      );
    }


    const response =
      await api.post(
        API_COMPRAS,
        formData
      );


    return response.data;
  };
  // =========================================================
// OBTENER COMPROBANTE DE COMPRA
// =========================================================

export const obtenerComprobanteCompraFachada =
  async (idCompra) => {

    const response =
      await api.get(
        `${API_COMPRAS}/${idCompra}/comprobante`,
        {
          responseType: "blob"
        }
      );


    return response.data;
  };
  // =========================================================
// ACTUALIZAR COMPRA DE PRODUCTO
// =========================================================

export const actualizarCompraProductoFachada =
  async (
    idCompra,
    compra,
    comprobante = null
  ) => {

    const formData =
      new FormData();


    formData.append(
      "idProducto",
      compra.idProducto
    );


    if (
      compra.idProveedor !== null &&
      compra.idProveedor !== undefined &&
      compra.idProveedor !== ""
    ) {

      formData.append(
        "idProveedor",
        compra.idProveedor
      );
    }


    if (
      compra.idOrden !== null &&
      compra.idOrden !== undefined &&
      compra.idOrden !== ""
    ) {

      formData.append(
        "idOrden",
        compra.idOrden
      );
    }


    formData.append(
      "cantidad",
      compra.cantidad
    );


    formData.append(
      "costoUnitario",
      compra.costoUnitario
    );


    if (compra.numeroDocumento) {

      formData.append(
        "numeroDocumento",
        compra.numeroDocumento
      );
    }


    if (compra.observacion) {

      formData.append(
        "observacion",
        compra.observacion
      );
    }


    if (compra.formaPago) {

      formData.append(
        "formaPago",
        compra.formaPago
      );
    }


    // Si no seleccionamos un archivo nuevo,
    // NO enviamos comprobante.
    // Así backend conserva el anterior.

    if (comprobante) {

      formData.append(
        "comprobante",
        comprobante
      );
    }


    const response =
      await api.put(
        `${API_COMPRAS}/${idCompra}`,
        formData
      );


    return response.data;
  };