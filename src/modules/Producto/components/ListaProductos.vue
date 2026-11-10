<template>
  <div class="products-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>
        <span class="page-eyebrow">
          INVENTARIO
        </span>

        <h1>
          Productos
        </h1>

        <p>
          Administra los productos, existencias, unidades de medida
          y proveedores utilizados por Fumidez.
        </p>
      </div>


      <button
        type="button"
        class="primary-button"
        @click="redirigirCrearProducto"
      >
        <i class="bi bi-plus-lg"></i>
        Nuevo producto
      </button>

    </section>


    <!-- ===================================================== -->
    <!-- RESUMEN -->
    <!-- ===================================================== -->

    <section class="summary-grid">

      <div class="summary-card">

        <div class="summary-icon blue">
          <i class="bi bi-box-seam"></i>
        </div>

        <div>
          <span>Productos registrados</span>

          <strong>
            {{ productos.length }}
          </strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon purple">
          <i class="bi bi-truck"></i>
        </div>

        <div>
          <span>Proveedores relacionados</span>

          <strong>
            {{ proveedoresUtilizados }}
          </strong>
        </div>

      </div>


      <div class="summary-card">

        <div class="summary-icon green">
          <i class="bi bi-grid"></i>
        </div>

        <div>
          <span>Unidades utilizadas</span>

          <strong>
            {{ unidadesUtilizadas }}
          </strong>
        </div>

      </div>

    </section>
<section
  v-if="productosStockBajo.length > 0"
  class="stock-alert"
>
  <div class="stock-alert-icon">
    <i class="bi bi-exclamation-triangle-fill"></i>
  </div>

  <div class="stock-alert-content">

    <span class="stock-alert-eyebrow">
      ATENCIÓN DE INVENTARIO
    </span>

    <strong>
      {{
        productosStockBajo.length === 1
          ? "Hay 1 producto con stock bajo"
          : `Hay ${productosStockBajo.length} productos con stock bajo`
      }}
    </strong>

    <p>
      Revise las existencias para evitar quedarse sin productos
      durante los servicios programados.
    </p>

  </div>

  <div class="stock-alert-count">
    {{ productosStockBajo.length }}
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
        @click="cargarDatos"
      >
        Reintentar
      </button>
    </div>


    <!-- ===================================================== -->
    <!-- CONTENIDO -->
    <!-- ===================================================== -->

    <section class="products-panel">

      <!-- CABECERA -->

      <div class="panel-header">

        <div>

          <h2>
            Inventario de productos
          </h2>

          <p>
            {{ productosFiltrados.length }}
            {{
              productosFiltrados.length === 1
                ? "producto encontrado"
                : "productos encontrados"
            }}
          </p>

        </div>


        <button
          type="button"
          class="refresh-button"
          :disabled="cargando"
          @click="cargarDatos"
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
            placeholder="Buscar por nombre, proveedor o unidad..."
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
          v-model="filtroProveedor"
          class="filter-select"
        >
          <option value="">
            Todos los proveedores
          </option>

          <option
            v-for="proveedor in proveedores"
            :key="proveedor.id"
            :value="String(proveedor.id)"
          >
            {{ proveedor.nombre }}
          </option>
        </select>


        <select
          v-model="filtroUnidad"
          class="filter-select"
        >
          <option value="">
            Todas las unidades
          </option>

          <option
            v-for="unidad in unidadesDisponibles"
            :key="unidad"
            :value="unidad"
          >
            {{ formatearUnidadMedida(unidad) }}
          </option>
        </select>


        <button
          v-if="hayFiltros"
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

        <span>
          Cargando productos...
        </span>
      </div>


      <!-- ================================================= -->
      <!-- SIN RESULTADOS -->
      <!-- ================================================= -->

      <div
        v-else-if="productosFiltrados.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          <i class="bi bi-box-seam"></i>
        </div>

        <h3>
          {{
            productos.length === 0
              ? "No hay productos registrados"
              : "No encontramos productos"
          }}
        </h3>

        <p>
          {{
            productos.length === 0
              ? "Crea el primer producto para comenzar a gestionar el inventario."
              : "Prueba cambiando los filtros o el texto de búsqueda."
          }}
        </p>


        <button
          v-if="productos.length === 0"
          type="button"
          class="primary-button"
          @click="redirigirCrearProducto"
        >
          <i class="bi bi-plus-lg"></i>
          Crear producto
        </button>


        <button
          v-else
          type="button"
          class="secondary-button"
          @click="limpiarFiltros"
        >
          Limpiar filtros
        </button>

      </div>


      <!-- ================================================= -->
      <!-- TABLA -->
      <!-- ================================================= -->

      <template v-else>

        <div class="table-wrapper">

          <table class="products-table">

            <thead>

              <tr>

                <th class="id-column">
                  #
                </th>


                <th
                  class="sortable"
                  @click="ordenar('nombre')"
                >
                  Producto

                  <i
                    :class="iconoOrden('nombre')"
                  ></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('cantidad')"
                >
                  Existencia

                  <i
                    :class="iconoOrden('cantidad')"
                  ></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('unidadMedida')"
                >
                  Unidad

                  <i
                    :class="iconoOrden('unidadMedida')"
                  ></i>
                </th>


                <th
                  class="sortable"
                  @click="ordenar('precio')"
                >
                  Precio

                  <i
                    :class="iconoOrden('precio')"
                  ></i>
                </th>


                <th>
                  Proveedor
                </th>


                <th class="actions-column">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

         <tr
  v-for="(producto, index) in productosPaginados"
  :key="producto.id"
  :class="{
    'low-stock-row': estaEnStockBajo(producto)
  }"
>
                <td class="product-number">

                  {{
                    indiceInicial + index + 1
                  }}

                </td>


                <!-- PRODUCTO -->

                <td>

                  <div class="product-info">

                    <div class="product-avatar">
                      {{
                        obtenerIniciales(
                          producto.nombre
                        )
                      }}
                    </div>

                    <div>

                      <strong>
                        {{ producto.nombre }}
                      </strong>

                      <span>
                        ID {{ producto.id }}
                      </span>

                    </div>

                  </div>

                </td>


                <!-- EXISTENCIA -->

           <td>

  <div class="stock-cell">

    <strong
      class="quantity-value"
      :class="{
        'quantity-low':
          estaEnStockBajo(producto)
      }"
    >
      {{ formatearCantidad(producto.cantidad) }}
    </strong>


    <span
      v-if="estaEnStockBajo(producto)"
      class="low-stock-badge"
    >
      <i class="bi bi-exclamation-circle-fill"></i>

      Stock bajo
    </span>

  </div>

</td>


                <!-- UNIDAD -->

                <td>

                  <span class="unit-badge">
                    {{
                      formatearUnidadMedida(
                        producto.unidadMedida
                      )
                    }}
                  </span>

                </td>


                <!-- PRECIO -->

                <td>

                  <strong class="price-value">
                    {{ formatearPrecio(producto.precio) }}
                  </strong>

                </td>


                <!-- PROVEEDOR -->

                <td>

                  <div class="supplier-cell">

                    <i class="bi bi-building"></i>

                    <span>
                      {{
                        obtenerNombreProveedor(
                          producto.idProveedor
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
                      class="action-button view"
                      title="Ver / Editar producto"
                      @click="verProducto(producto.id)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>


                    <button
                      type="button"
                      class="action-button delete"
                      title="Eliminar producto"
                      @click="solicitarEliminar(producto)"
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
        <!-- FOOTER / PAGINACIÓN -->
        <!-- ================================================= -->

        <div class="table-footer">

          <div class="page-size">

            <span>
              Mostrar
            </span>

            <select
              v-model.number="productosPorPagina"
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
              {{ productosFiltrados.length }}
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
              :disabled="
                paginaActual === totalPaginas
              "
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
      v-if="productoAEliminar"
      class="modal-backdrop-custom"
      @click.self="cancelarEliminar"
    >

      <div class="delete-modal">

        <div class="delete-icon">
          <i class="bi bi-trash3"></i>
        </div>


        <h3>
          ¿Eliminar producto?
        </h3>


        <p>
          Está a punto de eliminar
          <strong>
            {{ productoAEliminar.nombre }}
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
  obtenerTodosLosProveedorsFachada
} from "../../Proveedor/helpers/proveedoresHelpers";

import {
  obtenerTodosLosProductosFachada,
  eliminarProductoFachada
} from "../helpers/productosHelpers";


export default {

  name: "ListarProducto",


  data() {

    return {

      productos: [],
      proveedores: [],
stockMinimo: 5,
      filtro: "",
      filtroProveedor: "",
      filtroUnidad: "",

      paginaActual: 1,
      productosPorPagina: 10,

      columnaOrdenada: "nombre",
      ordenAscendente: true,

      cargando: false,
      eliminando: false,

      mensajeExito: "",
      mensajeError: "",

      productoAEliminar: null

    };

  },


  computed: {

    // =====================================================
    // UNIDADES DISPONIBLES
    // =====================================================
productosStockBajo() {
  return this.productos.filter(
    producto =>
      producto.cantidad !== null &&
      producto.cantidad !== undefined &&
      Number(producto.cantidad) <= this.stockMinimo
  );
},
    unidadesDisponibles() {

      return [
        ...new Set(
          this.productos
            .map(
              producto =>
                producto.unidadMedida
            )
            .filter(Boolean)
        )
      ].sort();

    },


    // =====================================================
    // RESUMEN
    // =====================================================

    proveedoresUtilizados() {

      return new Set(
        this.productos
          .map(
            producto =>
              producto.idProveedor
          )
          .filter(Boolean)
      ).size;

    },


    unidadesUtilizadas() {

      return this.unidadesDisponibles.length;

    },


    // =====================================================
    // FILTROS
    // =====================================================

    hayFiltros() {

      return Boolean(
        this.filtro
        ||
        this.filtroProveedor
        ||
        this.filtroUnidad
      );

    },


    productosFiltrados() {

      const texto =
        this.normalizarTexto(
          this.filtro
        );


      return this.productos.filter(
        producto => {

          const nombreProveedor =
            this.obtenerNombreProveedor(
              producto.idProveedor
            );


          const textoProducto =
            this.normalizarTexto(
              [
                producto.nombre,
                producto.precio,
                producto.unidadMedida,
                nombreProveedor
              ]
                .filter(Boolean)
                .join(" ")
            );


          const coincideTexto =
            !texto
            ||
            textoProducto.includes(texto);


          const coincideProveedor =
            !this.filtroProveedor
            ||
            String(producto.idProveedor)
              ===
            String(this.filtroProveedor);


          const coincideUnidad =
            !this.filtroUnidad
            ||
            producto.unidadMedida
              ===
            this.filtroUnidad;


          return (
            coincideTexto
            &&
            coincideProveedor
            &&
            coincideUnidad
          );

        }
      );

    },


    // =====================================================
    // ORDENAMIENTO
    // =====================================================

    productosOrdenados() {

      const lista =
        [...this.productosFiltrados];


      const columna =
        this.columnaOrdenada;


      if (!columna) {

        return lista;

      }


      return lista.sort(
        (a, b) => {

          let valorA =
            a[columna];

          let valorB =
            b[columna];


          if (
            columna === "cantidad"
            ||
            columna === "precio"
            ||
            columna === "id"
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
          this.productosOrdenados.length
          /
          this.productosPorPagina
        )
      );

    },


    indiceInicial() {

      return (
        (this.paginaActual - 1)
        *
        this.productosPorPagina
      );

    },


    indiceFinal() {

      return Math.min(
        this.indiceInicial
        +
        this.productosPorPagina,
        this.productosFiltrados.length
      );

    },


    productosPaginados() {

      return this.productosOrdenados.slice(
        this.indiceInicial,
        this.indiceFinal
      );

    }

  },


  watch: {

    filtro() {

      this.paginaActual = 1;

    },


    filtroProveedor() {

      this.paginaActual = 1;

    },


    filtroUnidad() {

      this.paginaActual = 1;

    },


    totalPaginas(nuevoTotal) {

      if (
        this.paginaActual
        >
        nuevoTotal
      ) {

        this.paginaActual =
          nuevoTotal;

      }

    }

  },


  mounted() {

    this.cargarDatos();

  },


  methods: {
    estaEnStockBajo(producto) {
  return (
    producto.cantidad !== null &&
    producto.cantidad !== undefined &&
    Number(producto.cantidad) <= this.stockMinimo
  );
},

    // =====================================================
    // CARGA
    // =====================================================

    async cargarDatos() {

      this.cargando = true;

      this.mensajeError = "";


      try {

        const [
          productos,
          proveedores
        ] =
          await Promise.all([
            obtenerTodosLosProductosFachada(),
            obtenerTodosLosProveedorsFachada()
          ]);


        this.productos =
          Array.isArray(productos)
            ? productos
            : [];


        this.proveedores =
          Array.isArray(proveedores)
            ? proveedores
            : [];


      } catch (error) {

        console.error(
          "Error cargando productos:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el inventario de productos.";

      } finally {

        this.cargando = false;

      }

    },


    // =====================================================
    // PROVEEDOR
    // =====================================================

    obtenerNombreProveedor(
      idProveedor
    ) {

      const proveedor =
        this.proveedores.find(
          proveedor =>
            String(proveedor.id)
            ===
            String(idProveedor)
        );


      return proveedor
        ? proveedor.nombre
        : "Sin proveedor";

    },


    // =====================================================
    // UNIDAD
    // =====================================================

    formatearUnidadMedida(
      unidad
    ) {

      const unidades = {

        GALON:
          "Galón",

        BOTELLA:
          "Botella",

        LITRO:
          "Litro",

        CAJA:
          "Caja",

        UNIDAD:
          "Unidad",

        FRASCO:
          "Frasco",

        GR:
          "Gramos (g)",

        KG:
          "Kilogramos (kg)",

        ML:
          "Mililitros (ml)",

        PAQUETE:
          "Paquete"

      };


      return unidades[unidad]
        ||
        unidad
        ||
        "Sin unidad";

    },


    // =====================================================
    // FORMATO
    // =====================================================

    formatearCantidad(
      cantidad
    ) {

      const numero =
        Number(cantidad);


      if (
        Number.isNaN(numero)
      ) {

        return "0";

      }


      return new Intl.NumberFormat(
        "es-EC",
        {
          maximumFractionDigits: 2
        }
      ).format(numero);

    },


    formatearPrecio(
      precio
    ) {

      const numero =
        Number(precio);


      if (
        Number.isNaN(numero)
      ) {

        return "$0.00";

      }


      return new Intl.NumberFormat(
        "es-EC",
        {
          style: "currency",
          currency: "USD"
        }
      ).format(numero);

    },


    obtenerIniciales(
      nombre
    ) {

      if (!nombre) {

        return "P";

      }


      return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
          palabra =>
            palabra[0]
        )
        .join("")
        .toUpperCase();

    },


    // =====================================================
    // ORDEN
    // =====================================================

    ordenar(
      columna
    ) {

      if (
        this.columnaOrdenada
        ===
        columna
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


    iconoOrden(
      columna
    ) {

      if (
        this.columnaOrdenada
        !==
        columna
      ) {

        return "bi bi-arrow-down-up sort-neutral";

      }


      return this.ordenAscendente
        ? "bi bi-arrow-up sort-active"
        : "bi bi-arrow-down sort-active";

    },


    // =====================================================
    // FILTROS
    // =====================================================

    limpiarFiltros() {

      this.filtro = "";

      this.filtroProveedor = "";

      this.filtroUnidad = "";

      this.paginaActual = 1;

    },


    normalizarTexto(
      valor
    ) {

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
    // PAGINACIÓN
    // =====================================================

    cambiarPagina(
      pagina
    ) {

      if (
        pagina >= 1
        &&
        pagina <= this.totalPaginas
      ) {

        this.paginaActual =
          pagina;

      }

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirCrearProducto() {

      this.$router.push(
        "/producto_registro"
      );

    },


    verProducto(
      id
    ) {

      this.$router.push(
        `/producto_ver/${id}`
      );

    },


    // =====================================================
    // ELIMINAR
    // =====================================================

    solicitarEliminar(
      producto
    ) {

      this.productoAEliminar =
        producto;

    },


    cancelarEliminar() {

      if (this.eliminando) {

        return;

      }


      this.productoAEliminar =
        null;

    },


    async confirmarEliminar() {

      if (
        !this.productoAEliminar
      ) {

        return;

      }


      this.eliminando = true;

      this.mensajeError = "";


      try {

        await eliminarProductoFachada(
          this.productoAEliminar.id
        );


        const nombre =
          this.productoAEliminar.nombre;


        this.productoAEliminar =
          null;


        this.mensajeExito =
          `Producto "${nombre}" eliminado correctamente.`;


        await this.cargarDatos();


        setTimeout(
          () => {

            this.mensajeExito = "";

          },
          4000
        );


      } catch (error) {

        console.error(
          "Error eliminando producto:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar el producto. Puede estar relacionado con otros registros.";

      } finally {

        this.eliminando = false;

      }

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.products-page {
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

  margin:
    0 auto 22px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 20px;

  padding: 28px 30px;

  border:
    1px solid #e2e8f0;

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

  letter-spacing:
    0.15em;
}


.page-header h1 {
  margin: 0;

  color: #123b6d;

  font-size: 2rem;

  font-weight: 800;
}


.page-header p {
  max-width: 680px;

  margin:
    7px 0 0;

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

  padding:
    0 15px;

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
  border:
    1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;
}


.primary-button:hover {
  background: #1d4ed8;

  transform:
    translateY(-1px);

  box-shadow:
    0 5px 14px
    rgba(37, 99, 235, 0.2);
}


.secondary-button {
  border:
    1px solid #d8e0ea;

  background: #ffffff;

  color: #475569;
}


.danger-button {
  border:
    1px solid #dc2626;

  background: #dc2626;

  color: #ffffff;
}


/* ========================================================= */
/* RESUMEN */
/* ========================================================= */

.summary-grid {
  max-width: 1450px;

  margin:
    0 auto 22px;

  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 14px;
}


.summary-card {
  display: flex;

  align-items: center;

  gap: 14px;

  min-height: 105px;

  padding: 20px;

  border:
    1px solid #e2e8f0;

  border-radius: 16px;

  background: #ffffff;

  box-shadow:
    0 6px 18px
    rgba(15, 23, 42, 0.04);
}


.summary-icon {
  width: 52px;

  height: 52px;

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


/* ========================================================= */
/* PANEL */
/* ========================================================= */

.products-panel {
  max-width: 1450px;

  margin: 0 auto;

  padding: 25px;

  border:
    1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);
}


.panel-header {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

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
  margin:
    4px 0 0;

  color: #94a3b8;

  font-size: 0.72rem;
}


.refresh-button {
  border:
    1px solid #bfdbfe;

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
    220px
    190px
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

  transform:
    translateY(-50%);

  color: #94a3b8;
}


.search-box input,
.filter-select {
  width: 100%;

  height: 43px;

  border:
    1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  color: #334155;

  outline: none;

  font-size: 0.78rem;
}


.search-box input {
  padding:
    0 40px
    0 40px;
}


.filter-select {
  padding:
    0 11px;
}


.search-box input:focus,
.filter-select:focus {
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

  transform:
    translateY(-50%);

  border: none;

  border-radius: 7px;

  background:
    transparent;

  color: #94a3b8;
}


.clear-filters-button {
  min-height: 43px;

  padding:
    0 12px;

  border:
    1px solid #dce4ee;

  border-radius: 10px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.73rem;

  font-weight: 700;
}


/* ========================================================= */
/* TABLA */
/* ========================================================= */

.table-wrapper {
  width: 100%;

  overflow-x: auto;

  border:
    1px solid #e8edf3;

  border-radius: 13px;
}


.products-table {
  width: 100%;

  min-width: 900px;

  border-collapse:
    collapse;
}


.products-table th {
  padding:
    13px 14px;

  border-bottom:
    1px solid #dde5ee;

  background: #f3f7fc;

  color: #53657c;

  font-size: 0.66rem;

  font-weight: 800;

  text-align: left;

  text-transform:
    uppercase;

  letter-spacing:
    0.025em;

  white-space: nowrap;
}
/* ========================================================= */
/* ALERTA STOCK */
/* ========================================================= */

.stock-alert {
  max-width: 1450px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 17px 20px;

  border: 1px solid #fecaca;

  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #fff7f7,
      #fffafa
    );

  box-shadow:
    0 5px 16px
    rgba(220, 38, 38, 0.05);
}


.stock-alert-icon {
  width: 47px;

  height: 47px;

  min-width: 47px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #fee2e2;

  color: #dc2626;

  font-size: 1.15rem;
}


.stock-alert-content {
  flex: 1;
}


.stock-alert-eyebrow {
  display: block;

  margin-bottom: 2px;

  color: #dc2626;

  font-size: 0.58rem;

  font-weight: 900;

  letter-spacing: 0.1em;
}


.stock-alert-content strong {
  display: block;

  color: #991b1b;

  font-size: 0.82rem;

  font-weight: 800;
}


.stock-alert-content p {
  margin: 3px 0 0;

  color: #7f1d1d;

  font-size: 0.68rem;

  line-height: 1.45;
}


.stock-alert-count {
  min-width: 39px;

  height: 39px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #dc2626;

  color: #ffffff;

  font-size: 0.82rem;

  font-weight: 900;
}


/* ========================================================= */
/* STOCK BAJO EN TABLA */
/* ========================================================= */

.products-table tbody tr.low-stock-row {
  background: #fff7f7;
}


.products-table tbody tr.low-stock-row:hover {
  background: #fff1f2;
}


.products-table tbody tr.low-stock-row td:first-child {
  border-left: 3px solid #ef4444;
}


.stock-cell {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 7px;
}


.quantity-low {
  color: #dc2626 !important;
}


.low-stock-badge {
  display: inline-flex;

  align-items: center;

  gap: 4px;

  padding: 4px 7px;

  border: 1px solid #fecaca;

  border-radius: 999px;

  background: #fef2f2;

  color: #dc2626;

  font-size: 0.58rem;

  font-weight: 800;

  white-space: nowrap;
}

.products-table td {
  padding:
    14px;

  border-bottom:
    1px solid #edf1f5;

  color: #475569;

  font-size: 0.76rem;

  vertical-align: middle;
}


.products-table tbody tr:last-child td {
  border-bottom: none;
}


.products-table tbody tr {
  transition:
    background 0.15s ease;
}


.products-table tbody tr:hover {
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
  width: 105px;

  text-align: center !important;
}


.product-number {
  color: #94a3b8 !important;

  font-weight: 700;
}


/* ========================================================= */
/* PRODUCTO */
/* ========================================================= */

.product-info {
  display: flex;

  align-items: center;

  gap: 10px;
}


.product-avatar {
  width: 38px;

  height: 38px;

  min-width: 38px;

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

  font-size: 0.68rem;

  font-weight: 900;
}


.product-info strong {
  display: block;

  color: #25364d;

  font-size: 0.78rem;

  font-weight: 800;
}


.product-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.59rem;
}


.quantity-value {
  color: #334155;

  font-weight: 800;
}


.price-value {
  color: #166534;

  font-weight: 800;
}


.unit-badge {
  display: inline-flex;

  padding:
    5px 8px;

  border-radius:
    999px;

  background: #f1f5f9;

  color: #475569;

  font-size: 0.65rem;

  font-weight: 700;
}


.supplier-cell {
  display: flex;

  align-items: center;

  gap: 7px;
}


.supplier-cell i {
  color: #94a3b8;
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

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}


.action-button.view {
  border:
    1px solid #bfdbfe;

  color: #2563eb;
}


.action-button.view:hover {
  background: #eff6ff;

  transform:
    translateY(-1px);
}


.action-button.delete {
  border:
    1px solid #fecaca;

  color: #dc2626;
}


.action-button.delete:hover {
  background: #fef2f2;

  transform:
    translateY(-1px);
}


/* ========================================================= */
/* PAGINACIÓN */
/* ========================================================= */

.table-footer {
  display: grid;

  grid-template-columns:
    1fr
    auto
    1fr;

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

  padding:
    0 7px;

  border:
    1px solid #dce4ee;

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

  justify-content:
    flex-end;

  gap: 10px;

  color: #64748b;

  font-size: 0.69rem;
}


.pagination button {
  width: 34px;

  height: 34px;

  border:
    1px solid #dce4ee;

  border-radius: 8px;

  background: #ffffff;

  color: #475569;
}


.pagination button:disabled {
  opacity: 0.4;

  cursor:
    not-allowed;
}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.message {
  max-width: 1450px;

  margin:
    0 auto 18px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    12px 15px;

  border-radius: 11px;

  font-size: 0.75rem;

  font-weight: 600;
}


.message span {
  flex: 1;
}


.success-message {
  border:
    1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;
}


.error-message {
  border:
    1px solid #fecaca;

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
  max-width: 460px;

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

  backdrop-filter:
    blur(4px);
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

  margin:
    0 auto 14px;

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
  margin:
    10px 0 4px;

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

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 22px;
}


/* ========================================================= */
/* ANIMACIÓN */
/* ========================================================= */

.rotating {
  animation:
    rotation
    1s linear infinite;
}


@keyframes rotation {
  to {
    transform:
      rotate(360deg);
  }
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 1000px) {

  .filters {
    grid-template-columns:
      1fr 1fr;
  }


  .summary-grid {
    grid-template-columns:
      1fr;
  }

}


@media (max-width: 700px) {

  .products-page {
    padding: 16px;
  }


  .page-header {
    flex-direction:
      column;

    align-items:
      flex-start;

    padding: 22px;
  }


  .page-header .primary-button {
    width: 100%;
  }


  .filters {
    grid-template-columns:
      1fr;
  }


  .table-footer {
    grid-template-columns:
      1fr;

    justify-items:
      center;
  }


  .pagination {
    justify-content:
      center;
  }


  .page-size {
    justify-content:
      center;
  }

}

</style>