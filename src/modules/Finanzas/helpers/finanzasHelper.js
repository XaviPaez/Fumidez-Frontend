import { api } from "@/config/api";

// =====================================================
// RESUMEN FINANCIERO DEL PERÍODO
// =====================================================

export const obtenerResumenFinancieroFachada = async (
  anio,
  mes
) => {

  const response = await api.get(
    "/finanzas/resumen",
    {
      params: {
        anio,
        mes
      }
    }
  );

  return response.data;
};