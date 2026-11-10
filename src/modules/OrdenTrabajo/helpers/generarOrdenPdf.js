import jsPDF from 'jspdf';
import CamaraComercio from '/CamaraComercio.png';
import RegistroSanitario from '/RegistroSanitario.png';
import SAQ from '/SAQ.png';
import seal from '/seal.png';
import oms from '/oms.png';


const registrarFuentesPDF = async (doc) => {
  const cargarFuente = async (nombreArchivo, alias, estilo = 'normal') => {
    const response = await fetch(`/${nombreArchivo}`);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64 = btoa(binary);
    doc.addFileToVFS(nombreArchivo, base64);
    doc.addFont(nombreArchivo, alias, estilo);
  };

  await cargarFuente('Montserrat-VariableFont_wght.ttf', 'Montserrat', 'normal');
  await cargarFuente('Montserrat-VariableFont_wght.ttf', 'Montserrat', 'bold');
  await cargarFuente('Poppins-Regular.ttf', 'Poppins', 'normal');
  await cargarFuente('Poppins-Bold.ttf', 'Poppins', 'bold');
};

export const generatePDFOrdenFachada = async (ordenTrabajo) => {
  return await generatePDF(ordenTrabajo);
};

const generatePDF = async (ordenTrabajo) => {
  const doc = new jsPDF('portrait', 'pt', 'a4'); // Orientación vertical
  await registrarFuentesPDF(doc);

  const headerHeight = 65;
  const footerHeight = 65;
  const pageWidth = doc.internal.pageSize.width;
  const PRIMARY_FONT = 'Montserrat';
  const SECONDARY_FONT = 'Poppins';

  // Función para generar un degradado simulado entre dos colores
  const drawGradient = (doc, x, y, width, height, color1, color2, steps) => {
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const r = Math.floor(color1.r * (1 - ratio) + color2.r * ratio);
      const g = Math.floor(color1.g * (1 - ratio) + color2.g * ratio);
      const b = Math.floor(color1.b * (1 - ratio) + color2.b * ratio);

      doc.setFillColor(r, g, b);
      doc.rect(x + (i * (width / steps)), y, width / steps, height, 'F');
    }
  };

  // Colores
  const white = { r: 255, g: 255, b: 255 };
  const blue = { r: 36, g: 91, b: 175 };
  // Anchos de las secciones del degradado
  const sectionWidth = pageWidth / 10; // Ancho de cada sección (10 partes)

  // Crear degradado en el encabezado
  drawGradient(doc, 0, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco
  drawGradient(
    doc,
    sectionWidth * 2,
    0,
    sectionWidth * 2.9,
    headerHeight,
    white,
    blue,
    50
  ); // 29% blanco a azul
  drawGradient(
    doc,
    sectionWidth * 4.9,
    0,
    sectionWidth * 0.2,
    headerHeight,
    blue,
    blue,
    50
  ); // 2% azul
  drawGradient(
    doc,
    sectionWidth * 5.1,
    0,
    sectionWidth * 2.9,
    headerHeight,
    blue,
    white,
    50
  ); // 29% azul a blanco
  drawGradient(
    doc,
    sectionWidth * 8,
    0,
    sectionWidth * 2,
    headerHeight,
    white,
    white,
    50
  );
  // Logo (ajusta la posición y tamaño según sea necesario)
  const logo = '/fumidez_logo.png'; // Reemplaza con la ruta de tu logo
  doc.addImage(logo, 'PNG', 10, 14, 125, 40); // X, Y, Width, Height

  // Texto en el encabezado
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(190, 0, 0);
  doc.text('ORDEN DE TRABAJO', pageWidth - 25, 50, null, null, 'right');

  doc.setDrawColor(32, 76, 130); // Color para la línea divisoria

  // División vertical
  doc.setLineWidth(0.75); // Cambia el valor para ajustar el grosor (2 es más grueso que el valor predeterminado)
  const divisionX = pageWidth / 5;
  doc.line(divisionX, headerHeight, divisionX, doc.internal.pageSize.height - footerHeight);

  // Imágenes en el lado izquierdo (ajustar rutas y posiciones)
  const image1 = CamaraComercio;
  const image2 = RegistroSanitario;
  const image3 = SAQ;
  const image4 = seal;
  const image5 = oms;
  // Añadir imágenes con pie de imagen
  doc.addImage(image1, "PNG", 10, headerHeight + 40, 100, 40);
  doc.setFont(SECONDARY_FONT, "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 38, 140);
  doc.text("REG. MERCANTIL 18392", 10, headerHeight + 90);

  doc.addImage(image2, "PNG", -5, headerHeight + 135, 130, 80);
  doc.setFont(SECONDARY_FONT, "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 38, 140);
  doc.text("ARCSA-2020-12.3-0000320", 12, headerHeight + 215);

  doc.addImage(image3, "PNG", 10, headerHeight + 360, 100, 40);
  doc.setFont(SECONDARY_FONT, "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 38, 140);
  doc.text("MAEE-RA-2020-364760", 20, headerHeight + 410);

  doc.addImage(image4, "PNG", 28, headerHeight + 458, 60, 60);
  doc.addImage(image5, "PNG", 30, headerHeight + 573, 60, 60);

  doc.setFont(SECONDARY_FONT, "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 38, 140);
  doc.text("UTILIZAMOS QUÍMICOS \nAPROBADOS POR \nEPA Y OMS", 20, 350);

  doc.setFontSize(8);
  doc.setFont(SECONDARY_FONT, "normal");
  doc.setTextColor(0, 38, 140);



  // Lado derecho de la división
// CLIENTE:
doc.setFont(SECONDARY_FONT, "bold");
doc.setFontSize(9);
doc.setTextColor(0, 38, 140);
doc.text("CLIENTE:", divisionX + 10, headerHeight + 40);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.cliente.nombre, divisionX + 55, headerHeight + 40);

// RUC / CÉDULA:
doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("RUC / CÉDULA:", divisionX + 10, headerHeight + 60);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.cliente.ruc, divisionX + 80, headerHeight + 60);

// TELÉFONO:
doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("TELÉFONO:", divisionX + 10, headerHeight + 80);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.cliente.telefono, divisionX + 65, headerHeight + 80);

// DIRECCIÓN:
doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("DIRECCIÓN:", divisionX + 10, headerHeight + 100);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.cliente.direccion, divisionX + 65, headerHeight + 100);

// FECHA:
doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("FECHA:", divisionX + 250, headerHeight + 40);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.fecha.split("T")[0], divisionX + 290, headerHeight + 40);

// HORA:
doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("HORA DE TRABAJO:", divisionX + 250, headerHeight + 60);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.hora, divisionX + 345, headerHeight + 60);

// ATTE:
doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("CONFIRMADO POR:", divisionX + 250, headerHeight + 80);

doc.setFont(SECONDARY_FONT, "normal");
doc.setTextColor(0, 0, 0);
doc.text(ordenTrabajo.cliente.personaEncargada, divisionX + 345, headerHeight + 80);
  // Descripción
 
// ==========================================
// DESCRIPCIÓN DEL TRABAJO REALIZADO
// Fuente secundaria: Poppins
// ==========================================

const descriptionYStart = headerHeight + 120;

doc.autoTable({
  startY: descriptionYStart + 20,

  head: [
    ['DESCRIPCIÓN DEL TRABAJO REALIZADO']
  ],

  body: [
    [ordenTrabajo.descripcion || 'Sin descripción']
  ],

  theme: 'grid',

  styles: {
    font: SECONDARY_FONT,
    fontStyle: 'normal',
    fontSize: 10,
    cellPadding: 5,
    textColor: [0, 0, 0],
    overflow: 'linebreak'
  },

  headStyles: {
    font: SECONDARY_FONT,
    fontStyle: 'bold',
    fontSize: 10,
    fillColor: [32, 76, 130],
    textColor: [255, 255, 255],
    halign: 'center',
    valign: 'middle'
  },

  bodyStyles: {
    font: SECONDARY_FONT,
    fontStyle: 'normal',
    fontSize: 10,
    textColor: [0, 0, 0],
    valign: 'middle'
  },

  columnStyles: {
    0: {
      cellWidth: pageWidth - 200
    }
  },

  margin: {
    left: 150,
    right: 50
  }
});


  // Pie de página con degradado (blanco -> azul -> blanco)
  drawGradient(doc, 0, doc.internal.pageSize.height - footerHeight, sectionWidth * 2, footerHeight, white, white, 50); // 20% blanco
  drawGradient(doc, sectionWidth * 2, doc.internal.pageSize.height - footerHeight, sectionWidth * 2.9, footerHeight, white, blue, 50); // 29% blanco a azul
  drawGradient(doc, sectionWidth * 4.9, doc.internal.pageSize.height - footerHeight, sectionWidth * 0.2, footerHeight, blue, blue, 50); // 2% azul
  drawGradient(doc, sectionWidth * 5.1, doc.internal.pageSize.height - footerHeight, sectionWidth * 2.9, footerHeight, blue, white, 50); // 29% azul a blanco
  drawGradient(doc, sectionWidth * 8, doc.internal.pageSize.height - footerHeight, sectionWidth * 2, footerHeight, white, white, 50); // 20% blanco
  const webIcon = '/web.png'; // Ruta al icono del sitio web
  const emailIcon = '/mail.png'; // Ruta al icono de correo
  const locationIcon = '/home.png'; // Ruta al icono de ubicación
  const phoneIcon = '/phone.png'; // Ruta al icono de ubicación
  const whatsappIcon = '/whatsapp.png'; // Ruta al icono de ubicación

  // Añadir textos con iconos
  const footerY = doc.internal.pageSize.height - footerHeight + 20;

  // Sitio web
  doc.addImage(webIcon, 'PNG', 30, footerY - 5, 10, 10); // Ajusta el tamaño y posición
  doc.text('www.fumidez.com', 50, footerY);

  // Correo electrónico
  doc.addImage(emailIcon, 'PNG', 30, footerY + 15 - 5, 10, 10);
  doc.text('fumidezplagas@gmail.com', 50, footerY + 15);

  // Dirección
  doc.addImage(locationIcon, 'PNG', 30, footerY + 30 - 5, 10, 10);
  doc.text('Matriz Quito: Urb. Caminos del Sur. Pasaje 6 Casa Oe 10-23 y Julián Estrella', 50, footerY + 30);

  // Teléfonos
  doc.addImage(phoneIcon, 'PNG', doc.internal.pageSize.width - 80 - 15, footerY - 5, 10, 10);
  doc.text('02 262 0298', doc.internal.pageSize.width - 80, footerY);

  doc.addImage(whatsappIcon, 'PNG', doc.internal.pageSize.width - 80 - 15, footerY + 15 - 5, 10, 10);
  doc.text('099 995 4079', doc.internal.pageSize.width - 80, footerY + 15);
  // =====================================================
// =====================================================
// FIRMA DEL CLIENTE - RECIBÍ CONFORME
// =====================================================

const signatureY =
  doc.internal.pageSize.height - footerHeight - 50;

const reciboX = pageWidth - 220;
let reciboBaseY = signatureY - 150;

// =====================================================
// DEBUG - COMPROBAR QUÉ RECIBE EL PDF
// =====================================================

console.log("======================================");
console.log("DATOS RECIBIDOS POR generarOrdenPdf");
console.log("ID ORDEN:", ordenTrabajo?.id);
console.log("NUMERO ORDEN:", ordenTrabajo?.numeroOrden);
console.log("FIRMA COMPLETA:", ordenTrabajo?.firmaCliente);
console.log(
  "TIPO FIRMA:",
  typeof ordenTrabajo?.firmaCliente
);
console.log(
  "LONGITUD FIRMA:",
  ordenTrabajo?.firmaCliente?.length
);
console.log("======================================");

// =====================================================
// RECIBÍ CONFORME
// =====================================================

doc.setFont(SECONDARY_FONT, "bold");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

doc.text(
  "Recibí Conforme",
  reciboX,
  reciboBaseY
);

// =====================================================
// POSICIÓN DE LA FIRMA
// =====================================================

const firmaX = reciboX + 10;
const firmaY = reciboBaseY + 10;

const firmaWidth = 130;
const firmaHeight = 55;

// =====================================================
// INSERTAR FIRMA
// =====================================================

try {

  let firma = ordenTrabajo?.firmaCliente;

  if (firma) {

    // Eliminar espacios accidentales
    if (typeof firma === "string") {
      firma = firma.trim();
    }

    console.log(
      "Firma encontrada. Primeros caracteres:",
      typeof firma === "string"
        ? firma.substring(0, 80)
        : firma
    );

    // -------------------------------------------------
    // CASO 1:
    // Backend devuelve solamente Base64
    // -------------------------------------------------

    if (
      typeof firma === "string" &&
      !firma.startsWith("data:image/")
    ) {

      firma =
        "data:image/png;base64," +
        firma;
    }

    // -------------------------------------------------
    // CASO 2:
    // Ya viene como data:image/png;base64,...
    // -------------------------------------------------

    if (
      typeof firma === "string" &&
      firma.startsWith("data:image/")
    ) {

      console.log(
        "Formato de firma válido para jsPDF"
      );

      doc.addImage(
        firma,
        "PNG",
        firmaX,
        firmaY,
        firmaWidth,
        firmaHeight
      );

      console.log(
        "FIRMA INSERTADA CORRECTAMENTE EN PDF"
      );

    } else {

      console.error(
        "FORMATO DE FIRMA NO RECONOCIDO:",
        firma
      );
    }

  } else {

    console.error(
      "NO EXISTE firmaCliente EN LA ORDEN."
    );

    console.log(
      "Objeto ordenTrabajo recibido:",
      ordenTrabajo
    );
  }

} catch (error) {

  console.error(
    "ERROR AL INSERTAR FIRMA EN EL PDF:",
    error
  );
}

// =====================================================
// FIRMA DEL RESPONSABLE (ADMINISTRADOR)
// Se dibuja a la izquierda del bloque del cliente.
// =====================================================

const responsableX = reciboX - 190;
const responsableFirmaX = responsableX + 10;

doc.setFont(SECONDARY_FONT, "bold");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

doc.text(
  "Realizado por",
  responsableX,
  reciboBaseY
);

try {

  let firmaAdmin = ordenTrabajo?.firmaAdmin;

  if (firmaAdmin) {

    if (typeof firmaAdmin === "string") {
      firmaAdmin = firmaAdmin.trim();
    }

    if (
      typeof firmaAdmin === "string" &&
      !firmaAdmin.startsWith("data:image/")
    ) {
      firmaAdmin =
        "data:image/png;base64," +
        firmaAdmin;
    }

    if (
      typeof firmaAdmin === "string" &&
      firmaAdmin.startsWith("data:image/")
    ) {
      doc.addImage(
        firmaAdmin,
        "PNG",
        responsableFirmaX,
        firmaY,
        firmaWidth,
        firmaHeight
      );
    }

  }

} catch (error) {

  console.error(
    "ERROR AL INSERTAR LA FIRMA DEL RESPONSABLE EN EL PDF:",
    error
  );
}

doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);

doc.line(
  responsableX,
  firmaY + firmaHeight + 3,
  responsableX + 150,
  firmaY + firmaHeight + 3
);

doc.setFont(SECONDARY_FONT, "normal");
doc.setFontSize(9);

doc.text(
  "FIRMA RESPONSABLE",
  responsableX + 75,
  firmaY + firmaHeight + 15,
  {
    align: "center"
  }
);

// =====================================================
// LÍNEA DE FIRMA
// =====================================================

const firmaLineY =
  firmaY + firmaHeight + 3;

doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);

doc.line(
  reciboX,
  firmaLineY,
  reciboX + 150,
  firmaLineY
);

// =====================================================
// FIRMA Y SELLO
// =====================================================

doc.setFont(
  SECONDARY_FONT,
  "normal"
);

doc.setFontSize(9);
doc.setTextColor(0, 0, 0);

doc.text(
  "FIRMA Y SELLO",
  reciboX + 75,
  firmaLineY + 12,
  {
    align: "center"
  }
);

// =====================================================
// NOMBRE
// =====================================================

const nombreLineY =
  firmaLineY + 50;

doc.line(
  reciboX,
  nombreLineY,
  reciboX + 150,
  nombreLineY
);

doc.setFontSize(9);

doc.text(
  "Nombre:",
  reciboX,
  nombreLineY + 12
);

const nombreCliente =
  ordenTrabajo?.cliente?.nombre || "";

doc.text(
  nombreCliente,
  reciboX + 45,
  nombreLineY + 12
);

// =====================================================
// GUARDAR PDF
// =====================================================

doc.save(
  `orden_${ordenTrabajo.numeroOrden}.pdf`
);
}