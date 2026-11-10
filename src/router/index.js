import {
  createRouter,
  createWebHashHistory
} from 'vue-router';


// =========================================================
// WEB PÚBLICA
// =========================================================

import HomePublic
  from '../modules/Public/pages/HomePublic.vue';


// =========================================================
// LOGIN
// =========================================================

import Login
  from '../modules/Login/pages/login.vue';

import RecuperarContrasenia
  from '../modules/Login/pages/RecuperarContrasenia.vue';

import CambioContrasenia
  from '../modules/Login/pages/CambioContrasenia.vue';


// =========================================================
// HOME PRIVADO
// =========================================================

import Home
  from '../modules/Home/pages/Home.vue';


// =========================================================
// CLIENTES
// =========================================================

import Clientes
  from '../modules/Cliente/pages/Clientes.vue';

import ListarClientes
  from '../modules/Cliente/pages/ListarClientes.vue';

import RegistroClientes
  from '../modules/Cliente/pages/RegistroClientes.vue';

import PortalCliente
  from "../modules/Cliente/pages/PortalCliente.vue";


// =========================================================
// USUARIOS
// =========================================================

import Usuarios
  from '../modules/Usuario/pages/Usuarios.vue';

import ListarUsuarios
  from '../modules/Usuario/pages/ListarUsuarios.vue';

import RegistroUsuarios
  from '../modules/Usuario/pages/RegistroUsuarios.vue';


// =========================================================
// ÓRDENES DE TRABAJO
// =========================================================

import OrdenTrabajo
  from '../modules/OrdenTrabajo/pages/OrdenTrabajo.vue';

import OrdenTrabajoLista
  from '../modules/OrdenTrabajo/pages/ListaOrdenTrabajo.vue';

import OrdenTrabajoRegistrar
  from '../modules/OrdenTrabajo/pages/RegistrarOrdenTrabajo.vue';


// =========================================================
// PRODUCTOS
// =========================================================

import Producto
  from '../modules/Producto/components/Producto.vue';

import ListaProductos
  from '../modules/Producto/components/ListaProductos.vue';

import RegistrarProducto
  from '../modules/Producto/components/RegistrarProducto.vue';


// =========================================================
// PROVEEDORES
// =========================================================

import Proveedor
  from '../modules/Proveedor/components/Proveedor.vue';

import ListaProveedor
  from '../modules/Proveedor/components/ListaProveedor.vue';

import RegistroProveedor
  from '../modules/Proveedor/components/RegistroProveedor.vue';


// =========================================================
// INFORMES
// =========================================================

import Desratizacion
  from '../modules/InformeIPM/pages/Desratizacion.vue';

import InformeLista
  from '../modules/InformeIPM/pages/ListaInforme.vue';

import InformeRegistrar
  from '../modules/InformeIPM/pages/RegistrarInforme.vue';

import RegistrarInforme
  from '../modules/InformeIPM/pages/RegistrarInforme.vue';


// =========================================================
// FACTURAS
// =========================================================

import Factura
  from '../modules/Factura/Pages/Factura.vue';

import ListaFacturas
  from '../modules/Factura/Pages/ListarFacturas.vue';


// =========================================================
// CALENDARIO
// =========================================================

import Calendario
  from '../modules/Calendario/Page/CalendarioPage.vue';

  import RegistrarAgenda
  from '../modules/Calendario/Page/RegistrarAgenda.vue';


// =========================================================
// GASTOS
// =========================================================

import GastosDashboard
  from '../modules/Gastos/pages/GastosDashboard.vue';

import RegistrarGasto
  from '../modules/Gastos/pages/RegistrarGasto.vue';


// =========================================================
// OTROS
// =========================================================

import CargarArchivo
  from '../components/CargarArchivo.vue';


// =========================================================
// RUTAS
// =========================================================

const routes = [

  // =====================================================
  // WEB PÚBLICA
  // =====================================================

  {
    path: '/',
    component: HomePublic,
    meta: {
      requiresAuth: false,
      public: true
    }
  },

// =====================================================
// CALENDARIO
// =====================================================

{
  path: '/calendario',
  component: Calendario,
  meta: {
    requiresAuth: true
  }
},

{
  path: '/agenda/registrar',
  name: 'RegistrarAgenda',
  component: RegistrarAgenda,
  meta: {
    requiresAuth: true
  }
},
  // =====================================================
  // LOGIN / RECUPERACIÓN
  // =====================================================

  {
    path: '/login',
    component: Login,
    meta: {
      requiresAuth: false,
      public: true
    }
  },

  {
    path: '/recuperar_contrasenia',
    component: RecuperarContrasenia,
    meta: {
      requiresAuth: false,
      public: true
    }
  },

  {
    path: '/cambiar_contrasenia/:correo/:token',
    component: CambioContrasenia,
    meta: {
      requiresAuth: false,
      public: true
    }
  },


  // =====================================================
  // HOME PRIVADO
  // =====================================================

  {
    path: '/inicio',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // CLIENTES
  // =====================================================

  {
    path: '/clientes',
    component: Clientes,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/clientes_lista',
    component: ListarClientes,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/cliente_registrar',
    component: RegistroClientes,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/cliente_ver/:id',
    component: RegistroClientes,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/portal-cliente",
    component: PortalCliente,
    meta: {
      requiresAuth: true,
      roles: [
        "CLIENTE"
      ]
    }
  },


  // =====================================================
  // USUARIOS
  // =====================================================

  {
    path: '/usuarios',
    component: Usuarios,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/usuarios_lista',
    component: ListarUsuarios,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/usuario_ver/:id',
    component: RegistroUsuarios,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/usuario_registro',
    component: RegistroUsuarios,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // ÓRDENES DE TRABAJO
  // =====================================================

  {
    path: '/orden_trabajo',
    component: OrdenTrabajo,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/orden_trabajo_lista',
    component: OrdenTrabajoLista,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/orden_trabajo_registro',
    component: OrdenTrabajoRegistrar,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/orden_trabajo_ver/:id',
    component: OrdenTrabajoRegistrar,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // PRODUCTOS
  // =====================================================

  {
    path: '/productos',
    component: Producto,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/productos_lista',
    component: ListaProductos,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/producto_registro',
    component: RegistrarProducto,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/producto_ver/:id',
    component: RegistrarProducto,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // PROVEEDORES
  // =====================================================

  {
    path: '/proveedores',
    component: Proveedor,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/proveedores_lista',
    component: ListaProveedor,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/proveedor_registrar',
    component: RegistroProveedor,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/proveedor_ver/:id',
    component: RegistroProveedor,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // GASTOS
  // =====================================================

  {
    path: '/gastos',
    component: GastosDashboard,
    meta: {
      requiresAuth: true,
      roles: [
        'ADMIN'
      ]
    }
  },

  {
    path: '/gastos/registrar',
    component: RegistrarGasto,
    meta: {
      requiresAuth: true,
      roles: [
        'ADMIN'
      ]
    }
  },

  {
    path: '/gastos/editar/:id',
    component: RegistrarGasto,
    meta: {
      requiresAuth: true,
      roles: [
        'ADMIN'
      ]
    }
  },


  // =====================================================
  // FACTURAS
  // =====================================================

  {
    path: '/factura',
    component: Factura,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/factura/ver/:id',
    component: Factura,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/factura/editar/:id',
    component: Factura,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/facturas_lista',
    component: ListaFacturas,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // INFORMES
  // =====================================================

  {
    path: '/informe_lista',
    component: InformeLista,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/informe_registrar',
    component: InformeRegistrar,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/informe_ver/:id',
    component: RegistrarInforme,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/desratizacion/:id',
    component: Desratizacion,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // CALENDARIO
  // =====================================================

  {
    path: '/calendario',
    component: Calendario,
    meta: {
      requiresAuth: true
    }
  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }

];


// =========================================================
// ROUTER
// =========================================================

const router =
  createRouter({

    history:
      createWebHashHistory(),

    routes

  });


// =========================================================
// GUARD GLOBAL
// =========================================================

router.beforeEach(
  (
    to,
    from,
    next
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );


    const userType =
      String(
        localStorage.getItem(
          "userType"
        )
        ||
        ""
      )
        .trim()
        .toUpperCase();


    const isAuthenticated =
      !!token;


    // =====================================================
    // RUTAS PÚBLICAS
    // =====================================================

    /*
     * La página pública "/" SIEMPRE puede visitarse,
     * incluso si el usuario ya inició sesión.
     *
     * Eso permite que un administrador o técnico pueda
     * volver al sitio corporativo sin cerrar sesión.
     */

    if (
      to.meta.public
      &&
      to.path !== "/login"
    ) {

      return next();
    }


    // =====================================================
    // NO AUTENTICADO INTENTANDO ENTRAR A PRIVADO
    // =====================================================

    if (
      to.meta.requiresAuth
      &&
      !isAuthenticated
    ) {

      return next(
        "/login"
      );
    }


    // =====================================================
    // YA AUTENTICADO INTENTANDO IR A LOGIN
    // =====================================================

    if (
      to.path === "/login"
      &&
      isAuthenticated
    ) {

      if (
        userType === "CLIENTE"
      ) {

        return next(
          "/portal-cliente"
        );
      }


      if (
        userType === "TECNICO"
      ) {

        return next(
          "/calendario"
        );
      }


      if (
        userType === "ADMIN"
      ) {

        return next(
          "/inicio"
        );
      }


      /*
       * Si existe un token pero el rol ya no es válido,
       * limpiamos la sesión.
       */

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "userId"
      );

      localStorage.removeItem(
        "userType"
      );

      localStorage.removeItem(
        "userName"
      );

      localStorage.removeItem(
        "userEmail"
      );

      localStorage.removeItem(
        "clienteId"
      );


      return next(
        "/login"
      );
    }


    // =====================================================
    // RUTAS CON ROLES ESPECÍFICOS
    // =====================================================

    if (
      to.meta.roles
      &&
      !to.meta.roles.includes(
        userType
      )
    ) {

      if (
        userType === "CLIENTE"
      ) {

        return next(
          "/portal-cliente"
        );
      }


      if (
        userType === "TECNICO"
      ) {

        return next(
          "/calendario"
        );
      }


      if (
        userType === "ADMIN"
      ) {

        return next(
          "/inicio"
        );
      }


      return next(
        "/login"
      );
    }


    // =====================================================
    // BLOQUEAR CLIENTE DEL SISTEMA ADMINISTRATIVO
    // =====================================================

    /*
     * Permitimos "/" porque ahora también existe
     * una página pública.
     */

    if (
      userType === "CLIENTE"
      &&
      to.meta.requiresAuth
      &&
      to.path !== "/portal-cliente"
    ) {

      return next(
        "/portal-cliente"
      );
    }


    // =====================================================
    // CONTINUAR
    // =====================================================

    next();

  }
);


export default router;