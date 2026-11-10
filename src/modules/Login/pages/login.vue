<template>
  <div class="login-page">

    <!-- ===================================================== -->
    <!-- PANEL IZQUIERDO -->
    <!-- ===================================================== -->

    <section class="login-brand-panel">

      <div class="brand-content">

        <div class="brand-logo-wrapper">
          <img
            src="/fumidez_logo.png"
            alt="Fumidez"
            class="brand-logo"
          />
        </div>

        <span class="brand-eyebrow">
          CONTROL Y GESTIÓN DE PLAGAS
        </span>

        <h1>
          Gestión operativa
          <span>Fumidez</span>
        </h1>

        <p>
          Accede a la plataforma para administrar operaciones,
          servicios técnicos, clientes, informes y documentación.
        </p>


        <div class="brand-features">

          <div class="feature-item">

            <div class="feature-icon">
              <i class="bi bi-shield-check"></i>
            </div>

            <div>
              <strong>Acceso seguro</strong>

              <span>
                Sesiones protegidas mediante autenticación.
              </span>
            </div>

          </div>


          <div class="feature-item">

            <div class="feature-icon">
              <i class="bi bi-clipboard-data"></i>
            </div>

            <div>
              <strong>Gestión centralizada</strong>

              <span>
                Órdenes, informes, clientes y operaciones.
              </span>
            </div>

          </div>


          <div class="feature-item">

            <div class="feature-icon">
              <i class="bi bi-people"></i>
            </div>

            <div>
              <strong>Acceso por perfil</strong>

              <span>
                Administradores, técnicos y clientes.
              </span>
            </div>

          </div>

        </div>

      </div>


      <div class="brand-footer">
        © {{ anioActual }} Fumidez
      </div>

    </section>


    <!-- ===================================================== -->
    <!-- PANEL DE LOGIN -->
    <!-- ===================================================== -->

    <main class="login-form-panel">

      <!-- ESTA TARJETA ES LA CORRECCIÓN PRINCIPAL -->
      <div class="login-card">

        <div class="login-container">

          <!-- LOGO EN TABLET/MÓVIL -->

          <div class="mobile-logo">
            <img
              src="/fumidez_logo.png"
              alt="Fumidez"
            />
          </div>


          <!-- CABECERA -->

          <div class="login-header">

            <span class="login-eyebrow">
              BIENVENIDO
            </span>

            <h2>
              Iniciar sesión
            </h2>

            <p>
              Ingresa tus credenciales para acceder al sistema.
            </p>

          </div>


          <!-- ================================================= -->
          <!-- ERROR -->
          <!-- ================================================= -->

          <div
            v-if="errorMessage"
            class="login-message error-message"
          >

            <div class="message-icon">
              <i class="bi bi-exclamation-circle-fill"></i>
            </div>

            <div>
              <strong>
                No pudimos iniciar sesión
              </strong>

              <span>
                {{ errorMessage }}
              </span>
            </div>

          </div>


          <!-- ================================================= -->
          <!-- FORMULARIO -->
          <!-- ================================================= -->

          <form
            novalidate
            @submit.prevent="login"
          >

            <!-- CORREO -->

            <div class="form-field">

              <label for="email">
                Correo electrónico
              </label>

              <div
                class="input-wrapper"
                :class="{ invalid: emailError }"
              >

                <i class="bi bi-envelope input-icon"></i>

                <input
                  id="email"
                  ref="emailInput"
                  v-model.trim="credentials.email"
                  type="email"
                  autocomplete="email"
                  placeholder="nombre@correo.com"
                  :disabled="loading"
                  @input="limpiarErrorEmail"
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


            <!-- CONTRASEÑA -->

            <div class="form-field">

              <div class="password-label">

                <label for="password">
                  Contraseña
                </label>

                <button
                  type="button"
                  class="forgot-link"
                  :disabled="loading"
                  @click="abrirRecuperarContrasenia"
                >
                  ¿Olvidaste tu contraseña?
                </button>

              </div>


              <div
                class="input-wrapper"
                :class="{ invalid: passwordError }"
              >

                <i class="bi bi-lock input-icon"></i>

                <input
                  id="password"
                  v-model="credentials.password"
                  :type="mostrarPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  :disabled="loading"
                  @input="limpiarErrorPassword"
                />

                <button
                  type="button"
                  class="password-toggle"
                  :title="
                    mostrarPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  "
                  :disabled="loading"
                  @click="mostrarPassword = !mostrarPassword"
                >

                  <i
                    class="bi"
                    :class="
                      mostrarPassword
                        ? 'bi-eye-slash'
                        : 'bi-eye'
                    "
                  ></i>

                </button>

              </div>

              <span
                v-if="passwordError"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>

                La contraseña es obligatoria.
              </span>

            </div>


            <!-- INFORMACIÓN SEGURIDAD -->

            <div class="session-info">

              <i class="bi bi-shield-lock"></i>

              <span>
                Tu sesión está protegida y se cerrará cuando
                la autenticación deje de ser válida.
              </span>

            </div>


            <!-- BOTÓN LOGIN -->

            <button
              type="submit"
              class="login-button"
              :disabled="loading"
            >

              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              ></span>

              <i
                v-else
                class="bi bi-box-arrow-in-right"
              ></i>

              {{
                loading
                  ? "Ingresando..."
                  : "Iniciar sesión"
              }}

            </button>

          </form>


          <!-- ================================================= -->
          <!-- ROLES -->
          <!-- ================================================= -->

          <div class="roles-info">

            <p>
              El sistema mostrará automáticamente las funciones
              disponibles según tu perfil.
            </p>

            <div class="role-badges">

              <span>
                <i class="bi bi-person-gear"></i>
                Administrador
              </span>

              <span>
                <i class="bi bi-person-workspace"></i>
                Técnico
              </span>

              <span>
                <i class="bi bi-building"></i>
                Cliente
              </span>

            </div>

          </div>

        </div>

      </div>

    </main>

  </div>
</template>


<script>
import {
  consultarLoginFachada
} from "../helpers/loginHelper";


export default {

  name: "Login",


  data() {

    return {

      credentials: {
        email: "",
        password: ""
      },

      emailError: false,

      passwordError: false,

      loading: false,

      errorMessage: null,

      mostrarPassword: false

    };

  },


  computed: {

    anioActual() {
      return new Date().getFullYear();
    },


    emailValido() {

      if (!this.credentials.email) {
        return false;
      }

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.credentials.email
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
    // LOGIN
    // =====================================================

    async login() {

      this.emailError = false;
      this.passwordError = false;
      this.errorMessage = null;


      const email =
        String(
          this.credentials.email || ""
        )
          .trim()
          .toLowerCase();


      const password =
        String(
          this.credentials.password || ""
        );


      // ===================================================
      // VALIDACIONES
      // ===================================================

      if (
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {

        this.emailError = true;

      }


      if (!password) {

        this.passwordError = true;

      }


      if (
        this.emailError ||
        this.passwordError
      ) {

        return;

      }


      this.loading = true;


      try {

        const response =
          await consultarLoginFachada({
            email,
            password
          });


        if (
          !response ||
          !response.token
        ) {

          this.errorMessage =
            "No fue posible validar las credenciales.";

          return;

        }


        // ===================================================
        // NORMALIZAR ROL
        // ===================================================

        const tipo =
          String(
            response.tipo || ""
          )
            .trim()
            .toUpperCase();


        const rolesPermitidos = [
          "ADMIN",
          "TECNICO",
          "CLIENTE"
        ];


        if (
          !rolesPermitidos.includes(tipo)
        ) {

          this.limpiarSesion();

          this.errorMessage =
            "El usuario no tiene un perfil válido para acceder al sistema.";

          return;

        }


        // ===================================================
        // GUARDAR SESIÓN
        // ===================================================

        localStorage.setItem(
          "token",
          response.token
        );


        localStorage.setItem(
          "userId",
          String(
            response.id ?? ""
          )
        );


        localStorage.setItem(
          "userType",
          tipo
        );


        localStorage.setItem(
          "userName",
          response.nombre || ""
        );


        localStorage.setItem(
          "userEmail",
          response.correo || email
        );


        // ===================================================
        // CLIENTE ASOCIADO
        // ===================================================

        if (
          response.clienteId !== null &&
          response.clienteId !== undefined
        ) {

          localStorage.setItem(
            "clienteId",
            String(response.clienteId)
          );

        } else {

          localStorage.removeItem(
            "clienteId"
          );

        }


        // ===================================================
        // REDIRECCIÓN POR ROL
        // ===================================================

        switch (tipo) {

          case "ADMIN":

            await this.$router.replace(
              "/inicio"
            );

            break;


          case "TECNICO":

            await this.$router.replace(
              "/calendario"
            );

            break;


          case "CLIENTE":

            await this.$router.replace(
              "/portal-cliente"
            );

            break;

        }


      } catch (error) {

        console.error(
          "Error al iniciar sesión:",
          error
        );


        const status =
          error.response?.status;


        if (
          status === 401 ||
          status === 403
        ) {

          this.errorMessage =
            "Correo o contraseña incorrectos.";

        } else if (
          status >= 500
        ) {

          this.errorMessage =
            "El servicio no está disponible en este momento. Intenta nuevamente.";

        } else if (
          !error.response
        ) {

          this.errorMessage =
            "No se pudo conectar con el servidor. Verifica tu conexión.";

        } else {

          this.errorMessage =
            "No fue posible iniciar sesión. Intenta nuevamente.";

        }


      } finally {

        this.loading = false;

      }

    },


    // =====================================================
    // ERRORES
    // =====================================================

    limpiarErrorEmail() {

      this.emailError = false;
      this.errorMessage = null;

    },


    limpiarErrorPassword() {

      this.passwordError = false;
      this.errorMessage = null;

    },


    // =====================================================
    // RECUPERAR CONTRASEÑA
    // =====================================================

    abrirRecuperarContrasenia() {

      if (this.loading) {
        return;
      }

      this.$router.push(
        "/recuperar_contrasenia"
      );

    },


    // =====================================================
    // LIMPIAR SESIÓN
    // =====================================================

    limpiarSesion() {

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userType");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("clienteId");

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* RESET LOCAL */
/* ========================================================= */

* {
  box-sizing: border-box;
}


/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.login-page {
  width: 100%;
  min-height: 100vh;

  display: grid;

  grid-template-columns:
    minmax(420px, 1.05fr)
    minmax(460px, 0.95fr);

  overflow: hidden;

  background: #eef4fb;
}


/* ========================================================= */
/* PANEL IZQUIERDO */
/* ========================================================= */

.login-brand-panel {
  position: relative;

  min-height: 100vh;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

  overflow: hidden;

  padding:
    55px
    60px
    35px;

  background:
    radial-gradient(
      circle at 15% 15%,
      rgba(37, 99, 235, 0.30),
      transparent 35%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(220, 38, 38, 0.16),
      transparent 30%
    ),
    linear-gradient(
      145deg,
      #06182d 0%,
      #0a2b4d 52%,
      #124c78 100%
    );

  color: #ffffff;
}


.login-brand-panel::before {
  content: "";

  position: absolute;

  width: 430px;
  height: 430px;

  top: -180px;
  right: -170px;

  border:
    1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 50%;
}


.login-brand-panel::after {
  content: "";

  position: absolute;

  width: 330px;
  height: 330px;

  left: -170px;
  bottom: -160px;

  border:
    1px solid
    rgba(255, 255, 255, 0.07);

  border-radius: 50%;
}


.brand-content,
.brand-footer {
  position: relative;

  z-index: 2;
}


.brand-content {
  width: 100%;

  max-width: 580px;

  margin:
    auto
    0;
}


/* ========================================================= */
/* LOGO */
/* ========================================================= */

.brand-logo-wrapper {
  width: 175px;

  margin-bottom: 40px;

  padding:
    14px
    18px;

  border:
    1px solid
    rgba(255, 255, 255, 0.18);

  border-radius: 15px;

  background: #ffffff;

  box-shadow:
    0 16px 38px
    rgba(0, 0, 0, 0.18);
}


.brand-logo {
  width: 100%;

  display: block;
}


/* ========================================================= */
/* BRAND TEXT */
/* ========================================================= */

.brand-eyebrow {
  display: block;

  margin-bottom: 10px;

  color: #93c5fd;

  font-size: 0.72rem;

  font-weight: 900;

  letter-spacing: 0.16em;
}


.brand-content h1 {
  max-width: 540px;

  margin: 0;

  color: #ffffff;

  font-size:
    clamp(
      2.3rem,
      4vw,
      3.7rem
    );

  font-weight: 900;

  line-height: 1.07;
}


.brand-content h1 span {
  display: block;

  color: #93c5fd;
}


.brand-content > p {
  max-width: 540px;

  margin:
    20px
    0
    0;

  color: #d4deea;

  font-size: 0.94rem;

  line-height: 1.75;
}


/* ========================================================= */
/* FEATURES */
/* ========================================================= */

.brand-features {
  max-width: 520px;

  margin-top: 38px;

  display: flex;

  flex-direction: column;

  gap: 17px;
}


.feature-item {
  display: flex;

  align-items: center;

  gap: 13px;
}


.feature-icon {
  width: 44px;
  height: 44px;

  min-width: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(147, 197, 253, 0.28);

  border-radius: 11px;

  background:
    rgba(37, 99, 235, 0.13);

  color: #bfdbfe;

  font-size: 1rem;
}


.feature-item strong {
  display: block;

  color: #ffffff;

  font-size: 0.76rem;

  font-weight: 800;
}


.feature-item span {
  display: block;

  margin-top: 2px;

  color: #b8c6d8;

  font-size: 0.64rem;
}


.brand-footer {
  color: #94a3b8;

  font-size: 0.62rem;
}


/* ========================================================= */
/* PANEL DERECHO */
/* ========================================================= */

.login-form-panel {
  position: relative;

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 42px;

  /*
   * IMPORTANTE:
   * aunque exista una imagen global detrás,
   * esta capa evita que domine sobre el login.
   */
  background:
    linear-gradient(
      145deg,
      rgba(239, 246, 255, 0.93),
      rgba(248, 250, 252, 0.97)
    );
}


/* ========================================================= */
/* TARJETA LOGIN */
/* ========================================================= */

.login-card {
  position: relative;

  z-index: 5;

  width: 100%;

  max-width: 510px;

  padding:
    40px
    42px;

  border:
    1px solid
    #dbe5ef;

  border-radius: 24px;

  background:
    rgba(
      255,
      255,
      255,
      0.98
    );

  box-shadow:
    0 26px 65px
    rgba(15, 23, 42, 0.16);

  backdrop-filter: blur(14px);

  -webkit-backdrop-filter: blur(14px);
}


.login-container {
  width: 100%;
}


/* ========================================================= */
/* MOBILE LOGO */
/* ========================================================= */

.mobile-logo {
  display: none;

  margin-bottom: 28px;

  text-align: center;
}


.mobile-logo img {
  width: 150px;
}


/* ========================================================= */
/* HEADER LOGIN */
/* ========================================================= */

.login-header {
  margin-bottom: 29px;
}


.login-eyebrow {
  display: block;

  margin-bottom: 6px;

  color: #1d5ed5;

  font-size: 0.66rem;

  font-weight: 900;

  letter-spacing: 0.14em;
}


.login-header h2 {
  margin: 0;

  color: #0f172a;

  font-size: 2rem;

  font-weight: 900;

  line-height: 1.15;
}


.login-header p {
  margin:
    8px
    0
    0;

  color: #475569;

  font-size: 0.79rem;

  font-weight: 500;

  line-height: 1.5;
}


/* ========================================================= */
/* CAMPOS */
/* ========================================================= */

.form-field {
  margin-bottom: 20px;
}


.form-field > label,
.password-label label {
  display: block;

  margin-bottom: 7px;

  color: #172033;

  font-size: 0.71rem;

  font-weight: 900;
}


.password-label {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 7px;
}


.password-label label {
  margin: 0;
}


/* ========================================================= */
/* FORGOT */
/* ========================================================= */

.forgot-link {
  padding: 0;

  border: none;

  background: transparent;

  color: #1d5ed5;

  font-size: 0.64rem;

  font-weight: 800;

  cursor: pointer;
}


.forgot-link:hover:not(:disabled) {
  color: #123f9a;

  text-decoration: underline;
}


/* ========================================================= */
/* INPUT WRAPPER */
/* ========================================================= */

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

  box-shadow:
    0 2px 5px
    rgba(15, 23, 42, 0.025);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}


.input-wrapper input::placeholder {
  color: #8593a8;

  opacity: 1;
}


.input-wrapper input:focus {
  border-color: #2563eb;

  background: #ffffff;

  box-shadow:
    0 0 0 4px
    rgba(37, 99, 235, 0.10);
}


.input-wrapper input:disabled {
  background: #f1f5f9;

  color: #64748b;

  cursor: not-allowed;
}


/* ========================================================= */
/* INPUT INVALID */
/* ========================================================= */

.input-wrapper.invalid input {
  border-color: #ef4444;

  background: #fffafa;

  box-shadow:
    0 0 0 3px
    rgba(220, 38, 38, 0.07);
}


/* ========================================================= */
/* ICONOS DERECHA */
/* ========================================================= */

.valid-icon {
  position: absolute;

  right: 15px;

  color: #16a34a;

  font-size: 0.95rem;
}


.password-toggle {
  position: absolute;

  right: 7px;

  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 8px;

  background: transparent;

  color: #52657c;

  font-size: 1rem;

  cursor: pointer;
}


.password-toggle:hover:not(:disabled) {
  background: #eff4f8;

  color: #1d5ed5;
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
/* SEGURIDAD */
/* ========================================================= */

.session-info {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-top: 5px;

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


.session-info i {
  margin-top: 1px;

  color: #1d5ed5;
}


/* ========================================================= */
/* LOGIN BUTTON */
/* ========================================================= */

.login-button {
  width: 100%;

  min-height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 22px;

  border: none;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #164fc4
    );

  color: #ffffff;

  font-size: 0.78rem;

  font-weight: 900;

  box-shadow:
    0 10px 22px
    rgba(37, 99, 235, 0.25);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}


.login-button:hover:not(:disabled) {
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
    rgba(37, 99, 235, 0.30);
}


.login-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}


/* ========================================================= */
/* ERROR GENERAL */
/* ========================================================= */

.login-message {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  margin-bottom: 20px;

  padding:
    12px
    13px;

  border-radius: 10px;
}


.error-message {
  border:
    1px solid
    #fca5a5;

  background: #fef2f2;

  color: #991b1b;

  box-shadow:
    0 4px 12px
    rgba(127, 29, 29, 0.08);
}


.message-icon {
  width: 32px;
  height: 32px;

  min-width: 32px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #fee2e2;
}


.login-message strong {
  display: block;

  color: #991b1b;

  font-size: 0.68rem;

  font-weight: 900;
}


.login-message span {
  display: block;

  margin-top: 2px;

  color: #b91c1c;

  font-size: 0.62rem;

  line-height: 1.45;
}


/* ========================================================= */
/* ROLES */
/* ========================================================= */

.roles-info {
  margin-top: 27px;

  padding-top: 20px;

  border-top:
    1px solid
    #dce4ed;

  text-align: center;
}


.roles-info > p {
  margin: 0;

  color: #52657c;

  font-size: 0.61rem;

  font-weight: 600;

  line-height: 1.5;
}


.role-badges {
  display: flex;

  justify-content: center;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 12px;
}


.role-badges span {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding:
    6px
    9px;

  border:
    1px solid
    #d5dee9;

  border-radius: 999px;

  background: #f8fafc;

  color: #41546b;

  font-size: 0.57rem;

  font-weight: 800;
}


.role-badges i {
  color: #1d5ed5;
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 1000px) {

  .login-page {
    grid-template-columns:
      minmax(350px, 0.9fr)
      minmax(430px, 1.1fr);
  }


  .login-brand-panel {
    padding:
      45px
      38px
      30px;
  }


  .brand-features {
    gap: 13px;
  }

}


@media (max-width: 850px) {

  .login-page {
    display: block;
  }


  .login-brand-panel {
    display: none;
  }


  .login-form-panel {
    min-height: 100vh;

    padding: 28px;
  }


  .login-card {
    max-width: 500px;
  }


  .mobile-logo {
    display: block;
  }

}


@media (max-width: 500px) {

  .login-form-panel {
    align-items: flex-start;

    padding:
      20px
      14px;
  }


  .login-card {
    margin-top: 10px;

    padding:
      28px
      22px;

    border-radius: 18px;
  }


  .login-header h2 {
    font-size: 1.65rem;
  }


  .password-label {
    align-items: flex-start;

    flex-direction: column;

    gap: 4px;
  }


  .roles-info {
    margin-top: 23px;
  }


  .role-badges {
    gap: 5px;
  }

}
</style>