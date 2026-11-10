import jsPDF from 'jspdf';
import logo from '/fumidez_logo.png'
import CamaraComercio from '/CamaraComercio.png';
import RegistroSanitario from '/RegistroSanitario.png';
import SAQ from '/SAQ.png';
import seal from '/seal.png';
import oms from '/oms.png';


import JsPDFAutotable from 'jspdf-autotable'
import { consultarDesratizacionFachadaPorIdInforme } from '../helpers/desratizacionHelper';
import {
    consultarInformePorIdFachada


} from './informeHelper';

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

export const generatePDFInformeFachada = async (informe) => {
    return await generatePDFData(informe)
}

export const InformeFachada = async (informe, doc, formulariosPre) => {
    await generatePDF(informe, doc, formulariosPre)
}

const generatePDFData = async (informe) => {
    const doc = new jsPDF('portrait', 'pt', 'a4');
    await registrarFuentesPDF(doc);
    await generatePDF(informe, doc)
    doc.save(`informe_${informe.numFactura}.pdf`);
}

const generatePDF = async (informe, doc, formulariosPre) => {
    //const doc = new jsPDF("portrait", "pt", "a4"); // Orientación vertical
    await registrarFuentesPDF(doc);

    const headerHeight = 65;
    const footerHeight = 65;
    const pageWidth = doc.internal.pageSize.width;
    const PRIMARY_FONT = 'Montserrat';
    const SECONDARY_FONT = 'Poppins';

    // Función para generar un degradado simulado entre dos colores
    const drawGradient = (
        doc,
        x,
        y,
        width,
        height,
        color1,
        color2,
        steps
    ) => {
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            const r = Math.floor(color1.r * (1 - ratio) + color2.r * ratio);
            const g = Math.floor(color1.g * (1 - ratio) + color2.g * ratio);
            const b = Math.floor(color1.b * (1 - ratio) + color2.b * ratio);

            doc.setFillColor(r, g, b);
            doc.rect(x + i * (width / steps), y, width / steps, height, "F");
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
    ); // 20% blanco
    // Logo (ajusta la posición y tamaño según sea necesario)
    const imageUrl = logo
    doc.addImage(imageUrl, "PNG", 8, 10, 165, 45); // X, Y, Width, Height

    // Texto en el encabezado
    doc.setFont('Poppins', 'normal');
    doc.setFontSize(24);
    doc.setTextColor(190, 0, 0);
    doc.text("INFORME I.P.M", pageWidth - 12, 29, null, null, "right");

    doc.setFontSize(13);
    doc.setTextColor(0, 38, 140);
    doc.text(
        "MANEJO INTEGRADO DE PLAGAS",
        pageWidth - 12,
        47,
        null,
        null,
        "right"
    );

    doc.setDrawColor(32, 76, 130); // Color para la línea divisoria

    // División vertical
    doc.setLineWidth(0.75); // Cambia el valor para ajustar el grosor (2 es más grueso que el valor predeterminado)
    const divisionX = pageWidth / 5;
    doc.line(
        divisionX,
        headerHeight,
        divisionX,
        doc.internal.pageSize.height - footerHeight
    );

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
    // Lado derecho de la división
doc.setFont(SECONDARY_FONT, "bold");
doc.setFontSize(9);
doc.setTextColor(0, 38, 140);

doc.text("CLIENTE:", divisionX + 12, headerHeight + 20);

doc.setTextColor(0, 0, 0);
doc.setFont(SECONDARY_FONT, "normal");

const clienteNombre =
  informe.ordenDto?.cliente?.nombre || "Cliente no disponible";

doc.text(
  clienteNombre,
  divisionX + 55,
  headerHeight + 20
);

doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("FACTURA Nº:", divisionX + 12, headerHeight + 40);

doc.setTextColor(0, 0, 0);
doc.setFont(SECONDARY_FONT, "normal");

doc.text(
  `${informe.numFactura || ""}`,
  divisionX + 75,
  headerHeight + 40
);

doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("AREA TRATADA:", divisionX + 12, headerHeight + 60);

doc.setTextColor(0, 0, 0);
doc.setFont(SECONDARY_FONT, "normal");

doc.text(
  `${informe.ordenDto?.area || ""}`,
  divisionX + 95,
  headerHeight + 60
);

doc.setFont(SECONDARY_FONT, "bold");
doc.setTextColor(0, 38, 140);
doc.text("FECHA:", divisionX + 12, headerHeight + 80);

doc.setTextColor(0, 0, 0);
doc.setFont(SECONDARY_FONT, "normal");

const fechaOrden = informe.ordenDto?.fecha
  ? informe.ordenDto.fecha.split("T")[0]
  : "";

doc.text(
  fechaOrden,
  divisionX + 45,
  headerHeight + 80
);
    // Definir posiciones y dimensiones
    const cuadroX = divisionX + 10; // Margen a la derecha de la línea divisoria
    const cuadroY = headerHeight + 90; // Posición Y ajustada hacia arriba
    const cuadroWidth = (pageWidth - divisionX) * 0.45; // Aproximadamente 45% del ancho restante
    const cuadroHeight = 130; // Altura ligeramente reducida
    const tablaWidth = pageWidth - cuadroX - 250; // Ancho definido para el cuadro

    // --- Agregar Cuadro "Tipo de servicio" ---

    let serviciosY = headerHeight + 30;
    let cabeceraTipoServicio = [
        { title: "TIPO DE SERVICIO", dataKey: "servicio" },
    ];
    let distanciaDerecha = cuadroX + 228;

    // Tabla para la cabecera (se mantiene en su posición)
    doc.autoTable({
        head: [cabeceraTipoServicio.map((col) => col.title)], // Título de la cabecera
        startY: serviciosY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            halign: "center", // Alineación a la izquierda
            fontSize: 10, // Tamaño de la fuente para la cabecera
            lineColor: [0, 38, 140],
            cellWidth: tablaWidth,
            fontStyle: "bold"
        },
        styles: {
            lineColor: [0, 38, 140],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });

    const seleccion = informe.frecuencia;

    let datosTabla = [
        [
            seleccion === "MENSUAL" ? "X" : " ", // Marca si es MENSUAL
            seleccion === "BIMENSUAL" ? "X" : " ", // Marca si es BIMENSUAL
            seleccion === "TRIMESTRAL" ? "X" : " ", // Marca si es TRIMESTRAL
            seleccion === "OCASIONAL" ? "X" : " ", // Marca si es OCASIONAL
            " ", // Última celda vacía
        ],
        ["MENSUAL", "BIMENSUAL", "TRIMESTRAL", "OCASIONAL", "____"], // Segunda fila
    ];

    serviciosY = serviciosY + 20;

    doc.autoTable({
        body: datosTabla,
        startY: serviciosY,
        margin: { left: distanciaDerecha },
        theme: "grid",

        bodyStyles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontStyle: "bold",
            fontSize: 6,
            cellPadding: 3,
            halign: "center",
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 38, 140],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.2 }, // Ancho de la primera columna (título de las áreas)
            1: { cellWidth: tablaWidth * 0.2 }, // Ancho de las columnas de calificación
            2: { cellWidth: tablaWidth * 0.2 },
            3: { cellWidth: tablaWidth * 0.2 },
            4: { cellWidth: tablaWidth * 0.2 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    // --- Agregar Cuadro "PLAGAS" ---
    let cabeceraPlagas = [
        { title: "Plagas", dataKey: "plagas" },
        { title: "Producto", dataKey: "producto" },
        { title: "Cantidad", dataKey: "cantidad" },
        { title: "Tiempo", dataKey: "tiempo" },
    ];

    let filasPlagas = [];
    const tiempoTexto = informe.tiempo || "";

    if (Array.isArray(informe.plagaDtos)) {
        informe.plagaDtos.forEach((plaga) => {
            if (Array.isArray(plaga.cantidadProductoPlaga)) {
                let firstRow = true;

                plaga.cantidadProductoPlaga.forEach((producto) => {
                    filasPlagas.push([
                        firstRow ? plaga.tipoPlaga : "",
                        producto.productoDto?.nombre || "Producto no disponible",
                        producto.cantidadProducto,
                        "", // Se deja vacío para dibujar el tiempo una sola vez
                    ]);

                    firstRow = false;
                });
            }
        });
    }

    // Completar hasta 5 filas
    while (filasPlagas.length < 5) {
        filasPlagas.push([
            "", // Plaga
            "", // Producto
            "", // Cantidad
            "", // Tiempo
        ]);
    }

    serviciosY = serviciosY + 40;

    doc.autoTable({
        head: [cabeceraPlagas.map((col) => col.title)],
        body: filasPlagas,
        startY: serviciosY,
        margin: { left: distanciaDerecha },
        theme: "grid",

        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            halign: "center",
            fontSize: 8,
            lineColor: [0, 38, 140],
            cellWidth: tablaWidth * 0.25,
        },

        bodyStyles: {
            textColor: [0, 0, 0],
            font: SECONDARY_FONT,
            fontSize: 6,
            cellPadding: 3,
            halign: "center",
        },

        styles: {
            cellWidth: "wrap",
            overflow: "linebreak",
            lineColor: [0, 38, 140],
            lineWidth: 0.5,
        },

        columnStyles: {
            0: { cellWidth: tablaWidth * 0.25 },
            1: { cellWidth: tablaWidth * 0.25 },
            2: { cellWidth: tablaWidth * 0.25 },
            3: { cellWidth: tablaWidth * 0.25 },
        },

        tableWidth: "wrap",

        didDrawPage: function (data) {
            const bodyRows = data.table.body;

            if (bodyRows.length < 5) return;

            const firstCell = bodyRows[0].cells[3];
            const lastCell = bodyRows[4].cells[3];

            const cell = bodyRows[1].cells[3];
            const centerX = cell.x + (cell.width / 2);

            const centerY =
                cell.y +
                ((cell.y + cell.height) - cell.y) / 2;

            doc.setFont(SECONDARY_FONT);
            doc.setFontSize(6);

            doc.text(
                tiempoTexto,
                centerX,
                centerY,
                {
                    align: "center",
                    baseline: "middle",
                }
            );
        },
    });

let formularioY = cuadroY + 90 + 112 + 15;    let cabeceraFormulario = [
        {
            title: "IDENTIFICACIÓN Y RELACIÓN DEL CONTROL DE ROEDORES",
            dataKey: "servicio",
        },
    ];

    doc.autoTable({
        head: [cabeceraFormulario.map((col) => col.title)], // Título de la cabecera
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            halign: "center", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
            lineColor: [0, 38, 140],
            fontStyle: "bold",
            cellWidth: tablaWidth,
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 38, 140],
            lineWidth: 0.5, // Ancho de las líneas
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    let formulariosIPM = formulariosPre || await consultarDesratizacionFachadaPorIdInforme(informe.id);
    const datosFormulario = {
        ubicacion: "Ver Formulario IPM",
        conSi: 0,
        conNo: 0,
        totalCeb: 0,
        rodentP: "",
        rodentC: "",
    };
    const datosFormularioCordon = {
        ubicacion: "Formulario Cordon",
        conSi: 0,
        conNo: 0,
        totalCeb: 0,
        rodentP: "",
        rodentC: "",
    };

    // Máximo 8 filas, incluyendo las que tienen información.
// Si existen más de 8 registros, se conservan todos.

    if (Array.isArray(formulariosIPM)) {
        formulariosIPM.forEach((formulario) => {
            if (formulario.tipoIdentificadorCordon) {
                if (formulario.consumo == "SI") {
                    datosFormulario.conSi += 1;
                } else {
                    datosFormulario.conNo += 1;
                }
                if (formulario.reemplazoPegaCebo == true) {
                    datosFormulario.rodentP = "X";
                } else {
                    datosFormulario.rodentC = "X";
                }
                datosFormulario.totalCeb += 1;
            } else {
                if (formulario.consumo == "SI") {
                    datosFormularioCordon.conSi += 1;
                } else {
                    datosFormularioCordon.conNo += 1;
                }
                if (formulario.reemplazoPegaCebo == true) {
                    datosFormularioCordon.rodentP = "X";
                } else {
                    datosFormularioCordon.rodentC = "X";
                }
                datosFormularioCordon.totalCeb += 1;
            }
        });
    }
// Construir la tabla DESPUÉS de calcular los datos.
const puntosFormulario = Array.isArray(formulariosIPM) ? formulariosIPM : [];
const filasFormulario = puntosFormulario.length <= 8
    ? puntosFormulario.map((formulario) => {
        const consumo = String(formulario.consumo || "").trim().toUpperCase();
        return [
            formulario.ubicacion || "",
            consumo === "SI" ? "X" : "",
            consumo === "NO" ? "X" : "",
            1,
            formulario.reemplazoPegaCebo === true ? "X" : "",
            formulario.reemplazoPegaCebo === false ? "X" : ""
        ];
    })
    : [
        [
            datosFormulario.ubicacion,
            datosFormulario.conSi,
            datosFormulario.conNo,
            datosFormulario.totalCeb,
            datosFormulario.rodentP,
            datosFormulario.rodentC
        ]
    ];

// Mantener las 8 filas actuales.
const MAX_FILAS_FORMULARIO = 8;

while (filasFormulario.length < MAX_FILAS_FORMULARIO) {
    filasFormulario.push(["", "", "", "", "", ""]);
}
    formularioY = formularioY + 25;

    doc.autoTable({
        head: [
            [
                { content: "UBICACIÓN", rowSpan: 2 },
                { content: "CONSUMO", colSpan: 2 },
                { content: "TOTAL CEB.", rowSpan: 2 },
                { content: "RODENTICIDA", colSpan: 2 },
            ],
            [
                "SI",
                "NO",
                "PEGA",
                "CB",
            ],
        ],
        body: filasFormulario,
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            fontStyle: "bold",
            halign: "center", // Alineación a la izquierda
            fontSize: 7, // Tamaño de la fuente para la cabecera
            lineColor: [0, 38, 140],
        },
        bodyStyles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 38, 140],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.3 },
            1: { cellWidth: tablaWidth * 0.14 },
            2: { cellWidth: tablaWidth * 0.14 },
            3: { cellWidth: tablaWidth * 0.14 },
            4: { cellWidth: tablaWidth * 0.14 },
            5: { cellWidth: tablaWidth * 0.14 },
            6: { cellWidth: tablaWidth * 0.14 },
            7: { cellWidth: tablaWidth * 0.14 },
            8: { cellWidth: tablaWidth * 0.14 },
            9: { cellWidth: tablaWidth * 0.14 },
            10: { cellWidth: tablaWidth * 0.14 },
            11: { cellWidth: tablaWidth * 0.14 },
            12: { cellWidth: tablaWidth * 0.14 },
            13: { cellWidth: tablaWidth * 0.14 },
            14: { cellWidth: tablaWidth * 0.14 },
            15: { cellWidth: tablaWidth * 0.14 },
            16: { cellWidth: tablaWidth * 0.14 },
            17: { cellWidth: tablaWidth * 0.14 },
            18: { cellWidth: tablaWidth * 0.14 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
        didParseCell: ({ cell, column, row, section }) => {
            const isLastTwoRows = row.index >= filasFormulario.length - 2;
            if (
                section === "head" &&
                cell.raw === "SI"
            ) {
                cell.styles.textColor = [255, 0, 0];
                cell.styles.fontStyle = "bold";
            }
            if (
                section === "head" &&
                cell.raw === "TOTAL CEB."
            ) {
                cell.styles.textColor = [0, 38, 140];
                cell.styles.fontStyle = "bold";
                cell.styles.fontSize = 6;
            }
            if (isLastTwoRows) {
                if (column.index === 0) {
                    cell.styles.textColor = [0, 38, 140];
                    cell.styles.fontStyle = 'bold';
                } else {
                    cell.styles.textColor = [0, 0, 0];
                }
            }
        },
    });


    // Fila 5
    filasFormulario.push([
        "TOTAL",
        datosFormularioCordon.conSi,
        datosFormularioCordon.conNo,
        datosFormularioCordon.totalCeb,
        datosFormularioCordon.rodentP,
        datosFormularioCordon.rodentC,
    ]);

    // Fila 6
    filasFormulario.push([
        "GRAN TOTAL:",
        datosFormularioCordon.conSi + datosFormulario.conSi,
        datosFormularioCordon.conNo + datosFormulario.conNo,
        datosFormularioCordon.totalCeb + datosFormulario.totalCeb,
        "",
        "",
    ]);
    formularioY = doc.lastAutoTable.finalY;
const cant_si =
    datosFormularioCordon.conSi + datosFormulario.conSi;

const cant_total =
    datosFormularioCordon.totalCeb + datosFormulario.totalCeb;

const porcentaje = cant_total > 0
    ? (cant_si * 100) / cant_total
    : 0;

// Máximo dos decimales, sin ceros innecesarios.
const porcentajeTexto =
    `${parseFloat(porcentaje.toFixed(2))} %`;

    doc.autoTable({
        head: [
            [
                "INDICADOR DEL RIESGO",
                "BAJO 0 al 14%",
                "MEDIO 15 al 30%",
                "ALTO sup al 30%",
            ],
        ],
        body: [
    [
        "TOTAL SI X 100 \n___________\n TOTAL CEB.",
        porcentaje <= 14 ? porcentajeTexto : "",
        porcentaje > 14 && porcentaje <= 30 ? porcentajeTexto : "",
        porcentaje > 30 ? porcentajeTexto : ""
    ]
],
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            halign: "center", // Alineación a la izquierda
            fontSize: 5, // Tamaño de la fuente para la cabecera
            lineColor: [0, 38, 140],
        },
        bodyStyles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 38, 140],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.52 },
            1: { cellWidth: tablaWidth * 0.16 },
            2: { cellWidth: tablaWidth * 0.16 },
            3: { cellWidth: tablaWidth * 0.16 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    // Nomenclatura de la tabla de control de roedores.
    doc.autoTable({
        head: [
            [
                {
                    content: "NOMENCLATURA",
                    colSpan: 3,
                },
            ],
        ],
        body: [
            [
                "E.C. = ESTACIÓN DE CEBADO",
                "TOTAL CEB. = TOTAL DE ESTACIONES DE CEBADO",
                "CB = CEBO",
            ],
        ],
        startY: doc.lastAutoTable.finalY,
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            halign: "left",
            fontSize: 6,
            lineColor: [0, 38, 140],
            fontStyle: "bold",
        },
        bodyStyles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontSize: 6,
            cellPadding: 3,
            halign: "left",
            lineColor: [0, 38, 140],
        },
        styles: {
            cellWidth: "wrap",
            overflow: "linebreak",
            lineColor: [0, 38, 140],
            lineWidth: 0.5,
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.34 },
            1: { cellWidth: tablaWidth * 0.44 },
            2: { cellWidth: tablaWidth * 0.22 },
        },
        tableWidth: "wrap",
    });


    // --- Agregar Cuadro "SANITIZACION CONFIDENCIAL" ---

    doc.autoTable({
        head: [["SANITIZACION CONFIDENCIAL"]], // Título principal
        body: [["1. EXCELENTE  2. BUENO  3. REGULAR  4. CRÍTICO"]],
        startY: cuadroY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255], // Color de la cabecera
            textColor: [0, 38, 140],
            halign: "center",
            fontSize: 10, // Tamaño de la fuente para la cabecera
            lineColor: [0, 38, 140],
            fontStyle: "bold",
        },
        bodyStyles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center",
            fontStyle: "bold", // Alineación horizontal del contenido
            lineColor: [0, 38, 140],
        },
        styles: {
            font: SECONDARY_FONT,
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 38, 140],
            fontStyle: "bold",
            lineWidth: 0.5,
        },
        columnStyles: {
            0: { cellWidth: tablaWidth }, // Ancho de la primera columna (título de las áreas)
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    datosTabla = [
        ["AREAS INTERNAS", informe.sanitizacionConfidencialDto.areaInterna == 1 ? "X" : "1",
            informe.sanitizacionConfidencialDto.areaInterna == 2 ? "X" : "2",
            informe.sanitizacionConfidencialDto.areaInterna == 3 ? "X" : "3",
            informe.sanitizacionConfidencialDto.areaInterna == 4 ? "X" : "4"], // Primera fila
        ["AREAS EXTERNAS", informe.sanitizacionConfidencialDto.areaExterna == 1 ? "X" : "1",
            informe.sanitizacionConfidencialDto.areaExterna == 2 ? "X" : "2",
            informe.sanitizacionConfidencialDto.areaExterna == 3 ? "X" : "3",
            informe.sanitizacionConfidencialDto.areaExterna == 4 ? "X" : "4"], // Segunda fila
        [
            informe.sanitizacionConfidencialDto.areaNombreOpc1
                ? informe.sanitizacionConfidencialDto.areaNombreOpc1
                : "AREA",
            informe.sanitizacionConfidencialDto.areaOpc1 == 1 ? "X" : "1",
            informe.sanitizacionConfidencialDto.areaOpc1 == 2 ? "X" : "2",
            informe.sanitizacionConfidencialDto.areaOpc1 == 3 ? "X" : "3",
            informe.sanitizacionConfidencialDto.areaOpc1 == 4 ? "X" : "4"], // Tercera fila
        [
            informe.sanitizacionConfidencialDto.areaNombreOpc2
                ? informe.sanitizacionConfidencialDto.areaNombreOpc2
                : "AREA", informe.sanitizacionConfidencialDto.areaOpc2 == 1 ? "X" : "1",
            informe.sanitizacionConfidencialDto.areaOpc2 == 2 ? "X" : "2",
            informe.sanitizacionConfidencialDto.areaOpc2 == 3 ? "X" : "3",
            informe.sanitizacionConfidencialDto.areaOpc2 == 4 ? "X" : "4"], // Cuarta fila
    ];

    doc.autoTable({
        body: datosTabla,
        startY: cuadroY + 32, // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: "grid",
        didParseCell: ({ cell }) => {
            const text = Array.isArray(cell.text) ? cell.text.join("") : cell.text;
            if (text === "X") {
                cell.styles.textColor = [0, 0, 0];
            }
        },
        bodyStyles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontStyle: "bold",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
            lineColor: [0, 38, 140],

        },
        styles: {
            font: SECONDARY_FONT,
            fontStyle: "bold",
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 38, 140],
            lineWidth: 0.5
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.6, halign: "left" }, // Ancho de la primera columna (título de las áreas)
            1: { cellWidth: tablaWidth * 0.1 }, // Ancho de las columnas de calificación
            2: { cellWidth: tablaWidth * 0.1 },
            3: { cellWidth: tablaWidth * 0.1 },
            4: { cellWidth: tablaWidth * 0.1 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });
    // --- Agregar Cuadro "Observaciones" ---

    // Definir posiciones y dimensiones para el nuevo cuadro
    const observacionesY = cuadroY + 90; // Posición Y donde empieza el cuadro
    const observacionesHeight = 112; // Altura fija para el cuadro de observaciones
    const observacionesWidth = pageWidth - cuadroX - 20;
    doc.setDrawColor(0, 38, 140); // Color de la línea (RGB)
    doc.setLineWidth(0.5);
    // Dibuja el cuadro principal
doc.rect(cuadroX, observacionesY, observacionesWidth, observacionesHeight);
    // Añade el texto dentro del cuadro con menos líneas y alineación exacta
    const textoObservacion = informe.observacion || "";
    const lineHeight = 12;
    const topOffset = 18;
    const contentTopY = observacionesY + topOffset;
    const contentLeftX = cuadroX + 3;
    const textLineOffset = 9.0;

    doc.setFont(SECONDARY_FONT, "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 38, 140);
    doc.text("OBSERVACIONES", cuadroX + observacionesWidth / 2, observacionesY + 11, {
        align: "center",
    });

    doc.setFont(SECONDARY_FONT, "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);

    const linesCount = Math.floor((observacionesHeight - topOffset - 10) / lineHeight);
    for (let i = 0; i < linesCount; i++) {
        const y = contentTopY + i * lineHeight;
doc.line(cuadroX, y, cuadroX + observacionesWidth, y);    }

const textoDividido = doc.splitTextToSize(textoObservacion, observacionesWidth - 6);    textoDividido.forEach((linea, index) => {
        const y = contentTopY + index * lineHeight;
        if (y <= observacionesY + observacionesHeight - 8) {
            doc.text(linea, contentLeftX, y + textLineOffset);
        }
    });


    // --- Agregar Cuadro "Procedimientos" ---

    // Definir posiciones y dimensiones para el cuadro "Procedimientos"
    let procedimientosY = observacionesY + observacionesHeight + 10; // 10 puntos de margen debajo del cuadro de observaciones
    const procedimientosHeight = 180; // Altura ajustada para acomodar las categorías y procedimientos

    // Añade la tabla dentro del cuadro
    let cabeceraProcedimiento = [
        { title: "PROCEDIMIENTOS:", dataKey: "procedimiento" },
    ];
    const textProcedimiento = [{ procedimiento: informe.procedimientos }];
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera

        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            fontStyle: "bold",
            halign: "left",
            cellWidth: tablaWidth,
            fontSize: 10, // Tamaño de la fuente para la cabecera
        },
        styles: {
            fontSize: 5, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            textColor: [0, 38, 140],
            fontStyle: "bold",
            overflow: "linebreak", // Permitir saltos de línea en las celdas
        },

        tableWidth: "wrap", // Ajusta la tabla al contenido
    });
    procedimientosY = procedimientosY + 17;
    cabeceraProcedimiento = [
        { title: "DESINSECTACION / FUMIGACION", dataKey: "procedimiento" },
    ];
    // Tabla para la cabecera (se mantiene en su posición)
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            fontStyle: "bold",
            halign: "left", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
        },
        styles: {
            lineColor: [0, 0, 0, 0], // Bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: tablaWidth }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });
    procedimientosY = doc.lastAutoTable.finalY; // Ajustamos la posición Y después de la cabecera



    const datosProcedimientos = {
        nebulizador: "",
        aspersor: "",
        uvl: "",
        mecanico: "",
        lamparas: "",
        biomonitores: "",
        estaciones: "",
        cordon: "",
        nUvl: "",
        nMEc: "",
        sanitizacion: "",
    };

    if (Array.isArray(informe.procedimientoDtos)) {
        informe.procedimientoDtos.forEach((informe) => {
            if (informe.tipoProcedimiento == 0) {
                datosProcedimientos.nebulizador = "X";
            }
            if (informe.tipoProcedimiento == 1) {
                datosProcedimientos.aspersor = "X";
            }
            if (informe.tipoProcedimiento == 2) {
                datosProcedimientos.uvl = "X";
            }
            if (informe.tipoProcedimiento == 3) {
                datosProcedimientos.mecanico = "X ";
            }
            if (informe.tipoProcedimiento == 4) {
                datosProcedimientos.lamparas = "X";
            }
            if (informe.tipoProcedimiento == 5) {
                datosProcedimientos.biomonitores = "X";
            }
            if (informe.tipoProcedimiento == 6) {
                datosProcedimientos.estaciones = "X";
            }
            if (informe.tipoProcedimiento == 7) {
                datosProcedimientos.cordon = "X";
            }
            if (informe.tipoProcedimiento == 8) {
                datosProcedimientos.nUvl = "X";
            }
            if (informe.tipoProcedimiento == 9) {
                datosProcedimientos.nMEc = "X";
            }
            if (informe.tipoProcedimiento == 10) {
                datosProcedimientos.sanitizacion = "X";
            }
        });
    }
    // Tabla para el contenido (cuerpo)
    doc.autoTable({
        body: [
            [datosProcedimientos.nebulizador, "NEBULIZADOR TÉRMICO"], // Primera fila
            [datosProcedimientos.aspersor, "ASPERSOR MANUAL"], // Segunda fila
            [datosProcedimientos.uvl, "NEBULIZADOR UVL ELÉCTRICO DIINA FOG"], // Tercera fila
            [datosProcedimientos.mecanico, "NEBULIZADOR MECÁNICO"], // Cuarta fila
            [datosProcedimientos.lamparas, "LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS",], // Quinta fila
        ],
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 }, // Mueve el cuerpo 20 unidades más a la derecha
        theme: "grid",
        styles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontStyle: "bold",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 0, 0, 0], // Hace los bordes transparentes
        },
        columnStyles: {
            0: {
                cellWidth: 15,
                textColor: [0, 0, 0]
            }, // Ancho para la primera columna
            1: { cellWidth: tablaWidth - 45 }, // Ancho ajustado para la segunda columna
        },
        tableWidth: "wrap",
    });

    procedimientosY = procedimientosY + 80;
    cabeceraProcedimiento = [
        { title: "DESRATIZACIÓN", dataKey: "procedimiento" },
    ];
    // Tabla para la cabecera (se mantiene en su posición original)
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            fontStyle: "bold",
            halign: "left", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
        },
        styles: {
            lineColor: [0, 0, 0, 0], // Bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: tablaWidth - 30 }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });

    // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
    procedimientosY = doc.lastAutoTable.finalY; // Ajustamos la posición Y después de la cabecera

    // Tabla para el contenido (cuerpo)
    doc.autoTable({
        body: [
            [datosProcedimientos.biomonitores, "BIOMONITORES PEGABLES"], // Sexta fila
            [datosProcedimientos.estaciones, "ESTACIONES DE CEBADO"], // Séptima fila
            [datosProcedimientos.cordon, "CORDÓN SANITARIO PERIMETRAL"], // Octava fila
        ],
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 }, // Mueve el cuerpo 20 unidades más a la derecha
        theme: "grid",
        styles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontStyle: "bold",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 0, 0, 0], // Hace los bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: 15, textColor: [0, 0, 0] }, // Ancho para la primera columna
            1: { cellWidth: tablaWidth - 45 }, // Mantiene el ancho del cuerpo
        },
        tableWidth: "wrap",
    });

    procedimientosY = procedimientosY + 45;
    cabeceraProcedimiento = [
        { title: "DESINFECCIÓN", dataKey: "procedimiento" },
    ];
    // Tabla para la cabecera (se mantiene en su posición original)
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: SECONDARY_FONT,
            fillColor: [255, 255, 255],
            textColor: [0, 38, 140],
            fontStyle: "bold",
            halign: "left", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
        },
        styles: {
            lineColor: [0, 0, 0, 0], // Bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: tablaWidth - 30 }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });

    // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
    procedimientosY = doc.lastAutoTable.finalY; // Ajustamos la posición Y después de la cabecera

    // Tabla para el contenido (cuerpo)
    doc.autoTable({
        body: [
            [datosProcedimientos.nUvl, "NEBULIZADOR UVL ELECTRICO"], // Novena fila
            [datosProcedimientos.nMEc, "NEBULIZADOR MECÁNICO"], // Décima fila
            [datosProcedimientos.sanitizacion, "SANITIZACIÓN"], // Undécima fila
        ],
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 }, // Mueve el cuerpo 20 unidades más a la derecha
        theme: "grid",
        styles: {
            textColor: [0, 38, 140],
            font: SECONDARY_FONT,
            fontStyle: "bold",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 0, 0, 0], // Hace los bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: 15, textColor: [0, 0, 0] }, // Ancho para la primera columna
            1: { cellWidth: tablaWidth - 45 }, // Mantiene el ancho del cuerpo
        },
        tableWidth: "wrap",
    });

    // --- Agregar Cuadro "Recomendaciones" ---

    // Definir posiciones y dimensiones para el nuevo cuadro "Recomendaciones"
    const recomendacionesY = procedimientosY + 50; // 10 puntos de margen debajo del cuadro de procedimientos
    const recomendacionesHeight = 80; // Altura del nuevo cuadro
    const recomendacionesWidth = pageWidth - cuadroX - 20; // Extiende el cuadro hacia el borde derecho

    // Dibujar el cuadro principal
    doc.setDrawColor(0, 38, 140);
    doc.setLineWidth(0.5);
    doc.rect(cuadroX, recomendacionesY, recomendacionesWidth, recomendacionesHeight);

    // Título del cuadro
    doc.setFont(SECONDARY_FONT, "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 38, 140);
    doc.text("RECOMENDACIONES", cuadroX + 5, recomendacionesY + 14);

    // Dibujar líneas tipo cuaderno dentro del cuadro
    const recomendacionesTopOffset = 20;
    const recomendacionLineHeight = 12;
    const recomendacionesTextLeft = cuadroX + 5;
    const recomendacionesTextTop = recomendacionesY + recomendacionesTopOffset;
    const recomendacionesLinesCount = Math.floor((recomendacionesHeight - recomendacionesTopOffset - 8) / recomendacionLineHeight);
    doc.setDrawColor(220, 220, 220);
    for (let i = 0; i < recomendacionesLinesCount; i++) {
        const y = recomendacionesTextTop + i * recomendacionLineHeight;
        doc.line(cuadroX + 5, y, cuadroX + recomendacionesWidth - 5, y);
    }

    // Escribir el contenido sobre las líneas
    const textoRecomendaciones = informe.recomendaciones || "";
    doc.setFont(SECONDARY_FONT, "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    const textoRecomendacionesDividido = doc.splitTextToSize(textoRecomendaciones, recomendacionesWidth - 10);
    textoRecomendacionesDividido.forEach((linea, index) => {
        const y = recomendacionesTextTop + index * recomendacionLineHeight;
        if (y <= recomendacionesY + recomendacionesHeight - 8) {
            doc.text(linea, recomendacionesTextLeft, y + 8);
        }
    });

    // --- Agregar Sección "Firma Supervisor" ---

    // Definir posiciones y dimensiones para la firma
    const firmaY = recomendacionesY + recomendacionesHeight + 60; // 20 puntos de margen debajo del cuadro de recomendaciones
    const firmaLineWidth = 170; // Ancho de la línea de firma
    const firmaLineX = ((pageWidth - firmaLineWidth) / 2) + 50; // Centrar la línea horizontalmente
    const firmaLineY = firmaY; // Posición Y de la línea

    // Dibujar la línea para la firma
    doc.setLineWidth(1);
    doc.line(
        firmaLineX,
        firmaLineY,
        firmaLineX + firmaLineWidth,
        firmaLineY
    ); // Línea horizontal

    // Agregar el texto "Firma Supervisor" debajo de la línea
    doc.setFont(SECONDARY_FONT, "bold");
    doc.setTextColor(0, 38, 140);
    doc.setFontSize(9);
    doc.text("Firma Supervisor", (pageWidth / 2) + 50, firmaLineY + 15, {
        align: "center",
    });

    // --- Pie de página con degradado (blanco -> azul -> blanco) ---
    drawGradient(
        doc,
        0,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
    ); // 20% blanco
    drawGradient(
        doc,
        sectionWidth * 2,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        white,
        blue,
        50
    ); // 29% blanco a azul
    drawGradient(
        doc,
        sectionWidth * 4.9,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 0.2,
        footerHeight,
        blue,
        blue,
        50
    ); // 2% azul
    drawGradient(
        doc,
        sectionWidth * 5.1,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        blue,
        white,
        50
    ); // 29% azul a blanco
    drawGradient(
        doc,
        sectionWidth * 8,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
    ); // 20% blanco
    const webIcon = "/web.png"; // Ruta al icono del sitio web
    const emailIcon = "/mail.png"; // Ruta al icono de correo
    const locationIcon = "/home.png"; // Ruta al icono de ubicación
    const phoneIcon = "/phone.png"; // Ruta al icono de teléfono
    const whatsappIcon = "/whatsapp.png"; // Ruta al icono de WhatsApp

    // Añadir textos con iconos
    const footerY = doc.internal.pageSize.height - footerHeight + 20;

    // Sitio web
    doc.addImage(webIcon, "PNG", 30, footerY - 5, 10, 10); // Ajusta el tamaño y posición
    doc.text("www.fumidez.com", 50, footerY);

    // Correo electrónico
    doc.addImage(emailIcon, "PNG", 30, footerY + 15 - 5, 10, 10);
    doc.text("fumidezplagas@gmail.com", 50, footerY + 15);

    // Dirección
    doc.addImage(locationIcon, "PNG", 30, footerY + 30 - 5, 10, 10);
    doc.text(
        "Urb. Caminos del Sur. Julián Estrella S26-102 y pasaje 2",
        50,
        footerY + 30
    );

    // Teléfonos
    doc.addImage(
        phoneIcon,
        "PNG",
        doc.internal.pageSize.width - 80 - 15,
        footerY - 5,
        10,
        10
    );
    doc.text("02 262 0298", doc.internal.pageSize.width - 80, footerY);

    // WhatsApp
    doc.addImage(
        whatsappIcon,
        "PNG",
        doc.internal.pageSize.width - 80 - 15,
        footerY + 15 - 5,
        10,
        10
    );
    doc.text("096 286 5312", doc.internal.pageSize.width - 80, footerY + 15);

    // Guardar PDF
    //doc.save(`informe_${informe.numFactura}.pdf`);
}