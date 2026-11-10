import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/plaga");

// Crear un Plaga
export const crearPlagaFachada = async (bodyPlaga) => {
  return await crearPlaga(bodyPlaga);
};

const crearPlaga = async (bodyPlaga) => {
  try {
    const response = await api.post(API_URL, bodyPlaga);
    return response.data;
  } catch (error) {
    console.error("Error creando Plaga:", error);
    throw error;
  }
};

// Obtener un Plaga por ID
export const obtenerPlagaFachada = async (idPlaga) => {
  return await obtenerPlaga(idPlaga);
};

const obtenerPlaga = async (idPlaga) => {
  try {
    const response = await api.get(`${API_URL}/${idPlaga}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo Plaga:", error);
    throw error;
  }
};

// Obtener todos los Plagas
export const obtenerTodosLosPlagasFachada = async () => {
  return await obtenerTodosLosPlagas();
};

const obtenerTodosLosPlagas = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo todos los Plagas:", error);
    throw error;
  }
};

// Actualizar un Plaga
export const actualizarPlagaFachada = async (
  idPlaga,
  bodyPlagaActualizado
) => {
  return await actualizarPlaga(idPlaga, bodyPlagaActualizado);
};

const actualizarPlaga = async (
  idPlaga,
  bodyPlagaActualizado
) => {
  try {
    const response = await api.put(
      `${API_URL}/${idPlaga}`,
      bodyPlagaActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando Plaga:", error);
    throw error;
  }
};

// Eliminar un Plaga
export const eliminarPlagaFachada = async (idPlaga) => {
  return await eliminarPlaga(idPlaga);
};

const eliminarPlaga = async (idPlaga) => {
  try {
    const response = await api.delete(`${API_URL}/${idPlaga}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando Plaga:", error);
    throw error;
  }
};