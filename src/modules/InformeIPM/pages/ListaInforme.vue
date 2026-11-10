<template>
  <div class="reports-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>
        <span class="page-eyebrow">
          INFORMES TÉCNICOS
        </span>

        <h1>
          Informes IPM
        </h1>

        <p>
          Consulta y administra los informes técnicos,
          documentación, evidencias fotográficas y reportes
          generados por Fumidez.
        </p>
      </div>


      <button
        type="button"
        class="primary-button"
        @click="redirigirCrearInforme"
      >
        <i class="bi bi-plus-lg"></i>
        Nuevo informe
      </button>

    </section>


    <!-- ===================================================== -->
    <!-- RESUMEN -->
    <!-- ===================================================== -->

    <section class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon blue">
          <i class="bi bi-file-earmark-text"></i>
        </div>

        <div>
          <span>Informes registrados</span>
          <strong>{{ informes.length }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon green">
          <i class="bi bi-receipt"></i>
        </div>

        <div>
          <span>Con número de factura</span>
          <strong>{{ informesConFactura }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon purple">
          <i class="bi bi-cash-stack"></i>
        </div>

        <div>
          <span>Valor registrado</span>
          <strong>{{ formatearMoneda(valorTotalInformes) }}</strong>
        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- MENSAJES -->
    <!-- ===================================================== -->

    <div
      v-if="mensajeExito"
      class="message success-message"
    >
      <i class="bi bi-check-circle-fill"></i>

      <span>
        {{ mensajeExito }}
      </span>
    </div>


    <div
      v-if="mensajeError"
      class="message error-message"
    >
      <i class="bi bi-exclamation-circle-fill"></i>

      <span>
        {{ mensajeError }}
      </span>

      <button
        type="button"
        @click="cargarInformes"
      >
        Reintentar
      </button>
    </div>


    <!-- ===================================================== -->
    <!-- PANEL -->
    <!-- ===================================================== -->

    <section class="reports-panel">

      <div class="panel-header">

        <div>
          <h2>
            Informes registrados
          </h2>

          <p>
            {{ informesFiltrados.length }}
            {{
              informesFiltrados.length === 1
                ? "informe encontrado"
                : "informes encontrados"
            }}
          </p>
        </div>


        <button
          type="button"
          class="refresh-button"
          :disabled="cargando"
          @click="cargarInformes"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ rotating: cargando }"
          ></i>

          Actualizar
        </button>

      </div>


      <!-- ================================================= -->
      <!-- FILTROS -->
      <!-- ================================================= -->

      <div class="filters">

        <div class="search-box">

          <i class="bi bi-search"></i>

          <input
            v-model.trim="filtro"
            type="text"
            placeholder="Buscar por factura, frecuencia, precio u orden..."
          />

          <button
            v-if="filtro"
            type="button"
            class="clear-search"
            @click="filtro = ''"
          >
            <i class="bi bi-x"></i>
          </button>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- CARGANDO -->
      <!-- ================================================= -->

      <div
        v-if="cargando"
        class="loading-state"
      >
        <div class="spinner-border text-primary"></div>

        <span>
          Cargando informes IPM...
        </span>
      </div>


      <!-- ================================================= -->
      <!-- VACÍO -->
      <!-- ================================================= -->

      <div
        v-else-if="informesFiltrados.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          <i class="bi bi-file-earmark-medical"></i>
        </div>


        <h3>
          {{
            informes.length === 0
              ? "No hay informes registrados"
              : "No encontramos informes"
          }}
        </h3>


        <p>
          {{
            informes.length === 0
              ? "Registra el primer informe técnico para comenzar a documentar los servicios realizados."
              : "Prueba utilizando otro número de factura, frecuencia u orden."
          }}
        </p>


        <button
          v-if="informes.length === 0"
          type="button"
          class="primary-button"
          @click="redirigirCrearInforme"
        >
          <i class="bi bi-plus-lg"></i>
          Crear informe
        </button>

      </div>


      <!-- ================================================= -->
      <!-- TABLA -->
      <!-- ================================================= -->

      <template v-else>

        <div class="table-wrapper">

          <table class="reports-table">

            <thead>

              <tr>

                <th class="id-column">
                  #
                </th>


                <th
                  class="sortable"
                  @click="ordenar('numFactura')"
                >
                  Informe / Factura

                  <i :class="iconoOrden('numFactura')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('frecuencia')"
                >
                  Frecuencia

                  <i :class="iconoOrden('frecuencia')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('precio')"
                >
                  Precio

                  <i :class="iconoOrden('precio')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('idOrden')"
                >
                  Orden

                  <i :class="iconoOrden('idOrden')"></i>
                </th>


                <th class="actions-column">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(informe, index) in informesPaginados"
                :key="informe.id"
              >

                <!-- NÚMERO -->

                <td class="row-number">
                  {{ indiceInicial + index + 1 }}
                </td>


                <!-- INFORME -->

                <td>

                  <div class="report-info">

                    <div class="report-icon">
                      <i class="bi bi-file-earmark-text"></i>
                    </div>


                    <div>

                      <strong>
                        {{
                          informe.numFactura
                          || "Sin número de factura"
                        }}
                      </strong>

                      <span>
                        Informe #{{ informe.id }}
                      </span>

                    </div>

                  </div>

                </td>


                <!-- FRECUENCIA -->

                <td>

                  <span class="frequency-badge">
                    <i class="bi bi-arrow-repeat"></i>

                    {{
                      informe.frecuencia
                      || "Sin definir"
                    }}
                  </span>

                </td>


                <!-- PRECIO -->

                <td>

                  <div class="price-cell">

                    <span>
                      {{ formatearMoneda(informe.precio) }}
                    </span>

                  </div>

                </td>


             <!-- ORDEN -->
<td>
  <span
    v-if="informe.ordenDto"
    class="order-badge"
  >
    <i class="bi bi-clipboard-check"></i>

    {{ informe.ordenDto.numeroOrden }}
  </span>

  <span
    v-else
    class="no-data"
  >
    Sin orden
  </span>
</td>

                <!-- ACCIONES -->

                <td>

                  <div class="actions">

                    <!-- VER -->

                    <button
                      type="button"
                      class="action-button view"
                      title="Ver informe"
                      @click="verInforme(informe.id)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>


                    <!-- EDITAR FORMULARIO -->

                    <button
                      type="button"
                      class="action-button edit"
                      title="Editar formulario IPM"
                      @click="redirigirFormularioIPM(informe.id)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>


                    <!-- FOTOS -->

                    <button
                      type="button"
                      class="action-button photos"
                      title="Gestionar fotografías"
                      @click="abrirModal(informe)"
                    >
                      <i class="bi bi-images"></i>
                    </button>


                    <!-- DOCUMENTOS -->

                    <div class="dropdown">

                      <button
                        type="button"
                        class="documents-button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="bi bi-file-earmark-arrow-down"></i>

                        Documentos

                        <i class="bi bi-chevron-down"></i>
                      </button>


                      <ul class="dropdown-menu dropdown-menu-end shadow">

                        <li>

                          <button
                            class="dropdown-item document-option"
                            :disabled="documentoGenerando !== null"
                            @click="generatePDF(informe)"
                          >
                            <i class="bi bi-file-earmark-pdf pdf-red"></i>

                            <div>
                              <strong>
                                Informe
                              </strong>

                              <span>
                                Generar informe PDF
                              </span>
                            </div>
                          </button>

                        </li>


                        <li>

                          <button
                            class="dropdown-item document-option"
                            :disabled="documentoGenerando !== null"
                            @click="generatePDFFormularioIPM(informe)"
                          >
                            <i class="bi bi-journal-text pdf-blue"></i>

                            <div>
                              <strong>
                                Formulario IPM
                              </strong>

                              <span>
                                Generar formulario técnico
                              </span>
                            </div>
                          </button>

                        </li>


                        <li>

                          <button
                            class="dropdown-item document-option"
                            :disabled="documentoGenerando !== null"
                            @click="generatePDFCompleto(informe)"
                          >
                            <i class="bi bi-files pdf-purple"></i>

                            <div>
                              <strong>
                                Documento completo
                              </strong>

                              <span>
                                Informe y formulario unidos
                              </span>
                            </div>
                          </button>

                        </li>

                      </ul>

                    </div>


                    <!-- ELIMINAR -->

                    <button
                      type="button"
                      class="action-button delete"
                      title="Eliminar informe"
                      @click="solicitarEliminar(informe)"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <!-- ================================================= -->
        <!-- PAGINACIÓN -->
        <!-- ================================================= -->

        <div class="table-footer">

          <div class="page-size">

            <span>
              Mostrar
            </span>

            <select
              v-model.number="informesPorPagina"
              @change="paginaActual = 1"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>

            <span>
              por página
            </span>

          </div>


          <div class="pagination-info">

            Mostrando

            <strong>
              {{ indiceInicial + 1 }}
            </strong>

            -

            <strong>
              {{ indiceFinal }}
            </strong>

            de

            <strong>
              {{ informesFiltrados.length }}
            </strong>

          </div>


          <div class="pagination">

            <button
              type="button"
              :disabled="paginaActual === 1"
              @click="cambiarPagina(paginaActual - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>


            <span>
              Página
              <strong>{{ paginaActual }}</strong>
              de
              <strong>{{ totalPaginas }}</strong>
            </span>


            <button
              type="button"
              :disabled="paginaActual === totalPaginas"
              @click="cambiarPagina(paginaActual + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>

          </div>

        </div>

      </template>

    </section>


    <!-- ===================================================== -->
    <!-- MODAL FOTOGRAFÍAS -->
    <!-- ===================================================== -->

    <div
      v-if="isModalOpen"
      class="modal-backdrop-custom"
      @click.self="cerrarModal"
    >

      <div class="photos-modal">

        <!-- HEADER -->

        <div class="photos-modal-header">

          <div>

            <span class="modal-eyebrow">
              EVIDENCIA FOTOGRÁFICA
            </span>

            <h3>
              Fotografías del informe
            </h3>

            <p>
              {{
                informeSeleccionadoObjeto
                  ? `Informe #${informeSeleccionadoObjeto.id}`
                  : ""
              }}
            </p>

          </div>


          <button
            type="button"
            class="close-modal-button"
            :disabled="guardandoFotos"
            @click="cerrarModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <!-- BODY -->

        <div class="photos-modal-body">

          <!-- CARGANDO FOTOS -->

          <div
            v-if="cargandoFotos"
            class="photos-loading"
          >
            <div class="spinner-border text-primary"></div>

            <span>
              Cargando fotografías...
            </span>
          </div>


          <template v-else>

            <!-- ============================================= -->
            <!-- FOTOS EXISTENTES -->
            <!-- ============================================= -->

            <section class="photos-section">

              <div class="photos-section-header">

                <div>
                  <h4>
                    Fotografías cargadas
                  </h4>

                  <p>
                    Evidencias que ya forman parte del informe.
                  </p>
                </div>


                <span class="photo-count">
                  {{ fotos.length }}
                  {{
                    fotos.length === 1
                      ? "foto"
                      : "fotos"
                  }}
                </span>

              </div>


              <div
                v-if="fotos.length > 0"
                class="photos-grid"
              >

                <article
                  v-for="foto in fotos"
                  :key="foto.id"
                  class="photo-card"
                >

                  <div class="photo-image-container">

                    <img
                      v-if="foto.src"
                      :src="foto.src"
                      :alt="foto.nombre"
                      class="photo-preview"
                    />


                    <div
                      v-else
                      class="photo-placeholder"
                    >
                      <i class="bi bi-image"></i>
                    </div>


                    <button
                      type="button"
                      class="delete-photo-button"
                      title="Eliminar fotografía"
                      :disabled="fotoEliminando === foto.id"
                      @click="solicitarEliminarFoto(foto)"
                    >

                      <span
                        v-if="fotoEliminando === foto.id"
                        class="spinner-border spinner-border-sm"
                      ></span>

                      <i
                        v-else
                        class="bi bi-trash3"
                      ></i>

                    </button>

                  </div>


                  <div class="photo-details">

                    <strong>
                      {{ foto.nombre }}
                    </strong>


                    <p v-if="foto.pieImagen">
                      {{ foto.pieImagen }}
                    </p>


                    <span v-else>
                      Sin descripción
                    </span>

                  </div>

                </article>

              </div>


              <div
                v-else
                class="photos-empty"
              >

                <div>
                  <i class="bi bi-images"></i>
                </div>

                <strong>
                  Sin fotografías
                </strong>

                <span>
                  Este informe todavía no tiene evidencias fotográficas.
                </span>

              </div>

            </section>


            <!-- ============================================= -->
            <!-- NUEVAS FOTOS -->
            <!-- ============================================= -->

            <section class="photos-section new-photos-section">

              <div class="photos-section-header">

                <div>
                  <h4>
                    Agregar fotografías
                  </h4>

                  <p>
                    Selecciona imágenes y agrega una descripción opcional.
                  </p>
                </div>

              </div>


              <label
                for="photoInput"
                class="photo-upload-zone"
              >

                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  @change="manejarArchivo"
                />


                <div class="upload-icon">
                  <i class="bi bi-cloud-arrow-up"></i>
                </div>


                <div>

                  <strong>
                    Seleccionar fotografías
                  </strong>

                  <span>
                    Puedes seleccionar varias imágenes al mismo tiempo.
                  </span>

                </div>

              </label>


              <div
                v-if="archivos.length > 0"
                class="new-photos-grid"
              >

                <article
                  v-for="(archivo, index) in archivos"
                  :key="`${archivo.file.name}-${index}`"
                  class="new-photo-card"
                >

                  <div class="new-photo-preview">

                    <img
                      :src="archivo.preview"
                      alt="Vista previa"
                    />


                    <button
                      type="button"
                      class="remove-new-photo"
                      @click="quitarArchivo(index)"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>

                  </div>


                  <div class="new-photo-info">

                    <strong>
                      {{ archivo.file.name }}
                    </strong>


                    <span>
                      {{ formatearTamano(archivo.file.size) }}
                    </span>


                    <textarea
                      v-model.trim="archivo.pieImagen"
                      maxlength="500"
                      rows="2"
                      placeholder="Pie de imagen (opcional)"
                    ></textarea>


                    <small>
                      {{ archivo.pieImagen.length }}/500
                    </small>

                  </div>

                </article>

              </div>

            </section>

          </template>

        </div>


        <!-- FOOTER -->

        <div class="photos-modal-footer">

          <div>

            <span
              v-if="archivos.length > 0"
              class="pending-upload"
            >
              <i class="bi bi-cloud-arrow-up"></i>

              {{ archivos.length }}
              {{
                archivos.length === 1
                  ? "foto pendiente"
                  : "fotos pendientes"
              }}
            </span>

          </div>


          <div class="modal-footer-actions">

            <button
              type="button"
              class="secondary-button"
              :disabled="guardandoFotos"
              @click="cerrarModal"
            >
              Cerrar
            </button>


            <button
              type="button"
              class="primary-button"
              :disabled="
                archivos.length === 0
                ||
                guardandoFotos
              "
              @click="guardarFotos"
            >

              <span
                v-if="guardandoFotos"
                class="spinner-border spinner-border-sm"
              ></span>

              <i
                v-else
                class="bi bi-cloud-arrow-up"
              ></i>


              {{
                guardandoFotos
                  ? "Guardando..."
                  : "Guardar fotografías"
              }}

            </button>

          </div>

        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- CONFIRMACIÓN ELIMINAR INFORME -->
    <!-- ===================================================== -->

    <div
      v-if="informeAEliminar"
      class="modal-backdrop-custom"
      @click.self="cancelarEliminar"
    >

      <div class="delete-modal">

        <div class="delete-icon">
          <i class="bi bi-trash3"></i>
        </div>


        <h3>
          ¿Eliminar informe?
        </h3>


        <p>
          Está a punto de eliminar el informe

          <strong>
            #{{ informeAEliminar.id }}
          </strong>.
        </p>


        <span class="delete-warning">
          También puede contener procedimientos, fotografías
          y otros datos relacionados.
        </span>


        <div class="confirmation-actions">

          <button
            type="button"
            class="secondary-button"
            :disabled="eliminandoInforme"
            @click="cancelarEliminar"
          >
            Cancelar
          </button>


          <button
            type="button"
            class="danger-button"
            :disabled="eliminandoInforme"
            @click="confirmarEliminar"
          >

            <span
              v-if="eliminandoInforme"
              class="spinner-border spinner-border-sm"
            ></span>

            <i
              v-else
              class="bi bi-trash3"
            ></i>

            {{
              eliminandoInforme
                ? "Eliminando..."
                : "Eliminar"
            }}

          </button>

        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- CONFIRMACIÓN ELIMINAR FOTO -->
    <!-- ===================================================== -->

    <div
      v-if="fotoAEliminar"
      class="photo-confirm-backdrop"
      @click.self="cancelarEliminarFoto"
    >

      <div class="delete-photo-modal">

        <div class="delete-icon">
          <i class="bi bi-image"></i>
        </div>


        <h3>
          ¿Eliminar fotografía?
        </h3>


        <p>
          La fotografía será eliminada de este informe.
        </p>


        <div class="confirmation-actions">

          <button
            type="button"
            class="secondary-button"
            @click="cancelarEliminarFoto"
          >
            Cancelar
          </button>


          <button
            type="button"
            class="danger-button"
            @click="confirmarEliminarFoto"
          >
            <i class="bi bi-trash3"></i>
            Eliminar
          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script>
import {
  consultarInformeFachada,
  consultarInformePorIdFachada,
  eliminarInformeFachada
} from "../helpers/informeHelper";

import {
  generatePDFInformeFachada
} from "../helpers/generarInforme";

import {
  generateFormularioIPMFachada
} from "../helpers/generarInformeIPM";

import {
  generateFormularioCompletoFachada
} from "../helpers/generarInformeUnido";

import {
  guardarFotosFachada,
  consultarFotosIdInformeFachada,
  eliminarFotoFachada
} from "../helpers/fotosHelper";

import {
  api
} from "@/config/api";


export default {

  name: "InformeIpm",


  data() {

    return {

      informes: [],

      filtro: "",

      paginaActual: 1,

      informesPorPagina: 10,

      columnaOrdenada: "id",

      ordenAscendente: false,

      cargando: false,

      documentoGenerando: null,

      mensajeExito: "",

      mensajeError: "",


      // ===============================================
      // FOTOS
      // ===============================================

      isModalOpen: false,

      informeSeleccionado: null,

      informeSeleccionadoObjeto: null,

      archivos: [],

      fotos: [],

      cargandoFotos: false,

      guardandoFotos: false,

      fotoEliminando: null,

      fotoAEliminar: null,


      // ===============================================
      // ELIMINAR INFORME
      // ===============================================

      informeAEliminar: null,

      eliminandoInforme: false

    };

  },


  computed: {

    // =====================================================
    // RESUMEN
    // =====================================================

    informesConFactura() {

      return this.informes.filter(
        informe =>
          informe.numFactura
          &&
          String(informe.numFactura).trim()
      ).length;

    },


    valorTotalInformes() {

      return this.informes.reduce(
        (total, informe) =>
          total
          +
          Number(informe.precio || 0),
        0
      );

    },


    // =====================================================
    // FILTRO
    // =====================================================

    informesFiltrados() {

      const texto =
        this.normalizarTexto(
          this.filtro
        );


      if (!texto) {

        return this.informes;

      }


      return this.informes.filter(
        informe => {

          const contenido =
            this.normalizarTexto(
              [
                informe.id,
                informe.numFactura,
                informe.frecuencia,
                informe.precio,
                informe.idOrden
              ]
                .filter(
                  valor =>
                    valor !== null
                    &&
                    valor !== undefined
                )
                .join(" ")
            );


          return contenido.includes(
            texto
          );

        }
      );

    },


    // =====================================================
    // ORDENAMIENTO
    // =====================================================

    informesOrdenados() {

      const lista =
        [...this.informesFiltrados];


      return lista.sort(
        (a, b) => {

          let valorA =
            a[this.columnaOrdenada];

          let valorB =
            b[this.columnaOrdenada];


          if (
            this.columnaOrdenada === "id"
            ||
            this.columnaOrdenada === "precio"
            ||
            this.columnaOrdenada === "idOrden"
          ) {

            valorA =
              Number(valorA || 0);

            valorB =
              Number(valorB || 0);

          } else {

            valorA =
              this.normalizarTexto(
                valorA
              );

            valorB =
              this.normalizarTexto(
                valorB
              );

          }


          if (valorA < valorB) {

            return this.ordenAscendente
              ? -1
              : 1;

          }


          if (valorA > valorB) {

            return this.ordenAscendente
              ? 1
              : -1;

          }


          return 0;

        }
      );

    },


    // =====================================================
    // PAGINACIÓN
    // =====================================================

    totalPaginas() {

      return Math.max(
        1,
        Math.ceil(
          this.informesOrdenados.length
          /
          this.informesPorPagina
        )
      );

    },


    indiceInicial() {

      return (
        (this.paginaActual - 1)
        *
        this.informesPorPagina
      );

    },


    indiceFinal() {

      return Math.min(
        this.indiceInicial
        +
        this.informesPorPagina,
        this.informesFiltrados.length
      );

    },


    informesPaginados() {

      return this.informesOrdenados.slice(
        this.indiceInicial,
        this.indiceFinal
      );

    }

  },


  watch: {

    filtro() {

      this.paginaActual =
        1;

    },


    totalPaginas(nuevoTotal) {

      if (
        this.paginaActual > nuevoTotal
      ) {

        this.paginaActual =
          nuevoTotal;

      }

    }

  },


  mounted() {

    this.cargarInformes();

  },


  beforeUnmount() {

    this.liberarUrlsFotos();

    this.liberarPreviewsArchivos();

  },


  methods: {

    // =====================================================
    // INFORMES
    // =====================================================

    async cargarInformes() {

      this.cargando =
        true;

      this.mensajeError =
        "";


      try {

        const response =
          await consultarInformeFachada();


        this.informes =
          Array.isArray(response)
            ? response
            : [];


      } catch (error) {

        console.error(
          "Error cargando informes IPM:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el listado de informes.";

      } finally {

        this.cargando =
          false;

      }

    },


    // =====================================================
    // FORMATO
    // =====================================================

    formatearMoneda(valor) {

      const numero =
        Number(valor || 0);


      return new Intl.NumberFormat(
        "es-EC",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
        }
      ).format(numero);

    },


    formatearTamano(bytes) {

      const numero =
        Number(bytes || 0);


      if (numero < 1024) {

        return `${numero} B`;

      }


      if (
        numero
        <
        1024 * 1024
      ) {

        return `${(
          numero / 1024
        ).toFixed(1)} KB`;

      }


      return `${(
        numero
        /
        (1024 * 1024)
      ).toFixed(1)} MB`;

    },


    normalizarTexto(valor) {

      return String(
        valor || ""
      )
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .toLowerCase()
        .trim();

    },


    // =====================================================
    // ORDENAR
    // =====================================================

    ordenar(columna) {

      if (
        this.columnaOrdenada === columna
      ) {

        this.ordenAscendente =
          !this.ordenAscendente;

      } else {

        this.columnaOrdenada =
          columna;

        this.ordenAscendente =
          true;

      }

    },


    iconoOrden(columna) {

      if (
        this.columnaOrdenada !== columna
      ) {

        return "bi bi-arrow-down-up sort-neutral";

      }


      return this.ordenAscendente
        ? "bi bi-arrow-up sort-active"
        : "bi bi-arrow-down sort-active";

    },


    // =====================================================
    // PAGINACIÓN
    // =====================================================

    cambiarPagina(nuevaPagina) {

      if (
        nuevaPagina >= 1
        &&
        nuevaPagina <= this.totalPaginas
      ) {

        this.paginaActual =
          nuevaPagina;

      }

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirCrearInforme() {

      this.$router.push(
        "/informe_registrar"
      );

    },


    redirigirFormularioIPM(id) {

      this.$router.push(
        `/desratizacion/${id}`
      );

    },


    verInforme(id) {

      this.$router.push(
        `/informe_ver/${id}`
      );

    },


    // =====================================================
    // PDF
    // =====================================================

    async generatePDF(informe) {

      await this.generarDocumento(
        informe,
        "INFORME",
        generatePDFInformeFachada
      );

    },


    async generatePDFFormularioIPM(informe) {

      await this.generarDocumento(
        informe,
        "FORMULARIO",
        generateFormularioIPMFachada
      );

    },


    async generatePDFCompleto(informe) {

      await this.generarDocumento(
        informe,
        "COMPLETO",
        generateFormularioCompletoFachada
      );

    },


    async generarDocumento(
      informe,
      tipo,
      generador
    ) {

      this.documentoGenerando =
        `${informe.id}-${tipo}`;

      this.mensajeError =
        "";


      try {

        const informeCompleto =
          await consultarInformePorIdFachada(
            informe.id
          );


        await generador(
          informeCompleto
        );


      } catch (error) {

        console.error(
          "Error generando documento:",
          error
        );


        this.mensajeError =
          "No se pudo generar el documento solicitado.";

      } finally {

        this.documentoGenerando =
          null;

      }

    },


    // =====================================================
    // ABRIR FOTOS
    // =====================================================

    async abrirModal(informe) {

      this.informeSeleccionado =
        informe.id;

      this.informeSeleccionadoObjeto =
        informe;

      this.isModalOpen =
        true;

      this.cargandoFotos =
        true;

      this.mensajeError =
        "";


      try {

        await this.cargarFotosInforme();


      } catch (error) {

        console.error(
          "Error cargando fotos:",
          error
        );


        this.fotos =
          [];


        this.mensajeError =
          "No se pudieron cargar las fotografías del informe.";

      } finally {

        this.cargandoFotos =
          false;

      }

    },


    // =====================================================
    // CARGAR FOTOS
    // =====================================================

    async cargarFotosInforme() {

      this.liberarUrlsFotos();


      const fotosBackend =
        await consultarFotosIdInformeFachada(
          this.informeSeleccionado
        );


      const lista =
        Array.isArray(fotosBackend)
          ? fotosBackend
          : [];


      const fotosPreparadas =
        [];


      for (const foto of lista) {

        let src =
          "";


        try {

          /*
           * IMPORTANTE:
           * El backend ya no devuelve fotoBase64.
           *
           * Devuelve contenidoUrl, por ejemplo:
           * /almacenamiento/15/contenido
           *
           * Como api incluye el JWT automáticamente,
           * descargamos la fotografía como blob.
           */

          const contenidoUrl =
            foto.contenidoUrl
            ||
            `/almacenamiento/${foto.id}/contenido`;


          const response =
            await api.get(
              contenidoUrl,
              {
                responseType: "blob"
              }
            );


          src =
            URL.createObjectURL(
              response.data
            );


        } catch (error) {

          console.error(
            `Error cargando fotografía ${foto.id}:`,
            error
          );

        }


        fotosPreparadas.push({

          id:
            foto.id,

          nombre:
            foto.nombre
            ||
            `Foto ${foto.id}`,

          mimeType:
            foto.mimeType
            ||
            "image/jpeg",

          pieImagen:
            foto.pieImagen
            ||
            "",

          contenidoUrl:
            foto.contenidoUrl
            ||
            `/almacenamiento/${foto.id}/contenido`,

          src

        });

      }


      this.fotos =
        fotosPreparadas;

    },


    // =====================================================
    // SELECCIONAR NUEVAS FOTOS
    // =====================================================

    manejarArchivo(event) {

      const nuevos =
        Array.from(
          event.target.files
          ||
          []
        );


      const nuevosPreparados =
        nuevos.map(
          file => ({

            file,

            preview:
              URL.createObjectURL(file),

            pieImagen:
              ""

          })
        );


      this.archivos = [
        ...this.archivos,
        ...nuevosPreparados
      ];


      event.target.value =
        "";

    },


    quitarArchivo(index) {

      const archivo =
        this.archivos[index];


      if (
        archivo?.preview
        &&
        archivo.preview.startsWith("blob:")
      ) {

        URL.revokeObjectURL(
          archivo.preview
        );

      }


      this.archivos.splice(
        index,
        1
      );

    },


    // =====================================================
    // GUARDAR FOTOS
    // =====================================================

    async guardarFotos() {

      if (
        this.archivos.length === 0
      ) {

        this.mensajeError =
          "Seleccione al menos una fotografía.";

        return;

      }


      this.guardandoFotos =
        true;

      this.mensajeError =
        "";


      try {

        const formData =
          new FormData();


        formData.append(
          "id",
          this.informeSeleccionado
        );


        this.archivos.forEach(
          archivo => {

            formData.append(
              "fotos",
              archivo.file
            );


            formData.append(
              "piesImagen",
              archivo.pieImagen
              ||
              ""
            );

          }
        );


        await guardarFotosFachada(
          formData
        );


        this.liberarPreviewsArchivos();


        this.archivos =
          [];


        await this.cargarFotosInforme();


        this.mensajeExito =
          "Las fotografías fueron guardadas correctamente.";


        setTimeout(
          () => {

            this.mensajeExito =
              "";

          },
          3500
        );


      } catch (error) {

        console.error(
          "Error guardando fotografías:",
          error
        );


        this.mensajeError =
          "No se pudieron guardar las fotografías.";

      } finally {

        this.guardandoFotos =
          false;

      }

    },


    // =====================================================
    // ELIMINAR FOTO
    // =====================================================

    solicitarEliminarFoto(foto) {

      this.fotoAEliminar =
        foto;

    },


    cancelarEliminarFoto() {

      if (this.fotoEliminando) {
        return;
      }


      this.fotoAEliminar =
        null;

    },


    async confirmarEliminarFoto() {

      if (!this.fotoAEliminar) {
        return;
      }


      const foto =
        this.fotoAEliminar;


      this.fotoEliminando =
        foto.id;


      try {

        await eliminarFotoFachada(
          foto.id
        );


        if (
          foto.src
          &&
          foto.src.startsWith("blob:")
        ) {

          URL.revokeObjectURL(
            foto.src
          );

        }


        this.fotos =
          this.fotos.filter(
            item =>
              item.id !== foto.id
          );


        this.fotoAEliminar =
          null;


        this.mensajeExito =
          "Fotografía eliminada correctamente.";


        setTimeout(
          () => {

            this.mensajeExito =
              "";

          },
          3000
        );


      } catch (error) {

        console.error(
          "Error eliminando fotografía:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar la fotografía.";

      } finally {

        this.fotoEliminando =
          null;

      }

    },


    // =====================================================
    // CERRAR MODAL
    // =====================================================

    cerrarModal() {

      if (this.guardandoFotos) {
        return;
      }


      this.liberarUrlsFotos();

      this.liberarPreviewsArchivos();


      this.isModalOpen =
        false;

      this.archivos =
        [];

      this.fotos =
        [];

      this.informeSeleccionado =
        null;

      this.informeSeleccionadoObjeto =
        null;

      this.fotoAEliminar =
        null;

    },


    liberarUrlsFotos() {

      this.fotos.forEach(
        foto => {

          if (
            foto.src
            &&
            foto.src.startsWith("blob:")
          ) {

            URL.revokeObjectURL(
              foto.src
            );

          }

        }
      );

    },


    liberarPreviewsArchivos() {

      this.archivos.forEach(
        archivo => {

          if (
            archivo.preview
            &&
            archivo.preview.startsWith("blob:")
          ) {

            URL.revokeObjectURL(
              archivo.preview
            );

          }

        }
      );

    },


    // =====================================================
    // ELIMINAR INFORME
    // =====================================================

    solicitarEliminar(informe) {

      this.informeAEliminar =
        informe;

    },


    cancelarEliminar() {

      if (this.eliminandoInforme) {
        return;
      }


      this.informeAEliminar =
        null;

    },


    async confirmarEliminar() {

      if (!this.informeAEliminar) {
        return;
      }


      const informe =
        this.informeAEliminar;


      this.eliminandoInforme =
        true;

      this.mensajeError =
        "";


      try {

        await eliminarInformeFachada(
          informe.id
        );


        this.informeAEliminar =
          null;


        this.mensajeExito =
          `Informe #${informe.id} eliminado correctamente.`;


        await this.cargarInformes();


        setTimeout(
          () => {

            this.mensajeExito =
              "";

          },
          4000
        );


      } catch (error) {

        console.error(
          "Error eliminando informe:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar el informe. Puede tener información relacionada.";

      } finally {

        this.eliminandoInforme =
          false;

      }

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.reports-page {
  min-height: 100vh;

  padding: 34px;

  background:
    linear-gradient(
      135deg,
      #f8fbff 0%,
      #eef4fb 100%
    );

  color: #1e293b;
}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.page-header {
  max-width: 1500px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 28px 30px;

  border: 1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);
}


.page-eyebrow {
  display: block;

  margin-bottom: 5px;

  color: #2563eb;

  font-size: 0.68rem;

  font-weight: 800;

  letter-spacing: 0.15em;
}


.page-header h1 {
  margin: 0;

  color: #123b6d;

  font-size: 2rem;

  font-weight: 800;
}


.page-header p {
  max-width: 720px;

  margin: 7px 0 0;

  color: #64748b;

  font-size: 0.87rem;

  line-height: 1.55;
}


/* ========================================================= */
/* BOTONES GENERALES */
/* ========================================================= */

.primary-button,
.secondary-button,
.danger-button,
.refresh-button {
  min-height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding: 0 15px;

  border-radius: 10px;

  font-size: 0.75rem;

  font-weight: 800;

  cursor: pointer;
}


.primary-button {
  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;
}


.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
}


.secondary-button {
  border: 1px solid #d8e0ea;

  background: #ffffff;

  color: #475569;
}


.danger-button {
  border: 1px solid #dc2626;

  background: #dc2626;

  color: #ffffff;
}


button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* ========================================================= */
/* RESUMEN */
/* ========================================================= */

.summary-grid {
  max-width: 1500px;

  margin: 0 auto 22px;

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 14px;
}


.summary-card {
  min-height: 105px;

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 20px;

  border: 1px solid #e2e8f0;

  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 6px 18px
    rgba(15, 23, 42, 0.04);
}


.summary-icon {
  width: 52px;
  height: 52px;

  min-width: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  font-size: 1.25rem;
}


.summary-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}


.summary-icon.green {
  background: #ecfdf3;
  color: #16a34a;
}


.summary-icon.purple {
  background: #f5f3ff;
  color: #7c3aed;
}


.summary-card span {
  display: block;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 600;
}


.summary-card strong {
  display: block;

  margin-top: 2px;

  color: #172033;

  font-size: 1.4rem;

  font-weight: 800;
}


/* ========================================================= */
/* PANEL */
/* ========================================================= */

.reports-panel {
  max-width: 1500px;

  margin: 0 auto;

  padding: 25px;

  border: 1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);
}


.panel-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 18px;
}


.panel-header h2 {
  margin: 0;

  color: #172033;

  font-size: 1.15rem;

  font-weight: 800;
}


.panel-header p {
  margin: 4px 0 0;

  color: #94a3b8;

  font-size: 0.72rem;
}


.refresh-button {
  border: 1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;
}


/* ========================================================= */
/* BÚSQUEDA */
/* ========================================================= */

.filters {
  margin-bottom: 20px;
}


.search-box {
  position: relative;
}


.search-box > i {
  position: absolute;

  top: 50%;
  left: 14px;

  transform: translateY(-50%);

  color: #94a3b8;
}


.search-box input {
  width: 100%;
  height: 43px;

  padding: 0 42px 0 40px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  color: #334155;

  outline: none;

  font-size: 0.78rem;
}


.search-box input:focus {
  border-color: #93b4ed;

  background: #ffffff;

  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.06);
}


.clear-search {
  position: absolute;

  top: 50%;
  right: 7px;

  width: 29px;
  height: 29px;

  transform: translateY(-50%);

  border: none;

  background: transparent;

  color: #94a3b8;
}


/* ========================================================= */
/* TABLA */
/* ========================================================= */

.table-wrapper {
  overflow-x: auto;

  border: 1px solid #e8edf3;

  border-radius: 13px;
}


.reports-table {
  width: 100%;

  min-width: 1000px;

  border-collapse: collapse;
}


.reports-table th {
  padding: 13px 14px;

  border-bottom: 1px solid #dde5ee;

  background: #f3f7fc;

  color: #53657c;

  font-size: 0.66rem;

  font-weight: 800;

  text-align: left;

  text-transform: uppercase;

  white-space: nowrap;
}


.reports-table td {
  padding: 14px;

  border-bottom: 1px solid #edf1f5;

  color: #475569;

  font-size: 0.74rem;

  vertical-align: middle;
}


.reports-table tbody tr:hover {
  background: #fafcff;
}


.sortable {
  cursor: pointer;

  user-select: none;
}


.sort-neutral {
  color: #cbd5e1;
}


.sort-active {
  color: #2563eb;
}


.id-column {
  width: 50px;
}


.actions-column {
  width: 300px;

  text-align: center !important;
}


.row-number {
  color: #94a3b8 !important;

  font-weight: 700;
}


/* ========================================================= */
/* CELDAS */
/* ========================================================= */

.report-info {
  display: flex;

  align-items: center;

  gap: 10px;
}


.report-icon {
  width: 39px;
  height: 39px;

  min-width: 39px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #eff6ff;

  color: #2563eb;
}


.report-info strong {
  display: block;

  color: #25364d;

  font-size: 0.79rem;

  font-weight: 800;
}


.report-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.59rem;
}


.frequency-badge,
.order-badge {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 0.64rem;

  font-weight: 700;
}


.frequency-badge {
  background: #f5f3ff;

  color: #7c3aed;
}


.order-badge {
  background: #eff6ff;

  color: #2563eb;
}


.price-cell span {
  color: #15803d;

  font-size: 0.78rem;

  font-weight: 800;
}


.no-data {
  color: #94a3b8;

  font-size: 0.66rem;
}


/* ========================================================= */
/* ACCIONES */
/* ========================================================= */

.actions {
  display: flex;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 6px;
}


.action-button {
  width: 35px;
  height: 35px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 9px;

  background: #ffffff;
}


.action-button.view {
  border: 1px solid #bfdbfe;

  color: #2563eb;
}


.action-button.edit {
  border: 1px solid #bbf7d0;

  color: #16a34a;
}


.action-button.photos {
  border: 1px solid #ddd6fe;

  color: #7c3aed;
}


.action-button.delete {
  border: 1px solid #fecaca;

  color: #dc2626;
}


.documents-button {
  min-height: 35px;

  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 0 9px;

  border: 1px solid #dce4ee;

  border-radius: 9px;

  background: #ffffff;

  color: #475569;

  font-size: 0.62rem;

  font-weight: 700;
}


.dropdown-menu {
  min-width: 250px;

  padding: 8px;

  border: 1px solid #e2e8f0;

  border-radius: 12px;
}


.document-option {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: 10px;

  border-radius: 8px;
}


.document-option i {
  width: 30px;

  font-size: 1rem;

  text-align: center;
}


.document-option strong {
  display: block;

  color: #334155;

  font-size: 0.69rem;
}


.document-option span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.58rem;
}


.pdf-red {
  color: #dc2626;
}


.pdf-blue {
  color: #2563eb;
}


.pdf-purple {
  color: #7c3aed;
}


/* ========================================================= */
/* PAGINACIÓN */
/* ========================================================= */

.table-footer {
  display: grid;

  grid-template-columns:
    1fr auto 1fr;

  align-items: center;

  gap: 15px;

  margin-top: 18px;
}


.page-size,
.pagination-info,
.pagination {
  color: #64748b;

  font-size: 0.69rem;
}


.page-size,
.pagination {
  display: flex;

  align-items: center;

  gap: 8px;
}


.page-size select {
  height: 34px;

  border: 1px solid #dce4ee;

  border-radius: 8px;
}


.pagination {
  justify-content: flex-end;
}


.pagination button {
  width: 34px;
  height: 34px;

  border: 1px solid #dce4ee;

  border-radius: 8px;

  background: #ffffff;

  color: #475569;
}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.message {
  max-width: 1500px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 12px 15px;

  border-radius: 11px;

  font-size: 0.75rem;

  font-weight: 600;
}


.message span {
  flex: 1;
}


.success-message {
  border: 1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;
}


.error-message {
  border: 1px solid #fecaca;

  background: #fef2f2;

  color: #b91c1c;
}


/* ========================================================= */
/* LOADING / EMPTY */
/* ========================================================= */

.loading-state,
.empty-state {
  min-height: 280px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  text-align: center;
}


.empty-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 1.4rem;
}


/* ========================================================= */
/* MODAL FOTOS */
/* ========================================================= */

.modal-backdrop-custom {
  position: fixed;

  inset: 0;

  z-index: 5000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(15, 23, 42, 0.65);

  backdrop-filter: blur(5px);
}


.photos-modal {
  width: 100%;

  max-width: 1100px;

  max-height: 92vh;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 30px 80px
    rgba(15, 23, 42, 0.3);
}


.photos-modal-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 21px 24px;

  border-bottom: 1px solid #e8edf3;
}


.modal-eyebrow {
  display: block;

  color: #7c3aed;

  font-size: 0.58rem;

  font-weight: 900;

  letter-spacing: 0.1em;
}


.photos-modal-header h3 {
  margin: 3px 0 0;

  color: #172033;

  font-size: 1.05rem;

  font-weight: 800;
}


.photos-modal-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.65rem;
}


.close-modal-button {
  width: 38px;
  height: 38px;

  border: 1px solid #e2e8f0;

  border-radius: 9px;

  background: #f8fafc;

  color: #64748b;
}


.photos-modal-body {
  flex: 1;

  overflow-y: auto;

  padding: 23px;
}


.photos-section + .photos-section {
  margin-top: 28px;

  padding-top: 25px;

  border-top: 1px solid #edf1f5;
}


.photos-section-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 15px;
}


.photos-section-header h4 {
  margin: 0;

  color: #334155;

  font-size: 0.88rem;

  font-weight: 800;
}


.photos-section-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.64rem;
}


.photo-count {
  padding: 5px 8px;

  border-radius: 999px;

  background: #f1f5f9;

  color: #64748b;

  font-size: 0.61rem;

  font-weight: 700;
}


/* ========================================================= */
/* FOTOS EXISTENTES */
/* ========================================================= */

.photos-grid,
.new-photos-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 14px;
}


.photo-card,
.new-photo-card {
  overflow: hidden;

  border: 1px solid #e2e8f0;

  border-radius: 13px;

  background: #ffffff;
}


.photo-image-container {
  position: relative;

  height: 175px;

  overflow: hidden;

  background: #f1f5f9;
}


.photo-preview {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}


.photo-placeholder {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #94a3b8;

  font-size: 1.7rem;
}


.delete-photo-button {
  position: absolute;

  top: 9px;
  right: 9px;

  width: 33px;
  height: 33px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid rgba(255,255,255,0.7);

  border-radius: 9px;

  background: rgba(255,255,255,0.92);

  color: #dc2626;

  box-shadow:
    0 4px 10px
    rgba(15,23,42,0.15);
}


.photo-details {
  padding: 11px;
}


.photo-details strong {
  display: block;

  overflow: hidden;

  color: #334155;

  font-size: 0.68rem;

  white-space: nowrap;

  text-overflow: ellipsis;
}


.photo-details p,
.photo-details span {
  display: block;

  margin: 5px 0 0;

  color: #64748b;

  font-size: 0.62rem;

  line-height: 1.4;
}


.photos-empty {
  min-height: 180px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border: 1px dashed #cbd5e1;

  border-radius: 12px;

  background: #f8fafc;

  text-align: center;
}


.photos-empty div {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 1.2rem;
}


.photos-empty strong {
  color: #475569;

  font-size: 0.73rem;
}


.photos-empty span {
  color: #94a3b8;

  font-size: 0.63rem;
}


/* ========================================================= */
/* NUEVAS FOTOS */
/* ========================================================= */

.photo-upload-zone {
  min-height: 100px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 13px;

  padding: 17px;

  border: 1px dashed #c4b5fd;

  border-radius: 12px;

  background: #faf9ff;

  cursor: pointer;
}


.upload-icon {
  width: 45px;
  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background: #ede9fe;

  color: #7c3aed;

  font-size: 1.1rem;
}


.photo-upload-zone strong {
  display: block;

  color: #4c3a7a;

  font-size: 0.73rem;
}


.photo-upload-zone span {
  display: block;

  margin-top: 2px;

  color: #8b7ea8;

  font-size: 0.61rem;
}


.new-photos-grid {
  margin-top: 14px;
}


.new-photo-preview {
  position: relative;

  height: 150px;

  overflow: hidden;

  background: #f1f5f9;
}


.new-photo-preview img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.remove-new-photo {
  position: absolute;

  top: 8px;
  right: 8px;

  width: 31px;
  height: 31px;

  border: none;

  border-radius: 8px;

  background: rgba(255,255,255,0.92);

  color: #dc2626;
}


.new-photo-info {
  padding: 10px;
}


.new-photo-info strong {
  display: block;

  overflow: hidden;

  color: #334155;

  font-size: 0.67rem;

  white-space: nowrap;

  text-overflow: ellipsis;
}


.new-photo-info > span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.58rem;
}


.new-photo-info textarea {
  width: 100%;

  min-height: 60px;

  margin-top: 9px;

  padding: 8px;

  border: 1px solid #dce4ee;

  border-radius: 8px;

  resize: vertical;

  font-size: 0.66rem;

  outline: none;
}


.new-photo-info small {
  display: block;

  margin-top: 3px;

  color: #94a3b8;

  font-size: 0.55rem;

  text-align: right;
}


/* ========================================================= */
/* FOOTER MODAL */
/* ========================================================= */

.photos-modal-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding: 15px 23px;

  border-top: 1px solid #e8edf3;

  background: #fbfdff;
}


.pending-upload {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  color: #7c3aed;

  font-size: 0.65rem;

  font-weight: 700;
}


.modal-footer-actions {
  display: flex;

  gap: 8px;
}


.photos-loading {
  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color: #64748b;

  font-size: 0.7rem;
}


/* ========================================================= */
/* CONFIRMACIÓN */
/* ========================================================= */

.delete-modal,
.delete-photo-modal {
  width: 100%;

  max-width: 430px;

  padding: 28px;

  border-radius: 18px;

  background: #ffffff;

  text-align: center;

  box-shadow:
    0 25px 70px
    rgba(15,23,42,0.25);
}


.delete-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: 0 auto 14px;

  border-radius: 50%;

  background: #fef2f2;

  color: #dc2626;

  font-size: 1.35rem;
}


.delete-modal h3,
.delete-photo-modal h3 {
  margin: 0;

  color: #172033;

  font-size: 1rem;
}


.delete-modal p,
.delete-photo-modal p {
  margin: 10px 0;

  color: #64748b;

  font-size: 0.72rem;
}


.delete-warning {
  display: block;

  color: #dc2626;

  font-size: 0.65rem;

  font-weight: 700;
}


.confirmation-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 22px;
}


/*
 * Este segundo backdrop queda encima del modal
 * de fotografías cuando se elimina una foto.
 */
.photo-confirm-backdrop {
  position: fixed;

  inset: 0;

  z-index: 6000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(15,23,42,0.68);

  backdrop-filter: blur(5px);
}


/* ========================================================= */
/* ANIMACIÓN */
/* ========================================================= */

.rotating {
  animation:
    rotation
    1s linear infinite;
}


@keyframes rotation {

  to {
    transform: rotate(360deg);
  }

}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 950px) {

  .photos-grid,
  .new-photos-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}


@media (max-width: 800px) {

  .summary-grid {
    grid-template-columns: 1fr;
  }


  .table-footer {
    grid-template-columns: 1fr;

    justify-items: center;
  }


  .pagination {
    justify-content: center;
  }

}


@media (max-width: 650px) {

  .reports-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .page-header .primary-button {
    width: 100%;
  }


  .photos-modal {
    max-height: 95vh;
  }


  .photos-grid,
  .new-photos-grid {
    grid-template-columns: 1fr;
  }


  .photos-modal-footer {
    flex-direction: column;

    align-items: stretch;
  }


  .modal-footer-actions {
    display: grid;

    grid-template-columns: 1fr;
  }


  .modal-footer-actions button {
    width: 100%;
  }

}

</style>