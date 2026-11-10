import { api, apiUrl } from "@/config/api";

const API_URL = apiUrl("/usuario/login")



export const consultarLoginFachada = async (bodyLogin) => {
    return await consultarLogin(bodyLogin)
}


const consultarLogin = async (bodyLogin) => {
    const response = await api.post(API_URL, {
      email: bodyLogin.email,
      password: bodyLogin.password,
    });
    return response.data;
  };