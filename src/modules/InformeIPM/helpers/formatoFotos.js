import jsPDF from 'jspdf';
import { consultarFotosIdInformeFachada } from './fotosHelper';

import logo from '/fumidez_logo.png';

const registrarFuentesPDF = async (doc) => {

    const cargarFuente = async (
        nombreArchivo,
        alias,
        estilo = 'normal'
    ) => {

        const response = await fetch(`/${nombreArchivo}`);
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        let binary = '';

        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });

        const base64 = btoa(binary);

        doc.addFileToVFS(
            nombreArchivo,
            base64
        );

        doc.addFont(
            nombreArchivo,
            alias,
            estilo
        );
    };

    await cargarFuente(
        'Montserrat-VariableFont_wght.ttf',
        'Montserrat',
        'normal'
    );

    await cargarFuente(
        'Montserrat-VariableFont_wght.ttf',
        'Montserrat',
        'bold'
    );

    await cargarFuente(
        'Poppins-Regular.ttf',
        'Poppins',
        'normal'
    );

    await cargarFuente(
        'Poppins-Bold.ttf',
        'Poppins',
        'bold'
    );
};


export const generateFachadaFotosPDF = async (
    informeId,
    doc,
    fotosPre
) => {

    await generateFotos(
        informeId,
        doc,
        fotosPre
    );
};


export const generateFotosPDFData = async (
    informeId
) => {

    const doc = new jsPDF(
        'portrait',
        'pt',
        'a4'
    );

    await generateFotos(
        informeId,
        doc
    );

    doc.save(
        `Formulario_IPM_${informeId}.pdf`
    );
};


const generateFotos = async (
    informeId,
    doc,
    fotosPre
) => {

    await registrarFuentesPDF(doc);

    const headerHeight = 65;
    const footerHeight = 65;

    const pageWidth =
        doc.internal.pageSize.width;

    const pageHeight =
        doc.internal.pageSize.height;

    const SECONDARY_FONT = 'Poppins';

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

    const sectionWidth =
        pageWidth / 10;


    // ==========================================
    // DEGRADADO
    // ==========================================

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

        for (
            let i = 0;
            i <= steps;
            i++
        ) {

            const ratio =
                i / steps;

            const r =
                Math.floor(
                    color1.r * (1 - ratio)
                    +
                    color2.r * ratio
                );

            const g =
                Math.floor(
                    color1.g * (1 - ratio)
                    +
                    color2.g * ratio
                );

            const b =
                Math.floor(
                    color1.b * (1 - ratio)
                    +
                    color2.b * ratio
                );

            doc.setFillColor(
                r,
                g,
                b
            );

            doc.rect(
                x + i * (width / steps),
                y,
                width / steps,
                height,
                'F'
            );
        }
    };


    // ==========================================
    // ENCABEZADO
    // ==========================================

    const dibujarEncabezado = () => {

        drawGradient(
            doc,
            0,
            0,
            sectionWidth * 2,
            headerHeight,
            white,
            white,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 2,
            0,
            sectionWidth * 2.9,
            headerHeight,
            white,
            blue,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 4.9,
            0,
            sectionWidth * 0.2,
            headerHeight,
            blue,
            blue,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 5.1,
            0,
            sectionWidth * 2.9,
            headerHeight,
            blue,
            white,
            50
        );

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


        // Logo

        doc.addImage(
            logo,
            'PNG',
            8,
            10,
            165,
            45
        );


        // Título

        doc.setFont(
            'Poppins',
            'normal'
        );

        doc.setFontSize(24);

        doc.setTextColor(
            190,
            0,
            0
        );

        doc.text(
            'INFORME I.P.M',
            pageWidth - 12,
            29,
            null,
            null,
            'right'
        );


        doc.setFontSize(13);

        doc.setTextColor(
            0,
            38,
            140
        );

        doc.text(
            'MANEJO INTEGRADO DE PLAGAS',
            pageWidth - 12,
            47,
            null,
            null,
            'right'
        );
    };


    // ==========================================
    // PIE DE PÁGINA
    // ==========================================

    const dibujarPiePagina = () => {

        drawGradient(
            doc,
            0,
            pageHeight - footerHeight,
            sectionWidth * 2,
            footerHeight,
            white,
            white,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 2,
            pageHeight - footerHeight,
            sectionWidth * 2.9,
            footerHeight,
            white,
            blue,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 4.9,
            pageHeight - footerHeight,
            sectionWidth * 0.2,
            footerHeight,
            blue,
            blue,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 5.1,
            pageHeight - footerHeight,
            sectionWidth * 2.9,
            footerHeight,
            blue,
            white,
            50
        );

        drawGradient(
            doc,
            sectionWidth * 8,
            pageHeight - footerHeight,
            sectionWidth * 2,
            footerHeight,
            white,
            white,
            50
        );


        const webIcon =
            '/web.png';

        const emailIcon =
            '/mail.png';

        const locationIcon =
            '/home.png';

        const phoneIcon =
            '/phone.png';

        const whatsappIcon =
            '/whatsapp.png';


        const footerY =
            pageHeight
            - footerHeight
            + 20;


        doc.setFont(
            SECONDARY_FONT,
            'normal'
        );

        doc.setFontSize(8);

        doc.setTextColor(
            0,
            38,
            140
        );


        // Web

        doc.addImage(
            webIcon,
            'PNG',
            30,
            footerY - 5,
            10,
            10
        );

        doc.text(
            'www.fumidez.com',
            50,
            footerY
        );


        // Email

        doc.addImage(
            emailIcon,
            'PNG',
            30,
            footerY + 10,
            10,
            10
        );

        doc.text(
            'fumidezplagas@gmail.com',
            50,
            footerY + 15
        );


        // Dirección

        doc.addImage(
            locationIcon,
            'PNG',
            30,
            footerY + 25,
            10,
            10
        );

        doc.text(
            'Matriz Quito: Urb. Caminos del Sur. Pasaje 6 Casa Oe 10-23 y Julián Estrella',
            50,
            footerY + 30
        );


        // Teléfono

        doc.addImage(
            phoneIcon,
            'PNG',
            pageWidth - 95,
            footerY - 5,
            10,
            10
        );

        doc.text(
            '02 262 0298',
            pageWidth - 80,
            footerY
        );


        // WhatsApp

        doc.addImage(
            whatsappIcon,
            'PNG',
            pageWidth - 95,
            footerY + 10,
            10,
            10
        );

        doc.text(
            '099 995 4079',
            pageWidth - 80,
            footerY + 15
        );
    };


    // ==========================================
    // DECORAR UNA PÁGINA
    // ==========================================

    const prepararPagina = () => {

        dibujarEncabezado();
        dibujarPiePagina();
    };


    // Primera página de fotos

    prepararPagina();


    try {

        // ==========================================
        // CONSULTAR FOTOS
        // ==========================================

        const fotos =
            fotosPre
            ||
            await consultarFotosIdInformeFachada(
                informeId
            );


        if (
            !fotos
            ||
            fotos.length === 0
        ) {

            console.warn(
                'No se encontraron fotos para este informe.'
            );

            return;
        }


        // ==========================================
        // CUÁNTAS FOTOS POR FILA
        // ==========================================

        const totalFotos =
            fotos.length;

        let fotosPerRow;


        if (totalFotos <= 2) {

            // 1 o 2 fotos
            // Grandes, una debajo de otra

            fotosPerRow = 1;

        } else if (totalFotos <= 6) {

            // 3 a 6 fotos

            fotosPerRow = 2;

        } else {

            // 7 o más fotos

            fotosPerRow = 3;
        }


        // ==========================================
        // DIMENSIONES DEL GRID
        // ==========================================

        const margenLateral = 30;

        const espacioHorizontal =
            fotosPerRow === 3
                ? 12
                : 20;

        const espacioVertical =
            fotosPerRow === 1
                ? 28
                : 22;


        const anchoDisponible =
            pageWidth
            -
            margenLateral * 2;


        const espaciosTotales =
            espacioHorizontal
            *
            (fotosPerRow - 1);


        const anchoColumna =
            (
                anchoDisponible
                -
                espaciosTotales
            )
            /
            fotosPerRow;


        // Máxima altura permitida
        // según cantidad de columnas

        const maxHeight =
            fotosPerRow === 1
                ? 390
                : fotosPerRow === 2
                    ? 225
                    : 150;


        // Inicio después del header

        const inicioContenidoY =
            headerHeight + 30;


        // Límite antes del footer

        const limiteContenidoY =
            pageHeight
            -
            footerHeight
            -
            20;


        let y =
            inicioContenidoY;


        // ==========================================
        // CALCULAR TAMAÑO MANTENIENDO PROPORCIÓN
        // ==========================================

        const calcularTamanoImagen = (
            imageData
        ) => {

            const propiedades =
                doc.getImageProperties(
                    imageData
                );


            const ratio =
                propiedades.width
                /
                propiedades.height;


            let width =
                anchoColumna;


            let height =
                width / ratio;


            // Si la imagen queda demasiado alta,
            // limitar la altura conservando proporción

            if (
                height > maxHeight
            ) {

                height =
                    maxHeight;

                width =
                    height * ratio;
            }


            return {
                width,
                height
            };
        };


        // ==========================================
        // DIVIDIR FOTOS POR FILAS
        // ==========================================

        for (
            let inicioFila = 0;
            inicioFila < fotos.length;
            inicioFila += fotosPerRow
        ) {

            const fotosFila =
                fotos.slice(
                    inicioFila,
                    inicioFila + fotosPerRow
                );


            // Primero calculamos TODO
            // antes de pintar la fila

            const elementosFila =
                fotosFila.map(
                    (foto) => {

                        const base64Foto =
                            foto.fotoBase64;


                        const mimeType =
                            foto.mimeType
                            ||
                            'image/jpeg';


                        const imageData =
                            `data:${mimeType};base64,${base64Foto}`;


                        const format =
                            mimeType.includes('png')
                                ? 'PNG'
                                : mimeType.includes('webp')
                                    ? 'WEBP'
                                    : 'JPEG';


                        const tamano =
                            calcularTamanoImagen(
                                imageData
                            );


                        const pieImagen =
                            foto.pieImagen?.trim()
                            ||
                            '';


                        let lineasPie = [];

                        let altoPie = 0;


                        if (pieImagen) {

                            doc.setFont(
                                SECONDARY_FONT,
                                'normal'
                            );

                            doc.setFontSize(8);


                            lineasPie =
                                doc.splitTextToSize(
                                    pieImagen,
                                    tamano.width - 10
                                );


                            altoPie =
                                lineasPie.length
                                * 10
                                + 8;
                        }


                        return {

                            foto,

                            imageData,

                            format,

                            imageWidth:
                                tamano.width,

                            imageHeight:
                                tamano.height,

                            pieImagen,

                            lineasPie,

                            altoPie
                        };
                    }
                );


            // ==========================================
            // ALTURA REAL DE LA FILA
            // ==========================================

            const alturaImagenFila =
                Math.max(
                    ...elementosFila.map(
                        elemento =>
                            elemento.imageHeight
                    )
                );


            const alturaPieFila =
                Math.max(
                    0,
                    ...elementosFila.map(
                        elemento =>
                            elemento.altoPie
                    )
                );


            const alturaFila =
                alturaImagenFila
                +
                alturaPieFila;


            // ==========================================
            // ¿CABE EN ESTA PÁGINA?
            // ==========================================

            if (
                y
                +
                alturaFila
                >
                limiteContenidoY
            ) {

                doc.addPage();

                prepararPagina();

                y =
                    inicioContenidoY;
            }


            // ==========================================
            // DIBUJAR CADA FOTO DE ESTA FILA
            // ==========================================

            elementosFila.forEach(
                (
                    elemento,
                    indiceColumna
                ) => {

                    const columnaX =
                        margenLateral
                        +
                        indiceColumna
                        *
                        (
                            anchoColumna
                            +
                            espacioHorizontal
                        );


                    // Centrar dentro de la columna

                    const imageX =
                        columnaX
                        +
                        (
                            anchoColumna
                            -
                            elemento.imageWidth
                        )
                        / 2;


                    // Centrar verticalmente dentro
                    // de la altura máxima de la fila

                    const imageY =
                        y
                        +
                        (
                            alturaImagenFila
                            -
                            elemento.imageHeight
                        )
                        / 2;


                    // FOTO

                    doc.addImage(
                        elemento.imageData,
                        elemento.format,
                        imageX,
                        imageY,
                        elemento.imageWidth,
                        elemento.imageHeight
                    );


                    // ==========================================
                    // PIE DE IMAGEN OPCIONAL
                    // ==========================================

                    if (
                        elemento.pieImagen
                    ) {

                        doc.setFont(
                            SECONDARY_FONT,
                            'normal'
                        );

                        doc.setFontSize(8);

                        doc.setTextColor(
                            60,
                            60,
                            60
                        );


                        doc.text(
                            elemento.lineasPie,
                            imageX
                            +
                            elemento.imageWidth / 2,
                            y
                            +
                            alturaImagenFila
                            +
                            12,
                            {
                                align: 'center'
                            }
                        );
                    }
                }
            );


            // ==========================================
            // SIGUIENTE FILA
            // ==========================================

            y +=
                alturaFila
                +
                espacioVertical;
        }


    } catch (error) {

        console.error(
            'Error al generar las fotos para el PDF:',
            error
        );
    }
};