<template>
  <header
    class="public-header"
    :class="{
      'is-scrolled': scrolled,
      'menu-open': menuAbierto
    }"
  >
    <div class="header-container">

      <!-- LOGO -->
      <button
        type="button"
        class="brand"
        aria-label="Ir al inicio"
        @click="irInicio"
      >
        <img
          src="/fumidez_logo.png"
          alt="FUMIDEZ - Fumigadora del Ecuador"
          class="brand-logo"
        />
      </button>

      <!-- NAV DESKTOP -->
      <nav
        class="desktop-nav"
        aria-label="Navegación principal"
      >
        <button
          v-for="item in menu"
          :key="item.id"
          type="button"
          class="nav-item"
          :class="{ active: seccionActiva === item.id }"
          @click="irSeccion(item.id)"
        >
          {{ item.nombre }}
        </button>
      </nav>

      <!-- ACCIONES -->
      <div class="header-actions">
        <button
          type="button"
          class="portal-button"
          @click="irLogin"
        >
          <span class="portal-icon">
            <i class="bi bi-person"></i>
          </span>

          <span class="portal-text">
            Portal clientes
          </span>
        </button>

        <button
          type="button"
          class="inspection-button"
          @click="irInspeccion"
        >
          <i class="bi bi-calendar2-check"></i>
          <span>Solicitar inspección</span>
        </button>

        <button
          type="button"
          class="mobile-menu-button"
          :aria-expanded="menuAbierto"
          :aria-label="menuAbierto ? 'Cerrar menú' : 'Abrir menú'"
          @click="alternarMenu"
        >
          <i
            class="bi"
            :class="menuAbierto ? 'bi-x-lg' : 'bi-list'"
          ></i>
        </button>
      </div>
    </div>

    <div class="header-accent"></div>

    <!-- MOBILE -->
    <transition name="menu">
      <div
        v-if="menuAbierto"
        class="mobile-menu"
      >
        <div class="mobile-menu-inner">

          <div class="mobile-navigation">
            <button
              v-for="item in menu"
              :key="item.id"
              type="button"
              :class="{ active: seccionActiva === item.id }"
              @click="navegarMobile(item.id)"
            >
              <span>{{ item.nombre }}</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>

          <div class="mobile-actions">
            <button
              type="button"
              class="mobile-portal"
              @click="irLogin"
            >
              <i class="bi bi-person-circle"></i>
              Portal clientes
            </button>

            <button
              type="button"
              class="mobile-inspection"
              @click="irInspeccion"
            >
              <i class="bi bi-calendar2-check"></i>
              Solicitar inspección
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
export default {
  name: "PublicHeader",

  data() {
    return {
      menuAbierto: false,
      scrolled: false,
      seccionActiva: "inicio",

      menu: [
        { id: "inicio", nombre: "Inicio" },
        { id: "nosotros", nombre: "Empresa" },
        { id: "servicios", nombre: "Servicios" },
        { id: "casos", nombre: "Clientes" },
        { id: "sectores", nombre: "Sectores" },
        { id: "contacto", nombre: "Contacto" }
      ]
    };
  },

  mounted() {
    window.addEventListener(
      "scroll",
      this.controlarScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      this.controlarResize
    );

    this.controlarScroll();
  },

  beforeUnmount() {
    window.removeEventListener(
      "scroll",
      this.controlarScroll
    );

    window.removeEventListener(
      "resize",
      this.controlarResize
    );
  },

  methods: {
    controlarScroll() {
      this.scrolled = window.scrollY > 22;
      this.detectarSeccionActiva();
    },

    detectarSeccionActiva() {
      const offset = 150;
      let actual = "inicio";

      for (const item of this.menu) {
        const elemento = document.getElementById(item.id);

        if (!elemento) {
          continue;
        }

        const top = elemento.getBoundingClientRect().top;

        if (top <= offset) {
          actual = item.id;
        }
      }

      this.seccionActiva = actual;
    },

    controlarResize() {
      if (window.innerWidth > 1020) {
        this.menuAbierto = false;
      }
    },

    alternarMenu() {
      this.menuAbierto = !this.menuAbierto;
    },

    async irInicio() {
      this.menuAbierto = false;

      if (this.$route.path !== "/") {
        await this.$router.push("/");
      }

      this.seccionActiva = "inicio";

      this.$nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    },

    async irSeccion(id) {
      this.menuAbierto = false;

      if (this.$route.path !== "/") {
        await this.$router.push("/");
        await this.$nextTick();
      }

      const elemento = document.getElementById(id);

      if (!elemento) {
        return;
      }

      const headerOffset = 88;

      const top =
        elemento.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      this.seccionActiva = id;

      window.scrollTo({
        top,
        behavior: "smooth"
      });
    },

    navegarMobile(id) {
      this.menuAbierto = false;

      this.$nextTick(() => {
        this.irSeccion(id);
      });
    },

    irLogin() {
      this.menuAbierto = false;
      this.$router.push("/login");
    },

    irInspeccion() {
      this.menuAbierto = false;
      this.irSeccion("contacto");
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

.public-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5000;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(4, 31, 56, 0.72),
    rgba(4, 31, 56, 0.20)
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  transition:
    background 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease,
    backdrop-filter 0.28s ease;
  font-family: "Poppins", "Segoe UI", sans-serif;
}

.public-header.is-scrolled {
  background:
    linear-gradient(
      90deg,
      rgba(5, 43, 76, 0.985),
      rgba(8, 75, 117, 0.985)
    );
  border-bottom-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 34px
    rgba(2, 28, 49, 0.28);
  backdrop-filter: blur(16px);
}

.header-container {
  width: min(calc(100% - 42px), 1500px);
  height: 88px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 36px;
}

.brand {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.brand-logo {
  display: block;
  width: 210px;
  max-height: 62px;
  object-fit: contain;
  object-position: left center;
  filter:
    brightness(0)
    invert(1);
  transition:
    transform 0.22s ease,
    filter 0.28s ease;
}

.brand:hover .brand-logo {
  transform: translateY(-1px) scale(1.015);
}

.desktop-nav {
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 2px;
}

.nav-item {
  position: relative;
  min-width: 90px;
  height: 100%;
  padding: 0 15px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.84);
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.22s ease,
    background-color 0.22s ease;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.045);
}

.nav-item::after {
  content: "";
  position: absolute;
  left: 17px;
  right: 17px;
  bottom: 18px;
  height: 2px;
  border-radius: 999px;
  background: #dc2d34;
  opacity: 0;
  transform: scaleX(0.28);
  transform-origin: center;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.nav-item:hover::after {
  opacity: 0.55;
  transform: scaleX(0.8);
}

.nav-item.active {
  color: #ffffff;
  font-weight: 800;
}

.nav-item.active::after {
  opacity: 1;
  transform: scaleX(1);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.portal-button,
.inspection-button {
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.portal-button {
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.portal-button:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.12);
}

.portal-icon {
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.10);
  color: #ffffff;
}

.inspection-button {
  padding: 0 18px;
  border: 1px solid #cf252d;
  background:
    linear-gradient(
      135deg,
      #dc2d34,
      #ad151c
    );
  color: #ffffff;
  box-shadow:
    0 8px 22px
    rgba(193, 30, 38, 0.28);
}

.inspection-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 28px
    rgba(193, 30, 38, 0.36);
}

.header-accent {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0;
  height: 2px;
  background:
    linear-gradient(
      90deg,
      #0c72ad,
      #dc2d34
    );
  transition: width 0.38s ease;
}

.is-scrolled .header-accent {
  width: 100%;
}

.mobile-menu-button {
  width: 45px;
  height: 45px;
  display: none;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
  font-size: 1.3rem;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  border-top: 1px solid rgba(255, 255, 255, 0.10);
  background:
    linear-gradient(
      180deg,
      #07375f,
      #052a4b
    );
  box-shadow:
    0 22px 50px
    rgba(2, 28, 49, 0.28);
}

.mobile-menu-inner {
  width: min(calc(100% - 28px), 820px);
  margin: 0 auto;
  padding: 16px 0 22px;
}

.mobile-navigation {
  display: grid;
  gap: 4px;
}

.mobile-navigation button {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

.mobile-navigation button:hover,
.mobile-navigation button.active {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.mobile-navigation button.active {
  box-shadow: inset 3px 0 0 #dc2d34;
}

.mobile-navigation button i {
  color: #8dc5e8;
  transition: transform 0.22s ease;
}

.mobile-navigation button:hover i {
  transform: translateX(4px);
}

.mobile-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.11);
}

.mobile-portal,
.mobile-inspection {
  min-height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
}

.mobile-portal {
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.mobile-inspection {
  border: 1px solid #cf252d;
  background: #c51e26;
  color: #ffffff;
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1240px) {
  .header-container {
    gap: 18px;
  }

  .nav-item {
    min-width: auto;
    padding: 0 10px;
    font-size: 0.76rem;
  }

  .brand-logo {
    width: 185px;
  }
}

@media (max-width: 1020px) {
  .desktop-nav {
    display: none;
  }

  .header-container {
    height: 76px;
  }

  .brand-logo {
    width: 170px;
  }

  .mobile-menu-button {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}

@media (max-width: 680px) {
  .header-container {
    width: calc(100% - 24px);
    height: 70px;
  }

  .brand-logo {
    width: 148px;
  }

  .portal-button,
  .inspection-button {
    display: none;
  }

  .mobile-actions {
    grid-template-columns: 1fr;
  }
}
</style>
