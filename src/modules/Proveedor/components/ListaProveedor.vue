<template>
  <div class="suppliers-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>
        <span class="page-eyebrow">
          ABASTECIMIENTO
        </span>

        <h1>
          Proveedores
        </h1>

        <p>
          Administra los proveedores que abastecen productos
          y materiales utilizados por Fumidez.
        </p>
      </div>


      <button
        type="button"
        class="primary-button"
        @click="redirigirCrearProveedor"
      >
        <i class="bi bi-plus-lg"></i>
        Nuevo proveedor
      </button>

    </section>


    <!-- ===================================================== -->
    <!-- RESUMEN -->
    <!-- ===================================================== -->

    <section class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon blue">
          <i class="bi bi-truck"></i>
        </div>

        <div>
          <span>
            Proveedores registrados
          </span>

          <strong>
            {{ proveedores.length }}
          </strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon green">
          <i class="bi bi-geo-alt"></i>
        </div>

        <div>
          <span>
            Con dirección registrada
          </span>

          <strong>
            {{ proveedoresConDireccion }}
          </strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon purple">
          <i class="bi bi-credit-card"></i>
        </div>

        <div>
          <span>
            Con cuenta registrada
          </span>

          <strong>
            {{ proveedoresConCuenta }}
          </strong>
        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- MENSAJES -->
    <!-- ===================================================== -->

    <div
      v-if="mensajeExito"
      class="message success-message"
    >
      <i class="bi bi-check-circle-fill"></i>

      <span>
        {{ mensajeExito }}
      </span>
    </div>


    <div
      v-if="mensajeError"
      class="message error-message"
    >
      <i class="bi bi-exclamation-circle-fill"></i>

      <span>
        {{ mensajeError }}
      </span>

      <button
        type="button"
        @click="cargarProveedores"
      >
        Reintentar
      </button>
    </div>


    <!-- ===================================================== -->
    <!-- PANEL -->
    <!-- ===================================================== -->

    <section class="suppliers-panel">

      <div class="panel-header">

        <div>
          <h2>
            Directorio de proveedores
          </h2>

          <p>
            {{ proveedoresFiltrados.length }}
            {{
              proveedoresFiltrados.length === 1
                ? "proveedor encontrado"
                : "proveedores encontrados"
            }}
          </p>
        </div>


        <button
          type="button"
          class="refresh-button"
          :disabled="cargando"
          @click="cargarProveedores"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ rotating: cargando }"
          ></i>

          Actualizar
        </button>

      </div>


      <!-- ================================================= -->
      <!-- BÚSQUEDA -->
      <!-- ================================================= -->

      <div class="filters">

        <div class="search-box">

          <i class="bi bi-search"></i>

          <input
            v-model.trim="filtro"
            type="text"
            placeholder="Buscar por nombre, dirección o cuenta..."
          />

          <button
            v-if="filtro"
            type="button"
            class="clear-search"
            @click="filtro = ''"
          >
            <i class="bi bi-x"></i>
          </button>

        </div>


        <button
          v-if="filtro"
          type="button"
          class="clear-filters-button"
          @click="filtro = ''"
        >
          <i class="bi bi-funnel"></i>
          Limpiar búsqueda
        </button>

      </div>


      <!-- ================================================= -->
      <!-- CARGANDO -->
      <!-- ================================================= -->

      <div
        v-if="cargando"
        class="loading-state"
      >

        <div class="spinner-border text-primary"></div>

        <span>
          Cargando proveedores...
        </span>

      </div>


      <!-- ================================================= -->
      <!-- SIN RESULTADOS -->
      <!-- ================================================= -->

      <div
        v-else-if="proveedoresFiltrados.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          <i class="bi bi-truck"></i>
        </div>


        <h3>
          {{
            proveedores.length === 0
              ? "No hay proveedores registrados"
              : "No encontramos proveedores"
          }}
        </h3>


        <p>
          {{
            proveedores.length === 0
              ? "Registra el primer proveedor para comenzar a gestionar el abastecimiento."
              : "Prueba utilizando otro nombre, dirección o número de cuenta."
          }}
        </p>


        <button
          v-if="proveedores.length === 0"
          type="button"
          class="primary-button"
          @click="redirigirCrearProveedor"
        >
          <i class="bi bi-plus-lg"></i>

          Crear proveedor
        </button>


        <button
          v-else
          type="button"
          class="secondary-button"
          @click="filtro = ''"
        >
          Limpiar búsqueda
        </button>

      </div>


      <!-- ================================================= -->
      <!-- TABLA -->
      <!-- ================================================= -->

      <template v-else>

        <div class="table-wrapper">

          <table class="suppliers-table">

            <thead>

              <tr>

                <th class="id-column">
                  #
                </th>


                <th
                  class="sortable"
                  @click="ordenar('nombre')"
                >
                  Proveedor

                  <i
                    :class="iconoOrden('nombre')"
                  ></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('direccion')"
                >
                  Dirección

                  <i
                    :class="iconoOrden('direccion')"
                  ></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('n_cuenta')"
                >
                  Cuenta

                  <i
                    :class="iconoOrden('n_cuenta')"
                  ></i>
                </th>


                <th class="actions-column">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(proveedor, index) in proveedoresPaginados"
                :key="proveedor.id"
              >

                <!-- NÚMERO -->

                <td class="row-number">
                  {{ indiceInicial + index + 1 }}
                </td>


                <!-- PROVEEDOR -->

                <td>

                  <div class="supplier-info">

                    <div class="supplier-avatar">
                      {{
                        obtenerIniciales(
                          proveedor.nombre
                        )
                      }}
                    </div>


                    <div>

                      <strong>
                        {{ proveedor.nombre }}
                      </strong>

                      <span>
                        ID {{ proveedor.id }}
                      </span>

                    </div>

                  </div>

                </td>


                <!-- DIRECCIÓN -->

                <td>

                  <div class="address-cell">

                    <i class="bi bi-geo-alt"></i>

                    <span>
                      {{
                        proveedor.direccion
                        ||
                        "Sin dirección registrada"
                      }}
                    </span>

                  </div>

                </td>


                <!-- CUENTA -->

                <td>

                  <div class="account-cell">

                    <i class="bi bi-credit-card"></i>

                    <span>
                      {{
                        ocultarCuenta(
                          proveedor.n_cuenta
                        )
                      }}
                    </span>

                  </div>

                </td>


                <!-- ACCIONES -->

                <td>

                  <div class="actions">

                    <button
                      type="button"
                      class="action-button edit"
                      title="Ver / editar proveedor"
                      @click="editarProveedor(proveedor.id)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>


                    <button
                      type="button"
                      class="action-button delete"
                      title="Eliminar proveedor"
                      @click="solicitarEliminar(proveedor)"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <!-- ================================================= -->
        <!-- PAGINACIÓN -->
        <!-- ================================================= -->

        <div class="table-footer">

          <div class="page-size">

            <span>
              Mostrar
            </span>


            <select
              v-model.number="proveedoresPorPagina"
              @change="paginaActual = 1"
            >

              <option :value="5">
                5
              </option>

              <option :value="10">
                10
              </option>

              <option :value="20">
                20
              </option>

            </select>


            <span>
              por página
            </span>

          </div>


          <div class="pagination-info">

            Mostrando

            <strong>
              {{ indiceInicial + 1 }}
            </strong>

            -

            <strong>
              {{ indiceFinal }}
            </strong>

            de

            <strong>
              {{ proveedoresFiltrados.length }}
            </strong>

          </div>


          <div class="pagination">

            <button
              type="button"
              :disabled="paginaActual === 1"
              @click="cambiarPagina(paginaActual - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>


            <span>
              Página
              <strong>
                {{ paginaActual }}
              </strong>
              de
              <strong>
                {{ totalPaginas }}
              </strong>
            </span>


            <button
              type="button"
              :disabled="paginaActual === totalPaginas"
              @click="cambiarPagina(paginaActual + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>

          </div>

        </div>

      </template>

    </section>


    <!-- ===================================================== -->
    <!-- MODAL ELIMINAR -->
    <!-- ===================================================== -->

    <div
      v-if="proveedorAEliminar"
      class="modal-backdrop-custom"
      @click.self="cancelarEliminar"
    >

      <div class="delete-modal">

        <div class="delete-icon">
          <i class="bi bi-trash3"></i>
        </div>


        <h3>
          ¿Eliminar proveedor?
        </h3>


        <p>
          Está a punto de eliminar a
          <strong>
            {{ proveedorAEliminar.nombre }}
          </strong>.
        </p>


        <span class="delete-warning">
          Esta acción no se puede deshacer.
        </span>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-button"
            :disabled="eliminando"
            @click="cancelarEliminar"
          >
            Cancelar
          </button>


          <button
            type="button"
            class="danger-button"
            :disabled="eliminando"
            @click="confirmarEliminar"
          >

            <span
              v-if="eliminando"
              class="spinner-border spinner-border-sm"
            ></span>


            <i
              v-else
              class="bi bi-trash3"
            ></i>


            {{
              eliminando
                ? "Eliminando..."
                : "Eliminar"
            }}

          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script>
import {
  obtenerTodosLosProveedorsFachada,
  eliminarProveedorFachada
} from "../helpers/proveedoresHelpers";


export default {

  name: "ListarProveedor",


  data() {

    return {

      proveedores: [],

      filtro: "",

      paginaActual: 1,

      proveedoresPorPagina: 10,

      columnaOrdenada: "nombre",

      ordenAscendente: true,

      cargando: false,

      eliminando: false,

      mensajeExito: "",

      mensajeError: "",

      proveedorAEliminar: null

    };

  },


  computed: {

    // =====================================================
    // RESUMEN
    // =====================================================

    proveedoresConDireccion() {

      return this.proveedores.filter(
        proveedor =>
          proveedor.direccion
          &&
          String(proveedor.direccion).trim()
      ).length;

    },


    proveedoresConCuenta() {

      return this.proveedores.filter(
        proveedor =>
          proveedor.n_cuenta
          &&
          String(proveedor.n_cuenta).trim()
      ).length;

    },


    // =====================================================
    // FILTRO
    // =====================================================

    proveedoresFiltrados() {

      const texto =
        this.normalizarTexto(
          this.filtro
        );


      if (!texto) {

        return this.proveedores;

      }


      return this.proveedores.filter(
        proveedor => {

          const contenido =
            this.normalizarTexto(
              [
                proveedor.nombre,
                proveedor.direccion,
                proveedor.n_cuenta
              ]
                .filter(Boolean)
                .join(" ")
            );


          return contenido.includes(
            texto
          );

        }
      );

    },


    // =====================================================
    // ORDENAMIENTO
    // =====================================================

    proveedoresOrdenados() {

      const lista =
        [...this.proveedoresFiltrados];


      if (!this.columnaOrdenada) {

        return lista;

      }


      return lista.sort(
        (a, b) => {

          let valorA =
            a[this.columnaOrdenada];

          let valorB =
            b[this.columnaOrdenada];


          if (
            this.columnaOrdenada === "id"
          ) {

            valorA =
              Number(valorA || 0);

            valorB =
              Number(valorB || 0);

          } else {

            valorA =
              this.normalizarTexto(
                valorA
              );

            valorB =
              this.normalizarTexto(
                valorB
              );

          }


          if (valorA < valorB) {

            return this.ordenAscendente
              ? -1
              : 1;

          }


          if (valorA > valorB) {

            return this.ordenAscendente
              ? 1
              : -1;

          }


          return 0;

        }
      );

    },


    // =====================================================
    // PAGINACIÓN
    // =====================================================

    totalPaginas() {

      return Math.max(
        1,
        Math.ceil(
          this.proveedoresOrdenados.length
          /
          this.proveedoresPorPagina
        )
      );

    },


    indiceInicial() {

      return (
        (this.paginaActual - 1)
        *
        this.proveedoresPorPagina
      );

    },


    indiceFinal() {

      return Math.min(
        this.indiceInicial
        +
        this.proveedoresPorPagina,
        this.proveedoresFiltrados.length
      );

    },


    proveedoresPaginados() {

      return this.proveedoresOrdenados.slice(
        this.indiceInicial,
        this.indiceFinal
      );

    }

  },


  watch: {

    filtro() {

      this.paginaActual = 1;

    },


    totalPaginas(nuevoTotal) {

      if (
        this.paginaActual > nuevoTotal
      ) {

        this.paginaActual =
          nuevoTotal;

      }

    }

  },


  mounted() {

    this.cargarProveedores();

  },


  methods: {

    // =====================================================
    // CARGAR
    // =====================================================

    async cargarProveedores() {

      this.cargando =
        true;

      this.mensajeError =
        "";


      try {

        const response =
          await obtenerTodosLosProveedorsFachada();


        this.proveedores =
          Array.isArray(response)
            ? response
            : [];


      } catch (error) {

        console.error(
          "Error al cargar proveedores:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el directorio de proveedores.";

      } finally {

        this.cargando =
          false;

      }

    },


    // =====================================================
    // CUENTA
    // =====================================================

    ocultarCuenta(cuenta) {

      if (!cuenta) {

        return "Sin cuenta registrada";

      }


      const texto =
        String(cuenta)
          .replace(/\s/g, "");


      if (texto.length <= 4) {

        return texto;

      }


      const ultimos =
        texto.slice(-4);


      return `•••• •••• ${ultimos}`;

    },


    // =====================================================
    // INICIALES
    // =====================================================

    obtenerIniciales(nombre) {

      if (!nombre) {

        return "PR";

      }


      return String(nombre)
        .trim()
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
    // TEXTO
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
    // ORDENAR
    // =====================================================

    ordenar(columna) {

      if (
        this.columnaOrdenada === columna
      ) {

        this.ordenAscendente =
          !this.ordenAscendente;

      } else {

        this.columnaOrdenada =
          columna;

        this.ordenAscendente =
          true;

      }

    },


    iconoOrden(columna) {

      if (
        this.columnaOrdenada !== columna
      ) {

        return "bi bi-arrow-down-up sort-neutral";

      }


      return this.ordenAscendente
        ? "bi bi-arrow-up sort-active"
        : "bi bi-arrow-down sort-active";

    },


    // =====================================================
    // PAGINACIÓN
    // =====================================================

    cambiarPagina(nuevaPagina) {

      if (
        nuevaPagina >= 1
        &&
        nuevaPagina <= this.totalPaginas
      ) {

        this.paginaActual =
          nuevaPagina;

      }

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirCrearProveedor() {

      this.$router.push(
        "/proveedor_registrar"
      );

    },


    editarProveedor(id) {

      this.$router.push(
        `/proveedor_ver/${id}`
      );

    },


    // =====================================================
    // ELIMINAR
    // =====================================================

    solicitarEliminar(proveedor) {

      this.proveedorAEliminar =
        proveedor;

    },


    cancelarEliminar() {

      if (this.eliminando) {

        return;

      }


      this.proveedorAEliminar =
        null;

    },


    async confirmarEliminar() {

      if (
        !this.proveedorAEliminar
      ) {

        return;

      }


      this.eliminando =
        true;

      this.mensajeError =
        "";


      try {

        const nombre =
          this.proveedorAEliminar.nombre;


        await eliminarProveedorFachada(
          this.proveedorAEliminar.id
        );


        this.proveedorAEliminar =
          null;


        this.mensajeExito =
          `Proveedor "${nombre}" eliminado correctamente.`;


        await this.cargarProveedores();


        setTimeout(
          () => {

            this.mensajeExito =
              "";

          },
          4000
        );


      } catch (error) {

        console.error(
          "Error eliminando proveedor:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar el proveedor. Puede estar relacionado con productos existentes.";

      } finally {

        this.eliminando =
          false;

      }

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.suppliers-page {
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
  max-width: 1450px;

  margin: 0 auto 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 28px 30px;

  border: 1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);
}


.page-eyebrow {
  display: block;

  margin-bottom: 5px;

  color: #2563eb;

  font-size: 0.68rem;

  font-weight: 800;

  letter-spacing: 0.15em;
}


.page-header h1 {
  margin: 0;

  color: #123b6d;

  font-size: 2rem;

  font-weight: 800;
}


.page-header p {
  max-width: 680px;

  margin: 7px 0 0;

  color: #64748b;

  font-size: 0.87rem;

  line-height: 1.55;
}


/* ========================================================= */
/* BOTONES */
/* ========================================================= */

.primary-button,
.secondary-button,
.danger-button,
.refresh-button {
  min-height: 42px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 15px;

  border-radius: 10px;

  font-size: 0.76rem;

  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.primary-button {
  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;
}


.primary-button:hover {
  background: #1d4ed8;

  transform: translateY(-1px);
}


.secondary-button {
  border: 1px solid #d8e0ea;

  background: #ffffff;

  color: #475569;
}


.danger-button {
  border: 1px solid #dc2626;

  background: #dc2626;

  color: #ffffff;
}


/* ========================================================= */
/* RESUMEN */
/* ========================================================= */

.summary-grid {
  max-width: 1450px;

  margin: 0 auto 22px;

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 14px;
}


.summary-card {
  min-height: 105px;

  display: flex;
  align-items: center;

  gap: 14px;

  padding: 20px;

  border: 1px solid #e2e8f0;

  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 6px 18px
    rgba(15, 23, 42, 0.04);
}


.summary-icon {
  width: 52px;
  height: 52px;

  min-width: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  font-size: 1.25rem;
}


.summary-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}


.summary-icon.green {
  background: #ecfdf3;
  color: #16a34a;
}


.summary-icon.purple {
  background: #f5f3ff;
  color: #7c3aed;
}


.summary-card span {
  display: block;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 600;
}


.summary-card strong {
  display: block;

  margin-top: 2px;

  color: #172033;

  font-size: 1.5rem;

  font-weight: 800;
}


/* ========================================================= */
/* PANEL */
/* ========================================================= */

.suppliers-panel {
  max-width: 1450px;

  margin: 0 auto;

  padding: 25px;

  border: 1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);
}


.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 18px;
}


.panel-header h2 {
  margin: 0;

  color: #172033;

  font-size: 1.15rem;

  font-weight: 800;
}


.panel-header p {
  margin: 4px 0 0;

  color: #94a3b8;

  font-size: 0.72rem;
}


.refresh-button {
  border: 1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;
}


/* ========================================================= */
/* FILTROS */
/* ========================================================= */

.filters {
  display: grid;

  grid-template-columns:
    minmax(260px, 1fr)
    auto;

  gap: 10px;

  margin-bottom: 20px;
}


.search-box {
  position: relative;
}


.search-box > i {
  position: absolute;

  top: 50%;
  left: 14px;

  transform: translateY(-50%);

  color: #94a3b8;
}


.search-box input {
  width: 100%;
  height: 43px;

  padding: 0 42px 0 40px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  color: #334155;

  outline: none;

  font-size: 0.78rem;
}


.search-box input:focus {
  border-color: #93b4ed;

  background: #ffffff;

  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.06);
}


.clear-search {
  position: absolute;

  top: 50%;
  right: 7px;

  width: 29px;
  height: 29px;

  transform: translateY(-50%);

  border: none;

  border-radius: 7px;

  background: transparent;

  color: #94a3b8;
}


.clear-filters-button {
  min-height: 43px;

  padding: 0 13px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 700;
}


/* ========================================================= */
/* TABLA */
/* ========================================================= */

.table-wrapper {
  overflow-x: auto;

  border: 1px solid #e8edf3;

  border-radius: 13px;
}


.suppliers-table {
  width: 100%;

  min-width: 850px;

  border-collapse: collapse;
}


.suppliers-table th {
  padding: 13px 14px;

  border-bottom: 1px solid #dde5ee;

  background: #f3f7fc;

  color: #53657c;

  font-size: 0.66rem;

  font-weight: 800;

  text-align: left;

  text-transform: uppercase;

  letter-spacing: 0.025em;

  white-space: nowrap;
}


.suppliers-table td {
  padding: 14px;

  border-bottom: 1px solid #edf1f5;

  color: #475569;

  font-size: 0.76rem;

  vertical-align: middle;
}


.suppliers-table tbody tr:last-child td {
  border-bottom: none;
}


.suppliers-table tbody tr:hover {
  background: #fafcff;
}


.sortable {
  cursor: pointer;

  user-select: none;
}


.sortable i {
  margin-left: 5px;
}


.sort-neutral {
  color: #cbd5e1;
}


.sort-active {
  color: #2563eb;
}


.id-column {
  width: 55px;
}


.actions-column {
  width: 110px;

  text-align: center !important;
}


.row-number {
  color: #94a3b8 !important;

  font-weight: 700;
}


/* ========================================================= */
/* PROVEEDOR */
/* ========================================================= */

.supplier-info {
  display: flex;

  align-items: center;

  gap: 10px;
}


.supplier-avatar {
  width: 39px;
  height: 39px;

  min-width: 39px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #eff6ff,
      #dbeafe
    );

  color: #2563eb;

  font-size: 0.67rem;

  font-weight: 900;
}


.supplier-info strong {
  display: block;

  color: #25364d;

  font-size: 0.79rem;

  font-weight: 800;
}


.supplier-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.59rem;
}


.address-cell,
.account-cell {
  display: flex;

  align-items: center;

  gap: 7px;
}


.address-cell i,
.account-cell i {
  color: #94a3b8;
}


.account-cell span {
  font-family: monospace;

  color: #475569;

  letter-spacing: 0.03em;
}


/* ========================================================= */
/* ACCIONES */
/* ========================================================= */

.actions {
  display: flex;

  justify-content: center;

  gap: 7px;
}


.action-button {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #ffffff;

  cursor: pointer;
}


.action-button.edit {
  border: 1px solid #bfdbfe;

  color: #2563eb;
}


.action-button.edit:hover {
  background: #eff6ff;
}


.action-button.delete {
  border: 1px solid #fecaca;

  color: #dc2626;
}


.action-button.delete:hover {
  background: #fef2f2;
}


/* ========================================================= */
/* PAGINACIÓN */
/* ========================================================= */

.table-footer {
  display: grid;

  grid-template-columns:
    1fr auto 1fr;

  align-items: center;

  gap: 15px;

  margin-top: 18px;
}


.page-size {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #64748b;

  font-size: 0.69rem;
}


.page-size select {
  height: 34px;

  padding: 0 7px;

  border: 1px solid #dce4ee;

  border-radius: 8px;

  background: #ffffff;
}


.pagination-info {
  color: #64748b;

  font-size: 0.69rem;
}


.pagination {
  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 10px;

  color: #64748b;

  font-size: 0.69rem;
}


.pagination button {
  width: 34px;
  height: 34px;

  border: 1px solid #dce4ee;

  border-radius: 8px;

  background: #ffffff;

  color: #475569;
}


.pagination button:disabled {
  opacity: 0.4;

  cursor: not-allowed;
}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.message {
  max-width: 1450px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 12px 15px;

  border-radius: 11px;

  font-size: 0.75rem;

  font-weight: 600;
}


.message span {
  flex: 1;
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


.error-message button {
  border: none;

  background: transparent;

  color: #b91c1c;

  font-weight: 800;
}


/* ========================================================= */
/* EMPTY / LOADING */
/* ========================================================= */

.loading-state,
.empty-state {
  min-height: 280px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  text-align: center;
}


.loading-state {
  color: #64748b;

  font-size: 0.76rem;
}


.empty-icon {
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 1.4rem;
}


.empty-state h3 {
  margin: 0;

  color: #334155;

  font-size: 0.95rem;
}


.empty-state p {
  max-width: 470px;

  margin: 0 0 5px;

  color: #64748b;

  font-size: 0.74rem;
}


/* ========================================================= */
/* MODAL ELIMINAR */
/* ========================================================= */

.modal-backdrop-custom {
  position: fixed;

  inset: 0;

  z-index: 5000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(15, 23, 42, 0.58);

  backdrop-filter: blur(4px);
}


.delete-modal {
  width: 100%;

  max-width: 420px;

  padding: 28px;

  border-radius: 18px;

  background: #ffffff;

  text-align: center;

  box-shadow:
    0 25px 70px
    rgba(15, 23, 42, 0.25);
}


.delete-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: 0 auto 14px;

  border-radius: 50%;

  background: #fef2f2;

  color: #dc2626;

  font-size: 1.4rem;
}


.delete-modal h3 {
  margin: 0;

  color: #172033;

  font-size: 1.05rem;

  font-weight: 800;
}


.delete-modal p {
  margin: 10px 0 4px;

  color: #64748b;

  font-size: 0.78rem;
}


.delete-warning {
  display: block;

  color: #dc2626;

  font-size: 0.68rem;

  font-weight: 700;
}


.modal-actions {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-top: 22px;
}


/* ========================================================= */
/* ANIMACIÓN */
/* ========================================================= */

.rotating {
  animation: rotation 1s linear infinite;
}


@keyframes rotation {

  to {
    transform: rotate(360deg);
  }

}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 900px) {

  .summary-grid {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 700px) {

  .suppliers-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;

    padding: 22px;
  }


  .page-header .primary-button {
    width: 100%;
  }


  .filters {
    grid-template-columns: 1fr;
  }


  .table-footer {
    grid-template-columns: 1fr;

    justify-items: center;
  }


  .pagination {
    justify-content: center;
  }

}

</style>