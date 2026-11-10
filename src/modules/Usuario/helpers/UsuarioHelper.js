import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/usuario");

// Crear usuario
export const crearUsuarioFachada = async (usuarioBody) => {
  return await crearUsuario(usuarioBody);
};

// Consultar todos los usuarios
export const consultarUsuarioFachada = async () => {
  return await consultarUsuario();
};

// Obtener usuario por ID
export const obtenerUsuarioFachada = async (idUsuario) => {
  return await obtenerUsuario(idUsuario);
};

// Actualizar usuario
export const actualizarUsuarioFachada = async (
  idUsuario,
  usuarioBody
) => {
  return await actualizarUsuario(
    idUsuario,
    usuarioBody
  );
};

// Eliminar usuario
export const eliminarUsuarioFachada = async (idUsuario) => {
  return await eliminarUsuario(idUsuario);
};


const actualizarUsuario = async (
  idUsuario,
  usuarioBody
) => {
  try {

    const response = await api.put(
      `${API_URL}/${idUsuario}`,
      usuarioBody
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error actualizando Usuario:",
      error
    );

    throw error;
  }
};


const obtenerUsuario = async (idUsuario) => {
  try {

    const response = await api.get(
      `${API_URL}/${idUsuario}`
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error obteniendo Usuario:",
      error
    );

    throw error;
  }
};


const crearUsuario = async (usuarioBody) => {
  try {

    const response = await api.post(
      API_URL,
      usuarioBody
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error creando Usuario:",
      error
    );

    throw error;
  }
};


const consultarUsuario = async () => {
  try {

    const response = await api.get(
      API_URL
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error consultando Usuarios:",
      error
    );

    throw error;
  }
};


const eliminarUsuario = async (idUsuario) => {
  try {

    const response = await api.delete(
      `${API_URL}/${idUsuario}`
    );

    return response.status === 200;

  } catch (error) {

    console.error(
      "Error eliminando Usuario:",
      error
    );

    throw error;
  }
};