<template>
  <div class="order-form-page">
    <!-- HEADER -->
    <section class="page-header">
      <div class="header-content">
        <button
          type="button"
          class="back-button"
          @click="redirigirListadoOrden"
        >
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <span class="eyebrow">OPERACIONES</span>
          <h1>
            {{ ver_orden ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo" }}
          </h1>
          <p>
            {{
              ver_orden
                ? "Actualiza la información operativa y los servicios asociados a la orden."
                : "Registra la información necesaria para programar y ejecutar un nuevo servicio."
            }}
          </p>
        </div>
      </div>
      <div
        v-if="ver_orden"
        class="order-reference"
      >
        <span>ORDEN</span>
        <strong>
          {{ ordenTrabajo.numeroOrden || `#${ordenId}` }}
        </strong>
      </div>
    </section>
    <!-- MENSAJES -->
    <div
      v-if="mensajeConfirmacion"
      class="message success-message"
    >
      <i class="bi bi-check-circle-fill"></i>
      {{ mensajeConfirmacion }}
    </div>
    <div
      v-if="mensajeError"
      class="message error-message"
    >
      <i class="bi bi-exclamation-circle-fill"></i>
      {{ mensajeError }}
    </div>
    <!-- LOADING -->
    <div
      v-if="cargando"
      class="loading-card"
    >
      <div class="spinner-border text-primary"></div>
      <span>Cargando información...</span>
    </div>
    <form
      v-else
      @submit.prevent="submitForm"
      class="form-layout"
    >
      <!-- ================================================= -->
      <!-- INFORMACIÓN GENERAL -->
      <!-- ================================================= -->
      <section class="form-card">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-clipboard-check"></i>
          </div>
          <div>
            <span class="section-number">01</span>
            <h2>Información general</h2>
            <p>
              Datos principales de identificación de la orden.
            </p>
          </div>
        </div>
        <div class="form-grid">
          <!-- NÚMERO ORDEN -->
          <div class="field-group full-width">
            <label for="numeroOrden">
              Número de orden
              <span class="required">*</span>
            </label>
            <div
              v-if="ver_orden"
              class="readonly-order"
            >
              <div class="readonly-icon">
                <i class="bi bi-hash"></i>
              </div>
              <div>
                <span>Número asignado</span>
                <strong>{{ ordenTrabajo.numeroOrden }}</strong>
              </div>
            </div>
            <div
              v-else
              class="input-icon-wrapper"
            >
              <i class="bi bi-hash"></i>
              <input
                id="numeroOrden"
                v-model.trim="ordenTrabajo.numeroOrden"
                type="text"
                minlength="3"
                required
                placeholder="Ej. OT-2026-001"
              />
            </div>
          </div>
          <!-- FECHA -->
          <div class="field-group">
            <label for="fecha">
              Fecha
              <span class="required">*</span>
            </label>
            <div class="input-icon-wrapper">
              <i class="bi bi-calendar3"></i>
              <input
                id="fecha"
                v-model="ordenTrabajo.fecha"
                type="date"
                required
              />
            </div>
          </div>
          <!-- ÁREA -->
          <div class="field-group">
            <label for="area">
              Área
              <span class="required">*</span>
            </label>
            <div class="input-icon-wrapper">
              <i class="bi bi-geo-alt"></i>
              <input
                id="area"
                v-model.trim="ordenTrabajo.area"
                type="text"
                minlength="3"
                required
                placeholder="Ej. Bodega principal"
              />
            </div>
          </div>
          <!-- DESCRIPCIÓN -->
          <div class="field-group full-width">
            <label for="descripcion">
              Descripción del trabajo
              <span class="required">*</span>
            </label>
            <textarea
              id="descripcion"
              v-model.trim="ordenTrabajo.descripcion"
              minlength="10"
              maxlength="500"
              required
              rows="4"
              placeholder="Describe el trabajo que debe realizarse..."
            ></textarea>
            <div class="field-footer">
              <span>
                Incluye información útil para el técnico asignado.
              </span>
              <span>
                {{ ordenTrabajo.descripcion.length }}/500
              </span>
            </div>
          </div>
        </div>
      </section>
      <!-- ================================================= -->
      <!-- PROGRAMACIÓN -->
      <!-- ================================================= -->
      <section class="form-card">
        <div class="section-header">
          <div class="section-icon schedule">
            <i class="bi bi-calendar-week"></i>
          </div>
          <div>
            <span class="section-number">02</span>
            <h2>Programación</h2>
            <p>
              Define el horario planificado para realizar el servicio.
            </p>
          </div>
        </div>
        <div class="schedule-grid">
          <!-- HORA INICIO -->
          <div class="field-group">
            <label for="horaInicio">
              Hora de inicio
              <span class="required">*</span>
            </label>
            <div class="input-icon-wrapper">
              <i class="bi bi-clock"></i>
              <input
                id="horaInicio"
                v-model="ordenTrabajo.hora"
                type="time"
                required
              />
            </div>
          </div>
          <div class="time-separator">
            <i class="bi bi-arrow-right"></i>
          </div>
          <!-- HORA FIN -->
          <div class="field-group">
            <label for="horaFin">
              Hora de finalización
              <span class="required">*</span>
            </label>
            <div class="input-icon-wrapper">
              <i class="bi bi-clock-history"></i>
              <input
                id="horaFin"
                v-model="ordenTrabajo.horaFin"
                type="time"
                required
              />
            </div>
          </div>
        </div>
        <div
          v-if="errorHorario"
          class="inline-warning"
        >
          <i class="bi bi-exclamation-triangle"></i>
          La hora de finalización debe ser posterior a la hora de inicio.
        </div>
      </section>
     <!-- ================================================= -->
<!-- ASIGNACIÓN -->
<!-- ================================================= -->
<section class="form-card">
  <div class="section-header">
    <div class="section-icon assignment">
      <i class="bi bi-people"></i>
    </div>
    <div>
      <span class="section-number">03</span>
      <h2>Asignación</h2>
      <p>
        Selecciona el cliente, la sucursal y el responsable de la orden.
      </p>
    </div>
  </div>
  <div class="form-grid">
    <!-- CLIENTE -->
    <div class="field-group">
      <label for="idClientes">
        Cliente
        <span class="required">*</span>
      </label>
      <div class="select-wrapper">
        <i class="bi bi-building"></i>
        <select
          id="idClientes"
          v-model="ordenTrabajo.idClientes"
          required
          @change="cargarSucursalesCliente"
        >
          <option
            disabled
            value=""
          >
            Seleccione un cliente
          </option>
          <option
            v-for="cliente in clientes"
            :key="cliente.id"
            :value="cliente.id"
          >
            {{ cliente.nombre }}
          </option>
        </select>
      </div>
      <span
        v-if="clientes.length === 0"
        class="field-warning"
      >
        No existen clientes disponibles.
      </span>
    </div>
    <!-- SUCURSAL -->
    <div class="field-group">
      <label for="idSucursal">
        Sucursal
      </label>
      <div class="select-wrapper">
        <i class="bi bi-geo-alt"></i>
        <select
          id="idSucursal"
          v-model="ordenTrabajo.idSucursal"
          :disabled="
            !ordenTrabajo.idClientes ||
            cargandoSucursales ||
            sucursales.length === 0
          "
        >
          <option :value="null">
            {{
              cargandoSucursales
                ? "Cargando sucursales..."
                : sucursales.length === 0
                  ? "Cliente sin sucursales"
                  : "Seleccione una sucursal"
            }}
          </option>
          <option
            v-for="sucursal in sucursales"
            :key="sucursal.id"
            :value="sucursal.id"
          >
            {{ sucursal.nombre }}
          </option>
        </select>
      </div>
      <span
        v-if="
          ordenTrabajo.idClientes &&
          !cargandoSucursales &&
          sucursales.length === 0
        "
        class="field-warning"
      >
        Este cliente no tiene sucursales activas.
      </span>
    </div>
    <!-- USUARIO -->
    <div class="field-group">
      <label for="idUsuarios">
        Usuario responsable
        <span class="required">*</span>
      </label>
      <div class="select-wrapper">
        <i class="bi bi-person-badge"></i>
        <select
          id="idUsuarios"
          v-model="ordenTrabajo.idUsuarios"
          required
        >
          <option
            disabled
            value=""
          >
            Seleccione un usuario
          </option>
          <option
            v-for="usuario in usuarios"
            :key="usuario.id"
            :value="usuario.id"
          >
            {{ usuario.nombre }}
          </option>
        </select>
      </div>
      <span
        v-if="usuarios.length === 0"
        class="field-warning"
      >
        No existen usuarios disponibles.
      </span>
    </div>
  </div>
  <!-- RESUMEN ASIGNACIÓN -->
  <div
    v-if="
      clienteSeleccionado ||
      sucursalSeleccionada ||
      usuarioSeleccionado
    "
    class="assignment-preview"
  >
    <!-- CLIENTE -->
    <div
      v-if="clienteSeleccionado"
      class="assignment-item"
    >
      <div class="avatar client-avatar">
        <i class="bi bi-building"></i>
      </div>
      <div>
        <span>Cliente</span>
        <strong>
          {{ clienteSeleccionado.nombre }}
        </strong>
      </div>
    </div>
    <!-- SUCURSAL -->
    <div
      v-if="sucursalSeleccionada"
      class="assignment-item"
    >
      <div class="avatar client-avatar">
        <i class="bi bi-geo-alt"></i>
      </div>
      <div>
        <span>Sucursal</span>
        <strong>
          {{ sucursalSeleccionada.nombre || "Sin Sucursal" }}
        </strong>
      </div>
    </div>
    <!-- USUARIO -->
    <div
      v-if="usuarioSeleccionado"
      class="assignment-item"
    >
      <div class="avatar user-avatar">
        <i class="bi bi-person"></i>
      </div>
      <div>
        <span>Responsable</span>
        <strong>
          {{ usuarioSeleccionado.nombre }}
        </strong>
      </div>
    </div>
  </div>
</section>
      <!-- ================================================= -->
      <!-- SERVICIOS -->
      <!-- ================================================= -->
      <section class="form-card">
        <div class="section-header services-header">
          <div class="section-header-content">
            <div class="section-icon services">
              <i class="bi bi-tools"></i>
            </div>
            <div>
              <span class="section-number">04</span>
              <h2>Servicios</h2>
              <p>
                Agrega los servicios que forman parte de esta orden.
              </p>
            </div>
          </div>
          <button
            type="button"
            class="add-service-button"
            @click="addServicio"
          >
            <i class="bi bi-plus-lg"></i>
            Añadir servicio
          </button>
        </div>
        <div class="services-list">
          <div
            v-for="(servicio, index) in ordenTrabajo.servicios"
            :key="index"
            class="service-item"
          >
            <div class="service-number">
              {{ index + 1 }}
            </div>
            <div class="service-field">
              <label :for="`servicio-${index}`">
                Servicio {{ index + 1 }}
              </label>
              <input
                :id="`servicio-${index}`"
                v-model.trim="servicio.tipoServicio"
                type="text"
                minlength="3"
                required
                placeholder="Ej. Control de plagas"
              />
            </div>
            <button
              type="button"
              class="remove-service-button"
              :disabled="ordenTrabajo.servicios.length === 1"
              title="Eliminar servicio"
              @click="removeServicio(index)"
            >
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
        <button
          type="button"
          class="add-service-mobile"
          @click="addServicio"
        >
          <i class="bi bi-plus-circle"></i>
          Añadir otro servicio
        </button>
      </section>
      <!-- ================================================= -->
        <!-- FIRMA DEL RESPONSABLE (solo cuando la orden está finalizada) -->
        <section v-if="estadoOrden === 'FINALIZADA'" class="form-card">
          <div class="section-header">
            <div class="section-icon signature-icon">
              <i class="bi bi-pen"></i>
            </div>
            <div>
              <span class="section-number">05</span>
              <h2>Firma del responsable</h2>
              <p>Firma del administrador. La orden también debe ser firmada por el cliente desde su portal.</p>
            </div>
          </div>
          <div v-if="firmaExistente" class="signature-status">
            <i class="bi bi-check-circle-fill"></i>
            El cliente ya firmó esta orden.
          </div>
          <div v-if="firmaCliente" class="signature-preview">
            <span class="signature-preview-label">Firma del cliente</span>
            <img :src="firmaCliente" alt="Firma del cliente" class="signature-preview-img" />
          </div>
          <div v-if="firmaAdminExistente" class="signature-status">
            <i class="bi bi-check-circle-fill"></i>
            Esta orden ya tiene la firma del responsable guardada.
          </div>
          <div v-if="firmaAdmin" class="signature-preview">
            <span class="signature-preview-label">Firma del responsable</span>
            <img :src="firmaAdmin" alt="Firma del responsable" class="signature-preview-img" />
          </div>
          <FirmaOrden
            ref="firmaOrden"
            titulo="Firma del responsable"
            @firma-guardada="recibirFirmaAdmin"
          />
          <p class="signature-note">
            Para firmar, dibuja y pulsa «Guardar firma» en el recuadro. La firma se guardará al guardar la orden.
          </p>
        </section>
        <section v-else class="form-card">
          <div class="section-header">
            <div class="section-icon signature-icon">
              <i class="bi bi-pen"></i>
            </div>
            <div>
              <span class="section-number">05</span>
              <h2>Firmas</h2>
              <p>La orden solo puede firmarse cuando está finalizada.</p>
            </div>
          </div>
          <div v-if="firmaExistente" class="signature-status">
            <i class="bi bi-check-circle-fill"></i>
            El cliente ya firmó esta orden.
          </div>
          <div v-if="firmaAdminExistente" class="signature-status">
            <i class="bi bi-check-circle-fill"></i>
            El responsable ya firmó esta orden.
          </div>
          <p class="signature-note">
            Cuando la orden se marque como finalizada podrás firmarla desde esta pantalla.
          </p>
        </section>
      <!-- RESUMEN -->
      <!-- ================================================= -->
      <section class="summary-card">
        <div class="summary-title">
          <i class="bi bi-clipboard-data"></i>
          <div>
            <span>RESUMEN</span>
            <strong>Orden de trabajo</strong>
          </div>
        </div>
        <div class="summary-data">
          <div>
            <span>Fecha</span>
            <strong>
              {{ fechaResumen }}
            </strong>
          </div>
          <div>
            <span>Horario</span>
            <strong>
              {{ horarioResumen }}
            </strong>
          </div>
          <div>
            <span>Cliente</span>
            <strong>
              {{
                clienteSeleccionado
                  ? clienteSeleccionado.nombre
                  : "Sin seleccionar"
              }}
            </strong>
          </div>
          <div>
            <span>Responsable</span>
            <strong>
              {{
                usuarioSeleccionado
                  ? usuarioSeleccionado.nombre
                  : "Sin seleccionar"
              }}
            </strong>
          </div>
          <div>
            <span>Servicios</span>
            <strong>
              {{ serviciosValidos }}
            </strong>
          </div>
        </div>
      </section>
      <!-- ================================================= -->
      <!-- ACCIONES -->
      <!-- ================================================= -->
      <section class="form-actions">
        <button
          type="button"
          class="secondary-button"
          :disabled="guardando"
          @click="redirigirListadoOrden"
        >
          <i class="bi bi-arrow-left"></i>
          Volver al listado
        </button>
        <button
          type="submit"
          class="primary-button"
          :disabled="guardando || errorHorario"
        >
          <span
            v-if="guardando"
            class="spinner-border spinner-border-sm"
          ></span>
          <i
            v-else
            :class="
              ver_orden
                ? 'bi bi-check-lg'
                : 'bi bi-floppy'
            "
          ></i>
          {{
            guardando
              ? "Guardando..."
              : ver_orden
                ? "Actualizar orden"
                : "Crear orden"
          }}
        </button>
      </section>
    </form>
  </div>
</template>
<script>
import {
  actualizarOrdenFachada,
  buscarOrdenPorId,
  crearOrdenFachada,
  guardarFirmaAdminOrdenFachada
} from "../helpers/OrdenTrabajoHelper";
import FirmaOrden from "../pages/FirmaOrden.vue";
import { generatePDFOrdenFachada } from "../helpers/generarOrdenPDF";
import {
  consultarUsuarioFachada
} from "../../Usuario/helpers/UsuarioHelper";
import {
  consultarClienteFachada
} from "../../Cliente/helpers/ClienteHelper";
import {
  consultarSucursalesActivasClienteFachada
} from "../../Cliente/helpers/SucursalHelper";
import {
  vincularOrdenAgendaFachada
} from "@/modules/Calendario/helper/AgendaHelper";
export default {
  name: "RegistrarOrdenTrabajo",
  components: { FirmaOrden },
  data() {
    return {
      ordenTrabajo: {
        fecha: "",
        hora: "",
        horaFin: "",
        numeroOrden: "",
        descripcion: "",
        area: "",
        idUsuarios: "",
        idClientes: "",
        idSucursal: null,
        servicios: [
          {
            tipoServicio: ""
          }
        ]
      },
      usuarios: [],
      clientes: [],
      sucursales: [],
      cargandoSucursales: false,
      ordenId:
        this.$route.params.id,
      ver_orden: false,
      cargando: true,
      guardando: false,
      firmaCliente: null,
      firmaExistente: false,
      firmaAdmin: null,
      firmaAdminExistente: false,
      firmaAdminNueva: null,
      estadoOrden: null,
      ordenPersistidaId: null,
      agendaId: null,
vieneDesdeAgenda: false,
      mensajeConfirmacion: "",
      mensajeError: ""
    };
  },
  computed: {
    // =====================================================
    // VALIDACIÓN HORARIO
    // =====================================================
    errorHorario() {
      if (
        !this.ordenTrabajo.hora
        ||
        !this.ordenTrabajo.horaFin
      ) {
        return false;
      }
      return (
        this.ordenTrabajo.horaFin
        <=
        this.ordenTrabajo.hora
      );
    },
    // =====================================================
    // CLIENTE SELECCIONADO
    // =====================================================
    clienteSeleccionado() {
      return this.clientes.find(
        cliente =>
          String(cliente.id)
          ===
          String(this.ordenTrabajo.idClientes)
      );
    },
    // =====================================================
    // SUCURSAL SELECCIONADA
    // =====================================================
    sucursalSeleccionada() {
      if (!this.ordenTrabajo.idSucursal) {
        return null;
      }
      return this.sucursales.find(
        sucursal =>
          String(sucursal.id)
          ===
          String(this.ordenTrabajo.idSucursal)
      ) || null;
    },
    // =====================================================
    // USUARIO SELECCIONADO
    // =====================================================
    usuarioSeleccionado() {
      return this.usuarios.find(
        usuario =>
          String(usuario.id)
          ===
          String(this.ordenTrabajo.idUsuarios)
      );
    },
    // =====================================================
    // SERVICIOS
    // =====================================================
    serviciosValidos() {
      return this.ordenTrabajo.servicios.filter(
        servicio =>
          servicio.tipoServicio
          &&
          servicio.tipoServicio.trim()
      ).length;
    },
    // =====================================================
    // FECHA RESUMEN
    // =====================================================
    fechaResumen() {
      if (!this.ordenTrabajo.fecha) {
        return "Sin definir";
      }
      const partes =
        this.ordenTrabajo.fecha.split("-");
      if (partes.length !== 3) {
        return this.ordenTrabajo.fecha;
      }
      const fecha =
        new Date(
          Number(partes[0]),
          Number(partes[1]) - 1,
          Number(partes[2])
        );
      return new Intl.DateTimeFormat(
        "es-EC",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      ).format(fecha);
    },
    // =====================================================
    // HORARIO RESUMEN
    // =====================================================
    horarioResumen() {
      if (
        !this.ordenTrabajo.hora
        ||
        !this.ordenTrabajo.horaFin
      ) {
        return "Sin definir";
      }
      return (
        `${this.ordenTrabajo.hora.substring(0, 5)} - `
        +
        `${this.ordenTrabajo.horaFin.substring(0, 5)}`
      );
    }
  },
  async mounted() {
    await this.inicializarFormulario();
  },
  methods: {
    // =====================================================
    // INICIALIZAR
    // =====================================================
async inicializarFormulario() {
  this.cargando = true;
  this.mensajeError = "";
  try {
    // Primero cargamos catálogos
    await Promise.all([
      this.cargarClientes(),
      this.cargarUsuarios()
    ]);
    // =============================================
    // CASO 1: EDITAR UNA ORDEN EXISTENTE
    // =============================================
    if (this.ordenId) {
      await this.consultarPorIdOrden();
      return;
    }
    // =============================================
    // CASO 2: CREAR ORDEN DESDE EL CALENDARIO
    // =============================================
    if (this.$route.query.agendaId) {
      await this.cargarDatosDesdeAgenda();
    }
    // =============================================
    // CASO 3:
    // Nueva orden normal.
    // No hacemos nada y dejamos formulario vacío.
    // =============================================
  } catch (error) {
    console.error(
      "Error inicializando formulario:",
      error
    );
    this.mensajeError =
      "No se pudo cargar la información necesaria para la orden.";
  } finally {
    this.cargando = false;
  }
},
// =====================================================
// CARGAR DATOS DESDE AGENDA
// =====================================================
async cargarDatosDesdeAgenda() {
  const query = this.$route.query;
  console.log(
    "PARAMETROS RECIBIDOS DESDE AGENDA:",
    query
  );
  this.agendaId =
    query.agendaId
      ? Number(query.agendaId)
      : null;
  this.vieneDesdeAgenda =
    !!this.agendaId;
  // FECHA
  if (query.fecha) {
    this.ordenTrabajo.fecha =
      String(query.fecha);
  }
  // HORA INICIO
  if (query.hora) {
    this.ordenTrabajo.hora =
      String(query.hora).substring(0, 5);
  }
  // HORA FIN
  if (query.horaFin) {
    this.ordenTrabajo.horaFin =
      String(query.horaFin).substring(0, 5);
  }
  // DESCRIPCIÓN
  if (query.descripcion) {
    this.ordenTrabajo.descripcion =
      String(query.descripcion);
  }
  // ÁREA
  if (query.area) {
    this.ordenTrabajo.area =
      String(query.area);
  }
  // =============================================
  // CLIENTE
  // =============================================
  if (query.clienteId) {
    this.ordenTrabajo.idClientes =
      Number(query.clienteId);
    // IMPORTANTE:
    // cargamos sucursales sin borrar la que
    // vamos a seleccionar desde la agenda.
    await this.cargarSucursalesCliente(false);
  }
  // =============================================
  // SUCURSAL
  // =============================================
  if (query.sucursalId) {
    const sucursalId =
      Number(query.sucursalId);
    const existeSucursal =
      this.sucursales.some(
        sucursal =>
          Number(sucursal.id) === sucursalId
      );
    if (existeSucursal) {
      this.ordenTrabajo.idSucursal =
        sucursalId;
    } else {
      console.warn(
        "La sucursal de la agenda no pertenece al cliente o no está activa:",
        sucursalId
      );
    }
  }
  // =============================================
  // TÉCNICO / USUARIO
  // =============================================
  if (query.usuarioId) {
    const usuarioId =
      Number(query.usuarioId);
    const existeUsuario =
      this.usuarios.some(
        usuario =>
          Number(usuario.id) === usuarioId
      );
    if (existeUsuario) {
      this.ordenTrabajo.idUsuarios =
        usuarioId;
    } else {
      console.warn(
        "El usuario de la agenda no existe:",
        usuarioId
      );
    }
  }
  console.log(
    "ORDEN PRECARGADA DESDE AGENDA:",
    this.ordenTrabajo
  );
},
    // =====================================================
    // CONSULTAR ORDEN
    // =====================================================
    async consultarPorIdOrden() {
      if (!this.ordenId) {
        this.ver_orden = false;
        return;
      }
      const orden =
        await buscarOrdenPorId(
          this.ordenId
        );
      const clienteId =
        orden.cliente?.id
        ??
        orden.idClientes
        ??
        "";
      const sucursalId =
        orden.sucursal?.id
        ??
        orden.idSucursal
        ??
        null;
      this.ordenTrabajo = {
        fecha:
          orden.fecha
            ? orden.fecha.split("T")[0]
            : "",
        hora:
          orden.hora
            ? String(orden.hora).substring(0, 5)
            : "",
        horaFin:
          orden.horaFin
            ? String(orden.horaFin).substring(0, 5)
            : "",
        numeroOrden:
          orden.numeroOrden || "",
        descripcion:
          orden.descripcion || "",
        area:
          orden.area || "",
        idUsuarios:
          orden.usuario?.id
          ??
          orden.idUsuarios
          ??
          "",
        idClientes:
          clienteId,
        idSucursal:
          sucursalId,
        servicios:
          Array.isArray(orden.servicios)
          &&
          orden.servicios.length > 0
            ? orden.servicios.map(
                servicio => ({
                  ...servicio,
                  tipoServicio:
                    servicio.tipoServicio || ""
                })
              )
            : [
                {
                  tipoServicio: ""
                }
              ]
      };
      /*
       * Cuando estamos editando una orden,
       * primero cargamos las sucursales del cliente.
       *
       * NO limpiamos idSucursal porque necesitamos
       * conservar la sucursal guardada en la orden.
       */
      if (clienteId) {
        await this.cargarSucursalesCliente(
          false
        );
      }
      this.firmaCliente = orden.firmaCliente || null;
      this.firmaExistente = Boolean(orden.firmaCliente);
      this.firmaAdmin = orden.firmaAdmin || null;
      this.firmaAdminExistente = Boolean(orden.firmaAdmin);
      this.firmaAdminNueva = null;
      this.estadoOrden = orden.estado || null;
      this.ver_orden = true;
    },
    // =====================================================
    // CLIENTES
    // =====================================================
    async cargarClientes() {
      const response =
        await consultarClienteFachada();
      this.clientes =
        Array.isArray(response)
          ? response
          : [];
    },
    // =====================================================
    // USUARIOS
    // =====================================================
    async cargarUsuarios() {
      const response =
        await consultarUsuarioFachada();
      this.usuarios =
        Array.isArray(response)
          ? response
          : [];
    },
    // =====================================================
    // SUCURSALES DEL CLIENTE
    // =====================================================
    async cargarSucursalesCliente(
      limpiarSeleccion = true
    ) {
      /*
       * Cuando el usuario cambia manualmente
       * de cliente debemos borrar la sucursal anterior.
       *
       * Cuando estamos cargando una orden para editar,
       * usamos false para conservar idSucursal.
       */
      if (limpiarSeleccion) {
        this.ordenTrabajo.idSucursal = null;
      }
      this.sucursales = [];
      const clienteId =
        this.ordenTrabajo.idClientes;
      if (!clienteId) {
        return;
      }
      this.cargandoSucursales = true;
      try {
        const response =
          await consultarSucursalesActivasClienteFachada(
            clienteId
          );
        this.sucursales =
          Array.isArray(response)
            ? response
            : [];
        /*
         * Si estamos editando y por alguna razón
         * la sucursal guardada ya no pertenece
         * a las sucursales activas, evitamos
         * dejar un ID inválido seleccionado.
         */
        if (
          !limpiarSeleccion
          &&
          this.ordenTrabajo.idSucursal
        ) {
          const existe =
            this.sucursales.some(
              sucursal =>
                String(sucursal.id)
                ===
                String(
                  this.ordenTrabajo.idSucursal
                )
            );
          if (!existe) {
            console.warn(
              "La sucursal guardada en la orden no está activa o no pertenece al cliente."
            );
          }
        }
      } catch (error) {
        console.error(
          "Error cargando sucursales:",
          error
        );
        this.sucursales = [];
        this.mensajeError =
          "No se pudieron cargar las sucursales del cliente.";
      } finally {
        this.cargandoSucursales = false;
      }
    },
    // =====================================================
    // SERVICIOS
    // =====================================================
    addServicio() {
      this.ordenTrabajo.servicios.push({
        tipoServicio: ""
      });
      this.$nextTick(() => {
        const elementos =
          document.querySelectorAll(
            ".service-field input"
          );
        if (elementos.length > 0) {
          elementos[
            elementos.length - 1
          ].focus();
        }
      });
    },
    removeServicio(index) {
      if (
        this.ordenTrabajo.servicios.length
        <=
        1
      ) {
        return;
      }
      this.ordenTrabajo.servicios.splice(
        index,
        1
      );
    },
    // =====================================================
    // GUARDAR
    // =====================================================
recibirFirma(firmaBase64) {

  this.firmaCliente =
    firmaBase64;

  console.log(
    "Firma capturada en RegistrarOrdenTrabajo:",
    firmaBase64
      ? firmaBase64.substring(0, 80)
      : "Firma eliminada"
  );
},

recibirFirmaAdmin(firmaBase64) {

  this.firmaAdminNueva =
    firmaBase64;
},

async generarPDFConFirma(idGuardado, payload = {}) {
  try {
    console.log("====================================");
    console.log("GENERANDO PDF FIRMADO");
    console.log("ID orden:", idGuardado);
    console.log(
      "Firma capturada en Vue:",
      this.firmaCliente
        ? this.firmaCliente.substring(0, 80)
        : "SIN FIRMA"
    );

    // 1. Recuperamos la orden completa porque aquí vienen
    // cliente, usuario, servicios, etc.
    const ordenGuardada = await buscarOrdenPorId(
      idGuardado
    );

    console.log(
      "Orden recuperada del backend:",
      ordenGuardada
    );

    console.log(
      "Firma devuelta por backend:",
      ordenGuardada?.firmaCliente
        ? ordenGuardada.firmaCliente.substring(0, 80)
        : "SIN FIRMA EN BACKEND"
    );

    // 2. Para generar el PDF damos prioridad a la firma
    // que acabamos de capturar en el canvas.
    //
    // Esto evita depender de que GET /orden/{id}
    // devuelva inmediatamente firmaCliente.
    const firmaParaPDF =
      this.firmaCliente ||
      ordenGuardada?.firmaCliente ||
      null;

    const firmaAdminParaPDF =
      this.firmaAdminNueva ||
      ordenGuardada?.firmaAdmin ||
      null;

    if (!firmaParaPDF && !firmaAdminParaPDF) {
      throw new Error(
        "No existe una firma disponible para generar el PDF."
      );
    }

    console.log(
      "Firma que se enviará al PDF:",
      firmaParaPDF
        ? firmaParaPDF.substring(0, 80)
        : "SIN FIRMA CLIENTE"
    );

    // 3. Construimos el objeto final.
    //
    // ordenGuardada va primero porque contiene las
    // relaciones completas necesarias para el PDF.
    const ordenParaPDF = {
      ...payload,
      ...ordenGuardada,
      firmaCliente: firmaParaPDF,
      firmaAdmin: firmaAdminParaPDF
    };

    console.log(
      "firmaCliente en ordenParaPDF:",
      ordenParaPDF.firmaCliente
        ? ordenParaPDF.firmaCliente.substring(0, 80)
        : "SIN FIRMA"
    );

    // 4. Generar PDF
    await generatePDFOrdenFachada(
      ordenParaPDF
    );

    console.log(
      "PDF firmado generado correctamente."
    );

    console.log("====================================");

  } catch (error) {
    console.error(
      "ERROR GENERANDO PDF FIRMADO:",
      error
    );

    throw error;
  }
},
    async submitForm() {
      if (this.guardando) return;
      if (this.errorHorario) {
        this.mensajeError = "La hora de finalización debe ser posterior a la hora de inicio.";
        return;
      }
      if (this.firmaAdminNueva && !this.firmaAdminNueva.startsWith("data:image/png;base64,")) {
        this.mensajeError = "La firma debe estar guardada en formato PNG.";
        return;
      }

      this.guardando = true;
      this.mensajeConfirmacion = "";
      this.mensajeError = "";
      let idGuardado = this.ver_orden ? this.ordenId : this.ordenPersistidaId;
      let datosGuardados = false;
      let firmaGuardada = this.firmaExistente;

      try {
        const payload = {
          ...this.ordenTrabajo,
          estado: this.estadoOrden || undefined,
          idSucursal: this.ordenTrabajo.idSucursal || null,
          servicios: this.ordenTrabajo.servicios
            .filter(s => s.tipoServicio && s.tipoServicio.trim())
            .map(s => ({ ...s, tipoServicio: s.tipoServicio.trim() }))
        };

        if (this.ver_orden || this.ordenPersistidaId) {
          // La edición usa el endpoint existente, sin enviar la firma en el payload.
          await actualizarOrdenFachada(idGuardado, payload);
        } else {
          const creada = await crearOrdenFachada(payload);
          idGuardado = creada?.id;
          if (!idGuardado) {
            throw new Error("La orden pudo crearse, pero el servidor no devolvió su ID. Comprueba el listado antes de volver a crearla.");
          }
          // Retener el ID para impedir duplicados si falla la firma, la agenda o el PDF.
          this.ordenPersistidaId = idGuardado;
        }
        datosGuardados = true;

        // Conservar la vinculación con agenda que ya tenía el formulario.
        if (this.vieneDesdeAgenda && this.agendaId) {
          await vincularOrdenAgendaFachada(this.agendaId, idGuardado);
          this.vieneDesdeAgenda = false;
        }

        // Guardar la firma del responsable recién capturada.
        if (this.firmaAdminNueva) {
          await guardarFirmaAdminOrdenFachada(idGuardado, this.firmaAdminNueva);
          firmaGuardada = true;
          this.firmaAdminExistente = true;
          this.firmaAdmin = this.firmaAdminNueva;
          this.firmaAdminNueva = null;
        }

        // Generar PDF solo cuando hay alguna firma. Las órdenes sin firmar
        // siguen pudiendo programarse y firmarse posteriormente.
        if (this.firmaCliente || this.firmaAdmin) {
          await this.generarPDFConFirma(idGuardado, payload);
        }

        this.mensajeConfirmacion = this.firmaAdmin || this.firmaCliente
          ? `Orden ${idGuardado} guardada y PDF firmado generado correctamente.`
          : `Orden ${idGuardado} guardada. Puedes firmarla cuando esté finalizada.`;

        if (!this.ver_orden && !this.ordenPersistidaId) {
          this.limpiarFormulario();
        } else {
          // Mantener en pantalla la orden recién creada para no duplicarla.
          this.ordenId = idGuardado;
          this.ver_orden = true;
          this.ordenPersistidaId = idGuardado;
        }
      } catch (error) {
        console.error("Error procesando la orden:", error);
        const backend = typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message;
        this.mensajeError = idGuardado && datosGuardados
          ? `La orden ${idGuardado} está guardada${firmaGuardada ? " y tiene firma" : ""}, pero faltó completar algún paso. No crees otra orden: vuelve a guardar desde esta pantalla. ${backend || error.message || ""}`
          : backend || error.message || "No se pudo guardar la orden.";
      } finally {
        this.guardando = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },

    // =====================================================
    // LIMPIAR
    // =====================================================
    limpiarFormulario() {
      this.ordenTrabajo = {
        fecha: "",
        hora: "",
        horaFin: "",
        numeroOrden: "",
        descripcion: "",
        area: "",
        idUsuarios: "",
        idClientes: "",
        idSucursal: null,
        servicios: [
          {
            tipoServicio: ""
          }
        ]
      };
      this.sucursales = [];
      this.firmaCliente = null;
      this.firmaExistente = false;
      this.firmaAdmin = null;
      this.firmaAdminExistente = false;
      this.firmaAdminNueva = null;
      this.estadoOrden = null;
      this.ordenPersistidaId = null;
      this.$nextTick(() => this.$refs.firmaOrden?.limpiar?.());
    },
    // =====================================================
    // NAVEGACIÓN
    // =====================================================
    redirigirListadoOrden() {
      this.$router.push(
        "/orden_trabajo_lista"
      );
    }
  }
};
</script>
<style scoped>
.order-form-page {
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
  max-width: 1180px;
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
.header-content {
  display: flex;
  align-items: center;
  gap: 17px;
}
.back-button {
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe5f0;
  border-radius: 11px;
  background: #f8fafc;
  color: #2563eb;
  font-size: 1rem;
  cursor: pointer;
}
.back-button:hover {
  background: #eff6ff;
}
.eyebrow {
  display: block;
  margin-bottom: 4px;
  color: #2563eb;
  font-size: 0.61rem;
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
  max-width: 700px;
  margin: 6px 0 0;
  color: #64748b;
  font-size: 0.78rem;
  line-height: 1.5;
}
.order-reference {
  min-width: 150px;
  padding: 11px 15px;
  border: 1px solid #bfdbfe;
  border-radius: 11px;
  background: #eff6ff;
  text-align: right;
}
.order-reference span {
  display: block;
  color: #64748b;
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.order-reference strong {
  display: block;
  margin-top: 2px;
  color: #2563eb;
  font-size: 0.82rem;
}
/* ========================================================= */
/* LAYOUT */
/* ========================================================= */
.form-layout {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.form-card,
.summary-card {
  padding: 27px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow:
    0 8px 25px
    rgba(15, 23, 42, 0.045);
}
/* ========================================================= */
/* SECTION HEADER */
/* ========================================================= */
.section-header {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 23px;
  padding-bottom: 17px;
  border-bottom: 1px solid #edf1f5;
}
.section-header-content {
  display: flex;
  align-items: center;
  gap: 13px;
}
.section-icon {
  width: 45px;
  height: 45px;
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 1rem;
}
.section-icon.schedule {
  background: #fff7ed;
  color: #ea580c;
}
.section-icon.assignment {
  background: #f0fdf4;
  color: #16a34a;
}
.section-icon.services {
  background: #f5f3ff;
  color: #7c3aed;
}
.section-number {
  display: block;
  color: #94a3b8;
  font-size: 0.53rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}
.section-header h2 {
  margin: 1px 0 0;
  color: #172033;
  font-size: 1rem;
  font-weight: 800;
}
.section-header p {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 0.68rem;
}
/* ========================================================= */
/* CAMPOS */
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
.field-group label,
.service-field label {
  display: block;
  margin-bottom: 7px;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 800;
}
.required {
  color: #dc2626;
}
.field-group input,
.field-group textarea,
.field-group select,
.service-field input {
  width: 100%;
  border: 1px solid #dce4ee;
  border-radius: 10px;
  background: #fbfdff;
  color: #334155;
  font-size: 0.77rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    *background* 0.2s ease;
}
.field-group input,
.field-group select,
.service-field input {
  height: 44px;
  padding: 0 12px;
}
.field-group textarea {
  min-height: 105px;
  padding: 12px;
  resize: vertical;
}
.field-group input:focus,
.field-group textarea:focus,
.field-group select:focus,
.service-field input:focus {
  border-color: #60a5fa;
  background: #ffffff;
  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.08);
}
.input-icon-wrapper,
.select-wrapper {
  position: relative;
}
.input-icon-wrapper > i,
.select-wrapper > i {
  position: absolute;
  top: 50%;
  left: 13px;
  z-index: 2;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}
.input-icon-wrapper input,
.select-wrapper select {
  padding-left: 38px;
}
.field-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 0.59rem;
}
.field-warning {
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 0.61rem;
}
/* ========================================================= */
/* READONLY */
/* ========================================================= */
.readonly-order {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 8px 12px;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  background: #f8fbff;
}
.readonly-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #dbeafe;
  color: #2563eb;
}
.readonly-order span {
  display: block;
  color: #94a3b8;
  font-size: 0.56rem;
}
.readonly-order strong {
  display: block;
  color: #1e40af;
  font-size: 0.8rem;
}
/* ========================================================= */
/* HORARIO */
/* ========================================================= */
.schedule-grid {
  display: grid;
  grid-template-columns:
    1fr auto 1fr;
  align-items: end;
  gap: 15px;
}
.time-separator {
  width: 36px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}
.inline-warning {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid #fed7aa;
  border-radius: 9px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 0.66rem;
  font-weight: 600;
}
/* ========================================================= */
/* ASIGNACIÓN */
/* ========================================================= */
.assignment-preview {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 19px;
  padding-top: 18px;
  border-top: 1px solid #edf1f5;
}
.assignment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px;
  border: 1px solid #e5eaf0;
  border-radius: 11px;
  background: #fafcff;
}
.avatar {
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
}
.client-avatar {
  background: #eff6ff;
  color: #2563eb;
}
.user-avatar {
  background: #ecfdf3;
  color: #16a34a;
}
.assignment-item span {
  display: block;
  color: #94a3b8;
  font-size: 0.55rem;
}
.assignment-item strong {
  display: block;
  margin-top: 1px;
  color: #334155;
  font-size: 0.7rem;
}
/* ========================================================= */
/* SERVICIOS */
/* ========================================================= */
.services-header {
  justify-content: space-between;
}
.add-service-button,
.add-service-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #c4b5fd;
  border-radius: 9px;
  background: #f5f3ff;
  color: #7c3aed;
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
}
.add-service-button {
  min-height: 37px;
  padding: 0 12px;
}
.add-service-mobile {
  display: none;
  width: 100%;
  min-height: 42px;
  margin-top: 10px;
}
.services-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.service-item {
  display: grid;
  grid-template-columns:
    34px 1fr 38px;
  align-items: end;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e8e7f3;
  border-radius: 11px;
  background: #fdfcff;
}
.service-number {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 7px;
  border-radius: 50%;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 0.66rem;
  font-weight: 900;
}
.remove-service-button {
  width: 38px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #fff;
  color: #dc2626;
}
.remove-service-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
/* ========================================================= */
/* RESUMEN */
/* ========================================================= */
.summary-card {
  display: flex;
  align-items: center;
  gap: 28px;
  background:
    linear-gradient(
      135deg,
      #f8fbff,
      #ffffff
    );
}
.summary-title {
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.summary-title > i {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
}
.summary-title span {
  display: block;
  color: #2563eb;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}
.summary-title strong {
  display: block;
  color: #172033;
  font-size: 0.76rem;
}
.summary-data {
  flex: 1;
  display: grid;
  grid-template-columns:
    repeat(6, minmax(0, 1fr));
  gap: 13px;
}
.summary-data div {
  min-width: 0;
}
.summary-data span {
  display: block;
  color: #94a3b8;
  font-size: 0.54rem;
}
.summary-data strong {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  color: #334155;
  font-size: 0.66rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* ========================================================= */
/* ACCIONES */
/* ========================================================= */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 19px 22px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    0 8px 25px
    rgba(15, 23, 42, 0.045);
}
.primary-button,
.secondary-button {
  min-height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 17px;
  border-radius: 10px;
  font-size: 0.72rem;
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
  border: 1px solid #dce4ee;
  background: #ffffff;
  color: #475569;
}
button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
/* ========================================================= */
/* MENSAJES */
/* ========================================================= */
.message,
.loading-card {
  max-width: 1180px;
  margin: 0 auto 17px;
}
.message {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 15px;
  border-radius: 11px;
  font-size: 0.73rem;
  font-weight: 700;
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
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  color: #64748b;
  font-size: 0.75rem;
}
/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */
@media (max-width: 900px) {
  .summary-card {
    flex-direction: column;
    align-items: stretch;
  }
  .summary-data {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .order-form-page {
    padding: 16px;
  }
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .order-reference {
    width: 100%;
    text-align: left;
  }
  .form-grid,
  .assignment-preview {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: auto;
  }
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  .time-separator {
    display: none;
  }
  .services-header {
    align-items: flex-start;
  }
  .add-service-button {
    display: none;
  }
  .add-service-mobile {
    display: flex;
  }
  .summary-data {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .form-actions button {
    width: 100%;
  }
}

.signature-icon { background: #eff6ff; color: #2563eb; }
.signature-status { padding: 12px; margin-bottom: 12px; border-radius: 10px; background: #effaf2; color: #166534; font-size: .78rem; }
.signature-note { margin-top: 10px; color: #64748b; font-size: .73rem; }
.signature-preview { margin-bottom: 12px; }
.signature-preview-label { display: block; font-size: .72rem; font-weight: 600; color: #334155; margin-bottom: 4px; }
.signature-preview-img { width: 100%; max-width: 340px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; }
.form-card :deep(canvas) { max-width: 100%; touch-action: none; }
</style>