<template>
  <div class="gasto-page">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <section class="page-header">

      <button
        type="button"
        class="back-button"
        @click="volver"
      >
        <i class="bi bi-arrow-left"></i>
      </button>

      <div>
        <span class="eyebrow">
          CONTROL FINANCIERO
        </span>

        <h1>
          {{ modoEdicion ? "Editar gasto" : "Registrar gasto" }}
        </h1>

        <p>
          {{
            modoEdicion
              ? "Actualiza la información del gasto registrado."
              : "Registra gastos operativos o generales realizados por Fumidez."
          }}
        </p>
      </div>

    </section>


    <!-- ===================================================== -->
    <!-- FORMULARIO -->
    <!-- ===================================================== -->

    <section class="form-card">

      <!-- CARGANDO GASTO -->

      <div
        v-if="cargandoGasto"
        class="loading-state"
      >
        <div class="spinner-border text-primary"></div>

        <span>
          Cargando información del gasto...
        </span>
      </div>


      <template v-else>

        <!-- ÉXITO -->

        <div
          v-if="mensajeExito"
          class="message success-message"
        >
          <i class="bi bi-check-circle-fill"></i>

          <div>
            <strong>
              {{ modoEdicion ? "Gasto actualizado" : "Gasto registrado" }}
            </strong>

            <span>
              {{ mensajeExito }}
            </span>
          </div>
        </div>


        <!-- ERROR -->

        <div
          v-if="mensajeError"
          class="message error-message"
        >
          <i class="bi bi-exclamation-circle-fill"></i>

          <div>
            <strong>
              {{
                modoEdicion
                  ? "No se pudo actualizar"
                  : "No se pudo guardar"
              }}
            </strong>

            <span>
              {{ mensajeError }}
            </span>
          </div>
        </div>


        <form
          novalidate
          @submit.prevent="guardar"
        >

          <!-- ================================================= -->
          <!-- MONTO -->
          <!-- ================================================= -->

          <div class="amount-section">

            <label for="monto">
              Monto del gasto
              <span>*</span>
            </label>

            <div
              class="amount-input"
              :class="{ invalid: errores.monto }"
            >
              <span>$</span>

              <input
                id="monto"
                v-model="gasto.monto"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                :disabled="guardando"
                @input="errores.monto = ''"
              />
            </div>

            <small v-if="errores.monto">
              {{ errores.monto }}
            </small>

          </div>


          <!-- ================================================= -->
          <!-- GRID -->
          <!-- ================================================= -->

          <div class="form-grid">

            <!-- CATEGORÍA -->

            <div class="field-group">

              <label for="categoria">
                Categoría
                <span>*</span>
              </label>

              <select
                id="categoria"
                v-model="gasto.categoria"
                :class="{ invalid: errores.categoria }"
                :disabled="guardando"
                @change="errores.categoria = ''"
              >
                <option
                  disabled
                  value=""
                >
                  Seleccione una categoría
                </option>

                <option
                  v-for="categoria in categorias"
                  :key="categoria.valor"
                  :value="categoria.valor"
                >
                  {{ categoria.texto }}
                </option>
              </select>

              <small v-if="errores.categoria">
                {{ errores.categoria }}
              </small>

            </div>


            <!-- FORMA DE PAGO -->

            <div class="field-group">

              <label for="formaPago">
                Forma de pago
              </label>

              <select
                id="formaPago"
                v-model="gasto.formaPago"
                :disabled="guardando"
              >
                <option value="">
                  No especificada
                </option>

                <option value="EFECTIVO">
                  Efectivo
                </option>

                <option value="TARJETA">
                  Tarjeta
                </option>

                <option value="TRANSFERENCIA">
                  Transferencia
                </option>

                <option value="OTRO">
                  Otro
                </option>
              </select>

            </div>


            <!-- ORDEN -->

            <div class="field-group full-width">

              <label for="orden">
                Orden relacionada
              </label>

              <select
                id="orden"
                v-model="gasto.idOrden"
                :disabled="guardando || cargandoOrdenes"
              >
                <option :value="null">
                  Gasto general - sin orden relacionada
                </option>

                <option
                  v-for="orden in ordenes"
                  :key="orden.id"
                  :value="orden.id"
                >
                  {{ textoOrden(orden) }}
                </option>
              </select>

              <small class="help-text">
                Selecciona una orden si el gasto ocurrió durante un trabajo.
              </small>

            </div>


            <!-- TIPO -->

            <div class="field-group full-width">

              <label>
                Tipo de gasto
              </label>

              <div class="type-selector">

                <button
                  type="button"
                  :class="{ active: gasto.operativo }"
                  :disabled="guardando"
                  @click="gasto.operativo = true"
                >
                  <i class="bi bi-truck"></i>

                  <div>
                    <strong>
                      Operativo
                    </strong>

                    <span>
                      Relacionado con servicios o trabajos.
                    </span>
                  </div>
                </button>


                <button
                  type="button"
                  :class="{ active: !gasto.operativo }"
                  :disabled="guardando"
                  @click="gasto.operativo = false"
                >
                  <i class="bi bi-building"></i>

                  <div>
                    <strong>
                      General
                    </strong>

                    <span>
                      Gasto administrativo o de empresa.
                    </span>
                  </div>
                </button>

              </div>

            </div>


            <!-- DESCRIPCIÓN -->

            <div class="field-group full-width">

              <label for="descripcion">
                Descripción
              </label>

              <textarea
                id="descripcion"
                v-model.trim="gasto.descripcion"
                rows="4"
                maxlength="500"
                :disabled="guardando"
                placeholder="Ej. Almuerzo durante servicio en cliente ABC..."
              ></textarea>

              <div class="field-footer">

                <span>
                  Describe brevemente el motivo del gasto.
                </span>

                <span>
                  {{ gasto.descripcion.length }}/500
                </span>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- COMPROBANTE -->
            <!-- ================================================= -->

            <div class="field-group full-width comprobante-section">

              <label for="comprobante">
                Comprobante
              </label>

              <p class="comprobante-description">
                Adjunta una factura, recibo o fotografía del gasto.
                Este campo es opcional.
              </p>


              <!-- COMPROBANTE EXISTENTE EN EDICIÓN -->

              <div
                v-if="
                  modoEdicion &&
                  tieneComprobanteExistente &&
                  !comprobante
                "
                class="existing-file"
              >

                <div class="existing-file-icon">
                  <i class="bi bi-file-earmark-check"></i>
                </div>

                <div class="existing-file-info">
                  <strong>
                    Comprobante actual
                  </strong>

                  <span>
                    {{
                      nombreComprobanteExistente ||
                      "Comprobante asociado al gasto"
                    }}
                  </span>

                  <small>
                    Si seleccionas otro archivo, el comprobante será reemplazado.
                  </small>
                </div>

                <button
                  type="button"
                  class="replace-file-button"
                  :disabled="guardando"
                  @click="abrirSelectorComprobante"
                >
                  <i class="bi bi-arrow-repeat"></i>
                  Reemplazar
                </button>

              </div>


              <!-- NUEVO ARCHIVO / SIN ARCHIVO -->

              <div
                v-else
                class="upload-box"
                :class="{ 'has-file': comprobante }"
                @click="abrirSelectorComprobante"
              >

                <div class="upload-icon">

                  <i
                    :class="
                      comprobante
                        ? 'bi bi-file-earmark-check'
                        : 'bi bi-cloud-arrow-up'
                    "
                  ></i>

                </div>


                <div class="upload-info">

                  <template v-if="!comprobante">

                    <strong>
                      Adjuntar comprobante
                    </strong>

                    <span>
                      Haz clic aquí para seleccionar un archivo
                    </span>

                    <small>
                      PDF, JPG, PNG o WEBP · máximo 10 MB
                    </small>

                  </template>


                  <template v-else>

                    <strong class="file-name">
                      {{ comprobante.name }}
                    </strong>

                    <span>
                      {{ formatearTamano(comprobante.size) }}
                    </span>

                    <small>
                      {{
                        modoEdicion
                          ? "Este archivo reemplazará al comprobante actual"
                          : "Archivo listo para guardar"
                      }}
                    </small>

                  </template>

                </div>


                <div class="upload-action">

                  <button
                    v-if="!comprobante"
                    type="button"
                    class="select-file-button"
                    :disabled="guardando"
                    @click.stop="abrirSelectorComprobante"
                  >
                    <i class="bi bi-paperclip"></i>
                    Seleccionar archivo
                  </button>


                  <button
                    v-else
                    type="button"
                    class="remove-file-button"
                    :disabled="guardando"
                    title="Quitar archivo seleccionado"
                    @click.stop="eliminarComprobante"
                  >
                    <i class="bi bi-trash"></i>
                  </button>

                </div>

              </div>


              <!-- INPUT REAL -->

              <input
                id="comprobante"
                ref="inputComprobante"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                hidden
                @change="seleccionarComprobante"
              />


              <div class="upload-help">

                <span>
                  <i class="bi bi-shield-check"></i>
                  El comprobante quedará asociado al gasto.
                </span>

                <span v-if="comprobante">
                  <i class="bi bi-check-circle-fill"></i>
                  Nuevo archivo seleccionado
                </span>

                <span
                  v-else-if="
                    modoEdicion &&
                    tieneComprobanteExistente
                  "
                >
                  <i class="bi bi-check-circle-fill"></i>
                  Comprobante actual conservado
                </span>

              </div>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- RESUMEN -->
          <!-- ================================================= -->

          <div class="preview-card">

            <div class="preview-icon">
              <i :class="iconoCategoria(gasto.categoria)"></i>
            </div>


            <div class="preview-content">

              <span>
                RESUMEN DEL GASTO
              </span>

              <strong>
                {{ nombreCategoria }}
              </strong>

              <small>
                {{
                  gasto.idOrden
                    ? `Asociado a OT-${gasto.idOrden}`
                    : "Gasto general"
                }}
              </small>

            </div>


            <div class="preview-extra">

              <span
                v-if="
                  comprobante ||
                  tieneComprobanteExistente
                "
                class="attachment-indicator"
              >
                <i class="bi bi-paperclip"></i>
                Comprobante
              </span>

              <strong class="preview-amount">
                {{ formatearMoneda(gasto.monto) }}
              </strong>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- ACCIONES -->
          <!-- ================================================= -->

          <div class="actions">

            <button
              type="button"
              class="secondary-button"
              :disabled="guardando"
              @click="volver"
            >
              <i class="bi bi-arrow-left"></i>
              Cancelar
            </button>


            <button
              type="button"
              class="secondary-button"
              :disabled="guardando"
              @click="restablecerFormulario"
            >
              <i class="bi bi-arrow-counterclockwise"></i>

              {{
                modoEdicion
                  ? "Restablecer"
                  : "Limpiar"
              }}
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
                class="bi bi-check-lg"
              ></i>

              {{
                guardando
                  ? (
                      modoEdicion
                        ? "Actualizando..."
                        : "Guardando..."
                    )
                  : (
                      modoEdicion
                        ? "Actualizar gasto"
                        : "Registrar gasto"
                    )
              }}

            </button>

          </div>

        </form>

      </template>

    </section>

  </div>
</template>


<script>

import {
  crearGastoFachada,
  obtenerGastoPorIdFachada,
  actualizarGastoFachada
} from "../helpers/gastosHelper";
import {
  consultarOrdenFachada
} from "../../OrdenTrabajo/Helpers/OrdenTrabajoHelper";

// =========================================================
// IMPORTANTE
// =========================================================
// Usa aquí el MISMO import de consultarOrdenFachada()
// que ya utilizabas antes en este componente.
//
// Ejemplo, SOLO si esa es la ruta real de tu proyecto:
//
// import {
//   consultarOrdenFachada
// } from "../../OrdenTrabajo/helpers/ordenTrabajoHelper";
//
// =========================================================


export default {

  name: "RegistrarGasto",


  data() {

    return {

      gasto: {
        monto: "",
        categoria: "",
        descripcion: "",
        formaPago: "",
        idOrden: null,
        operativo: true
      },


      categorias: [
        {
          valor: "ALIMENTACION",
          texto: "Alimentación"
        },
        {
          valor: "COMBUSTIBLE",
          texto: "Combustible"
        },
        {
          valor: "TRANSPORTE",
          texto: "Transporte"
        },
        {
          valor: "PEAJE",
          texto: "Peaje"
        },
        {
          valor: "PARQUEADERO",
          texto: "Parqueadero"
        },
        {
          valor: "HOSPEDAJE",
          texto: "Hospedaje"
        },
        {
          valor: "HERRAMIENTAS",
          texto: "Herramientas"
        },
        {
          valor: "MANTENIMIENTO",
          texto: "Mantenimiento"
        },
        {
          valor: "INSUMOS",
          texto: "Insumos"
        },
        {
          valor: "SERVICIOS",
          texto: "Servicios"
        },
        {
          valor: "OTROS",
          texto: "Otros"
        }
      ],


      ordenes: [],

      comprobante: null,

      guardando: false,

      cargandoOrdenes: false,

      cargandoGasto: false,

      mensajeExito: "",

      mensajeError: "",

      modoEdicion: false,

      gastoId: null,

      tieneComprobanteExistente: false,

      nombreComprobanteExistente: "",

      errores: {
        monto: "",
        categoria: ""
      }

    };

  },


  computed: {

    nombreCategoria() {

      const encontrada =
        this.categorias.find(
          categoria =>
            categoria.valor ===
            this.gasto.categoria
        );


      return encontrada
        ? encontrada.texto
        : "Categoría sin seleccionar";

    }

  },


  async mounted() {

    // =====================================================
    // DETERMINAR MODO
    // =====================================================

    const id =
      this.$route.params.id;


    if (id) {

      this.modoEdicion =
        true;

      this.gastoId =
        id;

    }


    // =====================================================
    // CARGAR DATOS
    // =====================================================

    await this.cargarOrdenes();


    if (
      this.modoEdicion
    ) {

      await this.cargarGasto();

    }

  },


  methods: {

    // =====================================================
    // CARGAR GASTO PARA EDICIÓN
    // =====================================================

    async cargarGasto() {

      if (
        !this.gastoId
      ) {
        return;
      }


      this.cargandoGasto =
        true;

      this.mensajeError =
        "";


      try {

        const gasto =
          await obtenerGastoPorIdFachada(
            this.gastoId
          );


        this.gasto = {

          monto:
            gasto.monto ?? "",

          categoria:
            gasto.categoria ?? "",

          descripcion:
            gasto.descripcion ?? "",

          formaPago:
            gasto.formaPago ?? "",

          idOrden:
            gasto.idOrden ?? null,

          operativo:
            gasto.operativo !== false

        };


        this.tieneComprobanteExistente =
          Boolean(
            gasto.comprobanteStorageKey
          );


        this.nombreComprobanteExistente =
          gasto.comprobanteNombre
          ||
          "";


      } catch (error) {

        console.error(
          "Error cargando gasto:",
          error
        );


        this.mensajeError =
          typeof error.response?.data === "string"
            ? error.response.data
            : "No se pudo cargar el gasto.";

      } finally {

        this.cargandoGasto =
          false;

      }

    },


    // =====================================================
    // COMPROBANTE
    // =====================================================

    abrirSelectorComprobante() {

      if (
        this.guardando
      ) {
        return;
      }


      this.$refs
        .inputComprobante
        ?.click();

    },


    seleccionarComprobante(event) {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
      ];


      if (
        !tiposPermitidos.includes(
          file.type
        )
      ) {

        this.mensajeError =
          "El comprobante debe ser PDF, JPG, PNG o WEBP.";


        event.target.value =
          "";


        return;

      }


      const maxSize =
        10 * 1024 * 1024;


      if (
        file.size > maxSize
      ) {

        this.mensajeError =
          "El comprobante no puede superar los 10 MB.";


        event.target.value =
          "";


        return;

      }


      this.mensajeError =
        "";


      this.comprobante =
        file;

    },


    eliminarComprobante() {

      // Esto solamente elimina el NUEVO archivo seleccionado.
      // No elimina el comprobante que ya existe en el backend.

      this.comprobante =
        null;


      if (
        this.$refs.inputComprobante
      ) {

        this.$refs.inputComprobante.value =
          "";

      }

    },


    formatearTamano(bytes) {

      if (!bytes) {
        return "0 KB";
      }


      if (
        bytes < 1024 * 1024
      ) {

        return (
          bytes / 1024
        ).toFixed(1) + " KB";

      }


      return (
        bytes /
        (1024 * 1024)
      ).toFixed(1) + " MB";

    },


    // =====================================================
    // ÓRDENES
    // =====================================================

    async cargarOrdenes() {

  this.cargandoOrdenes =
    true;

  try {

    const response =
      await consultarOrdenFachada();


    this.ordenes =
      Array.isArray(response)
        ? response
        : [];

  } catch (error) {

    console.error(
      "Error cargando órdenes:",
      error
    );


    this.ordenes =
      [];

  } finally {

    this.cargandoOrdenes =
      false;

  }

},

    // =====================================================
    // VALIDAR
    // =====================================================

    validar() {

      this.errores = {
        monto: "",
        categoria: ""
      };


      let valido =
        true;


      const monto =
        Number(
          this.gasto.monto
        );


      if (
        !this.gasto.monto ||
        !Number.isFinite(monto) ||
        monto <= 0
      ) {

        this.errores.monto =
          "Ingresa un monto mayor a cero.";


        valido =
          false;

      }


      if (
        !this.gasto.categoria
      ) {

        this.errores.categoria =
          "Selecciona una categoría.";


        valido =
          false;

      }


      return valido;

    },


    // =====================================================
    // GUARDAR / ACTUALIZAR
    // =====================================================

    async guardar() {

      this.mensajeExito =
        "";

      this.mensajeError =
        "";


      if (
        !this.validar()
      ) {
        return;
      }


      this.guardando =
        true;


      try {

        const body = {

          monto:
            Number(
              this.gasto.monto
            ),

          categoria:
            this.gasto.categoria,

          descripcion:
            this.gasto.descripcion
            ||
            "",

          formaPago:
            this.gasto.formaPago
            ||
            null,

          idOrden:
            this.gasto.idOrden
            !== null &&
            this.gasto.idOrden
            !== ""
              ? this.gasto.idOrden
              : null,

          operativo:
            Boolean(
              this.gasto.operativo
            )

        };


        // =================================================
        // EDITAR
        // =================================================

        if (
          this.modoEdicion
        ) {

          await actualizarGastoFachada(
            this.gastoId,
            body,
            this.comprobante
          );


          this.mensajeExito =
            "El gasto fue actualizado correctamente.";


        }

        // =================================================
        // CREAR
        // =================================================

        else {

          await crearGastoFachada(
            body,
            this.comprobante
          );


          this.mensajeExito =
            "El gasto fue registrado correctamente y ya forma parte del resumen mensual.";

        }


        setTimeout(
          () => {

            this.$router.push(
              "/gastos"
            );

          },
          1200
        );


      } catch (error) {

        console.error(
          this.modoEdicion
            ? "Error actualizando gasto:"
            : "Error registrando gasto:",
          error
        );


        this.mensajeError =
          typeof error.response?.data === "string"
            ? error.response.data
            : this.modoEdicion
              ? "No se pudo actualizar el gasto."
              : "No se pudo registrar el gasto.";


      } finally {

        this.guardando =
          false;

      }

    },


    // =====================================================
    // RESTABLECER
    // =====================================================

    async restablecerFormulario() {

      this.mensajeExito =
        "";

      this.mensajeError =
        "";


      this.errores = {
        monto: "",
        categoria: ""
      };


      this.comprobante =
        null;


      if (
        this.$refs.inputComprobante
      ) {

        this.$refs.inputComprobante.value =
          "";

      }


      // Si estamos editando, recuperamos los valores originales.

      if (
        this.modoEdicion
      ) {

        await this.cargarGasto();

        return;

      }


      // Si estamos registrando, limpiamos todo.

      this.gasto = {
        monto: "",
        categoria: "",
        descripcion: "",
        formaPago: "",
        idOrden: null,
        operativo: true
      };


      this.tieneComprobanteExistente =
        false;

      this.nombreComprobanteExistente =
        "";

    },


    // =====================================================
    // VOLVER
    // =====================================================

    volver() {

      this.$router.push(
        "/gastos"
      );

    },


    // =====================================================
    // VISUAL
    // =====================================================

    textoOrden(orden) {

      const numero =
        orden.numeroOrden
        ||
        orden.id;


      const cliente =
        orden.cliente?.nombre
        ||
        orden.nombreCliente
        ||
        "";


      const area =
        orden.area
        ||
        "";


      let texto =
        `OT-${numero}`;


      if (cliente) {

        texto +=
          ` · ${cliente}`;

      }


      if (area) {

        texto +=
          ` · ${area}`;

      }


      return texto;

    },


    formatearMoneda(valor) {

      return new Intl.NumberFormat(
        "es-EC",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
        }
      ).format(
        Number(
          valor || 0
        )
      );

    },


    iconoCategoria(categoria) {

      const iconos = {

        ALIMENTACION:
          "bi bi-cup-hot",

        COMBUSTIBLE:
          "bi bi-fuel-pump",

        TRANSPORTE:
          "bi bi-car-front",

        PEAJE:
          "bi bi-signpost",

        PARQUEADERO:
          "bi bi-p-square",

        HOSPEDAJE:
          "bi bi-building",

        HERRAMIENTAS:
          "bi bi-tools",

        MANTENIMIENTO:
          "bi bi-wrench-adjustable",

        INSUMOS:
          "bi bi-box-seam",

        SERVICIOS:
          "bi bi-receipt",

        OTROS:
          "bi bi-three-dots"

      };


      return (
        iconos[categoria]
        ||
        "bi bi-wallet2"
      );

    }

  }

};
</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* ========================================================= */
/* GLOBAL */
/* ========================================================= */

.gasto-page {
  min-height: 100vh;
  padding: 34px;

  background:
    linear-gradient(
      135deg,
      #f8fbff 0%,
      #eef4fb 100%
    );
}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.page-header {
  max-width: 1000px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 27px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 9px 28px rgba(15, 23, 42, 0.055);
}


.back-button {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dce4ee;
  border-radius: 10px;
  background: #f8fafc;
  color: #2563eb;
  cursor: pointer;
}


.back-button:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}


.eyebrow {
  display: block;
  color: #2563eb;
  font-size: 0.59rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}


.page-header h1 {
  margin: 3px 0 0;
  color: #123b6d;
  font-size: 1.6rem;
  font-weight: 900;
}


.page-header p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 0.69rem;
}


/* ========================================================= */
/* FORM CARD */
/* ========================================================= */

.form-card {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 9px 28px rgba(15, 23, 42, 0.05);
}


/* ========================================================= */
/* CARGANDO */
/* ========================================================= */

.loading-state {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #64748b;
  font-size: 0.67rem;
}


/* ========================================================= */
/* MONTO */
/* ========================================================= */

.amount-section {
  margin-bottom: 25px;
  padding-bottom: 24px;
  border-bottom: 1px solid #edf1f5;
}


.amount-section label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 0.7rem;
  font-weight: 900;
}


.amount-section label span,
.field-group label span {
  color: #dc2626;
}


.amount-input {
  height: 68px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  border-radius: 13px;
  background: #fbfdff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}


.amount-input > span {
  padding-left: 18px;
  color: #64748b;
  font-size: 1.3rem;
  font-weight: 900;
}


.amount-input input {
  width: 100%;
  height: 100%;
  padding: 0 17px;
  border: none;
  background: transparent;
  color: #172033;
  font-size: 1.65rem;
  font-weight: 900;
  outline: none;
}


.amount-input input::placeholder {
  color: #c0cad7;
}


.amount-input:focus-within {
  border-color: #2563eb;
  box-shadow:
    0 0 0 4px
    rgba(37, 99, 235, 0.08);
}


.amount-input.invalid {
  border-color: #ef4444;
}


.amount-section > small {
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 0.6rem;
  font-weight: 700;
}


/* ========================================================= */
/* GRID */
/* ========================================================= */

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 18px;
}


.full-width {
  grid-column:
    1 / -1;
}


/* ========================================================= */
/* CAMPOS */
/* ========================================================= */

.field-group label {
  display: block;
  margin-bottom: 7px;
  color: #334155;
  font-size: 0.67rem;
  font-weight: 900;
}


.field-group select,
.field-group textarea {
  width: 100%;
  border: 1px solid #d7e0ea;
  border-radius: 10px;
  background: #fbfdff;
  color: #334155;
  font-size: 0.73rem;
  outline: none;
}


.field-group select {
  height: 45px;
  padding: 0 11px;
}


.field-group textarea {
  padding: 11px;
  resize: vertical;
}


.field-group select:focus,
.field-group textarea:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.07);
}


.field-group select.invalid {
  border-color: #ef4444;
}


.field-group > small {
  display: block;
  margin-top: 5px;
  color: #dc2626;
  font-size: 0.58rem;
  font-weight: 700;
}


.help-text {
  color: #94a3b8 !important;
  font-weight: 500 !important;
}


.field-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  color: #94a3b8;
  font-size: 0.56rem;
}


/* ========================================================= */
/* TIPO */
/* ========================================================= */

.type-selector {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 10px;
}


.type-selector button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px;
  border: 1px solid #dce4ee;
  border-radius: 10px;
  background: #fbfdff;
  color: #64748b;
  text-align: left;
  cursor: pointer;
}


.type-selector button > i {
  font-size: 1.05rem;
}


.type-selector button strong {
  display: block;
  color: #475569;
  font-size: 0.65rem;
}


.type-selector button span {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.54rem;
}


.type-selector button.active {
  border-color: #93c5fd;
  background: #eff6ff;
  color: #2563eb;
}


.type-selector button.active strong {
  color: #1d4ed8;
}


/* ========================================================= */
/* COMPROBANTE */
/* ========================================================= */

.comprobante-section {
  margin-top: 2px;
}


.comprobante-description {
  margin: -2px 0 9px;
  color: #94a3b8;
  font-size: 0.58rem;
  line-height: 1.45;
}


.upload-box,
.existing-file {
  width: 100%;
  min-height: 105px;
  display: grid;
  grid-template-columns:
    52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 15px;
  padding: 17px 18px;
  border-radius: 13px;
}


.upload-box {
  border: 1.5px dashed #aebfd2;

  background:
    linear-gradient(
      135deg,
      #f8fbff,
      #f4f8fd
    );

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.upload-box:hover {
  border-color: #60a5fa;
  background: #f0f6ff;

  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.04);
}


.upload-box.has-file {
  border-style: solid;
  border-color: #86efac;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #f8fffa
    );
}


.upload-icon,
.existing-file-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.3rem;
}


.upload-icon {
  background: #dbeafe;
  color: #2563eb;
}


.has-file .upload-icon {
  background: #dcfce7;
  color: #16a34a;
}


/* EXISTENTE */

.existing-file {
  border: 1px solid #bbf7d0;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #f8fffa
    );
}


.existing-file-icon {
  background: #dcfce7;
  color: #16a34a;
}


.existing-file-info {
  min-width: 0;
}


.existing-file-info strong,
.existing-file-info span,
.existing-file-info small {
  display: block;
}


.existing-file-info strong {
  color: #166534;
  font-size: 0.72rem;
  font-weight: 900;
}


.existing-file-info span {
  overflow: hidden;
  margin-top: 4px;
  color: #475569;
  font-size: 0.61rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.existing-file-info small {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.54rem;
}


.replace-file-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid #bbf7d0;
  border-radius: 9px;
  background: #ffffff;
  color: #15803d;
  font-size: 0.59rem;
  font-weight: 900;
  cursor: pointer;
}


.replace-file-button:hover:not(:disabled) {
  background: #f0fdf4;
}


/* INFO UPLOAD */

.upload-info {
  min-width: 0;
}


.upload-info strong,
.upload-info span,
.upload-info small {
  display: block;
}


.upload-info strong {
  overflow: hidden;
  color: #26364b;
  font-size: 0.72rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.upload-info span {
  margin-top: 4px;
  color: #64748b;
  font-size: 0.61rem;
  font-weight: 600;
}


.upload-info small {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.55rem;
}


.upload-action {
  display: flex;
  align-items: center;
}


.select-file-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 13px;
  border: 1px solid #bfdbfe;
  border-radius: 9px;
  background: #ffffff;
  color: #2563eb;
  font-size: 0.61rem;
  font-weight: 900;
  cursor: pointer;
}


.select-file-button:hover {
  background: #eff6ff;
}


.remove-file-button {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #ffffff;
  color: #dc2626;
  cursor: pointer;
}


.remove-file-button:hover {
  background: #fef2f2;
}


.upload-help {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 7px;
  color: #94a3b8;
  font-size: 0.53rem;
}


.upload-help span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}


.upload-help span:first-child i {
  color: #2563eb;
}


.upload-help span:not(:first-child) i {
  color: #16a34a;
}


/* ========================================================= */
/* PREVIEW */
/* ========================================================= */

.preview-card {
  display: grid;
  grid-template-columns:
    43px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  margin-top: 22px;
  padding: 13px;
  border: 1px solid #bfdbfe;
  border-radius: 11px;
  background: #f8fbff;
}


.preview-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
  font-size: 1rem;
}


.preview-content span {
  display: block;
  color: #2563eb;
  font-size: 0.49rem;
  font-weight: 900;
}


.preview-content strong {
  display: block;
  margin-top: 1px;
  color: #334155;
  font-size: 0.7rem;
}


.preview-content small {
  display: block;
  margin-top: 2px;
  color: #64748b;
  font-size: 0.56rem;
}


.preview-extra {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}


.attachment-indicator {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #16a34a;
  font-size: 0.49rem;
  font-weight: 800;
}


.preview-amount {
  color: #b91c1c;
  font-size: 0.9rem;
  font-weight: 900;
}


/* ========================================================= */
/* ACCIONES */
/* ========================================================= */

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 22px;
  padding-top: 19px;
  border-top: 1px solid #edf1f5;
}


.primary-button,
.secondary-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 15px;
  border-radius: 9px;
  font-size: 0.67rem;
  font-weight: 900;
  cursor: pointer;
}


.primary-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
}


.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
  border-color: #1d4ed8;
}


.secondary-button {
  border: 1px solid #dce4ee;
  background: #ffffff;
  color: #475569;
}


.secondary-button:hover:not(:disabled) {
  background: #f8fafc;
}


button:disabled,
select:disabled,
textarea:disabled,
input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.message {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 10px;
}


.message strong {
  display: block;
  font-size: 0.65rem;
}


.message span {
  display: block;
  margin-top: 2px;
  font-size: 0.58rem;
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
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 700px) {

  .gasto-page {
    padding: 16px;
  }


  .page-header {
    padding: 20px;
  }


  .form-card {
    padding: 20px;
  }


  .form-grid,
  .type-selector {
    grid-template-columns: 1fr;
  }


  .full-width {
    grid-column: auto;
  }


  .upload-box,
  .existing-file {
    grid-template-columns:
      46px minmax(0, 1fr);

    min-height: auto;
    padding: 14px;
  }


  .upload-icon,
  .existing-file-icon {
    width: 44px;
    height: 44px;
  }


  .upload-action,
  .replace-file-button {
    grid-column:
      1 / -1;
  }


  .select-file-button,
  .replace-file-button {
    width: 100%;
  }


  .preview-card {
    grid-template-columns:
      42px 1fr;
  }


  .preview-extra {
    grid-column:
      1 / -1;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding-top: 8px;

    border-top:
      1px solid #dbeafe;
  }


  .actions {
    display: grid;
    grid-template-columns: 1fr;
  }


  .actions button {
    width: 100%;
  }

}
</style>