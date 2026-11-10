import { api, apiUrl } from "@/config/api";
// src/helpers/notificationHelper.js


const API_URL = apiUrl("/orden/enviar");

export const enviarNotificacionFachada = async (token, title, body, email) => {
    try {
        const response = await api.post(API_URL, {
            token,
            title,
            body,
            email
        });
        return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
        console.error("Error al enviar la notificación:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};
