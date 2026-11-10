  <template>
    <div class="page-container d-flex flex-column">

      <main class="flex-grow-1 bg-light">

        <div class="container py-5">

          <!-- ====================================== -->
          <!-- TÍTULO -->
          <!-- ====================================== -->

          <h1 class="text-center text-primary mb-2">
            Panel Gerencial Fumidez
          </h1>

          <p class="text-center text-muted mb-5">
            Resumen general de la operación
          </p>


          <!-- ====================================== -->
          <!-- CARGANDO DASHBOARD -->
          <!-- ====================================== -->

          <div v-if="cargandoDashboard" class="text-center py-5">
            <div class="spinner-border text-primary"></div>

            <p class="mt-3 text-muted">
              Cargando información...
            </p>
          </div>


          <!-- ====================================== -->
          <!-- ERROR -->
          <!-- ====================================== -->

          <div v-else-if="errorDashboard" class="alert alert-danger text-center">
            {{ errorDashboard }}
          </div>


          <!-- ====================================== -->
          <!-- CONTENIDO DEL DASHBOARD -->
          <!-- ====================================== -->

          <template v-else>

            <!-- ====================================== -->
<!-- RESUMEN EJECUTIVO -->
<!-- ====================================== -->

<section class="executive-section mb-5">

  <div class="executive-heading">

    <div>
      <span class="section-eyebrow">
        VISIÓN EJECUTIVA
      </span>

      <h2>
        Estado financiero del mes
      </h2>

      <p>
        {{
          nombreMes(
            dashboard.finanzas.mes
          )
        }}
        {{
          dashboard.finanzas.anio
        }}
      </p>
    </div>

    <button
      type="button"
      class="finance-link"
      @click="redirigir('/gastos')"
    >
      Ver Finanzas

      <i class="fas fa-arrow-right"></i>
    </button>

  </div>


  <!-- PRINCIPALES -->

  <div class="financial-grid">

    <!-- EJECUTADO -->

    <article class="financial-card">

      <div class="financial-card-top">

        <span class="financial-icon financial-blue">
          <i class="fas fa-briefcase"></i>
        </span>

        <span class="financial-tag">
          Operación
        </span>

      </div>

      <p class="financial-label">
        Ejecutado
      </p>

      <h3>
        {{
          formatearDinero(
            dashboard.finanzas.totalEjecutado
          )
        }}
      </h3>

      <span class="financial-help">
        Valor de trabajos realizados
      </span>

    </article>


    <!-- FACTURADO -->

    <article class="financial-card">

      <div class="financial-card-top">

        <span class="financial-icon financial-purple">
          <i class="fas fa-file-invoice-dollar"></i>
        </span>

        <span class="financial-tag">
          Comercial
        </span>

      </div>

      <p class="financial-label">
        Facturado
      </p>

      <h3>
        {{
          formatearDinero(
            dashboard.finanzas.totalFacturado
          )
        }}
      </h3>

      <span class="financial-help">
        Valor emitido en facturas
      </span>

    </article>


    <!-- COBRADO -->

    <article class="financial-card">

      <div class="financial-card-top">

        <span class="financial-icon financial-green">
          <i class="fas fa-hand-holding-usd"></i>
        </span>

        <span class="financial-tag">
          Caja
        </span>

      </div>

      <p class="financial-label">
        Cobrado
      </p>

      <h3>
        {{
          formatearDinero(
            dashboard.finanzas.totalCobrado
          )
        }}
      </h3>

      <span class="financial-help">
        Dinero efectivamente recibido
      </span>

    </article>


    <!-- POR COBRAR -->

    <article
      class="financial-card"
      :class="{
        'financial-card-warning':
          dashboard.finanzas.totalPorCobrar > 0
      }"
    >

      <div class="financial-card-top">

        <span class="financial-icon financial-orange">
          <i class="fas fa-clock"></i>
        </span>

        <span class="financial-tag">
          Cartera
        </span>

      </div>

      <p class="financial-label">
        Por cobrar
      </p>

      <h3>
        {{
          formatearDinero(
            dashboard.finanzas.totalPorCobrar
          )
        }}
      </h3>

      <span class="financial-help">
        Saldo pendiente de clientes
      </span>

    </article>

  </div>


  <!-- FLUJO -->

  <div class="cashflow-grid">

    <article class="cashflow-card">

      <div class="cashflow-icon">
        <i class="fas fa-arrow-trend-down"></i>
      </div>

      <div class="cashflow-content">

        <span>
          Egresos del mes
        </span>

        <strong>
          {{
            formatearDinero(
              dashboard.finanzas.totalEgresos
            )
          }}
        </strong>
<small>
  {{
    formatearDinero(
      dashboard.finanzas.totalGastosManuales
    )
  }}
  gastos

  <span class="cashflow-separator">
    •
  </span>

  {{
    formatearDinero(
      dashboard.finanzas.totalComprasProductos
    )
  }}
  compras
</small>

      </div>

    </article>


    <article
      class="cashflow-card cashflow-main"
      :class="
        claseFlujo(
          dashboard.finanzas.flujoReal
        )
      "
    >

      <div class="cashflow-icon">
        <i class="fas fa-chart-line"></i>
      </div>

      <div class="cashflow-content">

        <span>
          Flujo real
        </span>

        <strong>
          {{
            formatearDinero(
              dashboard.finanzas.flujoReal
            )
          }}
        </strong>

        <small>
          Cobrado − egresos
        </small>

      </div>

    </article>

  </div>

</section>


<!-- ====================================== -->
<!-- ESTADO OPERATIVO -->
<!-- ====================================== -->

<div class="section-heading mb-4">

  <div>

    <span class="section-eyebrow">
      OPERACIÓN
    </span>

    <h3>
      Estado del negocio
    </h3>

    <p>
      Indicadores operativos del mes actual
    </p>

  </div>

</div>
            <!-- ====================================== -->
            <!-- TARJETAS PRINCIPALES -->
            <!-- ====================================== -->

            <div class="row g-4 mb-5">

              <!-- ÓRDENES DEL MES -->
              <div class="col-12 col-sm-6 col-lg-4">

                <div class="dashboard-card" @click="redirigir('/orden_trabajo_lista')">

                  <div class="dashboard-icon icon-blue">
                    <i class="fas fa-clipboard-list"></i>
                  </div>

                  <div>
                    <p class="dashboard-label">
                      Órdenes del mes
                    </p>

                    <h2 class="dashboard-value">
                      {{ dashboard.ordenesMes }}
                    </h2>
                  </div>

                </div>

              </div>


              <!-- ÓRDENES PENDIENTES -->
              <div class="col-12 col-sm-6 col-lg-4">

                <div class="dashboard-card" @click="redirigir('/orden_trabajo_lista')">

                  <div class="dashboard-icon icon-orange">
                    <i class="fas fa-clock"></i>
                  </div>

                  <div>
                    <p class="dashboard-label">
                      Órdenes pendientes
                    </p>

                    <h2 class="dashboard-value">
                      {{ dashboard.ordenesPendientes }}
                    </h2>
                  </div>

                </div>

              </div>


              <!-- CLIENTES -->
              <div class="col-12 col-sm-6 col-lg-4">

                <div class="dashboard-card" @click="redirigir('/clientes_lista')">

                  <div class="dashboard-icon icon-purple">
                    <i class="fas fa-user-tie"></i>
                  </div>

                  <div>
                    <p class="dashboard-label">
                      Clientes
                    </p>

                    <h2 class="dashboard-value">
                      {{ dashboard.clientes }}
                    </h2>
                  </div>

                </div>

              </div>


             

           

              <!-- STOCK BAJO -->
              <div class="col-12 col-sm-6 col-xl-3">

                <div class="dashboard-card" :class="{
                  'stock-alert':
                    dashboard.productosStockBajo > 0
                }" @click="redirigir('/productos_lista')">

                  <div class="dashboard-icon icon-yellow">
                    <i class="fas fa-exclamation-triangle"></i>
                  </div>

                  <div>
                    <p class="dashboard-label">
                      Productos con stock bajo
                    </p>

                    <h2 class="dashboard-value">
                      {{ dashboard.productosStockBajo }}
                    </h2>
                  </div>

                </div>

              </div>

            </div>


            <!-- ====================================== -->
            <!-- ANALÍTICA OPERATIVA -->
            <!-- ====================================== -->

            <div class="row g-4 mb-5">


              <!-- ====================================== -->
              <!-- ÓRDENES POR MES -->
              <!-- ====================================== -->

              <div class="col-12 col-lg-7">

                <div class="dashboard-panel">

                  <div class="panel-header">

                    <div>

                      <h4>
                        Órdenes por mes
                      </h4>

                      <p>
                        Comportamiento del año actual
                      </p>

                    </div>

                    <i class="fas fa-chart-bar panel-icon"></i>

                  </div>


                  <div v-if="
                    !dashboard.ordenesPorMes ||
                    dashboard.ordenesPorMes.length === 0
                  " class="empty-state">

                    <i class="fas fa-chart-bar"></i>

                    <p>
                      No existen datos para mostrar.
                    </p>

                  </div>


                  <div v-else class="chart-container">

                    <div v-for="mes in dashboard.ordenesPorMes" :key="mes.mes" class="chart-column">

                      <span class="chart-value">
                        {{ mes.cantidad }}
                      </span>


                      <div class="bar-wrapper">

                        <div class="bar" :style="{
                          height:
                            calcularAlturaBarra(
                              mes.cantidad
                            )
                        }"></div>

                      </div>


                      <span class="chart-label">
                        {{ formatearMes(mes.mes) }}
                      </span>

                    </div>

                  </div>
<!-- RESUMEN OPERATIVO -->

<div
  v-if="
    dashboard.ordenesPorMes &&
    dashboard.ordenesPorMes.length > 0
  "
  class="operation-summary"
>

  <div class="operation-stat">

    <span class="operation-stat-icon">
      <i class="fas fa-clipboard-check"></i>
    </span>

    <div>
      <small>
        Total del año
      </small>

      <strong>
        {{ totalOrdenesAnio }}
      </strong>
    </div>

  </div>


  <div class="operation-stat">

    <span class="operation-stat-icon">
      <i class="fas fa-chart-line"></i>
    </span>

    <div>
      <small>
        Promedio mensual
      </small>

      <strong>
        {{ promedioOrdenesMes }}
      </strong>
    </div>

  </div>


  <div
    v-if="mesMasActivo"
    class="operation-stat"
  >

    <span class="operation-stat-icon">
      <i class="fas fa-trophy"></i>
    </span>

    <div>
      <small>
        Mes con mayor actividad
      </small>

      <strong>
        {{ formatearMes(mesMasActivo.mes) }}
      </strong>

      <span>
        {{ mesMasActivo.cantidad }}
        órdenes
      </span>
    </div>

  </div>

</div>
                </div>

              </div>


              <!-- ====================================== -->
              <!-- STOCK CRÍTICO -->
              <!-- ====================================== -->

              <div class="col-12 col-lg-5">

                <div class="dashboard-panel">

                  <div class="panel-header">

                    <div>

                      <h4>
                        Stock crítico
                      </h4>

                      <p>
                        Productos con 5 unidades o menos
                      </p>

                    </div>

                    <i class="fas fa-box-open panel-icon warning"></i>

                  </div>


                  <!-- SIN STOCK CRÍTICO -->

                  <div v-if="
                    !dashboard.productosStockCritico ||
                    dashboard.productosStockCritico.length === 0
                  " class="empty-state">

                    <i class="fas fa-check-circle"></i>

                    <p>
                      No existen productos con stock crítico.
                    </p>

                  </div>


                  <!-- LISTADO -->

                  <div v-else class="table-responsive">

                    <table class="table align-middle">

                      <thead>

                        <tr>

                          <th>
                            Producto
                          </th>

                          <th class="text-end">
                            Disponible
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        <tr v-for="
producto
  in dashboard.productosStockCritico
                          " :key="producto.id">

                          <td>

                            <strong>
                              {{ producto.nombre }}
                            </strong>

                          </td>


                          <td class="text-end">

                            <span class="stock-badge">

                              {{ producto.cantidad }}

                              {{
                                formatearUnidad(
                                  producto.unidadMedida
                                )
                              }}

                            </span>

                          </td>

                        </tr>

                      </tbody>

                    </table>

                  </div>


                  <button type="button" class="btn btn-outline-primary btn-sm w-100 mt-3"
                    @click="redirigir('/productos_lista')">
                    <i class="fas fa-box-open me-2"></i>
                    Ver inventario
                  </button>

                </div>

              </div>

            </div>

<!-- ====================================== -->
<!-- ALERTAS GERENCIALES -->
<!-- ====================================== -->

<div class="dashboard-panel alerts-panel mb-5">

  <div class="panel-header">

    <div>

      <span class="section-eyebrow">
        ATENCIÓN
      </span>

      <h4>
        Alertas gerenciales
      </h4>

      <p>
        Situaciones que requieren seguimiento
      </p>

    </div>

    <i
      class="fas fa-bell panel-icon"
    ></i>

  </div>


  <div class="alerts-grid">

    <!-- FACTURAS -->

    <button
      type="button"
      class="alert-item"
      @click="redirigir('/facturas_lista')"
    >

      <span class="alert-icon alert-orange">
        <i class="fas fa-file-invoice-dollar"></i>
      </span>

      <span class="alert-content">

        <strong>
          {{
            dashboard.finanzas.facturasPendientes
          }}
          facturas pendientes
        </strong>

        <small>
          {{
            formatearDinero(
              dashboard.finanzas.totalPorCobrar
            )
          }}
          por cobrar
        </small>

      </span>

      <i class="fas fa-chevron-right alert-arrow"></i>

    </button>


    <!-- VENCIDAS -->

    <button
      type="button"
      class="alert-item"
      :class="{
        'alert-danger-item':
          dashboard.finanzas.facturasVencidas > 0
      }"
      @click="redirigir('/facturas_lista')"
    >

      <span class="alert-icon alert-red">
        <i class="fas fa-calendar-times"></i>
      </span>

      <span class="alert-content">

        <strong>
          {{
            dashboard.finanzas.facturasVencidas
          }}
          facturas vencidas
        </strong>

        <small>
          Cartera vencida:
          {{
            formatearDinero(
              dashboard.finanzas.carteraVencida
            )
          }}
        </small>

      </span>

      <i class="fas fa-chevron-right alert-arrow"></i>

    </button>


    <!-- STOCK -->

    <button
      type="button"
      class="alert-item"
      :class="{
        'alert-warning-item':
          dashboard.productosStockBajo > 0
      }"
      @click="redirigir('/productos_lista')"
    >

      <span class="alert-icon alert-yellow">
        <i class="fas fa-box-open"></i>
      </span>

      <span class="alert-content">

        <strong>
          {{
            dashboard.productosStockBajo
          }}
          productos con stock bajo
        </strong>

        <small>
          Requieren revisión de inventario
        </small>

      </span>

      <i class="fas fa-chevron-right alert-arrow"></i>

    </button>

  </div>

</div>
            <!-- ====================================== -->
            <!-- PRÓXIMOS SERVICIOS -->
            <!-- ====================================== -->

            <div class="dashboard-panel mb-5">

              <div class="panel-header">

                <div>

                  <h4>
                    Próximos servicios
                  </h4>

                  <p>
                    Próximas órdenes programadas
                  </p>

                </div>

                <i class="fas fa-calendar-alt panel-icon"></i>

              </div>


              <!-- SIN SERVICIOS -->

              <div v-if="
                !dashboard.proximosServicios ||
                dashboard.proximosServicios.length === 0
              " class="empty-state">

                <i class="fas fa-calendar-check"></i>

                <p>
                  No existen servicios próximos.
                </p>

              </div>


              <!-- TABLA DE SERVICIOS -->

              <div v-else class="table-responsive">

                <table class="table table-hover align-middle">

                  <thead>

                    <tr>

                      <th>
                        Fecha
                      </th>

                      <th>
                        Hora
                      </th>

                      <th>
                        Orden
                      </th>

                      <th>
                        Cliente
                      </th>

                      <th>
                        Estado
                      </th>

                      <th class="text-center">
                        Acción
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr v-for="
servicio
  in dashboard.proximosServicios
                      " :key="servicio.idOrden">

                      <td>

                        {{
                          formatearFecha(
                            servicio.fecha
                          )
                        }}

                      </td>


                      <td>

                        {{
                          formatearHora(
                            servicio.hora
                          )
                        }}

                      </td>


                      <td>

                        <strong>

                          {{
                            servicio.numeroOrden
                            ||
                            `OT-${servicio.idOrden}`
                          }}

                        </strong>

                      </td>


                      <td>

                        {{
                          servicio.cliente
                          ||
                          "Cliente no disponible"
                        }}

                      </td>


                      <td>

                        <span class="badge" :class="claseEstado(
                          servicio.estado
                        )
                          ">

                          {{
                            servicio.estado
                            ||
                            "Sin estado"
                          }}

                        </span>

                      </td>


                      <td class="text-center">

                        <button type="button" class="btn btn-sm btn-outline-primary" title="Ver orden" @click="
                          redirigir(
                            `/orden_trabajo_ver/${servicio.idOrden}`
                          )
                          ">

                          <i class="bi bi-eye"></i>

                        </button>

                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>


              <button type="button" class="btn btn-outline-primary btn-sm mt-3" @click="redirigir('/calendario')">
                <i class="fas fa-calendar-alt me-2"></i>
                Ver calendario completo
              </button>

            </div>


            <!-- ====================================== -->
            <!-- ACCESOS RÁPIDOS -->
            <!-- ====================================== -->

            <div class="section-title mb-4">

              <div>

                <h3 class="mb-1">
                  Accesos rápidos
                </h3>

                <p class="text-muted mb-0">
                  Gestión de los módulos del sistema
                </p>

              </div>

            </div>


            <div class="row g-4">

              <div v-for="modulo in modulos" :key="modulo.nombre" class="col-12 col-sm-6 col-md-4 col-lg-3">

                <div class="card module-card text-center" @click="redirigir(modulo.ruta)">

                  <div class="card-body d-flex flex-column justify-content-center align-items-center">

                    <div class="icon-container mb-3">

                      <i :class="modulo.icono" class="module-icon"></i>

                    </div>


                    <h5 class="card-title mb-3">
                      {{ modulo.nombre }}
                    </h5>


                    <button type="button" class="btn btn-gradient px-4 py-2">
                      Acceder
                    </button>

                  </div>

                </div>

              </div>

            </div>


            <!-- ====================================== -->
            <!-- FOOTER -->
            <!-- ====================================== -->

            <div class="text-center mt-5">

              <p class="text-muted">
                © 2026 Fumidez Control de Plagas
              </p>

            </div>

          </template>

        </div>

      </main>

    </div>
  </template>


<script>
import router from "@/router";
import { api } from "@/config/api";

export default {

  name: "PaginaInicio",

  data() {

    return {

      cargandoDashboard: true,

      errorDashboard: "",


      dashboard: {
        ordenesMes: 0,
        ordenesPendientes: 0,
        clientes: 0,
        facturasPendientes: 0,
        facturasPagadas: 0,
        productosStockBajo: 0,

        ordenesPorMes: [],
        proximosServicios: [],
        productosStockCritico: [],

        finanzas: {
          anio: null,
          mes: null,

          totalEjecutado: 0,
          totalFacturado: 0,
          totalCobrado: 0,
          totalPorCobrar: 0,

          totalEgresos: 0,
          flujoReal: 0,

          carteraVencida: 0,
          facturasPendientes: 0,
          facturasVencidas: 0,

          totalGastosManuales: 0,
          totalComprasProductos: 0
        }
      },

      modulos: [

        {
          nombre: "Usuarios",
          ruta: "/usuarios_lista",
          icono: "fas fa-users"
        },

        {
          nombre: "Clientes",
          ruta: "/clientes_lista",
          icono: "fas fa-user-tie"
        },

        {
          nombre: "Facturas",
          ruta: "/facturas_lista",
          icono: "fas fa-file-invoice-dollar"
        },
        {
          nombre: "Finanzas",
          ruta: "/gastos",
          icono: "fas fa-chart-pie"
        },
        {
          nombre: "Orden de Trabajo",
          ruta: "/orden_trabajo_lista",
          icono: "fas fa-tasks"
        },

        {
          nombre: "Informe",
          ruta: "/informe_lista",
          icono: "fas fa-chart-line"
        },

        {
          nombre: "Productos",
          ruta: "/productos_lista",
          icono: "fas fa-box-open"
        },

        {
          nombre: "Proveedores",
          ruta: "/proveedores_lista",
          icono: "fas fa-truck-moving"
        },

        {
          nombre: "Calendario",
          ruta: "/calendario",
          icono: "fas fa-calendar-alt"
        }

      ]

    };

  },


  async mounted() {

    await this.cargarDashboard();

  },

computed: {

  totalOrdenesAnio() {

    const meses =
      this.dashboard.ordenesPorMes || [];

    const mesActual =
      new Date().getMonth() + 1;

    return meses
      .slice(0, mesActual)
      .reduce(
        (total, mes) =>
          total + Number(mes.cantidad || 0),
        0
      );
  },


  promedioOrdenesMes() {

    const meses =
      this.dashboard.ordenesPorMes || [];

    const mesActual =
      new Date().getMonth() + 1;

    const mesesTranscurridos =
      meses.slice(0, mesActual);

    if (mesesTranscurridos.length === 0) {
      return "0,0";
    }

    const promedio =
      this.totalOrdenesAnio /
      mesesTranscurridos.length;

    return promedio
      .toFixed(1)
      .replace(".", ",");
  },


  mesMasActivo() {

    const meses =
      this.dashboard.ordenesPorMes || [];

    const mesActual =
      new Date().getMonth() + 1;

    const mesesTranscurridos =
      meses.slice(0, mesActual);

    if (mesesTranscurridos.length === 0) {
      return null;
    }

    return mesesTranscurridos.reduce(
      (mayor, actual) =>
        Number(actual.cantidad || 0) >
        Number(mayor.cantidad || 0)
          ? actual
          : mayor
    );
  }

},
  methods: {

    // ======================================
    // CARGAR DASHBOARD
    // ======================================

    formatearDinero(valor) {

      const numero =
        Number(valor || 0);

      return new Intl.NumberFormat(
        "es-EC",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ).format(numero);
    },


    nombreMes(numeroMes) {

      if (!numeroMes) {
        return "";
      }

      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ];

      return meses[
        Number(numeroMes) - 1
      ] || "";
    },


    claseFlujo(valor) {

      const numero =
        Number(valor || 0);

      if (numero > 0) {
        return "financial-positive";
      }

      if (numero < 0) {
        return "financial-negative";
      }

      return "financial-neutral";
    },

    async cargarDashboard() {

      this.cargandoDashboard = true;

      this.errorDashboard = "";

      try {

        const response =
          await api.get(
            "/dashboard/resumen"
          );


        this.dashboard = {

          ordenesMes:
            response.data.ordenesMes ?? 0,

          ordenesPendientes:
            response.data.ordenesPendientes ?? 0,

          clientes:
            response.data.clientes ?? 0,

          facturasPendientes:
            response.data.facturasPendientes ?? 0,

          facturasPagadas:
            response.data.facturasPagadas ?? 0,

          productosStockBajo:
            response.data.productosStockBajo ?? 0,

          ordenesPorMes:
            response.data.ordenesPorMes ?? [],

          proximosServicios:
            response.data.proximosServicios ?? [],

          productosStockCritico:
            response.data.productosStockCritico ?? [],
          finanzas: {
            anio:
              response.data.finanzas?.anio ?? null,

            mes:
              response.data.finanzas?.mes ?? null,

            totalEjecutado:
              Number(
                response.data.finanzas?.totalEjecutado ?? 0
              ),

            totalFacturado:
              Number(
                response.data.finanzas?.totalFacturado ?? 0
              ),

            totalCobrado:
              Number(
                response.data.finanzas?.totalCobrado ?? 0
              ),

            totalPorCobrar:
              Number(
                response.data.finanzas?.totalPorCobrar ?? 0
              ),

            totalEgresos:
              Number(
                response.data.finanzas?.totalEgresos ?? 0
              ),

            flujoReal:
              Number(
                response.data.finanzas?.flujoReal ?? 0
              ),

            carteraVencida:
              Number(
                response.data.finanzas?.carteraVencida ?? 0
              ),

            facturasPendientes:
              Number(
                response.data.finanzas?.facturasPendientes ?? 0
              ),

            facturasVencidas:
              Number(
                response.data.finanzas?.facturasVencidas ?? 0
              ),

            totalGastosManuales:
              Number(
                response.data.finanzas?.totalGastosManuales ?? 0
              ),

            totalComprasProductos:
              Number(
                response.data.finanzas?.totalComprasProductos ?? 0
              )
          }

        };


        console.log(
          "DASHBOARD:",
          this.dashboard
        );

      } catch (error) {

        console.error(
          "Error dashboard:",
          error
        );


        this.errorDashboard =
          "No se pudo cargar el resumen del sistema.";

      } finally {

        this.cargandoDashboard = false;

      }

    },


    // ======================================
    // GRÁFICO
    // ======================================

    calcularAlturaBarra(cantidad) {

      const valores =
        this.dashboard.ordenesPorMes
          ?.map(
            mes => Number(
              mes.cantidad || 0
            )
          )
        || [];


      const maximo =
        Math.max(
          ...valores,
          1
        );


      const valorActual =
        Number(
          cantidad || 0
        );


      if (valorActual === 0) {

        return "3%";

      }


      const porcentaje =
        (
          valorActual
          /
          maximo
        )
        * 100;


      return `${Math.max(
        porcentaje,
        5
      )}%`;

    },


    // ======================================
    // MESES
    // ======================================

    formatearMes(mes) {

      if (!mes) {
        return "";
      }


      return String(mes)
        .replace(".", "")
        .substring(0, 3)
        .toUpperCase();

    },


    // ======================================
    // FECHAS
    // ======================================

    formatearFecha(fecha) {

      if (!fecha) {
        return "";
      }


      const fechaObjeto =
        new Date(fecha);


      if (
        Number.isNaN(
          fechaObjeto.getTime()
        )
      ) {

        return "";

      }


      return fechaObjeto
        .toLocaleDateString(
          "es-EC",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }
        );

    },


    // ======================================
    // HORAS
    // ======================================

    formatearHora(hora) {

      if (!hora) {
        return "";
      }


      return String(hora)
        .substring(
          0,
          5
        );

    },


    // ======================================
    // UNIDAD DE MEDIDA
    // ======================================

    formatearUnidad(unidad) {

      const unidades = {

        GALON: "gal",

        BOTELLA: "bot.",

        LITRO: "L",

        CAJA: "caja",

        UNIDAD: "und.",

        FRASCO: "frasco",

        GR: "g",

        KG: "kg",

        ML: "ml",

        PAQUETE: "paq."

      };


      return (
        unidades[unidad]
        ||
        unidad
        ||
        ""
      );

    },


    // ======================================
    // COLORES DE ESTADO
    // ======================================

    claseEstado(estado) {

      if (!estado) {

        return "bg-secondary";

      }


      const valor =
        String(estado)
          .toLowerCase();


      if (
        valor === "finalizada"
        ||
        valor === "finalizado"
        ||
        valor === "completada"
        ||
        valor === "completado"
      ) {

        return "bg-success";

      }


      if (
        valor === "pendiente"
      ) {

        return "bg-warning text-dark";

      }


      if (
        valor === "cancelada"
        ||
        valor === "cancelado"
        ||
        valor === "anulada"
        ||
        valor === "anulado"
      ) {

        return "bg-danger";

      }


      if (
        valor === "en proceso"
        ||
        valor === "proceso"
      ) {

        return "bg-info text-dark";

      }


      return "bg-primary";

    },


    // ======================================
    // NAVEGACIÓN
    // ======================================

    redirigir(ruta) {

      router.push({
        path: ruta
      });

    }

  }

};
</script>


<style scoped>
/* ====================================== */
/* GENERAL */
/* ====================================== */

.page-container {

  display: flex;

  flex-direction: column;

  min-height: 100vh;

}


/* ====================================== */
/* TARJETAS PRINCIPALES */
/* ====================================== */

.dashboard-card {

  min-height: 135px;

  padding: 22px;

  background: white;

  border-radius: 18px;

  border: 1px solid #e6eaf0;

  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.08);

  display: flex;

  align-items: center;

  gap: 20px;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

}


.dashboard-card:hover {

  transform:
    translateY(-5px);

  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.14);

}


.dashboard-icon {

  width: 65px;

  height: 65px;

  min-width: 65px;

  border-radius: 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 1.8rem;

}


.dashboard-label {

  margin:
    0 0 5px 0;

  color:
    #6c757d;

  font-size:
    0.95rem;

  font-weight:
    600;

}


.dashboard-value {

  margin:
    0;

  color:
    #132333;

  font-weight:
    700;

  font-size:
    2rem;

}


/* ====================================== */
/* COLORES */
/* ====================================== */

.icon-blue {

  color:
    #0d6efd;

  background-color:
    rgba(13, 110, 253, 0.12);

}


.icon-orange {

  color:
    #fd7e14;

  background-color:
    rgba(253, 126, 20, 0.12);

}


.icon-purple {

  color:
    #6f42c1;

  background-color:
    rgba(111, 66, 193, 0.12);

}


.icon-red {

  color:
    #dc3545;

  background-color:
    rgba(220, 53, 69, 0.12);

}


.icon-green {

  color:
    #198754;

  background-color:
    rgba(25, 135, 84, 0.12);

}


.icon-yellow {

  color:
    #d39e00;

  background-color:
    rgba(255, 193, 7, 0.18);

}


.stock-alert {

  border-left:
    5px solid #ffc107;

}


/* ====================================== */
/* PANELES */
/* ====================================== */

.dashboard-panel {

  background:
    white;

  border-radius:
    18px;

  padding:
    24px;

  height:
    100%;

  border:
    1px solid #e5e9f0;

  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.08);

}


.panel-header {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-bottom:
    24px;

}


.panel-header h4 {

  margin:
    0;

  color:
    #132333;

  font-weight:
    700;

}


.panel-header p {

  margin:
    3px 0 0;

  color:
    #6c757d;

  font-size:
    0.9rem;

}


.panel-icon {

  font-size:
    1.6rem;

  color:
    #0d6efd;

}


.panel-icon.warning {

  color:
    #dc9b00;

}


/* ====================================== */
/* GRÁFICO */
/* ====================================== */

.chart-container {

  height:
    260px;

  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

  gap:
    8px;

}


.chart-column {

  flex:
    1;

  height:
    100%;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

}


.chart-value {

  height:
    24px;

  font-size:
    0.8rem;

  font-weight:
    700;

  color:
    #495057;

}


.bar-wrapper {

  flex:
    1;

  width:
    70%;

  display:
    flex;

  align-items:
    flex-end;

}


.bar {

  width:
    100%;

  min-height:
    4px;

  border-radius:
    6px 6px 0 0;

  background:
    linear-gradient(to top,
      #004080,
      #76a5f7);

  transition:
    height 0.4s ease;

}


.chart-label {

  margin-top:
    8px;

  font-size:
    0.72rem;

  color:
    #6c757d;

}


/* ====================================== */
/* STOCK */
/* ====================================== */

.stock-badge {

  display:
    inline-block;

  background:
    #fff3cd;

  color:
    #856404;

  border-radius:
    20px;

  padding:
    5px 12px;

  font-weight:
    700;

  white-space:
    nowrap;

}


/* ====================================== */
/* ESTADO VACÍO */
/* ====================================== */

.empty-state {

  min-height:
    160px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  color:
    #6c757d;

  text-align:
    center;

}


.empty-state i {

  font-size:
    2rem;

  margin-bottom:
    10px;

  color:
    #198754;

}


.empty-state p {

  margin:
    0;

}


/* ====================================== */
/* TABLAS */
/* ====================================== */

.dashboard-panel table {

  margin-bottom:
    0;

}


.dashboard-panel table th {

  color:
    #495057;

  font-size:
    0.85rem;

  font-weight:
    700;

  border-top:
    none;

  white-space:
    nowrap;

}


.dashboard-panel table td {

  font-size:
    0.9rem;

  vertical-align:
    middle;

}


/* ====================================== */
/* ACCESOS RÁPIDOS */
/* ====================================== */

.section-title {

  border-bottom:
    1px solid #dee2e6;

  padding-bottom:
    12px;

}


.section-title h3 {

  color:
    #132333;

  font-weight:
    700;

}


.module-card {

  transition:
    transform 0.3s,
    box-shadow 0.3s;

  border-radius:
    18px;

  border:
    none;

  background:
    linear-gradient(to bottom,
      #ffffff,
      #f4f8ff);

  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.10);

  cursor:
    pointer;

  width:
    100%;

  height:
    210px;

}


.module-card:hover {

  transform:
    translateY(-7px);

  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.18);

}


.module-icon {

  font-size:
    3rem;

  color:
    #007bff;

}


.icon-container {

  width:
    75px;

  height:
    75px;

  background:
    rgba(0, 123, 255, 0.08);

  border-radius:
    50%;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

}


.card-title {

  color:
    #132333;

  font-weight:
    600;

}


/* ====================================== */
/* BOTÓN */
/* ====================================== */

.btn-gradient {

  background:
    linear-gradient(to right,
      #4e79a7,
      #76a5f7);

  color:
    #ffffff;

  border:
    none;

  transition:
    background 0.3s ease;

  border-radius:
    30px;

}


.btn-gradient:hover {

  background:
    linear-gradient(to right,
      #3a5b80,
      #5d8ce6);

  color:
    white;

}

/* ====================================== */
/* DASHBOARD GERENCIAL */
/* ====================================== */

.executive-section {
  padding: 22px 24px 24px;
  background:
    linear-gradient(
      135deg,
      #071f35 0%,
      #0a3d64 100%
    );
  border-radius: 24px;
  box-shadow:
    0 18px 40px
    rgba(7, 31, 53, 0.16);
}


.executive-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}


.executive-heading h2 {
  margin: 4px 0;
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 750;
}


.executive-heading p {
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
}


.section-eyebrow {
  display: block;
  margin-bottom: 5px;
  color: #4fa7df;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}


.executive-section .section-eyebrow {
  color: #8cc9ed;
}


.finance-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 15px;
  border:
    1px solid
    rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background:
    rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}


.finance-link:hover {
  background:
    rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}


.financial-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 14px;
}


.financial-card {
  min-width: 0;
padding: 17px 18px;
  border:
    1px solid
    rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background:
    rgba(255, 255, 255, 0.96);
}


.financial-card-warning {
  border-color:
    rgba(245, 158, 11, 0.45);
}


.financial-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
margin-bottom: 12px;
}


.financial-icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}


.financial-blue {
  color: #0d6efd;
  background: #eaf2ff;
}


.financial-purple {
  color: #6f42c1;
  background: #f1eafe;
}


.financial-green {
  color: #198754;
  background: #e8f6ee;
}


.financial-orange {
  color: #d97706;
  background: #fff4df;
}


.financial-tag {
  padding: 4px 8px;
  border-radius: 20px;
  background: #f1f4f7;
  color: #718096;
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
}


.financial-label {
  margin: 0 0 3px;
  color: #667085;
  font-size: 0.82rem;
  font-weight: 650;
}


.financial-card h3 {
  margin: 0 0 5px;
  color: #102a43;
  font-size: 1.45rem;
  font-weight: 800;
}


.financial-help {
  color: #98a2b3;
  font-size: 0.72rem;
}


.cashflow-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}


.cashflow-card {
  display: flex;
  align-items: center;
  gap: 16px;
padding: 14px 18px;
  border:
    1px solid
    rgba(255, 255, 255, 0.13);
  border-radius: 14px;
  background:
    rgba(255, 255, 255, 0.08);
  color: #ffffff;
}


.cashflow-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background:
    rgba(255, 255, 255, 0.11);
}


.cashflow-content {
  display: flex;
  flex-direction: column;
}


.cashflow-content span {
  color:
    rgba(255, 255, 255, 0.68);
  font-size: 0.76rem;
  font-weight: 600;
}


.cashflow-content strong {
  margin: 1px 0;
  font-size: 1.25rem;
  font-weight: 800;
}


.cashflow-content small {
  color:
    rgba(255, 255, 255, 0.56);
}


.financial-positive {
  border-color:
    rgba(74, 222, 128, 0.45);
}


.financial-negative {
  border-color:
    rgba(248, 113, 113, 0.55);
}


.financial-neutral {
  border-color:
    rgba(255, 255, 255, 0.13);
}
/* ====================================== */
/* RESUMEN OPERATIVO */
/* ====================================== */

.operation-summary {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf0f4;
}

.operation-stat {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid #edf0f4;
  border-radius: 11px;
  background: #fafbfd;
}

.operation-stat-icon {
  width: 34px;
  height: 34px;
  min-width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #eaf4fb;
  color: #0d6efd;
  font-size: 0.8rem;
}

.operation-stat div {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.operation-stat small {
  color: #8492a3;
  font-size: 0.67rem;
  font-weight: 650;
}

.operation-stat strong {
  color: #16324a;
  font-size: 0.95rem;
  font-weight: 800;
}

.operation-stat span:not(.operation-stat-icon) {
  color: #8492a3;
  font-size: 0.67rem;
}
/* ====================================== */
/* ESTADO DEL FLUJO */
/* ====================================== */

.cashflow-main.financial-negative
.cashflow-content strong {
  color: #ffb4b4;
}

.cashflow-main.financial-positive
.cashflow-content strong {
  color: #9be7b0;
}

.cashflow-separator {
  margin: 0 5px;
  opacity: 0.55;
}

/* ====================================== */
/* SECTION HEADING */
/* ====================================== */

.section-heading h3 {
  margin: 0;
  color: #132333;
  font-weight: 750;
}


.section-heading p {
  margin: 3px 0 0;
  color: #7b8794;
  font-size: 0.88rem;
}


/* ====================================== */
/* ALERTAS */
/* ====================================== */

.alerts-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 12px;
}


.alert-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  border: 1px solid #e7ebf0;
  border-radius: 13px;
  background: #fbfcfd;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}


.alert-item:hover {
  transform: translateY(-2px);
  border-color: #cdd8e4;
  box-shadow:
    0 8px 18px
    rgba(15, 23, 42, 0.07);
}


.alert-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
}


.alert-orange {
  color: #d97706;
  background: #fff3df;
}


.alert-red {
  color: #dc3545;
  background: #fdebec;
}


.alert-yellow {
  color: #b58100;
  background: #fff6d8;
}


.alert-content {
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
}


.alert-content strong {
  color: #243b53;
  font-size: 0.84rem;
}


.alert-content small {
  margin-top: 2px;
  color: #8291a2;
  font-size: 0.72rem;
}


.alert-arrow {
  color: #a8b2bd;
  font-size: 0.7rem;
}


.alert-danger-item {
  border-color: #f2c5c9;
}


.alert-warning-item {
  border-color: #f0d99c;
}
/* ====================================== */
/* RESPONSIVE */
/* ====================================== */

@media (max-width: 992px) {

  .chart-container {
    height: 230px;
  }

  .financial-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .alerts-grid {
    grid-template-columns: 1fr;
  }
}


@media (max-width: 768px) {

  .dashboard-card {

    min-height:
      120px;

  }


  .dashboard-value {

    font-size:
      1.7rem;

  }


  .module-card {

    height:
      190px;

  }


  .chart-container {

    height:
      210px;

    gap:
      4px;

  }


  .chart-label {

    font-size:
      0.62rem;

  }


  .dashboard-panel {

    padding:
      18px;

  }

}


@media (max-width: 576px) {

  .dashboard-icon {

    width:
      55px;

    height:
      55px;

    min-width:
      55px;

    font-size:
      1.4rem;

  }


  .dashboard-label {

    font-size:
      0.82rem;

  }


  .dashboard-value {

    font-size:
      1.5rem;

  }


  .chart-container {

    overflow-x:
      auto;

    justify-content:
      flex-start;

  }


  .chart-column {

    min-width:
      35px;

  }
.executive-section {
  padding: 20px 16px;
  border-radius: 18px;
}

.executive-heading {
  flex-direction: column;
}

.finance-link {
  width: 100%;
  justify-content: center;
}

.financial-grid,
.cashflow-grid {
  grid-template-columns: 1fr;
}

.financial-card h3 {
  font-size: 1.35rem;
}
}
</style> 