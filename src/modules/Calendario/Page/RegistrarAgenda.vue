<template>
    <div class="agenda-page">

        <div class="agenda-card">

            <!-- ================================================= -->
            <!-- HEADER -->
            <!-- ================================================= -->

            <div class="agenda-header">

                <div>
                    <span class="agenda-eyebrow">
                        PLANIFICACIÓN
                    </span>

                    <h1>
                        Agendar trabajo
                    </h1>

                    <p>
                        Reserva un espacio en el calendario antes de crear
                        la orden de trabajo.
                    </p>
                </div>

                <button type="button" class="btn-back" @click="volver">
                    <i class="fas fa-arrow-left"></i>
                    Volver
                </button>

            </div>


            <!-- ================================================= -->
            <!-- MENSAJES -->
            <!-- ================================================= -->

            <div v-if="mensajeError" class="alert-message alert-error">
                <i class="fas fa-circle-exclamation"></i>

                <span>
                    {{ mensajeError }}
                </span>
            </div>


            <div v-if="mensajeConfirmacion" class="alert-message alert-success">
                <i class="fas fa-circle-check"></i>

                <span>
                    {{ mensajeConfirmacion }}
                </span>
            </div>


            <!-- ================================================= -->
            <!-- FORMULARIO -->
            <!-- ================================================= -->

            <form class="agenda-form" @submit.prevent="guardarAgenda">

                <!-- ================================================= -->
                <!-- FECHA -->
                <!-- ================================================= -->

                <div class="form-field">

                    <label for="fecha">
                        Fecha
                    </label>

                    <input id="fecha" v-model="agenda.fecha" type="date" class="form-control" required />

                </div>


                <!-- ================================================= -->
                <!-- HORA INICIO -->
                <!-- ================================================= -->

                <div class="form-field">

                    <label for="horaInicio">
                        Hora inicio
                    </label>

                    <input id="horaInicio" v-model="agenda.horaInicio" type="time" class="form-control" required />

                </div>


                <!-- ================================================= -->
                <!-- HORA FIN -->
                <!-- ================================================= -->

                <div class="form-field">

                    <label for="horaFin">
                        Hora fin
                    </label>

                    <input id="horaFin" v-model="agenda.horaFin" type="time" class="form-control" required />

                </div>


                <!-- ================================================= -->
                <!-- CLIENTE -->
                <!-- ================================================= -->

                <div class="form-field">

                    <label for="cliente">
                        Cliente
                    </label>

                    <select id="cliente" v-model="agenda.clienteId" class="form-select" required
                        @change="cargarSucursales">

                        <option :value="null" disabled>
                            Seleccione un cliente
                        </option>

                        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                            {{ cliente.nombre }}
                        </option>

                    </select>

                </div>


                <!-- ================================================= -->
                <!-- SUCURSAL -->
                <!-- ================================================= -->

                <div class="form-field">

                    <label for="sucursal">
                        Sucursal
                    </label>

                    <select id="sucursal" v-model="agenda.sucursalId" class="form-select" :disabled="!agenda.clienteId ||
                        cargandoSucursales
                        " @change="generarTituloAutomatico">

                        <option :value="null">
                            Sin sucursal
                        </option>

                        <option v-for="sucursal in sucursales" :key="sucursal.id" :value="sucursal.id">
                            {{ sucursal.nombre }}
                        </option>

                    </select>


                    <small v-if="cargandoSucursales" class="form-help">
                        Cargando sucursales...
                    </small>


                    <small v-else-if="
                        agenda.clienteId &&
                        sucursales.length === 0
                    " class="form-help">
                        Este cliente no tiene sucursales activas.
                    </small>

                </div>


                <!-- ================================================= -->
                <!-- TÉCNICO -->
                <!-- ================================================= -->

                <div class="form-field">

                    <label for="tecnico">
                        Técnico
                    </label>

                    <select id="tecnico" v-model="agenda.usuarioId" class="form-select" required>
                        <option :value="null" disabled>
                            Seleccione un técnico
                        </option>

                        <option v-for="usuario in tecnicos" :key="usuario.id" :value="usuario.id">
                            {{ usuario.nombre }}
                        </option>
                    </select>


                    <small v-if="cargandoTecnicos" class="form-help">
                        Cargando técnicos...
                    </small>

                </div>


                <!-- ================================================= -->
                <!-- TÍTULO -->
                <!-- ================================================= -->

                <div class="form-field form-field-full">

                    <label for="titulo">
                        Título
                    </label>

                    <input id="titulo" v-model.trim="agenda.titulo" type="text" class="form-control" maxlength="150"
                        required placeholder="Ej. Fumigación EDIMCA SUR" />

                </div>


                <!-- ================================================= -->
                <!-- DESCRIPCIÓN -->
                <!-- ================================================= -->

                <div class="form-field form-field-full">

                    <label for="descripcion">
                        Descripción
                    </label>

                    <textarea id="descripcion" v-model.trim="agenda.descripcion" class="form-control" rows="4"
                        maxlength="1000" placeholder="Detalles del trabajo programado..."></textarea>

                </div>


                <!-- ================================================= -->
                <!-- RESUMEN -->
                <!-- ================================================= -->

                <div class="reservation-summary form-field-full">

                    <div class="summary-icon">
                        <i class="far fa-calendar-check"></i>
                    </div>

                    <div class="summary-content">

                        <strong>
                            Reserva
                        </strong>

                        <span>
                            {{ fechaLegible }}
                        </span>

                        <span>
                            {{ agenda.horaInicio || "--:--" }}
                            -
                            {{ agenda.horaFin || "--:--" }}
                        </span>

                        <span v-if="clienteSeleccionado">
                            {{ clienteSeleccionado.nombre }}

                            <template v-if="sucursalSeleccionada">
                                · {{ sucursalSeleccionada.nombre }}
                            </template>
                        </span>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- BOTONES -->
                <!-- ================================================= -->

                <div class="form-actions form-field-full">

                    <button type="button" class="btn-cancel" :disabled="guardando" @click="volver">
                        Cancelar
                    </button>


                    <button type="submit" class="btn-save" :disabled="guardando">

                        <i class="fas" :class="guardando
                                ? 'fa-spinner fa-spin'
                                : 'fa-calendar-plus'
                            "></i>

                        {{
                            guardando
                                ? "Guardando..."
                                : "Guardar reserva"
                        }}

                    </button>

                </div>

            </form>

        </div>

    </div>
</template>


<script>

import router from "@/router";


// =========================================================
// HELPERS
// =========================================================

import {
    crearAgendaFachada
} from "@/modules/Calendario/helper/AgendaHelper";


import {
    consultarClienteFachada
} from "@/modules/Cliente/helpers/ClienteHelper";


import {
    consultarSucursalesActivasClienteFachada
} from "@/modules/Cliente/helpers/SucursalHelper";


import {
    consultarUsuarioFachada
} from "@/modules/Usuario/helpers/UsuarioHelper";


// =========================================================
// COMPONENTE
// =========================================================

export default {

    name: "RegistrarAgenda",


    data() {

        return {

            // =====================================================
            // AGENDA
            // =====================================================

            agenda: {

                fecha: "",

                horaInicio: "",

                horaFin: "",

                clienteId: null,

                sucursalId: null,

                usuarioId: null,

                titulo: "",

                descripcion: ""

            },


            // =====================================================
            // CATÁLOGOS
            // =====================================================

            clientes: [],

            sucursales: [],

            tecnicos: [],


            // =====================================================
            // ESTADOS
            // =====================================================

            guardando: false,

            cargandoClientes: false,

            cargandoSucursales: false,

            cargandoTecnicos: false,


            // =====================================================
            // MENSAJES
            // =====================================================

            mensajeError: "",

            mensajeConfirmacion: ""

        };

    },


    // =========================================================
    // COMPUTED
    // =========================================================

    computed: {


        clienteSeleccionado() {

            if (!this.agenda.clienteId) {
                return null;
            }


            return (
                this.clientes.find(
                    cliente =>
                        Number(cliente.id)
                        ===
                        Number(this.agenda.clienteId)
                )
                ||
                null
            );

        },


        sucursalSeleccionada() {

            if (!this.agenda.sucursalId) {
                return null;
            }


            return (
                this.sucursales.find(
                    sucursal =>
                        Number(sucursal.id)
                        ===
                        Number(this.agenda.sucursalId)
                )
                ||
                null
            );

        },


        fechaLegible() {

            if (!this.agenda.fecha) {
                return "Sin fecha";
            }


            /*
             * IMPORTANTE:
             *
             * No hacemos:
             *
             * new Date("2026-09-25")
             *
             * porque JavaScript puede interpretarlo como UTC
             * y mostrar el día anterior dependiendo de la zona
             * horaria.
             */

            const partes =
                String(this.agenda.fecha)
                    .split("-")
                    .map(Number);


            if (
                partes.length !== 3
                ||
                partes.some(
                    numero =>
                        Number.isNaN(numero)
                )
            ) {

                return this.agenda.fecha;

            }


            const fecha =
                new Date(
                    partes[0],
                    partes[1] - 1,
                    partes[2]
                );


            return new Intl.DateTimeFormat(
                "es-EC",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            ).format(fecha);

        }

    },


    // =========================================================
    // MOUNTED
    // =========================================================

    async mounted() {

        /*
         * Primero recuperamos:
         *
         * fecha
         * horaInicio
         * horaFin
         *
         * enviados desde el calendario.
         */

        this.cargarParametrosCalendario();


        /*
         * Luego cargamos catálogos.
         */

        await Promise.all([
            this.cargarClientes(),
            this.cargarTecnicos()
        ]);

    },


    // =========================================================
    // METHODS
    // =========================================================

    methods: {


        // =====================================================
        // PARÁMETROS DEL CALENDARIO
        // =====================================================

        cargarParametrosCalendario() {

            const query =
                this.$route.query;


            if (query.fecha) {

                this.agenda.fecha =
                    String(
                        query.fecha
                    );

            }


            if (query.horaInicio) {

                this.agenda.horaInicio =
                    this.normalizarHoraFormulario(
                        query.horaInicio
                    );

            }


            if (query.horaFin) {

                this.agenda.horaFin =
                    this.normalizarHoraFormulario(
                        query.horaFin
                    );

            }

        },


        // =====================================================
        // NORMALIZAR HORA PARA INPUT
        // =====================================================

        normalizarHoraFormulario(hora) {

            if (!hora) {
                return "";
            }


            return String(hora)
                .substring(0, 5);

        },


        // =====================================================
        // NORMALIZAR HORA PARA BACKEND
        // =====================================================

        normalizarHoraBackend(hora) {

            if (!hora) {
                return null;
            }


            const valor =
                String(hora);


            /*
             * Si ya viene HH:mm:ss,
             * no agregamos otros segundos.
             */

            if (
                /^\d{2}:\d{2}:\d{2}$/
                    .test(valor)
            ) {

                return valor;

            }


            /*
             * Si viene HH:mm:
             *
             * 09:30
             *
             * enviamos:
             *
             * 09:30:00
             */

            if (
                /^\d{2}:\d{2}$/
                    .test(valor)
            ) {

                return `${valor}:00`;

            }


            return valor;

        },


        // =====================================================
        // CLIENTES
        // =====================================================

        async cargarClientes() {

            try {

                this.cargandoClientes = true;


                const respuesta =
                    await consultarClienteFachada();


                this.clientes =
                    Array.isArray(respuesta)
                        ? respuesta
                        : [];


            } catch (error) {

                console.error(
                    "Error cargando clientes:",
                    error
                );


                this.mensajeError =
                    "No se pudieron cargar los clientes.";


            } finally {

                this.cargandoClientes = false;

            }

        },


        // =====================================================
        // SUCURSALES
        // =====================================================

        async cargarSucursales() {

            this.agenda.sucursalId =
                null;


            this.sucursales =
                [];


            this.generarTituloAutomatico();


            if (!this.agenda.clienteId) {
                return;
            }


            try {

                this.cargandoSucursales =
                    true;


                const respuesta =
                    await consultarSucursalesActivasClienteFachada(
                        Number(
                            this.agenda.clienteId
                        )
                    );


                this.sucursales =
                    Array.isArray(respuesta)
                        ? respuesta
                        : [];


                /*
                 * Actualizamos el título con el nombre
                 * del cliente.
                 */

                this.generarTituloAutomatico();


            } catch (error) {

                console.error(
                    "Error cargando sucursales:",
                    error
                );


                this.mensajeError =
                    "No se pudieron cargar las sucursales.";


            } finally {

                this.cargandoSucursales =
                    false;

            }

        },


        // =====================================================
        // TÉCNICOS
        // =====================================================

        async cargarTecnicos() {

            try {

                this.cargandoTecnicos = true;

                this.mensajeError = "";


                const respuesta =
                    await consultarUsuarioFachada();


                const usuarios =
                    Array.isArray(respuesta)
                        ? respuesta
                        : [];


                console.log(
                    "USUARIOS RECIBIDOS:",
                    usuarios
                );


                // ==========================================
                // SOLO USUARIOS TIPO TECNICO
                // ==========================================

                this.tecnicos =
                    usuarios.filter(
                        usuario =>
                            String(
                                usuario.tipo || ""
                            )
                                .trim()
                                .toUpperCase()
                            === "TECNICO"
                    );


                console.log(
                    "TÉCNICOS DISPONIBLES:",
                    this.tecnicos
                );


            } catch (error) {

                console.error(
                    "Error cargando técnicos:",
                    error
                );


                this.tecnicos = [];


                this.mensajeError =
                    "No se pudieron cargar los técnicos.";


            } finally {

                this.cargandoTecnicos = false;

            }

        },
        // =====================================================
        // NOMBRE DEL USUARIO
        // =====================================================

        nombreUsuario(usuario) {

            if (!usuario) {
                return "Usuario";
            }


            return (
                usuario.nombre
                ||
                usuario.nombreUsuario
                ||
                usuario.username
                ||
                usuario.correo
                ||
                `Usuario ${usuario.id}`
            );

        },


        // =====================================================
        // GENERAR TÍTULO
        // =====================================================

        generarTituloAutomatico() {

            const cliente =
                this.clientes.find(
                    item =>
                        Number(item.id)
                        ===
                        Number(this.agenda.clienteId)
                );


            const sucursal =
                this.sucursales.find(
                    item =>
                        Number(item.id)
                        ===
                        Number(this.agenda.sucursalId)
                );


            /*
             * Solo generamos automáticamente si tenemos
             * un cliente.
             *
             * El usuario todavía puede modificar manualmente
             * el título después.
             */

            if (!cliente) {
                return;
            }


            if (sucursal) {

                this.agenda.titulo =
                    `${cliente.nombre} - ${sucursal.nombre}`;

                return;

            }


            this.agenda.titulo =
                cliente.nombre;

        },


        // =====================================================
        // VALIDACIONES
        // =====================================================

        validarAgenda() {

            if (!this.agenda.fecha) {

                return "Debe seleccionar una fecha.";

            }


            if (!this.agenda.horaInicio) {

                return "Debe seleccionar la hora de inicio.";

            }


            if (!this.agenda.horaFin) {

                return "Debe seleccionar la hora de finalización.";

            }


            if (
                this.agenda.horaFin
                <=
                this.agenda.horaInicio
            ) {

                return (
                    "La hora de fin debe ser posterior " +
                    "a la hora de inicio."
                );

            }


            if (!this.agenda.clienteId) {

                return "Debe seleccionar un cliente.";

            }


            if (!this.agenda.usuarioId) {

                return "Debe seleccionar un técnico.";

            }


            if (
                !this.agenda.titulo
                ||
                !this.agenda.titulo.trim()
            ) {

                return "Debe ingresar un título.";

            }


            return null;

        },


        // =====================================================
        // GUARDAR
        // =====================================================

        async guardarAgenda() {

            this.mensajeError =
                "";


            this.mensajeConfirmacion =
                "";


            const errorValidacion =
                this.validarAgenda();


            if (errorValidacion) {

                this.mensajeError =
                    errorValidacion;

                return;

            }


            try {

                this.guardando =
                    true;


                const agendaBody = {

                    fecha:
                        this.agenda.fecha,


                    horaInicio:
                        this.normalizarHoraBackend(
                            this.agenda.horaInicio
                        ),


                    horaFin:
                        this.normalizarHoraBackend(
                            this.agenda.horaFin
                        ),


                    clienteId:
                        Number(
                            this.agenda.clienteId
                        ),


                    sucursalId:
                        this.agenda.sucursalId
                            ? Number(
                                this.agenda.sucursalId
                            )
                            : null,


                    usuarioId:
                        Number(
                            this.agenda.usuarioId
                        ),


                    titulo:
                        this.agenda.titulo.trim(),


                    descripcion:
                        this.agenda.descripcion
                            ?.trim()
                        ||
                        null,


                    estado:
                        "AGENDADO",


                    ordenTrabajoId:
                        null

                };


                console.log(
                    "================================"
                );

                console.log(
                    "AGENDA A GUARDAR:"
                );

                console.log(
                    agendaBody
                );

                console.log(
                    "================================"
                );


                const respuesta =
                    await crearAgendaFachada(
                        agendaBody
                    );


                console.log(
                    "AGENDA CREADA:",
                    respuesta
                );


                this.mensajeConfirmacion =
                    "El trabajo fue agendado correctamente.";


                /*
                 * Regresamos al calendario.
                 *
                 * La agenda recién creada aparecerá cuando
                 * CalendarioPage vuelva a consultar /agenda.
                 */

                setTimeout(
                    () => {

                        router.push({
                            path: "/calendario",
                            query: {
                                fecha:
                                    this.agenda.fecha
                            }
                        });

                    },
                    600
                );


            } catch (error) {

                console.error(
                    "Error creando agenda:",
                    error
                );


                console.error(
                    "RESPUESTA BACKEND:",
                    error.response?.data
                );


                const respuestaBackend =
                    error.response?.data;


                if (
                    typeof respuestaBackend
                    ===
                    "string"
                ) {

                    this.mensajeError =
                        respuestaBackend;

                } else if (
                    respuestaBackend?.message
                ) {

                    this.mensajeError =
                        respuestaBackend.message;

                } else {

                    this.mensajeError =
                        "No se pudo guardar la reserva.";

                }


            } finally {

                this.guardando =
                    false;

            }

        },


        // =====================================================
        // VOLVER
        // =====================================================

        volver() {

            router.push(
                "/calendario"
            );

        }

    }

};

</script>


<style scoped>
/* =========================================================
   PÁGINA
   ========================================================= */

.agenda-page {

    min-height: 100vh;

    padding: 32px;

    background:
        #f5f7fb;

}


/* =========================================================
   CARD
   ========================================================= */

.agenda-card {

    max-width: 1100px;

    margin:
        0 auto;

    padding: 30px;

    background:
        #ffffff;

    border:
        1px solid #e2e8f0;

    border-radius: 16px;

    box-shadow:
        0 12px 30px rgba(15,
            23,
            42,
            0.08);

}


/* =========================================================
   HEADER
   ========================================================= */

.agenda-header {

    display: flex;

    justify-content:
        space-between;

    align-items:
        flex-start;

    gap: 20px;

    margin-bottom: 30px;

}


.agenda-eyebrow {

    display: block;

    margin-bottom: 5px;

    color: #2563eb;

    font-size: 0.72rem;

    font-weight: 800;

    letter-spacing: 0.12em;

}


.agenda-header h1 {

    margin: 0;

    color: #172033;

    font-size: 2rem;

    font-weight: 800;

}


.agenda-header p {

    margin:
        7px 0 0;

    color: #64748b;

}


/* =========================================================
   MENSAJES
   ========================================================= */

.alert-message {

    display: flex;

    align-items: center;

    gap: 10px;

    margin-bottom: 20px;

    padding:
        13px 15px;

    border-radius: 8px;

    font-size: 0.88rem;

    font-weight: 600;

}


.alert-error {

    color: #991b1b;

    background: #fef2f2;

    border:
        1px solid #fecaca;

}


.alert-success {

    color: #166534;

    background: #f0fdf4;

    border:
        1px solid #bbf7d0;

}


/* =========================================================
   FORMULARIO
   ========================================================= */

.agenda-form {

    display: grid;

    grid-template-columns:
        repeat(3,
            minmax(0,
                1fr));

    gap: 20px;

}


.form-field {

    min-width: 0;

}


.form-field-full {

    grid-column:
        1 / -1;

}


.form-field label {

    display: block;

    margin-bottom: 7px;

    color: #334155;

    font-size: 0.82rem;

    font-weight: 700;

}


/* =========================================================
   INPUTS
   ========================================================= */

.form-control,
.form-select {

    width: 100%;

    min-height: 45px;

    padding:
        10px 12px;

    color: #172033;

    background: #ffffff;

    border:
        1px solid #cbd5e1;

    border-radius: 8px;

    outline: none;

    box-sizing:
        border-box;

    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;

}


.form-control:focus,
.form-select:focus {

    border-color:
        #2563eb;

    box-shadow:
        0 0 0 3px rgba(37,
            99,
            235,
            0.10);

}


.form-select:disabled {

    color: #94a3b8;

    background:
        #f8fafc;

    cursor:
        not-allowed;

}


textarea.form-control {

    min-height: 110px;

    resize: vertical;

}


.form-help {

    display: block;

    margin-top: 6px;

    color: #64748b;

    font-size: 0.75rem;

}


/* =========================================================
   RESUMEN
   ========================================================= */

.reservation-summary {

    display: flex;

    align-items: center;

    gap: 14px;

    padding: 16px;

    background:
        #eff6ff;

    border:
        1px solid #bfdbfe;

    border-radius: 10px;

}


.summary-icon {

    display: flex;

    align-items: center;

    justify-content: center;

    width: 44px;

    height: 44px;

    flex:
        0 0 44px;

    color: #2563eb;

    background:
        #dbeafe;

    border-radius: 10px;

    font-size: 1.1rem;

}


.summary-content {

    min-width: 0;

}


.summary-content strong {

    display: block;

    margin-bottom: 3px;

    color: #1e3a8a;

}


.summary-content span {

    display: block;

    margin-top: 2px;

    color: #475569;

    font-size: 0.82rem;

}


/* =========================================================
   BOTONES
   ========================================================= */

.form-actions {

    display: flex;

    justify-content:
        flex-end;

    gap: 10px;

    padding-top: 10px;

}


.btn-back,
.btn-cancel,
.btn-save {

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    gap: 8px;

    min-height: 42px;

    padding:
        0 18px;

    border-radius: 8px;

    font-weight: 700;

    cursor: pointer;

    transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;

}


.btn-back,
.btn-cancel {

    color: #475569;

    background:
        #ffffff;

    border:
        1px solid #cbd5e1;

}


.btn-back:hover,
.btn-cancel:hover {

    background:
        #f8fafc;

}


.btn-save {

    color:
        #ffffff;

    background:
        #2563eb;

    border:
        1px solid #2563eb;

}


.btn-save:hover {

    background:
        #1d4ed8;

    border-color:
        #1d4ed8;

}


button:disabled {

    opacity: 0.6;

    cursor:
        not-allowed;

}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 800px) {

    .agenda-page {

        padding: 15px;

    }


    .agenda-card {

        padding: 20px;

    }


    .agenda-header {

        flex-direction:
            column;

    }


    .agenda-form {

        grid-template-columns:
            1fr;

    }


    .form-field-full {

        grid-column:
            auto;

    }


    .form-actions {

        flex-direction:
            column-reverse;

    }


    .btn-back,
    .btn-cancel,
    .btn-save {

        width: 100%;

    }

}
</style>