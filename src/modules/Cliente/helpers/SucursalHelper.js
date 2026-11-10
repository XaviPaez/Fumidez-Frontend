import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/sucursales");


export const crearSucursalFachada = async (sucursal) => {
  return await api
    .post(API_URL, sucursal)
    .then(r => r.data);
};


export const consultarSucursalesClienteFachada = async (clienteId) => {
  return await api
    .get(`${API_URL}/cliente/${clienteId}`)
    .then(r => r.data);
};


export const consultarSucursalesActivasClienteFachada = async (clienteId) => {
  return await api
    .get(`${API_URL}/cliente/${clienteId}/activas`)
    .then(r => r.data);
};


export const actualizarSucursalFachada = async (id, sucursal) => {
  return await api
    .put(`${API_URL}/${id}`, sucursal)
    .then(r => r.data);
};