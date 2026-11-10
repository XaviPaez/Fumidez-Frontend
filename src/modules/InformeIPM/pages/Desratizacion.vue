<template>
  <div class="control-page">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div class="header-main">

        <button
          type="button"
          class="back-button"
          @click="redirigirListadoInformes"
        >
          <i class="bi bi-arrow-left"></i>
        </button>

        <div>
          <span class="eyebrow">
            CONTROL DE PLAGAS
          </span>

          <h1>
            Formulario IPM
          </h1>

          <p>
            Registra y administra los puntos de control asociados
            al informe técnico.
          </p>
        </div>

      </div>


      <div class="report-reference">

        <span>INFORME</span>

        <strong>
          #{{ informeId }}
        </strong>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- RESUMEN -->
    <!-- ===================================================== -->

    <section class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon blue">
          <i class="bi bi-geo-alt"></i>
        </div>

        <div>
          <span>Puntos registrados</span>
          <strong>{{ registros.length }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon red">
          <i class="bi bi-exclamation-triangle"></i>
        </div>

        <div>
          <span>Con daño</span>
          <strong>{{ totalDanio }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon orange">
          <i class="bi bi-activity"></i>
        </div>

        <div>
          <span>Con consumo</span>
          <strong>{{ totalConsumo }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon green">
          <i class="bi bi-check-circle"></i>
        </div>

        <div>
          <span>Sin consumo</span>
          <strong>{{ totalSinConsumo }}</strong>
        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- MENSAJES -->
    <!-- ===================================================== -->

    <div
      v-if="mensajeConfirmacion"
      class="message success-message"
    >
      <i class="bi bi-check-circle-fill"></i>

      <div>
        <strong>Operación exitosa</strong>
        <span>{{ mensajeConfirmacion }}</span>
      </div>

    </div>


    <div
      v-if="mensajeError"
      class="message error-message"
    >
      <i class="bi bi-exclamation-circle-fill"></i>

      <div>
        <strong>No se pudo completar la operación</strong>
        <span>{{ mensajeError }}</span>
      </div>

    </div>


    <!-- ===================================================== -->
    <!-- NUEVO REGISTRO -->
    <!-- ===================================================== -->

    <section class="form-card">
      <h2>Plantilla de puntos del local</h2>
      <p v-if="ordenPlantilla">
        Cliente: {{ ordenPlantilla.cliente.nombre }} ·
        {{ ordenPlantilla.idSucursal != null ? 'Sucursal #' + ordenPlantilla.idSucursal : 'Local principal' }}.
        {{ puntosPlantilla.length }} puntos predefinidos.
      </p>
      <p v-if="errorPlantilla" role="alert">{{ errorPlantilla }}</p>
      <button v-if="!puntosPlantilla.length && registros.length && ordenPlantilla"
        type="button" class="primary-button" :disabled="guardandoPlantilla"
        @click="guardarPlantillaLocal">
        {{ guardandoPlantilla ? 'Guardando...' : 'Guardar estos puntos como plantilla del local' }}
      </button>
      <button v-if="errorPlantilla && !visitaPlantilla.length" type="button"
        class="secondary-button" @click="cargarPlantillaLocal">Reintentar carga de plantilla</button>
      <div v-if="visitaPlantilla.length" class="table-responsive">
        <p>Completa las marcas de esta visita. No se copian resultados de inspecciones anteriores.</p>
        <table class="table">
          <thead><tr><th>Punto</th><th>Ubicación</th><th>Observaciones</th><th>Condición</th><th>CSP</th><th>Reemplazo pega-cebo</th></tr></thead>
          <tbody>
            <tr v-for="punto in visitaPlantilla" :key="punto.numeroPunto">
              <td>{{ punto.numeroPunto }}</td>
              <td>{{ punto.ubicacion }}</td>
              <td>{{ punto.observaciones }}</td>
              <td><select v-model="punto.consumo" :disabled="guardandoPlantilla || !!punto.id" aria-label="Condición del punto">
                <option value="" disabled>Seleccionar</option>
                <option v-for="opcion in consumo" :key="opcion" :value="opcion">{{ textoConsumo(opcion) }}</option>
              </select></td>
              <td><select v-model="punto.csp" :disabled="guardandoPlantilla || !!punto.id" aria-label="CSP del punto">
                <option value="" disabled>Seleccionar</option>
                <option v-for="opcion in csp" :key="opcion" :value="opcion">{{ opcion }}</option>
              </select></td>
              <td><input v-model="punto.reemplazoPegaCebo" type="checkbox"
                :disabled="guardandoPlantilla || !!punto.id" aria-label="Reemplazo pega-cebo" /></td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="primary-button" :disabled="guardandoPlantilla" @click="guardarVisitaPlantilla">
          {{ guardandoPlantilla ? 'Guardando...' : 'Guardar inspección de esta visita' }}
        </button>
      </div>
      <p v-else-if="!puntosPlantilla.length">Registra los puntos abajo y luego guárdalos como plantilla para futuras visitas a este local.</p>
    </section>

    <section v-if="!visitaPlantilla.length" class="form-card">

      <div class="section-header">

        <div class="section-icon-main">
          <i class="bi bi-plus-circle"></i>
        </div>

        <div>
          <span class="section-number">
            NUEVO PUNTO
          </span>

          <h2>
            Registrar punto de control
          </h2>

          <p>
            Ingresa las condiciones encontradas durante la inspección.
          </p>
        </div>

      </div>


      <form
        novalidate
        @submit.prevent="submitFormulario"
      >

        <div class="form-grid">

          <!-- UBICACIÓN -->

          <div class="field-group">

            <label for="ubicacion">
              Ubicación
              <span class="required">*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{ invalid: errores.ubicacion }"
            >
              <i class="bi bi-geo-alt"></i>

              <input
                id="ubicacion"
                v-model.trim="registro.ubicacion"
                type="text"
                maxlength="180"
                placeholder="Ej. Bodega - pared norte"
                @input="errores.ubicacion = ''"
              />
            </div>

            <span
              v-if="errores.ubicacion"
              class="field-error"
            >
              {{ errores.ubicacion }}
            </span>

            <span
              v-else
              class="field-help"
            >
              Identifica claramente dónde se encuentra el punto.
            </span>

          </div>


          <!-- CONSUMO -->

          <div class="field-group">

            <label for="consumo">
              Consumo / condición
              <span class="required">*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{ invalid: errores.consumo }"
            >
              <i class="bi bi-activity"></i>

              <select
                id="consumo"
                v-model="registro.consumo"
                @change="errores.consumo = ''"
              >
                <option
                  disabled
                  value=""
                >
                  Seleccione una opción
                </option>

                <option
                  v-for="opcion in consumo"
                  :key="opcion"
                  :value="opcion"
                >
                  {{ textoConsumo(opcion) }}
                </option>

              </select>
            </div>

            <span
              v-if="errores.consumo"
              class="field-error"
            >
              {{ errores.consumo }}
            </span>

            <span
              v-else
              class="field-help"
            >
              Registra si existe consumo, daño o ausencia de actividad.
            </span>

          </div>


          <!-- CSP -->

          <div class="field-group">

            <label for="csp">
              Tipo de CSP
              <span class="required">*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{ invalid: errores.csp }"
            >
              <i class="bi bi-box-seam"></i>

              <select
                id="csp"
                v-model="registro.csp"
                @change="errores.csp = ''"
              >
                <option
                  disabled
                  value=""
                >
                  Seleccione un tipo
                </option>

                <option
                  v-for="opcion in csp"
                  :key="opcion"
                  :value="opcion"
                >
                  {{ opcion }}
                </option>

              </select>
            </div>

            <span
              v-if="errores.csp"
              class="field-error"
            >
              {{ errores.csp }}
            </span>

            <span
              v-else
              class="field-help"
            >
              Tipo de punto o instalación inspeccionada.
            </span>

          </div>


          <!-- SWITCHES -->

          <div class="field-group">

            <label>
              Condiciones del punto
            </label>

            <div class="switches-card">

              <label class="switch-option">

                <div>
                  <strong>
                    Identificador de cordón
                  </strong>

                  <span>
                    El punto cuenta con identificación.
                  </span>
                </div>


                <input
                  v-model="registro.tipoIdentificadorCordon"
                  type="checkbox"
                />

                <span class="switch-control"></span>

              </label>


              <div class="switch-divider"></div>


              <label class="switch-option">

                <div>
                  <strong>
                    Reemplazo pega-cebo
                  </strong>

                  <span>
                    Se realizó reemplazo durante la visita.
                  </span>
                </div>


                <input
                  v-model="registro.reemplazoPegaCebo"
                  type="checkbox"
                />

                <span class="switch-control"></span>

              </label>

            </div>

          </div>


          <!-- OBSERVACIONES -->

          <div class="field-group full-width">

            <label for="observaciones">
              Observaciones
            </label>

            <textarea
              id="observaciones"
              v-model.trim="registro.observaciones"
              maxlength="600"
              rows="4"
              placeholder="Describe hallazgos, condiciones o acciones realizadas en este punto..."
            ></textarea>


            <div class="field-footer">

              <span>
                Campo opcional.
              </span>

              <span>
                {{ registro.observaciones.length }}/600
              </span>

            </div>

          </div>

        </div>


        <!-- PREVIEW -->

        <div class="new-record-preview">

          <div class="preview-icon">
            <i :class="iconoConsumo(registro.consumo)"></i>
          </div>


          <div>

            <span>
              VISTA PREVIA DEL PUNTO
            </span>

            <strong>
              {{
                registro.ubicacion
                || "Ubicación sin definir"
              }}
            </strong>

            <small>
              {{
                registro.csp
                || "CSP sin seleccionar"
              }}
              ·
              {{
                registro.consumo
                  ? textoConsumo(registro.consumo)
                  : "Condición sin definir"
              }}
            </small>

          </div>

        </div>


        <!-- ACTIONS -->

        <div class="form-actions">

          <button
            type="button"
            class="secondary-button"
            :disabled="guardando"
            @click="limpiarFormulario"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
            Limpiar
          </button>


          <button
            type="submit"
            class="primary-button"
            :disabled="guardando"
          >

            <span
              v-if="guardando"
              class="spinner-border spinner-border-sm"
            ></span>

            <i
              v-else
              class="bi bi-plus-lg"
            ></i>


            {{
              guardando
                ? "Guardando..."
                : "Agregar punto"
            }}

          </button>

        </div>

      </form>

    </section>


    <!-- ===================================================== -->
    <!-- LISTADO -->
    <!-- ===================================================== -->

    <section class="records-panel">

      <div class="panel-header">

        <div>
          <h2>
            Puntos de control
          </h2>

          <p>
            {{ registrosFiltrados.length }}
            {{
              registrosFiltrados.length === 1
                ? "registro"
                : "registros"
            }}
            asociados al informe.
          </p>
        </div>


        <div class="panel-actions">

          <button
            type="button"
            class="pdf-button"
            :disabled="
              generandoPdf
              ||
              registros.length === 0
            "
            @click="generatePDF"
          >

            <span
              v-if="generandoPdf"
              class="spinner-border spinner-border-sm"
            ></span>

            <i
              v-else
              class="bi bi-file-earmark-pdf"
            ></i>

            Formulario PDF
          </button>


          <button
            type="button"
            class="refresh-button"
            :disabled="cargandoRegistros"
            @click="consultarPorIdInforme"
          >
            <i
              class="bi bi-arrow-clockwise"
              :class="{ rotating: cargandoRegistros }"
            ></i>

            Actualizar
          </button>

        </div>

      </div>


      <!-- FILTROS -->

      <div class="filters">

        <div class="search-box">

          <i class="bi bi-search"></i>

          <input
            v-model.trim="filtro"
            type="text"
            placeholder="Buscar por ubicación, CSP, consumo u observaciones..."
          />

          <button
            v-if="filtro"
            type="button"
            @click="filtro = ''"
          >
            <i class="bi bi-x"></i>
          </button>

        </div>


        <select
          v-model="filtroConsumo"
          class="filter-select"
        >
          <option value="">
            Todas las condiciones
          </option>

          <option value="DAÑO">
            Daño
          </option>

          <option value="SI">
            Consumo: Sí
          </option>

          <option value="NO">
            Consumo: No
          </option>
        </select>


        <select
          v-model="filtroCsp"
          class="filter-select"
        >
          <option value="">
            Todos los CSP
          </option>

          <option
            v-for="opcion in csp"
            :key="opcion"
            :value="opcion"
          >
            {{ opcion }}
          </option>
        </select>

      </div>


      <!-- LOADING -->

      <div
        v-if="cargandoRegistros"
        class="loading-state"
      >
        <div class="spinner-border text-primary"></div>

        <span>
          Cargando puntos de control...
        </span>
      </div>


      <!-- EMPTY -->

      <div
        v-else-if="registrosFiltrados.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          <i class="bi bi-geo-alt"></i>
        </div>


        <h3>
          {{
            registros.length === 0
              ? "No hay puntos registrados"
              : "No encontramos resultados"
          }}
        </h3>


        <p>
          {{
            registros.length === 0
              ? "Utiliza el formulario superior para registrar el primer punto de control."
              : "Prueba modificando los filtros de búsqueda."
          }}
        </p>

      </div>


      <!-- CARDS -->

      <div
        v-else
        class="records-list"
      >

        <article
          v-for="(item, index) in registrosFiltrados"
          :key="item.id"
          class="record-card"
          :class="claseRegistro(item)"
        >

          <!-- NÚMERO / ESTADO -->

          <div class="record-status">

            <div
              class="record-number"
              :class="claseConsumo(item.consumo)"
            >
              {{ index + 1 }}
            </div>


            <span
              class="status-badge"
              :class="claseConsumo(item.consumo)"
            >
              <i :class="iconoConsumo(item.consumo)"></i>

              {{ textoConsumo(item.consumo) }}
            </span>

          </div>


          <!-- CONTENIDO -->

          <div class="record-content">

            <div class="record-main">

              <div class="record-title">

                <div>
                  <span>
                    UBICACIÓN
                  </span>

                  <strong>
                    {{ item.ubicacion || "Sin ubicación" }}
                  </strong>
                </div>


                <span class="csp-badge">
                  <i :class="iconoCsp(item.csp)"></i>

                  {{ item.csp || "Sin CSP" }}
                </span>

              </div>


              <p
                v-if="item.observaciones"
                class="record-observation"
              >
                {{ item.observaciones }}
              </p>


              <p
                v-else
                class="record-observation empty"
              >
                Sin observaciones.
              </p>


              <div class="record-flags">

                <span
                  :class="{
                    active: item.tipoIdentificadorCordon
                  }"
                >
                  <i class="bi bi-tag"></i>

                  Identificador de cordón

                  <strong>
                    {{
                      item.tipoIdentificadorCordon
                        ? "Sí"
                        : "No"
                    }}
                  </strong>
                </span>


                <span
                  :class="{
                    active: item.reemplazoPegaCebo
                  }"
                >
                  <i class="bi bi-arrow-repeat"></i>

                  Reemplazo pega-cebo

                  <strong>
                    {{
                      item.reemplazoPegaCebo
                        ? "Sí"
                        : "No"
                    }}
                  </strong>
                </span>

              </div>

            </div>


            <!-- ACCIONES -->

            <div class="record-actions">

              <button
                type="button"
                class="action-button edit"
                title="Editar punto"
                @click="abrirEdicion(item)"
              >
                <i class="bi bi-pencil-square"></i>
              </button>


              <button
                type="button"
                class="action-button duplicate"
                title="Duplicar punto"
                :disabled="duplicandoId === item.id"
                @click="duplicarRegistro(item)"
              >

                <span
                  v-if="duplicandoId === item.id"
                  class="spinner-border spinner-border-sm"
                ></span>

                <i
                  v-else
                  class="bi bi-copy"
                ></i>

              </button>


              <!--
                Por ahora NO mostramos eliminar porque tu helper
                todavía no tiene endpoint DELETE real.
              -->

            </div>

          </div>

        </article>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- AVISO DE ELIMINACIÓN -->
    <!-- ===================================================== -->

    <section class="delete-info">

      <i class="bi bi-shield-exclamation"></i>

      <div>
        <strong>
          Eliminación de registros
        </strong>

        <p>
          La API actual permite crear y actualizar puntos de control,
          pero todavía no expone una operación de eliminación.
          Por seguridad no ocultamos registros solamente en pantalla.
        </p>
      </div>

    </section>


    <!-- ===================================================== -->
    <!-- FOOTER ACTION -->
    <!-- ===================================================== -->

    <div class="page-footer">

      <button
        type="button"
        class="secondary-button"
        @click="redirigirListadoInformes"
      >
        <i class="bi bi-arrow-left"></i>
        Volver a informes
      </button>

    </div>


    <!-- ===================================================== -->
    <!-- MODAL EDICIÓN -->
    <!-- ===================================================== -->

    <div
      v-if="registroEditando"
      class="modal-backdrop-custom"
      @click.self="cerrarEdicion"
    >

      <div class="edit-modal">

        <div class="modal-header-custom">

          <div>

            <span>
              EDITAR PUNTO
            </span>

            <h3>
              {{ registroEditando.ubicacion || "Punto de control" }}
            </h3>

          </div>


          <button
            type="button"
            class="modal-close"
            :disabled="actualizando"
            @click="cerrarEdicion"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <form
          @submit.prevent="guardarEdicion"
        >

          <div class="modal-body-custom">

            <!-- UBICACION -->

            <div class="field-group">

              <label>
                Ubicación
                <span class="required">*</span>
              </label>

              <div class="input-wrapper">

                <i class="bi bi-geo-alt"></i>

                <input
                  v-model.trim="registroEditando.ubicacion"
                  type="text"
                  required
                />

              </div>

            </div>


            <div class="modal-grid">

              <!-- CONSUMO -->

              <div class="field-group">

                <label>
                  Consumo / condición
                </label>

                <select
                  v-model="registroEditando.consumo"
                  required
                >
                  <option
                    v-for="opcion in consumo"
                    :key="opcion"
                    :value="opcion"
                  >
                    {{ textoConsumo(opcion) }}
                  </option>
                </select>

              </div>


              <!-- CSP -->

              <div class="field-group">

                <label>
                  CSP
                </label>

                <select
                  v-model="registroEditando.csp"
                  required
                >
                  <option
                    v-for="opcion in csp"
                    :key="opcion"
                    :value="opcion"
                  >
                    {{ opcion }}
                  </option>
                </select>

              </div>

            </div>


            <!-- OBSERVACIONES -->

            <div class="field-group">

              <label>
                Observaciones
              </label>

              <textarea
                v-model.trim="registroEditando.observaciones"
                rows="4"
                maxlength="600"
              ></textarea>

            </div>


            <!-- SWITCHES -->

            <div class="edit-switches">

              <label class="checkbox-card">

                <input
                  v-model="registroEditando.tipoIdentificadorCordon"
                  type="checkbox"
                />

                <div>
                  <i class="bi bi-tag"></i>

                  <span>
                    Identificador de cordón
                  </span>
                </div>

              </label>


              <label class="checkbox-card">

                <input
                  v-model="registroEditando.reemplazoPegaCebo"
                  type="checkbox"
                />

                <div>
                  <i class="bi bi-arrow-repeat"></i>

                  <span>
                    Reemplazo pega-cebo
                  </span>
                </div>

              </label>

            </div>

          </div>


          <div class="modal-footer-custom">

            <button
              type="button"
              class="secondary-button"
              :disabled="actualizando"
              @click="cerrarEdicion"
            >
              Cancelar
            </button>


            <button
              type="submit"
              class="primary-button"
              :disabled="actualizando"
            >

              <span
                v-if="actualizando"
                class="spinner-border spinner-border-sm"
              ></span>

              <i
                v-else
                class="bi bi-check-lg"
              ></i>


              {{
                actualizando
                  ? "Guardando..."
                  : "Guardar cambios"
              }}

            </button>

          </div>

        </form>

      </div>

    </div>

  </div>
</template>


<script>
import { api } from "@/config/api";
import {
  actualizarFormularioFachada,
  consultarDesratizacionFachadaPorIdInforme,
  crearDesratizacionFachada
} from "../helpers/desratizacionHelper";

import {
  generateFormularioIPMFachada
} from "../helpers/generarInformeIPM";


export default {

  name: "RegistroComponent",


  data() {

    return {

      informeId:
        this.$route.params.id,


      registro: {
        tipoIdentificadorCordon: false,
        consumo: "",
        ubicacion: "",
        observaciones: "",
        reemplazoPegaCebo: false,
        csp: "",
        informeId: this.$route.params.id
      },


      registros: [],
      ordenPlantilla: null,
      puntosPlantilla: [],
      visitaPlantilla: [],
      guardandoPlantilla: false,
      errorPlantilla: "",


      consumo: [
        "DAÑO",
        "SI",
        "NO"
      ],


      csp: [
        "SUMIDERO",
        "CAJA DE REVISION",
        "DUCTOS ELECTRICOS"
      ],


      filtro: "",

      filtroConsumo: "",

      filtroCsp: "",


      cargandoRegistros: false,

      guardando: false,

      actualizando: false,

      generandoPdf: false,

      duplicandoId: null,


      registroEditando: null,


      mensajeConfirmacion: "",

      mensajeError: "",


      errores: {
        ubicacion: "",
        consumo: "",
        csp: ""
      }

    };

  },


  computed: {

    // =====================================================
    // INDICADORES
    // =====================================================

    totalDanio() {

      return this.registros.filter(
        registro =>
          registro.consumo === "DAÑO"
      ).length;

    },


    totalConsumo() {

      return this.registros.filter(
        registro =>
          registro.consumo === "SI"
      ).length;

    },


    totalSinConsumo() {

      return this.registros.filter(
        registro =>
          registro.consumo === "NO"
      ).length;

    },


    // =====================================================
    // FILTROS
    // =====================================================

    registrosFiltrados() {

      const texto =
        this.normalizarTexto(
          this.filtro
        );


      return this.registros.filter(
        registro => {

          if (
            this.filtroConsumo
            &&
            registro.consumo !==
            this.filtroConsumo
          ) {

            return false;

          }


          if (
            this.filtroCsp
            &&
            registro.csp !==
            this.filtroCsp
          ) {

            return false;

          }


          if (!texto) {

            return true;

          }


          const contenido =
            this.normalizarTexto(
              [
                registro.ubicacion,
                registro.observaciones,
                registro.csp,
                registro.consumo,
                registro.informeId
              ]
                .filter(Boolean)
                .join(" ")
            );


          return contenido.includes(
            texto
          );

        }
      );

    }

  },


  async mounted() {

    await this.consultarPorIdInforme();
    await this.cargarPlantillaLocal();

  },


  methods: {
    async cargarPlantillaLocal() {
      this.errorPlantilla = "";
      try {
        const { data: informe } = await api.get(`/informe/${this.informeId}`);
        const orden = informe.ordenDto;
        if (!orden?.cliente?.id) throw new Error("No se pudo identificar el local de la orden.");
        this.ordenPlantilla = orden;
        const { data } = await api.get(`/puntos-control/cliente/${orden.cliente.id}`, {
          params: orden.idSucursal != null ? { sucursalId: orden.idSucursal } : {}
        });
        this.puntosPlantilla = data;
        if (!this.registros.length && !this.mensajeError) {
          this.visitaPlantilla = data.map(punto => ({
            numeroPunto: punto.numeroPunto,
            ubicacion: punto.ubicacion,
            observaciones: punto.observaciones || "",
            csp: punto.csp || "",
            tipoIdentificadorCordon: Boolean(punto.tipoIdentificadorCordon),
            consumo: "",
            reemplazoPegaCebo: false,
            informeId: this.informeId
          }));
        }
      } catch (error) {
        this.errorPlantilla = error.response?.data?.message || error.message || "No se pudo cargar la plantilla del local.";
      }
    },

    async guardarPlantillaLocal() {
      if (this.guardandoPlantilla || !this.ordenPlantilla || !this.registros.length) return;
      this.guardandoPlantilla = true;
      this.errorPlantilla = "";
      try {
        const orden = this.ordenPlantilla;
        const { data: existentes } = await api.get(`/puntos-control/cliente/${orden.cliente.id}`, {
          params: orden.idSucursal != null ? { sucursalId: orden.idSucursal } : {}
        });
        for (const [index, registro] of this.registros.entries()) {
          if (existentes.some(punto => punto.numeroPunto === index + 1)) continue;
          await api.post("/puntos-control", {
            clienteId: orden.cliente.id,
            sucursalId: orden.idSucursal ?? null,
            numeroPunto: index + 1,
            ubicacion: registro.ubicacion,
            observaciones: registro.observaciones,
            csp: registro.csp,
            tipoIdentificadorCordon: registro.tipoIdentificadorCordon
          });
        }
        await this.cargarPlantillaLocal();
        this.mensajeConfirmacion = "Plantilla del local guardada. Se precargará en las próximas visitas sin copiar el consumo.";
      } catch (error) {
        this.errorPlantilla = "No se pudo completar la plantilla. Puedes reintentar sin duplicar los puntos guardados.";
      } finally {
        this.guardandoPlantilla = false;
      }
    },

    async guardarVisitaPlantilla() {
      if (this.guardandoPlantilla) return;
      if (this.visitaPlantilla.some(punto => !punto.consumo || !punto.csp)) {
        this.errorPlantilla = "Marca la condición y el CSP de todos los puntos antes de guardar.";
        return;
      }
      this.guardandoPlantilla = true;
      this.errorPlantilla = "";
      try {
        for (const punto of this.visitaPlantilla) {
          if (punto.id) continue;
          const { numeroPunto, ...body } = punto;
          const guardado = await crearDesratizacionFachada(body);
          punto.id = guardado.id;
        }
        this.visitaPlantilla = [];
        await this.consultarPorIdInforme();
        this.mensajeConfirmacion = "Inspección guardada para este informe. La plantilla y las visitas anteriores no se modificaron.";
      } catch (error) {
        this.errorPlantilla = "No se pudo completar la inspección. Reintenta para guardar los puntos pendientes.";
      } finally {
        this.guardandoPlantilla = false;
      }
    },

    // =====================================================
    // CONSULTAR
    // =====================================================

    async consultarPorIdInforme() {

      this.cargandoRegistros =
        true;

      this.mensajeError =
        "";


      try {

        const response =
          await consultarDesratizacionFachadaPorIdInforme(
            this.informeId
          );


        this.registros =
          Array.isArray(response)
            ? response
            : [];


      } catch (error) {

        console.error(
          "Error cargando Formulario IPM:",
          error
        );


        this.mensajeError =
          "No se pudieron cargar los puntos de control del informe.";

      } finally {

        this.cargandoRegistros =
          false;

      }

    },


    // =====================================================
    // CREAR
    // =====================================================

    validarRegistro() {

      this.errores = {
        ubicacion: "",
        consumo: "",
        csp: ""
      };


      let valido =
        true;


      if (
        !this.registro.ubicacion
        ||
        !this.registro.ubicacion.trim()
      ) {

        this.errores.ubicacion =
          "Ingrese la ubicación del punto.";

        valido =
          false;

      }


      if (!this.registro.consumo) {

        this.errores.consumo =
          "Seleccione la condición del punto.";

        valido =
          false;

      }


      if (!this.registro.csp) {

        this.errores.csp =
          "Seleccione el tipo de CSP.";

        valido =
          false;

      }


      return valido;

    },


    async submitFormulario() {

      this.mensajeConfirmacion =
        "";

      this.mensajeError =
        "";


      if (
        !this.validarRegistro()
      ) {

        this.mensajeError =
          "Complete los campos obligatorios antes de guardar.";

        return;

      }


      this.guardando =
        true;


      try {

        const body = {

          tipoIdentificadorCordon:
            Boolean(
              this.registro
                .tipoIdentificadorCordon
            ),

          consumo:
            this.registro.consumo,

          ubicacion:
            this.registro.ubicacion.trim(),

          observaciones:
            this.registro.observaciones?.trim()
            || "",

          reemplazoPegaCebo:
            Boolean(
              this.registro
                .reemplazoPegaCebo
            ),

          csp:
            this.registro.csp,

          informeId:
            this.informeId

        };


        await crearDesratizacionFachada(
          body
        );


        this.mensajeConfirmacion =
          "Punto de control registrado correctamente.";


        this.limpiarFormulario();


        await this.consultarPorIdInforme();


        setTimeout(
          () => {

            this.mensajeConfirmacion =
              "";

          },
          3500
        );


      } catch (error) {

        console.error(
          "Error creando punto:",
          error
        );


        this.mensajeError =
          "No se pudo guardar el punto de control.";

      } finally {

        this.guardando =
          false;

      }

    },


    limpiarFormulario() {

      this.registro = {
        tipoIdentificadorCordon: false,
        consumo: "",
        ubicacion: "",
        observaciones: "",
        reemplazoPegaCebo: false,
        csp: "",
        informeId: this.informeId
      };


      this.errores = {
        ubicacion: "",
        consumo: "",
        csp: ""
      };

    },


    // =====================================================
    // DUPLICAR
    // =====================================================

    async duplicarRegistro(item) {

      this.duplicandoId =
        item.id;

      this.mensajeError =
        "";


      try {

        /*
         * AQUÍ CORREGIMOS EL BUG ORIGINAL.
         *
         * No hacemos:
         * const newRow = item;
         *
         * porque eso comparte la misma referencia.
         */

        const nuevoRegistro = {

          tipoIdentificadorCordon:
            Boolean(
              item.tipoIdentificadorCordon
            ),

          consumo:
            item.consumo,

          ubicacion:
            item.ubicacion,

          observaciones:
            item.observaciones
            || "",

          reemplazoPegaCebo:
            Boolean(
              item.reemplazoPegaCebo
            ),

          csp:
            item.csp,

          informeId:
            item.informeId
            ||
            this.informeId

        };


        await crearDesratizacionFachada(
          nuevoRegistro
        );


        await this.consultarPorIdInforme();


        this.mensajeConfirmacion =
          "Punto duplicado correctamente.";


        setTimeout(
          () => {

            this.mensajeConfirmacion =
              "";

          },
          3000
        );


      } catch (error) {

        console.error(
          "Error duplicando punto:",
          error
        );


        this.mensajeError =
          "No se pudo duplicar el punto de control.";

      } finally {

        this.duplicandoId =
          null;

      }

    },


    // =====================================================
    // EDICIÓN
    // =====================================================

    abrirEdicion(item) {

      /*
       * Copia independiente.
       * No editamos directamente el objeto de la tabla
       * hasta que el backend responda correctamente.
       */

      this.registroEditando = {

        id:
          item.id,

        tipoIdentificadorCordon:
          Boolean(
            item.tipoIdentificadorCordon
          ),

        consumo:
          item.consumo
          || "",

        ubicacion:
          item.ubicacion
          || "",

        observaciones:
          item.observaciones
          || "",

        reemplazoPegaCebo:
          Boolean(
            item.reemplazoPegaCebo
          ),

        csp:
          item.csp
          || "",

        informeId:
          item.informeId
          ||
          this.informeId

      };

    },


    cerrarEdicion() {

      if (this.actualizando) {
        return;
      }


      this.registroEditando =
        null;

    },


    async guardarEdicion() {

      if (
        !this.registroEditando
        ||
        !this.registroEditando.id
      ) {

        return;

      }


      if (
        !this.registroEditando.ubicacion?.trim()
        ||
        !this.registroEditando.consumo
        ||
        !this.registroEditando.csp
      ) {

        this.mensajeError =
          "Ubicación, consumo y CSP son obligatorios.";

        return;

      }


      this.actualizando =
        true;

      this.mensajeError =
        "";


      try {

        const id =
          this.registroEditando.id;


        const body = {

          ...this.registroEditando,

          ubicacion:
            this.registroEditando
              .ubicacion
              .trim(),

          observaciones:
            this.registroEditando
              .observaciones
              ?.trim()
            || ""

        };


        await actualizarFormularioFachada(
          id,
          body
        );


        this.registroEditando =
          null;


        await this.consultarPorIdInforme();


        this.mensajeConfirmacion =
          "Punto de control actualizado correctamente.";


        setTimeout(
          () => {

            this.mensajeConfirmacion =
              "";

          },
          3000
        );


      } catch (error) {

        console.error(
          "Error actualizando punto:",
          error
        );


        this.mensajeError =
          "No se pudo actualizar el punto de control.";

      } finally {

        this.actualizando =
          false;

      }

    },


    // =====================================================
    // PDF
    // =====================================================

    async generatePDF() {

      this.generandoPdf =
        true;

      this.mensajeError =
        "";


      try {

        const registros =
          await consultarDesratizacionFachadaPorIdInforme(
            this.informeId
          );


        await generateFormularioIPMFachada(
          registros
        );


      } catch (error) {

        console.error(
          "Error generando Formulario IPM:",
          error
        );


        this.mensajeError =
          "No se pudo generar el Formulario IPM.";

      } finally {

        this.generandoPdf =
          false;

      }

    },


    // =====================================================
    // FORMATO VISUAL
    // =====================================================

    textoConsumo(valor) {

      const nombres = {

        "DAÑO":
          "Daño",

        "SI":
          "Consumo detectado",

        "NO":
          "Sin consumo"

      };


      return nombres[valor]
        ||
        "Sin definir";

    },


    claseConsumo(valor) {

      const clases = {

        "DAÑO":
          "condition-damage",

        "SI":
          "condition-positive",

        "NO":
          "condition-negative"

      };


      return clases[valor]
        ||
        "condition-default";

    },


    iconoConsumo(valor) {

      const iconos = {

        "DAÑO":
          "bi bi-exclamation-triangle-fill",

        "SI":
          "bi bi-activity",

        "NO":
          "bi bi-check-circle-fill"

      };


      return iconos[valor]
        ||
        "bi bi-question-circle";

    },


    iconoCsp(valor) {

      switch (valor) {

        case "SUMIDERO":
          return "bi bi-water";

        case "CAJA DE REVISION":
          return "bi bi-box";

        case "DUCTOS ELECTRICOS":
          return "bi bi-lightning-charge";

        default:
          return "bi bi-geo-alt";
      }

    },


    claseRegistro(item) {

      return {

        "record-damage":
          item.consumo === "DAÑO",

        "record-consumption":
          item.consumo === "SI",

        "record-clean":
          item.consumo === "NO"

      };

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
    // VOLVER
    // =====================================================

    redirigirListadoInformes() {

      this.$router.push(
        "/informe_lista"
      );

    }

  }

};
</script>


<style scoped>

.control-page {
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
  max-width: 1350px;
  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 26px 29px;

  border: 1px solid #e2e8f0;
  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15,23,42,0.06);
}


.header-main {
  display: flex;
  align-items: center;

  gap: 15px;
}


.back-button {
  width: 43px;
  height: 43px;
  min-width: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #dbe5f0;
  border-radius: 11px;

  background: #f8fafc;

  color: #2563eb;
}


.eyebrow {
  display: block;

  margin-bottom: 4px;

  color: #2563eb;

  font-size: 0.6rem;
  font-weight: 900;

  letter-spacing: 0.14em;
}


.page-header h1 {
  margin: 0;

  color: #123b6d;

  font-size: 1.75rem;
  font-weight: 800;
}


.page-header p {
  margin: 6px 0 0;

  color: #64748b;

  font-size: 0.76rem;
}


.report-reference {
  min-width: 110px;

  padding: 9px 13px;

  border: 1px solid #bfdbfe;
  border-radius: 10px;

  background: #eff6ff;

  text-align: center;
}


.report-reference span {
  display: block;

  color: #64748b;

  font-size: 0.52rem;
  font-weight: 800;
}


.report-reference strong {
  display: block;

  color: #2563eb;

  font-size: 0.86rem;
}


/* ========================================================= */
/* SUMMARY */
/* ========================================================= */

.summary-grid {
  max-width: 1350px;

  margin: 0 auto 20px;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 13px;
}


.summary-card {
  min-height: 95px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 17px;

  border: 1px solid #e2e8f0;
  border-radius: 15px;

  background: #ffffff;
}


.summary-icon {
  width: 46px;
  height: 46px;

  min-width: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;
}


.summary-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}


.summary-icon.red {
  background: #fef2f2;
  color: #dc2626;
}


.summary-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}


.summary-icon.green {
  background: #ecfdf3;
  color: #16a34a;
}


.summary-card span {
  display: block;

  color: #64748b;

  font-size: 0.65rem;
}


.summary-card strong {
  display: block;

  margin-top: 2px;

  color: #172033;

  font-size: 1.35rem;
  font-weight: 800;
}


/* ========================================================= */
/* CARDS */
/* ========================================================= */

.form-card,
.records-panel,
.delete-info {
  max-width: 1350px;

  margin: 0 auto 20px;

  border: 1px solid #e2e8f0;
  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 8px 25px
    rgba(15,23,42,0.045);
}


.form-card,
.records-panel {
  padding: 26px;
}


/* ========================================================= */
/* SECTION HEADER */
/* ========================================================= */

.section-header {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 22px;

  padding-bottom: 17px;

  border-bottom: 1px solid #edf1f5;
}


.section-icon-main {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: #eff6ff;

  color: #2563eb;
}


.section-number {
  display: block;

  color: #2563eb;

  font-size: 0.51rem;
  font-weight: 900;

  letter-spacing: 0.08em;
}


.section-header h2 {
  margin: 1px 0 0;

  color: #172033;

  font-size: 0.98rem;
  font-weight: 800;
}


.section-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.64rem;
}


/* ========================================================= */
/* FORM */
/* ========================================================= */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;
}


.full-width {
  grid-column: 1 / -1;
}


.field-group label {
  display: block;

  margin-bottom: 7px;

  color: #475569;

  font-size: 0.68rem;
  font-weight: 800;
}


.required {
  color: #dc2626;
}


.input-wrapper {
  position: relative;
}


.input-wrapper > i {
  position: absolute;

  top: 50%;
  left: 13px;

  transform: translateY(-50%);

  color: #94a3b8;

  pointer-events: none;
}


input,
select,
textarea {
  width: 100%;

  border: 1px solid #dce4ee;
  border-radius: 10px;

  background: #fbfdff;

  color: #334155;

  font-size: 0.76rem;

  outline: none;
}


input,
select {
  height: 44px;

  padding: 0 11px;
}


.input-wrapper input,
.input-wrapper select {
  padding-left: 38px;
}


textarea {
  padding: 11px;

  resize: vertical;
}


input:focus,
select:focus,
textarea:focus {
  border-color: #60a5fa;

  background: #ffffff;

  box-shadow:
    0 0 0 3px
    rgba(37,99,235,0.07);
}


.input-wrapper.invalid input,
.input-wrapper.invalid select {
  border-color: #fca5a5;

  background: #fffafa;
}


.field-help,
.field-error {
  display: block;

  margin-top: 5px;

  font-size: 0.58rem;
}


.field-help {
  color: #94a3b8;
}


.field-error {
  color: #dc2626;

  font-weight: 700;
}


.field-footer {
  display: flex;
  justify-content: space-between;

  margin-top: 5px;

  color: #94a3b8;

  font-size: 0.57rem;
}


/* ========================================================= */
/* SWITCHES */
/* ========================================================= */

.switches-card {
  overflow: hidden;

  border: 1px solid #dce4ee;
  border-radius: 10px;

  background: #fbfdff;
}


.switch-option {
  position: relative;

  min-height: 63px;

  display: flex !important;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin: 0 !important;

  padding: 11px 14px;

  cursor: pointer;
}


.switch-option strong {
  display: block;

  color: #334155;

  font-size: 0.66rem;
}


.switch-option div span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.55rem;
}


.switch-option input {
  display: none;
}


.switch-control {
  position: relative;

  width: 42px;
  height: 23px;
  min-width: 42px;

  border-radius: 999px;

  background: #cbd5e1;

  transition: 0.2s;
}


.switch-control::after {
  content: "";

  position: absolute;

  top: 3px;
  left: 3px;

  width: 17px;
  height: 17px;

  border-radius: 50%;

  background: #ffffff;

  box-shadow:
    0 1px 3px
    rgba(15,23,42,0.25);

  transition: 0.2s;
}


.switch-option input:checked + .switch-control {
  background: #2563eb;
}


.switch-option input:checked + .switch-control::after {
  transform: translateX(19px);
}


.switch-divider {
  height: 1px;

  background: #e8edf3;
}


/* ========================================================= */
/* PREVIEW */
/* ========================================================= */

.new-record-preview {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-top: 19px;

  padding: 12px;

  border: 1px solid #bfdbfe;
  border-radius: 10px;

  background: #f8fbff;
}


.preview-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #dbeafe;

  color: #2563eb;
}


.new-record-preview span {
  display: block;

  color: #2563eb;

  font-size: 0.5rem;
  font-weight: 900;
}


.new-record-preview strong {
  display: block;

  margin-top: 1px;

  color: #1e3a5f;

  font-size: 0.7rem;
}


.new-record-preview small {
  display: block;

  margin-top: 2px;

  color: #64748b;

  font-size: 0.57rem;
}


/* ========================================================= */
/* BUTTONS */
/* ========================================================= */

.form-actions {
  display: flex;
  justify-content: flex-end;

  gap: 9px;

  margin-top: 20px;

  padding-top: 17px;

  border-top: 1px solid #edf1f5;
}


.primary-button,
.secondary-button,
.pdf-button,
.refresh-button {
  min-height: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 0 13px;

  border-radius: 9px;

  font-size: 0.67rem;
  font-weight: 800;
}


.primary-button {
  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;
}


.secondary-button {
  border: 1px solid #dce4ee;

  background: #ffffff;

  color: #475569;
}


.pdf-button {
  border: 1px solid #fecaca;

  background: #fef2f2;

  color: #dc2626;
}


.refresh-button {
  border: 1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;
}


button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}


/* ========================================================= */
/* PANEL */
/* ========================================================= */

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 17px;
}


.panel-header h2 {
  margin: 0;

  color: #172033;

  font-size: 1rem;
  font-weight: 800;
}


.panel-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.62rem;
}


.panel-actions {
  display: flex;

  gap: 8px;
}


/* ========================================================= */
/* FILTERS */
/* ========================================================= */

.filters {
  display: grid;

  grid-template-columns:
    minmax(260px, 1fr)
    180px
    230px;

  gap: 9px;

  margin-bottom: 18px;
}


.search-box {
  position: relative;
}


.search-box > i {
  position: absolute;

  top: 50%;
  left: 13px;

  transform: translateY(-50%);

  color: #94a3b8;
}


.search-box input {
  padding:
    0 39px
    0 37px;
}


.search-box button {
  position: absolute;

  top: 50%;
  right: 6px;

  width: 29px;
  height: 29px;

  transform: translateY(-50%);

  border: none;

  background: transparent;

  color: #94a3b8;
}


/* ========================================================= */
/* RECORDS */
/* ========================================================= */

.records-list {
  display: flex;
  flex-direction: column;

  gap: 10px;
}


.record-card {
  display: grid;

  grid-template-columns:
    65px 1fr;

  gap: 0;

  overflow: hidden;

  border: 1px solid #e2e8f0;
  border-radius: 12px;

  background: #ffffff;
}


.record-damage {
  border-left: 4px solid #dc2626;
}


.record-consumption {
  border-left: 4px solid #ea580c;
}


.record-clean {
  border-left: 4px solid #16a34a;
}


.record-status {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  padding: 13px 8px;

  border-right: 1px solid #edf1f5;

  background: #fbfdff;
}


.record-number {
  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  font-size: 0.61rem;
  font-weight: 900;
}


.status-badge {
  display: inline-flex;
  align-items: center;

  gap: 4px;

  padding: 4px 6px;

  border-radius: 999px;

  font-size: 0.48rem;
  font-weight: 800;

  text-align: center;
}


.condition-damage {
  background: #fef2f2;

  color: #dc2626;
}


.condition-positive {
  background: #fff7ed;

  color: #ea580c;
}


.condition-negative {
  background: #ecfdf3;

  color: #16a34a;
}


.condition-default {
  background: #f1f5f9;

  color: #64748b;
}


.record-content {
  display: grid;

  grid-template-columns:
    1fr auto;

  gap: 12px;

  padding: 14px;
}


.record-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}


.record-title span:first-child {
  display: block;

  color: #94a3b8;

  font-size: 0.47rem;
  font-weight: 900;
}


.record-title strong {
  display: block;

  margin-top: 2px;

  color: #334155;

  font-size: 0.75rem;
}


.csp-badge {
  display: inline-flex !important;
  align-items: center;

  gap: 5px;

  padding: 5px 8px;

  border-radius: 999px;

  background: #eff6ff;

  color: #2563eb !important;

  font-size: 0.57rem !important;
  font-weight: 700 !important;
}


.record-observation {
  margin: 9px 0;

  color: #64748b;

  font-size: 0.63rem;
  line-height: 1.45;
}


.record-observation.empty {
  color: #a7b2c1;

  font-style: italic;
}


.record-flags {
  display: flex;
  flex-wrap: wrap;

  gap: 7px;
}


.record-flags > span {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 5px 7px;

  border-radius: 7px;

  background: #f1f5f9;

  color: #94a3b8;

  font-size: 0.54rem;
}


.record-flags span.active {
  background: #eff6ff;

  color: #2563eb;
}


.record-flags strong {
  font-size: 0.54rem;
}


.record-actions {
  display: flex;
  align-items: flex-start;

  gap: 6px;
}


.action-button {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #ffffff;
}


.action-button.edit {
  border: 1px solid #bfdbfe;

  color: #2563eb;
}


.action-button.duplicate {
  border: 1px solid #ddd6fe;

  color: #7c3aed;
}


/* ========================================================= */
/* DELETE INFO */
/* ========================================================= */

.delete-info {
  display: flex;

  gap: 10px;

  padding: 14px 16px;

  border-color: #fde68a;

  background: #fffbeb;
}


.delete-info > i {
  color: #d97706;
}


.delete-info strong {
  display: block;

  color: #92400e;

  font-size: 0.66rem;
}


.delete-info p {
  margin: 2px 0 0;

  color: #a16207;

  font-size: 0.58rem;
}


/* ========================================================= */
/* FOOTER */
/* ========================================================= */

.page-footer {
  max-width: 1350px;

  margin: 0 auto;

  display: flex;
  justify-content: flex-start;
}


/* ========================================================= */
/* MESSAGE / LOADING */
/* ========================================================= */

.message {
  max-width: 1350px;

  margin: 0 auto 16px;

  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 12px 14px;

  border-radius: 10px;
}


.message strong {
  display: block;

  font-size: 0.67rem;
}


.message span {
  display: block;

  margin-top: 2px;

  font-size: 0.6rem;
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


.loading-state,
.empty-state {
  min-height: 220px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 7px;

  text-align: center;
}


.empty-icon {
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;
}


.empty-state h3 {
  margin: 3px 0 0;

  color: #475569;

  font-size: 0.76rem;
}


.empty-state p {
  color: #94a3b8;

  font-size: 0.61rem;
}


/* ========================================================= */
/* MODAL */
/* ========================================================= */

.modal-backdrop-custom {
  position: fixed;

  inset: 0;

  z-index: 6000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background:
    rgba(15,23,42,0.65);

  backdrop-filter: blur(5px);
}


.edit-modal {
  width: 100%;
  max-width: 620px;

  overflow: hidden;

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 30px 80px
    rgba(15,23,42,0.3);
}


.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 19px 21px;

  border-bottom: 1px solid #e8edf3;
}


.modal-header-custom span {
  color: #2563eb;

  font-size: 0.52rem;
  font-weight: 900;
}


.modal-header-custom h3 {
  margin: 2px 0 0;

  color: #172033;

  font-size: 0.9rem;
}


.modal-close {
  width: 35px;
  height: 35px;

  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #f8fafc;

  color: #64748b;
}


.modal-body-custom {
  display: flex;
  flex-direction: column;

  gap: 15px;

  padding: 21px;
}


.modal-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 12px;
}


.edit-switches {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 9px;
}


.checkbox-card {
  display: flex !important;
  align-items: center;

  gap: 8px;

  margin: 0 !important;

  padding: 11px;

  border: 1px solid #e2e8f0;
  border-radius: 9px;

  background: #f8fafc;

  cursor: pointer;
}


.checkbox-card input {
  width: 16px;
  height: 16px;
}


.checkbox-card div {
  display: flex;
  align-items: center;

  gap: 6px;

  color: #475569;

  font-size: 0.61rem;
}


.modal-footer-custom {
  display: flex;
  justify-content: flex-end;

  gap: 8px;

  padding: 14px 21px;

  border-top: 1px solid #e8edf3;

  background: #fbfdff;
}


/* ========================================================= */
/* ANIMATION */
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

  .summary-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .filters {
    grid-template-columns:
      1fr 1fr;
  }


  .search-box {
    grid-column: 1 / -1;
  }

}


@media (max-width: 700px) {

  .control-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .report-reference {
    width: 100%;

    text-align: left;
  }


  .summary-grid,
  .form-grid,
  .modal-grid,
  .edit-switches {
    grid-template-columns: 1fr;
  }


  .full-width {
    grid-column: auto;
  }


  .filters {
    grid-template-columns: 1fr;
  }


  .search-box {
    grid-column: auto;
  }


  .panel-header {
    align-items: flex-start;

    flex-direction: column;
  }


  .panel-actions {
    width: 100%;

    display: grid;

    grid-template-columns:
      repeat(2, 1fr);
  }


  .record-card {
    grid-template-columns: 1fr;
  }


  .record-status {
    flex-direction: row;

    border-right: none;
    border-bottom: 1px solid #edf1f5;
  }


  .record-content {
    grid-template-columns: 1fr;
  }


  .record-title {
    align-items: flex-start;

    flex-direction: column;
  }


  .record-actions {
    justify-content: flex-end;
  }


  .form-actions,
  .modal-footer-custom {
    display: grid;

    grid-template-columns: 1fr;
  }


  .form-actions button,
  .modal-footer-custom button {
    width: 100%;
  }

}
</style>