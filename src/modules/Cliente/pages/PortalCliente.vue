<template>

  <div class="portal-cliente">

    <!-- ===================================================== -->

    <!-- ENCABEZADO -->

    <!-- ===================================================== -->

    <section class="portal-header">

      <div class="portal-header-info">

        <span class="portal-eyebrow">

          PORTAL DEL CLIENTE

        </span>

        <h1>

          Bienvenido, {{ nombreCliente }}

        </h1>

        <p>

          Consulte sus servicios, próximos trabajos e historial con Fumidez.

        </p>

      </div>



      <div class="header-actions">

        <button

          type="button"

          class="refresh-button"

          :disabled="cargando"

          @click="cargarOrdenes"

        >

          <i

            class="bi bi-arrow-clockwise"

            :class="{ 'rotating': cargando }"

          ></i>

          Actualizar

        </button>



        <button

          type="button"

          class="logout-button"

          @click="cerrarSesion"

        >

          <i class="bi bi-box-arrow-right"></i>

          Cerrar sesión

        </button>

      </div>

    </section>



    <!-- ===================================================== -->

    <!-- ERROR -->

    <!-- ===================================================== -->

    <div

      v-if="mensajeError"

      class="portal-alert"

    >

      <i class="bi bi-exclamation-circle-fill"></i>

      <span>

        {{ mensajeError }}

      </span>

      <button

        type="button"

        @click="cargarOrdenes"

      >

        Reintentar

      </button>

    </div>



    <!-- ===================================================== -->

    <!-- RESUMEN -->

    <!-- ===================================================== -->

    <section class="portal-summary">

      <!-- PRÓXIMO SERVICIO -->

      <div class="summary-card next-service-card">

        <div class="summary-icon blue">

          <i class="bi bi-calendar-check"></i>

        </div>

        <div class="summary-content">

          <span class="summary-label">

            Próximo servicio

          </span>

          <template v-if="proximoServicio">

            <strong class="summary-date">

              {{ formatearFechaCorta(proximoServicio.fecha) }}

            </strong>

            <small>

              {{ formatearHora(proximoServicio.hora) }}

              · Orden {{ proximoServicio.numeroOrden }}

            </small>

          </template>

          <template v-else>

            <strong class="summary-empty">

              Sin servicios programados

            </strong>

          </template>

        </div>

      </div>



      <!-- REALIZADOS -->

      <div class="summary-card">

        <div class="summary-icon green">

          <i class="bi bi-check-circle"></i>

        </div>

        <div class="summary-content">

          <span class="summary-label">

            Servicios realizados

          </span>

          <strong class="summary-number">

            {{ serviciosRealizados }}

          </strong>

          <small>

            Órdenes finalizadas

          </small>

        </div>

      </div>



      <!-- PENDIENTES -->

      <div class="summary-card">

        <div class="summary-icon orange">

          <i class="bi bi-clock-history"></i>

        </div>

        <div class="summary-content">

          <span class="summary-label">

            Servicios pendientes

          </span>

          <strong class="summary-number">

            {{ serviciosPendientes }}

          </strong>

          <small>

            Pendientes o en proceso

          </small>

        </div>

      </div>



      <!-- TOTAL -->

      <div class="summary-card">

        <div class="summary-icon purple">

          <i class="bi bi-journal-check"></i>

        </div>

        <div class="summary-content">

          <span class="summary-label">

            Historial total

          </span>

          <strong class="summary-number">

            {{ ordenes.length }}

          </strong>

          <small>

            Servicios registrados

          </small>

        </div>

      </div>

    </section>



    <!-- ===================================================== -->

    <!-- PRÓXIMO SERVICIO DESTACADO -->

    <!-- ===================================================== -->

    <section

      v-if="proximoServicio"

      class="next-service"

    >

      <div class="next-service-header">

        <div>

          <span class="section-eyebrow">

            PRÓXIMA VISITA

          </span>

          <h2>

            Próximo servicio programado

          </h2>

        </div>



        <span

          class="status-badge"

          :class="claseEstado(proximoServicio.estado)"

        >

          <span class="status-dot"></span>

          {{ textoEstado(proximoServicio.estado) }}

        </span>

      </div>



      <div class="next-service-grid">

        <div class="next-info">

          <i class="bi bi-calendar3"></i>

          <div>

            <span>

              Fecha

            </span>

            <strong>

              {{ formatearFechaCompleta(proximoServicio.fecha) }}

            </strong>

          </div>

        </div>



        <div class="next-info">

          <i class="bi bi-clock"></i>

          <div>

            <span>

              Horario

            </span>

            <strong>

              {{ formatearHora(proximoServicio.hora) }}

              <template v-if="proximoServicio.horaFin">

                -

                {{ formatearHora(proximoServicio.horaFin) }}

              </template>

            </strong>

          </div>

        </div>



        <div class="next-info">

          <i class="bi bi-hash"></i>

          <div>

            <span>

              Orden

            </span>

            <strong>

              {{ proximoServicio.numeroOrden || `#${proximoServicio.id}` }}

            </strong>

          </div>

        </div>



        <div class="next-info">

          <i class="bi bi-geo-alt"></i>

          <div>

            <span>

              Área

            </span>

            <strong>

              {{ proximoServicio.area || "No especificada" }}

            </strong>

          </div>

        </div>

      </div>



      <div

        v-if="proximoServicio.descripcion"

        class="next-description"

      >

        <span>

          Descripción del servicio

        </span>

        <p>

          {{ proximoServicio.descripcion }}

        </p>

      </div>

    </section>



    <!-- ===================================================== -->

    <!-- HISTORIAL -->

    <!-- ===================================================== -->

    <section class="portal-section">

      <div class="section-header">

        <div>

          <span class="section-eyebrow">

            HISTORIAL

          </span>

          <h2>

            Mis servicios

          </h2>

          <p>

            Consulte los trabajos registrados por Fumidez para su empresa.

          </p>

        </div>



        <span class="results-count">

          {{ ordenesFiltradas.length }}

          {{ ordenesFiltradas.length === 1 ? "servicio" : "servicios" }}

        </span>

      </div>



      <!-- ================================================= -->

      <!-- FILTROS -->

      <!-- ================================================= -->

      <div class="filters">

        <div class="search-container">

          <i class="bi bi-search"></i>

          <input

            v-model.trim="filtroTexto"

            type="text"

            placeholder="Buscar por orden, área o descripción..."

          />

          <button

            v-if="filtroTexto"

            type="button"

            class="clear-search"

            @click="filtroTexto = ''"

          >

            <i class="bi bi-x"></i>

          </button>

        </div>



        <select

          v-model="filtroEstado"

          class="status-select"

        >

          <option value="TODOS">

            Todos los estados

          </option>

          <option value="PENDIENTE">

            Pendientes

          </option>

          <option value="EN_PROCESO">

            En proceso

          </option>

          <option value="FINALIZADA">

            Finalizadas

          </option>

          <option value="CANCELADA">

            Canceladas

          </option>

        </select>

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

          Cargando sus servicios...

        </span>

      </div>



      <!-- ================================================= -->

      <!-- SIN ÓRDENES -->

      <!-- ================================================= -->

      <div

        v-else-if="ordenes.length === 0"

        class="empty-state"

      >

        <div class="empty-icon">

          <i class="bi bi-calendar2-check"></i>

        </div>

        <h3>

          Aún no hay servicios registrados

        </h3>

        <p>

          Cuando Fumidez registre una orden de trabajo para su empresa,

          aparecerá automáticamente en este portal.

        </p>

      </div>



      <!-- ================================================= -->

      <!-- FILTRO SIN RESULTADOS -->

      <!-- ================================================= -->

      <div

        v-else-if="ordenesFiltradas.length === 0"

        class="empty-state compact"

      >

        <div class="empty-icon">

          <i class="bi bi-search"></i>

        </div>

        <h3>

          No encontramos resultados

        </h3>

        <p>

          Intente cambiar la búsqueda o el filtro seleccionado.

        </p>

        <button

          type="button"

          class="clear-filters-button"

          @click="limpiarFiltros"

        >

          Limpiar filtros

        </button>

      </div>



      <!-- ================================================= -->

      <!-- SERVICIOS -->

      <!-- ================================================= -->

      <div

        v-else

        class="services-list"

      >

        <article

          v-for="orden in ordenesFiltradas"

          :key="orden.id"

          class="service-card"

          :class="{

            expanded: ordenExpandida === orden.id

          }"

        >

          <!-- CABECERA DE LA ORDEN -->

          <div

            class="service-main"

@click="toggleDetalle(orden)"          >

            <div class="service-date">

              <span class="date-day">

                {{ obtenerDia(orden.fecha) }}

              </span>

              <span class="date-month">

                {{ obtenerMes(orden.fecha) }}

              </span>

              <span class="date-year">

                {{ obtenerAnio(orden.fecha) }}

              </span>

            </div>



            <div class="service-info">

              <div class="service-title-row">

                <h3>

                  Orden

                  {{ orden.numeroOrden || `#${orden.id}` }}

                </h3>

                <span

                  class="status-badge"

                  :class="claseEstado(orden.estado)"

                >

                  <span class="status-dot"></span>

                  {{ textoEstado(orden.estado) }}

                </span>

              </div>



              <div class="service-metadata">

                <span>

                  <i class="bi bi-clock"></i>

                  {{ formatearHora(orden.hora) }}

                  <template v-if="orden.horaFin">

                    -

                    {{ formatearHora(orden.horaFin) }}

                  </template>

                </span>



                <span>

                  <i class="bi bi-geo-alt"></i>

                  {{ orden.area || "Área no especificada" }}

                </span>

              </div>



              <p class="service-description">

                {{ orden.descripcion || "Sin descripción registrada." }}

              </p>

            </div>



            <button

              type="button"

              class="expand-button"

              :title="

                ordenExpandida === orden.id

                  ? 'Ocultar detalle'

                  : 'Ver detalle'

              "

            >

              <i

                class="bi"

                :class="

                  ordenExpandida === orden.id

                    ? 'bi-chevron-up'

                    : 'bi-chevron-down'

                "

              ></i>

            </button>

          </div>



          <!-- DETALLE EXPANDIBLE -->

          <transition name="detail">

            <div

              v-if="ordenExpandida === orden.id"

              class="service-detail"

            >

              <div class="detail-grid">

                <div class="detail-item">

                  <span>

                    Número de orden

                  </span>

                  <strong>

                    {{ orden.numeroOrden || `#${orden.id}` }}

                  </strong>

                </div>



                <div class="detail-item">

                  <span>

                    Fecha

                  </span>

                  <strong>

                    {{ formatearFechaCompleta(orden.fecha) }}

                  </strong>

                </div>



                <div class="detail-item">

                  <span>

                    Hora de inicio

                  </span>

                  <strong>

                    {{ formatearHora(orden.hora) }}

                  </strong>

                </div>



                <div class="detail-item">

                  <span>

                    Hora de finalización

                  </span>

                  <strong>

                    {{ formatearHora(orden.horaFin) || "No especificada" }}

                  </strong>

                </div>



                <div class="detail-item">

                  <span>

                    Área

                  </span>

                  <strong>

                    {{ orden.area || "No especificada" }}

                  </strong>

                </div>



                <div class="detail-item">

                  <span>

                    Estado

                  </span>

                  <strong>

                    {{ textoEstado(orden.estado) }}

                  </strong>

                </div>

              </div>



              <div class="detail-description">

                <span>

                  Descripción del trabajo

                </span>

                <p>

                  {{ orden.descripcion || "Sin descripción registrada." }}

                </p>

              </div>



             <div

  v-if="orden.estado === 'FINALIZADA'"

  class="documents-section"

>

  <!-- CARGANDO INFORME -->

  <div

    v-if="cargandoInforme[orden.id]"

    class="document-loading"

  >

    <span

      class="spinner-border spinner-border-sm"

      role="status"

    ></span>

    Consultando documentación...

  </div>



  <!-- INFORME DISPONIBLE -->

  <div

    v-else-if="informesPorOrden[orden.id]"

    class="document-card available"

  >

    <div class="document-icon">

      <i class="bi bi-file-earmark-text-fill"></i>

    </div>



    <div class="document-content">

      <span class="document-eyebrow">

        INFORME IPM

      </span>

      <strong>

        Informe disponible

      </strong>

      <p>

        Informe asociado a la Orden

        {{ orden.numeroOrden || `#${orden.id}` }}

      </p>



      <div class="document-metadata">

        <span>

          <i class="bi bi-receipt"></i>

          Factura:

          {{

            informesPorOrden[orden.id].numFactura

            || "No especificada"

          }}

        </span>



        <span>

          <i class="bi bi-arrow-repeat"></i>

          Frecuencia:

          {{

            formatearFrecuencia(

              informesPorOrden[orden.id].frecuencia

            )

          }}

        </span>

      </div>

    </div>



    <button

      type="button"

      class="view-report-button"

      @click.stop="

        abrirInforme(

          informesPorOrden[orden.id],

          orden

        )

      "

    >

      <i class="bi bi-eye"></i>

      Ver informe

    </button>

  </div>



  <!-- SIN INFORME -->

  <div

    v-else

    class="document-card unavailable"

  >

    <div class="document-icon">

      <i class="bi bi-file-earmark-minus"></i>

    </div>

    <div class="document-content">

      <strong>

        Informe todavía no disponible

      </strong>

      <p>

        Esta orden está finalizada, pero todavía no tiene

        un informe IPM asociado.

      </p>

    </div>

  </div>


  <!-- FACTURA DISPONIBLE -->

  <div

    v-if="!cargandoFactura[orden.id] && facturasPorOrden[orden.id]"

    class="document-card available"

  >

    <div class="document-icon">

      <i class="bi bi-receipt-cutoff"></i>

    </div>

    <div class="document-content">

      <span class="document-eyebrow">

        FACTURA

      </span>

      <strong>

        Factura {{ facturasPorOrden[orden.id].estadoFactura || "registrada" }}

      </strong>

      <div class="document-metadata">

        <span>

          <i class="bi bi-calendar-event"></i>

          Emisión:

          {{ formatearFechaFactura(facturasPorOrden[orden.id].fechaEmision) }}

        </span>

        <span>

          <i class="bi bi-cash-coin"></i>

          Total:

          ${{ facturasPorOrden[orden.id].totalFactura }}

        </span>

      </div>

      <div

        v-if="facturasPorOrden[orden.id].archivos?.length"

        class="document-metadata"

      >

        <div

          v-for="archivo in facturasPorOrden[orden.id].archivos"

          :key="archivo.id"

          class="archivo-factura"

        >

          <button

            type="button"

            class="view-report-button archivo-button"

            @click.stop="visualizarArchivoFactura(orden, archivo)"

          >

            <i class="bi bi-eye"></i>

            {{ archivo.nombreArchivo }}

            <small>{{ formatearTamanio(archivo.tamanioArchivo) }}</small>

          </button>

          <button

            type="button"

            class="view-report-button archivo-button"

            title="Descargar"

            @click.stop="descargarArchivoFactura(orden, archivo)"

          >

            <i class="bi bi-download"></i>

          </button>

        </div>

      </div>

    </div>

  </div>


  <!-- SIN FACTURA -->

  <div

    v-else-if="!cargandoFactura[orden.id]"

    class="document-card unavailable"

  >

    <div class="document-icon">

      <i class="bi bi-receipt"></i>

    </div>

    <div class="document-content">

      <strong>

        Factura todavía no disponible

      </strong>

      <p>

        Esta orden está finalizada, pero todavía no tiene

        una factura asociada.

      </p>

    </div>

  </div>


  <!-- DESCARGAS PDF -->

  <div class="pdf-actions">

    <button

      type="button"

      class="view-report-button"

      :disabled="descargandoPdfOrden === orden.id"

      @click.stop="descargarPdfOrden(orden)"

    >

      <i class="bi bi-file-earmark-pdf"></i>

      {{ descargandoPdfOrden === orden.id ? "Generando..." : "Descargar orden (PDF)" }}

    </button>

    <button

      v-if="informesPorOrden[orden.id]"

      type="button"

      class="view-report-button"

      :disabled="descargandoPdfInforme === orden.id"

      @click.stop="descargarPdfInforme(orden)"

    >

      <i class="bi bi-file-earmark-pdf"></i>

      {{ descargandoPdfInforme === orden.id ? "Generando..." : "Descargar informe (PDF)" }}

    </button>

  </div>


  <!-- FIRMAS DE LA ORDEN -->

  <div class="portal-signature-card">

    <h4>
      <i class="bi bi-pen"></i>
      Firmas de la orden
    </h4>

    <div class="signature-flags">

      <span
        class="signature-flag"
        :class="orden.firmadaCliente ? 'flag-ok' : 'flag-pending'"
      >
        <i :class="orden.firmadaCliente ? 'bi bi-check-circle-fill' : 'bi bi-clock'"></i>
        Cliente: {{ orden.firmadaCliente ? "firmado" : "pendiente" }}
      </span>

      <span
        class="signature-flag"
        :class="orden.firmadaAdmin ? 'flag-ok' : 'flag-pending'"
      >
        <i :class="orden.firmadaAdmin ? 'bi bi-check-circle-fill' : 'bi bi-clock'"></i>
        Responsable: {{ orden.firmadaAdmin ? "firmado" : "pendiente" }}
      </span>

    </div>

    <template v-if="orden.estado === 'FINALIZADA'">

      <template v-if="!orden.firmadaCliente">

        <p class="signature-note">
          Dibuja tu firma en el recuadro y pulsa
          «Guardar firma» para firmar esta orden.
        </p>

        <FirmaOrden
          @firma-guardada="
            firma => guardarFirmaCliente(orden, firma)
          "
        />

        <p
          v-if="errorFirma === orden.id"
          class="signature-error"
        >
          {{ mensajeErrorFirma }}
        </p>

        <p
          v-if="guardandoFirma === orden.id"
          class="signature-note"
        >
          Guardando firma...
        </p>

      </template>

    </template>

    <p v-else class="signature-note">
      La orden se podrá firmar cuando esté finalizada.
    </p>

  </div>

</div>

            </div>

          </transition>

        </article>

      </div>

    </section>

<!-- ===================================================== -->

<!-- MODAL INFORME IPM -->

<!-- ===================================================== -->

<div

  v-if="mostrarModalInforme && informeSeleccionado"

  class="report-modal-backdrop"

  @click.self="cerrarInforme"

>

  <div class="report-modal">

    <div class="report-modal-header">

      <div>

        <span class="report-eyebrow">

          INFORME IPM

        </span>

        <h2>

          Informe del servicio

        </h2>

        <p v-if="ordenInformeSeleccionada">

          Orden

          {{

            ordenInformeSeleccionada.numeroOrden

            ||

            `#${ordenInformeSeleccionada.id}`

          }}

        </p>

      </div>



      <button

        type="button"

        class="modal-close-button"

        @click="cerrarInforme"

      >

        <i class="bi bi-x-lg"></i>

      </button>

    </div>



    <div class="report-modal-body">

      <!-- DATOS PRINCIPALES -->

      <div class="report-summary-grid">

        <div class="report-info-card">

          <span>

            N.º Factura

          </span>

          <strong>

            {{

              informeSeleccionado.numFactura

              || "No especificada"

            }}

          </strong>

        </div>



        <div class="report-info-card">

          <span>

            Frecuencia

          </span>

          <strong>

            {{

              formatearFrecuencia(

                informeSeleccionado.frecuencia

              )

            }}

          </strong>

        </div>



        <div class="report-info-card">

          <span>

            Tiempo

          </span>

          <strong>

            {{

              informeSeleccionado.tiempo

              || "No especificado"

            }}

          </strong>

        </div>



        <div class="report-info-card">

          <span>

            Precio

          </span>

          <strong>

            {{

              formatearPrecio(

                informeSeleccionado.precio

              )

            }}

          </strong>

        </div>

      </div>



      <!-- OBSERVACIONES -->

      <div class="report-text-section">

        <div class="report-section-title">

          <i class="bi bi-clipboard2-check"></i>

          Observaciones

        </div>

        <p>

          {{

            informeSeleccionado.observacion

            || "No se registraron observaciones."

          }}

        </p>

      </div>



      <!-- RECOMENDACIONES -->

      <div class="report-text-section recommendation">

        <div class="report-section-title">

          <i class="bi bi-lightbulb"></i>

          Recomendaciones

        </div>

        <p>

          {{

            informeSeleccionado.recomendaciones

            || "No se registraron recomendaciones."

          }}

        </p>

      </div>



      <!-- PRÓXIMOS DOCUMENTOS -->

     <!-- ===================================================== -->
<!-- EVIDENCIA FOTOGRÁFICA -->
<!-- ===================================================== -->

<div class="report-photos-section">

  <div class="report-photos-header">

    <div>
      <span class="report-photos-eyebrow">
        EVIDENCIA
      </span>

      <h3>
        Fotografías del servicio
      </h3>
    </div>

    <span
      v-if="!cargandoFotos"
      class="photos-count"
    >
      {{ fotosInforme.length }}
      {{ fotosInforme.length === 1 ? "foto" : "fotos" }}
    </span>

  </div>


  <!-- CARGANDO -->

  <div
    v-if="cargandoFotos"
    class="photos-loading"
  >
    <span
      class="spinner-border spinner-border-sm"
    ></span>

    Cargando fotografías...
  </div>


  <!-- SIN FOTOS -->

  <div
    v-else-if="fotosInforme.length === 0"
    class="photos-empty"
  >
    <i class="bi bi-image"></i>

    <div>
      <strong>
        Sin evidencia fotográfica
      </strong>

      <span>
        No existen fotografías asociadas a este informe.
      </span>
    </div>
  </div>


  <!-- GALERÍA -->

  <div
    v-else
    class="photos-grid"
  >

    <button
      v-for="foto in fotosInforme"
      :key="foto.id"
      type="button"
      class="photo-card"
      @click.stop="fotoSeleccionada = foto"
    >

      <div class="photo-image-wrapper">

        <img
          v-if="foto.urlTemporal"
          :src="foto.urlTemporal"
          :alt="foto.pieImagen || foto.nombre"
          class="photo-image"
        />

        <div
          v-else
          class="photo-error"
        >
          <i class="bi bi-image"></i>
        </div>


        <div class="photo-overlay">
          <i class="bi bi-zoom-in"></i>
        </div>

      </div>


      <div class="photo-caption">

        <strong>
          {{
            foto.pieImagen
            ||
            "Evidencia fotográfica"
          }}
        </strong>

        <span>
          {{ foto.nombre }}
        </span>

      </div>

    </button>

  </div>

</div>
    </div>



    <div class="report-modal-footer">

      <button

        type="button"

        class="modal-secondary-button"

        @click="cerrarInforme"

      >

        Cerrar

      </button>

    </div>

    <!-- ===================================================== -->
<!-- VISOR DE FOTO -->
<!-- ===================================================== -->

<div
  v-if="fotoSeleccionada"
  class="photo-viewer-backdrop"
  @click.self="fotoSeleccionada = null"
>

  <div class="photo-viewer">

    <button
      type="button"
      class="photo-viewer-close"
      @click="fotoSeleccionada = null"
    >
      <i class="bi bi-x-lg"></i>
    </button>


    <img
      v-if="fotoSeleccionada.urlTemporal"
      :src="fotoSeleccionada.urlTemporal"
      :alt="
        fotoSeleccionada.pieImagen
        ||
        fotoSeleccionada.nombre
      "
    />


    <div class="photo-viewer-info">

      <strong>
        {{
          fotoSeleccionada.pieImagen
          ||
          "Evidencia fotográfica"
        }}
      </strong>

      <span>
        {{ fotoSeleccionada.nombre }}
      </span>

    </div>

  </div>

</div>

  </div>

</div>

  </div>

</template>



<script>

import { api } from "@/config/api";
import { generatePDFOrdenFachada } from "@/modules/OrdenTrabajo/helpers/generarOrdenPdf";
import { generateFormularioCompletoFachada } from "@/modules/InformeIPM/helpers/generarInformeUnido";
import FirmaOrden from "@/modules/OrdenTrabajo/pages/FirmaOrden.vue";

export default {

  name: "PortalCliente",

  components: {
    FirmaOrden
  },



data() {

  return {

    fotosInforme: [],
cargandoFotos: false,
fotoSeleccionada: null,
    ordenes: [],

    cargando: false,

    mensajeError: "",

    filtroTexto: "",

    filtroEstado: "TODOS",

    ordenExpandida: null,

    // Informes IPM por orden

    informesPorOrden: {},

    // Control de carga del informe por orden

    cargandoInforme: {},

    // Facturas por orden

    facturasPorOrden: {},

    // Control de carga de la factura por orden

    cargandoFactura: {},

    // Descargas de PDF en curso

    descargandoPdfOrden: null,

    descargandoPdfInforme: null,

    // Firma del cliente en curso

    guardandoFirma: null,

    errorFirma: null,

    mensajeErrorFirma: "",

    // Modal del informe

    mostrarModalInforme: false,

    informeSeleccionado: null,

    ordenInformeSeleccionada: null

  };

},



  computed: {

    // =====================================================

    // NOMBRE USUARIO

    // =====================================================

    nombreCliente() {

      return (

        localStorage.getItem("userName")

        ||

        "Cliente"

      );

    },



    // =====================================================

    // FINALIZADOS

    // =====================================================

    serviciosRealizados() {

      return this.ordenes.filter(

        orden =>

          orden.estado === "FINALIZADA"

      ).length;

    },



    // =====================================================

    // PENDIENTES

    // =====================================================

    serviciosPendientes() {

      return this.ordenes.filter(

        orden =>

          orden.estado === "PENDIENTE"

          ||

          orden.estado === "EN_PROCESO"

      ).length;

    },



    // =====================================================

    // PRÓXIMO SERVICIO

    // =====================================================

    proximoServicio() {

      const ahora =

        new Date();



      const candidatos =

        this.ordenes

          .filter(

            orden =>

              orden.estado !== "CANCELADA"

              &&

              orden.estado !== "FINALIZADA"

          )

          .map(

            orden => ({

              ...orden,

              fechaCompleta:

                this.crearFechaHora(

                  orden.fecha,

                  orden.hora

                )

            })

          )

          .filter(

            orden =>

              orden.fechaCompleta

              &&

              orden.fechaCompleta >= ahora

          )

          .sort(

            (a, b) =>

              a.fechaCompleta

              -

              b.fechaCompleta

          );



      return candidatos.length > 0

        ? candidatos[0]

        : null;

    },



    // =====================================================

    // FILTRO HISTORIAL

    // =====================================================

    ordenesFiltradas() {

      const texto =

        this.normalizarTexto(

          this.filtroTexto

        );



      return [...this.ordenes]

        .filter(

          orden => {

            const coincideEstado =

              this.filtroEstado === "TODOS"

              ||

              orden.estado === this.filtroEstado;



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

                  orden.estado

                ]

                  .filter(Boolean)

                  .join(" ")

              );



            return contenido.includes(

              texto

            );

          }

        )

        .sort(

          (a, b) => {

            const fechaA =

              this.crearFechaHora(

                a.fecha,

                a.hora

              );

            const fechaB =

              this.crearFechaHora(

                b.fecha,

                b.hora

              );



            return (

              (fechaB?.getTime() || 0)

              -

              (fechaA?.getTime() || 0)

            );

          }

        );

    }

  },



async mounted() {

  await this.cargarOrdenes();

},



  methods: {

    // =====================================================

    // CARGAR ÓRDENES SEGURAS DEL CLIENTE

    // =====================================================

    async cargarOrdenes() {

      this.cargando = true;

      this.mensajeError = "";



      try {

        const response =

          await api.get(

            "/portal-cliente/ordenes"

          );



        this.ordenes =

          Array.isArray(response.data)

            ? response.data

            : [];



        console.log(

          "ÓRDENES DEL CLIENTE:",

          this.ordenes

        );



      } catch (error) {

        console.error(

          "ERROR PORTAL CLIENTE:",

          error

        );



        this.ordenes = [];



        if (

          error.response?.status === 403

        ) {

          this.mensajeError =

            "No tiene autorización para consultar esta información.";

        } else if (

          error.response?.status === 401

        ) {

          this.mensajeError =

            "Su sesión ha expirado. Inicie sesión nuevamente.";

        } else {

          this.mensajeError =

            "No se pudieron cargar sus servicios. Intente nuevamente.";

        }

      } finally {

        this.cargando = false;

      }

    },



    // =====================================================

    // EXPANDIR DETALLE

    // =====================================================

async toggleDetalle(orden) {

  if (this.ordenExpandida === orden.id) {

    this.ordenExpandida = null;

    return;

  }

  this.ordenExpandida = orden.id;

  if (orden.estado !== "FINALIZADA") {

    return;

  }

  if (

    Object.prototype.hasOwnProperty.call(

      this.informesPorOrden,

      orden.id

    )

  ) {

    return;

  }

  await Promise.all([

    this.cargarInformeOrden(orden),

    this.cargarFacturaOrden(orden)

  ]);

},

async cargarInformeOrden(orden) {

  this.cargandoInforme[orden.id] = true;

  try {

    const response = await api.get(

      `/portal-cliente/ordenes/${orden.id}/informe`

    );

    this.informesPorOrden[orden.id] =

      response.data;

    console.log(

      `INFORME ORDEN ${orden.id}:`,

      response.data

    );

  } catch (error) {

    if (error.response?.status === 404) {

      this.informesPorOrden[orden.id] =

        null;

    } else {

      console.error(

        `ERROR INFORME ORDEN ${orden.id}:`,

        error.response?.status,

        error.response?.data || error

      );

      this.informesPorOrden[orden.id] =

        null;

    }

  } finally {

    this.cargandoInforme[orden.id] =

      false;

  }

},

async cargarFacturaOrden(orden) {

  if (

    Object.prototype.hasOwnProperty.call(

      this.facturasPorOrden,

      orden.id

    )

  ) {

    return;

  }

  this.cargandoFactura[orden.id] = true;

  try {

    const response = await api.get(

      `/portal-cliente/ordenes/${orden.id}/factura`

    );

    this.facturasPorOrden[orden.id] =

      response.data;

  } catch (error) {

    if (error.response?.status === 404) {

      this.facturasPorOrden[orden.id] =

        null;

    } else {

      console.error(

        `ERROR FACTURA ORDEN ${orden.id}:`,

        error.response?.status,

        error.response?.data || error

      );

      this.facturasPorOrden[orden.id] =

        null;

    }

  } finally {

    this.cargandoFactura[orden.id] =

      false;

  }

},

async guardarFirmaCliente(orden, firma) {

  if (!firma || this.guardandoFirma) {
    return;
  }

  this.guardandoFirma = orden.id;
  this.errorFirma = null;
  this.mensajeErrorFirma = "";

  try {

    await api.put(
      `/portal-cliente/ordenes/${orden.id}/firma`,
      { firmaCliente: firma }
    );

    orden.firmadaCliente = true;

  } catch (error) {

    console.error(
      `ERROR GUARDANDO FIRMA ORDEN ${orden.id}:`,
      error
    );

    this.errorFirma = orden.id;
    this.mensajeErrorFirma =
      typeof error.response?.data === "string"
        ? error.response.data
        : "No se pudo guardar la firma.";

  } finally {

    this.guardandoFirma = null;

  }

},

async descargarPdfOrden(orden) {

  this.descargandoPdfOrden = orden.id;

  try {

    const response = await api.get(

      `/portal-cliente/ordenes/${orden.id}/detalle`

    );

    await generatePDFOrdenFachada(response.data);

  } catch (error) {

    console.error(

      `ERROR PDF ORDEN ${orden.id}:`,

      error

    );

    this.mensajeError =

      "No se pudo generar el PDF de la orden.";

  } finally {

    this.descargandoPdfOrden = null;

  }

},

async descargarPdfInforme(orden) {

  this.descargandoPdfInforme = orden.id;

  try {

    const response = await api.get(

      `/portal-cliente/ordenes/${orden.id}/informe/dto`

    );

    const informeDto = response.data;

    // Fotos con su contenido en base64,
    // mismo formato que espera el generador.

    const fotosResponse = await api.get(

      `/portal-cliente/ordenes/${orden.id}/informe/fotos`

    );

    const fotos = Array.isArray(fotosResponse.data)

      ? fotosResponse.data

      : [];

    const fotosConContenido = await Promise.all(

      fotos.map(async (foto) => {

        const contenido = await api.get(

          foto.contenidoUrl,

          { responseType: "blob" }

        );

        const fotoBase64 = await new Promise(

          (resolve, reject) => {

            const reader = new FileReader();

            reader.onloadend = () =>

              resolve(

                String(reader.result).split(",")[1] || ""

              );

            reader.onerror = reject;

            reader.readAsDataURL(contenido.data);

          }

        );

        return {

          ...foto,

          fotoBase64

        };

      })

    );

    await generateFormularioCompletoFachada(

      informeDto,

      {

        fotos: fotosConContenido,

        formularios: informeDto.formularioIpmDtos

      }

    );

  } catch (error) {

    console.error(

      `ERROR PDF INFORME ORDEN ${orden.id}:`,

      error

    );

    this.mensajeError =

      "No se pudo generar el PDF del informe.";

  } finally {

    this.descargandoPdfInforme = null;

  }

},

async obtenerBlobArchivoFactura(orden, archivo) {

  const response = await api.get(

    `/portal-cliente/ordenes/${orden.id}/factura/archivos/${archivo.id}/contenido`,

    { responseType: "blob" }

  );

  return response.data;

},

async visualizarArchivoFactura(orden, archivo) {

  try {

    const blob = await this.obtenerBlobArchivoFactura(

      orden,

      archivo

    );

    const url = URL.createObjectURL(blob);

    const ventana = window.open(url, "_blank");

    if (!ventana) {

      // Popup bloqueado: descargar como fallback.

      const link = document.createElement("a");

      link.href = url;

      link.download = archivo.nombreArchivo || "factura";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    }

    setTimeout(() => URL.revokeObjectURL(url), 60000);

  } catch (error) {

    console.error(

      `ERROR VISUALIZANDO ARCHIVO ${archivo.id}:`,

      error

    );

    this.mensajeError =

      "No se pudo abrir el archivo de la factura.";

  }

},

async descargarArchivoFactura(orden, archivo) {

  try {

    const blob = await this.obtenerBlobArchivoFactura(

      orden,

      archivo

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = archivo.nombreArchivo || "factura";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  } catch (error) {

    console.error(

      `ERROR DESCARGANDO ARCHIVO ${archivo.id}:`,

      error

    );

    this.mensajeError =

      "No se pudo descargar el archivo de la factura.";

  }

},

formatearTamanio(bytes) {

  if (!bytes) {

    return "";

  }

  if (bytes < 1024) {

    return `${bytes} B`;

  }

  if (bytes < 1024 * 1024) {

    return `${(bytes / 1024).toFixed(1)} KB`;

  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

},

formatearFechaFactura(fecha) {

  if (!fecha) {

    return "No especificada";

  }

  return String(fecha).split("T")[0];

},

    // =====================================================

    // LIMPIAR FILTROS

    // =====================================================

    limpiarFiltros() {

      this.filtroTexto = "";

      this.filtroEstado =

        "TODOS";

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



      return (

        estados[estado]

        ||

        "Sin estado"

      );

    },

async abrirInforme(informe, orden) {

  this.informeSeleccionado = informe;
  this.ordenInformeSeleccionada = orden;
  this.mostrarModalInforme = true;

  await this.cargarFotosInforme(orden.id);
},

async cargarFotosInforme(ordenId) {

  this.cargandoFotos = true;
  this.fotosInforme = [];

  try {

    const response = await api.get(
      `/portal-cliente/ordenes/${ordenId}/informe/fotos`
    );

    const fotos = Array.isArray(response.data)
      ? response.data
      : [];

    this.fotosInforme = await Promise.all(
      fotos.map(async (foto) => {

        try {

          const responseImagen = await api.get(
            foto.contenidoUrl,
            {
              responseType: "blob"
            }
          );

          return {
            ...foto,
            urlTemporal:
              URL.createObjectURL(
                responseImagen.data
              )
          };

        } catch (error) {

          console.error(
            `Error cargando foto ${foto.id}:`,
            error
          );

          return {
            ...foto,
            urlTemporal: null
          };
        }

      })
    );

  } catch (error) {

    console.error(
      "Error cargando fotografías del informe:",
      error
    );

    this.fotosInforme = [];

  } finally {

    this.cargandoFotos = false;
  }
},
cerrarInforme() {

  this.fotosInforme.forEach(
    foto => {

      if (foto.urlTemporal) {
        URL.revokeObjectURL(
          foto.urlTemporal
        );
      }

    }
  );

  this.fotosInforme = [];

  this.fotoSeleccionada = null;

  this.mostrarModalInforme = false;

  this.informeSeleccionado = null;

  this.ordenInformeSeleccionada = null;
},



formatearFrecuencia(frecuencia) {

  if (!frecuencia) {

    return "No especificada";

  }

  return String(frecuencia)

    .replaceAll("_", " ")

    .toLowerCase()

    .replace(

      /\b\w/g,

      letra => letra.toUpperCase()

    );

},



formatearPrecio(precio) {

  if (

    precio === null

    ||

    precio === undefined

    ||

    precio === ""

  ) {

    return "No especificado";

  }

  return new Intl.NumberFormat(

    "es-EC",

    {

      style: "currency",

      currency: "USD"

    }

  ).format(

    Number(precio)

  );

},

    claseEstado(estado) {

      const estados = {

        PENDIENTE:

          "status-pending",

        EN_PROCESO:

          "status-progress",

        FINALIZADA:

          "status-completed",

        CANCELADA:

          "status-cancelled"

      };



      return (

        estados[estado]

        ||

        "status-unknown"

      );

    },



    // =====================================================

    // FECHA + HORA

    // =====================================================

    crearFechaHora(

      fecha,

      hora

    ) {

      if (!fecha) {

        return null;

      }



      try {

        const fechaTexto =

          String(fecha);



        const fechaBase =

          fechaTexto.includes("T")

            ? fechaTexto.split("T")[0]

            : fechaTexto.substring(0, 10);



        const [

          year,

          month,

          day

        ] =

          fechaBase

            .split("-")

            .map(Number);



        let horas = 0;

        let minutos = 0;



        if (hora) {

          const partesHora =

            String(hora)

              .split(":");



          horas =

            Number(

              partesHora[0] || 0

            );

          minutos =

            Number(

              partesHora[1] || 0

            );

        }



        const resultado =

          new Date(

            year,

            month - 1,

            day,

            horas,

            minutos,

            0,

            0

          );



        return Number.isNaN(

          resultado.getTime()

        )

          ? null

          : resultado;



      } catch (error) {

        return null;

      }

    },



    // =====================================================

    // FECHAS

    // =====================================================

    formatearFechaCorta(fecha) {

      const date =

        this.crearFechaHora(

          fecha,

          null

        );



      if (!date) {

        return "--";

      }



      return date.toLocaleDateString(

        "es-EC",

        {

          day: "2-digit",

          month: "short",

          year: "numeric"

        }

      );

    },



    formatearFechaCompleta(fecha) {

      const date =

        this.crearFechaHora(

          fecha,

          null

        );



      if (!date) {

        return "Fecha no disponible";

      }



      const texto =

        date.toLocaleDateString(

          "es-EC",

          {

            weekday: "long",

            day: "2-digit",

            month: "long",

            year: "numeric"

          }

        );



      return (

        texto.charAt(0).toUpperCase()

        +

        texto.slice(1)

      );

    },



    formatearHora(hora) {

      if (!hora) {

        return "";

      }



      const partes =

        String(hora)

          .split(":");



      if (

        partes.length < 2

      ) {

        return hora;

      }



      return (

        `${partes[0]}:${partes[1]}`

      );

    },



    obtenerDia(fecha) {

      const date =

        this.crearFechaHora(

          fecha,

          null

        );



      return date

        ? String(date.getDate())

            .padStart(2, "0")

        : "--";

    },



    obtenerMes(fecha) {

      const date =

        this.crearFechaHora(

          fecha,

          null

        );



      if (!date) {

        return "---";

      }



      return date

        .toLocaleDateString(

          "es-EC",

          {

            month: "short"

          }

        )

        .replace(".", "")

        .toUpperCase();

    },



    obtenerAnio(fecha) {

      const date =

        this.crearFechaHora(

          fecha,

          null

        );



      return date

        ? date.getFullYear()

        : "";

    },



    // =====================================================

    // NORMALIZAR TEXTO

    // =====================================================

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

    // CERRAR SESIÓN

    // =====================================================

    cerrarSesion() {

      localStorage.removeItem(

        "token"

      );

      localStorage.removeItem(

        "userId"

      );

      localStorage.removeItem(

        "userType"

      );

      localStorage.removeItem(

        "userName"

      );

      localStorage.removeItem(

        "userEmail"

      );

      localStorage.removeItem(

        "clienteId"

      );



      this.$router.replace(

        "/login"

      );

    }

  }

};

</script>



<style scoped>

/* ======================================================== */

/* PÁGINA */

/* ======================================================== */

.portal-cliente {

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



/* ======================================================== */

/* HEADER */

/* ======================================================== */

.portal-header {

  max-width: 1400px;

  margin:

    0 auto 24px;

  display: flex;

  align-items: center;

  justify-content:

    space-between;

  gap: 24px;

  padding:

    28px 30px;

  border:

    1px solid #e2e8f0;

  border-radius:

    20px;

  background:

    #ffffff;

  box-shadow:

    0 10px 30px

    rgba(15, 23, 42, 0.07);

}



.portal-eyebrow,

.section-eyebrow {

  display: block;

  margin-bottom: 6px;

  color: #2563eb;

  font-size: 0.7rem;

  font-weight: 800;

  letter-spacing: 0.14em;

}



.portal-header h1 {

  margin: 0;

  color: #123b6d;

  font-size:

    clamp(

      1.65rem,

      3vw,

      2.1rem

    );

  font-weight: 800;

}



.portal-header p {

  margin:

    7px 0 0;

  color: #64748b;

  font-size: 0.92rem;

}



.header-actions {

  display: flex;

  align-items: center;

  gap: 10px;

}



.refresh-button,

.logout-button {

  min-height: 42px;

  display:

    inline-flex;

  align-items:

    center;

  justify-content:

    center;

  gap: 7px;

  padding:

    0 15px;

  border-radius:

    10px;

  font-size: 0.82rem;

  font-weight: 700;

  transition:

    transform 0.2s ease,

    background 0.2s ease;

}



.refresh-button {

  border:

    1px solid #bfdbfe;

  background: #eff6ff;

  color: #1d4ed8;

}



.refresh-button:hover:not(:disabled) {

  background: #dbeafe;

  transform:

    translateY(-1px);

}



.logout-button {

  border:

    1px solid #fecaca;

  background: #fff1f2;

  color: #dc2626;

}



.logout-button:hover {

  background: #fee2e2;

  transform:

    translateY(-1px);

}



/* ======================================================== */

/* ALERTA */

/* ======================================================== */

.portal-alert {

  max-width: 1400px;

  margin:

    0 auto 20px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding:

    13px 16px;

  border:

    1px solid #fecaca;

  border-radius:

    12px;

  background: #fff1f2;

  color: #b91c1c;

  font-size: 0.84rem;

  font-weight: 600;

}



.portal-alert span {

  flex: 1;

}



.portal-alert button {

  border: none;

  background:

    transparent;

  color: #b91c1c;

  font-weight: 700;

}



/* ======================================================== */

/* RESUMEN */

/* ======================================================== */

.portal-summary {

  max-width: 1400px;

  margin:

    0 auto 24px;

  display: grid;

  grid-template-columns:

    repeat(

      4,

      minmax(0, 1fr)

    );

  gap: 15px;

}



.summary-card {

  min-height: 110px;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 20px;

  border:

    1px solid #e2e8f0;

  border-radius:

    17px;

  background: #ffffff;

  box-shadow:

    0 7px 20px

    rgba(15, 23, 42, 0.05);

}



.summary-icon {

  width: 53px;

  height: 53px;

  min-width: 53px;

  display: flex;

  align-items:

    center;

  justify-content:

    center;

  border-radius:

    14px;

  font-size: 1.3rem;

}



.summary-icon.blue {

  color: #2563eb;

  background: #eff6ff;

}



.summary-icon.green {

  color: #16a34a;

  background: #ecfdf3;

}



.summary-icon.orange {

  color: #ea580c;

  background: #fff7ed;

}



.summary-icon.purple {

  color: #7c3aed;

  background: #f5f3ff;

}



.summary-content {

  min-width: 0;

}



.summary-label {

  display: block;

  margin-bottom: 3px;

  color: #64748b;

  font-size: 0.76rem;

  font-weight: 600;

}



.summary-number {

  display: block;

  color: #172033;

  font-size: 1.6rem;

  font-weight: 800;

}



.summary-date {

  display: block;

  color: #172033;

  font-size: 1rem;

  font-weight: 800;

}



.summary-content small {

  display: block;

  margin-top: 2px;

  overflow: hidden;

  color: #94a3b8;

  font-size: 0.68rem;

  white-space: nowrap;

  text-overflow:

    ellipsis;

}



.summary-empty {

  display: block;

  color: #64748b;

  font-size: 0.82rem;

  font-weight: 700;

}



/* ======================================================== */

/* PRÓXIMO SERVICIO */

/* ======================================================== */

.next-service {

  max-width: 1400px;

  margin:

    0 auto 24px;

  padding: 25px;

  border:

    1px solid #dbeafe;

  border-radius:

    19px;

  background:

    linear-gradient(

      135deg,

      #ffffff,

      #f8fbff

    );

  box-shadow:

    0 8px 24px

    rgba(37, 99, 235, 0.06);

}



.next-service-header {

  display: flex;

  align-items:

    flex-start;

  justify-content:

    space-between;

  gap: 20px;

  margin-bottom: 20px;

}



.next-service h2 {

  margin: 0;

  color: #172033;

  font-size: 1.2rem;

  font-weight: 800;

}



.next-service-grid {

  display: grid;

  grid-template-columns:

    repeat(

      4,

      minmax(0, 1fr)

    );

  gap: 12px;

}



.next-info {

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 13px;

  border:

    1px solid #e5eaf0;

  border-radius: 12px;

  background: #ffffff;

}



.next-info > i {

  width: 35px;

  height: 35px;

  display: flex;

  align-items:

    center;

  justify-content:

    center;

  border-radius: 9px;

  background: #eff6ff;

  color: #2563eb;

}



.next-info span {

  display: block;

  color: #94a3b8;

  font-size: 0.65rem;

  font-weight: 700;

  text-transform:

    uppercase;

}



.next-info strong {

  display: block;

  margin-top: 2px;

  color: #334155;

  font-size: 0.79rem;

}



.next-description {

  margin-top: 15px;

  padding: 14px 16px;

  border-radius: 11px;

  background: #f8fafc;

}



.next-description span {

  color: #64748b;

  font-size: 0.68rem;

  font-weight: 700;

  text-transform:

    uppercase;

}



.next-description p {

  margin: 5px 0 0;

  color: #475569;

  font-size: 0.82rem;

  line-height: 1.55;

}



/* ======================================================== */

/* HISTORIAL */

/* ======================================================== */

.portal-section {

  max-width: 1400px;

  margin: 0 auto;

  padding: 26px;

  border:

    1px solid #e2e8f0;

  border-radius:

    20px;

  background: #ffffff;

  box-shadow:

    0 10px 30px

    rgba(15, 23, 42, 0.06);

}



.section-header {

  display: flex;

  align-items:

    flex-start;

  justify-content:

    space-between;

  gap: 15px;

  margin-bottom: 20px;

}



.section-header h2 {

  margin: 0;

  color: #172033;

  font-size: 1.3rem;

  font-weight: 800;

}



.section-header p {

  margin: 4px 0 0;

  color: #64748b;

  font-size: 0.82rem;

}



.results-count {

  padding:

    6px 10px;

  border-radius: 999px;

  background: #f1f5f9;

  color: #475569;

  font-size: 0.7rem;

  font-weight: 700;

  white-space:

    nowrap;

}



/* ======================================================== */

/* FILTROS */

/* ======================================================== */

.filters {

  display: grid;

  grid-template-columns:

    minmax(0, 1fr)

    200px;

  gap: 12px;

  margin-bottom: 20px;

}



.search-container {

  position: relative;

}



.search-container > i {

  position: absolute;

  top: 50%;

  left: 13px;

  transform:

    translateY(-50%);

  color: #94a3b8;

}



.search-container input,

.status-select {

  width: 100%;

  height: 42px;

  border:

    1px solid #dce4ee;

  border-radius:

    10px;

  background: #f8fafc;

  color: #334155;

  outline: none;

  font-size: 0.82rem;

}



.search-container input {

  padding:

    0 42px

    0 38px;

}



.status-select {

  padding:

    0 11px;

}



.search-container input:focus,

.status-select:focus {

  border-color:

    #93b4ed;

  background: #ffffff;

  box-shadow:

    0 0 0 3px

    rgba(37, 99, 235, 0.07);

}



.clear-search {

  position: absolute;

  top: 50%;

  right: 8px;

  width: 28px;

  height: 28px;

  transform:

    translateY(-50%);

  border: none;

  border-radius: 7px;

  background:

    transparent;

  color: #94a3b8;

}



/* ======================================================== */

/* SERVICIOS */

/* ======================================================== */

.services-list {

  display: flex;

  flex-direction:

    column;

  gap: 12px;

}



.service-card {

  overflow: hidden;

  border:

    1px solid #e3e9f0;

  border-radius:

    14px;

  background: #ffffff;

  transition:

    border 0.2s ease,

    box-shadow 0.2s ease;

}



.service-card:hover {

  border-color:

    #cbd8e7;

  box-shadow:

    0 5px 18px

    rgba(15, 23, 42, 0.05);

}



.service-card.expanded {

  border-color:

    #bfdbfe;

  box-shadow:

    0 7px 22px

    rgba(37, 99, 235, 0.07);

}



.service-main {

  display: grid;

  grid-template-columns:

    72px

    minmax(0, 1fr)

    40px;

  gap: 17px;

  align-items: center;

  padding: 17px;

  cursor: pointer;

}



.service-date {

  width: 67px;

  min-height: 72px;

  display: flex;

  flex-direction:

    column;

  align-items: center;

  justify-content:

    center;

  border-radius: 11px;

  background: #f1f5f9;

}



.date-day {

  color: #172033;

  font-size: 1.45rem;

  font-weight: 800;

  line-height: 1;

}



.date-month {

  margin-top: 3px;

  color: #2563eb;

  font-size: 0.66rem;

  font-weight: 800;

}



.date-year {

  color: #94a3b8;

  font-size: 0.58rem;

}



.service-title-row {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 7px;

}



.service-title-row h3 {

  margin: 0;

  color: #26364d;

  font-size: 0.96rem;

  font-weight: 800;

}



.service-metadata {

  display: flex;

  flex-wrap: wrap;

  gap: 13px;

  color: #64748b;

  font-size: 0.73rem;

}



.service-metadata span {

  display: flex;

  align-items: center;

  gap: 5px;

}



.service-description {

  max-width: 850px;

  margin:

    7px 0 0;

  overflow: hidden;

  color: #64748b;

  font-size: 0.76rem;

  white-space: nowrap;

  text-overflow:

    ellipsis;

}



.expand-button {

  width: 36px;

  height: 36px;

  border:

    1px solid #e2e8f0;

  border-radius: 9px;

  background: #f8fafc;

  color: #64748b;

}



/* ======================================================== */

/* ESTADO */

/* ======================================================== */

.status-badge {

  display: inline-flex;

  align-items: center;

  gap: 6px;

  width: fit-content;

  padding:

    5px 9px;

  border-radius:

    999px;

  font-size: 0.66rem;

  font-weight: 800;

  white-space:

    nowrap;

}



.status-badge .status-dot {

  width: 6px;

  height: 6px;

  border-radius: 50%;

  background:

    currentColor;

}



.status-pending {

  border:

    1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;

}



.status-progress {

  border:

    1px solid #fed7aa;

  background: #fff7ed;

  color: #d97706;

}



.status-completed {

  border:

    1px solid #bbf7d0;

  background: #f0fdf4;

  color: #16a34a;

}



.status-cancelled {

  border:

    1px solid #fecaca;

  background: #fef2f2;

  color: #dc2626;

}



.status-unknown {

  border:

    1px solid #e2e8f0;

  background: #f8fafc;

  color: #64748b;

}



/* ======================================================== */

/* DETALLE */

/* ======================================================== */

.service-detail {

  padding:

    0 18px 18px

    107px;

  border-top:

    1px solid #edf1f5;

  background: #fbfcfe;

}



.detail-grid {

  display: grid;

  grid-template-columns:

    repeat(

      3,

      minmax(0, 1fr)

    );

  gap: 10px;

  padding-top: 16px;

}



.detail-item {

  padding: 11px;

  border:

    1px solid #e8edf3;

  border-radius: 9px;

  background: #ffffff;

}



.detail-item span,

.detail-description > span {

  display: block;

  color: #94a3b8;

  font-size: 0.61rem;

  font-weight: 700;

  text-transform:

    uppercase;

}



.detail-item strong {

  display: block;

  margin-top: 3px;

  color: #334155;

  font-size: 0.76rem;

}



.detail-description {

  margin-top: 11px;

  padding: 12px;

  border-radius: 9px;

  background: #ffffff;

  border:

    1px solid #e8edf3;

}



.detail-description p {

  margin: 5px 0 0;

  color: #475569;

  font-size: 0.77rem;

  line-height: 1.55;

}



.documents-placeholder {

  display: flex;

  align-items:

    center;

  gap: 11px;

  margin-top: 11px;

  padding: 12px;

  border:

    1px solid #bbf7d0;

  border-radius: 9px;

  background: #f0fdf4;

  color: #15803d;

}



.documents-placeholder > i {

  font-size: 1.25rem;

}



.documents-placeholder strong {

  display: block;

  font-size: 0.75rem;

}



.documents-placeholder span {

  display: block;

  margin-top: 2px;

  color: #4b7d5a;

  font-size: 0.66rem;

}



/* ======================================================== */

/* EMPTY / LOADING */

/* ======================================================== */

.loading-state,

.empty-state {

  min-height: 240px;

  display: flex;

  flex-direction:

    column;

  align-items: center;

  justify-content:

    center;

  gap: 10px;

  padding: 25px;

  text-align: center;

}



.empty-state {

  border:

    1px dashed #cbd5e1;

  border-radius: 14px;

  background: #f8fafc;

}



.empty-state.compact {

  min-height: 200px;

}



.empty-icon {

  width: 55px;

  height: 55px;

  display: flex;

  align-items:

    center;

  justify-content:

    center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 1.4rem;

}



.empty-state h3 {

  margin: 0;

  color: #334155;

  font-size: 0.95rem;

}



.empty-state p {

  max-width: 500px;

  margin: 0;

  color: #64748b;

  font-size: 0.76rem;

  line-height: 1.6;

}



.clear-filters-button {

  margin-top: 4px;

  padding:

    7px 12px;

  border: none;

  border-radius: 8px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 0.73rem;

  font-weight: 700;

}



/* ======================================================== */

/* TRANSICIÓN */

/* ======================================================== */

.detail-enter-active,

.detail-leave-active {

  transition:

    opacity 0.18s ease;

}



.detail-enter-from,

.detail-leave-to {

  opacity: 0;

}



/* ======================================================== */

/* ROTACIÓN */

/* ======================================================== */

.rotating {

  animation:

    rotation

    1s linear infinite;

}



@keyframes rotation {

  from {

    transform:

      rotate(0deg);

  }

  to {

    transform:

      rotate(360deg);

  }

}



/* ======================================================== */

/* RESPONSIVE */

/* ======================================================== */

@media (max-width: 1050px) {

  .portal-summary {

    grid-template-columns:

      repeat(

        2,

        minmax(0, 1fr)

      );

  }



  .next-service-grid {

    grid-template-columns:

      repeat(

        2,

        minmax(0, 1fr)

      );

  }



  .detail-grid {

    grid-template-columns:

      repeat(

        2,

        minmax(0, 1fr)

      );

  }

}



@media (max-width: 750px) {
  .portal-cliente {
    padding: 16px;
  }

  .portal-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 22px;
  }

  .header-actions {
    width: 100%;
  }

  .refresh-button,
  .logout-button {
    flex: 1;
  }

  .portal-summary {
    grid-template-columns: 1fr;
  }

  .next-service-grid {
    grid-template-columns: 1fr;
  }

  .next-service-header,
  .section-header {
    flex-direction: column;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .service-main {
    grid-template-columns: 58px minmax(0, 1fr) 35px;
    gap: 11px;
    padding: 13px;
  }

  .service-date {
    width: 55px;
    min-height: 65px;
  }

  .service-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .service-description {
    white-space: normal;
  }

  .service-detail {
    padding: 0 13px 13px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* ======================================================== */
/* DOCUMENTACIÓN / INFORME IPM                              */
/* ======================================================== */

.documents-section {
  width: 100%;
  margin-top: 16px;
}

.document-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 600;
}

.document-card {
  width: 100%;
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  box-sizing: border-box;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.document-card.available {
  border: 1px solid #bbf7d0;
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fffa 100%);
}

.document-card.available:hover {
  border-color: #86efac;
  box-shadow: 0 8px 22px rgba(22, 163, 74, 0.09);
}

.document-card.unavailable {
  grid-template-columns: 54px minmax(0, 1fr);
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.document-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 1.35rem;
}

.document-card.unavailable .document-icon {
  background: #eef2f7;
  color: #94a3b8;
}

.document-content {
  min-width: 0;
}

.document-eyebrow {
  display: block;
  margin-bottom: 3px;
  color: #16a34a;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.document-content strong {
  display: block;
  color: #166534;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.3;
}

.document-card.unavailable .document-content strong {
  color: #475569;
}

.document-content p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.45;
}

.document-metadata {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 10px;
}

.document-metadata span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4b7d5a;
  font-size: 0.71rem;
  font-weight: 600;
}

.document-metadata i {
  color: #16a34a;
  font-size: 0.86rem;
}

.view-report-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 16px;
  border: 1px solid #86efac;
  border-radius: 10px;
  background: #ffffff;
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.view-report-button:hover {
  background: #16a34a;
  border-color: #16a34a;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(22, 163, 74, 0.18);
}

.view-report-button:disabled {
  opacity: 0.6;
  cursor: wait;
  transform: none;
}

.pdf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 4px 2px 2px;
}

.portal-signature-card {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #dbe2ea;
  border-radius: 10px;
  background: #fafbfd;
}

.portal-signature-card h4 {
  margin: 0 0 10px;
  font-size: 15px;
  color: #1d3a5f;
}

.signature-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.signature-flag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12.5px;
  font-weight: 600;
}

.signature-flag.flag-ok {
  background: #e3f5e9;
  color: #1e7b40;
}

.signature-flag.flag-pending {
  background: #fdf2dc;
  color: #9a6d1f;
}

.signature-note {
  font-size: 13px;
  color: #5a6b7c;
  margin: 8px 0;
}

.signature-error {
  font-size: 13px;
  color: #b3261e;
  margin: 8px 0;
}

.archivo-button {
  white-space: normal;
  text-align: left;
  min-height: 36px;
  padding: 4px 12px;
}

.archivo-button small {
  font-weight: 600;
  opacity: 0.75;
}

.archivo-factura {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* ======================================================== */
/* MODAL INFORME IPM                                        */
/* ======================================================== */

.report-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.62);
  backdrop-filter: blur(5px);
}

.report-modal {
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
}

.report-modal-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 26px;
  border-bottom: 1px solid #e8edf3;
  background: #ffffff;
}

.report-eyebrow {
  display: block;
  margin-bottom: 5px;
  color: #2563eb;
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.report-modal-header h2 {
  margin: 0;
  color: #172033;
  font-size: 1.3rem;
  font-weight: 800;
}

.report-modal-header p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 0.76rem;
}

.modal-close-button {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
}

.modal-close-button:hover {
  background: #eef2f7;
  color: #334155;
}

.report-modal-body {
  padding: 25px 26px;
}

.report-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.report-info-card {
  padding: 13px;
  border: 1px solid #e5eaf0;
  border-radius: 10px;
  background: #f8fafc;
}

.report-info-card span {
  display: block;
  color: #94a3b8;
  font-size: 0.59rem;
  font-weight: 700;
  text-transform: uppercase;
}

.report-info-card strong {
  display: block;
  margin-top: 4px;
  color: #334155;
  font-size: 0.78rem;
}

.report-text-section {
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #e5eaf0;
  border-radius: 11px;
  background: #ffffff;
}

.report-text-section.recommendation {
  border-color: #fde68a;
  background: #fffbeb;
}

.report-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 800;
}

.report-text-section.recommendation .report-section-title {
  color: #92400e;
}

.report-text-section p {
  margin: 9px 0 0;
  color: #64748b;
  font-size: 0.77rem;
  line-height: 1.65;
  white-space: pre-line;
}

.report-next-documents {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 17px;
  padding: 14px;
  border: 1px dashed #bfdbfe;
  border-radius: 11px;
  background: #f8fbff;
  color: #2563eb;
}

.report-next-documents > i {
  font-size: 1.3rem;
}

.report-next-documents strong {
  display: block;
  color: #1e40af;
  font-size: 0.75rem;
}

.report-next-documents span {
  display: block;
  margin-top: 2px;
  color: #64748b;
  font-size: 0.67rem;
}

.report-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 17px 26px;
  border-top: 1px solid #e8edf3;
  background: #f8fafc;
}

.modal-secondary-button {
  min-height: 39px;
  padding: 0 16px;
  border: 1px solid #d8e0ea;
  border-radius: 9px;
  background: #ffffff;
  color: #475569;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.modal-secondary-button:hover {
  background: #f1f5f9;
}

@media (max-width: 700px) {
  .document-card {
    grid-template-columns: 50px minmax(0, 1fr);
    align-items: flex-start;
  }

  .view-report-button {
    grid-column: 1 / -1;
    width: 100%;
    margin-top: 2px;
  }

  .report-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 450px) {
  .report-summary-grid {
    grid-template-columns: 1fr;
  }

  .report-modal-body,
  .report-modal-header,
  .report-modal-footer {
    padding-left: 18px;
    padding-right: 18px;
  }
  /* ======================================================== */
/* GALERÍA DE FOTOS */
/* ======================================================== */

.report-photos-section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e8edf3;
}

.report-photos-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 14px;
}

.report-photos-eyebrow {
  display: block;
  margin-bottom: 3px;
  color: #2563eb;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.report-photos-header h3 {
  margin: 0;
  color: #334155;
  font-size: 0.95rem;
  font-weight: 800;
}

.photos-count {
  padding: 5px 9px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.65rem;
  font-weight: 800;
}

.photos-loading {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 11px;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.75rem;
}

.photos-empty {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 11px;
  background: #f8fafc;
}

.photos-empty > i {
  font-size: 1.5rem;
  color: #94a3b8;
}

.photos-empty strong {
  display: block;
  color: #475569;
  font-size: 0.75rem;
}

.photos-empty span {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.66rem;
}

.photos-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.photo-card {
  overflow: hidden;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.photo-card:hover {
  transform: translateY(-2px);
  border-color: #bfdbfe;
  box-shadow:
    0 8px 20px
    rgba(15, 23, 42, 0.08);
}

.photo-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f1f5f9;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 1.5rem;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    rgba(15, 23, 42, 0.35);
  color: #ffffff;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.photo-caption {
  padding: 10px 11px;
}

.photo-caption strong {
  display: block;
  color: #334155;
  font-size: 0.71rem;
  font-weight: 800;
}

.photo-caption span {
  display: block;
  margin-top: 3px;
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.61rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}


/* ======================================================== */
/* VISOR DE FOTO */
/* ======================================================== */

.photo-viewer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 6000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 25px;

  background:
    rgba(15, 23, 42, 0.88);

  backdrop-filter:
    blur(6px);
}

.photo-viewer {
  position: relative;

  max-width: 1000px;
  max-height: 92vh;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 25px 80px
    rgba(0, 0, 0, 0.35);
}

.photo-viewer img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  display: block;
  background: #111827;
}

.photo-viewer-close {
  position: absolute;
  top: 12px;
  right: 12px;

  z-index: 2;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background:
    rgba(15, 23, 42, 0.75);

  color: #ffffff;
}

.photo-viewer-info {
  padding: 14px 17px;
}

.photo-viewer-info strong {
  display: block;
  color: #334155;
  font-size: 0.8rem;
}

.photo-viewer-info span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.68rem;
}


@media (max-width: 700px) {
  .photos-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 450px) {
  .photos-grid {
    grid-template-columns: 1fr;
  }
}
}
</style>
