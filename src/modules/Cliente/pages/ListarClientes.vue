<template>
  <div class="clients-page">

    <section class="page-header">
      <div>
        <span class="page-eyebrow">CLIENTES</span>

        <h1>Clientes</h1>

        <p>
          Administra la información de tus clientes,
          responsables de contacto y datos comerciales.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="redirigirCrearCliente"
      >
        <i class="bi bi-plus-lg"></i>
        Nuevo cliente
      </button>
    </section>


    <section class="summary-grid">

      <div class="summary-card">
        <div class="summary-icon blue">
          <i class="bi bi-building"></i>
        </div>

        <div>
          <span>Clientes registrados</span>
          <strong>{{ clientes.length }}</strong>
        </div>
      </div>


      <div class="summary-card">
        <div class="summary-icon green">
          <i class="bi bi-envelope-check"></i>
        </div>

        <div>
          <span>Con correo registrado</span>
          <strong>{{ clientesConCorreo }}</strong>
        </div>
      </div>


      <div class="summary-card">
        <div class="summary-icon purple">
          <i class="bi bi-person-badge"></i>
        </div>

        <div>
          <span>Con responsable asignado</span>
          <strong>{{ clientesConEncargado }}</strong>
        </div>
      </div>

    </section>


    <div
      v-if="mensajeExito"
      class="message success-message"
    >
      <i class="bi bi-check-circle-fill"></i>
      <span>{{ mensajeExito }}</span>
    </div>


    <div
      v-if="mensajeError"
      class="message error-message"
    >
      <i class="bi bi-exclamation-circle-fill"></i>
      <span>{{ mensajeError }}</span>

      <button
        type="button"
        @click="cargarClientes"
      >
        Reintentar
      </button>
    </div>


    <section class="clients-panel">

      <div class="panel-header">

        <div>
          <h2>Directorio de clientes</h2>

          <p>
            {{ clientesFiltrados.length }}
            {{
              clientesFiltrados.length === 1
                ? "cliente encontrado"
                : "clientes encontrados"
            }}
          </p>
        </div>


        <button
          type="button"
          class="refresh-button"
          :disabled="cargando"
          @click="cargarClientes"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ rotating: cargando }"
          ></i>

          Actualizar
        </button>
      </div>


      <div class="filters">

        <div class="search-box">

          <i class="bi bi-search"></i>

          <input
            v-model.trim="filtro"
            type="text"
            placeholder="Buscar por nombre, RUC, correo, encargado, teléfono o dirección..."
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

      </div>


      <div
        v-if="cargando"
        class="loading-state"
      >
        <div class="spinner-border text-primary"></div>
        <span>Cargando clientes...</span>
      </div>


      <div
        v-else-if="clientesFiltrados.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <i class="bi bi-building"></i>
        </div>

        <h3>
          {{
            clientes.length === 0
              ? "No hay clientes registrados"
              : "No encontramos clientes"
          }}
        </h3>

        <p>
          {{
            clientes.length === 0
              ? "Registra el primer cliente para comenzar a gestionar servicios y órdenes de trabajo."
              : "Prueba cambiando el texto de búsqueda."
          }}
        </p>

        <button
          v-if="clientes.length === 0"
          type="button"
          class="primary-button"
          @click="redirigirCrearCliente"
        >
          <i class="bi bi-plus-lg"></i>
          Crear cliente
        </button>
      </div>


      <template v-else>

        <div class="table-wrapper">

          <table class="clients-table">

            <thead>
              <tr>
                <th class="id-column">#</th>

                <th
                  class="sortable"
                  @click="ordenar('nombre')"
                >
                  Cliente
                  <i :class="iconoOrden('nombre')"></i>
                </th>

                <th
                  class="sortable"
                  @click="ordenar('personaEncargada')"
                >
                  Responsable
                  <i :class="iconoOrden('personaEncargada')"></i>
                </th>

                <th
                  class="sortable"
                  @click="ordenar('correo')"
                >
                  Contacto
                  <i :class="iconoOrden('correo')"></i>
                </th>

                <th
                  class="sortable"
                  @click="ordenar('direccion')"
                >
                  Dirección
                  <i :class="iconoOrden('direccion')"></i>
                </th>

                <th
                  class="sortable"
                  @click="ordenar('ruc')"
                >
                  RUC
                  <i :class="iconoOrden('ruc')"></i>
                </th>

                <th class="actions-column">
                  Acciones
                </th>
              </tr>
            </thead>


            <tbody>

              <tr
                v-for="(cliente, index) in clientesPaginados"
                :key="cliente.id"
              >

                <td class="row-number">
                  {{ indiceInicial + index + 1 }}
                </td>


                <td>

                  <div class="client-info">

                    <div class="client-avatar">
                      {{ obtenerIniciales(cliente.nombre) }}
                    </div>


                    <div>
                      <strong>
                        {{ cliente.nombre }}
                      </strong>

                      <span>
                        ID {{ cliente.id }}
                      </span>
                    </div>

                  </div>

                </td>


                <td>

                  <div class="contact-person">

                    <i class="bi bi-person"></i>

                    <span>
                      {{
                        cliente.personaEncargada
                        || "Sin responsable"
                      }}
                    </span>

                  </div>

                </td>


                <td>

                  <div class="contact-data">

                    <span>
                      <i class="bi bi-envelope"></i>
                      {{ cliente.correo || "Sin correo" }}
                    </span>

                    <span>
                      <i class="bi bi-telephone"></i>
                      {{ cliente.telefono || "Sin teléfono" }}
                    </span>

                  </div>

                </td>


                <td>

                  <div class="address-cell">
                    <i class="bi bi-geo-alt"></i>

                    <span>
                      {{
                        cliente.direccion
                        || "Sin dirección"
                      }}
                    </span>
                  </div>

                </td>


                <td>
                  <span class="ruc-badge">
                    {{ cliente.ruc || "Sin RUC" }}
                  </span>
                </td>


                <td>

                  <div class="actions">

                    <button
                      type="button"
                      class="action-button edit"
                      title="Ver / editar cliente"
                      @click="editarCliente(cliente.id)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>


                    <button
                      type="button"
                      class="action-button delete"
                      title="Eliminar cliente"
                      @click="solicitarEliminar(cliente)"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <div class="table-footer">

          <div class="page-size">

            <span>Mostrar</span>

            <select
              v-model.number="clientesPorPagina"
              @change="paginaActual = 1"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>

            <span>por página</span>
          </div>


          <div class="pagination-info">

            Mostrando

            <strong>{{ indiceInicial + 1 }}</strong>

            -

            <strong>{{ indiceFinal }}</strong>

            de

            <strong>{{ clientesFiltrados.length }}</strong>

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
              <strong>{{ paginaActual }}</strong>
              de
              <strong>{{ totalPaginas }}</strong>
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


    <div
      v-if="clienteAEliminar"
      class="modal-backdrop-custom"
      @click.self="cancelarEliminar"
    >

      <div class="delete-modal">

        <div class="delete-icon">
          <i class="bi bi-trash3"></i>
        </div>


        <h3>
          ¿Eliminar cliente?
        </h3>


        <p>
          Está a punto de eliminar a
          <strong>{{ clienteAEliminar.nombre }}</strong>.
        </p>


        <span class="delete-warning">
          El cliente puede tener órdenes, informes u otros registros relacionados.
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
  consultarClienteFachada,
  eliminarClienteFachada
} from "../helpers/ClienteHelper";


export default {

  name: "ListaClientes",


  data() {
    return {
      clientes: [],
      filtro: "",
      paginaActual: 1,
      clientesPorPagina: 10,
      columnaOrdenada: "nombre",
      ordenAscendente: true,

      cargando: false,
      eliminando: false,

      mensajeExito: "",
      mensajeError: "",

      clienteAEliminar: null
    };
  },


  computed: {

    clientesConCorreo() {
      return this.clientes.filter(
        cliente =>
          cliente.correo
          &&
          String(cliente.correo).trim()
      ).length;
    },


    clientesConEncargado() {
      return this.clientes.filter(
        cliente =>
          cliente.personaEncargada
          &&
          String(cliente.personaEncargada).trim()
      ).length;
    },


    clientesFiltrados() {

      const texto =
        this.normalizarTexto(this.filtro);


      if (!texto) {
        return this.clientes;
      }


      return this.clientes.filter(
        cliente => {

          const contenido =
            this.normalizarTexto(
              [
                cliente.nombre,
                cliente.correo,
                cliente.ruc,
                cliente.personaEncargada,
                cliente.telefono,
                cliente.direccion
              ]
                .filter(Boolean)
                .join(" ")
            );


          return contenido.includes(texto);
        }
      );
    },


    clientesOrdenados() {

      const lista =
        [...this.clientesFiltrados];


      if (!this.columnaOrdenada) {
        return lista;
      }


      return lista.sort(
        (a, b) => {

          let valorA =
            a[this.columnaOrdenada];

          let valorB =
            b[this.columnaOrdenada];


          if (this.columnaOrdenada === "id") {

            valorA =
              Number(valorA || 0);

            valorB =
              Number(valorB || 0);

          } else {

            valorA =
              this.normalizarTexto(valorA);

            valorB =
              this.normalizarTexto(valorB);

          }


          if (valorA < valorB) {
            return this.ordenAscendente ? -1 : 1;
          }

          if (valorA > valorB) {
            return this.ordenAscendente ? 1 : -1;
          }

          return 0;
        }
      );
    },


    totalPaginas() {
      return Math.max(
        1,
        Math.ceil(
          this.clientesOrdenados.length
          /
          this.clientesPorPagina
        )
      );
    },


    indiceInicial() {
      return (
        (this.paginaActual - 1)
        *
        this.clientesPorPagina
      );
    },


    indiceFinal() {
      return Math.min(
        this.indiceInicial
        +
        this.clientesPorPagina,
        this.clientesFiltrados.length
      );
    },


    clientesPaginados() {
      return this.clientesOrdenados.slice(
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
      if (this.paginaActual > nuevoTotal) {
        this.paginaActual = nuevoTotal;
      }
    }

  },


  mounted() {
    this.cargarClientes();
  },


  methods: {

    async cargarClientes() {

      this.cargando = true;
      this.mensajeError = "";


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


        this.mensajeError =
          "No se pudo cargar el directorio de clientes.";

      } finally {

        this.cargando = false;
      }
    },


    obtenerIniciales(nombre) {

      if (!nombre) {
        return "CL";
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


    normalizarTexto(valor) {

      return String(valor || "")
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .toLowerCase()
        .trim();
    },


    ordenar(columna) {

      if (
        this.columnaOrdenada === columna
      ) {

        this.ordenAscendente =
          !this.ordenAscendente;

      } else {

        this.columnaOrdenada = columna;
        this.ordenAscendente = true;
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


    redirigirCrearCliente() {
      this.$router.push(
        "/cliente_registrar"
      );
    },


    editarCliente(id) {
      this.$router.push(
        `/cliente_ver/${id}`
      );
    },


    solicitarEliminar(cliente) {
      this.clienteAEliminar =
        cliente;
    },


    cancelarEliminar() {

      if (this.eliminando) {
        return;
      }

      this.clienteAEliminar =
        null;
    },


    async confirmarEliminar() {

      if (!this.clienteAEliminar) {
        return;
      }


      this.eliminando = true;
      this.mensajeError = "";


      try {

        const nombre =
          this.clienteAEliminar.nombre;


        await eliminarClienteFachada(
          this.clienteAEliminar.id
        );


        this.clienteAEliminar =
          null;


        this.mensajeExito =
          `Cliente "${nombre}" eliminado correctamente.`;


        await this.cargarClientes();


        setTimeout(
          () => {
            this.mensajeExito = "";
          },
          4000
        );

      } catch (error) {

        console.error(
          "Error eliminando cliente:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar el cliente. Puede tener órdenes, informes u otros registros relacionados.";

      } finally {

        this.eliminando = false;
      }
    }

  }

};
</script>


<style scoped>
.clients-page {
  min-height: 100vh;
  padding: 34px;
  background: linear-gradient(135deg, #f8fbff 0%, #eef4fb 100%);
  color: #1e293b;
}

.page-header {
  max-width: 1500px;
  margin: 0 auto 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 30px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
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
  max-width: 700px;
  margin: 7px 0 0;
  color: #64748b;
  font-size: 0.87rem;
  line-height: 1.55;
}

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
}

.primary-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.primary-button:hover {
  background: #1d4ed8;
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

.summary-grid {
  max-width: 1500px;
  margin: 0 auto 22px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

.clients-panel {
  max-width: 1500px;
  margin: 0 auto;
  padding: 25px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
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

.filters {
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

.clear-search {
  position: absolute;
  top: 50%;
  right: 7px;
  width: 29px;
  height: 29px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #94a3b8;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e8edf3;
  border-radius: 13px;
}

.clients-table {
  width: 100%;
  min-width: 1150px;
  border-collapse: collapse;
}

.clients-table th {
  padding: 13px 14px;
  border-bottom: 1px solid #dde5ee;
  background: #f3f7fc;
  color: #53657c;
  font-size: 0.66rem;
  font-weight: 800;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.clients-table td {
  padding: 14px;
  border-bottom: 1px solid #edf1f5;
  color: #475569;
  font-size: 0.75rem;
  vertical-align: middle;
}

.clients-table tbody tr:hover {
  background: #fafcff;
}

.sortable {
  cursor: pointer;
}

.sort-neutral {
  color: #cbd5e1;
}

.sort-active {
  color: #2563eb;
}

.id-column {
  width: 50px;
}

.actions-column {
  width: 105px;
  text-align: center !important;
}

.row-number {
  color: #94a3b8 !important;
  font-weight: 700;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.client-avatar {
  width: 39px;
  height: 39px;
  min-width: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
  font-size: 0.67rem;
  font-weight: 900;
}

.client-info strong {
  display: block;
  color: #25364d;
  font-size: 0.79rem;
  font-weight: 800;
}

.client-info span {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.59rem;
}

.contact-person,
.address-cell {
  display: flex;
  align-items: center;
  gap: 7px;
}

.contact-person i,
.address-cell i,
.contact-data i {
  color: #94a3b8;
}

.contact-data {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contact-data span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ruc-badge {
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.65rem;
  font-weight: 700;
}

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
}

.action-button.edit {
  border: 1px solid #bfdbfe;
  color: #2563eb;
}

.action-button.delete {
  border: 1px solid #fecaca;
  color: #dc2626;
}

.table-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 15px;
  margin-top: 18px;
}

.page-size,
.pagination-info,
.pagination {
  color: #64748b;
  font-size: 0.69rem;
}

.page-size,
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size select {
  height: 34px;
  border: 1px solid #dce4ee;
  border-radius: 8px;
}

.pagination {
  justify-content: flex-end;
}

.pagination button {
  width: 34px;
  height: 34px;
  border: 1px solid #dce4ee;
  border-radius: 8px;
  background: #ffffff;
  color: #475569;
}

.message {
  max-width: 1500px;
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

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(4px);
}

.delete-modal {
  width: 100%;
  max-width: 430px;
  padding: 28px;
  border-radius: 18px;
  background: #ffffff;
  text-align: center;
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
}

.delete-warning {
  display: block;
  margin-top: 5px;
  color: #dc2626;
  font-size: 0.68rem;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 22px;
}

.rotating {
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .clients-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header .primary-button {
    width: 100%;
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