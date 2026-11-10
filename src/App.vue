<template>

  <div
    id="app"
    :class="{
      'public-layout': isPublicRoute,
      'private-layout': !isPublicRoute
    }"
  >

    <!-- ===================================================== -->
    <!-- HEADER DEL SISTEMA PRIVADO -->
    <!-- ===================================================== -->

    <Header
      v-if="mostrarHeaderPrivado"
    />


    <!-- ===================================================== -->
    <!-- CONTENIDO -->
    <!-- ===================================================== -->

    <main
      :class="{
        'public-main': isPublicRoute,
        'private-main': !isPublicRoute
      }"
    >

      <router-view />

    </main>

  </div>

</template>


<script>

import Header
  from './components/Header.vue';


export default {

  name: "App",


  components: {

    Header

  },


  computed: {

    // =====================================================
    // ¿ES UNA RUTA PÚBLICA?
    // =====================================================

    isPublicRoute() {

      return Boolean(
        this.$route.meta.public
      );

    },


    // =====================================================
    // MOSTRAR HEADER PRIVADO
    // =====================================================

    mostrarHeaderPrivado() {

      /*
       * Todas las rutas marcadas como públicas:
       *
       * /
       * /login
       * /recuperar_contrasenia
       * /cambiar_contrasenia/...
       *
       * NO deben utilizar el Header administrativo.
       *
       * HomePublic.vue ya contiene su propio PublicHeader.
       */

      return !this.isPublicRoute;

    }

  }

};

</script>


<style>

/* ========================================================= */
/* RESET GENERAL */
/* ========================================================= */

html,
body {
  margin: 0;
  padding: 0;

  width: 100%;
  min-height: 100%;

  font-family:
    Arial,
    Helvetica,
    sans-serif;
}


body {
  min-height: 100vh;
}


* {
  box-sizing: border-box;
}


/* ========================================================= */
/* APP */
/* ========================================================= */

#app {
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
}


/* ========================================================= */
/* MAIN GENERAL */
/* ========================================================= */

main {
  width: 100%;
  flex-grow: 1;
}


/* ========================================================= */
/* WEB PÚBLICA */
/* ========================================================= */

.public-layout {
  background: #ffffff;
}


.public-main {
  width: 100%;

  min-height: 100vh;

  /*
   * MUY IMPORTANTE:
   *
   * La web pública controla sus propios
   * fondos, imágenes y colores.
   *
   * No heredamos fumi.jpg del sistema.
   */

  background: #ffffff;
}


/* ========================================================= */
/* SISTEMA PRIVADO */
/* ========================================================= */

.private-layout {
  min-height: 100vh;
}


.private-main {
  width: 100%;

  min-height: 100vh;

  background-size: cover;

  background-position: center;

  background-repeat: no-repeat;

  background-attachment: fixed;
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 768px) {

  .private-main {
    background-attachment: scroll;
  }

}

</style>