import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/cliente")

export const crearClienteFachada = async (clienteBody) => {
    return await crearCliente(clienteBody)
}

export const consultarClienteFachada = async () => {
    return await consultarCliente()
}

export const buscarClientePorIdFachada = async (id) => {
    return await buscarPorId(id);
}
export const obtenerClienteFachada = async (idCliente) => {
    return await obtenerCliente(idCliente);
  };

  export const actualizarClienteFachada = async (id, cliente) => {
    return await actualizarCliente(id, cliente);
  }
 
    
  export const eliminarClienteFachada = async (idCliente) => {
    return await eliminarCliente(idCliente);
  };
  const eliminarCliente = async (idCliente) => {
    try {
      const response = await api.delete(`${API_URL}/${idCliente}`);
      return response.status === 200;
    } catch (error) {
      console.error("Error eliminando Usuario:", error);
      throw error;
    }
  }
  const actualizarCliente = async (id, cliente) => {
    return await api.put(`${API_URL}/${id}`, cliente).then(r => r.data);
  }
  const obtenerCliente = async (idCliente) => {
    try {
      const response = await api.get(`${API_URL}/${idCliente}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo Cliente:", error);
      throw error;
    }
  };
  

const crearCliente = async (clienteBody) => {
    return await api.post(API_URL, clienteBody).then(r => r.data);

}

const consultarCliente = async () => {
    const data = api.get(API_URL).then(r => r.data);
    return data;
}

const buscarPorId = async (id) => {
    return await api.get(`${API_URL}/${id}`).then(r => r.data);
}
