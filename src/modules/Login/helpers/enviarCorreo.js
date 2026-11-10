import { api, apiUrl } from "@/config/api";
const API_URL = apiUrl("/usuario/sendNotif");
//Fachada
export const enviarcorreoFachada= async(cuerpoCorreo)=>{
    return await enviarcorreoApi(cuerpoCorreo)
}

//Consumir
const enviarcorreoApi= async (cuerpoCorreo)=>{
 
    return await api.post(API_URL,cuerpoCorreo).then(r => r.data)
   
}