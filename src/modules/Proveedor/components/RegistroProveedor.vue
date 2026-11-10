<template>
  <div class="supplier-form-page">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>

        <button
          type="button"
          class="back-link"
          @click="redirigirListadoProveedor"
        >
          <i class="bi bi-arrow-left"></i>

          Volver a proveedores
        </button>


        <span class="page-eyebrow">
          ABASTECIMIENTO
        </span>


        <h1>
          {{
            esEdicion
              ? "Editar proveedor"
              : "Nuevo proveedor"
          }}
        </h1>


        <p>
          {{
            esEdicion
              ? "Actualiza la información comercial del proveedor."
              : "Registra un nuevo proveedor para los productos utilizados por Fumidez."
          }}
        </p>

      </div>


      <span
        class="mode-badge"
        :class="
          esEdicion
            ? 'edit'
            : 'new'
        "
      >

        <i
          class="bi"
          :class="
            esEdicion
              ? 'bi-pencil-square'
              : 'bi-plus-circle'
          "
        ></i>


        {{
          esEdicion
            ? "Modo edición"
            : "Nuevo registro"
        }}

      </span>

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

        <strong>
          Operación exitosa
        </strong>

        <span>
          {{ mensajeConfirmacion }}
        </span>

      </div>

    </div>


    <div
      v-if="mensajeError"
      class="message error-message"
    >

      <i class="bi bi-exclamation-circle-fill"></i>

      <div>

        <strong>
          Revise la información
        </strong>

        <span>
          {{ mensajeError }}
        </span>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- LOADING -->
    <!-- ===================================================== -->

    <div
      v-if="cargandoInicial"
      class="loading-card"
    >

      <div class="spinner-border text-primary"></div>

      <span>
        Cargando información del proveedor...
      </span>

    </div>


    <!-- ===================================================== -->
    <!-- LAYOUT -->
    <!-- ===================================================== -->

    <div
      v-else
      class="form-layout"
    >

      <!-- =================================================== -->
      <!-- FORMULARIO -->
      <!-- =================================================== -->

      <section class="form-card">

        <div class="section-header">

          <div class="section-icon">
            <i class="bi bi-truck"></i>
          </div>


          <div>

            <h2>
              Información del proveedor
            </h2>

            <p>
              Complete los datos de identificación y pago.
            </p>

          </div>

        </div>


        <form
          novalidate
          @submit.prevent="guardarProveedor"
        >

          <!-- ================================================= -->
          <!-- NOMBRE -->
          <!-- ================================================= -->

          <div class="form-field">

            <label for="nombre">
              Nombre del proveedor
              <span class="required">*</span>
            </label>


            <div
              class="input-wrapper"
              :class="{
                invalid:
                  errores.nombre
              }"
            >

              <i class="bi bi-building"></i>

              <input
                id="nombre"
                v-model.trim="proveedor.nombre"
                type="text"
                maxlength="120"
                placeholder="Ej. Distribuidora Química Ecuador"
                @input="limpiarError('nombre')"
              />

            </div>


            <div class="field-footer">

              <span
                v-if="errores.nombre"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>

                {{ errores.nombre }}
              </span>


              <span
                v-else
                class="field-help"
              >
                Nombre comercial o razón social del proveedor.
              </span>


              <span class="character-counter">
                {{ proveedor.nombre.length }}/120
              </span>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- DIRECCIÓN -->
          <!-- ================================================= -->

          <div class="form-field">

            <label for="direccion">
              Dirección
              <span class="required">*</span>
            </label>


            <div
              class="input-wrapper"
              :class="{
                invalid:
                  errores.direccion
              }"
            >

              <i class="bi bi-geo-alt"></i>

              <input
                id="direccion"
                v-model.trim="proveedor.direccion"
                type="text"
                maxlength="200"
                placeholder="Ej. Av. 10 de Agosto N32-120, Quito"
                @input="limpiarError('direccion')"
              />

            </div>


            <div class="field-footer">

              <span
                v-if="errores.direccion"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>

                {{ errores.direccion }}
              </span>


              <span
                v-else
                class="field-help"
              >
                Dirección principal o comercial del proveedor.
              </span>


              <span class="character-counter">
                {{ proveedor.direccion.length }}/200
              </span>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- CUENTA -->
          <!-- ================================================= -->

          <div class="form-field">

            <label for="n_cuenta">
              Número de cuenta
              <span class="required">*</span>
            </label>


            <div
              class="input-wrapper"
              :class="{
                invalid:
                  errores.n_cuenta
              }"
            >

              <i class="bi bi-credit-card"></i>

              <input
                id="n_cuenta"
                v-model.trim="proveedor.n_cuenta"
                type="text"
                maxlength="40"
                autocomplete="off"
                placeholder="Número de cuenta bancaria"
                @input="limpiarError('n_cuenta')"
              />

            </div>


            <span
              v-if="errores.n_cuenta"
              class="field-error"
            >
              <i class="bi bi-exclamation-circle"></i>

              {{ errores.n_cuenta }}
            </span>


            <span
              v-else
              class="field-help"
            >
              Se utiliza como referencia para pagos al proveedor.
            </span>

          </div>


          <!-- ================================================= -->
          <!-- AVISO -->
          <!-- ================================================= -->

          <div class="security-note">

            <i class="bi bi-shield-lock"></i>


            <div>

              <strong>
                Información financiera
              </strong>


              <p>
                Verifica el número de cuenta antes de guardar.
                En el listado general se mostrará parcialmente
                oculto para reducir la exposición de información
                financiera.
              </p>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- ACCIONES -->
          <!-- ================================================= -->

          <div class="form-actions">

            <button
              type="button"
              class="secondary-button"
              :disabled="guardando"
              @click="redirigirListadoProveedor"
            >
              Cancelar
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
                class="bi"
                :class="
                  esEdicion
                    ? 'bi-check-lg'
                    : 'bi-plus-lg'
                "
              ></i>


              {{
                guardando
                  ? "Guardando..."
                  : esEdicion
                    ? "Guardar cambios"
                    : "Crear proveedor"
              }}

            </button>

          </div>

        </form>

      </section>


      <!-- =================================================== -->
      <!-- PREVIEW -->
      <!-- =================================================== -->

      <aside class="preview-column">

        <section class="preview-card">

          <div class="preview-header">

            <span>
              VISTA PREVIA
            </span>

            <i class="bi bi-eye"></i>

          </div>


          <div class="supplier-preview-avatar">

            {{ inicialesProveedor }}

          </div>


          <h3>
            {{
              proveedor.nombre
              ||
              "Nuevo proveedor"
            }}
          </h3>


          <p class="preview-address">

            <i class="bi bi-geo-alt"></i>

            {{
              proveedor.direccion
              ||
              "Dirección no registrada"
            }}

          </p>


          <div class="preview-divider"></div>


          <div class="preview-info">

            <span>
              Cuenta registrada
            </span>

            <strong>
              {{ cuentaVistaPrevia }}
            </strong>

          </div>


          <div class="preview-info">

            <span>
              Estado
            </span>

            <strong class="status-value">
              {{
                esEdicion
                  ? "Registrado"
                  : "Nuevo"
              }}
            </strong>

          </div>

        </section>


        <!-- ================================================= -->
        <!-- RECOMENDACIONES -->
        <!-- ================================================= -->

        <section class="tips-card">

          <div class="tips-title">

            <i class="bi bi-lightbulb"></i>

            <strong>
              Recomendaciones
            </strong>

          </div>


          <ul>

            <li>
              Utiliza el nombre comercial oficial del proveedor.
            </li>

            <li>
              Mantén actualizada su dirección principal.
            </li>

            <li>
              Confirma cualquier cambio de cuenta bancaria antes de actualizarlo.
            </li>

          </ul>

        </section>

      </aside>

    </div>

  </div>
</template>


<script>
import {
  crearProveedorFachada,
  obtenerProveedorFachada,
  actualizarProveedorFachada
} from "../helpers/proveedoresHelpers";


export default {

  name: "ProveedorFormulario",


  data() {

    return {

      proveedor: {
        id: null,
        nombre: "",
        direccion: "",
        n_cuenta: ""
      },

      proveedorId:
        this.$route.params.id
        || null,

      cargandoInicial: false,

      guardando: false,

      mensajeConfirmacion: "",

      mensajeError: "",

      errores: {
        nombre: "",
        direccion: "",
        n_cuenta: ""
      }

    };

  },


  computed: {

    // =====================================================
    // EDICIÓN
    // =====================================================

    esEdicion() {

      return Boolean(
        this.proveedorId
      );

    },


    // =====================================================
    // INICIALES
    // =====================================================

    inicialesProveedor() {

      const nombre =
        this.proveedor.nombre
          ?.trim();


      if (!nombre) {

        return "PR";

      }


      return nombre
        .split(/\s+/)
        .slice(0, 2)
        .map(
          palabra =>
            palabra.charAt(0)
        )
        .join("")
        .toUpperCase();

    },


    // =====================================================
    // CUENTA PREVIEW
    // =====================================================

    cuentaVistaPrevia() {

      const cuenta =
        String(
          this.proveedor.n_cuenta
          || ""
        )
          .replace(/\s/g, "");


      if (!cuenta) {

        return "Sin registrar";

      }


      if (cuenta.length <= 4) {

        return cuenta;

      }


      return (
        "•••• •••• "
        +
        cuenta.slice(-4)
      );

    }

  },


  async mounted() {

    if (this.esEdicion) {

      await this.cargarProveedor();

    }

  },


  methods: {

    // =====================================================
    // CARGAR PROVEEDOR
    // =====================================================

    async cargarProveedor() {

      this.cargandoInicial =
        true;

      this.mensajeError =
        "";


      try {

        const proveedor =
          await obtenerProveedorFachada(
            this.proveedorId
          );


        this.proveedor = {

          id:
            proveedor.id
            ?? this.proveedorId,

          nombre:
            proveedor.nombre
            || "",

          direccion:
            proveedor.direccion
            || "",

          n_cuenta:
            proveedor.n_cuenta
            || ""

        };


      } catch (error) {

        console.error(
          "Error cargando proveedor:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el proveedor solicitado.";

      } finally {

        this.cargandoInicial =
          false;

      }

    },


    // =====================================================
    // VALIDACIÓN
    // =====================================================

    validarFormulario() {

      this.errores = {
        nombre: "",
        direccion: "",
        n_cuenta: ""
      };


      let valido =
        true;


      if (
        !this.proveedor.nombre
        ||
        !this.proveedor.nombre.trim()
      ) {

        this.errores.nombre =
          "Ingrese el nombre del proveedor.";

        valido =
          false;

      }


      if (
        !this.proveedor.direccion
        ||
        !this.proveedor.direccion.trim()
      ) {

        this.errores.direccion =
          "Ingrese la dirección del proveedor.";

        valido =
          false;

      }


      if (
        !this.proveedor.n_cuenta
        ||
        !this.proveedor.n_cuenta.trim()
      ) {

        this.errores.n_cuenta =
          "Ingrese el número de cuenta.";

        valido =
          false;

      }


      return valido;

    },


    limpiarError(campo) {

      if (
        this.errores[campo]
      ) {

        this.errores[campo] =
          "";

      }


      this.mensajeError =
        "";

      this.mensajeConfirmacion =
        "";

    },


    // =====================================================
    // GUARDAR
    // =====================================================

    async guardarProveedor() {

      this.mensajeConfirmacion =
        "";

      this.mensajeError =
        "";


      if (
        !this.validarFormulario()
      ) {

        this.mensajeError =
          "Revise los campos marcados antes de continuar.";

        return;

      }


      this.guardando =
        true;


      const proveedorBody = {

        id:
          this.proveedor.id,

        nombre:
          this.proveedor.nombre.trim(),

        direccion:
          this.proveedor.direccion.trim(),

        n_cuenta:
          this.proveedor.n_cuenta.trim()

      };


      try {

        if (this.esEdicion) {

          await actualizarProveedorFachada(
            this.proveedorId,
            proveedorBody
          );


          this.mensajeConfirmacion =
            "El proveedor fue actualizado correctamente.";


          await this.cargarProveedor();


        } else {

          await crearProveedorFachada(
            proveedorBody
          );


          this.mensajeConfirmacion =
            "El proveedor fue creado correctamente.";


          this.resetProveedor();

        }


      } catch (error) {

        console.error(
          "Error guardando proveedor:",
          error
        );


        const mensajeBackend =
          typeof error.response?.data
          ===
          "string"
            ? error.response.data
            : null;


        this.mensajeError =
          mensajeBackend
          ||
          (
            this.esEdicion
              ? "No se pudo actualizar el proveedor."
              : "No se pudo crear el proveedor."
          );

      } finally {

        this.guardando =
          false;

      }

    },


    // =====================================================
    // RESET
    // =====================================================

    resetProveedor() {

      this.proveedor = {

        id: null,

        nombre: "",

        direccion: "",

        n_cuenta: ""

      };


      this.errores = {

        nombre: "",

        direccion: "",

        n_cuenta: ""

      };

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirListadoProveedor() {

      this.$router.push(
        "/proveedores_lista"
      );

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.supplier-form-page {
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
  max-width: 1200px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 27px 30px;

  border: 1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);
}


.back-link {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-bottom: 14px;

  padding: 0;

  border: none;

  background: transparent;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 700;

  cursor: pointer;
}


.back-link:hover {
  color: #2563eb;
}


.page-eyebrow {
  display: block;

  margin-bottom: 5px;

  color: #2563eb;

  font-size: 0.66rem;

  font-weight: 800;

  letter-spacing: 0.15em;
}


.page-header h1 {
  margin: 0;

  color: #123b6d;

  font-size: 1.9rem;

  font-weight: 800;
}


.page-header p {
  max-width: 620px;

  margin: 7px 0 0;

  color: #64748b;

  font-size: 0.84rem;

  line-height: 1.5;
}


/* ========================================================= */
/* BADGE */
/* ========================================================= */

.mode-badge {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  font-size: 0.7rem;

  font-weight: 800;
}


.mode-badge.new {
  border: 1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;
}


.mode-badge.edit {
  border: 1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;
}


/* ========================================================= */
/* LAYOUT */
/* ========================================================= */

.form-layout {
  max-width: 1200px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.6fr)
    minmax(280px, 0.75fr);

  gap: 20px;

  align-items: start;
}


/* ========================================================= */
/* CARDS */
/* ========================================================= */

.form-card,
.preview-card,
.tips-card {
  border: 1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 8px 24px
    rgba(15, 23, 42, 0.05);
}


.form-card {
  padding: 28px;
}


/* ========================================================= */
/* SECCIÓN */
/* ========================================================= */

.section-header {
  display: flex;

  align-items: center;

  gap: 13px;

  margin-bottom: 26px;

  padding-bottom: 19px;

  border-bottom: 1px solid #edf1f5;
}


.section-icon {
  width: 46px;
  height: 46px;

  min-width: 46px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 1.15rem;
}


.section-header h2 {
  margin: 0;

  color: #25364d;

  font-size: 1.05rem;

  font-weight: 800;
}


.section-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.7rem;
}


/* ========================================================= */
/* CAMPOS */
/* ========================================================= */

.form-field {
  margin-bottom: 21px;
}


.form-field label {
  display: block;

  margin-bottom: 7px;

  color: #475569;

  font-size: 0.72rem;

  font-weight: 800;
}


.required {
  color: #dc2626;
}


.input-wrapper {
  position: relative;

  height: 46px;

  display: flex;

  align-items: center;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.input-wrapper:focus-within {
  border-color: #93b4ed;

  background: #ffffff;

  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.06);
}


.input-wrapper.invalid {
  border-color: #fca5a5;

  background: #fffafa;
}


.input-wrapper > i {
  position: absolute;

  left: 13px;

  color: #94a3b8;

  pointer-events: none;
}


.input-wrapper input {
  width: 100%;

  height: 100%;

  padding: 0 13px 0 39px;

  border: none;

  outline: none;

  background: transparent;

  color: #334155;

  font-size: 0.79rem;
}


/* ========================================================= */
/* HELPERS */
/* ========================================================= */

.field-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-top: 5px;
}


.field-help,
.field-error,
.character-counter {
  display: block;

  margin-top: 5px;

  font-size: 0.62rem;
}


.field-help {
  color: #94a3b8;
}


.field-error {
  display: flex;

  align-items: center;

  gap: 4px;

  color: #dc2626;

  font-weight: 600;
}


.character-counter {
  flex-shrink: 0;

  color: #c0cad6;
}


/* ========================================================= */
/* SEGURIDAD */
/* ========================================================= */

.security-note {
  display: flex;

  align-items: flex-start;

  gap: 11px;

  margin-top: 6px;

  padding: 14px 15px;

  border: 1px solid #bfdbfe;

  border-radius: 11px;

  background: #f8fbff;
}


.security-note > i {
  margin-top: 1px;

  color: #2563eb;
}


.security-note strong {
  display: block;

  color: #1e40af;

  font-size: 0.72rem;
}


.security-note p {
  margin: 3px 0 0;

  color: #64748b;

  font-size: 0.67rem;

  line-height: 1.5;
}


/* ========================================================= */
/* ACCIONES */
/* ========================================================= */

.form-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 25px;

  padding-top: 20px;

  border-top: 1px solid #edf1f5;
}


.primary-button,
.secondary-button {
  min-height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding: 0 16px;

  border-radius: 10px;

  font-size: 0.74rem;

  font-weight: 800;

  cursor: pointer;
}


.primary-button {
  min-width: 150px;

  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;
}


.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
}


.primary-button:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}


.secondary-button {
  border: 1px solid #d8e0ea;

  background: #ffffff;

  color: #475569;
}


/* ========================================================= */
/* PREVIEW */
/* ========================================================= */

.preview-column {
  position: sticky;

  top: 100px;

  display: flex;

  flex-direction: column;

  gap: 15px;
}


.preview-card {
  padding: 23px;
}


.preview-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 20px;

  color: #94a3b8;

  font-size: 0.6rem;

  font-weight: 800;

  letter-spacing: 0.11em;
}


.supplier-preview-avatar {
  width: 68px;
  height: 68px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 16px;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #eff6ff,
      #dbeafe
    );

  color: #2563eb;

  font-size: 1.1rem;

  font-weight: 900;
}


.preview-card h3 {
  margin: 0;

  color: #25364d;

  font-size: 1.05rem;

  font-weight: 800;

  word-break: break-word;
}


.preview-address {
  display: flex;

  align-items: flex-start;

  gap: 6px;

  margin: 7px 0 0;

  color: #64748b;

  font-size: 0.7rem;

  line-height: 1.5;
}


.preview-divider {
  height: 1px;

  margin: 19px 0;

  background: #edf1f5;
}


.preview-info {
  margin-bottom: 14px;
}


.preview-info span {
  display: block;

  color: #94a3b8;

  font-size: 0.59rem;

  font-weight: 700;

  text-transform: uppercase;
}


.preview-info strong {
  display: block;

  margin-top: 4px;

  color: #334155;

  font-size: 0.76rem;
}


.status-value {
  color: #2563eb !important;
}


/* ========================================================= */
/* TIPS */
/* ========================================================= */

.tips-card {
  padding: 18px 20px;
}


.tips-title {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #475569;

  font-size: 0.72rem;
}


.tips-title i {
  color: #d97706;
}


.tips-card ul {
  margin: 12px 0 0;

  padding-left: 18px;

  color: #64748b;

  font-size: 0.66rem;

  line-height: 1.65;
}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.message {
  max-width: 1200px;

  margin: 0 auto 18px;

  display: flex;

  align-items: flex-start;

  gap: 10px;

  padding: 13px 15px;

  border-radius: 11px;
}


.message strong {
  display: block;

  font-size: 0.72rem;
}


.message span {
  display: block;

  margin-top: 2px;

  font-size: 0.67rem;
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
/* LOADING */
/* ========================================================= */

.loading-card {
  max-width: 1200px;

  min-height: 300px;

  margin: 0 auto;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 11px;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.74rem;
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 900px) {

  .form-layout {
    grid-template-columns: 1fr;
  }


  .preview-column {
    position: static;
  }

}


@media (max-width: 650px) {

  .supplier-form-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;

    padding: 21px;
  }


  .form-card {
    padding: 20px;
  }


  .form-actions {
    display: grid;

    grid-template-columns: 1fr;
  }


  .primary-button,
  .secondary-button {
    width: 100%;
  }

}

</style>