import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/agenda");


// =====================================================
// LISTAR AGENDA
// =====================================================

export const consultarAgendaFachada = async () => {

  return await api
    .get(API_URL)
    .then(r => r.data);

};


// =====================================================
// BUSCAR POR ID
// =====================================================

export const buscarAgendaPorIdFachada = async (id) => {

  return await api
    .get(`${API_URL}/${id}`)
    .then(r => r.data);

};


// =====================================================
// CREAR
// =====================================================

export const crearAgendaFachada = async (agenda) => {

  return await api
    .post(API_URL, agenda)
    .then(r => r.data);

};


// =====================================================
// ACTUALIZAR
// =====================================================

export const actualizarAgendaFachada = async (
  id,
  agenda
) => {

  return await api
    .put(
      `${API_URL}/${id}`,
      agenda
    )
    .then(r => r.data);

};


// =====================================================
// CANCELAR
// =====================================================

export const cancelarAgendaFachada = async (id) => {

  return await api
    .patch(
      `${API_URL}/${id}/cancelar`
    )
    .then(r => r.data);

};


// =====================================================
// CONSULTAR POR FECHA
// =====================================================

export const consultarAgendaFechaFachada = async (
  fecha
) => {

  return await api
    .get(
      `${API_URL}/fecha/${fecha}`
    )
    .then(r => r.data);

};


// =====================================================
// CONSULTAR RANGO
// =====================================================

export const consultarAgendaRangoFachada = async (
  desde,
  hasta
) => {

  return await api
    .get(
      `${API_URL}/rango`,
      {
        params: {
          desde,
          hasta
        }
      }
    )
    .then(r => r.data);

};
// =====================================================
// VINCULAR AGENDA CON ORDEN DE TRABAJO
// =====================================================

export const vincularOrdenAgendaFachada = async (
  agendaId,
  ordenId
) => {

  const response =
    await api.patch(
      `${API_URL}/${agendaId}/orden/${ordenId}`
    );

  return response.data;
};