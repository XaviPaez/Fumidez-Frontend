<template>

  <div class="calendar-page">

    <!-- ===================================================== -->

    <!-- ENCABEZADO -->

    <!-- ===================================================== -->

    <!-- ===================================================== -->

    <!-- ENCABEZADO -->

    <!-- ===================================================== -->

    <div class="calendar-header-card">

      <div class="page-header-info">

        <span class="section-eyebrow">

          OPERACIÓN

        </span>

        <h1 class="calendar-title">

          Calendario de Servicios

        </h1>

        <p class="calendar-subtitle">

          Visualiza y gestiona las órdenes programadas

        </p>

      </div>

      <button type="button" class="refresh-button" :disabled="loading" @click="loadEvents">

        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>

        {{ loading ? "Actualizando..." : "Actualizar" }}

      </button>

    </div>

    <!-- ===================================================== -->

    <!-- INDICADORES -->

    <!-- ===================================================== -->

    <div class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon summary-blue">

          <i class="fas fa-calendar-check"></i>

        </div>

        <div>

          <span class="summary-label">

            Servicios

          </span>

          <strong class="summary-value">

            {{ events.length }}

          </strong>

        </div>

      </div>



      <div class="summary-card">

        <div class="summary-icon summary-orange">

          <i class="fas fa-clock"></i>

        </div>

        <div>

          <span class="summary-label">

            Pendientes

          </span>

          <strong class="summary-value">

            {{ totalPendientes }}

          </strong>

        </div>

      </div>



      <div class="summary-card">

        <div class="summary-icon summary-green">

          <i class="fas fa-check-circle"></i>

        </div>

        <div>

          <span class="summary-label">

            Finalizados

          </span>

          <strong class="summary-value">

            {{ totalFinalizados }}

          </strong>

        </div>

      </div>



      <div class="summary-card">

        <div class="summary-icon summary-purple">

          <i class="fas fa-calendar-day"></i>

        </div>

        <div>

          <span class="summary-label">

            Hoy

          </span>

          <strong class="summary-value">

            {{ totalHoy }}

          </strong>

        </div>

      </div>

    </div>



    <!-- ===================================================== -->

    <!-- FILTROS -->

    <!-- ===================================================== -->

    <div class="filters-card">

      <div class="search-wrapper">

        <i class="fas fa-search search-icon"></i>

        <input v-model.trim="search" type="text" class="search-input"
          placeholder="Buscar por cliente, orden, técnico o descripción..." />

        <button v-if="search" type="button" class="clear-search" title="Limpiar búsqueda" @click="search = ''">

          <i class="fas fa-times"></i>

        </button>

      </div>



      <div class="status-filters">

        <button v-for="filtro in filtrosEstado" :key="filtro.value" type="button" class="status-filter"
          :class="{ active: estadoFiltro === filtro.value }" @click="estadoFiltro = filtro.value">

          <span v-if="filtro.value !== 'TODOS'" class="filter-dot" :class="getStatusClass(filtro.value)"></span>

          {{ filtro.label }}

        </button>

      </div>

    </div>



    <!-- ===================================================== -->

    <!-- LEYENDA -->

    <!-- ===================================================== -->

    <div class="calendar-legend">

      <div class="legend-title">

        Estados:

      </div>

      <div class="legend-item">

        <span class="legend-dot pending"></span>

        Pendiente

      </div>

      <div class="legend-item">

        <span class="legend-dot progress"></span>

        En proceso

      </div>

      <div class="legend-item">

        <span class="legend-dot completed"></span>

        Finalizada

      </div>

      <div class="legend-item">

        <span class="legend-dot cancelled"></span>

        Cancelada

      </div>

    </div>



    <!-- ===================================================== -->

    <!-- MENSAJE ERROR -->

    <!-- ===================================================== -->

    <div v-if="errorMessage" class="calendar-alert">

      <i class="fas fa-exclamation-circle"></i>

      <span>

        {{ errorMessage }}

      </span>

    </div>



    <!-- ===================================================== -->

    <!-- CALENDARIO -->

    <!-- ===================================================== -->

    <div class="calendar-card">

      <div v-if="loading" class="calendar-loading">

        <div class="spinner-border text-primary"></div>

        <span>

          Cargando calendario...

        </span>

      </div>

      <div v-else class="fumidez-calendar">
        <div class="calendar-toolbar">
          <button type="button" class="calendar-nav-button" @click="cambiarSemana(-1)" title="Semana anterior">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="calendar-current-month">
            {{ tituloSemanaActual }}
          </div>

          <div class="calendar-toolbar-actions">
            <button type="button" class="calendar-today-button" @click="irHoy">
              Hoy
            </button>

            <button type="button" class="calendar-nav-button" @click="cambiarSemana(1)" title="Semana siguiente">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- =================================================== -->
        <!-- VISTA SEMANAL POR HORAS -->
        <!-- =================================================== -->
        <div class="time-calendar">

          <!-- CABECERA -->
          <div class="time-calendar-header">
            <div class="time-calendar-corner"></div>

            <div v-for="dia in diasSemanaActual" :key="`header-${dia.key}`" class="time-calendar-day-header"
              :class="{ 'is-today': dia.esHoy }">
              <span class="time-calendar-day-name">{{ dia.nombre }}</span>
              <span class="time-calendar-day-number">{{ dia.numero }}</span>
            </div>
          </div>

          <!-- CUERPO -->
          <div class="time-calendar-body" :style="{ height: `${alturaCalendario}px` }">
            <!-- COLUMNA DE HORAS -->
            <div class="time-calendar-hours">
              <div v-for="hora in horasCalendario" :key="`hora-${hora}`" class="time-calendar-hour-label"
                :style="{ top: `${posicionHora(hora)}px` }">
                {{ formatearHoraEje(hora) }}
              </div>
            </div>

            <!-- COLUMNAS DE LOS DÍAS -->
            <div v-for="dia in diasSemanaActual" :key="`day-${dia.key}`" class="time-calendar-day-column"
              :class="{ 'is-today': dia.esHoy }">
              <!-- LÍNEAS VISUALES -->
              <div v-for="slot in slotsCalendario" :key="`line-${dia.key}-${slot}`" class="time-calendar-slot-line"
                :class="{ 'is-hour': slot % 60 === 0 }" :style="{ top: `${posicionMinutos(slot)}px` }"></div>

              <!-- CELDAS CLICKEABLES DE 30 MINUTOS -->
              <div v-for="slot in slotsCalendario.slice(0, -1)" :key="`click-${dia.key}-${slot}`"
                class="time-calendar-click-slot" :style="{
                  top: `${posicionMinutos(slot)}px`,
                  height: `${(minutosPorSlot / 60) * pixelesPorHora}px`
                }" :title="`Agendar ${formatearMinutosSlot(slot)}`"
                @click="crearReservaDesdeCalendario(dia.fecha, slot)"></div>

              <!-- EVENTOS -->
              <div v-for="event in eventosPosicionadosDelDia(dia.fecha)"
                :key="`${event.tipoEvento || 'evento'}-${event.id}`" class="time-calendar-event"
                :class="getEventClass(event)" :style="estiloEventoSemanal(event)"
                @click.stop="handleEventClick({ event })">
                <div class="time-calendar-event__top">

                  <span class="time-calendar-event__title">

                    <template v-if="event.isAgenda">

                      <i class="far fa-calendar-alt"></i>

                      Reservado

                    </template>

                    <template v-else>

                      Orden {{ event.numeroOrden }}

                    </template>

                  </span>

                  <span class="event-status-dot" :class="getStatusClass(event.estado)"></span>

                </div>


                <div class="time-calendar-event__client">

                  {{
                    event.isOrdenTrabajo
                      ? event.cliente
                  : event.title
                  }}

                </div>


                <div class="time-calendar-event__time">

                  <i class="far fa-clock"></i>

                  {{ formatTime(event.start) }}
                  -
                  {{ formatTime(event.end) }}

                </div>

              </div>
            </div>
          </div>

          <!-- indicador de hora actual -->
          <div v-if="mostrarLineaHoraActual" class="time-calendar-now-line" :style="{ top: `${posicionHoraActual}px` }">
            <span></span>
          </div>
        </div>

      </div>
    </div>



    <!-- ===================================================== -->

    <!-- MODAL DETALLE -->

    <!-- ===================================================== -->

    <!-- ========================================================= -->
    <!-- MODAL DETALLE EVENTO -->
    <!-- ========================================================= -->

    <div v-if="showModal && selectedEvent" class="event-modal-backdrop" @click.self="closeModal">

      <div class="event-modal">

        <!-- ===================================================== -->
        <!-- HEADER -->
        <!-- ===================================================== -->

        <div class="event-modal-header">

          <div>

            <span class="event-status-badge" :class="{
              'is-agenda': selectedEvent.isAgenda,
              'is-order': selectedEvent.isOrdenTrabajo
            }">
              {{
                selectedEvent.isAgenda
                  ? "AGENDADO"
                  : selectedEvent.estado || "ORDEN"
              }}
            </span>


            <h2>
              {{
                selectedEvent.titulo ||
                selectedEvent.title ||
                (
                  selectedEvent.isOrdenTrabajo
                    ? `Orden ${selectedEvent.numeroOrden || ""}`
                    : "Trabajo programado"
                )
              }}
            </h2>


            <p>
              {{
                selectedEvent.isAgenda
                  ? "Información de la reserva programada"
                  : "Información de la orden de trabajo"
              }}
            </p>

          </div>


          <button type="button" class="event-modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>

        </div>


        <!-- ===================================================== -->
        <!-- BODY -->
        <!-- ===================================================== -->

        <div class="event-modal-body">

          <div class="event-info-grid">


            <!-- ================================================= -->
            <!-- FECHA -->
            <!-- ================================================= -->

            <div class="event-info-card">

              <div class="event-info-icon">
                <i class="far fa-calendar"></i>
              </div>

              <div>

                <span class="event-info-label">
                  FECHA
                </span>

                <strong>
                  {{
                    formatearFechaModal(
                      selectedEvent.fecha
                    )
                  }}
                </strong>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- HORARIO -->
            <!-- ================================================= -->

            <div class="event-info-card">

              <div class="event-info-icon">
                <i class="far fa-clock"></i>
              </div>

              <div>

                <span class="event-info-label">
                  HORARIO
                </span>

                <strong>
                  {{
                    obtenerHorarioEvento(
                      selectedEvent
                    )
                  }}
                </strong>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- DURACIÓN -->
            <!-- ================================================= -->

            <div class="event-info-card">

              <div class="event-info-icon">
                <i class="fas fa-hourglass-half"></i>
              </div>

              <div>

                <span class="event-info-label">
                  DURACIÓN
                </span>

                <strong>
                  {{
                    obtenerDuracionEvento(
                      selectedEvent
                    )
                  }}
                </strong>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- CLIENTE -->
            <!-- ================================================= -->

            <div v-if="
              obtenerNombreCliente(
                selectedEvent
              )
            " class="event-info-card">

              <div class="event-info-icon">
                <i class="fas fa-building"></i>
              </div>

              <div>

                <span class="event-info-label">
                  CLIENTE
                </span>

                <strong>
                  {{
                    obtenerNombreCliente(
                      selectedEvent
                    )
                  }}
                </strong>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- SUCURSAL -->
            <!-- ================================================= -->

            <div v-if="
              selectedEvent.isAgenda &&
              obtenerNombreSucursal(
                selectedEvent
              )
            " class="event-info-card">

              <div class="event-info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>

              <div>

                <span class="event-info-label">
                  SUCURSAL
                </span>

                <strong>
                  {{
                    obtenerNombreSucursal(
                      selectedEvent
                    )
                  }}
                </strong>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- PERSONA ENCARGADA -->
            <!-- SOLO SI EXISTE -->
            <!-- ================================================= -->

            <div v-if="
              obtenerPersonaEncargada(
                selectedEvent
              )
            " class="event-info-card">

              <div class="event-info-icon">
                <i class="fas fa-user"></i>
              </div>

              <div>

                <span class="event-info-label">
                  PERSONA ENCARGADA
                </span>

                <strong>
                  {{
                    obtenerPersonaEncargada(
                      selectedEvent
                    )
                  }}
                </strong>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- TÉCNICO -->
            <!-- ================================================= -->

            <div v-if="
              obtenerNombreTecnico(
                selectedEvent
              )
            " class="event-info-card">

              <div class="event-info-icon">
                <i class="fas fa-user-cog"></i>
              </div>

              <div>

                <span class="event-info-label">
                  TÉCNICO ASIGNADO
                </span>

                <strong>
                  {{
                    obtenerNombreTecnico(
                      selectedEvent
                    )
                  }}
                </strong>

              </div>

            </div>

          </div>


          <!-- =================================================== -->
          <!-- DESCRIPCIÓN -->
          <!-- =================================================== -->

          <div v-if="
            selectedEvent.descripcion
          " class="event-description-card">

            <div class="event-description-title">

              <i class="fas fa-align-left"></i>

              <strong>
                Descripción del servicio
              </strong>

            </div>


            <p>
              {{
                selectedEvent.descripcion
              }}
            </p>

          </div>

        </div>


        <!-- ===================================================== -->
        <!-- FOOTER -->
        <!-- ===================================================== -->

        <div class="event-modal-footer">

          <button type="button" class="btn-secondary-calendar" @click="closeModal">
            Cerrar
          </button>


          <!-- =================================================== -->
          <!-- AGENDA TODAVÍA SIN ORDEN -->
          <!-- =================================================== -->

          <button v-if="
            selectedEvent.isAgenda &&
            !selectedEvent.ordenTrabajoId
          " type="button" class="btn-primary-calendar" @click="
            crearOrdenDesdeAgenda(
              selectedEvent
            )
            ">
            <i class="fas fa-file-circle-plus"></i>

            Crear orden de trabajo
          </button>


          <!-- =================================================== -->
          <!-- AGENDA YA CONVERTIDA EN ORDEN -->
          <!-- =================================================== -->

          <button v-if="
            selectedEvent.isAgenda &&
            selectedEvent.ordenTrabajoId
          " type="button" class="btn-primary-calendar" @click="
            verOrden(
              selectedEvent.ordenTrabajoId
            )
            ">
            <i class="fas fa-external-link-alt"></i>

            Ver orden de trabajo
          </button>


          <!-- =================================================== -->
          <!-- ORDEN NORMAL -->
          <!-- =================================================== -->

          <button v-if="
            selectedEvent.isOrdenTrabajo
          " type="button" class="btn-primary-calendar" @click="
            verOrden(
              selectedEvent.id
            )
            ">
            <i class="fas fa-external-link-alt"></i>

            Ver orden completa
          </button>

        </div>

      </div>

    </div>
  </div>

</template>



<script>

import { consultarOrdenFachada } from "../../OrdenTrabajo/helpers/OrdenTrabajoHelper";

import router from "@/router";

import {

  consultarAgendaFachada

} from "../helper/AgendaHelper";

export default {
  data() {

    return {

      currentDate: new Date(),

      // Jornada visible del calendario semanal.
      horaInicioCalendario: 7,
      horaFinCalendario: 20,
      minutosPorSlot: 30,
      pixelesPorHora: 80,

      events: [],

      selectedEvent: null,

      loading: false,

      errorMessage: "",
      showModal: false,

      search: "",

      estadoFiltro: "TODOS",

      filtrosEstado: [

        {

          value: "TODOS",

          label: "Todos"

        },

        {

          value: "PENDIENTE",

          label: "Pendientes"

        },

        {

          value: "EN PROCESO",

          label: "En proceso"

        },

        {

          value: "FINALIZADA",

          label: "Finalizadas"

        },

        {

          value: "CANCELADA",

          label: "Canceladas"

        }

      ],

    };

  },



  computed: {

    tituloSemanaActual() {
      if (!this.diasSemanaActual.length) {
        return "";
      }

      const inicio = this.diasSemanaActual[0].fecha;
      const fin = this.diasSemanaActual[6].fecha;

      const formatoDiaMes = new Intl.DateTimeFormat(
        "es-EC",
        {
          day: "2-digit",
          month: "short"
        }
      );

      const formatoAnio = new Intl.DateTimeFormat(
        "es-EC",
        {
          year: "numeric"
        }
      );

      const mismoAnio =
        inicio.getFullYear() === fin.getFullYear();

      if (mismoAnio) {
        return `${formatoDiaMes.format(inicio)} - ${formatoDiaMes.format(fin)} ${formatoAnio.format(fin)}`;
      }

      return `${formatoDiaMes.format(inicio)} ${formatoAnio.format(inicio)} - ${formatoDiaMes.format(fin)} ${formatoAnio.format(fin)}`;
    },

    diasSemanaActual() {
      const base = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate()
      );

      // Domingo como primer día de la semana.
      const inicio = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate() - base.getDay()
      );

      const hoy = new Date();

      const nombres = [
        "Dom",
        "Lun",
        "Mar",
        "Mié",
        "Jue",
        "Vie",
        "Sáb"
      ];

      const dias = [];

      for (let i = 0; i < 7; i++) {
        const fecha = new Date(
          inicio.getFullYear(),
          inicio.getMonth(),
          inicio.getDate() + i
        );

        dias.push({
          key: this.fechaLocalKey(fecha),
          fecha,
          nombre: nombres[i],
          numero: fecha.getDate(),
          esHoy:
            fecha.getFullYear() === hoy.getFullYear()
            &&
            fecha.getMonth() === hoy.getMonth()
            &&
            fecha.getDate() === hoy.getDate()
        });
      }

      return dias;
    },

    horasCalendario() {
      const horas = [];

      for (
        let hora = this.horaInicioCalendario;
        hora <= this.horaFinCalendario;
        hora++
      ) {
        horas.push(hora);
      }

      return horas;
    },

    slotsCalendario() {
      const slots = [];
      const inicio = this.horaInicioCalendario * 60;
      const fin = this.horaFinCalendario * 60;

      for (
        let minuto = inicio;
        minuto <= fin;
        minuto += this.minutosPorSlot
      ) {
        slots.push(minuto);
      }

      return slots;
    },

    alturaCalendario() {
      return (
        (this.horaFinCalendario - this.horaInicioCalendario)
        * this.pixelesPorHora
      );
    },

    mostrarLineaHoraActual() {
      const ahora = new Date();
      const inicio = this.horaInicioCalendario * 60;
      const fin = this.horaFinCalendario * 60;
      const minutos = ahora.getHours() * 60 + ahora.getMinutes();

      const hoyVisible =
        this.diasSemanaActual.some(
          dia => dia.esHoy
        );

      return (
        hoyVisible
        &&
        minutos >= inicio
        &&
        minutos <= fin
      );
    },

    posicionHoraActual() {
      const ahora = new Date();

      return this.posicionMinutos(
        ahora.getHours() * 60 + ahora.getMinutes()
      );
    },

    filteredEvents() {

      const texto =

        this.normalizarTexto(

          this.search

        );



      return this.events.filter(

        (event) => {

          // ============================

          // FILTRO ESTADO

          // ============================

          let cumpleEstado = true;



          if (

            this.estadoFiltro !== "TODOS"

          ) {

            const estadoEvento =

              this.normalizarTexto(

                event.estado

              );



            const estadoSeleccionado =

              this.normalizarTexto(

                this.estadoFiltro

              );



            if (

              estadoSeleccionado === "finalizada"

            ) {

              cumpleEstado =

                estadoEvento.includes(

                  "final"

                );

            } else if (

              estadoSeleccionado === "en proceso"

            ) {

              cumpleEstado =

                estadoEvento.includes(

                  "proceso"

                );

            } else if (

              estadoSeleccionado === "cancelada"

            ) {

              cumpleEstado =

                estadoEvento.includes(

                  "cancel"

                );

            } else {

              cumpleEstado =

                estadoEvento.includes(

                  "pend"

                );

            }

          }



          // ============================

          // FILTRO TEXTO

          // ============================

          if (!texto) {

            return cumpleEstado;

          }



          const contenido =

            this.normalizarTexto(

              [

                event.numeroOrden,

                event.cliente,

                event.persona,

                event.usuario,

                event.descripcion,

                event.estado

              ]

                .filter(Boolean)

                .join(" ")

            );



          return (

            cumpleEstado

            &&

            contenido.includes(texto)

          );

        }

      );

    },



    totalPendientes() {

      return this.events.filter(

        event =>

          this.normalizarTexto(

            event.estado

          )

            .includes("pend")

      ).length;

    },



    totalFinalizados() {

      return this.events.filter(

        event =>

          this.normalizarTexto(

            event.estado

          )

            .includes("final")

      ).length;

    },



    totalHoy() {

      const hoy =

        new Date();



      return this.events.filter(

        event => {

          const fecha =

            new Date(

              event.start

            );



          return (

            fecha.getFullYear() ===

            hoy.getFullYear()

            &&

            fecha.getMonth() ===

            hoy.getMonth()

            &&

            fecha.getDate() ===

            hoy.getDate()

          );

        }

      ).length;

    },

  },



  mounted() {

    this.loadEvents();

  },



  methods: {
    // =====================================================
// CREAR DATE LOCAL SIN PROBLEMAS DE UTC
// =====================================================

crearFechaLocal(fecha, hora = "00:00") {

  if (!fecha) {
    return null;
  }


  const fechaTexto =
    String(fecha)
      .substring(0, 10);


  const horaTexto =
    String(
      hora || "00:00"
    )
      .substring(0, 5);


  const partesFecha =
    fechaTexto
      .split("-")
      .map(Number);


  const partesHora =
    horaTexto
      .split(":")
      .map(Number);


  if (
    partesFecha.length !== 3 ||
    partesHora.length !== 2 ||
    partesFecha.some(Number.isNaN) ||
    partesHora.some(Number.isNaN)
  ) {

    console.error(
      "Fecha/hora inválida:",
      fecha,
      hora
    );

    return null;
  }


  return new Date(
    partesFecha[0],
    partesFecha[1] - 1,
    partesFecha[2],
    partesHora[0],
    partesHora[1],
    0,
    0
  );

},
    // =========================================================
    // FECHA DEL MODAL
    // =========================================================

    formatearFechaModal(fecha) {

  if (!fecha) {
    return "Sin fecha";
  }

  const fechaTexto =
    String(fecha)
      .substring(0, 10);

  const partes =
    fechaTexto
      .split("-")
      .map(Number);


  if (
    partes.length !== 3 ||
    partes.some(Number.isNaN)
  ) {
    return "Sin fecha";
  }


  const fechaLocal =
    new Date(
      partes[0],
      partes[1] - 1,
      partes[2]
    );


  const resultado =
    new Intl.DateTimeFormat(
      "es-EC",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    ).format(fechaLocal);


  return (
    resultado.charAt(0).toUpperCase()
    +
    resultado.slice(1)
  );

},  

    // =========================================================
    // HORARIO
    // =========================================================

   obtenerHorarioEvento(evento) {

  if (!evento) {
    return "Sin horario";
  }


  const inicio =
    evento.horaInicio
    ||
    evento.hora
    ||
    evento.ordenOriginal?.hora;


  const fin =
    evento.horaFin
    ||
    evento.ordenOriginal?.horaFin;


  const inicioTexto =
    inicio
      ? String(inicio).substring(0, 5)
      : "";


  const finTexto =
    fin
      ? String(fin).substring(0, 5)
      : "";


  if (
    inicioTexto &&
    finTexto
  ) {

    return `${inicioTexto} - ${finTexto}`;

  }


  if (inicioTexto) {

    return inicioTexto;

  }


  return "Sin horario";

},
    // =========================================================
    // DURACIÓN
    // =========================================================

 obtenerDuracionEvento(evento) {

  if (!evento) {
    return "Sin duración";
  }


  const inicio =
    evento.horaInicio
    ||
    evento.hora
    ||
    evento.ordenOriginal?.hora;


  const fin =
    evento.horaFin
    ||
    evento.ordenOriginal?.horaFin;


  if (!inicio || !fin) {

    return (
      evento.workHour
      ||
      "Sin duración"
    );

  }


  const convertirAMinutos = hora => {

    const valor =
      String(hora)
        .substring(0, 5)
        .split(":");


    if (valor.length !== 2) {
      return null;
    }


    const horas =
      Number(valor[0]);

    const minutos =
      Number(valor[1]);


    if (
      Number.isNaN(horas) ||
      Number.isNaN(minutos)
    ) {

      return null;

    }


    return (
      horas * 60
      +
      minutos
    );

  };


  const inicioMin =
    convertirAMinutos(inicio);

  const finMin =
    convertirAMinutos(fin);


  if (
    inicioMin === null ||
    finMin === null ||
    finMin <= inicioMin
  ) {

    return "Sin duración";

  }


  const total =
    finMin - inicioMin;


  const horas =
    Math.floor(total / 60);

  const minutos =
    total % 60;


  if (horas && minutos) {

    return `${horas} h ${minutos} min`;

  }


  if (horas) {

    return horas === 1
      ? "1 hora"
      : `${horas} horas`;

  }


  return `${minutos} min`;

},

    // =========================================================
    // CLIENTE
    // =========================================================

    obtenerNombreCliente(evento) {

      if (!evento) {
        return "";
      }


      /*
       * Orden de trabajo.
       */

      if (
        evento.cliente &&
        typeof evento.cliente === "string"
      ) {

        return evento.cliente;

      }


      if (
        evento.cliente?.nombre
      ) {

        return evento.cliente.nombre;

      }


      /*
       * Agenda.
       *
       * Como la agenda almacena clienteId,
       * buscamos el cliente cargado en el calendario.
       */

      if (
        evento.clienteId &&
        Array.isArray(
          this.clientes
        )
      ) {

        const cliente =
          this.clientes.find(
            item =>
              Number(item.id)
              ===
              Number(evento.clienteId)
          );


        if (cliente) {

          return cliente.nombre || "";

        }

      }


      return "";

    },


    // =========================================================
    // SUCURSAL
    // =========================================================

    obtenerNombreSucursal(evento) {

      if (!evento) {
        return "";
      }


      if (
        evento.sucursal &&
        typeof evento.sucursal === "string"
      ) {

        return evento.sucursal;

      }


      if (
        evento.sucursal?.nombre
      ) {

        return evento.sucursal.nombre;

      }


      /*
       * Si al construir el evento guardamos
       * sucursalNombre, también lo soportamos.
       */

      if (
        evento.sucursalNombre
      ) {

        return evento.sucursalNombre;

      }


      /*
       * Como último recurso usamos el título.
       * No inventamos el nombre si no está disponible.
       */

      return "";

    },


    // =========================================================
    // PERSONA ENCARGADA
    // =========================================================

    obtenerPersonaEncargada(evento) {

      if (!evento) {
        return "";
      }


      if (evento.persona) {

        return evento.persona;

      }


      if (
        evento.personaEncargada
      ) {

        return evento.personaEncargada;

      }


      if (
        evento.clienteId &&
        Array.isArray(
          this.clientes
        )
      ) {

        const cliente =
          this.clientes.find(
            item =>
              Number(item.id)
              ===
              Number(evento.clienteId)
          );


        return (
          cliente?.personaEncargada
          ||
          ""
        );

      }


      return "";

    },


    // =========================================================
    // TÉCNICO
    // =========================================================

    obtenerNombreTecnico(evento) {

      if (!evento) {
        return "";
      }


      if (evento.usuario) {

        if (
          typeof evento.usuario
          === "string"
        ) {

          return evento.usuario;

        }


        if (
          evento.usuario.nombre
        ) {

          return evento.usuario.nombre;

        }

      }


      if (
        evento.usuarioNombre
      ) {

        return evento.usuarioNombre;

      }


      /*
       * Si tenemos los usuarios cargados en
       * CalendarioPage, buscamos por usuarioId.
       */

      if (
        evento.usuarioId &&
        Array.isArray(
          this.usuarios
        )
      ) {

        const usuario =
          this.usuarios.find(
            item =>
              Number(item.id)
              ===
              Number(evento.usuarioId)
          );


        if (usuario) {

          return usuario.nombre || "";

        }

      }


      return "";

    },


    // =========================================================
    // CREAR ORDEN DESDE UNA RESERVA
    // =========================================================

    // =====================================================
    // CREAR ORDEN DESDE UNA RESERVA
    // =====================================================

    crearOrdenDesdeAgenda(evento) {

      if (!evento) {
        console.error(
          "No existe evento para crear la orden."
        );

        return;
      }


      const agendaId =
        evento.agendaId
        ??
        evento.agendaOriginal?.id
        ??
        null;


      console.log(
        "CREAR ORDEN DESDE AGENDA:",
        evento
      );

      console.log(
        "AGENDA ID REAL:",
        agendaId
      );


      if (!agendaId) {

        console.error(
          "No se pudo obtener el ID real de la agenda."
        );

        return;
      }


      const query = {

        agendaId:
          String(agendaId),

        fecha:
          String(
            evento.fecha || ""
          ).substring(0, 10),

        hora:
          String(
            evento.horaInicio
            ||
            evento.hora
            ||
            ""
          ).substring(0, 5),

        horaFin:
          String(
            evento.horaFin
            ||
            ""
          ).substring(0, 5),

        clienteId:
          evento.clienteId != null
            ? String(evento.clienteId)
            : "",

        sucursalId:
          evento.sucursalId != null
            ? String(evento.sucursalId)
            : "",

        usuarioId:
          evento.usuarioId != null
            ? String(evento.usuarioId)
            : "",

        descripcion:
          evento.descripcion
          ||
          ""

      };


      console.log(
        "QUERY PARA REGISTRAR ORDEN:",
        query
      );


      this.closeModal();


      this.$router.push({

        path:
          "/orden_trabajo_registro",

        query

      })
        .catch(error => {

          if (
            error?.name !==
            "NavigationDuplicated"
          ) {

            console.error(
              "Error navegando a RegistrarOrdenTrabajo:",
              error
            );

          }

        });

    },
    crearReservaDesdeCalendario(fecha, minutosAbsolutos) {

      if (!fecha) {
        return;
      }

      const horas =
        Math.floor(minutosAbsolutos / 60);

      const minutos =
        minutosAbsolutos % 60;

      const horaInicio =
        `${String(horas).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")}`;

      // Por defecto reservamos una hora.
      const fechaFin =
        new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate(),
          horas,
          minutos + 60
        );

      const horaFin =
        `${String(fechaFin.getHours()).padStart(2, "0")}:` +
        `${String(fechaFin.getMinutes()).padStart(2, "0")}`;

      const fechaReserva =
        this.fechaLocalKey(fecha);

      console.log(
        "CREANDO RESERVA DESDE CALENDARIO:",
        {
          fecha: fechaReserva,
          horaInicio,
          horaFin
        }
      );

      this.$router.push({
        path: "/agenda/registrar",
        query: {
          fecha: fechaReserva,
          horaInicio,
          horaFin
        }
      });

    },
    formatearMinutosSlot(minutosAbsolutos) {
      const horas = Math.floor(minutosAbsolutos / 60);
      const minutos = minutosAbsolutos % 60;

      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
    },

    cambiarSemana(desplazamiento) {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate() + (desplazamiento * 7)
      );
    },

    irHoy() {
      this.currentDate = new Date();
    },

    posicionMinutos(minutosAbsolutos) {
      const inicio = this.horaInicioCalendario * 60;

      return (
        (minutosAbsolutos - inicio)
        / 60
        * this.pixelesPorHora
      );
    },

    posicionHora(hora) {
      return this.posicionMinutos(
        hora * 60
      );
    },

    formatearHoraEje(hora) {
      return `${String(hora).padStart(2, "0")}:00`;
    },

    minutosDesdeMedianoche(fecha) {
      const date =
        fecha instanceof Date
          ? fecha
          : new Date(fecha);

      return (
        date.getHours() * 60
        + date.getMinutes()
      );
    },

    eventosPosicionadosDelDia(fecha) {
      const eventos =
        this.eventosParaFecha(fecha)
          .filter(event => event?.start && event?.end)
          .map(event => ({
            ...event,
            _inicioMinutos:
              this.minutosDesdeMedianoche(event.start),
            _finMinutos:
              this.minutosDesdeMedianoche(event.end)
          }))
          .filter(event => (
            event._finMinutos > this.horaInicioCalendario * 60
            &&
            event._inicioMinutos < this.horaFinCalendario * 60
          ))
         .sort((a, b) => {

  const inicioA =
    a.start instanceof Date
      ? a.start.getTime()
      : new Date(a.start).getTime();


  const inicioB =
    b.start instanceof Date
      ? b.start.getTime()
      : new Date(b.start).getTime();


  return (
    (Number.isNaN(inicioA) ? 0 : inicioA)
    -
    (Number.isNaN(inicioB) ? 0 : inicioB)
  );

});

      /*
       * Asignación de columnas para eventos solapados.
       * Si dos trabajos ocupan la misma franja, quedan lado a lado.
       */
      const grupos = [];
      let grupoActual = [];
      let finGrupo = -1;

      for (const event of eventos) {
        if (
          grupoActual.length === 0
          ||
          event._inicioMinutos < finGrupo
        ) {
          grupoActual.push(event);
          finGrupo = Math.max(
            finGrupo,
            event._finMinutos
          );
        } else {
          grupos.push(grupoActual);
          grupoActual = [event];
          finGrupo = event._finMinutos;
        }
      }

      if (grupoActual.length) {
        grupos.push(grupoActual);
      }

      const resultado = [];

      for (const grupo of grupos) {
        const columnasFin = [];

        for (const event of grupo) {
          let columna = columnasFin.findIndex(
            fin => fin <= event._inicioMinutos
          );

          if (columna === -1) {
            columna = columnasFin.length;
            columnasFin.push(event._finMinutos);
          } else {
            columnasFin[columna] = event._finMinutos;
          }

          event._columna = columna;
        }

        const cantidadColumnas =
          Math.max(columnasFin.length, 1);

        for (const event of grupo) {
          event._cantidadColumnas =
            cantidadColumnas;

          resultado.push(event);
        }
      }

      return resultado;
    },

    estiloEventoSemanal(event) {
      const inicioVisible =
        Math.max(
          event._inicioMinutos,
          this.horaInicioCalendario * 60
        );

      const finVisible =
        Math.min(
          event._finMinutos,
          this.horaFinCalendario * 60
        );

      const top =
        this.posicionMinutos(inicioVisible);

      const height =
        Math.max(
          ((finVisible - inicioVisible) / 60)
          * this.pixelesPorHora,
          28
        );

      const columnas =
        event._cantidadColumnas || 1;

      const columna =
        event._columna || 0;

      const ancho =
        100 / columnas;

      return {
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${ancho * columna}% + 2px)`,
        width: `calc(${ancho}% - 4px)`
      };
    },

    fechaLocalKey(fecha) {
      if (!fecha) return "";
      const date = fecha instanceof Date ? fecha : new Date(fecha);
      if (Number.isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    eventosParaFecha(fecha) {
      const key = this.fechaLocalKey(fecha);
      return this.filteredEvents
        .filter(event => event?.start && this.fechaLocalKey(event.start) === key)
        .sort((a, b) => a.start.getTime() - b.start.getTime());
    },


    getSimultaneousEventStyle(event) {

      const simultaneos =

        this.eventosDelMismoHorario(event);

      const cantidad =

        simultaneos.length;

      if (cantidad <= 1) {

        return {

          width: "100%"

        };

      }

      const indice =

        simultaneos.findIndex(

          item => item.id === event.id

        );

      const gap = 4;

      const ancho =

        `calc(${100 / cantidad}% - ${gap}px)`;

      return {

        width: ancho,

        flex: `0 0 ${ancho}`,

        minWidth: "0",

        order: indice

      };

    },

    obtenerFechaDiaCalendario(day) {

      if (!day) {

        return null;

      }



      /*
    
       * Dependiendo de la versión de Vuetify,
    
       * day puede traer date como Date.
    
       */

      if (day.date instanceof Date) {

        return day.date;

      }



      /*
    
       * También puede venir como string YYYY-MM-DD.
    
       */

      if (typeof day.date === "string") {

        const [

          year,

          month,

          date

        ] = day.date

          .substring(0, 10)

          .split("-")

          .map(Number);



        return new Date(

          year,

          month - 1,

          date

        );

      }



      /*
    
       * Algunas versiones entregan year/month/day.
    
       */

      if (

        day.year &&

        day.month &&

        day.day

      ) {

        return new Date(

          day.year,

          day.month - 1,

          day.day

        );

      }



      return null;

    },



    obtenerNumeroDia(day) {

      const fecha =

        this.obtenerFechaDiaCalendario(day);



      if (!fecha) {

        return "";

      }



      return fecha.getDate();

    },



    eventosDelDia(day) {

      const fechaDia =

        this.obtenerFechaDiaCalendario(day);



      if (!fechaDia) {

        return [];

      }



      return this.filteredEvents

        .filter(event => {

          if (!event.start) {

            return false;

          }



          const fechaEvento =

            event.start instanceof Date

              ? event.start

              : new Date(event.start);



          return (

            fechaEvento.getFullYear() ===

            fechaDia.getFullYear()

            &&

            fechaEvento.getMonth() ===

            fechaDia.getMonth()

            &&

            fechaEvento.getDate() ===

            fechaDia.getDate()

          );

        })

        /*
    
         * Ordenar los trabajos del día por hora.
    
         */

        .sort(

          (a, b) =>

            new Date(a.start) -

            new Date(b.start)

        );

    },

    eventosDelMismoHorario(event) {

      if (!event?.start || !event?.end) {

        return [];

      }

      const inicio =

        event.start.getTime();

      const fin =

        event.end.getTime();



      return this.filteredEvents.filter(item => {

        if (

          !item?.start ||

          !item?.end

        ) {

          return false;

        }



        /*

         * Mismo día

         */

        const mismoDia =

          item.start.getFullYear() ===

          event.start.getFullYear()

          &&

          item.start.getMonth() ===

          event.start.getMonth()

          &&

          item.start.getDate() ===

          event.start.getDate();



        if (!mismoDia) {

          return false;

        }



        /*

         * Horarios que se solapan.

         *

         * Ejemplo:

         * A: 09:00 - 11:00

         * B: 09:30 - 10:30

         *

         * también son simultáneos.

         */

        return (

          item.start.getTime() < fin &&

          item.end.getTime() > inicio

        );

      });

    },



    indiceEventoSimultaneo(event) {

      const eventos =

        this.eventosDelMismoHorario(event);



      return eventos.findIndex(

        item =>

          item.id === event.id

      );

    },



    cantidadEventosSimultaneos(event) {

      return Math.max(

        this.eventosDelMismoHorario(event).length,

        1

      );

    },

    convertirAgendaEvento(agenda) {

      // Si la reserva ya fue convertida en una orden, se conserva
      // en la base de datos por trazabilidad, pero no se vuelve a
      // mostrar como un evento independiente en el calendario.
      if (
        agenda &&
        (
          agenda.ordenTrabajoId != null ||
          this.normalizarTexto(agenda.estado) === "orden creada" ||
          this.normalizarTexto(agenda.estado) === "orden_creada"
        )
      ) {
        return null;
      }

      if (

        !agenda ||

        !agenda.fecha ||

        !agenda.horaInicio ||

        !agenda.horaFin

      ) {

        console.warn(

          "Agenda sin fecha u horario:",

          agenda

        );

        return null;

      }



      try {

        // ================================================

        // FECHA SIN CONVERSIÓN UTC

        // ================================================

        const [

          anio,

          mes,

          dia

        ] =

          agenda.fecha

            .substring(0, 10)

            .split("-")

            .map(Number);



        // ================================================

        // HORA INICIO

        // ================================================

        const [

          horaInicio,

          minutoInicio

        ] =

          agenda.horaInicio

            .split(":")

            .map(Number);



        // ================================================

        // HORA FIN

        // ================================================

        const [

          horaFin,

          minutoFin

        ] =

          agenda.horaFin

            .split(":")

            .map(Number);



        const start =

          new Date(

            anio,

            mes - 1,

            dia,

            horaInicio,

            minutoInicio,

            0

          );



        const end =

          new Date(

            anio,

            mes - 1,

            dia,

            horaFin,

            minutoFin,

            0

          );



        // ================================================

        // VALIDACIÓN

        // ================================================

        if (

          Number.isNaN(start.getTime()) ||

          Number.isNaN(end.getTime())

        ) {

          console.error(

            "Fecha inválida en agenda:",

            agenda

          );

          return null;

        }



        return {

          // ID DEL EVENTO

          id: `agenda-${agenda.id}`,

          agendaId: agenda.id,

          name:

            agenda.titulo ||

            "Trabajo agendado",

          title:

            agenda.titulo ||

            "Trabajo agendado",

          start,

          end,

          // ==============================================

          // IDENTIFICAR EL TIPO

          // ==============================================

          tipoEvento: "AGENDA",

          isOrdenTrabajo: false,

          isAgenda: true,



          // ==============================================

          // DATOS PARA CREAR LA ORDEN DESPUÉS

          // ==============================================

          clienteId:

            agenda.clienteId,

          sucursalId:

            agenda.sucursalId,

          usuarioId:

            agenda.usuarioId,

          fecha:

            agenda.fecha,

          horaInicio:

            agenda.horaInicio,

          horaFin:

            agenda.horaFin,

          descripcion:

            agenda.descripcion,

          estado:

            agenda.estado,

          ordenTrabajoId:

            agenda.ordenTrabajoId,

          agendaOriginal:

            agenda

        };



      } catch (error) {

        console.error(

          "Error convirtiendo agenda a evento:",

          agenda,

          error

        );

        return null;

      }

    },

    // =====================================================

    // CARGAR ÓRDENES

    // =====================================================

    // =====================================================

    // CARGAR ÓRDENES + AGENDA

    // =====================================================

    async loadEvents() {

      this.loading = true;

      this.errorMessage = "";

      try {

        // Traemos simultáneamente:

        // 1. Órdenes de trabajo

        // 2. Trabajos reservados en agenda

        const [

          dataOrdenes,

          dataAgenda

        ] = await Promise.all([

          consultarOrdenFachada(),

          consultarAgendaFachada()

        ]);



        console.log(

          "ÓRDENES RECIBIDAS:",

          dataOrdenes

        );

        console.log(

          "AGENDA RECIBIDA:",

          dataAgenda

        );



        // =================================================

        // VALIDAR RESPUESTAS

        // =================================================

        const ordenes =

          Array.isArray(dataOrdenes)

            ? dataOrdenes

            : [];



        const agenda =

          Array.isArray(dataAgenda)

            ? dataAgenda

            : [];



        // =================================================

        // CONVERTIR ÓRDENES

        // =================================================

        const eventosOrdenes =

          ordenes

            .map(

              orden =>

                this.convertirOrdenEvento(

                  orden

                )

            )

            .filter(Boolean);



        // =================================================

        // CONVERTIR RESERVAS

        // =================================================

        const eventosAgenda =

          agenda

            // No mostramos reservas canceladas ni reservas que ya
            // fueron convertidas en una orden de trabajo.
            .filter(item => {
              const estado = this.normalizarTexto(item?.estado);

              const cancelada =
                estado === "cancelado" ||
                estado === "cancelada";

              const tieneOrden =
                item?.ordenTrabajoId != null;

              const ordenCreada =
                estado === "orden creada" ||
                estado === "orden_creada";

              return !(cancelada || tieneOrden || ordenCreada);
            })

            .map(

              item =>

                this.convertirAgendaEvento(

                  item

                )

            )

            .filter(Boolean);



        // =================================================

        // UNIR TODO

        // =================================================

        this.events = [

          ...eventosOrdenes,

          ...eventosAgenda

        ];



        console.log(

          "EVENTOS ÓRDENES:",

          eventosOrdenes

        );

        console.log(

          "EVENTOS AGENDA:",

          eventosAgenda

        );

        console.log(

          "TODOS LOS EVENTOS DEL CALENDARIO:",

          this.events

        );



      } catch (error) {

        console.error(

          "Error cargando calendario:",

          error

        );



        console.error(

          "Respuesta backend:",

          error?.response?.data

        );



        this.errorMessage =

          "No se pudo cargar el calendario de servicios.";



        this.events = [];

      } finally {

        this.loading = false;

      }

    },

    // =====================================================

    // CONVERTIR ORDEN EN EVENTO

    // =====================================================

 convertirOrdenEvento(orden) {

  if (!orden) {
    return null;
  }


  // =====================================================
  // FECHA
  // =====================================================

  const fecha =
    orden.fecha
      ? String(orden.fecha).substring(0, 10)
      : "";


  // =====================================================
  // HORAS
  // =====================================================

  const horaInicio =
    orden.hora
      ? String(orden.hora).substring(0, 5)
      : "";


  const horaFin =
    orden.horaFin
      ? String(orden.horaFin).substring(0, 5)
      : "";


  // =====================================================
  // CLIENTE
  // =====================================================

  const cliente =
    orden.cliente?.nombre
    ||
    orden.clienteNombre
    ||
    orden.cliente
    ||
    "Sin cliente";


  // =====================================================
  // PERSONA ENCARGADA
  // =====================================================

  const personaEncargada =
    orden.cliente?.personaEncargada
    ||
    orden.personaEncargada
    ||
    "";


  // =====================================================
  // TÉCNICO
  // =====================================================

  const usuario =
    orden.usuario?.nombre
    ||
    orden.usuarioNombre
    ||
    orden.usuario
    ||
    "";


  // =====================================================
  // EVENTO
  // =====================================================

  return {

    id: orden.id,

    ordenId: orden.id,

    numeroOrden:
      orden.numeroOrden || "",

    tipoEvento:
      "ORDEN",

    isAgenda:
      false,

    isOrdenTrabajo:
      true,


    // ===================================================
    // DATOS ORIGINALES
    // ===================================================

    fecha,

    hora:
      horaInicio,

    horaInicio,

    horaFin,


    // ===================================================
    // DATOS PARA EL CALENDARIO
    // ===================================================

// ===================================================
// DATOS PARA EL CALENDARIO
// IMPORTANTE: start/end DEBEN SER Date
// ===================================================

start:
  fecha && horaInicio
    ? this.crearFechaLocal(
        fecha,
        horaInicio
      )
    : null,

end:
  fecha && horaFin
    ? this.crearFechaLocal(
        fecha,
        horaFin
      )
    : null,


    // ===================================================
    // INFORMACIÓN
    // ===================================================

    title:
      orden.numeroOrden
        ? `Orden ${orden.numeroOrden}`
        : "Orden de trabajo",

    titulo:
      orden.numeroOrden
        ? `Orden ${orden.numeroOrden}`
        : "Orden de trabajo",

    descripcion:
      orden.descripcion || "",

    area:
      orden.area || "",

    estado:
      orden.estado || "PENDIENTE",


    // ===================================================
    // CLIENTE
    // ===================================================

    cliente,

    clienteId:
      orden.cliente?.id
      ??
      orden.idClientes
      ??
      null,

    persona:
      personaEncargada,

    personaEncargada,


    // ===================================================
    // TÉCNICO
    // ===================================================

    usuario,

    usuarioId:
      orden.usuario?.id
      ??
      orden.idUsuarios
      ??
      null,


    // ===================================================
    // OBJETO ORIGINAL
    // ===================================================

    ordenOriginal:
      orden

  };

},


    // =====================================================

    // CREAR FECHA LOCAL

    // Evita desplazamiento de día por UTC

    // =====================================================

    construirFechaHora(

      fecha,

      hora

    ) {

      if (!fecha) {

        return null;

      }



      try {

        const fechaTexto =

          String(fecha);



        const fechaSolo =

          fechaTexto.includes("T")

            ?

            fechaTexto.split("T")[0]

            :

            fechaTexto.substring(0, 10);



        const partesFecha =

          fechaSolo.split("-");



        if (

          partesFecha.length !== 3

        ) {

          return null;

        }



        const year =

          Number(

            partesFecha[0]

          );

        const month =

          Number(

            partesFecha[1]

          ) - 1;

        const day =

          Number(

            partesFecha[2]

          );



        let hours = 0;

        let minutes = 0;



        if (hora) {

          const partesHora =

            String(hora)

              .split(":");



          hours =

            Number(

              partesHora[0] || 0

            );

          minutes =

            Number(

              partesHora[1] || 0

            );

        }



        const resultado =

          new Date(

            year,

            month,

            day,

            hours,

            minutes,

            0,

            0

          );



        if (

          Number.isNaN(

            resultado.getTime()

          )

        ) {

          return null;

        }



        return resultado;



      } catch (error) {

        console.error(

          "Error construyendo fecha:",

          error

        );

        return null;

      }

    },



    // =====================================================

    // DURACIÓN

    // =====================================================

    calcularDuracion(

      inicio,

      fin

    ) {

      if (!inicio || !fin) {

        return "No disponible";

      }



      const diffMs =

        fin - inicio;



      if (diffMs <= 0) {

        return "No disponible";

      }



      const totalMinutos =

        Math.round(

          diffMs / 60000

        );



      const horas =

        Math.floor(

          totalMinutos / 60

        );



      const minutos =

        totalMinutos % 60;



      if (horas === 0) {

        return `${minutos} min`;

      }



      if (minutos === 0) {

        return `${horas} h`;

      }



      return `${horas} h ${minutos} min`;

    },



    // =====================================================

    // EVENTO

    // =====================================================

    // =====================================================
    // CLICK EN EVENTO
    // =====================================================

    handleEventClick({ event }) {

      if (!event) {
        return;
      }

      console.log(
        "EVENTO SELECCIONADO:",
        event
      );

      this.selectedEvent = {
        ...event
      };

      this.showModal = true;
    },


    closeModal() {

      this.showModal = false;

      this.selectedEvent = null;

    },

    verOrden(id) {

      if (!id) {
        return;
      }


      this.closeModal();


      this.$router.push({

        path:
          `/orden_trabajo_ver/${id}`

      })
        .catch(error => {

          if (
            error?.name !==
            "NavigationDuplicated"
          ) {

            console.error(
              "Error navegando a la orden:",
              error
            );

          }

        });

    },



    limpiarFiltros() {

      this.search = "";

      this.estadoFiltro =

        "TODOS";

    },



    // =====================================================

    // FORMATO HORAS

    // =====================================================

    formatTime(date) {

      if (!date) {

        return "";

      }



      const d =

        new Date(date);



      return d.toLocaleTimeString(

        "es-EC",

        {

          hour: "2-digit",

          minute: "2-digit",

          hour12: false

        }

      );

    },



    // =====================================================

    // FORMATO FECHA

    // =====================================================

    formatDate(date) {

      if (!date) {

        return "";

      }



      const d =

        new Date(date);



      const texto =

        d.toLocaleDateString(

          "es-EC",

          {

            weekday: "long",

            day: "2-digit",

            month: "long",

            year: "numeric"

          }

        );



      return (

        texto.charAt(0)

          .toUpperCase()

        +

        texto.slice(1)

      );

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

    // COLOR EVENTO

    // =====================================================

    getEventColor(event) {

      // ==========================================

      // RESERVA DE AGENDA

      // ==========================================

      if (event.isAgenda) {

        return "purple";

      }

      const estado =

        this.normalizarTexto(

          event.estado

        );



      if (

        estado.includes("final")

      ) {

        return "green";

      }



      if (

        estado.includes("cancel")

      ) {

        return "red";

      }



      if (

        estado.includes("proceso")

      ) {

        return "orange";

      }



      return "blue";

    },



    // =====================================================

    // CLASE ESTADO

    // =====================================================

    getStatusClass(estado) {

      const valor =

        this.normalizarTexto(

          estado

        );



      if (

        valor.includes("final")

      ) {

        return "status-completed";

      }



      if (

        valor.includes("cancel")

      ) {

        return "status-cancelled";

      }



      if (

        valor.includes("proceso")

      ) {

        return "status-progress";

      }



      return "status-pending";

    },



    getEventClass(event) {

      return this.getStatusClass(

        event.estado

      );

    },

  },

};

</script>



<style scoped>
/* =========================================================
   MODAL DETALLE - CALENDARIO
   ========================================================= */

.event-modal-backdrop {
  position: fixed;
  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(4px);

  overflow-y: auto;
}


/* =========================================================
   CONTENEDOR
   ========================================================= */

.event-modal {
  width: 100%;
  max-width: 1080px;

  max-height: calc(100vh - 48px);

  display: flex;
  flex-direction: column;

  background: #ffffff;

  border-radius: 28px;

  overflow: hidden;

  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.28);

  animation: calendarModalIn 0.18s ease-out;
}


@keyframes calendarModalIn {

  from {
    opacity: 0;
    transform: translateY(12px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

}


/* =========================================================
   HEADER
   ========================================================= */

.event-modal-header {
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 24px;

  padding: 34px 42px 30px;

  border-bottom: 1px solid #e8edf5;

  background: #ffffff;
}


.event-modal-header > div:first-child {
  min-width: 0;
  flex: 1;
}


.event-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 36px;

  padding: 8px 17px;

  margin-bottom: 14px;

  border-radius: 999px;

  font-size: 13px;
  line-height: 1;

  font-weight: 800;

  letter-spacing: 0.05em;

  text-transform: uppercase;

  background: #eef2f7;
  color: #475569;
}


.event-status-badge.is-agenda {
  background: #2563eb;
  color: #ffffff;
}


.event-status-badge.is-order {
  background: #fff7ed;
  color: #ea580c;
}


.event-modal-header h2 {
  margin: 0;

  color: #172033;

  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.12;

  font-weight: 800;

  letter-spacing: -0.025em;

  word-break: break-word;
}


.event-modal-header p {
  margin: 8px 0 0;

  color: #94a3b8;

  font-size: 17px;
  line-height: 1.5;
}


/* =========================================================
   CERRAR X
   ========================================================= */

.event-modal-close {
  flex: 0 0 auto;

  width: 54px;
  height: 54px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: 0;
  border-radius: 16px;

  background: #f1f5f9;

  color: #64748b;

  font-size: 22px;

  cursor: pointer;

  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}


.event-modal-close:hover {
  background: #e2e8f0;
  color: #1e293b;

  transform: scale(1.04);
}


/* =========================================================
   BODY
   ========================================================= */

.event-modal-body {
  padding: 36px 42px;

  overflow-y: auto;

  background: #ffffff;
}


/* =========================================================
   GRID INFORMACIÓN
   ========================================================= */

.event-info-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 22px;
}


/* =========================================================
   TARJETAS
   ========================================================= */

.event-info-card {
  min-width: 0;

  min-height: 112px;

  display: flex;
  align-items: center;

  gap: 18px;

  padding: 22px 20px;

  background: #f8fafc;

  border: 1px solid #e2e8f0;
  border-radius: 20px;
}


.event-info-card > div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 6px;
}


/* =========================================================
   ICONOS
   ========================================================= */

.event-info-icon {
  flex: 0 0 60px;

  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 17px;

  background: #edf4ff;

  color: #2563eb;

  font-size: 24px;
}


.event-info-icon i {
  line-height: 1;
}


/* =========================================================
   LABEL
   ========================================================= */

.event-info-label {
  display: block;

  margin: 0;

  color: #94a3b8;

  font-size: 13px;
  line-height: 1.2;

  font-weight: 800;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}


.event-info-card strong {
  display: block;

  color: #334155;

  font-size: 18px;
  line-height: 1.35;

  font-weight: 750;

  overflow-wrap: anywhere;
}


/* =========================================================
   DESCRIPCIÓN
   ========================================================= */

.event-description-card {
  margin-top: 24px;

  padding: 25px 26px;

  background: #f8fafc;

  border: 1px solid #e2e8f0;
  border-radius: 20px;
}


.event-description-title {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 14px;

  color: #334155;

  font-size: 16px;
}


.event-description-title i {
  color: #2563eb;

  font-size: 18px;
}


.event-description-title strong {
  font-weight: 800;
}


.event-description-card p {
  margin: 0;

  color: #526176;

  font-size: 17px;
  line-height: 1.65;

  white-space: pre-line;
}


/* =========================================================
   FOOTER
   ========================================================= */

.event-modal-footer {
  flex: 0 0 auto;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 14px;

  padding: 24px 42px;

  border-top: 1px solid #e8edf5;

  background: #fbfdff;
}


/* =========================================================
   BOTONES
   ========================================================= */

.btn-secondary-calendar,
.btn-primary-calendar {
  min-height: 52px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  padding: 0 24px;

  border-radius: 14px;

  font-size: 15px;
  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}


.btn-secondary-calendar {
  border: 1px solid #d7e0ec;

  background: #ffffff;

  color: #475569;
}


.btn-secondary-calendar:hover {
  background: #f8fafc;

  transform: translateY(-1px);
}


.btn-primary-calendar {
  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;

  box-shadow:
    0 8px 18px rgba(37, 99, 235, 0.18);
}


.btn-primary-calendar:hover {
  background: #1d4ed8;

  box-shadow:
    0 10px 24px rgba(37, 99, 235, 0.24);

  transform: translateY(-1px);
}


.btn-primary-calendar i,
.btn-secondary-calendar i {
  font-size: 16px;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 800px) {

  .event-modal-backdrop {
    padding: 12px;
  }


  .event-modal {
    max-height: calc(100vh - 24px);

    border-radius: 22px;
  }


  .event-modal-header {
    padding: 26px 24px 22px;
  }


  .event-modal-header h2 {
    font-size: 28px;
  }


  .event-modal-close {
    width: 46px;
    height: 46px;

    border-radius: 14px;
  }


  .event-modal-body {
    padding: 24px;
  }


  .event-info-grid {
    grid-template-columns: 1fr;

    gap: 14px;
  }


  .event-info-card {
    min-height: 96px;

    padding: 18px;
  }


  .event-info-icon {
    flex-basis: 52px;

    width: 52px;
    height: 52px;

    border-radius: 15px;

    font-size: 21px;
  }


  .event-modal-footer {
    padding: 20px 24px;

    flex-direction: column-reverse;
  }


  .btn-secondary-calendar,
  .btn-primary-calendar {
    width: 100%;
  }

}


@media (max-width: 480px) {

  .event-modal-header {
    padding: 22px 18px;
  }


  .event-modal-body {
    padding: 18px;
  }


  .event-modal-footer {
    padding: 18px;
  }


  .event-modal-header h2 {
    font-size: 24px;
  }


  .event-info-card strong {
    font-size: 16px;
  }

}
/* ========================================================= */

/* PÁGINA */

/* ========================================================= */

.calendar-page {

  width: 100%;

  max-width: 1500px;

  margin: 0 auto;

  padding: 30px;

  font-family:

    Inter,

    system-ui,

    -apple-system,

    BlinkMacSystemFont,

    "Segoe UI",

    sans-serif;

}



/* ========================================================= */

/* ENCABEZADO */

/* ========================================================= */

/* ========================================================= */

/* ENCABEZADO LIMPIO */

/* ========================================================= */

.calendar-header-card {

  position: relative;

  z-index: 20;

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 24px;

  margin-bottom: 22px;

  padding: 24px 28px;

  background: #ffffff !important;

  border: 1px solid #dfe7f0;

  border-radius: 18px;

  box-shadow:

    0 10px 30px rgba(15, 23, 42, 0.10);

}



.page-header-info {

  position: relative;

  z-index: 2;

  flex: 1;

}



.section-eyebrow {

  display: block;

  margin-bottom: 6px;

  color: #2563eb !important;

  font-size: 0.72rem;

  font-weight: 800;

  letter-spacing: 0.14em;

}



.calendar-title {

  position: relative;

  margin: 0 !important;

  color: #123b6d !important;

  font-size: clamp(1.8rem,

      3vw,

      2.6rem) !important;

  font-weight: 800 !important;

  line-height: 1.15 !important;

  text-shadow: none !important;

}



.calendar-subtitle {

  position: relative;

  margin: 8px 0 0 !important;

  color: #475569 !important;

  font-size: 1rem !important;

  font-weight: 500 !important;

  line-height: 1.5;

}



.calendar-stat {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 10px 14px;

  background: #eff6ff;

  color: #1d4ed8;

  border: 1px solid #bfdbfe;

  border-radius: 10px;

  font-size: 0.9rem;

  font-weight: 700;

}

.refresh-button {

  position: relative;

  z-index: 2;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  min-height: 42px;

  padding: 0 16px;

  border: 1px solid #bfdbfe;

  border-radius: 10px;

  background: #eff6ff;

  color: #1d4ed8;

  font-size: 0.85rem;

  font-weight: 700;

  white-space: nowrap;

  transition:

    background 0.2s ease,

    transform 0.2s ease;

}



.refresh-button:hover:not(:disabled) {

  background: #dbeafe;

  transform: translateY(-1px);

}

@media (max-width: 700px) {

  .calendar-header-card {

    flex-direction: column;

    align-items: flex-start;

    padding: 20px;

  }

  .calendar-title {

    font-size: 1.65rem !important;

  }

  .calendar-subtitle {

    font-size: 0.9rem !important;

  }

}

.refresh-button:hover:not(:disabled) {

  transform: translateY(-2px);

  background: #f8fbff;

  box-shadow:

    0 8px 20px rgba(15, 23, 42, 0.10);

}

.refresh-button:disabled {

  cursor: wait;

  opacity: 0.65;

}



/* ========================================================= */

/* RESUMEN */

/* ========================================================= */

.summary-grid {

  display: grid;

  grid-template-columns:

    repeat(4, minmax(0, 1fr));

  gap: 16px;

  margin-bottom: 20px;

}

.summary-card {

  min-height: 92px;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 17px 18px;

  border: 1px solid #e4eaf1;

  border-radius: 16px;

  background: rgba(255, 255, 255, 0.97);

  box-shadow:

    0 5px 18px rgba(15, 23, 42, 0.06);

}

.summary-icon {

  width: 48px;

  height: 48px;

  min-width: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  font-size: 1.1rem;

}

.summary-blue {

  color: #2563eb;

  background: #eff6ff;

}

.summary-orange {

  color: #d97706;

  background: #fff7ed;

}

.summary-green {

  color: #16a34a;

  background: #f0fdf4;

}

.summary-purple {

  color: #7c3aed;

  background: #f5f3ff;

}

.summary-label {

  display: block;

  margin-bottom: 2px;

  color: #64748b;

  font-size: 0.78rem;

  font-weight: 600;

}

.summary-value {

  display: block;

  color: #172033;

  font-size: 1.45rem;

  font-weight: 800;

}



/* ========================================================= */

/* FILTROS */

/* ========================================================= */

.filters-card {

  display: flex;

  align-items: center;

  gap: 18px;

  margin-bottom: 14px;

  padding: 14px;

  border: 1px solid #e4eaf1;

  border-radius: 15px;

  background: rgba(255, 255, 255, 0.97);

}

.search-wrapper {

  position: relative;

  flex: 1;

  min-width: 220px;

}

.search-icon {

  position: absolute;

  top: 50%;

  left: 14px;

  transform: translateY(-50%);

  color: #94a3b8;

  font-size: 0.85rem;

}

.search-input {

  width: 100%;

  height: 42px;

  padding:

    0 42px 0 39px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  outline: none;

  background: #f8fafc;

  color: #24324a;

  font-size: 0.88rem;

  transition:

    border 0.2s ease,

    box-shadow 0.2s ease,

    background 0.2s ease;

}

.search-input:focus {

  border-color: #93b4ed;

  background: #ffffff;

  box-shadow:

    0 0 0 3px rgba(37, 99, 235, 0.09);

}

.clear-search {

  position: absolute;

  top: 50%;

  right: 10px;

  width: 28px;

  height: 28px;

  transform: translateY(-50%);

  border: none;

  border-radius: 7px;

  background: transparent;

  color: #94a3b8;

}

.clear-search:hover {

  background: #e9eef5;

  color: #334155;

}

.status-filters {

  display: flex;

  flex-wrap: wrap;

  gap: 7px;

}

.status-filter {

  min-height: 36px;

  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding:

    0 12px;

  border: 1px solid #e2e8f0;

  border-radius: 9px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.78rem;

  font-weight: 700;

  transition:

    background 0.2s ease,

    border 0.2s ease,

    color 0.2s ease;

}

.status-filter:hover {

  border-color: #bfcee2;

  background: #f8fafc;

}

.status-filter.active {

  border-color: #2563eb;

  background: #eff6ff;

  color: #1d4ed8;

}

.filter-dot {

  width: 7px;

  height: 7px;

  border-radius: 50%;

}



/* ========================================================= */

/* LEYENDA */

/* ========================================================= */

.calendar-legend {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 18px;

  margin-bottom: 18px;

  padding:

    11px 15px;

  border: 1px solid #e4eaf1;

  border-radius: 13px;

  background:

    rgba(255, 255, 255, 0.97);

}

.legend-title {

  color: #334155;

  font-size: 0.8rem;

  font-weight: 800;

}

.legend-item {

  display: flex;

  align-items: center;

  gap: 7px;

  color: #64748b;

  font-size: 0.79rem;

  font-weight: 600;

}

.legend-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

}

.legend-dot.pending {

  background: #2563eb;

}

.legend-dot.progress {

  background: #f59e0b;

}

.legend-dot.completed {

  background: #16a34a;

}

.legend-dot.cancelled {

  background: #dc2626;

}



/* ========================================================= */

/* ALERTA */

/* ========================================================= */

.calendar-alert {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 15px;

  padding: 12px 15px;

  border: 1px solid #fecaca;

  border-radius: 11px;

  background: #fff1f2;

  color: #b42318;

  font-size: 0.86rem;

  font-weight: 600;

}



/* ========================================================= */

/* TARJETA CALENDARIO */

/* ========================================================= */

.calendar-card {

  position: relative;

  min-height: 600px;

  overflow: hidden;

  padding: 18px;

  border: 1px solid #dfe6ee;

  border-radius: 20px;

  background:

    rgba(255, 255, 255, 0.99);

  box-shadow:

    0 14px 40px rgba(15, 23, 42, 0.10);

  backdrop-filter: blur(10px);

}

.calendar-loading {

  min-height: 500px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 14px;

  color: #64748b;

  font-weight: 600;

}



/* ========================================================= */

/* EVENTOS */

/* ========================================================= */

.calendar-event {

  min-height: 58px;

  overflow: hidden;

  padding: 7px 9px;

  border: 1px solid transparent;

  border-left: 4px solid;

  border-radius: 8px;

  cursor: pointer;

  transition:

    transform 0.18s ease,

    box-shadow 0.18s ease;

}

.calendar-event:hover {

  z-index: 3;

  transform: translateY(-2px);

  box-shadow:

    0 5px 14px rgba(15, 23, 42, 0.14);

}

.calendar-event.status-pending {

  border-color: #bfdbfe;

  border-left-color: #2563eb;

  background: #eff6ff;

}

.calendar-event.status-progress {

  border-color: #fed7aa;

  border-left-color: #f59e0b;

  background: #fff7ed;

}

.calendar-event.status-completed {

  border-color: #bbf7d0;

  border-left-color: #16a34a;

  background: #f0fdf4;

}

.calendar-event.status-cancelled {

  border-color: #fecaca;

  border-left-color: #dc2626;

  background: #fef2f2;

}

.event-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 7px;

}

.event-number {

  overflow: hidden;

  color: #172033;

  font-size: 0.72rem;

  font-weight: 800;

  white-space: nowrap;

  text-overflow: ellipsis;

}

.event-status-dot {

  width: 7px;

  height: 7px;

  min-width: 7px;

  border-radius: 50%;

}

.event-client {

  margin-top: 3px;

  overflow: hidden;

  color: #475569;

  font-size: 0.68rem;

  font-weight: 600;

  white-space: nowrap;

  text-overflow: ellipsis;

}

.event-time {

  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 4px;

  color: #64748b;

  font-size: 0.63rem;

}



/* ========================================================= */

/* COLORES ESTADO */

/* ========================================================= */

.status-pending {

  background-color: #2563eb;

}

.status-progress {

  background-color: #f59e0b;

}

.status-completed {

  background-color: #16a34a;

}

.status-cancelled {

  background-color: #dc2626;

}



/* ========================================================= */

/* MODAL */

/* ========================================================= */

.event-modal-backdrop {

  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:

    rgba(15, 23, 42, 0.56);

  backdrop-filter: blur(6px);

}

.event-modal {

  width: 100%;

  max-width: 720px;

  overflow: hidden;

  border:

    1px solid rgba(255, 255, 255, 0.35);

  border-radius: 20px;

  background: #ffffff;

  box-shadow:

    0 30px 80px rgba(15, 23, 42, 0.30);

  animation:

    modalEnter 0.23s ease;

}

.event-modal-header {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  padding:

    25px 28px 20px;

  border-bottom:

    1px solid #edf1f5;

}

.modal-heading h2 {

  margin: 10px 0 2px;

  color: #172033;

  font-size: 1.4rem;

  font-weight: 800;

}

.modal-heading p {

  margin: 0;

  color: #94a3b8;

  font-size: 0.8rem;

}

.modal-status {

  display: inline-flex;

  align-items: center;

  padding:

    5px 10px;

  border-radius: 999px;

  color: #ffffff;

  font-size: 0.67rem;

  font-weight: 800;

  letter-spacing: 0.04em;

  text-transform: uppercase;

}

.modal-close {

  width: 38px;

  height: 38px;

  border: none;

  border-radius: 10px;

  background: #f1f5f9;

  color: #64748b;

  transition:

    background 0.2s ease,

    color 0.2s ease;

}

.modal-close:hover {

  background: #e2e8f0;

  color: #172033;

}

.event-modal-body {

  padding: 25px 28px;

}

.detail-grid {

  display: grid;

  grid-template-columns:

    repeat(2, minmax(0, 1fr));

  gap: 15px;

}

.detail-item {

  min-height: 76px;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 13px;

  border: 1px solid #e9eef4;

  border-radius: 13px;

  background: #fafcfe;

}

.detail-icon {

  width: 40px;

  height: 40px;

  min-width: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background: #eff6ff;

  color: #2563eb;

}

.detail-label {

  display: block;

  margin-bottom: 2px;

  color: #94a3b8;

  font-size: 0.66rem;

  font-weight: 800;

  letter-spacing: 0.04em;

  text-transform: uppercase;

}

.detail-value {

  display: block;

  color: #334155;

  font-size: 0.86rem;

  font-weight: 700;

}

.description-box {

  margin-top: 18px;

  padding: 17px;

  border: 1px solid #e9eef4;

  border-radius: 13px;

  background: #f8fafc;

}

.description-title {

  display: flex;

  align-items: center;

  gap: 8px;

  color: #334155;

  font-size: 0.76rem;

  font-weight: 800;

}

.description-title i {

  color: #2563eb;

}

.description-box p {

  margin: 9px 0 0;

  color: #475569;

  font-size: 0.87rem;

  line-height: 1.6;

}



/* ========================================================= */

/* FOOTER MODAL */

/* ========================================================= */

.event-modal-footer {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  padding:

    17px 28px;

  border-top:

    1px solid #edf1f5;

  background: #fafcfe;

}

.btn-secondary-calendar,

.btn-primary-calendar {

  min-height: 40px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding:

    0 17px;

  border-radius: 10px;

  font-size: 0.83rem;

  font-weight: 700;

}

.btn-secondary-calendar {

  border: 1px solid #d9e2ec;

  background: #ffffff;

  color: #475569;

}

.btn-secondary-calendar:hover {

  background: #f1f5f9;

}

.btn-primary-calendar {

  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;

}

.btn-primary-calendar:hover {

  border-color: #1d4ed8;

  background: #1d4ed8;

}



/* ========================================================= */

/* VUETIFY - COLORES Y CONTRASTE */

/* ========================================================= */

::v-deep(.v-calendar) {

  border: none !important;

  background: #ffffff !important;

  color: #1e293b !important;

}



/* Header completo */

::v-deep(.v-calendar-header) {

  padding:

    8px 4px 20px !important;

  background: #ffffff !important;

}



/* Título del mes */

::v-deep(.v-calendar-header__title) {

  color: #123b6d !important;

  font-weight: 800 !important;

}



/* Botones */

::v-deep(.v-calendar-header .v-btn) {

  min-width: 42px !important;

  height: 42px !important;

  border: 1px solid #dce5ef !important;

  border-radius: 11px !important;

  background: #f8fafc !important;

  color: #123b6d !important;

  opacity: 1 !important;

  box-shadow: none !important;

}



/* Flechas */

::v-deep(.v-calendar-header .v-btn .v-icon) {

  color: #123b6d !important;

  font-size: 24px !important;

  opacity: 1 !important;

}



/* Hover botones */

::v-deep(.v-calendar-header .v-btn:hover) {

  border-color: #bfdbfe !important;

  background: #eff6ff !important;

  color: #1d4ed8 !important;

}

::v-deep(.v-calendar-header .v-btn:hover .v-icon) {

  color: #1d4ed8 !important;

}



/* TODAY */

::v-deep(.v-calendar-header .v-btn:first-child) {

  width: auto !important;

  padding:

    0 15px !important;

  background: #ffffff !important;

  color: #123b6d !important;

  font-weight: 800 !important;

}



/* Día de semana */

::v-deep(.v-calendar-weekly__head-weekday) {

  color: #475569 !important;

  font-size: 0.78rem !important;

  font-weight: 800 !important;

  background: #f8fafc !important;

}



/* Celdas */

::v-deep(.v-calendar-month__day) {

  border-color: #e6edf4 !important;

  background: #ffffff !important;

}



/* Número de día */

::v-deep(.v-calendar-month__day-label),

::v-deep(.v-calendar-weekly__day-label) {

  color: #334155 !important;

  font-weight: 800 !important;

}



/* Día actual */

::v-deep(.v-calendar-weekly__day-label__today) {

  color: #ffffff !important;

}



/* ========================================================= */

/* OCULTAR NÚMEROS DE SEMANA 35, 36, 37...                  */

/* IMPORTANTE: FUERA DEL @MEDIA                              */

/* ========================================================= */

::v-deep(.v-calendar-week-number),

::v-deep(.v-calendar-weekly__weeknumber),

::v-deep(.v-calendar-month__weeknumber),

::v-deep(.v-calendar-month__week-number),

::v-deep(.v-calendar-week-number-label) {

  display: none !important;

  width: 0 !important;

  min-width: 0 !important;

  max-width: 0 !important;

  padding: 0 !important;

  border: 0 !important;

}



/*

 * Algunas versiones Labs de Vuetify renderizan la columna

 * de semana con role=rowheader en vez de una clase estable.

 */

::v-deep(.v-calendar-month [role="rowheader"]) {

  display: none !important;

}



/* ========================================================= */

/* SIN RESULTADOS */

/* ========================================================= */

.filter-empty-state {

  position: absolute;

  top: 110px;

  left: 50%;

  z-index: 10;

  width: min(90%,

      370px);

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 7px;

  padding: 25px;

  transform:

    translateX(-50%);

  border: 1px solid #e2e8f0;

  border-radius: 15px;

  background:

    rgba(255, 255, 255, 0.96);

  box-shadow:

    0 10px 30px rgba(15, 23, 42, 0.10);

  text-align: center;

}

.filter-empty-state i {

  margin-bottom: 5px;

  color: #94a3b8;

  font-size: 1.8rem;

}

.filter-empty-state strong {

  color: #334155;

}

.filter-empty-state span {

  color: #94a3b8;

  font-size: 0.8rem;

}

.filter-empty-state button {

  margin-top: 7px;

  padding:

    7px 13px;

  border: none;

  border-radius: 8px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 0.78rem;

  font-weight: 700;

}

/* ========================================================= */

/* EVENTOS SIMULTÁNEOS */

/* ========================================================= */

:deep(.v-calendar-month__day) {

  position: relative;

}

/*

 * Permitimos que varios eventos del mismo día

 * puedan repartirse horizontalmente.

 */

:deep(.v-calendar-month__day .v-calendar-internal-event) {

  min-width: 0;

}

/* Nuestro contenido */

.calendar-event {

  width: 100%;

  min-width: 0;

  box-sizing: border-box;

}

/* Evento más compacto para poder mostrar varios */

.calendar-event .event-number {

  font-size: 0.68rem;

}

.calendar-event .event-client {

  font-size: 0.64rem;

}

.calendar-event .event-time {

  font-size: 0.60rem;

}

/* ========================================================= */

/* CALENDARIO MENSUAL PERSONALIZADO */

/* ========================================================= */

.custom-day-cell {

  width: 100%;

  height: 100%;

  min-height: 145px;

  padding: 5px;

}



.custom-day-number {

  margin-bottom: 6px;

  padding-right: 3px;

  text-align: right;

  color: #334155;

  font-size: 0.82rem;

  font-weight: 800;

}



/* ========================================================= */

/* EVENTOS DEL DÍA */

/* ========================================================= */

.custom-day-events {

  width: 100%;

  display: grid;

  /*

   * ESTA ES LA PARTE IMPORTANTE.

   *

   * Los eventos se colocan uno junto al otro.

   */

  grid-template-columns:

    repeat(2,

      minmax(0, 1fr));

  gap: 5px;

  align-items: start;

}



/* ========================================================= */

/* TARJETA */

/* ========================================================= */

.custom-calendar-event {

  width: 100%;

  min-width: 0;

  padding: 6px 7px;

  border: 1px solid transparent;

  border-left: 3px solid;

  border-radius: 7px;

  cursor: pointer;

  overflow: hidden;

  transition:

    transform 0.15s ease,

    box-shadow 0.15s ease;

}



.custom-calendar-event:hover {

  transform: translateY(-1px);

  box-shadow:

    0 4px 10px rgba(15, 23, 42, 0.13);

}



/* ========================================================= */

/* ESTADOS */

/* ========================================================= */

.custom-calendar-event.status-pending {

  border-color: #bfdbfe;

  border-left-color: #2563eb;

  background: #eff6ff;

}



.custom-calendar-event.status-progress {

  border-color: #fed7aa;

  border-left-color: #f59e0b;

  background: #fff7ed;

}



.custom-calendar-event.status-completed {

  border-color: #bbf7d0;

  border-left-color: #16a34a;

  background: #f0fdf4;

}



.custom-calendar-event.status-cancelled {

  border-color: #fecaca;

  border-left-color: #dc2626;

  background: #fef2f2;

}



/* ========================================================= */

/* CABECERA EVENTO */

/* ========================================================= */

.custom-event-header {

  min-width: 0;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 4px;

}



.custom-event-title {

  min-width: 0;

  overflow: hidden;

  color: #172033;

  font-size: 0.66rem;

  font-weight: 800;

  white-space: nowrap;

  text-overflow: ellipsis;

}



/* ========================================================= */

/* CLIENTE */

/* ========================================================= */

.custom-event-client {

  margin-top: 3px;

  overflow: hidden;

  color: #475569;

  font-size: 0.62rem;

  font-weight: 600;

  white-space: nowrap;

  text-overflow: ellipsis;

}



/* ========================================================= */

/* HORARIO */

/* ========================================================= */

.custom-event-time {

  margin-top: 3px;

  display: flex;

  align-items: center;

  gap: 3px;

  overflow: hidden;

  color: #64748b;

  font-size: 0.57rem;

  white-space: nowrap;

}



/* ========================================================= */

/* RESPONSIVE */

/* ========================================================= */

@media (max-width: 900px) {

  .custom-day-events {

    grid-template-columns:

      1fr;

  }

}

/* ========================================================= */

/* RESPONSIVE */

/* ========================================================= */

@media (max-width: 1100px) {

  .summary-grid {

    grid-template-columns:

      repeat(2, minmax(0, 1fr));

  }

  .filters-card {

    flex-direction: column;

    align-items: stretch;

  }

}



@media (max-width: 800px) {

  .calendar-page {

    padding:

      20px 14px;

  }

  .page-header {

    flex-direction: column;

    align-items: stretch;

  }

  .refresh-button {

    align-self: flex-start;

  }

  .detail-grid {

    grid-template-columns: 1fr;

  }

  .calendar-card {

    overflow-x: auto;

  }

}



@media (max-width: 600px) {

  .summary-grid {

    grid-template-columns:

      1fr 1fr;

    gap: 10px;

  }

  .summary-card {

    min-height: 80px;

    padding: 12px;

  }

  .summary-icon {

    width: 40px;

    height: 40px;

    min-width: 40px;

  }

  .summary-value {

    font-size: 1.2rem;

  }

  .calendar-title {

    font-size: 1.7rem;

  }

  .calendar-card {

    padding: 8px;

    border-radius: 14px;

  }

  .calendar-event {

    min-height: 45px;

    padding: 5px;

  }

  .event-client {

    display: none;

  }

  .event-time {

    font-size: 0.58rem;

  }

  .status-filters {

    overflow-x: auto;

    flex-wrap: nowrap;

    padding-bottom: 3px;

  }

  .status-filter {

    white-space: nowrap;

  }

  .event-modal-header,

  .event-modal-body,

  .event-modal-footer {

    padding-left: 17px;

    padding-right: 17px;

  }

  .event-modal-footer {

    flex-direction: column-reverse;

  }

  .btn-secondary-calendar,

  .btn-primary-calendar {

    width: 100%;

  }

}



@keyframes modalEnter {

  from {

    opacity: 0;

    transform:

      translateY(12px) scale(0.98);

  }

  to {

    opacity: 1;

    transform:

      translateY(0) scale(1);

  }

}

/* ========================================================= */

/* EVENTOS SIMULTÁNEOS */

/* ========================================================= */

.calendar-event-wrapper {

  width: 100%;

  min-width: 0;

}

.calendar-event {

  width: 100%;

  height: 100%;

  box-sizing: border-box;

}



/*

 * IMPORTANTE:

 * Vuetify crea wrappers propios alrededor de cada evento.

 * Tenemos que permitir que esos wrappers compartan la fila.

 */

:deep(.v-calendar-month__day) {

  overflow: visible !important;

}

:deep(.v-calendar-month__events) {

  display: flex !important;

  flex-direction: row !important;

  flex-wrap: wrap !important;

  align-items: flex-start !important;

  gap: 4px !important;

}



/*

 * Cada evento deja de ocupar obligatoriamente toda la fila.

 */

:deep(.v-calendar-month__event) {

  flex: 1 1 calc(50% - 4px) !important;

  width: calc(50% - 4px) !important;

  min-width: 0 !important;

  max-width: calc(50% - 4px) !important;

  margin: 0 !important;

}


/* =========================================================
   CALENDARIO MENSUAL PERSONALIZADO
   ========================================================= */
.fumidez-calendar {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
}

.calendar-toolbar {
  min-height: 64px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.calendar-current-month {
  color: #123b6d;
  font-size: 1.05rem;
  font-weight: 800;
  text-align: center;
  text-transform: capitalize;
}

.calendar-toolbar-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.calendar-nav-button,
.calendar-today-button {
  min-height: 36px;
  border: 1px solid #dbe5f0;
  border-radius: 9px;
  background: #ffffff;
  color: #334155;
  font-weight: 700;
  cursor: pointer;
}

.calendar-nav-button {
  width: 38px;
}

.calendar-today-button {
  padding: 0 13px;
}

.calendar-nav-button:hover,
.calendar-today-button:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.calendar-week-header {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.calendar-week-day {
  padding: 11px 6px;
  text-align: center;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  border-right: 1px solid #e2e8f0;
}

.calendar-week-day:last-child {
  border-right: none;
}

.calendar-month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.calendar-day {
  min-width: 0;
  min-height: 165px;
  padding: 7px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day--outside {
  background: #f8fafc;
}

.calendar-day--outside .calendar-day-number {
  color: #cbd5e1;
}

.calendar-day--today {
  background: #f8fbff;
}

.calendar-day-header {
  min-height: 28px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 5px;
}

.calendar-day-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #334155;
  font-size: 0.78rem;
  font-weight: 800;
}

.calendar-day--today .calendar-day-number {
  background: #2563eb;
  color: #ffffff;
}

.calendar-day-events {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
  align-items: start;
}

.calendar-day-events--single {
  grid-template-columns: 1fr;
}

.calendar-event-card {
  min-width: 0;
  min-height: 74px;
  padding: 7px;
  border: 1px solid #bfdbfe;
  border-left: 4px solid #2563eb;
  border-radius: 8px;
  background: #eff6ff;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.calendar-event-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
}

.calendar-event-card__header {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.calendar-event-card__title {
  min-width: 0;
  overflow: hidden;
  color: #172033;
  font-size: 0.67rem;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.calendar-event-card__client {
  margin-top: 4px;
  overflow: hidden;
  color: #475569;
  font-size: 0.63rem;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.calendar-event-card__time {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  font-size: 0.59rem;
  white-space: nowrap;
}

.calendar-event-card.status-pending {
  background: #eff6ff;
  border-color: #bfdbfe;
  border-left-color: #2563eb;
}

.calendar-event-card.status-progress {
  background: #fff7ed;
  border-color: #fed7aa;
  border-left-color: #f59e0b;
}

.calendar-event-card.status-completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
  border-left-color: #16a34a;
}

.calendar-event-card.status-cancelled {
  background: #fef2f2;
  border-color: #fecaca;
  border-left-color: #dc2626;
}

@media (max-width: 1000px) {
  .calendar-day {
    min-height: 145px;
    padding: 5px;
  }

  .calendar-day-events {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .calendar-card {
    overflow-x: auto;
  }

  .fumidez-calendar {
    min-width: 900px;
  }
}



/* =========================================================
   VISTA SEMANAL FUMIDEZ
   ========================================================= */

.calendar-week-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;
  min-height: 620px;
}

.calendar-day--week {
  min-width: 0;
  min-height: 620px;
  padding: 8px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  border-bottom: none;
}

.calendar-day--week:last-child {
  border-right: none;
}

.calendar-day-header--week {
  min-height: 58px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid #eef2f7;
}

.calendar-day-name {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.calendar-day--week.calendar-day--today {
  background: #f8fbff;
}

.calendar-day--week.calendar-day--today .calendar-day-name {
  color: #2563eb;
}

.calendar-day-events {
  display: grid;
  grid-template-columns: 1fr;
  gap: 7px;
  align-items: start;
}

.calendar-day-events--single {
  grid-template-columns: 1fr;
}

.calendar-day-empty {
  padding: 16px 4px;
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 600;
  text-align: center;
}

.calendar-event-card {
  width: 100%;
  min-width: 0;
}

@media (max-width: 1100px) {
  .fumidez-calendar {
    overflow-x: auto;
  }

  .calendar-toolbar {
    min-width: 980px;
  }

  .calendar-week-grid {
    min-width: 980px;
  }
}



/* =========================================================
   AGENDA SEMANAL POR HORAS - ESTILO TEAMS / OUTLOOK
   ========================================================= */

.time-calendar {
  width: 100%;
  overflow: auto;
  background: #ffffff;
}

.time-calendar-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 72px repeat(7, minmax(145px, 1fr));
  min-width: 1087px;
  background: #ffffff;
  border-bottom: 1px solid #dfe5ec;
}

.time-calendar-corner {
  min-height: 72px;
  border-right: 1px solid #dfe5ec;
}

.time-calendar-day-header {
  min-height: 72px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #dfe5ec;
}

.time-calendar-day-header:last-child {
  border-right: none;
}

.time-calendar-day-header.is-today {
  background: #f6f9ff;
}

.time-calendar-day-name {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.time-calendar-day-number {
  margin-top: 3px;
  color: #334155;
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1;
}

.time-calendar-day-header.is-today .time-calendar-day-number {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #2563eb;
  border-radius: 50%;
}

.time-calendar-body {
  position: relative;
  display: grid;
  grid-template-columns: 72px repeat(7, minmax(145px, 1fr));
  min-width: 1087px;
}

.time-calendar-hours {
  position: relative;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #dfe5ec;
}

.time-calendar-hour-label {
  position: absolute;
  right: 10px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.time-calendar-day-column {
  position: relative;
  height: 100%;
  min-width: 0;
  background: #ffffff;
  border-right: 1px solid #dfe5ec;
}

.time-calendar-day-column:last-child {
  border-right: none;
}

.time-calendar-day-column.is-today {
  background: #fbfdff;
}

.time-calendar-slot-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: #eef2f6;
  pointer-events: none;
}

.time-calendar-slot-line.is-hour {
  background: #dfe5ec;
}

.time-calendar-click-slot {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.12s ease;
}

.time-calendar-click-slot:hover {
  background-color: rgba(37, 99, 235, 0.08);
}

.time-calendar-event {
  position: absolute;
  z-index: 5;
  min-width: 0;
  padding: 6px 7px;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-left: 4px solid #2563eb;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.time-calendar-event:hover {
  z-index: 20;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(15, 23, 42, 0.16);
}

.time-calendar-event.status-pending {
  background: #eff6ff;
  border-color: #bfdbfe;
  border-left-color: #2563eb;
}

.time-calendar-event.status-progress {
  background: #fff7ed;
  border-color: #fed7aa;
  border-left-color: #f59e0b;
}

.time-calendar-event.status-completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
  border-left-color: #16a34a;
}

.time-calendar-event.status-cancelled {
  background: #fef2f2;
  border-color: #fecaca;
  border-left-color: #dc2626;
}

.time-calendar-event__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
}

.time-calendar-event__title {
  min-width: 0;
  overflow: hidden;
  color: #172033;
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.time-calendar-event__client {
  margin-top: 3px;
  overflow: hidden;
  color: #475569;
  font-size: 0.64rem;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.time-calendar-event__time {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  font-size: 0.59rem;
  white-space: nowrap;
}

.time-calendar-now-line {
  position: absolute;
  z-index: 25;
  left: 72px;
  right: 0;
  height: 2px;
  background: #ef4444;
  pointer-events: none;
}

.time-calendar-now-line span {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 9px;
  height: 9px;
  background: #ef4444;
  border-radius: 50%;
}

@media (max-width: 1100px) {

  .time-calendar-header,
  .time-calendar-body {
    min-width: 1087px;
  }
}
</style>