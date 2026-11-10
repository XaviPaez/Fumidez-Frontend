<template>
  <header
    v-if="mostrarHeader"
    class="app-header"
  >
    <div class="header-container">

      <!-- =============================================== -->
      <!-- LOGO -->
      <!-- =============================================== -->

      <button
        type="button"
        class="logo-button"
        @click="goToInicio"
        aria-label="Ir al sitio web de Fumidez"
      >
        <!--
          Utilizamos exactamente el mismo archivo del portal,
          pero como máscara para que TODO el logo sea blanco.
        -->
        <span
          class="logo-image"
          aria-label="Fumidez - Fumigadora del Ecuador"
        ></span>
      </button>


      <!-- =============================================== -->
      <!-- NAVEGACIÓN -->
      <!-- =============================================== -->

      <nav
        class="navbar"
        :class="{ 'navbar-open': isNavbarOpen }"
      >
        <ul>
          <li
            v-for="item in menuActual"
            :key="item.ruta"
          >
            <router-link
              :to="item.ruta"
              class="nav-link"
              @click="cerrarMenuMovil"
            >
              <i
                v-if="item.icono"
                :class="item.icono"
              ></i>

              <span>
                {{ item.nombre }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>


      <!-- =============================================== -->
      <!-- ACCIONES -->
      <!-- =============================================== -->

      <div class="user-actions">

        <div class="role-badge">
          <i :class="iconoRol"></i>
          <span>{{ nombreRol }}</span>
        </div>


        <!-- MENÚ MÓVIL -->

        <button
          type="button"
          class="navbar-toggle-btn"
          aria-label="Abrir menú"
          @click="toggleNavbar"
        >
          <i
            class="fas"
            :class="
              isNavbarOpen
                ? 'fa-times'
                : 'fa-bars'
            "
          ></i>
        </button>


        <!-- CERRAR SESIÓN -->

        <button
          type="button"
          class="logout-btn"
          title="Cerrar sesión"
          @click="logout"
        >
          <i class="fas fa-sign-out-alt"></i>

          <span class="logout-text">
            Salir
          </span>
        </button>

      </div>

    </div>
  </header>
</template>


<script>
import {
  comprobarTipoUsuario
} from "../modules/Login/helpers/rolesHelper";

import "@fortawesome/fontawesome-free/css/all.min.css";


export default {

  name: "Header",


  data() {
    return {

      tipo: "",

      isNavbarOpen: false,


      // ===============================================
      // ADMIN
      // ===============================================

      menuAdmin: [

        {
          nombre: "Inicio",
          ruta: "/inicio",
          icono: "fas fa-home"
        },

        {
          nombre: "Productos",
          ruta: "/productos_lista",
          icono: "fas fa-box"
        },

        {
          nombre: "Proveedores",
          ruta: "/proveedores_lista",
          icono: "fas fa-truck"
        },

        {
          nombre: "Clientes",
          ruta: "/clientes_lista",
          icono: "fas fa-building"
        },

        {
          nombre: "Usuarios",
          ruta: "/usuarios_lista",
          icono: "fas fa-users"
        },

        {
          nombre: "Facturas",
          ruta: "/facturas_lista",
          icono: "fas fa-file-invoice-dollar"
        },

        {
          nombre: "Finanzas",
          ruta: "/gastos",
          icono: "fas fa-chart-line"
        },

        {
          nombre: "Órdenes",
          ruta: "/orden_trabajo_lista",
          icono: "fas fa-clipboard-list"
        },

        {
          nombre: "Informes",
          ruta: "/informe_lista",
          icono: "fas fa-file-alt"
        },

        {
          nombre: "Calendario",
          ruta: "/calendario",
          icono: "fas fa-calendar-alt"
        }

      ],


      // ===============================================
      // TÉCNICO
      // ===============================================

      menuTecnico: [

        {
          nombre: "Productos",
          ruta: "/productos_lista",
          icono: "fas fa-box"
        },

        {
          nombre: "Órdenes de Trabajo",
          ruta: "/orden_trabajo_lista",
          icono: "fas fa-clipboard-list"
        },

        {
          nombre: "Informes",
          ruta: "/informe_lista",
          icono: "fas fa-file-alt"
        },

        {
          nombre: "Calendario",
          ruta: "/calendario",
          icono: "fas fa-calendar-alt"
        }

      ],


      // ===============================================
      // CLIENTE
      // ===============================================

      menuCliente: [

        {
          nombre: "Mi Portal",
          ruta: "/portal-cliente",
          icono: "fas fa-th-large"
        }

      ]

    };
  },


  computed: {

    // ===============================================
    // OCULTAR HEADER
    // ===============================================

    mostrarHeader() {

      const rutasSinHeader = [
        "/login",
        "/recuperar_contrasenia"
      ];

      return !rutasSinHeader.includes(
        this.$route.path
      );
    },


    // ===============================================
    // MENÚ SEGÚN ROL
    // ===============================================

    menuActual() {

      switch (this.tipo) {

        case "ADMIN":
          return this.menuAdmin;

        case "TECNICO":
          return this.menuTecnico;

        case "CLIENTE":
          return this.menuCliente;

        default:
          return [];

      }
    },


    // ===============================================
    // NOMBRE ROL
    // ===============================================

    nombreRol() {

      switch (this.tipo) {

        case "ADMIN":
          return "Administrador";

        case "TECNICO":
          return "Técnico";

        case "CLIENTE":
          return "Cliente";

        default:
          return "Usuario";

      }
    },


    // ===============================================
    // ICONO ROL
    // ===============================================

    iconoRol() {

      switch (this.tipo) {

        case "ADMIN":
          return "fas fa-user-shield";

        case "TECNICO":
          return "fas fa-user-cog";

        case "CLIENTE":
          return "fas fa-user";

        default:
          return "fas fa-user";

      }
    }

  },


  mounted() {
    this.cargarRol();
  },


  watch: {

    $route() {

      this.isNavbarOpen = false;

      this.cargarRol();

    }

  },


  methods: {

    // ===============================================
    // CARGAR ROL
    // ===============================================

    cargarRol() {

      const rol =
        comprobarTipoUsuario();

      this.tipo =
        rol
          ? String(rol).toUpperCase()
          : "";

    },


    // ===============================================
    // LOGO / INICIO
    // ===============================================

    goToInicio() {
      this.isNavbarOpen = false;
      this.$router.push("/");
    },


    // ===============================================
    // MENÚ MÓVIL
    // ===============================================

    toggleNavbar() {

      this.isNavbarOpen =
        !this.isNavbarOpen;

    },


    cerrarMenuMovil() {

      this.isNavbarOpen = false;

    },


    // ===============================================
    // LOGOUT
    // ===============================================

    logout() {

      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("clienteId");

      this.tipo = "";
      this.isNavbarOpen = false;

      this.$router.replace(
        "/login"
      );

    }

  }

};
</script>


<style scoped>

/* =========================================================
   HEADER
   ========================================================= */

.app-header {

  position: sticky;

  top: 0;

  z-index: 1000;

  width: 100%;

  background:
    linear-gradient(
      110deg,
      #06365f 0%,
      #07558b 100%
    );

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.12);

  box-shadow:
    0 5px 22px
    rgba(15, 23, 42, 0.16);

}


/* =========================================================
   CONTENEDOR
   ========================================================= */

.header-container {

  width: 100%;

  min-height: 78px;

  display: grid;

  grid-template-columns:
    230px
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 18px;

  padding:
    0 26px;

}


/* =========================================================
   LOGO
   ========================================================= */

.logo-button {

  width: 220px;

  height: 64px;

  display: flex;

  align-items: center;

  justify-content: flex-start;

  padding: 0;

  border: none;

  background: transparent;

  cursor: pointer;

}


/*
   IMPORTANTE

   Usamos /fumidez_logo.png como máscara.

   Esto conserva exactamente la silueta del logo del
   HomePublic, pero convierte todas sus partes en blanco.
*/

.logo-image {

  display: block;

  width: 215px;

  height: 58px;

  background: #ffffff;

  -webkit-mask-image:
    url("/fumidez_logo.png");

  mask-image:
    url("/fumidez_logo.png");

  -webkit-mask-repeat:
    no-repeat;

  mask-repeat:
    no-repeat;

  -webkit-mask-position:
    left center;

  mask-position:
    left center;

  -webkit-mask-size:
    contain;

  mask-size:
    contain;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

}


.logo-button:hover .logo-image {

  opacity: 0.92;

  transform:
    translateY(-1px);

}


/* =========================================================
   NAV
   ========================================================= */

.navbar {

  display: flex;

  align-items: center;

  justify-content: center;

  min-width: 0;

}


.navbar ul {

  display: flex;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 4px;

  margin: 0;

  padding: 0;

  list-style: none;

}


.nav-link {

  min-height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding:
    0 11px;

  border-radius: 10px;

  color:
    rgba(
      255,
      255,
      255,
      0.92
    );

  text-decoration: none;

  font-size: 0.82rem;

  font-weight: 700;

  white-space: nowrap;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

}


.nav-link i {

  font-size: 0.78rem;

  opacity: 0.88;

}


.nav-link:hover {

  background:
    rgba(
      255,
      255,
      255,
      0.11
    );

  color: #ffffff;

  transform:
    translateY(-1px);

}


/* =========================================================
   RUTA ACTIVA
   ========================================================= */

.nav-link.router-link-active {

  background: #ffffff;

  color: #07518a;

  box-shadow:
    0 4px 12px
    rgba(15, 23, 42, 0.14);

}


/* =========================================================
   ACCIONES
   ========================================================= */

.user-actions {

  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 9px;

}


/* =========================================================
   ROL
   ========================================================= */

.role-badge {

  min-height: 36px;

  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding:
    0 11px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.2
    );

  border-radius:
    999px;

  background:
    rgba(
      255,
      255,
      255,
      0.1
    );

  color: #ffffff;

  font-size: 0.68rem;

  font-weight: 700;

  white-space: nowrap;

}


/* =========================================================
   LOGOUT
   ========================================================= */

.logout-btn {

  min-height: 38px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding:
    0 12px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.18
    );

  border-radius: 9px;

  background:
    rgba(
      255,
      255,
      255,
      0.08
    );

  color: #ffffff;

  cursor: pointer;

  font-size: 0.76rem;

  font-weight: 700;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

}


.logout-btn:hover {

  background:
    rgba(
      239,
      68,
      68,
      0.85
    );

  transform:
    translateY(-1px);

}


/* =========================================================
   BOTÓN MENÚ MÓVIL
   ========================================================= */

.navbar-toggle-btn {

  display: none;

  width: 40px;

  height: 40px;

  align-items: center;

  justify-content: center;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.2
    );

  border-radius: 9px;

  background:
    rgba(
      255,
      255,
      255,
      0.08
    );

  color: #ffffff;

  font-size: 1rem;

  cursor: pointer;

}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 1400px) {

  .header-container {

    grid-template-columns:
      190px
      minmax(0, 1fr)
      auto;

    gap: 10px;

    padding:
      0 18px;

  }


  .logo-button {

    width: 185px;

  }


  .logo-image {

    width: 180px;

  }


  .nav-link {

    padding:
      0 8px;

    font-size:
      0.76rem;

  }


  .role-badge span {

    display: none;

  }


  .logout-text {

    display: none;

  }

}


/* =========================================================
   MÓVIL
   ========================================================= */

@media (max-width: 900px) {

  .header-container {

    position: relative;

    min-height: 70px;

    grid-template-columns:
      auto
      1fr;

    padding:
      0 16px;

  }


  .logo-button {

    width: 180px;

    height: 58px;

  }


  .logo-image {

    width: 175px;

    height: 50px;

  }


  .navbar {

    position: absolute;

    top: 70px;

    left: 0;

    right: 0;

    display: none;

    padding:
      10px 14px 16px;

    background:
      linear-gradient(
        110deg,
        #06365f,
        #07558b
      );

    border-top:
      1px solid
      rgba(
        255,
        255,
        255,
        0.12
      );

    box-shadow:
      0 12px 24px
      rgba(
        15,
        23,
        42,
        0.18
      );

  }


  .navbar.navbar-open {

    display: block;

  }


  .navbar ul {

    width: 100%;

    display: flex;

    flex-direction: column;

    align-items: stretch;

    gap: 4px;

  }


  .nav-link {

    width: 100%;

    justify-content: flex-start;

    padding:
      0 14px;

  }


  .user-actions {

    justify-self: end;

  }


  .navbar-toggle-btn {

    display: inline-flex;

  }


  .role-badge {

    display: none;

  }


  .logout-btn {

    width: 40px;

    padding: 0;

  }


  .logout-text {

    display: none;

  }

}


/* =========================================================
   MÓVIL PEQUEÑO
   ========================================================= */

@media (max-width: 450px) {

  .header-container {

    padding:
      0 11px;

  }


  .logo-button {

    width: 155px;

  }


  .logo-image {

    width: 150px;

    height: 45px;

  }


  .user-actions {

    gap: 6px;

  }

}

</style>