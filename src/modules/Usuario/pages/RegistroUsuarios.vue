<template>
  <div class="user-form-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>

        <button
          type="button"
          class="back-link"
          @click="redirigirListadoUsuario"
        >
          <i class="bi bi-arrow-left"></i>
          Volver a usuarios
        </button>


        <span class="page-eyebrow">
          ADMINISTRACIÓN
        </span>


        <h1>
          {{ esEdicion ? "Editar usuario" : "Nuevo usuario" }}
        </h1>


        <p>
          {{
            esEdicion
              ? "Actualiza los datos, permisos y acceso del usuario."
              : "Crea un nuevo acceso al sistema y define su rol."
          }}
        </p>

      </div>


      <span
        class="mode-badge"
        :class="esEdicion ? 'edit' : 'new'"
      >
        <i
          class="bi"
          :class="
            esEdicion
              ? 'bi-pencil-square'
              : 'bi-person-plus'
          "
        ></i>

        {{
          esEdicion
            ? "Modo edición"
            : "Nuevo acceso"
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
        <strong>Revise la información</strong>
        <span>{{ mensajeError }}</span>
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- CARGANDO -->
    <!-- ===================================================== -->

    <div
      v-if="cargandoInicial"
      class="loading-card"
    >
      <div class="spinner-border text-primary"></div>

      <span>
        Cargando información del usuario...
      </span>
    </div>


    <!-- ===================================================== -->
    <!-- CONTENIDO -->
    <!-- ===================================================== -->

    <div
      v-else
      class="form-layout"
    >

      <!-- =================================================== -->
      <!-- FORMULARIO -->
      <!-- =================================================== -->

      <section class="form-card">

        <form
          novalidate
          @submit.prevent="guardarUsuario"
        >

          <!-- ================================================= -->
          <!-- ACCESO Y ROL -->
          <!-- ================================================= -->

          <div class="section-header">

            <div class="section-icon">
              <i class="bi bi-shield-lock"></i>
            </div>

            <div>
              <h2>
                Acceso y permisos
              </h2>

              <p>
                Define cómo podrá ingresar y qué podrá consultar.
              </p>
            </div>

          </div>


          <div class="fields-grid">

            <!-- ROL -->

            <div class="form-field">

              <label for="role">
                Rol del usuario
                <span class="required">*</span>
              </label>

              <div
                class="input-wrapper select-wrapper"
                :class="{ invalid: errores.tipo }"
              >
                <i class="bi bi-person-badge"></i>

                <select
                  id="role"
                  v-model="usuario.tipo"
                  @change="cambiarRol"
                >
                  <option
                    disabled
                    value=""
                  >
                    Seleccione un rol
                  </option>

                  <option
                    v-for="rol in roles"
                    :key="rol"
                    :value="rol"
                  >
                    {{ textoRol(rol) }}
                  </option>
                </select>
              </div>

              <span
                v-if="errores.tipo"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.tipo }}
              </span>

              <span
                v-else
                class="field-help"
              >
                {{ descripcionRol }}
              </span>

            </div>


            <!-- CORREO -->

            <div class="form-field">

              <label for="correo">
                Correo electrónico
                <span class="required">*</span>
              </label>

              <div
                class="input-wrapper"
                :class="{ invalid: errores.correo }"
              >
                <i class="bi bi-envelope"></i>

                <input
                  id="correo"
                  v-model.trim="usuario.correo"
                  type="email"
                  maxlength="150"
                  autocomplete="email"
                  placeholder="usuario@fumidez.com"
                  @input="limpiarError('correo')"
                />
              </div>

              <span
                v-if="errores.correo"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.correo }}
              </span>

              <span
                v-else
                class="field-help"
              >
                Se utilizará para iniciar sesión.
              </span>

            </div>


            <!-- CONTRASEÑA -->

            <div class="form-field full-width">

              <label for="contrasenia">
                Contraseña
                <span
                  v-if="!esEdicion"
                  class="required"
                >
                  *
                </span>
              </label>

              <div
                class="input-wrapper password-wrapper"
                :class="{ invalid: errores.contrasenia }"
              >
                <i class="bi bi-lock"></i>

                <input
                  id="contrasenia"
                  v-model="usuario.contrasenia"
                  :type="mostrarPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  :placeholder="
                    esEdicion
                      ? 'Dejar vacío para mantener la contraseña actual'
                      : 'Ingrese una contraseña segura'
                  "
                  @input="limpiarError('contrasenia')"
                />

                <button
                  type="button"
                  class="password-toggle"
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
                v-if="errores.contrasenia"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.contrasenia }}
              </span>


              <template v-else>

                <div
                  v-if="usuario.contrasenia"
                  class="password-strength"
                >
                  <div class="strength-track">
                    <div
                      class="strength-value"
                      :class="claseFortaleza"
                      :style="{ width: porcentajeFortaleza + '%' }"
                    ></div>
                  </div>

                  <span :class="claseTextoFortaleza">
                    {{ textoFortaleza }}
                  </span>
                </div>

                <span
                  v-else
                  class="field-help"
                >
                  {{
                    esEdicion
                      ? "Déjala vacía si no deseas cambiarla."
                      : "Usa al menos 8 caracteres, combinando letras y números."
                  }}
                </span>

              </template>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- CLIENTE ASOCIADO -->
          <!-- ================================================= -->

          <div
            v-if="usuario.tipo === 'CLIENTE'"
            class="client-link-card"
          >

            <div class="client-link-icon">
              <i class="bi bi-building"></i>
            </div>


            <div class="client-link-content">

              <span class="client-link-eyebrow">
                PORTAL DEL CLIENTE
              </span>

              <strong>
                Cliente asociado
              </strong>

              <p>
                Este usuario solo podrá consultar órdenes,
                informes y evidencias del cliente seleccionado.
              </p>


              <div
                class="input-wrapper select-wrapper client-select"
                :class="{ invalid: errores.clienteId }"
              >
                <i class="bi bi-building-check"></i>

                <select
                  v-model="usuario.clienteId"
                  @change="limpiarError('clienteId')"
                >
                  <option
                    :value="null"
                    disabled
                  >
                    Seleccione un cliente
                  </option>

                  <option
                    v-for="cliente in clientes"
                    :key="cliente.id"
                    :value="cliente.id"
                  >
                    {{ cliente.nombre }}
                    {{ cliente.ruc ? `- ${cliente.ruc}` : "" }}
                  </option>
                </select>
              </div>


              <span
                v-if="errores.clienteId"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.clienteId }}
              </span>


              <span
                v-else-if="cargandoClientes"
                class="field-help"
              >
                Cargando clientes...
              </span>


              <span
                v-else-if="clientes.length === 0"
                class="field-warning"
              >
                No existen clientes disponibles.
              </span>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- INFORMACIÓN PERSONAL -->
          <!-- ================================================= -->

          <div class="section-header secondary-section">

            <div class="section-icon green">
              <i class="bi bi-person-vcard"></i>
            </div>

            <div>
              <h2>
                Información del usuario
              </h2>

              <p>
                Datos personales y de contacto.
              </p>
            </div>

          </div>


          <div class="fields-grid">

            <!-- NOMBRE -->

            <div class="form-field full-width">

              <label for="nombre">
                Nombre completo
                <span class="required">*</span>
              </label>

              <div
                class="input-wrapper"
                :class="{ invalid: errores.nombre }"
              >
                <i class="bi bi-person"></i>

                <input
                  id="nombre"
                  v-model.trim="usuario.nombre"
                  type="text"
                  maxlength="150"
                  placeholder="Nombre completo"
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
                  Nombre que aparecerá en el sistema.
                </span>

                <span class="character-counter">
                  {{ usuario.nombre.length }}/150
                </span>

              </div>

            </div>


            <!-- RUC -->

            <div class="form-field">

              <label for="ruc">
                RUC / Identificación
              </label>

              <div class="input-wrapper">
                <i class="bi bi-card-text"></i>

                <input
                  id="ruc"
                  v-model.trim="usuario.ruc"
                  type="text"
                  maxlength="20"
                  placeholder="RUC o identificación"
                />
              </div>

              <span class="field-help">
                Opcional según el tipo de usuario.
              </span>

            </div>


            <!-- TELÉFONO -->

            <div class="form-field">

              <label for="telefono">
                Teléfono
              </label>

              <div class="input-wrapper">
                <i class="bi bi-telephone"></i>

                <input
                  id="telefono"
                  v-model.trim="usuario.telefono"
                  type="tel"
                  maxlength="30"
                  placeholder="Ej. 099 123 4567"
                />
              </div>

              <span class="field-help">
                Teléfono principal de contacto.
              </span>

            </div>


            <!-- DIRECCIÓN -->

            <div class="form-field">

              <label for="direccion">
                Dirección
              </label>

              <div class="input-wrapper">
                <i class="bi bi-geo-alt"></i>

                <input
                  id="direccion"
                  v-model.trim="usuario.direccion"
                  type="text"
                  maxlength="220"
                  placeholder="Dirección"
                />
              </div>

              <span class="field-help">
                Dirección de referencia.
              </span>

            </div>


            <!-- CUENTA -->

            <div class="form-field">

              <label for="nCuenta">
                Número de cuenta
              </label>

              <div class="input-wrapper">
                <i class="bi bi-credit-card"></i>

                <input
                  id="nCuenta"
                  v-model.trim="usuario.nCuenta"
                  type="text"
                  maxlength="40"
                  autocomplete="off"
                  placeholder="Número de cuenta"
                />
              </div>

              <span class="field-help">
                Información opcional.
              </span>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- AVISO DE SEGURIDAD -->
          <!-- ================================================= -->

          <div class="security-note">

            <i class="bi bi-shield-check"></i>

            <div>
              <strong>
                Seguridad de acceso
              </strong>

              <p>
                El rol determina los módulos disponibles. Los usuarios
                CLIENTE solo deben acceder a la información asociada a su
                propio cliente.
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
              @click="redirigirListadoUsuario"
            >
              Cancelar
            </button>


            <button
              type="submit"
              class="primary-button"
              :disabled="
                guardando
                ||
                (
                  usuario.tipo === 'CLIENTE'
                  &&
                  cargandoClientes
                )
              "
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
                    : 'bi-person-plus'
                "
              ></i>

              {{
                guardando
                  ? "Guardando..."
                  : esEdicion
                    ? "Guardar cambios"
                    : "Crear usuario"
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
            <span>RESUMEN DE ACCESO</span>
            <i class="bi bi-eye"></i>
          </div>


          <div
            class="user-preview-avatar"
            :class="claseAvatarRol"
          >
            {{ inicialesUsuario }}
          </div>


          <h3>
            {{ usuario.nombre || "Nuevo usuario" }}
          </h3>


          <p class="preview-email">
            <i class="bi bi-envelope"></i>

            {{
              usuario.correo
              || "Correo no registrado"
            }}
          </p>


          <span
            class="preview-role-badge"
            :class="claseRol"
          >
            {{ textoRol(usuario.tipo) || "Rol no definido" }}
          </span>


          <div class="preview-divider"></div>


          <div class="preview-item">

            <span>
              Acceso
            </span>

            <strong>
              {{ descripcionAcceso }}
            </strong>

          </div>


          <div
            v-if="usuario.tipo === 'CLIENTE'"
            class="preview-item"
          >
            <span>
              Cliente asociado
            </span>

            <strong>
              {{ nombreClienteSeleccionado }}
            </strong>
          </div>


          <div class="preview-item">

            <span>
              Teléfono
            </span>

            <strong>
              {{ usuario.telefono || "Sin definir" }}
            </strong>

          </div>


          <div class="preview-item">

            <span>
              Estado
            </span>

            <strong class="status-value">
              {{
                esEdicion
                  ? "Usuario registrado"
                  : "Nuevo acceso"
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
              Buenas prácticas
            </strong>

          </div>


          <ul>

            <li>
              Asigna únicamente el rol necesario para las funciones del usuario.
            </li>

            <li>
              No compartas cuentas entre varias personas.
            </li>

            <li>
              Para clientes, verifica siempre la empresa asociada antes de guardar.
            </li>

            <li>
              Utiliza contraseñas diferentes a las usadas en otros servicios.
            </li>

          </ul>

        </section>

      </aside>

    </div>

  </div>
</template>


<script>
import {
  crearUsuarioFachada,
  obtenerUsuarioFachada,
  actualizarUsuarioFachada
} from "../helpers/UsuarioHelper";

import {
  consultarClienteFachada
} from "../../Cliente/helpers/ClienteHelper";


export default {

  name: "UsuarioFormulario",


  data() {

    return {

      usuario: {
        tipo: "",
        contrasenia: "",
        nombre: "",
        correo: "",
        nCuenta: "",
        ruc: "",
        direccion: "",
        telefono: "",
        clienteId: null
      },

      roles: [
        "ADMIN",
        "TECNICO",
        "CLIENTE"
      ],

      clientes: [],

      usuarioId:
        this.$route.params.id
        || null,

      cargandoInicial: false,

      cargandoClientes: false,

      guardando: false,

      mostrarPassword: false,

      mensajeConfirmacion: "",

      mensajeError: "",

      errores: {
        tipo: "",
        contrasenia: "",
        nombre: "",
        correo: "",
        clienteId: ""
      }

    };

  },


  computed: {

    esEdicion() {

      return Boolean(
        this.usuarioId
      );

    },


    descripcionRol() {

      switch (this.usuario.tipo) {

        case "ADMIN":
          return "Acceso administrativo completo al sistema.";

        case "TECNICO":
          return "Acceso operativo a órdenes, informes y calendario.";

        case "CLIENTE":
          return "Acceso exclusivo al portal del cliente.";

        default:
          return "Seleccione el nivel de acceso del usuario.";
      }

    },


    descripcionAcceso() {

      switch (this.usuario.tipo) {

        case "ADMIN":
          return "Administración completa";

        case "TECNICO":
          return "Operación técnica";

        case "CLIENTE":
          return "Portal del cliente";

        default:
          return "Sin definir";
      }

    },


    inicialesUsuario() {

      const nombre =
        this.usuario.nombre?.trim();


      if (!nombre) {
        return "US";
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


    nombreClienteSeleccionado() {

      if (!this.usuario.clienteId) {
        return "Sin cliente seleccionado";
      }


      const cliente =
        this.clientes.find(
          item =>
            String(item.id)
            ===
            String(this.usuario.clienteId)
        );


      return cliente
        ? cliente.nombre
        : "Cliente no disponible";

    },


    claseRol() {

      switch (this.usuario.tipo) {

        case "ADMIN":
          return "role-admin";

        case "TECNICO":
          return "role-technician";

        case "CLIENTE":
          return "role-client";

        default:
          return "role-default";
      }

    },


    claseAvatarRol() {

      switch (this.usuario.tipo) {

        case "ADMIN":
          return "avatar-admin";

        case "TECNICO":
          return "avatar-technician";

        case "CLIENTE":
          return "avatar-client";

        default:
          return "avatar-default";
      }

    },


    // =====================================================
    // PASSWORD
    // =====================================================

    puntosFortaleza() {

      const password =
        this.usuario.contrasenia || "";


      let puntos = 0;


      if (password.length >= 8) puntos++;

      if (/[A-Z]/.test(password)) puntos++;

      if (/[a-z]/.test(password)) puntos++;

      if (/\d/.test(password)) puntos++;

      if (/[^A-Za-z0-9]/.test(password)) puntos++;


      return puntos;

    },


    porcentajeFortaleza() {

      return Math.min(
        100,
        this.puntosFortaleza * 20
      );

    },


    textoFortaleza() {

      if (this.puntosFortaleza <= 1) {
        return "Muy débil";
      }

      if (this.puntosFortaleza === 2) {
        return "Débil";
      }

      if (this.puntosFortaleza === 3) {
        return "Aceptable";
      }

      if (this.puntosFortaleza === 4) {
        return "Fuerte";
      }

      return "Muy fuerte";

    },


    claseFortaleza() {

      if (this.puntosFortaleza <= 1) {
        return "strength-danger";
      }

      if (this.puntosFortaleza === 2) {
        return "strength-warning";
      }

      if (this.puntosFortaleza === 3) {
        return "strength-medium";
      }

      return "strength-good";

    },


    claseTextoFortaleza() {
      return this.claseFortaleza;
    }

  },


  async mounted() {

    this.cargandoInicial =
      true;


    try {

      await Promise.all([
        this.cargarClientes(),
        this.cargarUsuario()
      ]);

    } finally {

      this.cargandoInicial =
        false;

    }

  },


  methods: {

    // =====================================================
    // CLIENTES
    // =====================================================

    async cargarClientes() {

      this.cargandoClientes =
        true;


      try {

        const response =
          await consultarClienteFachada();


        this.clientes =
          Array.isArray(response)
            ? response
            : [];


      } catch (error) {

        console.error(
          "Error cargando clientes:",
          error
        );


        this.clientes = [];

      } finally {

        this.cargandoClientes =
          false;

      }

    },


    // =====================================================
    // USUARIO
    // =====================================================

    async cargarUsuario() {

      if (!this.esEdicion) {
        return;
      }


      try {

        const user =
          await obtenerUsuarioFachada(
            this.usuarioId
          );


        this.usuario = {

          tipo:
            user.tipo
            || "",

          contrasenia:
            "",

          nombre:
            user.nombre
            || "",

          correo:
            user.correo
            || "",

          nCuenta:
            user.nCuenta
            ??
            user.ncuenta
            ??
            "",

          ruc:
            user.ruc
            || "",

          direccion:
            user.direccion
            || "",

          telefono:
            user.telefono
            || "",

          clienteId:
            user.clienteId
            ?? null

        };


      } catch (error) {

        console.error(
          "Error cargando usuario:",
          error
        );


        this.mensajeError =
          "No se pudo cargar la información del usuario.";

      }

    },


    // =====================================================
    // ROL
    // =====================================================

    cambiarRol() {

      this.errores.tipo = "";

      this.mensajeError = "";


      if (
        this.usuario.tipo !== "CLIENTE"
      ) {

        this.usuario.clienteId =
          null;

        this.errores.clienteId =
          "";

      }

    },


    textoRol(rol) {

      const nombres = {

        ADMIN:
          "Administrador",

        TECNICO:
          "Técnico",

        CLIENTE:
          "Cliente"

      };


      return nombres[rol]
        || "";

    },


    // =====================================================
    // VALIDACIÓN
    // =====================================================

    validarFormulario() {

      this.errores = {
        tipo: "",
        contrasenia: "",
        nombre: "",
        correo: "",
        clienteId: ""
      };


      let valido = true;


      if (!this.usuario.tipo) {

        this.errores.tipo =
          "Seleccione un rol.";

        valido = false;

      }


      if (
        !this.usuario.nombre
        ||
        !this.usuario.nombre.trim()
      ) {

        this.errores.nombre =
          "Ingrese el nombre del usuario.";

        valido = false;

      }


      if (
        !this.usuario.correo
        ||
        !this.usuario.correo.trim()
      ) {

        this.errores.correo =
          "Ingrese el correo electrónico.";

        valido = false;

      } else if (
        !this.esCorreoValido(
          this.usuario.correo
        )
      ) {

        this.errores.correo =
          "Ingrese un correo válido.";

        valido = false;

      }


      if (
        !this.esEdicion
        &&
        !this.usuario.contrasenia
      ) {

        this.errores.contrasenia =
          "Ingrese una contraseña.";

        valido = false;

      }


      if (
        this.usuario.contrasenia
        &&
        this.usuario.contrasenia.length < 8
      ) {

        this.errores.contrasenia =
          "La contraseña debe tener al menos 8 caracteres.";

        valido = false;

      }


      if (
        this.usuario.tipo === "CLIENTE"
        &&
        !this.usuario.clienteId
      ) {

        this.errores.clienteId =
          "Seleccione el cliente asociado.";

        valido = false;

      }


      return valido;

    },


    esCorreoValido(correo) {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        correo
      );

    },


    limpiarError(campo) {

      if (this.errores[campo]) {
        this.errores[campo] = "";
      }


      this.mensajeError = "";
      this.mensajeConfirmacion = "";

    },


    // =====================================================
    // GUARDAR
    // =====================================================

    async guardarUsuario() {

      this.mensajeConfirmacion = "";
      this.mensajeError = "";


      if (!this.validarFormulario()) {

        this.mensajeError =
          "Revise los campos marcados antes de continuar.";

        return;

      }


      this.guardando = true;


      const body = {

        tipo:
          this.usuario.tipo,

        contrasenia:
          this.usuario.contrasenia,

        nombre:
          this.usuario.nombre.trim(),

        correo:
          this.usuario.correo.trim(),

        nCuenta:
          this.usuario.nCuenta?.trim()
          || "",

        ruc:
          this.usuario.ruc?.trim()
          || "",

        direccion:
          this.usuario.direccion?.trim()
          || "",

        telefono:
          this.usuario.telefono?.trim()
          || "",

        clienteId:
          this.usuario.tipo === "CLIENTE"
            ? this.usuario.clienteId
            : null

      };


      try {

        if (this.esEdicion) {

          await actualizarUsuarioFachada(
            this.usuarioId,
            body
          );


          this.mensajeConfirmacion =
            "El usuario fue actualizado correctamente.";


          await this.cargarUsuario();


        } else {

          await crearUsuarioFachada(
            body
          );


          this.mensajeConfirmacion =
            "El usuario fue creado correctamente.";


          this.limpiarFormulario();

        }


      } catch (error) {

        console.error(
          "Error guardando usuario:",
          error
        );


        const mensajeBackend =
          typeof error.response?.data
          === "string"
            ? error.response.data
            : null;


        this.mensajeError =
          mensajeBackend
          ||
          (
            this.esEdicion
              ? "No se pudo actualizar el usuario."
              : "No se pudo crear el usuario."
          );


      } finally {

        this.guardando = false;

      }

    },


    // =====================================================
    // RESET
    // =====================================================

    limpiarFormulario() {

      this.usuario = {
        tipo: "",
        contrasenia: "",
        nombre: "",
        correo: "",
        nCuenta: "",
        ruc: "",
        direccion: "",
        telefono: "",
        clienteId: null
      };


      this.errores = {
        tipo: "",
        contrasenia: "",
        nombre: "",
        correo: "",
        clienteId: ""
      };


      this.mostrarPassword = false;

    },


    // =====================================================
    // VOLVER
    // =====================================================

    redirigirListadoUsuario() {

      this.$router.push(
        "/usuarios_lista"
      );

    }

  }

};
</script>


<style scoped>

.user-form-page {
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


.page-header {
  max-width: 1300px;

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
  max-width: 650px;

  margin: 7px 0 0;

  color: #64748b;

  font-size: 0.84rem;

  line-height: 1.5;
}


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


.form-layout {
  max-width: 1300px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.65fr)
    minmax(280px, 0.75fr);

  gap: 20px;

  align-items: start;
}


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


.section-header {
  display: flex;

  align-items: center;

  gap: 13px;

  margin-bottom: 24px;

  padding-bottom: 18px;

  border-bottom: 1px solid #edf1f5;
}


.secondary-section {
  margin-top: 30px;
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


.section-icon.green {
  background: #ecfdf3;

  color: #16a34a;
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


.fields-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 20px 18px;
}


.form-field.full-width {
  grid-column: 1 / -1;
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


.input-wrapper input,
.input-wrapper select {
  width: 100%;

  height: 100%;

  border: none;

  outline: none;

  background: transparent;

  color: #334155;

  font-size: 0.79rem;
}


.input-wrapper input {
  padding: 0 40px 0 39px;
}


.input-wrapper select {
  padding: 0 36px 0 39px;
}


.password-wrapper input {
  padding-right: 46px;
}


.password-toggle {
  position: absolute;

  right: 7px;

  width: 32px;
  height: 32px;

  border: none;

  border-radius: 8px;

  background: transparent;

  color: #64748b;
}


.field-footer {
  display: flex;

  justify-content: space-between;

  gap: 10px;

  margin-top: 5px;
}


.field-help,
.field-error,
.field-warning,
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


.field-warning {
  color: #d97706;
}


.character-counter {
  color: #c0cad6;
}


.password-strength {
  display: flex;

  align-items: center;

  gap: 9px;

  margin-top: 7px;
}


.strength-track {
  flex: 1;

  height: 5px;

  overflow: hidden;

  border-radius: 999px;

  background: #e2e8f0;
}


.strength-value {
  height: 100%;

  border-radius: inherit;

  transition: width 0.2s ease;
}


.strength-danger {
  background: #ef4444;
  color: #dc2626;
}


.strength-warning {
  background: #f97316;
  color: #ea580c;
}


.strength-medium {
  background: #eab308;
  color: #a16207;
}


.strength-good {
  background: #22c55e;
  color: #15803d;
}


.password-strength span {
  min-width: 65px;

  font-size: 0.61rem;

  font-weight: 800;
}


.client-link-card {
  display: grid;

  grid-template-columns:
    auto minmax(0, 1fr);

  gap: 14px;

  margin-top: 25px;

  padding: 18px;

  border: 1px solid #bfdbfe;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #f8fbff,
      #f0f7ff
    );
}


.client-link-icon {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #dbeafe;

  color: #2563eb;

  font-size: 1.15rem;
}


.client-link-eyebrow {
  display: block;

  color: #2563eb;

  font-size: 0.58rem;

  font-weight: 900;

  letter-spacing: 0.09em;
}


.client-link-content strong {
  display: block;

  margin-top: 2px;

  color: #1e3a5f;

  font-size: 0.8rem;
}


.client-link-content p {
  margin: 4px 0 12px;

  color: #64748b;

  font-size: 0.67rem;

  line-height: 1.5;
}


.client-select {
  max-width: 520px;
}


.security-note {
  display: flex;

  align-items: flex-start;

  gap: 11px;

  margin-top: 26px;

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


.form-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 26px;

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
}


.secondary-button {
  border: 1px solid #d8e0ea;

  background: #ffffff;

  color: #475569;
}


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

  justify-content: space-between;

  margin-bottom: 20px;

  color: #94a3b8;

  font-size: 0.6rem;

  font-weight: 800;

  letter-spacing: 0.11em;
}


.user-preview-avatar {
  width: 68px;
  height: 68px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 16px;

  border-radius: 17px;

  font-size: 1.1rem;

  font-weight: 900;
}


.avatar-admin {
  background: #f5f3ff;
  color: #7c3aed;
}


.avatar-technician {
  background: #fff7ed;
  color: #ea580c;
}


.avatar-client {
  background: #ecfdf3;
  color: #16a34a;
}


.avatar-default {
  background: #f1f5f9;
  color: #64748b;
}


.preview-card h3 {
  margin: 0;

  color: #25364d;

  font-size: 1.05rem;

  font-weight: 800;
}


.preview-email {
  display: flex;

  align-items: center;

  gap: 6px;

  margin: 6px 0 10px;

  color: #64748b;

  font-size: 0.7rem;

  word-break: break-word;
}


.preview-role-badge {
  display: inline-flex;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 0.62rem;

  font-weight: 800;
}


.role-admin {
  border: 1px solid #ddd6fe;

  background: #f5f3ff;

  color: #7c3aed;
}


.role-technician {
  border: 1px solid #fed7aa;

  background: #fff7ed;

  color: #ea580c;
}


.role-client {
  border: 1px solid #bbf7d0;

  background: #f0fdf4;

  color: #16a34a;
}


.role-default {
  border: 1px solid #e2e8f0;

  background: #f8fafc;

  color: #64748b;
}


.preview-divider {
  height: 1px;

  margin: 19px 0;

  background: #edf1f5;
}


.preview-item {
  margin-bottom: 14px;
}


.preview-item span {
  display: block;

  color: #94a3b8;

  font-size: 0.59rem;

  font-weight: 700;

  text-transform: uppercase;
}


.preview-item strong {
  display: block;

  margin-top: 3px;

  color: #334155;

  font-size: 0.75rem;

  word-break: break-word;
}


.status-value {
  color: #2563eb !important;
}


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


.message {
  max-width: 1300px;

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


.loading-card {
  max-width: 1300px;

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


@media (max-width: 950px) {

  .form-layout {
    grid-template-columns: 1fr;
  }


  .preview-column {
    position: static;
  }

}


@media (max-width: 700px) {

  .user-form-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;

    padding: 21px;
  }


  .fields-grid {
    grid-template-columns: 1fr;
  }


  .form-field.full-width {
    grid-column: auto;
  }


  .form-card {
    padding: 20px;
  }


  .client-link-card {
    grid-template-columns: 1fr;
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