import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/formulario")

export const crearFormularioFachada = async (clienteFormulario) => {
    return await crearFormulario(clienteFormulario)
}

export const consultarFormularioFachada = async () => {
    return await consultarFormulario()
}

const crearFormulario = async (clienteFormulario) => {
    return await api.post(API_URL, clienteFormulario).then(r => r.data);

}

const consultarFormulario = async () => {
    const data = api.get(API_URL).then(r => r.data);
    return data;
}

