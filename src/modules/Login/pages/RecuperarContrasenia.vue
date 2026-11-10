<template>
  <div class="password-page">

    <main class="password-main">

      <div class="background-overlay"></div>


      <section class="recovery-card">

        <!-- ================================================= -->
        <!-- CABECERA -->
        <!-- ================================================= -->

        <div class="recovery-header">

          <div class="recovery-icon">
            <i class="bi bi-shield-lock"></i>
          </div>


          <span class="recovery-eyebrow">
            RECUPERACIÓN DE ACCESO
          </span>


          <h1>
            Recuperar contraseña
          </h1>


          <p>
            Ingresa el correo asociado a tu cuenta.
            Te enviaremos las instrucciones para restablecer tu contraseña.
          </p>

        </div>


        <!-- ================================================= -->
        <!-- MENSAJE ÉXITO -->
        <!-- ================================================= -->

        <div
          v-if="mensajeConfirmacion"
          class="status-message success-message"
        >

          <div class="status-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>


          <div>
            <strong>
              Solicitud enviada
            </strong>

            <span>
              {{ mensajeConfirmacion }}
            </span>
          </div>

        </div>


        <!-- ================================================= -->
        <!-- MENSAJE ERROR -->
        <!-- ================================================= -->

        <div
          v-if="mensajeError"
          class="status-message error-message"
        >

          <div class="status-icon">
            <i class="bi bi-exclamation-circle-fill"></i>
          </div>


          <div>
            <strong>
              No se pudo completar la solicitud
            </strong>

            <span>
              {{ mensajeError }}
            </span>
          </div>

        </div>


        <!-- ================================================= -->
        <!-- FORMULARIO -->
        <!-- ================================================= -->

        <form
          v-if="!mensajeConfirmacion"
          novalidate
          @submit.prevent="solicitarCambio"
        >

          <div class="form-field">

            <label for="ipt-email">
              Correo electrónico
            </label>


            <div
              class="input-wrapper"
              :class="{ invalid: emailError }"
            >

              <i class="bi bi-envelope input-icon"></i>


              <input
                id="ipt-email"
                ref="emailInput"
                v-model.trim="email"
                type="email"
                autocomplete="email"
                placeholder="nombre@correo.com"
                :disabled="cargando"
                @input="limpiarError"
              />


              <i
                v-if="emailValido"
                class="bi bi-check-circle-fill valid-icon"
              ></i>

            </div>


            <span
              v-if="emailError"
              class="field-error"
            >
              <i class="bi bi-exclamation-circle"></i>

              Ingresa un correo electrónico válido.
            </span>

          </div>


          <!-- INFORMACIÓN -->

          <div class="security-info">

            <i class="bi bi-info-circle"></i>

            <span>
              Por seguridad, usa el mismo correo registrado
              en tu cuenta de Fumidez.
            </span>

          </div>


          <!-- BOTÓN -->

          <button
            type="submit"
            class="primary-button"
            :disabled="cargando"
          >

            <span
              v-if="cargando"
              class="spinner-border spinner-border-sm"
            ></span>


            <i
              v-else
              class="bi bi-send"
            ></i>


            {{
              cargando
                ? "Enviando solicitud..."
                : "Enviar enlace de recuperación"
            }}

          </button>

        </form>


        <!-- ================================================= -->
        <!-- ÉXITO -->
        <!-- ================================================= -->

        <div
          v-if="mensajeConfirmacion"
          class="success-actions"
        >

          <div class="mail-help">

            <i class="bi bi-envelope-check"></i>

            <div>
              <strong>
                Revisa tu correo
              </strong>

              <span>
                Si no encuentras el mensaje, revisa también
                la carpeta de spam o correo no deseado.
              </span>
            </div>

          </div>


          <button
            type="button"
            class="primary-button"
            @click="redirigirLogin"
          >
            <i class="bi bi-box-arrow-in-right"></i>

            Volver a iniciar sesión
          </button>


          <button
            type="button"
            class="secondary-button"
            @click="solicitarOtroCorreo"
          >
            <i class="bi bi-arrow-counterclockwise"></i>

            Usar otro correo
          </button>

        </div>


        <!-- ================================================= -->
        <!-- VOLVER -->
        <!-- ================================================= -->

        <button
          v-if="!mensajeConfirmacion"
          type="button"
          class="back-login-button"
          :disabled="cargando"
          @click="redirigirLogin"
        >
          <i class="bi bi-arrow-left"></i>

          Volver al inicio de sesión
        </button>

      </section>

    </main>

  </div>
</template>


<script>
import {
  recuperarContraseniaFachada
} from "../helpers/passwordHelper";


export default {

  name: "RecuperarContrasenia",


  data() {

    return {

      email: "",

      mensajeConfirmacion: "",

      mensajeError: "",

      cargando: false,

      emailError: false

    };

  },


  computed: {

    emailValido() {

      if (!this.email) {
        return false;
      }


      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.email
      );

    }

  },


  mounted() {

    this.$nextTick(() => {
      this.$refs.emailInput?.focus();
    });

  },


  methods: {

    // =====================================================
    // SOLICITAR CAMBIO
    // =====================================================

    async solicitarCambio() {

      this.mensajeError = "";

      this.emailError = false;


      const correo =
        String(
          this.email || ""
        )
          .trim()
          .toLowerCase();


      if (
        !correo ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
      ) {

        this.emailError = true;

        this.mensajeError =
          "Por favor, ingresa un correo electrónico válido.";

        return;

      }


      this.cargando = true;


      try {

        const respuesta =
          await recuperarContraseniaFachada(
            correo
          );


        if (respuesta) {

          this.mensajeConfirmacion =
            "El enlace de recuperación fue enviado correctamente al correo indicado.";

          this.mensajeError = "";

        } else {

          this.mensajeError =
            "No se pudo enviar el enlace de recuperación. Verifica el correo ingresado.";

        }


      } catch (error) {

        console.error(
          "Error recuperando contraseña:",
          error
        );


        const status =
          error.response?.status;


        if (
          status === 404
        ) {

          this.mensajeError =
            "No encontramos una cuenta asociada a ese correo.";

        } else if (
          status >= 500
        ) {

          this.mensajeError =
            "El servicio no está disponible en este momento. Intenta nuevamente más tarde.";

        } else if (
          !error.response
        ) {

          this.mensajeError =
            "No se pudo conectar con el servidor. Verifica tu conexión.";

        } else {

          this.mensajeError =
            "No se pudo enviar el enlace de recuperación. Verifica el correo ingresado.";

        }


      } finally {

        this.cargando = false;

      }

    },


    // =====================================================
    // LIMPIAR ERROR
    // =====================================================

    limpiarError() {

      this.emailError = false;

      this.mensajeError = "";

    },


    // =====================================================
    // OTRO CORREO
    // =====================================================

    solicitarOtroCorreo() {

      this.email = "";

      this.mensajeConfirmacion = "";

      this.mensajeError = "";

      this.emailError = false;


      this.$nextTick(() => {
        this.$refs.emailInput?.focus();
      });

    },


    // =====================================================
    // LOGIN
    // =====================================================

    async redirigirLogin() {

      await this.$router.replace(
        "/login"
      );

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* RESET */
/* ========================================================= */

* {
  box-sizing: border-box;
}


/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.password-page {
  min-height: 100vh;

  background: #0f2747;
}


.password-main {
  position: relative;

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  padding: 35px 20px;

  background-image:
    url("@/assets/fumi.jpg");

  background-size: cover;

  background-position: center;

  background-repeat: no-repeat;
}


/* ========================================================= */
/* CAPA SOBRE FONDO */
/* ========================================================= */

.background-overlay {
  position: absolute;

  inset: 0;

  z-index: 1;

  background:
    linear-gradient(
      135deg,
      rgba(4, 20, 39, 0.78),
      rgba(0, 43, 91, 0.62)
    );

  backdrop-filter: blur(1px);
}


/* ========================================================= */
/* CARD */
/* ========================================================= */

.recovery-card {
  position: relative;

  z-index: 5;

  width: 100%;

  max-width: 520px;

  padding:
    40px
    42px;

  border:
    1px solid
    rgba(255, 255, 255, 0.75);

  border-radius: 23px;

  background:
    rgba(255, 255, 255, 0.97);

  box-shadow:
    0 26px 70px
    rgba(0, 0, 0, 0.32);

  backdrop-filter: blur(14px);

  -webkit-backdrop-filter: blur(14px);
}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.recovery-header {
  margin-bottom: 28px;

  text-align: center;
}


.recovery-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin:
    0
    auto
    16px;

  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #dbeafe,
      #eff6ff
    );

  color: #2563eb;

  font-size: 1.4rem;
}


.recovery-eyebrow {
  display: block;

  margin-bottom: 6px;

  color: #2563eb;

  font-size: 0.62rem;

  font-weight: 900;

  letter-spacing: 0.14em;
}


.recovery-header h1 {
  margin: 0;

  color: #0f172a;

  font-size: 1.8rem;

  font-weight: 900;

  line-height: 1.2;
}


.recovery-header p {
  max-width: 420px;

  margin:
    10px
    auto
    0;

  color: #52657c;

  font-size: 0.75rem;

  font-weight: 500;

  line-height: 1.6;
}


/* ========================================================= */
/* FIELD */
/* ========================================================= */

.form-field {
  margin-bottom: 17px;
}


.form-field label {
  display: block;

  margin-bottom: 7px;

  color: #172033;

  font-size: 0.7rem;

  font-weight: 900;
}


.input-wrapper {
  position: relative;

  width: 100%;

  height: 50px;

  display: flex;

  align-items: center;
}


.input-icon {
  position: absolute;

  left: 15px;

  z-index: 2;

  color: #64748b;

  font-size: 1rem;

  pointer-events: none;
}


.input-wrapper input {
  width: 100%;

  height: 50px;

  padding:
    0
    46px
    0
    43px;

  border:
    1px solid
    #cbd5e1;

  border-radius: 11px;

  background: #ffffff;

  color: #0f172a;

  font-size: 0.79rem;

  font-weight: 500;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}


.input-wrapper input::placeholder {
  color: #8796aa;

  opacity: 1;
}


.input-wrapper input:focus {
  border-color: #2563eb;

  box-shadow:
    0 0 0 4px
    rgba(37, 99, 235, 0.10);
}


.input-wrapper input:disabled {
  background: #f1f5f9;

  color: #64748b;

  cursor: not-allowed;
}


.input-wrapper.invalid input {
  border-color: #ef4444;

  background: #fffafa;

  box-shadow:
    0 0 0 3px
    rgba(220, 38, 38, 0.07);
}


.valid-icon {
  position: absolute;

  right: 15px;

  color: #16a34a;

  font-size: 0.95rem;
}


/* ========================================================= */
/* FIELD ERROR */
/* ========================================================= */

.field-error {
  display: flex;

  align-items: center;

  gap: 5px;

  width: fit-content;

  margin-top: 6px;

  padding:
    3px
    7px;

  border-radius: 6px;

  background: #fff1f2;

  color: #b91c1c;

  font-size: 0.61rem;

  font-weight: 800;
}


/* ========================================================= */
/* SECURITY INFO */
/* ========================================================= */

.security-info {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-top: 6px;

  padding:
    11px
    12px;

  border:
    1px solid
    #bfdbfe;

  border-radius: 9px;

  background: #eff6ff;

  color: #334e70;

  font-size: 0.61rem;

  font-weight: 600;

  line-height: 1.45;
}


.security-info i {
  margin-top: 1px;

  color: #2563eb;
}


/* ========================================================= */
/* BOTONES */
/* ========================================================= */

.primary-button,
.secondary-button {
  width: 100%;

  min-height: 49px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border-radius: 11px;

  font-size: 0.76rem;

  font-weight: 900;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.primary-button {
  margin-top: 21px;

  border: none;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #164fc4
    );

  color: #ffffff;

  box-shadow:
    0 10px 22px
    rgba(37, 99, 235, 0.24);
}


.primary-button:hover:not(:disabled) {
  transform:
    translateY(-1px);

  background:
    linear-gradient(
      135deg,
      #1d4ed8,
      #123f9a
    );

  box-shadow:
    0 13px 27px
    rgba(37, 99, 235, 0.28);
}


.secondary-button {
  margin-top: 9px;

  border:
    1px solid
    #d5dee9;

  background: #ffffff;

  color: #475569;
}


.secondary-button:hover:not(:disabled) {
  background: #f8fafc;
}


button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* ========================================================= */
/* VOLVER LOGIN */
/* ========================================================= */

.back-login-button {
  width: 100%;

  margin-top: 20px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border: none;

  background: transparent;

  color: #52657c;

  font-size: 0.65rem;

  font-weight: 800;

  cursor: pointer;
}


.back-login-button:hover:not(:disabled) {
  color: #2563eb;
}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.status-message {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  margin-bottom: 20px;

  padding:
    12px
    13px;

  border-radius: 10px;
}


.status-icon {
  width: 33px;
  height: 33px;

  min-width: 33px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 8px;
}


.status-message strong {
  display: block;

  font-size: 0.67rem;

  font-weight: 900;
}


.status-message span {
  display: block;

  margin-top: 2px;

  font-size: 0.61rem;

  line-height: 1.45;
}


.success-message {
  border:
    1px solid
    #bbf7d0;

  background: #f0fdf4;

  color: #15803d;
}


.success-message .status-icon {
  background: #dcfce7;

  color: #16a34a;
}


.error-message {
  border:
    1px solid
    #fecaca;

  background: #fef2f2;

  color: #991b1b;
}


.error-message .status-icon {
  background: #fee2e2;

  color: #dc2626;
}


/* ========================================================= */
/* SUCCESS ACTIONS */
/* ========================================================= */

.success-actions {
  margin-top: 5px;
}


.mail-help {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  margin-bottom: 15px;

  padding:
    13px
    14px;

  border:
    1px solid
    #dbeafe;

  border-radius: 10px;

  background: #f8fbff;
}


.mail-help > i {
  margin-top: 2px;

  color: #2563eb;

  font-size: 1.05rem;
}


.mail-help strong {
  display: block;

  color: #334155;

  font-size: 0.67rem;
}


.mail-help span {
  display: block;

  margin-top: 3px;

  color: #64748b;

  font-size: 0.6rem;

  line-height: 1.45;
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 600px) {

  .password-main {
    align-items: flex-start;

    padding:
      24px
      14px;
  }


  .recovery-card {
    margin-top: 12px;

    padding:
      30px
      22px;

    border-radius: 18px;
  }


  .recovery-header h1 {
    font-size: 1.55rem;
  }

}
</style>