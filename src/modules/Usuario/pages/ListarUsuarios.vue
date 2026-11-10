<template>
  <div class="users-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>
        <span class="page-eyebrow">
          ADMINISTRACIÓN
        </span>

        <h1>
          Usuarios
        </h1>

        <p>
          Administra los accesos al sistema, roles y datos principales
          de los usuarios de Fumidez.
        </p>
      </div>


      <button
        type="button"
        class="primary-button"
        @click="redirigirCrearUsuario"
      >
        <i class="bi bi-person-plus"></i>
        Nuevo usuario
      </button>

    </section>


    <!-- ===================================================== -->
    <!-- RESUMEN -->
    <!-- ===================================================== -->

    <section class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon blue">
          <i class="bi bi-people"></i>
        </div>

        <div>
          <span>Total usuarios</span>
          <strong>{{ usuarios.length }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon purple">
          <i class="bi bi-shield-check"></i>
        </div>

        <div>
          <span>Administradores</span>
          <strong>{{ totalAdmins }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon orange">
          <i class="bi bi-tools"></i>
        </div>

        <div>
          <span>Técnicos</span>
          <strong>{{ totalTecnicos }}</strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon green">
          <i class="bi bi-person-badge"></i>
        </div>

        <div>
          <span>Clientes con acceso</span>
          <strong>{{ totalClientes }}</strong>
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
        @click="cargarUsuarios"
      >
        Reintentar
      </button>
    </div>


    <!-- ===================================================== -->
    <!-- PANEL -->
    <!-- ===================================================== -->

    <section class="users-panel">

      <div class="panel-header">

        <div>
          <h2>
            Directorio de usuarios
          </h2>

          <p>
            {{ usuariosFiltrados.length }}
            {{
              usuariosFiltrados.length === 1
                ? "usuario encontrado"
                : "usuarios encontrados"
            }}
          </p>
        </div>


        <button
          type="button"
          class="refresh-button"
          :disabled="cargando"
          @click="cargarUsuarios"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ rotating: cargando }"
          ></i>

          Actualizar
        </button>

      </div>


      <!-- ================================================= -->
      <!-- FILTROS -->
      <!-- ================================================= -->

      <div class="filters">

        <div class="search-box">

          <i class="bi bi-search"></i>

          <input
            v-model.trim="filtro"
            type="text"
            placeholder="Buscar por nombre, correo, rol, RUC, teléfono o dirección..."
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


        <select
          v-model="filtroRol"
          class="filter-select"
        >
          <option value="">
            Todos los roles
          </option>

          <option value="ADMIN">
            Administrador
          </option>

          <option value="TECNICO">
            Técnico
          </option>

          <option value="CLIENTE">
            Cliente
          </option>
        </select>


        <button
          v-if="filtro || filtroRol"
          type="button"
          class="clear-filters-button"
          @click="limpiarFiltros"
        >
          <i class="bi bi-funnel"></i>
          Limpiar
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
        <span>Cargando usuarios...</span>
      </div>


      <!-- ================================================= -->
      <!-- SIN RESULTADOS -->
      <!-- ================================================= -->

      <div
        v-else-if="usuariosFiltrados.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          <i class="bi bi-people"></i>
        </div>


        <h3>
          {{
            usuarios.length === 0
              ? "No hay usuarios registrados"
              : "No encontramos usuarios"
          }}
        </h3>


        <p>
          {{
            usuarios.length === 0
              ? "Crea el primer usuario para comenzar a gestionar los accesos al sistema."
              : "Prueba cambiando la búsqueda o el filtro de rol."
          }}
        </p>


        <button
          v-if="usuarios.length === 0"
          type="button"
          class="primary-button"
          @click="redirigirCrearUsuario"
        >
          <i class="bi bi-person-plus"></i>
          Crear usuario
        </button>

      </div>


      <!-- ================================================= -->
      <!-- TABLA -->
      <!-- ================================================= -->

      <template v-else>

        <div class="table-wrapper">

          <table class="users-table">

            <thead>

              <tr>

                <th class="id-column">
                  #
                </th>


                <th
                  class="sortable"
                  @click="ordenar('nombre')"
                >
                  Usuario

                  <i :class="iconoOrden('nombre')"></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('tipo')"
                >
                  Rol

                  <i :class="iconoOrden('tipo')"></i>
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
                  @click="ordenar('ruc')"
                >
                  RUC

                  <i :class="iconoOrden('ruc')"></i>
                </th>


                <th>
                  Cuenta
                </th>


                <th
                  class="sortable"
                  @click="ordenar('direccion')"
                >
                  Dirección

                  <i :class="iconoOrden('direccion')"></i>
                </th>


                <th class="actions-column">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(usuario, index) in usuariosPaginados"
                :key="usuario.id"
              >

                <td class="row-number">
                  {{ indiceInicial + index + 1 }}
                </td>


                <!-- USUARIO -->

                <td>

                  <div class="user-info">

                    <div
                      class="user-avatar"
                      :class="claseAvatar(usuario.tipo)"
                    >
                      {{ obtenerIniciales(usuario.nombre) }}
                    </div>


                    <div>

                      <strong>
                        {{ usuario.nombre }}
                      </strong>

                      <span>
                        ID {{ usuario.id }}
                      </span>

                    </div>

                  </div>

                </td>


                <!-- ROL -->

                <td>

                  <span
                    class="role-badge"
                    :class="claseRol(usuario.tipo)"
                  >
                    <span class="role-dot"></span>

                    {{ textoRol(usuario.tipo) }}
                  </span>

                </td>


                <!-- CONTACTO -->

                <td>

                  <div class="contact-data">

                    <span>
                      <i class="bi bi-envelope"></i>

                      {{ usuario.correo || "Sin correo" }}
                    </span>


                    <span>
                      <i class="bi bi-telephone"></i>

                      {{ usuario.telefono || "Sin teléfono" }}
                    </span>

                  </div>

                </td>


                <!-- RUC -->

                <td>

                  <span class="data-badge">
                    {{ usuario.ruc || "Sin RUC" }}
                  </span>

                </td>


                <!-- CUENTA -->

                <td>

                  <div class="account-cell">

                    <i class="bi bi-credit-card"></i>

                    <span>
                      {{ ocultarCuenta(obtenerCuenta(usuario)) }}
                    </span>

                  </div>

                </td>


                <!-- DIRECCIÓN -->

                <td>

                  <div class="address-cell">

                    <i class="bi bi-geo-alt"></i>

                    <span>
                      {{
                        usuario.direccion
                        || "Sin dirección"
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
                      title="Ver / editar usuario"
                      @click="editarUsuario(usuario.id)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>


                    <button
                      type="button"
                      class="action-button delete"
                      title="Eliminar usuario"
                      @click="solicitarEliminar(usuario)"
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

            <span>Mostrar</span>

            <select
              v-model.number="usuariosPorPagina"
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

            <strong>
              {{ indiceInicial + 1 }}
            </strong>

            -

            <strong>
              {{ indiceFinal }}
            </strong>

            de

            <strong>
              {{ usuariosFiltrados.length }}
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


    <!-- ===================================================== -->
    <!-- MODAL ELIMINAR -->
    <!-- ===================================================== -->

    <div
      v-if="usuarioAEliminar"
      class="modal-backdrop-custom"
      @click.self="cancelarEliminar"
    >

      <div class="delete-modal">

        <div class="delete-icon">
          <i class="bi bi-trash3"></i>
        </div>


        <h3>
          ¿Eliminar usuario?
        </h3>


        <p>
          Está a punto de eliminar a
          <strong>
            {{ usuarioAEliminar.nombre }}
          </strong>.
        </p>


        <div class="user-delete-summary">

          <span
            class="role-badge"
            :class="claseRol(usuarioAEliminar.tipo)"
          >
            {{ textoRol(usuarioAEliminar.tipo) }}
          </span>

          <span>
            {{ usuarioAEliminar.correo }}
          </span>

        </div>


        <span class="delete-warning">
          Esta persona perderá el acceso al sistema inmediatamente.
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
  consultarUsuarioFachada,
  eliminarUsuarioFachada
} from "../helpers/UsuarioHelper";


export default {

  name: "ListaUsuarios",


  data() {

    return {

      usuarios: [],

      filtro: "",

      filtroRol: "",

      paginaActual: 1,

      usuariosPorPagina: 10,

      columnaOrdenada: "nombre",

      ordenAscendente: true,

      cargando: false,

      eliminando: false,

      mensajeExito: "",

      mensajeError: "",

      usuarioAEliminar: null

    };

  },


  computed: {

    // =====================================================
    // RESUMEN
    // =====================================================

    totalAdmins() {

      return this.usuarios.filter(
        usuario =>
          this.normalizarRol(usuario.tipo)
          === "ADMIN"
      ).length;

    },


    totalTecnicos() {

      return this.usuarios.filter(
        usuario =>
          this.normalizarRol(usuario.tipo)
          === "TECNICO"
      ).length;

    },


    totalClientes() {

      return this.usuarios.filter(
        usuario =>
          this.normalizarRol(usuario.tipo)
          === "CLIENTE"
      ).length;

    },


    // =====================================================
    // FILTRO
    // =====================================================

    usuariosFiltrados() {

      const texto =
        this.normalizarTexto(
          this.filtro
        );


      return this.usuarios.filter(
        usuario => {

          const coincideRol =
            !this.filtroRol
            ||
            this.normalizarRol(usuario.tipo)
            ===
            this.filtroRol;


          if (!coincideRol) {
            return false;
          }


          if (!texto) {
            return true;
          }


          const contenido =
            this.normalizarTexto(
              [
                usuario.nombre,
                usuario.tipo,
                usuario.correo,
                usuario.ruc,
                usuario.direccion,
                usuario.telefono,
                this.obtenerCuenta(usuario)
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
    // ORDEN
    // =====================================================

    usuariosOrdenados() {

      const lista =
        [...this.usuariosFiltrados];


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
              this.normalizarTexto(valorA);

            valorB =
              this.normalizarTexto(valorB);

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
          this.usuariosOrdenados.length
          /
          this.usuariosPorPagina
        )
      );

    },


    indiceInicial() {

      return (
        (this.paginaActual - 1)
        *
        this.usuariosPorPagina
      );

    },


    indiceFinal() {

      return Math.min(
        this.indiceInicial
        +
        this.usuariosPorPagina,
        this.usuariosFiltrados.length
      );

    },


    usuariosPaginados() {

      return this.usuariosOrdenados.slice(
        this.indiceInicial,
        this.indiceFinal
      );

    }

  },


  watch: {

    filtro() {
      this.paginaActual = 1;
    },


    filtroRol() {
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

    this.cargarUsuarios();

  },


  methods: {

    // =====================================================
    // CARGAR
    // =====================================================

    async cargarUsuarios() {

      this.cargando =
        true;

      this.mensajeError =
        "";


      try {

        const response =
          await consultarUsuarioFachada();


        this.usuarios =
          Array.isArray(response)
            ? response
            : [];


      } catch (error) {

        console.error(
          "Error cargando usuarios:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el directorio de usuarios.";

      } finally {

        this.cargando =
          false;

      }

    },


    // =====================================================
    // ROL
    // =====================================================

    normalizarRol(rol) {

      return String(
        rol || ""
      )
        .trim()
        .toUpperCase();

    },


    textoRol(rol) {

      const roles = {

        ADMIN:
          "Administrador",

        TECNICO:
          "Técnico",

        CLIENTE:
          "Cliente"

      };


      return roles[
        this.normalizarRol(rol)
      ]
      || "Usuario";

    },


    claseRol(rol) {

      const roles = {

        ADMIN:
          "role-admin",

        TECNICO:
          "role-technician",

        CLIENTE:
          "role-client"

      };


      return roles[
        this.normalizarRol(rol)
      ]
      || "role-default";

    },


    claseAvatar(rol) {

      const roles = {

        ADMIN:
          "avatar-admin",

        TECNICO:
          "avatar-technician",

        CLIENTE:
          "avatar-client"

      };


      return roles[
        this.normalizarRol(rol)
      ]
      || "avatar-default";

    },


    // =====================================================
    // DATOS
    // =====================================================

    obtenerCuenta(usuario) {

      return (
        usuario.nCuenta
        ??
        usuario.ncuenta
        ??
        ""
      );

    },


    ocultarCuenta(cuenta) {

      if (!cuenta) {
        return "Sin cuenta";
      }


      const texto =
        String(cuenta)
          .replace(/\s/g, "");


      if (texto.length <= 4) {
        return texto;
      }


      return (
        "•••• •••• "
        +
        texto.slice(-4)
      );

    },


    obtenerIniciales(nombre) {

      if (!nombre) {
        return "US";
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
    // FILTROS
    // =====================================================

    limpiarFiltros() {

      this.filtro = "";

      this.filtroRol = "";

      this.paginaActual = 1;

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

    redirigirCrearUsuario() {

      this.$router.push(
        "/usuario_registro"
      );

    },


    editarUsuario(id) {

      this.$router.push(
        `/usuario_ver/${id}`
      );

    },


    // =====================================================
    // ELIMINAR
    // =====================================================

    solicitarEliminar(usuario) {

      this.usuarioAEliminar =
        usuario;

    },


    cancelarEliminar() {

      if (this.eliminando) {
        return;
      }


      this.usuarioAEliminar =
        null;

    },


    async confirmarEliminar() {

      if (!this.usuarioAEliminar) {
        return;
      }


      this.eliminando =
        true;

      this.mensajeError =
        "";


      try {

        const nombre =
          this.usuarioAEliminar.nombre;


        await eliminarUsuarioFachada(
          this.usuarioAEliminar.id
        );


        this.usuarioAEliminar =
          null;


        this.mensajeExito =
          `Usuario "${nombre}" eliminado correctamente.`;


        await this.cargarUsuarios();


        setTimeout(
          () => {
            this.mensajeExito = "";
          },
          4000
        );


      } catch (error) {

        console.error(
          "Error eliminando usuario:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar el usuario. Puede estar relacionado con órdenes u otros registros.";

      } finally {

        this.eliminando =
          false;

      }

    }

  }

};
</script>


<style scoped>

.users-page {
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
  max-width: 1550px;

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
  max-width: 720px;

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
  max-width: 1550px;

  margin: 0 auto 22px;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

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


.summary-icon.purple {
  background: #f5f3ff;
  color: #7c3aed;
}


.summary-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}


.summary-icon.green {
  background: #ecfdf3;
  color: #16a34a;
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


.users-panel {
  max-width: 1550px;

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


.filters {
  display: grid;

  grid-template-columns:
    minmax(280px, 1fr)
    200px
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


.search-box input,
.filter-select {
  width: 100%;

  height: 43px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  color: #334155;

  font-size: 0.78rem;

  outline: none;
}


.search-box input {
  padding: 0 42px 0 40px;
}


.filter-select {
  padding: 0 11px;
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


.clear-filters-button {
  min-height: 43px;

  padding: 0 12px;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 700;
}


.table-wrapper {
  overflow-x: auto;

  border: 1px solid #e8edf3;

  border-radius: 13px;
}


.users-table {
  width: 100%;

  min-width: 1250px;

  border-collapse: collapse;
}


.users-table th {
  padding: 13px 14px;

  background: #f3f7fc;

  border-bottom: 1px solid #dde5ee;

  color: #53657c;

  font-size: 0.66rem;

  font-weight: 800;

  text-align: left;

  text-transform: uppercase;

  white-space: nowrap;
}


.users-table td {
  padding: 14px;

  border-bottom: 1px solid #edf1f5;

  color: #475569;

  font-size: 0.74rem;

  vertical-align: middle;
}


.users-table tbody tr:hover {
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


.user-info {
  display: flex;

  align-items: center;

  gap: 10px;
}


.user-avatar {
  width: 39px;
  height: 39px;

  min-width: 39px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  font-size: 0.67rem;

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


.user-info strong {
  display: block;

  color: #25364d;

  font-size: 0.79rem;

  font-weight: 800;
}


.user-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.59rem;
}


.role-badge {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 0.63rem;

  font-weight: 800;
}


.role-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
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


.contact-data {
  display: flex;

  flex-direction: column;

  gap: 5px;
}


.contact-data span,
.address-cell,
.account-cell {
  display: flex;

  align-items: center;

  gap: 6px;
}


.contact-data i,
.address-cell i,
.account-cell i {
  color: #94a3b8;
}


.data-badge {
  display: inline-flex;

  padding: 5px 8px;

  border-radius: 999px;

  background: #f1f5f9;

  color: #475569;

  font-size: 0.64rem;

  font-weight: 700;
}


.account-cell span {
  font-family: monospace;
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

  grid-template-columns:
    1fr auto 1fr;

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
  max-width: 1550px;

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

  background:
    rgba(15, 23, 42, 0.58);

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


.user-delete-summary {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin: 13px 0;

  color: #64748b;

  font-size: 0.7rem;
}


.delete-warning {
  display: block;

  color: #dc2626;

  font-size: 0.68rem;

  font-weight: 700;
}


.modal-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 22px;
}


.rotating {
  animation:
    rotation
    1s linear infinite;
}


@keyframes rotation {

  to {
    transform: rotate(360deg);
  }

}


@media (max-width: 1050px) {

  .summary-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .filters {
    grid-template-columns:
      1fr 1fr;
  }

}


@media (max-width: 700px) {

  .users-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .page-header .primary-button {
    width: 100%;
  }


  .summary-grid,
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