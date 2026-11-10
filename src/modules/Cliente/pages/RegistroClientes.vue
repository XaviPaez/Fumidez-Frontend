<template>
  <div class="client-form-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>

        <button type="button" class="back-link" @click="redirigirListadoCliente">
          <i class="bi bi-arrow-left"></i>
          Volver a clientes
        </button>

        <span class="page-eyebrow">
          CLIENTES
        </span>

        <h1>
          {{ esEdicion ? "Editar cliente" : "Nuevo cliente" }}
        </h1>

        <p>
          {{
            esEdicion
              ? "Actualiza la información comercial y de contacto del cliente."
              : "Registra un nuevo cliente para asociarlo a órdenes, informes y servicios."
          }}
        </p>

      </div>


      <span class="mode-badge" :class="esEdicion ? 'edit' : 'new'">
        <i class="bi" :class="esEdicion
            ? 'bi-pencil-square'
            : 'bi-person-plus'
          "></i>

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

    <div v-if="mensajeConfirmacion" class="message success-message">
      <i class="bi bi-check-circle-fill"></i>

      <div>
        <strong>Operación exitosa</strong>
        <span>{{ mensajeConfirmacion }}</span>
      </div>
    </div>


    <div v-if="mensajeError" class="message error-message">
      <i class="bi bi-exclamation-circle-fill"></i>

      <div>
        <strong>Revise la información</strong>
        <span>{{ mensajeError }}</span>
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- CARGANDO -->
    <!-- ===================================================== -->

    <div v-if="cargandoInicial" class="loading-card">
      <div class="spinner-border text-primary"></div>

      <span>
        Cargando información del cliente...
      </span>
    </div>


    <!-- ===================================================== -->
    <!-- CONTENIDO -->
    <!-- ===================================================== -->

    <div v-else class="form-layout">

      <!-- =================================================== -->
      <!-- FORMULARIO -->
      <!-- =================================================== -->

      <section class="form-card">

        <form novalidate @submit.prevent="guardarCliente">

          <!-- ================================================= -->
          <!-- INFORMACIÓN GENERAL -->
          <!-- ================================================= -->

          <div class="section-header">

            <div class="section-icon">
              <i class="bi bi-building"></i>
            </div>

            <div>
              <h2>
                Información del cliente
              </h2>

              <p>
                Datos de identificación y ubicación.
              </p>
            </div>

          </div>


          <div class="fields-grid">

            <!-- NOMBRE -->

            <div class="form-field full-width">

              <label for="nombre">
                Nombre / Razón social
                <span class="required">*</span>
              </label>

              <div class="input-wrapper" :class="{ invalid: errores.nombre }">
                <i class="bi bi-building"></i>

                <input id="nombre" v-model.trim="cliente.nombre" type="text" maxlength="150"
                  placeholder="Ej. Empresa ABC S.A." @input="limpiarError('nombre')" />
              </div>

              <div class="field-footer">

                <span v-if="errores.nombre" class="field-error">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ errores.nombre }}
                </span>

                <span v-else class="field-help">
                  Nombre comercial o razón social del cliente.
                </span>

                <span class="character-counter">
                  {{ cliente.nombre.length }}/150
                </span>

              </div>

            </div>


            <!-- RUC -->

            <div class="form-field">

              <label for="ruc">
                RUC
                <span class="required">*</span>
              </label>

              <div class="input-wrapper" :class="{ invalid: errores.ruc }">
                <i class="bi bi-card-text"></i>

                <input id="ruc" v-model.trim="cliente.ruc" type="text" maxlength="20" inputmode="numeric"
                  placeholder="Ej. 1790012345001" @input="limpiarError('ruc')" />
              </div>

              <span v-if="errores.ruc" class="field-error">
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.ruc }}
              </span>

              <span v-else class="field-help">
                Identificación tributaria del cliente.
              </span>

            </div>


            <!-- DIRECCIÓN -->

            <div class="form-field">

              <label for="direccion">
                Dirección
                <span class="required">*</span>
              </label>

              <div class="input-wrapper" :class="{ invalid: errores.direccion }">
                <i class="bi bi-geo-alt"></i>

                <input id="direccion" v-model.trim="cliente.direccion" type="text" maxlength="220"
                  placeholder="Ej. Av. República E7-123, Quito" @input="limpiarError('direccion')" />
              </div>

              <span v-if="errores.direccion" class="field-error">
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.direccion }}
              </span>

              <span v-else class="field-help">
                Dirección principal donde se prestan o coordinan los servicios.
              </span>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- CONTACTO PRINCIPAL -->
          <!-- ================================================= -->

          <div class="section-header secondary-section">

            <div class="section-icon green">
              <i class="bi bi-person-lines-fill"></i>
            </div>

            <div>
              <h2>
                Contacto principal
              </h2>

              <p>
                Persona responsable para coordinación de servicios.
              </p>
            </div>

          </div>


          <div class="fields-grid">

            <!-- PERSONA ENCARGADA -->

            <div class="form-field full-width">

              <label for="personaEncargada">
                Persona responsable
                <span class="required">*</span>
              </label>

              <div class="input-wrapper" :class="{ invalid: errores.personaEncargada }">
                <i class="bi bi-person"></i>

                <input id="personaEncargada" v-model.trim="cliente.personaEncargada" type="text" maxlength="120"
                  placeholder="Nombre de la persona encargada" @input="limpiarError('personaEncargada')" />
                <span v-if="errores.personaEncargada" class="field-error">
                  <i class="bi bi-exclamation-circle"></i>
                  {{ errores.personaEncargada }}
                </span>

                <span v-else class="field-help">
                  Contacto principal del cliente. Esta persona aparecerá en la orden de trabajo.
                </span>
              </div>

              <span v-if="errores.personaEncargada" class="field-error">
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.personaEncargada }}
              </span>

              <span v-else class="field-help">
                Persona con quien Fumidez coordina visitas y servicios.
              </span>

            </div>


            <!-- CORREO -->

            <div class="form-field">

              <label for="correo">
                Correo electrónico
                <span class="required">*</span>
              </label>

              <div class="input-wrapper" :class="{ invalid: errores.correo }">
                <i class="bi bi-envelope"></i>

                <input id="correo" v-model.trim="cliente.correo" type="email" maxlength="150"
                  placeholder="cliente@empresa.com" @input="limpiarError('correo')" />
              </div>

              <span v-if="errores.correo" class="field-error">
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.correo }}
              </span>

              <span v-else class="field-help">
                Utilizado para comunicaciones y confirmaciones.
              </span>

            </div>


            <!-- TELÉFONO -->

            <div class="form-field">

              <label for="telefono">
                Teléfono
                <span class="required">*</span>
              </label>

              <div class="input-wrapper" :class="{ invalid: errores.telefono }">
                <i class="bi bi-telephone"></i>

                <input id="telefono" v-model.trim="cliente.telefono" type="tel" maxlength="30"
                  placeholder="Ej. 099 123 4567" @input="limpiarError('telefono')" />
              </div>

              <span v-if="errores.telefono" class="field-error">
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.telefono }}
              </span>

              <span v-else class="field-help">
                Teléfono principal de contacto.
              </span>

            </div>

          </div>
          <!-- ================================================= -->
          <!-- SUCURSALES -->
          <!-- ================================================= -->

          <div class="section-header secondary-section">
            <div class="section-icon branch">
              <i class="bi bi-diagram-3"></i>
            </div>

            <div class="branch-section-title">
              <div>
                <h2>Sucursales</h2>
                <p>
                  Contactos que recibirán avisos de los trabajos realizados
                  en cada sucursal.
                </p>
              </div>

              <button type="button" class="add-branch-button" @click="agregarSucursal">
                <i class="bi bi-plus-lg"></i>
                Agregar sucursal
              </button>
            </div>
          </div>

          <div v-if="sucursales.length === 0" class="empty-branches">
            <i class="bi bi-buildings"></i>

            <div>
              <strong>Este cliente no tiene sucursales registradas</strong>
              <span>
                Puedes agregar sucursales y definir quién recibirá los avisos
                de trabajo en cada una.
              </span>
            </div>
          </div>

          <div
  v-for="(sucursal, index) in sucursales"
  :key="sucursal.id || `nueva-${index}`"
  class="branch-card"
>
  <!-- CABECERA SUCURSAL -->
  <div class="branch-card-header">
    <div class="branch-title-group">
      <div class="branch-index">
        {{ index + 1 }}
      </div>

      <div class="branch-title-text">
        <span class="branch-number">
          SUCURSAL {{ index + 1 }}
        </span>

        <strong>
          {{ sucursal.nombre || "Nueva sucursal" }}
        </strong>
      </div>
    </div>

    <button
      type="button"
      class="remove-branch-button"
      title="Eliminar sucursal"
      @click="eliminarSucursal(index)"
    >
      <i class="bi bi-trash"></i>
    </button>
  </div>

  <!-- CAMPOS -->
  <div class="fields-grid">

    <!-- NOMBRE -->
    <div class="form-field">
      <label>
        Nombre de sucursal
        <span class="required">*</span>
      </label>

      <div class="input-wrapper">
        <i class="bi bi-building"></i>

        <input
          v-model.trim="sucursal.nombre"
          type="text"
          maxlength="150"
          placeholder="Ej. Sucursal Sur"
        />
      </div>
    </div>

    <!-- DIRECCIÓN -->
    <div class="form-field">
      <label>
        Dirección
        <span class="required">*</span>
      </label>

      <div class="input-wrapper">
        <i class="bi bi-geo-alt"></i>

        <input
          v-model.trim="sucursal.direccion"
          type="text"
          maxlength="220"
          placeholder="Dirección de la sucursal"
        />
      </div>
    </div>

    <!-- PERSONA CONTACTO -->
    <div class="form-field full-width">
      <label>
        Persona de contacto para avisos
        <span class="required">*</span>
      </label>

      <div class="input-wrapper">
        <i class="bi bi-person"></i>

        <input
          v-model.trim="sucursal.personaContacto"
          type="text"
          maxlength="120"
          placeholder="Persona que recibirá los avisos de esta sucursal"
        />
      </div>

      <span class="field-help">
        Este contacto es únicamente para notificaciones y no aparecerá
        en la orden de trabajo.
      </span>
    </div>

    <!-- CORREO -->
    <div class="form-field">
      <label>
        Correo para avisos
        <span class="required">*</span>
      </label>

      <div class="input-wrapper">
        <i class="bi bi-envelope"></i>

        <input
          v-model.trim="sucursal.correoContacto"
          type="email"
          maxlength="150"
          placeholder="contacto@empresa.com"
        />
      </div>
    </div>

    <!-- TELÉFONO -->
    <div class="form-field">
      <label>
        Teléfono
      </label>

      <div class="input-wrapper">
        <i class="bi bi-telephone"></i>

        <input
          v-model.trim="sucursal.telefonoContacto"
          type="tel"
          maxlength="30"
          placeholder="099 123 4567"
        />
      </div>
    </div>

  </div>
</div>
          <!-- ================================================= -->
          <!-- ACCESO PORTAL -->
          <!-- ================================================= -->

          <div class="portal-access-card">

            <div class="portal-access-icon">
              <i class="bi bi-shield-lock"></i>
            </div>


            <div class="portal-access-content">

              <span class="portal-access-eyebrow">
                PORTAL DEL CLIENTE
              </span>

              <strong>
                Acceso digital del cliente
              </strong>

              <p>
                El cliente puede disponer de acceso al portal para consultar
                sus órdenes, informes y evidencias fotográficas.
              </p>


              <div class="portal-access-status">

                <span class="status-pill" :class="esEdicion ? 'pending' : 'neutral'">
                  <span class="status-dot"></span>

                  {{
                    esEdicion
                      ? "Acceso gestionado desde Usuarios"
                      : "Disponible después de crear el cliente"
                  }}
                </span>

              </div>

            </div>


            <button v-if="esEdicion" type="button" class="portal-button" @click="irAUsuarios">
              <i class="bi bi-person-gear"></i>
              Gestionar acceso
            </button>

          </div>


          <!-- ================================================= -->
          <!-- ACCIONES -->
          <!-- ================================================= -->

          <div class="form-actions">

            <button type="button" class="secondary-button" :disabled="guardando" @click="redirigirListadoCliente">
              Cancelar
            </button>


            <button type="submit" class="primary-button" :disabled="guardando">

              <span v-if="guardando" class="spinner-border spinner-border-sm"></span>

              <i v-else class="bi" :class="esEdicion
                  ? 'bi-check-lg'
                  : 'bi-plus-lg'
                "></i>

              {{
                guardando
                  ? "Guardando..."
                  : esEdicion
                    ? "Guardar cambios"
                    : "Crear cliente"
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
            <span>VISTA PREVIA</span>
            <i class="bi bi-eye"></i>
          </div>


          <div class="client-preview-avatar">
            {{ inicialesCliente }}
          </div>


          <h3>
            {{ cliente.nombre || "Nuevo cliente" }}
          </h3>


          <p class="preview-ruc">
            <i class="bi bi-card-text"></i>

            {{ cliente.ruc || "RUC no registrado" }}
          </p>


          <div class="preview-divider"></div>


          <div class="preview-item">

            <span>
              Responsable
            </span>

            <strong>
              {{
                cliente.personaEncargada
                || "Sin definir"
              }}
            </strong>

          </div>


          <div class="preview-item">

            <span>
              Correo
            </span>

            <strong>
              {{
                cliente.correo
                || "Sin definir"
              }}
            </strong>

          </div>


          <div class="preview-item">

            <span>
              Teléfono
            </span>

            <strong>
              {{
                cliente.telefono
                || "Sin definir"
              }}
            </strong>

          </div>


          <div class="preview-item">

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


        <section class="tips-card">

          <div class="tips-title">

            <i class="bi bi-lightbulb"></i>

            <strong>
              Recomendaciones
            </strong>

          </div>


          <ul>
            <li>
              Verifica que el correo corresponda al contacto principal.
            </li>

            <li>
              Mantén actualizado el nombre de la persona encargada.
            </li>

            <li>
              Usa la dirección operativa donde se realizan los servicios.
            </li>
          </ul>

        </section>

      </aside>

    </div>

  </div>
</template>


<script>
import {
  actualizarClienteFachada,
  crearClienteFachada,
  obtenerClienteFachada
} from "../helpers/ClienteHelper";

import {
  crearSucursalFachada,
  consultarSucursalesClienteFachada,
  actualizarSucursalFachada
} from "../helpers/SucursalHelper";

export default {

  name: "ClienteFormulario",


  data() {

    return {

      cliente: {
        nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
        ruc: "",
        personaEncargada: ""
      },
      sucursales: [],
      sucursalesEliminadas: [],

      clienteId:
        this.$route.params.id
        || null,

      cargandoInicial: false,

      guardando: false,

      mensajeConfirmacion: "",

      mensajeError: "",

      errores: {
        nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
        ruc: "",
        personaEncargada: ""
      }

    };

  },


  computed: {

    esEdicion() {

      return Boolean(
        this.clienteId
      );

    },


    inicialesCliente() {

      const nombre =
        this.cliente.nombre
          ?.trim();


      if (!nombre) {
        return "CL";
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

    }

  },


  async mounted() {

    if (this.esEdicion) {
      await this.cargarCliente();
    }

  },


  methods: {


    validarSucursales() {

      for (let i = 0; i < this.sucursales.length; i++) {

        const sucursal = this.sucursales[i];

        if (!sucursal.nombre?.trim()) {
          this.mensajeError =
            `Debes ingresar el nombre de la sucursal ${i + 1}.`;

          return false;
        }

        if (!sucursal.direccion?.trim()) {
          this.mensajeError =
            `Debes ingresar la dirección de la sucursal ${i + 1}.`;

          return false;
        }

        if (!sucursal.personaContacto?.trim()) {
          this.mensajeError =
            `Debes ingresar la persona de contacto de la sucursal ${i + 1}.`;

          return false;
        }

        if (!sucursal.correoContacto?.trim()) {
          this.mensajeError =
            `Debes ingresar el correo de la sucursal ${i + 1}.`;

          return false;
        }

        const correoValido =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            sucursal.correoContacto
          );

        if (!correoValido) {
          this.mensajeError =
            `El correo de la sucursal ${i + 1} no es válido.`;

          return false;
        }
      }

      return true;
    },

    agregarSucursal() {
      this.sucursales.push({
        id: null,
        nombre: "",
        direccion: "",
        personaContacto: "",
        correoContacto: "",
        telefonoContacto: "",
        activa: true
      });
    },

   eliminarSucursal(index) {

  const sucursal =
    this.sucursales[index];


  if (!sucursal) {
    return;
  }


  // Si ya existe en BD, la guardamos para
  // desactivarla cuando el usuario pulse Guardar.
  if (sucursal.id) {

    this.sucursalesEliminadas.push({
      ...sucursal,
      activa: false
    });

  }


  // La quitamos visualmente del formulario.
  this.sucursales.splice(
    index,
    1
  );

},

    // =====================================================
    // CARGAR CLIENTE
    // =====================================================

    async cargarCliente() {

  try {

    this.cargandoInicial = true;
    this.mensajeError = "";

    // =====================================================
    // CARGAR CLIENTE
    // =====================================================

    const cliente =
      await obtenerClienteFachada(
        this.clienteId
      );


    console.log(
      "CLIENTE CARGADO:",
      cliente
    );


    this.cliente = {

      nombre:
        cliente.nombre || "",

      telefono:
        cliente.telefono || "",

      correo:
        cliente.correo || "",

      direccion:
        cliente.direccion || "",

      ruc:
        cliente.ruc || "",

      personaEncargada:
        cliente.personaEncargada || ""

    };


    // =====================================================
    // CARGAR SUCURSALES DEL CLIENTE
    // =====================================================

    const sucursales =
      await consultarSucursalesClienteFachada(
        this.clienteId
      );


    console.log(
      "SUCURSALES DEL CLIENTE:",
      sucursales
    );


    this.sucursales =
      Array.isArray(sucursales)
        ? sucursales
        : [];


    this.sucursalesEliminadas = [];


  } catch (error) {

    console.error(
      "Error cargando cliente:",
      error
    );


    this.mensajeError =
      "No se pudo cargar la información del cliente.";


  } finally {

    this.cargandoInicial = false;

  }

},

    // =====================================================
    // VALIDACIÓN
    // =====================================================

    validarFormulario() {

      this.errores = {
        nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
        ruc: "",
        personaEncargada: ""
      };


      let valido = true;


      if (
        !this.cliente.nombre
        ||
        !this.cliente.nombre.trim()
      ) {

        this.errores.nombre =
          "Ingrese el nombre o razón social.";

        valido = false;

      }


      if (
        !this.cliente.ruc
        ||
        !this.cliente.ruc.trim()
      ) {

        this.errores.ruc =
          "Ingrese el RUC del cliente.";

        valido = false;

      }


      if (
        !this.cliente.direccion
        ||
        !this.cliente.direccion.trim()
      ) {

        this.errores.direccion =
          "Ingrese la dirección del cliente.";

        valido = false;

      }


      if (
        !this.cliente.personaEncargada
        ||
        !this.cliente.personaEncargada.trim()
      ) {

        this.errores.personaEncargada =
          "Ingrese la persona encargada.";

        valido = false;

      }


      if (
        !this.cliente.correo
        ||
        !this.cliente.correo.trim()
      ) {

        this.errores.correo =
          "Ingrese el correo electrónico.";

        valido = false;

      } else if (
        !this.esCorreoValido(
          this.cliente.correo
        )
      ) {

        this.errores.correo =
          "Ingrese un correo electrónico válido.";

        valido = false;

      }


      if (
        !this.cliente.telefono
        ||
        !this.cliente.telefono.trim()
      ) {

        this.errores.telefono =
          "Ingrese el número de teléfono.";

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

    async guardarCliente() {

      this.mensajeConfirmacion = "";
      this.mensajeError = "";


      if (!this.validarFormulario()) {

        this.mensajeError =
          "Revise los campos marcados antes de continuar.";

        return;

      }


      this.guardando = true;


      const clienteBody = {

        nombre:
          this.cliente.nombre.trim(),

        telefono:
          this.cliente.telefono.trim(),

        correo:
          this.cliente.correo.trim(),

        direccion:
          this.cliente.direccion.trim(),

        ruc:
          this.cliente.ruc.trim(),

        personaEncargada:
          this.cliente.personaEncargada.trim()

      };


      try {

        if (this.esEdicion) {

  // =====================================================
  // ACTUALIZAR CLIENTE
  // =====================================================

  await actualizarClienteFachada(
    this.clienteId,
    clienteBody
  );


  // =====================================================
  // ACTUALIZAR EXISTENTES / CREAR NUEVAS
  // =====================================================

  await Promise.all(

    this.sucursales.map(
      sucursal => {

        const sucursalBody = {

          nombre:
            sucursal.nombre.trim(),

          direccion:
            sucursal.direccion?.trim() || null,

          personaContacto:
            sucursal.personaContacto?.trim() || null,

          correoContacto:
            sucursal.correoContacto?.trim() || null,

          telefonoContacto:
            sucursal.telefonoContacto?.trim() || null,

          activa:
            sucursal.activa !== false

        };


        if (sucursal.id) {

          return actualizarSucursalFachada(
            sucursal.id,
            sucursalBody
          );

        }


        return crearSucursalFachada({

          ...sucursalBody,

          clienteId:
            Number(this.clienteId)

        });

      }
    )

  );


  // =====================================================
  // DESACTIVAR SUCURSALES RETIRADAS
  // =====================================================

  if (this.sucursalesEliminadas.length > 0) {

    await Promise.all(

      this.sucursalesEliminadas.map(
        sucursal =>

          actualizarSucursalFachada(
            sucursal.id,
            {
              nombre:
                sucursal.nombre,

              direccion:
                sucursal.direccion || null,

              personaContacto:
                sucursal.personaContacto || null,

              correoContacto:
                sucursal.correoContacto || null,

              telefonoContacto:
                sucursal.telefonoContacto || null,

              activa: false
            }
          )

      )

    );

  }


  this.sucursalesEliminadas = [];


  this.mensajeConfirmacion =
    "El cliente y sus sucursales fueron actualizados correctamente.";


        } else {

          // =====================================================
// CREAR CLIENTE
// =====================================================

const nuevoCliente =
  await crearClienteFachada(
    clienteBody
  );


// El backend ahora devuelve el cliente creado con su ID
const clienteId =
  nuevoCliente.id;


// =====================================================
// GUARDAR SUCURSALES
// =====================================================

if (this.sucursales.length > 0) {

  await Promise.all(

    this.sucursales.map(
      sucursal =>

        crearSucursalFachada({

          clienteId: clienteId,

          nombre:
            sucursal.nombre.trim(),

          direccion:
            sucursal.direccion?.trim() || null,

          personaContacto:
            sucursal.personaContacto?.trim() || null,

          correoContacto:
            sucursal.correoContacto?.trim() || null,

          telefonoContacto:
            sucursal.telefonoContacto?.trim() || null,

          activa: true

        })

    )

  );

}


// =====================================================
// CONFIRMACIÓN
// =====================================================

this.mensajeConfirmacion =
  "El cliente y sus sucursales fueron creados correctamente.";


this.resetCliente();

this.sucursales = [];

        }


      } catch (error) {

        console.error(
          "Error guardando cliente:",
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
              ? "No se pudo actualizar el cliente."
              : "No se pudo crear el cliente."
          );

      } finally {

        this.guardando = false;

      }

    },


    resetCliente() {

      this.cliente = {
        nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
        ruc: "",
        personaEncargada: ""
      };


      this.errores = {
        nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
        ruc: "",
        personaEncargada: ""
      };

    },


    redirigirListadoCliente() {

      this.$router.push(
        "/clientes_lista"
      );

    },


    irAUsuarios() {

      this.$router.push(
        "/usuarios_lista"
      );

    }

  }

};
</script>


<style scoped>
.client-form-page {
  min-height: 100vh;
  padding: 34px;

  background:
    linear-gradient(135deg,
      #f8fbff 0%,
      #eef4fb 100%);

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
    0 10px 30px rgba(15, 23, 42, 0.06);
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
    minmax(0, 1.65fr) minmax(280px, 0.75fr);

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
    0 8px 24px rgba(15, 23, 42, 0.05);
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

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.input-wrapper:focus-within {
  border-color: #93b4ed;
  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.06);
}


.input-wrapper.invalid {
  border-color: #fca5a5;
  background: #fffafa;
}


.input-wrapper>i {
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
  color: #c0cad6;
}


.portal-access-card {
  display: grid;

  grid-template-columns:
    auto minmax(0, 1fr) auto;

  align-items: center;

  gap: 14px;

  margin-top: 28px;

  padding: 17px;

  border: 1px solid #bfdbfe;
  border-radius: 13px;

  background:
    linear-gradient(135deg,
      #f8fbff,
      #f0f7ff);
}


.portal-access-icon {
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


.portal-access-eyebrow {
  display: block;

  color: #2563eb;

  font-size: 0.58rem;
  font-weight: 900;

  letter-spacing: 0.09em;
}


.portal-access-content strong {
  display: block;

  margin-top: 2px;

  color: #1e3a5f;

  font-size: 0.8rem;
}


.portal-access-content p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 0.67rem;
  line-height: 1.5;
}


.portal-access-status {
  margin-top: 8px;
}


.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 0.6rem;
  font-weight: 800;
}


.status-pill.pending {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}


.status-pill.neutral {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
}


.status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
}


.portal-button {
  min-height: 38px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 0 12px;

  border: 1px solid #93c5fd;
  border-radius: 9px;

  background: #ffffff;

  color: #2563eb;

  font-size: 0.68rem;
  font-weight: 800;
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


.client-preview-avatar {
  width: 68px;
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 16px;

  border-radius: 17px;

  background:
    linear-gradient(135deg,
      #eff6ff,
      #dbeafe);

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


.preview-ruc {
  display: flex;
  align-items: center;
  gap: 6px;

  margin: 6px 0 0;

  color: #64748b;

  font-size: 0.7rem;
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

/* =========================================================
   SUCURSALES
   ========================================================= */

.section-icon.branch {
  background: #eff6ff;
  color: #2563eb;
}

.branch-section-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.add-branch-button {
  flex-shrink: 0;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  background: #ffffff;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.add-branch-button:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  transform: translateY(-1px);
}


/* SIN SUCURSALES */

.empty-branches {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px dashed #cbd5e1;
  border-radius: 13px;
  background: #f8fafc;
  color: #64748b;
}

.empty-branches > i {
  flex-shrink: 0;
  font-size: 1.4rem;
  color: #94a3b8;
}

.empty-branches strong {
  display: block;
  margin-bottom: 3px;
  color: #475569;
  font-size: 0.76rem;
}

.empty-branches span {
  display: block;
  color: #94a3b8;
  font-size: 0.67rem;
  line-height: 1.5;
}


/* TARJETA DE SUCURSAL */

.branch-card {
  margin-top: 16px;
  padding: 20px;
  border: 1px solid #dbe4ef;
  border-radius: 15px;
  background: #fbfdff;
  box-shadow:
    0 4px 14px rgba(15, 23, 42, 0.035);
}

.branch-card + .branch-card {
  margin-top: 14px;
}


/* CABECERA */

.branch-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8eef5;
}

.branch-title-group {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 11px;
}

.branch-index {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eaf2ff;
  color: #2563eb;
  font-size: 0.76rem;
  font-weight: 900;
}

.branch-title-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.branch-number {
  display: block;
  color: #94a3b8;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.branch-title-text strong {
  display: block;
  overflow: hidden;
  color: #25364d;
  font-size: 0.86rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* BOTÓN ELIMINAR */

.remove-branch-button {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #ffffff;
  color: #dc2626;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.remove-branch-button:hover {
  border-color: #fca5a5;
  background: #fef2f2;
  transform: translateY(-1px);
}


/* RESPONSIVE SUCURSALES */

@media (max-width: 700px) {

  .branch-section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .add-branch-button {
    width: 100%;
  }

  .branch-card {
    padding: 16px;
  }

  .branch-card-header {
    align-items: flex-start;
  }

  .branch-title-text strong {
    white-space: normal;
  }
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

  .client-form-page {
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

  .portal-access-card {
    grid-template-columns: auto 1fr;
  }

  .portal-button {
    grid-column: 1 / -1;
    width: 100%;
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