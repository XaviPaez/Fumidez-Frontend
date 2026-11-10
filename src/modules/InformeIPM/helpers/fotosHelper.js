import { api, apiUrl } from "@/config/api";
const API_URL = apiUrl("/almacenamiento")

export const guardarFotosFachada = async (fotos) => {
    return await guardarFotos(fotos)
}

export const consultarFotosIdInformeFachada = async (id) => {
    const fotos = await consultarFotosIdInforme(id);
    return await Promise.all(fotos.map(async (foto) => ({
        ...foto,
        fotoBase64: await obtenerFotoBase64(foto.id)
    })));
}

const guardarFotos = async (fotos) => {
    return await api.post(API_URL+'/save', fotos).then(r => r.data);
}

const consultarFotosIdInforme = async (id) => {
    return api.get(API_URL+'/buscarInforme/'+id).then(r => r.data);
}

const obtenerFotoBase64 = async (id) => {
    const response = await api.get(`${API_URL}/${id}/contenido`, { responseType: 'blob' });
    return blobToBase64(response.data);
}

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const value = String(reader.result || '');
        resolve(value.includes(',') ? value.split(',')[1] : value);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

export const eliminarFotoFachada = async (id) => {
    return await eliminarFoto(id);
};

const eliminarFoto = async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error eliminando foto:", error);
      throw error;
    }
};
