import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'
import { InformeFachada } from "./generarInforme";
import { formularioIPMFachada } from './generarInformeIPM';
import { generateFachadaFotosPDF } from './formatoFotos';

//Se debe mandar el informe dtto, no el normal
//extras opcional: { fotos, formularios } datos precargados (portal cliente)
export const generateFormularioCompletoFachada = async (informe, extras) => {
    return await generateFormularioCompleto(informe, extras)
}

const generateFormularioCompleto = async (informe, extras) => {
  const doc = new jsPDF('portrait', 'pt', 'a4'); 
  await InformeFachada(informe, doc, extras?.formularios)
  doc.addPage();
  await generateFachadaFotosPDF(informe.id, doc, extras?.fotos)
  doc.addPage();
  await formularioIPMFachada(informe, doc, extras?.formularios)
  doc.save(`Informe_IPM_Final_${informe.numFactura}.pdf`);
}
