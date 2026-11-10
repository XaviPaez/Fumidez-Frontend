import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/factura")

export const crearFacturaFachada = async (facturaBody, archivos) => {
  return await crearFactura(facturaBody, archivos);
};
export const cambiarEstadoFacturaFachada = async (id, estado) => {
    return await cambiarEstadoFactura(id, estado);
};

export const consultarFacturaFachada = async () => {
    return await consultarFactura()
}

export const buscarFacturaPorIdFachada = async (id) => {
    return await buscarPorId(id);
}
export const obtenerFacturaFachada = async (idFactura) => {
    return await obtenerFactura(idFactura);
  };

  export const actualizarFacturaFachada = async (id, factura) => {
    return await actualizarFactura(id, factura);
  }
 
    
  export const eliminarFacturaFachada = async (idFactura) => {
    return await eliminarFactura(idFactura);
  };
  const eliminarFactura = async (idFactura) => {
    try {
      const response = await api.delete(`${API_URL}/${idFactura}`);
      return response.status === 200;
    } catch (error) {
      console.error("Error eliminando Factura:", error);
      throw error;
    }
  }
  const actualizarFactura = async (id, factura) => {
    return await api.put(`${API_URL}/${id}`, factura).then(r => r.data);
  }
  const obtenerFactura = async (idFactura) => {
    try {
      const response = await api.get(`${API_URL}/${idFactura}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo Factura:", error);
      throw error;
    }
  };
  

const crearFactura = async (facturaBody, archivos = []) => {
  const formData = new FormData();

  // 👇 importante: convertir JSON a Blob
  formData.append(
    "factura",
    new Blob([JSON.stringify(facturaBody)], {
      type: "application/json",
    })
  );

  // 👇 archivos (si tienes input file)
  archivos.forEach((file) => {
    formData.append("archivos", file);
  });

  return await api.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(r => r.data);
};

const consultarFactura = async () => {
    const data = api.get(API_URL).then(r => r.data);
    return data;
}

const buscarPorId = async (id) => {
    return await api.get(`${API_URL}/${id}`).then(r => r.data);
}
const cambiarEstadoFactura = async (id, estado) => {
    return await api.patch(
        `${API_URL}/${id}/estado`,
        null,
        {
            params: {
                estado: estado
            }
        }
    ).then(r => r.data);
};

export const obtenerArchivoFacturaFachada = async (archivoId) => {
  const response = await api.get(apiUrl(`/factura/archivo/${archivoId}`), { responseType: "blob" });
  return response.data;
};
