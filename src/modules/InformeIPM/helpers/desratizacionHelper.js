import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/formulario")

export const crearDesratizacionFachada = async (bodyDesratizacion) => {
    return await crearDesratizacion(bodyDesratizacion)
}

export const consultarDesratizacionFachada = async () => {
    return await consultarDesratizacion()
}

export const consultarDesratizacionFachadaPorIdInforme = async (id) => {
    return await consultarDesratizacionPorIdInforme(id)
}

export const actualizarFormularioFachada = async (id, formulario) => {
    return await actualizarFormulario(id, formulario)
}

const crearDesratizacion = async (bodyDesratizacion) => {
    return await api.post(API_URL, bodyDesratizacion).then(r => r.data);

}

const consultarDesratizacion = async () => {
    const data = api.get(API_URL).then(r => r.data);
    return data;
}

const consultarDesratizacionPorIdInforme = async (id) => {
    const data = api.get(API_URL+'/informe/'+id).then(r => r.data);
    return data;
}

const actualizarFormulario = async (id, formulario) => {
    return await api.put(`${API_URL}/${id}`, formulario).then(r => r.data);
}



