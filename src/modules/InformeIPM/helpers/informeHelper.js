import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/informe")

export const crearInformeFachada = async (bodyInforme) => {
    return await crearInforme(bodyInforme)
}

export const consultarInformeFachada = async () => {
    return await consultarInforme()
}

export const crearInformePlagaFachada = async (bodyInforme) => {
    return await crearInformePlaga(bodyInforme)
}


export const consultarInformePorIdFachada = async (id) => {
    return await consultarInformePorId(id)
}

const crearInforme = async (bodyInforme) => {
    return await api.post(API_URL, bodyInforme).then(r => r.data);

}
export const consultarInformePorOrdenFachada = async (idOrden) => {
  try {
    const response = await api.get(
      `/informe/orden/${idOrden}`
    );

    return response.data;
  } catch (error) {

    /*
     * 404 significa que esa OT todavía
     * no tiene un Informe IPM.
     */
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};
export const eliminarInformeFachada = async (id) => {
    return await eliminarInforme(id);
  };

const crearInformePlaga = async (bodyInforme) => {
    try {
        return await api.post(API_URL+'/plagas', bodyInforme).then(r => r.data);
    } catch (error) {
        console.error("Error al crear el informe de plaga:", error);
        throw error;  // Opcional: vuelve a lanzar el error si necesitas manejarlo más arriba
    }
}

  const eliminarInforme = async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error eliminando orden:", error);
      throw error;
    }
  };

const consultarInforme = async () => {
    try {
        const response = await api.get(`${API_URL}/informes`);
        return response.data;
    } catch (error) {
        console.error("Error consultando informes:", error);
        throw error;
    }
}

const consultarInformePorId = async (id) => {
    const data = api.get(API_URL+'/'+id).then(r => r.data);
    return data;
}
