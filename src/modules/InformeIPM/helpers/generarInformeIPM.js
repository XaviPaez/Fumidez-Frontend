
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { consultarDesratizacionFachadaPorIdInforme } from './desratizacionHelper';

import logo from '/fumidez_logo.png';
import web from '/web.png';
import mail from '/mail.png';
import home from '/home.png';
import phone from '/phone.png';
import whatsapp from '/whatsapp.png';

// ==========================================
// COLORES Y FUENTES
// ==========================================

const AZUL = [0, 38, 140];
const NEGRO = [0, 0, 0];
const BLANCO = [255, 255, 255];

const PRIMARY_FONT = 'Montserrat';
const SECONDARY_FONT = 'Poppins';

// ==========================================
// REGISTRAR FUENTES
// ==========================================

const registrarFuentesPDF = async (doc) => {

    const cargarFuente = async (
        nombreArchivo,
        alias,
        estilo = 'normal'
    ) => {

        const response = await fetch(`/${nombreArchivo}`);

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar la fuente: ${nombreArchivo}`
            );
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        // Convertir en fragmentos para evitar problemas
        // con archivos de fuentes grandes.
        let binary = '';

        const fragmento = 8192;

        for (let i = 0; i < bytes.length; i += fragmento) {
            binary += String.fromCharCode(
                ...bytes.subarray(i, i + fragmento)
            );
        }

        doc.addFileToVFS(
            nombreArchivo,
            btoa(binary)
        );

        doc.addFont(
            nombreArchivo,
            alias,
            estilo
        );
    };

    await cargarFuente(
        'Montserrat-VariableFont_wght.ttf',
        PRIMARY_FONT,
        'normal'
    );

    await cargarFuente(
        'Montserrat-VariableFont_wght.ttf',
        PRIMARY_FONT,
        'bold'
    );

    await cargarFuente(
        'Poppins-Regular.ttf',
        SECONDARY_FONT,
        'normal'
    );

    await cargarFuente(
        'Poppins-Bold.ttf',
        SECONDARY_FONT,
        'bold'
    );
};

// ==========================================
// FUNCIONES PÚBLICAS
// ==========================================

export const generateFormularioIPMFachada = async (informe) => {
    return await generateFormularioIPMData(informe);
};

export const formularioIPMFachada = async (informe, doc, formulariosPre) => {
    await generateFormularioIPM(informe, doc, formulariosPre);
};

// ==========================================
// GENERAR Y DESCARGAR PDF
// ==========================================

const generateFormularioIPMData = async (informe) => {

    const doc = new jsPDF(
        'portrait',
        'pt',
        'a4'
    );

    await generateFormularioIPM(informe, doc);

    doc.save(
        `Formulario_IPM_${informe.numFactura || 'sin_numero'}.pdf`
    );

    return doc;
};

// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

const generateFormularioIPM = async (informe, doc, formulariosPre) => {

    await registrarFuentesPDF(doc);

    const headerHeight = 65;
    const footerHeight = 65;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // ======================================
    // DEGRADADO CORPORATIVO
    // ======================================

    const white = {
        r: 255,
        g: 255,
        b: 255
    };

    const blue = {
        r: 36,
        g: 91,
        b: 175
    };

    const sectionWidth = pageWidth / 10;

    const drawGradient = (
        pdf,
        x,
        y,
        width,
        height,
        color1,
        color2,
        steps = 50
    ) => {

        for (let i = 0; i < steps; i++) {

            const ratio = i / Math.max(1, steps - 1);

            const r = Math.floor(
                color1.r * (1 - ratio) +
                color2.r * ratio
            );

            const g = Math.floor(
                color1.g * (1 - ratio) +
                color2.g * ratio
            );

            const b = Math.floor(
                color1.b * (1 - ratio) +
                color2.b * ratio
            );

            pdf.setFillColor(r, g, b);

            pdf.rect(
                x + i * (width / steps),
                y,
                width / steps + 0.1,
                height,
                'F'
            );
        }
    };

    // ======================================
    // ENCABEZADO
    // ======================================

    const dibujarEncabezado = () => {

        drawGradient(
            doc,
            0,
            0,
            sectionWidth * 2,
            headerHeight,
            white,
            white
        );

        drawGradient(
            doc,
            sectionWidth * 2,
            0,
            sectionWidth * 2.9,
            headerHeight,
            white,
            blue
        );

        drawGradient(
            doc,
            sectionWidth * 4.9,
            0,
            sectionWidth * 0.2,
            headerHeight,
            blue,
            blue
        );

        drawGradient(
            doc,
            sectionWidth * 5.1,
            0,
            sectionWidth * 2.9,
            headerHeight,
            blue,
            white
        );

        drawGradient(
            doc,
            sectionWidth * 8,
            0,
            sectionWidth * 2,
            headerHeight,
            white,
            white
        );

        // Logotipo.
        doc.addImage(
            logo,
            'PNG',
            8,
            10,
            165,
            45
        );

        // Título principal.
        doc.setFont(
            SECONDARY_FONT,
            'normal'
        );

        doc.setFontSize(24);
        doc.setTextColor(190, 0, 0);

        doc.text(
            'FORMULARIO I.P.M',
            pageWidth - 12,
            29,
            {
                align: 'right'
            }
        );

        // Subtítulo.
        doc.setFontSize(13);
        doc.setTextColor(...AZUL);

        doc.text(
            'MANEJO INTEGRADO DE PLAGAS',
            pageWidth - 12,
            47,
            {
                align: 'right'
            }
        );
    };

    // ======================================
    // PIE DE PÁGINA
    // ======================================

    const dibujarPiePagina = () => {

        const pieY = pageHeight - footerHeight;

        drawGradient(
            doc,
            0,
            pieY,
            sectionWidth * 2,
            footerHeight,
            white,
            white
        );

        drawGradient(
            doc,
            sectionWidth * 2,
            pieY,
            sectionWidth * 2.9,
            footerHeight,
            white,
            blue
        );

        drawGradient(
            doc,
            sectionWidth * 4.9,
            pieY,
            sectionWidth * 0.2,
            footerHeight,
            blue,
            blue
        );

        drawGradient(
            doc,
            sectionWidth * 5.1,
            pieY,
            sectionWidth * 2.9,
            footerHeight,
            blue,
            white
        );

        drawGradient(
            doc,
            sectionWidth * 8,
            pieY,
            sectionWidth * 2,
            footerHeight,
            white,
            white
        );

        const footerY = pieY + 20;

        doc.setFont(
            SECONDARY_FONT,
            'normal'
        );

        doc.setFontSize(7);
        doc.setTextColor(...AZUL);

        // Sitio web.
        doc.addImage(
            web,
            'PNG',
            30,
            footerY - 5,
            10,
            10
        );

        doc.text(
            'www.fumidez.com',
            45,
            footerY
        );

        // Correo.
        doc.addImage(
            mail,
            'PNG',
            30,
            footerY + 10,
            10,
            10
        );

        doc.text(
            'fumidezplagas@gmail.com',
            45,
            footerY + 15
        );

        // Dirección.
        doc.addImage(
            home,
            'PNG',
            30,
            footerY + 25,
            10,
            10
        );

        doc.text(
            'Matriz Quito: Urb. Caminos del Sur. Pasaje 6',
            45,
            footerY + 30
        );

        doc.text(
            'Casa Oe 10-23 y Julián Estrella',
            45,
            footerY + 39
        );

        // Teléfono.
        doc.addImage(
            phone,
            'PNG',
            pageWidth - 112,
            footerY - 5,
            10,
            10
        );

        doc.text(
            '02 262 0298',
            pageWidth - 98,
            footerY
        );

        // WhatsApp.
        doc.addImage(
            whatsapp,
            'PNG',
            pageWidth - 112,
            footerY + 10,
            10,
            10
        );

        doc.text(
            '099 995 4079',
            pageWidth - 98,
            footerY + 15
        );
    };

    // ======================================
    // PRIMERA PÁGINA
    // ======================================

    dibujarEncabezado();

    // ======================================
    // TÍTULOS
    // ======================================

    const tituloY = headerHeight + 25;

    doc.setFont(
        SECONDARY_FONT,
        'bold'
    );

    doc.setFontSize(13);
    doc.setTextColor(...NEGRO);

    doc.text(
        'FORMULARIO IPM',
        pageWidth / 2,
        tituloY,
        {
            align: 'center'
        }
    );

    doc.setFontSize(10);

    doc.text(
        'MANEJO DE ROEDORES',
        pageWidth / 2,
        tituloY + 19,
        {
            align: 'center'
        }
    );

    // ======================================
    // INFORMACIÓN GENERAL
    // ======================================

    const infoX = 45;
    const infoYStart = tituloY + 48;

    const clienteNombre =
        informe.ordenDto?.cliente?.nombre ||
        'Cliente no disponible';

    const fechaOriginal =
        informe.ordenDto?.fecha || '';

    const fechaTrabajo = fechaOriginal
        ? String(fechaOriginal).split('T')[0]
        : '';

    const areaTratada =
        informe.ordenDto?.area || '';

    const dibujarCampo = (
        etiqueta,
        valor,
        y
    ) => {

        doc.setFont(
            SECONDARY_FONT,
            'bold'
        );

        doc.setFontSize(8);
        doc.setTextColor(...NEGRO);

        doc.text(
            etiqueta,
            infoX,
            y
        );

        const anchoEtiqueta =
            doc.getTextWidth(etiqueta);

        doc.setFont(
            SECONDARY_FONT,
            'normal'
        );

        doc.setTextColor(...NEGRO);

        const espacioValor =
            pageWidth -
            (infoX + anchoEtiqueta + 5) -
            40;

        const textoValor =
            doc.splitTextToSize(
                String(valor),
                espacioValor
            );

        doc.text(
            textoValor,
            infoX + anchoEtiqueta + 5,
            y
        );
    };

    dibujarCampo(
        'CLIENTE:',
        clienteNombre,
        infoYStart
    );

    dibujarCampo(
        'FECHA DE TRABAJO REALIZADO:',
        fechaTrabajo,
        infoYStart + 20
    );

    dibujarCampo(
        'ÁREA TRATADA:',
        areaTratada,
        infoYStart + 40
    );

    // ======================================
    // CONSULTAR REGISTROS
    // ======================================

    const formulariosIPM =
        formulariosPre
        ||
        await consultarDesratizacionFachadaPorIdInforme(
            informe.id
        );

    const registros = Array.isArray(formulariosIPM)
        ? formulariosIPM
        : [];

    // ======================================
    // PREPARAR FILAS
    // ======================================

    const bodyData = registros.map(
        (formulario, indice) => {

            const consumo = String(
                formulario.consumo || ''
            )
                .trim()
                .toUpperCase();

            const csp = String(
                formulario.csp || ''
            )
                .trim()
                .toUpperCase();

            return [
                // Número de estación de cebado.
                String(indice + 1),

                // Consumo.
                consumo === 'DAÑO' ? 'X' : '',
                consumo === 'SI' ? 'X' : '',
                consumo === 'NO' ? 'X' : '',

                // Ubicación.
                formulario.ubicacion || '',

                // Observaciones.
                formulario.observaciones || '',

                // Reemplazo.
                formulario.reemplazoPegaCebo === true
                    ? 'X'
                    : '',

                formulario.reemplazoPegaCebo === false
                    ? 'X'
                    : '',

                // C.S.P.
                csp === 'SUMIDERO'
                    ? 'X'
                    : '',

                csp === 'CAJA DE REVISION'
                    ? 'X'
                    : '',

                csp &&
                csp !== 'SUMIDERO' &&
                csp !== 'CAJA DE REVISION'
                    ? 'X'
                    : ''
            ];
        }
    );

    // ======================================
    // DIMENSIONES
    // ======================================

    const margenIzquierdo = 40;
    const margenDerecho = 40;

    const anchoDisponible =
        pageWidth -
        margenIzquierdo -
        margenDerecho;

    const formularioY1 =
        infoYStart + 65;

    // Once columnas. Las proporciones suman 1.
    const anchosColumnas = [
        0.075, // Nº EST.DE CEBADO
        0.05,  // DAÑO
        0.05,  // SI
        0.05,  // NO
        0.21,  // UBICACIÓN
        0.265, // OBSERVACIONES
        0.05,  // P
        0.05,  // CB
        0.067, // S
        0.067, // CR
        0.066  // DE
    ];

    const columnStyles = {};

    anchosColumnas.forEach(
        (proporcion, index) => {

            columnStyles[index] = {
                cellWidth:
                    anchoDisponible * proporcion,

                halign:
                    index === 4 || index === 5
                        ? 'left'
                        : 'center'
            };
        }
    );

    // Columnas que muestran casillas de marcado
    // (consumo, reemplazo y C.S.P.).
    const COLUMNAS_CASILLA = [
        1, 2, 3,
        6, 7, 8, 9, 10
    ];

    // ======================================
    // TABLA IPM
    // ======================================

    autoTable(doc, {

        startY: formularioY1,

        margin: {
            left: margenIzquierdo,
            right: margenDerecho,
            top: headerHeight + 20,
            bottom: footerHeight + 15
        },

        tableWidth: anchoDisponible,

        theme: 'grid',

        showHead: 'everyPage',

        head: [
            [
                {
                    content: 'Nº\nEST.DE\nCEBADO',
                    rowSpan: 2
                },
                {
                    content: 'CONSUMO',
                    colSpan: 3
                },
                {
                    content: 'UBICACIÓN',
                    rowSpan: 2
                },
                {
                    content: 'OBSERVACIONES',
                    rowSpan: 2
                },
                {
                    content: 'REEMPLAZO',
                    colSpan: 2
                },
                {
                    content: 'C.S.P',
                    colSpan: 3
                }
            ],
            [
                'DAÑO',
                'SI',
                'NO',
                'P',
                'CB',
                'S',
                'C.R.',
                'D.E'
            ]
        ],

        body: bodyData,

        styles: {
            font: SECONDARY_FONT,
            fontStyle: 'normal',
            fontSize: 7,

            textColor: NEGRO,
            fillColor: BLANCO,

            lineColor: NEGRO,
            lineWidth: 0.5,

            cellPadding: {
                top: 5,
                right: 3,
                bottom: 5,
                left: 3
            },

            valign: 'middle',
            halign: 'center',

            overflow: 'linebreak'
        },

        headStyles: {
            font: SECONDARY_FONT,
            fontStyle: 'bold',
            fontSize: 7,

            fillColor: BLANCO,
            textColor: NEGRO,

            lineColor: NEGRO,
            lineWidth: 0.5,

            halign: 'center',
            valign: 'middle',

            cellPadding: 5
        },

        bodyStyles: {
            font: SECONDARY_FONT,
            fontStyle: 'normal',
            fontSize: 7,

            textColor: NEGRO,
            fillColor: BLANCO,

            lineColor: NEGRO,
            lineWidth: 0.5
        },

        columnStyles,

        didParseCell: (data) => {

            // "DAÑO" cabe en una sola línea con una
            // fuente y padding menores.
            if (
                data.section === 'head' &&
                data.cell.raw === 'DAÑO'
            ) {
                data.cell.styles.fontSize = 5.5;
                data.cell.styles.cellPadding = 1;
            }

            if (
                data.section === 'head' &&
                data.cell.raw === 'Nº\nEST.DE\nCEBADO'
            ) {
                data.cell.styles.fontSize = 5.5;
                data.cell.styles.cellPadding = 1;
            }

            // Las casillas de marcado se dibujan como
            // cuadros tipo checkbox; su texto no se
            // imprime directamente.
            if (
                data.section === 'body' &&
                COLUMNAS_CASILLA.includes(
                    data.column.index
                )
            ) {
                data.cell.text = [];
            }
        },

        didDrawCell: (data) => {

            if (
                data.section !== 'body' ||
                !COLUMNAS_CASILLA.includes(
                    data.column.index
                )
            ) {
                return;
            }

            const tamano = 9;

            const centroX =
                data.cell.x + data.cell.width / 2;

            const centroY =
                data.cell.y + data.cell.height / 2;

            // Cuadro de la casilla.
            doc.setDrawColor(...NEGRO);
            doc.setFillColor(...BLANCO);
            doc.setLineWidth(0.7);

            doc.rect(
                centroX - tamano / 2,
                centroY - tamano / 2,
                tamano,
                tamano,
                'FD'
            );

            // Marca "x" dentro del cuadro.
            if (data.cell.raw === 'X') {
                doc.setFont(
                    SECONDARY_FONT,
                    'bold'
                );

                doc.setFontSize(7);
                doc.setTextColor(...NEGRO);

                doc.text(
                    'x',
                    centroX,
                    centroY + 2.5,
                    { align: 'center' }
                );
            }
        }
    });

    // ======================================
    // BLOQUE FINAL: ESTÁNDARES, ANÁLISIS,
    // PARÁMETROS, NOMENCLATURA Y FIRMAS
    // ======================================

    const totalPuntos = registros.length;

    const totalConsumoSi = registros.filter(
        (formulario) =>
            String(formulario.consumo || '')
                .trim()
                .toUpperCase() === 'SI'
    ).length;

    const porcentajeControl =
        totalPuntos > 0
            ? (totalConsumoSi * 100) / totalPuntos
            : 0;

    const porcentajeTexto =
        `${parseFloat(porcentajeControl.toFixed(2))}%`;

    const bloqueStyles = {
        font: SECONDARY_FONT,
        fontSize: 6,
        textColor: NEGRO,
        lineColor: NEGRO,
        lineWidth: 0.5,
        cellPadding: 4,
        valign: 'middle',
        overflow: 'linebreak'
    };

    const bloqueHeadStyles = {
        font: SECONDARY_FONT,
        fontStyle: 'bold',
        fontSize: 7,
        textColor: NEGRO,
        fillColor: BLANCO,
        lineColor: NEGRO,
        lineWidth: 0.5,
        halign: 'center',
        cellPadding: 4
    };

    const alturaEstimadaBloque = 265;

    let bloqueY = doc.lastAutoTable.finalY + 12;

    if (
        bloqueY + alturaEstimadaBloque >
        pageHeight - footerHeight - 10
    ) {
        doc.addPage();
        bloqueY = headerHeight + 25;
    }

    const anchoMitad = anchoDisponible / 2;

    // Estándares requeridos + análisis e indicador.
    autoTable(doc, {
        startY: bloqueY,
        margin: {
            left: margenIzquierdo,
            right: margenDerecho
        },
        tableWidth: 'wrap',
        theme: 'grid',
        body: [
            [
                {
                    content:
                        'FORMULARIO CON ESTANDARES REQUERIDOS POR:\n' +
                        '√  E.P.A. Agencia de Protección Ambiental USA.\n' +
                        '√  F.D.A. Administración de alimentos y Medicamentos USA.',
                    styles: {
                        halign: 'left',
                        fontStyle: 'bold'
                    }
                },
                {
                    content:
                        'ANÁLISIS E INDICADOR\n' +
                        'DE CONTROL DE PLAGAS\n\n' +
                        porcentajeTexto +
                        '\n\nFORMULA: NÚMERO DE ESTACIONES\n' +
                        'DE CEBADO TOTALES (SI) DIVIDIDO PARA\n' +
                        'NÚMERO TOTAL DE ESTACIONES DE\n' +
                        'CEBADO INSPECCIONADAS POR 100.',
                    styles: {
                        halign: 'center',
                        fontStyle: 'bold'
                    }
                }
            ]
        ],
        styles: bloqueStyles,
        columnStyles: {
            0: { cellWidth: anchoMitad },
            1: { cellWidth: anchoMitad }
        }
    });

    bloqueY = doc.lastAutoTable.finalY;

    // Parámetros de evaluación.
    autoTable(doc, {
        startY: bloqueY,
        margin: {
            left: margenIzquierdo,
            right: margenDerecho
        },
        tableWidth: 'wrap',
        theme: 'grid',
        head: [
            [
                {
                    content: 'PARÁMETROS DE EVALUACIÓN',
                    colSpan: 3
                }
            ]
        ],
        body: [
            [
                '1% al 15% = BAJO',
                '16% al 30% = MEDIO',
                '31% O MÁS = ALTO'
            ]
        ],
        headStyles: {
            ...bloqueHeadStyles,
            halign: 'left'
        },
        bodyStyles: {
            ...bloqueStyles,
            halign: 'center',
            fontStyle: 'bold'
        },
        styles: bloqueStyles,
        columnStyles: {
            0: { cellWidth: anchoDisponible / 3 },
            1: { cellWidth: anchoDisponible / 3 },
            2: { cellWidth: anchoDisponible / 3 }
        }
    });

    bloqueY = doc.lastAutoTable.finalY;

    // Nomenclatura.
    autoTable(doc, {
        startY: bloqueY,
        margin: {
            left: margenIzquierdo,
            right: margenDerecho
        },
        tableWidth: 'wrap',
        theme: 'grid',
        head: [
            [
                {
                    content: 'NOMENCLATURA',
                    colSpan: 3
                }
            ]
        ],
        body: [
            [
                'P = PEGA',
                'CB = CEBO',
                'C.S.P. = CORDÓN SANITARIO PERIMETRAL'
            ],
            [
                'S = SUMIDERO - SIFÓN',
                'CR = CAJA DE REVISIÓN',
                'D.E = DUCTOS ELÉCTRICOS'
            ],
            [
                {
                    content:
                        'E.C. = ESTACIÓN DE CEBADO',
                    colSpan: 3
                }
            ]
        ],
        headStyles: {
            ...bloqueHeadStyles,
            halign: 'left'
        },
        bodyStyles: {
            ...bloqueStyles,
            halign: 'left',
            fontStyle: 'bold'
        },
        styles: bloqueStyles,
        columnStyles: {
            0: { cellWidth: anchoDisponible / 3 },
            1: { cellWidth: anchoDisponible / 3 },
            2: { cellWidth: anchoDisponible / 3 }
        }
    });

    bloqueY = doc.lastAutoTable.finalY + 55;

    // Área de firmas.
    const firmaAncho = 120;
    const firmaAlto = 32;
    const lineaFirmaAncho = 170;

    const firmaDerechaX =
        pageWidth - margenDerecho - lineaFirmaAncho;

    const firmaTecnico =
        informe.ordenDto?.firmaAdmin || '';

    const firmaCliente =
        informe.ordenDto?.firmaCliente || '';

    const dibujarFirma = (
        dataUrl,
        x,
        yLinea
    ) => {

        if (
            typeof dataUrl === 'string' &&
            dataUrl.startsWith('data:image')
        ) {
            try {
                doc.addImage(
                    dataUrl,
                    'PNG',
                    x + (lineaFirmaAncho - firmaAncho) / 2,
                    yLinea - firmaAlto - 2,
                    firmaAncho,
                    firmaAlto
                );
            } catch (e) {
                // Si la imagen no es válida, solo queda la línea.
            }
        }
    };

    const lineaY = bloqueY + 14;

    dibujarFirma(
        firmaTecnico,
        margenIzquierdo,
        lineaY
    );

    dibujarFirma(
        firmaCliente,
        firmaDerechaX,
        lineaY
    );

    doc.setDrawColor(...NEGRO);
    doc.setLineWidth(0.5);

    doc.line(
        margenIzquierdo,
        lineaY,
        margenIzquierdo + lineaFirmaAncho,
        lineaY
    );

    doc.line(
        firmaDerechaX,
        lineaY,
        firmaDerechaX + lineaFirmaAncho,
        lineaY
    );

    doc.setFont(SECONDARY_FONT, 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...NEGRO);

    doc.text(
        'TÉCNICO RESPONSABLE',
        margenIzquierdo + lineaFirmaAncho / 2,
        lineaY + 10,
        { align: 'center' }
    );

    doc.text(
        'SUPERVISADO POR',
        firmaDerechaX + lineaFirmaAncho / 2,
        lineaY + 10,
        { align: 'center' }
    );

    doc.setFont(SECONDARY_FONT, 'normal');

    doc.text(
        'FUMIDEZ',
        margenIzquierdo + lineaFirmaAncho / 2,
        lineaY + 20,
        { align: 'center' }
    );

    doc.text(
        String(clienteNombre).toUpperCase(),
        firmaDerechaX + lineaFirmaAncho / 2,
        lineaY + 20,
        { align: 'center' }
    );

    // ======================================
    // ENCABEZADO Y PIE EN TODAS LAS PÁGINAS
    // ======================================

    const totalPaginas =
        doc.internal.getNumberOfPages();

    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        doc.setPage(pagina);

        // La primera página ya tiene encabezado.
        if (pagina > 1) {
            dibujarEncabezado();
        }

        dibujarPiePagina();
    }
};
