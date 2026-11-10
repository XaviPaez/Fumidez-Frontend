<template>
  <div class="orders-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>
        <span class="page-eyebrow">
          OPERACIONES
        </span>

        <h1>
          Órdenes de Trabajo
        </h1>

        <p>
          Consulta, gestiona y da seguimiento al ciclo operativo
          de los servicios realizados por Fumidez.
        </p>
      </div>


      <div class="header-actions">

        <button
          type="button"
          class="excel-button"
          :disabled="ordenesTrabajo.length === 0"
          @click="exportarExcel"
        >
          <i class="bi bi-file-earmark-excel"></i>
          Exportar Excel
        </button>


        <button
          type="button"
          class="primary-button"
          @click="redirigirCrearOrden"
        >
          <i class="bi bi-plus-lg"></i>
          Nueva orden
        </button>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- RESUMEN -->
    <!-- ===================================================== -->

    <section class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon blue">
          <i class="bi bi-clipboard-data"></i>
        </div>

        <div>
          <span>Total órdenes</span>
          <strong>{{ ordenesTrabajo.length }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon light-blue">
          <i class="bi bi-clock"></i>
        </div>

        <div>
          <span>Pendientes</span>
          <strong>{{ totalPendientes }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon orange">
          <i class="bi bi-arrow-repeat"></i>
        </div>

        <div>
          <span>En proceso</span>
          <strong>{{ totalEnProceso }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon green">
          <i class="bi bi-check-circle"></i>
        </div>

        <div>
          <span>Finalizadas</span>
          <strong>{{ totalFinalizadas }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon red">
          <i class="bi bi-x-circle"></i>
        </div>

        <div>
          <span>Canceladas</span>
          <strong>{{ totalCanceladas }}</strong>
        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- ALERTA PENDIENTES -->
    <!-- ===================================================== -->

    <section
      v-if="totalPendientes > 0"
      class="pending-alert"
    >

      <div class="pending-alert-icon">
        <i class="bi bi-clock-fill"></i>
      </div>


      <div class="pending-alert-content">

        <span class="pending-alert-eyebrow">
          SERVICIOS PENDIENTES
        </span>

        <strong>
          {{
            totalPendientes === 1
              ? "Hay 1 orden pendiente"
              : `Hay ${totalPendientes} órdenes pendientes`
          }}
        </strong>

        <p>
          Revise la programación y avance de las órdenes
          que todavía no han iniciado.
        </p>

      </div>


      <div class="pending-alert-count">
        {{ totalPendientes }}
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
        @click="cargarOrdenesTrabajo"
      >
        Reintentar
      </button>
    </div>


    <!-- ===================================================== -->
    <!-- PANEL -->
    <!-- ===================================================== -->

    <section class="orders-panel">

      <div class="panel-header">

        <div>
          <h2>
            Listado de órdenes
          </h2>

          <p>
            {{ ordenesFiltradas.length }}
            {{
              ordenesFiltradas.length === 1
                ? "orden encontrada"
                : "órdenes encontradas"
            }}
          </p>
        </div>


        <button
          type="button"
          class="refresh-button"
          :disabled="cargando"
          @click="cargarOrdenesTrabajo"
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
            placeholder="Buscar por número, descripción, área o estado..."
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


        <select
          v-model="filtroEstado"
          class="filter-select"
        >
          <option value="">
            Todos los estados
          </option>

          <option value="PENDIENTE">
            Pendiente
          </option>

          <option value="EN_PROCESO">
            En proceso
          </option>

          <option value="FINALIZADA">
            Finalizada
          </option>

          <option value="CANCELADA">
            Cancelada
          </option>
        </select>


        <button
          v-if="filtro || filtroEstado"
          type="button"
          class="clear-filters-button"
          @click="limpiarFiltros"
        >
          <i class="bi bi-funnel"></i>
          Limpiar
        </button>

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
          Cargando órdenes de trabajo...
        </span>
      </div>


      <!-- ================================================= -->
      <!-- SIN RESULTADOS -->
      <!-- ================================================= -->

      <div
        v-else-if="ordenesFiltradas.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          <i class="bi bi-clipboard"></i>
        </div>


        <h3>
          {{
            ordenesTrabajo.length === 0
              ? "No hay órdenes registradas"
              : "No encontramos órdenes"
          }}
        </h3>


        <p>
          {{
            ordenesTrabajo.length === 0
              ? "Crea la primera orden de trabajo para comenzar a gestionar los servicios."
              : "Prueba cambiando la búsqueda o el filtro de estado."
          }}
        </p>


        <button
          v-if="ordenesTrabajo.length === 0"
          type="button"
          class="primary-button"
          @click="redirigirCrearOrden"
        >
          <i class="bi bi-plus-lg"></i>
          Crear orden
        </button>

      </div>


      <!-- ================================================= -->
      <!-- TABLA -->
      <!-- ================================================= -->

      <template v-else>

        <div class="table-wrapper">

          <table class="orders-table">

            <thead>

              <tr>

                <th class="id-column">
                  #
                </th>


                <th
                  class="sortable"
                  @click="ordenar('fecha')"
                >
                  Fecha
                  <i :class="iconoOrden('fecha')"></i>
                </th>


                <th>
                  Horario
                </th>


                <th
                  class="sortable"
                  @click="ordenar('numeroOrden')"
                >
                  Orden
                  <i :class="iconoOrden('numeroOrden')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('descripcion')"
                >
                  Descripción
                  <i :class="iconoOrden('descripcion')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('area')"
                >
                  Área
                  <i :class="iconoOrden('area')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('estado')"
                >
                  Estado
                  <i :class="iconoOrden('estado')"></i>
                </th>


                <th class="actions-column">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(orden, index) in ordenesPaginadas"
                :key="orden.id"
                :class="claseFilaEstado(orden.estado)"
              >

                <!-- NÚMERO -->

                <td class="row-number">
                  {{ indiceInicial + index + 1 }}
                </td>


                <!-- FECHA -->

                <td>

                  <div class="date-cell">

                    <div class="date-icon">
                      <i class="bi bi-calendar3"></i>
                    </div>

                    <div>
                      <strong>
                        {{ formatearFecha(orden.fecha) }}
                      </strong>

                      <span>
                        ID {{ orden.id }}
                      </span>
                    </div>

                  </div>

                </td>


                <!-- HORARIO -->

                <td>

                  <div class="schedule-cell">

                    <i class="bi bi-clock"></i>

                    <div>
                      <strong>
                        {{ formatearHora(orden.hora) }}
                      </strong>

                      <span>
                        hasta
                        {{ formatearHora(orden.horaFin) }}
                      </span>
                    </div>

                  </div>

                </td>


                <!-- NÚMERO ORDEN -->

                <td>

                  <span class="order-number">
                    <i class="bi bi-clipboard-check"></i>

                    {{
                      orden.numeroOrden
                      || `OT-${orden.id}`
                    }}
                  </span>

                </td>


                <!-- DESCRIPCIÓN -->

                <td>

                  <div class="description-cell">
                    {{
                      orden.descripcion
                      || "Sin descripción"
                    }}
                  </div>

                </td>


                <!-- ÁREA -->

                <td>

                  <span class="area-badge">
                    <i class="bi bi-geo"></i>

                    {{
                      orden.area
                      || "Sin área"
                    }}
                  </span>

                </td>


                <!-- ESTADO -->

                <td>

                  <span
                    class="estado-badge"
                    :class="claseEstado(orden.estado)"
                  >
                    <i :class="iconoEstado(orden.estado)"></i>

                    {{ textoEstado(orden.estado) }}
                  </span>

                </td>


                <!-- ACCIONES -->

                <td>

                  <div class="actions">

                    <!-- VER -->

                    <button
                      type="button"
                      class="action-button view"
                      title="Ver / editar orden"
                      @click="verOrden(orden.id)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>


                    <!-- PDF -->

                    <button
                      type="button"
                      class="action-button pdf"
                      title="Generar PDF"
                      :disabled="ordenGenerandoPdf === orden.id"
                      @click="generatePDF(orden)"
                    >
                      <span
                        v-if="ordenGenerandoPdf === orden.id"
                        class="spinner-border spinner-border-sm"
                      ></span>

                      <i
                        v-else
                        class="bi bi-file-earmark-pdf"
                      ></i>
                    </button>


                    <!-- CAMBIO DE ESTADO -->

                    <div class="dropdown">

                      <button
                        class="status-selector"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="bi bi-arrow-repeat"></i>
                        Estado
                        <i class="bi bi-chevron-down"></i>
                      </button>


                      <ul class="dropdown-menu dropdown-menu-end shadow">

                        <li>

                          <button
                            class="dropdown-item estado-option"
                            :disabled="
                              orden.estado === 'PENDIENTE'
                              ||
                              ordenActualizando === orden.id
                            "
                            @click="
                              solicitarCambioEstado(
                                orden,
                                'PENDIENTE'
                              )
                            "
                          >
                            <span class="estado-dot pendiente"></span>
                            Pendiente
                          </button>

                        </li>


                        <li>

                          <button
                            class="dropdown-item estado-option"
                            :disabled="
                              orden.estado === 'EN_PROCESO'
                              ||
                              ordenActualizando === orden.id
                            "
                            @click="
                              solicitarCambioEstado(
                                orden,
                                'EN_PROCESO'
                              )
                            "
                          >
                            <span class="estado-dot proceso"></span>
                            En proceso
                          </button>

                        </li>


                        <li>

                          <button
                            class="dropdown-item estado-option"
                            :disabled="
                              orden.estado === 'FINALIZADA'
                              ||
                              ordenActualizando === orden.id
                            "
                            @click="
                              solicitarCambioEstado(
                                orden,
                                'FINALIZADA'
                              )
                            "
                          >
                            <span class="estado-dot finalizada"></span>
                            Finalizada
                          </button>

                        </li>


                        <li>
                          <hr class="dropdown-divider">
                        </li>


                        <li>

                          <button
                            class="dropdown-item estado-option text-danger"
                            :disabled="
                              orden.estado === 'CANCELADA'
                              ||
                              ordenActualizando === orden.id
                            "
                            @click="
                              solicitarCambioEstado(
                                orden,
                                'CANCELADA'
                              )
                            "
                          >
                            <span class="estado-dot cancelada"></span>
                            Cancelada
                          </button>

                        </li>

                      </ul>

                    </div>


                    <!-- ELIMINAR -->

                    <button
                      type="button"
                      class="action-button delete"
                      title="Eliminar orden"
                      @click="solicitarEliminar(orden)"
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
              v-model.number="ordenesPorPagina"
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
              {{ ordenesFiltradas.length }}
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
    <!-- MODAL CAMBIO DE ESTADO -->
    <!-- ===================================================== -->

    <div
      v-if="cambioEstadoPendiente"
      class="modal-backdrop-custom"
      @click.self="cancelarCambioEstado"
    >

      <div class="state-modal">

        <div
          class="state-modal-icon"
          :class="
            claseEstadoModal(
              cambioEstadoPendiente.nuevoEstado
            )
          "
        >
          <i
            :class="
              iconoEstado(
                cambioEstadoPendiente.nuevoEstado
              )
            "
          ></i>
        </div>


        <span class="modal-eyebrow">
          CAMBIO DE ESTADO
        </span>


        <h3>
          Cambiar a
          {{
            textoEstado(
              cambioEstadoPendiente.nuevoEstado
            )
          }}
        </h3>


        <p>
          Orden
          <strong>
            {{
              cambioEstadoPendiente.orden.numeroOrden
              || cambioEstadoPendiente.orden.id
            }}
          </strong>
        </p>


        <div class="state-transition">

          <span
            class="estado-badge"
            :class="
              claseEstado(
                cambioEstadoPendiente.orden.estado
              )
            "
          >
            {{
              textoEstado(
                cambioEstadoPendiente.orden.estado
              )
            }}
          </span>


          <i class="bi bi-arrow-right"></i>


          <span
            class="estado-badge"
            :class="
              claseEstado(
                cambioEstadoPendiente.nuevoEstado
              )
            "
          >
            {{
              textoEstado(
                cambioEstadoPendiente.nuevoEstado
              )
            }}
          </span>

        </div>


        <div
          v-if="
            cambioEstadoPendiente.nuevoEstado
            ===
            'CANCELADA'
          "
          class="cancel-warning"
        >
          <i class="bi bi-exclamation-triangle"></i>

          <span>
            La orden será marcada como cancelada.
            Confirma que el servicio no se realizará.
          </span>
        </div>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-button"
            :disabled="ordenActualizando"
            @click="cancelarCambioEstado"
          >
            Cancelar
          </button>


          <button
            type="button"
            class="primary-button"
            :class="{
              'danger-confirm':
                cambioEstadoPendiente.nuevoEstado
                ===
                'CANCELADA'
            }"
            :disabled="ordenActualizando"
            @click="confirmarCambioEstado"
          >

            <span
              v-if="ordenActualizando"
              class="spinner-border spinner-border-sm"
            ></span>

            <i
              v-else
              class="bi bi-check-lg"
            ></i>

            Confirmar

          </button>

        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- MODAL ELIMINAR -->
    <!-- ===================================================== -->

    <div
      v-if="ordenAEliminar"
      class="modal-backdrop-custom"
      @click.self="cancelarEliminar"
    >

      <div class="delete-modal">

        <div class="delete-icon">
          <i class="bi bi-trash3"></i>
        </div>


        <h3>
          ¿Eliminar orden?
        </h3>


        <p>
          Está a punto de eliminar la orden
          <strong>
            {{
              ordenAEliminar.numeroOrden
              || ordenAEliminar.id
            }}
          </strong>.
        </p>


        <span class="delete-warning">
          Esta orden puede tener informes, facturas,
          fotografías u otros registros relacionados.
        </span>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-button"
            :disabled="eliminando"
            @click="cancelarEliminar"
          >
            Cancelar
          </button>


          <button
            type="button"
            class="delete-confirm-button"
            :disabled="eliminando"
            @click="confirmarEliminar"
          >

            <span
              v-if="eliminando"
              class="spinner-border spinner-border-sm"
            ></span>

            <i
              v-else
              class="bi bi-trash3"
            ></i>

            {{
              eliminando
                ? "Eliminando..."
                : "Eliminar"
            }}

          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script>
import {
  generatePDFOrdenFachada
} from "../helpers/generarOrdenPdf";

import {
  actualizarOrdenEstadoFachada,
  buscarOrdenPorId,
  consultarOrdenFachada,
  eliminarOrdenFachada
} from "../helpers/OrdenTrabajoHelper";

import * as XLSX from "xlsx";

import {
  saveAs
} from "file-saver";


export default {

  name: "OrdenTrabajo",


  data() {

    return {

      ordenesTrabajo: [],

      filtro: "",

      filtroEstado: "",

      paginaActual: 1,

      ordenesPorPagina: 10,

      columnaOrdenada: "fecha",

      ordenAscendente: false,

      cargando: false,

      ordenActualizando: null,

      ordenGenerandoPdf: null,

      eliminando: false,

      cambioEstadoPendiente: null,

      ordenAEliminar: null,

      mensajeExito: "",

      mensajeError: ""

    };

  },


  computed: {

    // =====================================================
    // RESUMEN
    // =====================================================

    totalPendientes() {

      return this.contarEstado(
        "PENDIENTE"
      );

    },


    totalEnProceso() {

      return this.contarEstado(
        "EN_PROCESO"
      );

    },


    totalFinalizadas() {

      return this.contarEstado(
        "FINALIZADA"
      );

    },


    totalCanceladas() {

      return this.contarEstado(
        "CANCELADA"
      );

    },


    // =====================================================
    // FILTROS
    // =====================================================

    ordenesFiltradas() {

      const texto =
        this.normalizarTexto(
          this.filtro
        );


      return this.ordenesTrabajo.filter(
        orden => {

          const coincideEstado =
            !this.filtroEstado
            ||
            orden.estado ===
            this.filtroEstado;


          if (!coincideEstado) {
            return false;
          }


          if (!texto) {
            return true;
          }


          const contenido =
            this.normalizarTexto(
              [
                orden.numeroOrden,
                orden.descripcion,
                orden.area,
                orden.estado,
                orden.id
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

    ordenesOrdenadas() {

      const lista =
        [...this.ordenesFiltradas];


      return lista.sort(
        (a, b) => {

          let valorA =
            a[this.columnaOrdenada];

          let valorB =
            b[this.columnaOrdenada];


          if (
            this.columnaOrdenada === "fecha"
          ) {

            valorA =
              valorA
                ? new Date(valorA).getTime()
                : 0;

            valorB =
              valorB
                ? new Date(valorB).getTime()
                : 0;

          } else if (
            this.columnaOrdenada === "id"
          ) {

            valorA =
              Number(valorA || 0);

            valorB =
              Number(valorB || 0);

          } else {

            valorA =
              this.normalizarTexto(valorA);

            valorB =
              this.normalizarTexto(valorB);

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
          this.ordenesOrdenadas.length
          /
          this.ordenesPorPagina
        )
      );

    },


    indiceInicial() {

      return (
        (this.paginaActual - 1)
        *
        this.ordenesPorPagina
      );

    },


    indiceFinal() {

      return Math.min(
        this.indiceInicial
        +
        this.ordenesPorPagina,
        this.ordenesFiltradas.length
      );

    },


    ordenesPaginadas() {

      return this.ordenesOrdenadas.slice(
        this.indiceInicial,
        this.indiceFinal
      );

    }

  },


  watch: {

    filtro() {

      this.paginaActual = 1;

    },


    filtroEstado() {

      this.paginaActual = 1;

    },


    totalPaginas(nuevoTotal) {

      if (
        this.paginaActual
        >
        nuevoTotal
      ) {

        this.paginaActual =
          nuevoTotal;

      }

    }

  },


  mounted() {

    this.cargarOrdenesTrabajo();

  },


  methods: {

    // =====================================================
    // CARGAR
    // =====================================================

    async cargarOrdenesTrabajo() {

      this.cargando =
        true;

      this.mensajeError =
        "";


      try {

        const response =
          await consultarOrdenFachada();


        this.ordenesTrabajo =
          Array.isArray(response)
            ? response
            : [];


      } catch (error) {

        console.error(
          "Error cargando órdenes:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el listado de órdenes de trabajo.";

      } finally {

        this.cargando =
          false;

      }

    },


    // =====================================================
    // RESUMEN
    // =====================================================

    contarEstado(estado) {

      return this.ordenesTrabajo.filter(
        orden =>
          orden.estado === estado
      ).length;

    },


    // =====================================================
    // ESTADOS
    // =====================================================

    textoEstado(estado) {

      const estados = {
        PENDIENTE:
          "Pendiente",

        EN_PROCESO:
          "En proceso",

        FINALIZADA:
          "Finalizada",

        CANCELADA:
          "Cancelada"
      };


      return estados[estado]
        ||
        "Sin estado";

    },


    claseEstado(estado) {

      const clases = {
        PENDIENTE:
          "estado-pendiente",

        EN_PROCESO:
          "estado-proceso",

        FINALIZADA:
          "estado-finalizada",

        CANCELADA:
          "estado-cancelada"
      };


      return clases[estado]
        ||
        "estado-desconocido";

    },


    iconoEstado(estado) {

      const iconos = {
        PENDIENTE:
          "bi bi-clock",

        EN_PROCESO:
          "bi bi-arrow-repeat",

        FINALIZADA:
          "bi bi-check-circle",

        CANCELADA:
          "bi bi-x-circle"
      };


      return iconos[estado]
        ||
        "bi bi-question-circle";

    },


    claseFilaEstado(estado) {

      return {
        "row-pending":
          estado === "PENDIENTE",

        "row-process":
          estado === "EN_PROCESO",

        "row-finished":
          estado === "FINALIZADA",

        "row-cancelled":
          estado === "CANCELADA"
      };

    },


    claseEstadoModal(estado) {

      switch (estado) {

        case "PENDIENTE":
          return "modal-pending";

        case "EN_PROCESO":
          return "modal-process";

        case "FINALIZADA":
          return "modal-finished";

        case "CANCELADA":
          return "modal-cancelled";

        default:
          return "";
      }

    },


    solicitarCambioEstado(
      orden,
      nuevoEstado
    ) {

      if (
        orden.estado
        ===
        nuevoEstado
      ) {
        return;
      }


      this.cambioEstadoPendiente = {
        orden,
        nuevoEstado
      };

    },


    cancelarCambioEstado() {

      if (this.ordenActualizando) {
        return;
      }


      this.cambioEstadoPendiente =
        null;

    },


    async confirmarCambioEstado() {

      const cambio =
        this.cambioEstadoPendiente;


      if (!cambio) {
        return;
      }


      const orden =
        cambio.orden;


      const nuevoEstado =
        cambio.nuevoEstado;


      const estadoAnterior =
        orden.estado;


      this.ordenActualizando =
        orden.id;


      this.mensajeError =
        "";


      try {

        await actualizarOrdenEstadoFachada(
          orden.id,
          {
            estado:
              nuevoEstado
          }
        );


        orden.estado =
          nuevoEstado;


        this.cambioEstadoPendiente =
          null;


        this.mensajeExito =
          `Orden ${
            orden.numeroOrden
            ||
            orden.id
          }: estado actualizado a ${
            this.textoEstado(
              nuevoEstado
            )
          }.`;


        setTimeout(
          () => {

            this.mensajeExito =
              "";

          },
          3500
        );


      } catch (error) {

        orden.estado =
          estadoAnterior;


        console.error(
          "Error actualizando estado:",
          error
        );


        this.mensajeError =
          "No se pudo actualizar el estado de la orden.";

      } finally {

        this.ordenActualizando =
          null;

      }

    },


    // =====================================================
    // PDF
    // =====================================================

    async generatePDF(ordenTrabajo) {

      this.ordenGenerandoPdf =
        ordenTrabajo.id;


      this.mensajeError =
        "";


      try {

        const orden =
          await buscarOrdenPorId(
            ordenTrabajo.id
          );


        await generatePDFOrdenFachada(
          orden
        );


      } catch (error) {

        console.error(
          "Error generando PDF:",
          error
        );


        this.mensajeError =
          "No se pudo generar el PDF de la orden.";

      } finally {

        this.ordenGenerandoPdf =
          null;

      }

    },


    // =====================================================
    // EXCEL
    // =====================================================

    exportarExcel() {

      if (
        this.ordenesTrabajo.length
        ===
        0
      ) {

        return;

      }


      const data =
        this.ordenesTrabajo.map(
          orden => ({
            "ID":
              orden.id,

            "Número Orden":
              orden.numeroOrden,

            "Fecha":
              this.formatearFecha(
                orden.fecha
              ),

            "Hora Inicio":
              orden.hora,

            "Hora Fin":
              orden.horaFin,

            "Descripción":
              orden.descripcion,

            "Área":
              orden.area,

            "Estado":
              this.textoEstado(
                orden.estado
              )
          })
        );


      const worksheet =
        XLSX.utils.json_to_sheet(
          data
        );


      const workbook =
        XLSX.utils.book_new();


      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Ordenes"
      );


      const excelBuffer =
        XLSX.write(
          workbook,
          {
            bookType:
              "xlsx",

            type:
              "array"
          }
        );


      const archivo =
        new Blob(
          [excelBuffer],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }
        );


      saveAs(
        archivo,
        "OrdenesTrabajo.xlsx"
      );

    },


    // =====================================================
    // FORMATO
    // =====================================================

formatearFecha(fecha) {

  if (!fecha) {
    return "Sin fecha";
  }

  try {

    /*
     * Tomamos solamente la parte YYYY-MM-DD.
     *
     * Ejemplos aceptados:
     * 2026-09-19
     * 2026-09-19T00:00:00.000+00:00
     */
    const fechaTexto =
      String(fecha).substring(0, 10);


    const partes =
      fechaTexto.split("-");


    if (partes.length !== 3) {
      return "Fecha inválida";
    }


    const anio =
      Number(partes[0]);

    const mes =
      Number(partes[1]);

    const dia =
      Number(partes[2]);


    if (
      Number.isNaN(anio) ||
      Number.isNaN(mes) ||
      Number.isNaN(dia)
    ) {
      return "Fecha inválida";
    }


    /*
     * Creamos la fecha como fecha LOCAL.
     *
     * IMPORTANTE:
     * mes - 1 porque JavaScript usa:
     * enero = 0
     * febrero = 1
     * ...
     */
    const date =
      new Date(
        anio,
        mes - 1,
        dia
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Fecha inválida";
    }


    return new Intl.DateTimeFormat(
      "es-EC",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    ).format(date);


  } catch (error) {

    console.error(
      "Error formateando fecha:",
      fecha,
      error
    );

    return "Fecha inválida";
  }
},

    formatearHora(hora) {

      if (!hora) {

        return "--:--";

      }


      return String(hora)
        .substring(
          0,
          5
        );

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
    // FILTROS
    // =====================================================

    limpiarFiltros() {

      this.filtro =
        "";

      this.filtroEstado =
        "";

      this.paginaActual =
        1;

    },


    // =====================================================
    // ORDENAR
    // =====================================================

    ordenar(columna) {

      if (
        this.columnaOrdenada
        ===
        columna
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
        this.columnaOrdenada
        !==
        columna
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
        nuevaPagina
        <=
        this.totalPaginas
      ) {

        this.paginaActual =
          nuevaPagina;

      }

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirCrearOrden() {

      this.$router.push(
        "/orden_trabajo_registro"
      );

    },


    verOrden(id) {

      this.$router.push(
        `/orden_trabajo_ver/${id}`
      );

    },


    // =====================================================
    // ELIMINAR
    // =====================================================

    solicitarEliminar(orden) {

      this.ordenAEliminar =
        orden;

    },


    cancelarEliminar() {

      if (this.eliminando) {

        return;

      }


      this.ordenAEliminar =
        null;

    },


    async confirmarEliminar() {

      if (!this.ordenAEliminar) {

        return;

      }


      this.eliminando =
        true;


      this.mensajeError =
        "";


      try {

        const orden =
          this.ordenAEliminar;


        await eliminarOrdenFachada(
          orden.id
        );


        const numero =
          orden.numeroOrden
          ||
          orden.id;


        this.ordenAEliminar =
          null;


        this.mensajeExito =
          `Orden ${numero} eliminada correctamente.`;


        await this.cargarOrdenesTrabajo();


        setTimeout(
          () => {

            this.mensajeExito =
              "";

          },
          4000
        );


      } catch (error) {

        console.error(
          "Error eliminando orden:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar la orden. Puede tener informes, facturas u otros registros relacionados.";

      } finally {

        this.eliminando =
          false;

      }

    }

  }

};
</script>


<style scoped>

.orders-page {
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
  max-width: 1600px;

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


.header-actions {
  display: flex;

  align-items: center;

  gap: 9px;
}


/* ========================================================= */
/* BOTONES */
/* ========================================================= */

.primary-button,
.secondary-button,
.excel-button,
.refresh-button,
.delete-confirm-button {
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


.excel-button {
  border: 1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;
}


.excel-button:hover:not(:disabled) {
  background: #dcfce7;
}


.delete-confirm-button {
  border: 1px solid #dc2626;

  background: #dc2626;

  color: #ffffff;
}


.danger-confirm {
  border-color: #dc2626 !important;

  background: #dc2626 !important;
}


/* ========================================================= */
/* SUMMARY */
/* ========================================================= */

.summary-grid {
  max-width: 1600px;

  margin: 0 auto 22px;

  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

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
  width: 50px;
  height: 50px;

  min-width: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  font-size: 1.2rem;
}


.summary-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}


.summary-icon.light-blue {
  background: #eef4ff;
  color: #2563eb;
}


.summary-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}


.summary-icon.green {
  background: #ecfdf3;
  color: #16a34a;
}


.summary-icon.red {
  background: #fef2f2;
  color: #dc2626;
}


.summary-card span {
  display: block;

  color: #64748b;

  font-size: 0.7rem;

  font-weight: 600;
}


.summary-card strong {
  display: block;

  margin-top: 2px;

  color: #172033;

  font-size: 1.45rem;

  font-weight: 800;
}


/* ========================================================= */
/* ALERTA */
/* ========================================================= */

.pending-alert {
  max-width: 1600px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 17px 20px;

  border: 1px solid #bfdbfe;

  border-radius: 15px;

  background: #f8fbff;
}


.pending-alert-icon {
  width: 47px;
  height: 47px;

  min-width: 47px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #dbeafe;

  color: #2563eb;

  font-size: 1.15rem;
}


.pending-alert-content {
  flex: 1;
}


.pending-alert-eyebrow {
  display: block;

  color: #2563eb;

  font-size: 0.58rem;

  font-weight: 900;

  letter-spacing: 0.1em;
}


.pending-alert-content strong {
  display: block;

  color: #1e40af;

  font-size: 0.82rem;
}


.pending-alert-content p {
  margin: 3px 0 0;

  color: #475569;

  font-size: 0.68rem;
}


.pending-alert-count {
  width: 39px;
  height: 39px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #2563eb;

  color: white;

  font-weight: 900;
}


/* ========================================================= */
/* PANEL */
/* ========================================================= */

.orders-panel {
  max-width: 1600px;

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
/* FILTROS */
/* ========================================================= */

.filters {
  display: grid;

  grid-template-columns:
    minmax(280px, 1fr)
    200px
    auto;

  gap: 10px;

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


.search-box input,
.filter-select {
  width: 100%;

  height: 43px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  color: #334155;

  font-size: 0.78rem;

  outline: none;
}


.search-box input {
  padding: 0 42px 0 40px;
}


.filter-select {
  padding: 0 11px;
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


.clear-filters-button {
  min-height: 43px;

  padding: 0 12px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 700;
}


/* ========================================================= */
/* TABLA */
/* ========================================================= */

.table-wrapper {
  overflow-x: auto;

  border: 1px solid #e8edf3;

  border-radius: 13px;
}


.orders-table {
  width: 100%;

  min-width: 1350px;

  border-collapse: collapse;
}


.orders-table th {
  padding: 13px 14px;

  border-bottom: 1px solid #dde5ee;

  background: #f3f7fc;

  color: #53657c;

  font-size: 0.65rem;

  font-weight: 800;

  text-align: left;

  text-transform: uppercase;

  white-space: nowrap;
}


.orders-table td {
  padding: 14px;

  border-bottom: 1px solid #edf1f5;

  color: #475569;

  font-size: 0.73rem;

  vertical-align: middle;
}


.orders-table tbody tr:hover {
  background: #fafcff;
}


.row-pending {
  background: #fbfdff;
}


.row-process {
  background: #fffdf9;
}


.row-finished {
  background: #fbfffc;
}


.row-cancelled {
  background: #fffafa;
}


.sortable {
  cursor: pointer;
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
  width: 245px;

  text-align: center !important;
}


.row-number {
  color: #94a3b8 !important;

  font-weight: 700;
}


/* ========================================================= */
/* CELDAS */
/* ========================================================= */

.date-cell,
.schedule-cell {
  display: flex;

  align-items: center;

  gap: 9px;
}


.date-icon {
  width: 36px;
  height: 36px;

  min-width: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 9px;

  background: #eff6ff;

  color: #2563eb;
}


.date-cell strong,
.schedule-cell strong {
  display: block;

  color: #334155;

  font-size: 0.73rem;
}


.date-cell span,
.schedule-cell span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.59rem;
}


.schedule-cell > i {
  color: #94a3b8;
}


.order-number,
.area-badge {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 0.63rem;

  font-weight: 700;

  white-space: nowrap;
}


.order-number {
  background: #eff6ff;

  color: #2563eb;
}


.area-badge {
  background: #f1f5f9;

  color: #475569;
}


.description-cell {
  max-width: 270px;

  overflow: hidden;

  color: #475569;

  white-space: nowrap;

  text-overflow: ellipsis;
}


/* ========================================================= */
/* ESTADOS */
/* ========================================================= */

.estado-badge {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 6px 9px;

  border-radius: 999px;

  font-size: 0.63rem;

  font-weight: 800;

  white-space: nowrap;
}


.estado-pendiente {
  border: 1px solid #bfdbfe;

  background: #eef4ff;

  color: #2563eb;
}


.estado-proceso {
  border: 1px solid #fed7aa;

  background: #fff7e6;

  color: #d97706;
}


.estado-finalizada {
  border: 1px solid #bbf7d0;

  background: #ecfdf3;

  color: #15803d;
}


.estado-cancelada {
  border: 1px solid #fecdd3;

  background: #fff1f2;

  color: #dc2626;
}


.estado-desconocido {
  border: 1px solid #d1d5db;

  background: #f3f4f6;

  color: #6b7280;
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


.action-button.pdf {
  border: 1px solid #fecaca;

  color: #dc2626;
}


.action-button.delete {
  border: 1px solid #fecaca;

  color: #dc2626;
}


.status-selector {
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
  min-width: 190px;

  padding: 8px;

  border: 1px solid #e2e8f0;

  border-radius: 12px;
}


.estado-option {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 9px 12px;

  border-radius: 8px;

  font-size: 0.72rem;
}


.estado-option:hover {
  background: #f4f7fb;
}


.estado-option:disabled {
  opacity: 0.45;
}


.estado-dot {
  width: 9px;
  height: 9px;

  display: inline-block;

  border-radius: 50%;
}


.estado-dot.pendiente {
  background: #2563eb;
}


.estado-dot.proceso {
  background: #f59e0b;
}


.estado-dot.finalizada {
  background: #16a34a;
}


.estado-dot.cancelada {
  background: #dc2626;
}


/* ========================================================= */
/* FOOTER */
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
  max-width: 1600px;

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
/* MODALES */
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
    rgba(15, 23, 42, 0.62);

  backdrop-filter: blur(5px);
}


.state-modal,
.delete-modal {
  width: 100%;

  max-width: 440px;

  padding: 28px;

  border-radius: 18px;

  background: #ffffff;

  text-align: center;

  box-shadow:
    0 25px 70px
    rgba(15, 23, 42, 0.25);
}


.state-modal-icon,
.delete-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: 0 auto 13px;

  border-radius: 50%;

  font-size: 1.35rem;
}


.modal-pending {
  background: #eff6ff;

  color: #2563eb;
}


.modal-process {
  background: #fff7ed;

  color: #ea580c;
}


.modal-finished {
  background: #ecfdf3;

  color: #16a34a;
}


.modal-cancelled,
.delete-icon {
  background: #fef2f2;

  color: #dc2626;
}


.modal-eyebrow {
  display: block;

  color: #94a3b8;

  font-size: 0.58rem;

  font-weight: 900;

  letter-spacing: 0.1em;
}


.state-modal h3,
.delete-modal h3 {
  margin: 4px 0 0;

  color: #172033;

  font-size: 1.05rem;
}


.state-modal p,
.delete-modal p {
  margin: 10px 0;

  color: #64748b;

  font-size: 0.75rem;
}


.state-transition {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin: 18px 0;
}


.state-transition > i {
  color: #94a3b8;
}


.cancel-warning {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-top: 14px;

  padding: 11px;

  border: 1px solid #fecaca;

  border-radius: 9px;

  background: #fef2f2;

  color: #b91c1c;

  font-size: 0.65rem;

  text-align: left;
}


.delete-warning {
  display: block;

  color: #dc2626;

  font-size: 0.67rem;

  font-weight: 700;
}


.modal-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 22px;
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
    transform:
      rotate(360deg);
  }

}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 1200px) {

  .summary-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}


@media (max-width: 850px) {

  .summary-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .filters {
    grid-template-columns:
      1fr 1fr;
  }

}


@media (max-width: 700px) {

  .orders-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .header-actions {
    width: 100%;

    display: grid;

    grid-template-columns: 1fr;
  }


  .header-actions button {
    width: 100%;
  }


  .summary-grid,
  .filters {
    grid-template-columns: 1fr;
  }


  .pending-alert {
    align-items: flex-start;
  }


  .table-footer {
    grid-template-columns: 1fr;

    justify-items: center;
  }


  .pagination {
    justify-content: center;
  }

}

</style>