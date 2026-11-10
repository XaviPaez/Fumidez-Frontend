
import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/orden");

// ==========================================
// CREAR ORDEN
// ==========================================

export const crearOrdenFachada = async (clienteOrden) => {
    return await crearOrden(clienteOrden);
};

// ==========================================
// CONSULTAR ÓRDENES
// ==========================================

export const consultarOrdenFachada = async () => {
    return await consultarOrden();
};

export const consultarOrdenSimpleFachada = async () => {
    return await consultarOrdenSimple();
};

// ==========================================
// BUSCAR ORDEN POR ID
// ==========================================

export const buscarOrdenPorId = async (id) => {
    return await buscarPorId(id);
};

// ==========================================
// ACTUALIZAR ORDEN
// ==========================================

export const actualizarOrdenFachada = async (
    id,
    clienteOrden
) => {
    return await actualizarOrden(id, clienteOrden);
};

// ==========================================
// ACTUALIZAR ESTADO
// ==========================================

export const actualizarOrdenEstadoFachada = async (
    id,
    estado
) => {
    return await actualizarOrdenEstado(id, estado);
};

// ==========================================
// GUARDAR FIRMA DEL CLIENTE
// ==========================================

export const guardarFirmaOrdenFachada = async (
    idOrden,
    firmaBase64
) => {

    if (!idOrden) {
        throw new Error(
            "No se puede guardar la firma: falta el ID de la orden."
        );
    }

    if (
        !firmaBase64 ||
        !firmaBase64.startsWith("data:image/png;base64,")
    ) {
        throw new Error(
            "La firma debe ser una imagen PNG válida."
        );
    }

    try {

        const response = await api.put(
            `${API_URL}/${idOrden}/firma`,
            {
                firmaCliente: firmaBase64
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error guardando la firma de la orden:",
            error
        );

        throw error;
    }

};

// Guardar la firma del responsable (admin) cuando la orden está finalizada
export const guardarFirmaAdminOrdenFachada = async (
    idOrden,
    firmaBase64
) => {

    if (!idOrden) {
        throw new Error(
            "No se puede guardar la firma: falta el ID de la orden."
        );
    }

    if (
        !firmaBase64 ||
        !firmaBase64.startsWith("data:image/png;base64,")
    ) {
        throw new Error(
            "La firma debe ser una imagen PNG válida."
        );
    }

    const response = await api.put(
        `${API_URL}/${idOrden}/firma-admin`,
        {
            firmaCliente: firmaBase64
        }
    );

    return response.data;
};

// ==========================================
// ELIMINAR ORDEN
// ==========================================

export const eliminarOrdenFachada = async (id) => {
    return await eliminarOrden(id);
};

// ==========================================
// FUNCIONES INTERNAS
// ==========================================

const eliminarOrden = async (id) => {

    try {

        const response = await api.delete(
            `${API_URL}/${id}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error eliminando orden:",
            error
        );

        throw error;
    }
};

const crearOrden = async (clienteOrden) => {

    const response = await api.post(
        API_URL,
        clienteOrden
    );

    return response.data;
};

const consultarOrden = async () => {

    const response = await api.get(
        `${API_URL}/ordenes`
    );

    return response.data;
};

const consultarOrdenSimple = async () => {

    const response = await api.get(
        API_URL
    );

    return response.data;
};

const actualizarOrden = async (
    id,
    clienteOrden
) => {

    const response = await api.put(
        `${API_URL}/${id}`,
        clienteOrden
    );

    return response.data;
};

const buscarPorId = async (id) => {

    const response = await api.get(
        `${API_URL}/${id}`
    );

    return response.data;
};

const actualizarOrdenEstado = async (
    id,
    estado
) => {

    const response = await api.put(
        `${API_URL}/status/${id}`,
        estado
    );

    return response.data;
};
