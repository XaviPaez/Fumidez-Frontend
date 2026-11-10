<template>
  <div class="product-form-page">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div>

        <button
          type="button"
          class="back-link"
          @click="redirigirListadoProducto"
        >
          <i class="bi bi-arrow-left"></i>
          Volver a productos
        </button>


        <span class="page-eyebrow">
          INVENTARIO
        </span>


        <h1>
          {{ esEdicion ? "Editar producto" : "Nuevo producto" }}
        </h1>


        <p>
          {{
            esEdicion
              ? "Actualiza la información comercial y de inventario del producto."
              : "Registra un nuevo producto utilizado en las operaciones de Fumidez."
          }}
        </p>

      </div>


      <div class="header-status">

        <span
          class="mode-badge"
          :class="esEdicion ? 'edit' : 'new'"
        >
          <i
            class="bi"
            :class="
              esEdicion
                ? 'bi-pencil-square'
                : 'bi-plus-circle'
            "
          ></i>

          {{
            esEdicion
              ? "Modo edición"
              : "Nuevo registro"
          }}
        </span>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- MENSAJES -->
    <!-- ===================================================== -->

    <div
      v-if="mensajeConfirmacion"
      class="message success-message"
    >
      <i class="bi bi-check-circle-fill"></i>

      <div>
        <strong>Operación exitosa</strong>

        <span>
          {{ mensajeConfirmacion }}
        </span>
      </div>
    </div>


    <div
      v-if="mensajeError"
      class="message error-message"
    >
      <i class="bi bi-exclamation-circle-fill"></i>

      <div>
        <strong>No se pudo completar la operación</strong>

        <span>
          {{ mensajeError }}
        </span>
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- CARGANDO PRODUCTO -->
    <!-- ===================================================== -->

    <div
      v-if="cargandoInicial"
      class="loading-card"
    >

      <div class="spinner-border text-primary"></div>

      <span>
        Cargando información del producto...
      </span>

    </div>


    <!-- ===================================================== -->
    <!-- CONTENIDO -->
    <!-- ===================================================== -->

    <div
      v-else
      class="form-layout"
    >

      <!-- =================================================== -->
      <!-- FORMULARIO -->
      <!-- =================================================== -->

      <section class="form-card">

        <div class="section-header">

          <div class="section-icon">
            <i class="bi bi-box-seam"></i>
          </div>

          <div>
            <h2>
              Información del producto
            </h2>

            <p>
              Complete los datos principales del producto.
            </p>
          </div>

        </div>


        <form
          novalidate
          @submit.prevent="guardarProducto"
        >

          <!-- ================================================= -->
          <!-- NOMBRE -->
          <!-- ================================================= -->

          <div class="form-field full-width">

            <label for="nombre">
              Nombre del producto
              <span class="required">*</span>
            </label>


            <div
              class="input-wrapper"
              :class="{
                invalid: errores.nombre
              }"
            >

              <i class="bi bi-tag"></i>

              <input
                id="nombre"
                v-model.trim="producto.nombre"
                type="text"
                maxlength="120"
                placeholder="Ej. Insecticida concentrado"
                @input="limpiarError('nombre')"
              />

            </div>


            <div class="field-footer">

              <span
                v-if="errores.nombre"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.nombre }}
              </span>

              <span
                v-else
                class="field-help"
              >
                Utiliza un nombre claro y reconocible.
              </span>


              <span class="character-counter">
                {{ producto.nombre.length }}/120
              </span>

            </div>

          </div>


          <div class="fields-grid">

            <!-- ================================================= -->
            <!-- CANTIDAD -->
            <!-- ================================================= -->

            <div class="form-field">

              <label for="cantidad">
                Existencia actual
                <span class="required">*</span>
              </label>


              <div
                class="input-wrapper"
                :class="{
                  invalid: errores.cantidad
                }"
              >

                <i class="bi bi-boxes"></i>

                <input
                  id="cantidad"
                  v-model="producto.cantidad"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  @input="limpiarError('cantidad')"
                />

              </div>


              <span
                v-if="errores.cantidad"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.cantidad }}
              </span>

              <span
                v-else
                class="field-help"
              >
                Cantidad disponible actualmente.
              </span>

            </div>


            <!-- ================================================= -->
            <!-- UNIDAD -->
            <!-- ================================================= -->

            <div class="form-field">

              <label for="unidadMedida">
                Unidad de medida
                <span class="required">*</span>
              </label>


              <div
                class="input-wrapper select-wrapper"
                :class="{
                  invalid: errores.unidadMedida
                }"
              >

                <i class="bi bi-rulers"></i>

                <select
                  id="unidadMedida"
                  v-model="producto.unidadMedida"
                  @change="limpiarError('unidadMedida')"
                >

                  <option
                    disabled
                    value=""
                  >
                    Seleccione una unidad
                  </option>


                  <option
                    v-for="unidad in unidadesMedida"
                    :key="unidad"
                    :value="unidad"
                  >
                    {{ formatearUnidadMedida(unidad) }}
                  </option>

                </select>

              </div>


              <span
                v-if="errores.unidadMedida"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.unidadMedida }}
              </span>

              <span
                v-else
                class="field-help"
              >
                Unidad utilizada para controlar la existencia.
              </span>

            </div>


            <!-- ================================================= -->
            <!-- PRECIO -->
            <!-- ================================================= -->

            <div class="form-field">

              <label for="precio">
                Precio unitario
                <span class="required">*</span>
              </label>


              <div
                class="input-wrapper"
                :class="{
                  invalid: errores.precio
                }"
              >

                <span class="currency-prefix">
                  $
                </span>

                <input
                  id="precio"
                  v-model="producto.precio"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  @input="limpiarError('precio')"
                />

              </div>


              <span
                v-if="errores.precio"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.precio }}
              </span>

              <span
                v-else
                class="field-help"
              >
                Precio unitario registrado en USD.
              </span>

            </div>


            <!-- ================================================= -->
            <!-- PROVEEDOR -->
            <!-- ================================================= -->

            <div class="form-field">

              <label for="idProveedor">
                Proveedor
                <span class="required">*</span>
              </label>


              <div
                class="input-wrapper select-wrapper"
                :class="{
                  invalid: errores.idProveedor
                }"
              >

                <i class="bi bi-truck"></i>

                <select
                  id="idProveedor"
                  v-model="producto.idProveedor"
                  @change="limpiarError('idProveedor')"
                >

                  <option
                    disabled
                    :value="null"
                  >
                    Seleccione un proveedor
                  </option>


                  <option
                    v-for="proveedor in proveedores"
                    :key="proveedor.id"
                    :value="proveedor.id"
                  >
                    {{ proveedor.nombre }}
                  </option>

                </select>

              </div>


              <span
                v-if="errores.idProveedor"
                class="field-error"
              >
                <i class="bi bi-exclamation-circle"></i>
                {{ errores.idProveedor }}
              </span>

              <span
                v-else-if="proveedores.length === 0"
                class="field-warning"
              >
                No existen proveedores registrados.
              </span>

              <span
                v-else
                class="field-help"
              >
                Proveedor principal de este producto.
              </span>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- NOTA DE INVENTARIO -->
          <!-- ================================================= -->

          <div class="inventory-note">

            <i class="bi bi-info-circle"></i>

            <div>

              <strong>
                Control de inventario
              </strong>

              <p>
                La cantidad registrada representa la existencia
                disponible. Los límites de stock mínimo se configurarán
                posteriormente según las unidades y políticas definidas
                por Fumidez.
              </p>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- ACCIONES -->
          <!-- ================================================= -->

          <div class="form-actions">

            <button
              type="button"
              class="secondary-button"
              :disabled="guardando"
              @click="redirigirListadoProducto"
            >
              Cancelar
            </button>


            <button
              type="submit"
              class="primary-button"
              :disabled="
                guardando
                ||
                unidadesMedida.length === 0
                ||
                proveedores.length === 0
              "
            >

              <span
                v-if="guardando"
                class="spinner-border spinner-border-sm"
              ></span>

              <i
                v-else
                class="bi"
                :class="
                  esEdicion
                    ? 'bi-check-lg'
                    : 'bi-plus-lg'
                "
              ></i>


              {{
                guardando
                  ? "Guardando..."
                  : esEdicion
                    ? "Guardar cambios"
                    : "Crear producto"
              }}

            </button>

          </div>

        </form>

      </section>


      <!-- =================================================== -->
      <!-- VISTA PREVIA -->
      <!-- =================================================== -->

      <aside class="preview-column">

        <section class="preview-card">

          <div class="preview-header">

            <span>
              VISTA PREVIA
            </span>

            <i class="bi bi-eye"></i>

          </div>


          <div class="product-preview-icon">

            <span>
              {{ inicialesProducto }}
            </span>

          </div>


          <h3>
            {{ producto.nombre || "Nuevo producto" }}
          </h3>


          <p class="preview-provider">
            <i class="bi bi-building"></i>

            {{ nombreProveedorSeleccionado }}
          </p>


          <div class="preview-divider"></div>


          <div class="preview-details">

            <div>

              <span>
                Existencia
              </span>

              <strong>
                {{ cantidadVistaPrevia }}
              </strong>

            </div>


            <div>

              <span>
                Unidad
              </span>

              <strong>
                {{
                  producto.unidadMedida
                    ? formatearUnidadMedida(producto.unidadMedida)
                    : "Sin definir"
                }}
              </strong>

            </div>


            <div>

              <span>
                Precio
              </span>

              <strong class="price-preview">
                {{ precioVistaPrevia }}
              </strong>

            </div>


            <div>

              <span>
                Estado
              </span>

              <strong class="record-status">
                {{
                  esEdicion
                    ? "Registrado"
                    : "Nuevo"
                }}
              </strong>

            </div>

          </div>

        </section>


        <!-- ================================================= -->
        <!-- CONSEJOS -->
        <!-- ================================================= -->

        <section class="tips-card">

          <div class="tips-title">

            <i class="bi bi-lightbulb"></i>

            <strong>
              Recomendaciones
            </strong>

          </div>


          <ul>

            <li>
              Utiliza nombres consistentes para evitar productos duplicados.
            </li>

            <li>
              Verifica la unidad de medida antes de guardar.
            </li>

            <li>
              Mantén actualizado el proveedor principal.
            </li>

          </ul>

        </section>

      </aside>

    </div>

  </div>
</template>


<script>
import {
  obtenerTodosLosProveedorsFachada
} from "../../Proveedor/helpers/proveedoresHelpers";

import {
  crearProductoFachada,
  actualizarProductoFachada,
  obtenerProductoFachada,
  obtenerUnidadesMedida
} from "../helpers/productosHelpers";


export default {

  name: "ProductoFormulario",


  data() {

    return {

      producto: {
        id: null,
        nombre: "",
        cantidad: null,
        unidadMedida: "",
        precio: null,
        idProveedor: null
      },

      proveedores: [],

      unidadesMedida: [],

      productoId:
        this.$route.params.id
        || null,

      cargandoInicial: false,

      guardando: false,

      mensajeConfirmacion: "",

      mensajeError: "",

      errores: {
        nombre: "",
        cantidad: "",
        unidadMedida: "",
        precio: "",
        idProveedor: ""
      }

    };

  },


  computed: {

    // =====================================================
    // EDICIÓN
    // =====================================================

    esEdicion() {

      return Boolean(
        this.productoId
      );

    },


    // =====================================================
    // PROVEEDOR
    // =====================================================

    nombreProveedorSeleccionado() {

      if (
        !this.producto.idProveedor
      ) {

        return "Proveedor no seleccionado";

      }


      const proveedor =
        this.proveedores.find(
          item =>
            String(item.id)
            ===
            String(this.producto.idProveedor)
        );


      return proveedor
        ? proveedor.nombre
        : "Proveedor no disponible";

    },


    // =====================================================
    // INICIALES
    // =====================================================

    inicialesProducto() {

      const nombre =
        this.producto.nombre
          ?.trim();


      if (!nombre) {

        return "P";

      }


      return nombre
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
    // PREVIEW CANTIDAD
    // =====================================================

    cantidadVistaPrevia() {

      if (
        this.producto.cantidad === null
        ||
        this.producto.cantidad === ""
      ) {

        return "0";

      }


      const numero =
        Number(
          this.producto.cantidad
        );


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


    // =====================================================
    // PREVIEW PRECIO
    // =====================================================

    precioVistaPrevia() {

      const numero =
        Number(
          this.producto.precio
        );


      if (
        Number.isNaN(numero)
        ||
        this.producto.precio === null
        ||
        this.producto.precio === ""
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

    }

  },


  async mounted() {

    await this.cargarFormulario();

  },


  methods: {

    // =====================================================
    // CARGA GENERAL
    // =====================================================

    async cargarFormulario() {

      this.cargandoInicial =
        true;

      this.mensajeError =
        "";


      try {

        const [
          proveedores,
          unidades
        ] =
          await Promise.all([
            obtenerTodosLosProveedorsFachada(),
            obtenerUnidadesMedida()
          ]);


        this.proveedores =
          Array.isArray(proveedores)
            ? proveedores
            : [];


        this.unidadesMedida =
          Array.isArray(unidades)
            ? unidades
            : [];


        if (this.esEdicion) {

          await this.cargarProducto();

        }


      } catch (error) {

        console.error(
          "Error cargando formulario de producto:",
          error
        );


        this.mensajeError =
          "No se pudo cargar la información necesaria para el formulario.";

      } finally {

        this.cargandoInicial =
          false;

      }

    },


    // =====================================================
    // CARGAR PRODUCTO
    // =====================================================

    async cargarProducto() {

      try {

        const producto =
          await obtenerProductoFachada(
            this.productoId
          );


        this.producto = {

          id:
            producto.id,

          nombre:
            producto.nombre
            || "",

          cantidad:
            producto.cantidad
            ?? null,

          unidadMedida:
            producto.unidadMedida
            || "",

          precio:
            producto.precio
            ?? null,

          idProveedor:
            producto.idProveedor
            ?? null

        };


      } catch (error) {

        console.error(
          "Error cargando producto:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el producto solicitado.";

      }

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
        unidad;

    },


    // =====================================================
    // VALIDACIÓN
    // =====================================================

    validarFormulario() {

      this.errores = {
        nombre: "",
        cantidad: "",
        unidadMedida: "",
        precio: "",
        idProveedor: ""
      };


      let valido =
        true;


      // NOMBRE

      if (
        !this.producto.nombre
        ||
        !this.producto.nombre.trim()
      ) {

        this.errores.nombre =
          "Ingrese el nombre del producto.";

        valido = false;

      }


      // CANTIDAD

      if (
        this.producto.cantidad === null
        ||
        this.producto.cantidad === ""
      ) {

        this.errores.cantidad =
          "Ingrese la existencia actual.";

        valido = false;

      } else if (
        Number(this.producto.cantidad)
        <
        0
      ) {

        this.errores.cantidad =
          "La existencia no puede ser negativa.";

        valido = false;

      }


      // UNIDAD

      if (
        !this.producto.unidadMedida
      ) {

        this.errores.unidadMedida =
          "Seleccione una unidad de medida.";

        valido = false;

      }


      // PRECIO

      if (
        this.producto.precio === null
        ||
        this.producto.precio === ""
      ) {

        this.errores.precio =
          "Ingrese el precio del producto.";

        valido = false;

      } else if (
        Number(this.producto.precio)
        <
        0
      ) {

        this.errores.precio =
          "El precio no puede ser negativo.";

        valido = false;

      }


      // PROVEEDOR

      if (
        !this.producto.idProveedor
      ) {

        this.errores.idProveedor =
          "Seleccione un proveedor.";

        valido = false;

      }


      return valido;

    },


    limpiarError(
      campo
    ) {

      if (
        this.errores[campo]
      ) {

        this.errores[campo] =
          "";

      }


      this.mensajeError =
        "";

      this.mensajeConfirmacion =
        "";

    },


    // =====================================================
    // GUARDAR
    // =====================================================

    async guardarProducto() {

      this.mensajeConfirmacion =
        "";

      this.mensajeError =
        "";


      if (
        !this.validarFormulario()
      ) {

        this.mensajeError =
          "Revise los campos marcados antes de continuar.";

        return;

      }


      this.guardando =
        true;


      const bodyProducto = {

        id:
          this.producto.id,

        nombre:
          this.producto.nombre.trim(),

        cantidad:
          Number(
            this.producto.cantidad
          ),

        unidadMedida:
          this.producto.unidadMedida,

        precio:
          Number(
            this.producto.precio
          ),

        idProveedor:
          Number(
            this.producto.idProveedor
          )

      };


      try {

        if (this.esEdicion) {

          await actualizarProductoFachada(
            this.productoId,
            bodyProducto
          );


          this.mensajeConfirmacion =
            "El producto fue actualizado correctamente.";


          await this.cargarProducto();


        } else {

          await crearProductoFachada(
            bodyProducto
          );


          this.mensajeConfirmacion =
            "El producto fue creado correctamente.";


          this.resetProducto();

        }


      } catch (error) {

        console.error(
          "Error guardando producto:",
          error
        );


        const mensajeBackend =
          typeof error.response?.data
          ===
          "string"
            ? error.response.data
            : null;


        this.mensajeError =
          mensajeBackend
          ||
          (
            this.esEdicion
              ? "No se pudo actualizar el producto."
              : "No se pudo crear el producto."
          );

      } finally {

        this.guardando =
          false;

      }

    },


    // =====================================================
    // RESET
    // =====================================================

    resetProducto() {

      this.producto = {

        id: null,

        nombre: "",

        cantidad: null,

        unidadMedida: "",

        precio: null,

        idProveedor: null

      };


      this.errores = {

        nombre: "",

        cantidad: "",

        unidadMedida: "",

        precio: "",

        idProveedor: ""

      };

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirListadoProducto() {

      this.$router.push(
        "/productos_lista"
      );

    }

  }

};
</script>


<style scoped>

/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.product-form-page {

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

  max-width: 1300px;

  margin:
    0 auto 22px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 20px;

  padding:
    27px 30px;

  border:
    1px solid #e2e8f0;

  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, 0.06);

}


.back-link {

  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-bottom: 14px;

  padding: 0;

  border: none;

  background: transparent;

  color: #64748b;

  font-size: 0.72rem;

  font-weight: 700;

  cursor: pointer;

}


.back-link:hover {

  color: #2563eb;

}


.page-eyebrow {

  display: block;

  margin-bottom: 5px;

  color: #2563eb;

  font-size: 0.66rem;

  font-weight: 800;

  letter-spacing: 0.15em;

}


.page-header h1 {

  margin: 0;

  color: #123b6d;

  font-size: 1.9rem;

  font-weight: 800;

}


.page-header p {

  max-width: 650px;

  margin: 7px 0 0;

  color: #64748b;

  font-size: 0.84rem;

  line-height: 1.5;

}


.mode-badge {

  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding:
    8px 12px;

  border-radius:
    999px;

  font-size: 0.7rem;

  font-weight: 800;

}


.mode-badge.new {

  border:
    1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;

}


.mode-badge.edit {

  border:
    1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;

}


/* ========================================================= */
/* LAYOUT */
/* ========================================================= */

.form-layout {

  max-width: 1300px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.7fr)
    minmax(280px, 0.8fr);

  gap: 20px;

  align-items:
    start;

}


/* ========================================================= */
/* FORMULARIO */
/* ========================================================= */

.form-card,
.preview-card,
.tips-card {

  border:
    1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 8px 24px
    rgba(15, 23, 42, 0.05);

}


.form-card {

  padding: 28px;

}


.section-header {

  display: flex;

  align-items: center;

  gap: 13px;

  margin-bottom: 26px;

  padding-bottom: 19px;

  border-bottom:
    1px solid #edf1f5;

}


.section-icon {

  width: 46px;

  height: 46px;

  min-width: 46px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 1.15rem;

}


.section-header h2 {

  margin: 0;

  color: #25364d;

  font-size: 1.05rem;

  font-weight: 800;

}


.section-header p {

  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.7rem;

}


/* ========================================================= */
/* CAMPOS */
/* ========================================================= */

.fields-grid {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap:
    20px 18px;

}


.form-field {

  display: flex;

  flex-direction: column;

}


.form-field.full-width {

  margin-bottom: 20px;

}


.form-field label {

  margin-bottom: 7px;

  color: #475569;

  font-size: 0.72rem;

  font-weight: 800;

}


.required {

  color: #dc2626;

}


.input-wrapper {

  position: relative;

  height: 46px;

  display: flex;

  align-items: center;

  border:
    1px solid #dce4ee;

  border-radius: 10px;

  background: #f8fafc;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

}


.input-wrapper:focus-within {

  border-color: #93b4ed;

  background: #ffffff;

  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.06);

}


.input-wrapper.invalid {

  border-color: #fca5a5;

  background: #fffafa;

}


.input-wrapper > i {

  position: absolute;

  left: 13px;

  color: #94a3b8;

  font-size: 0.85rem;

  pointer-events: none;

}


.input-wrapper input,
.input-wrapper select {

  width: 100%;

  height: 100%;

  border: none;

  outline: none;

  background: transparent;

  color: #334155;

  font-size: 0.79rem;

}


.input-wrapper input {

  padding:
    0 13px
    0 39px;

}


.input-wrapper select {

  padding:
    0 37px
    0 39px;

  appearance: auto;

}


.currency-prefix {

  position: absolute;

  left: 14px;

  color: #16a34a;

  font-size: 0.82rem;

  font-weight: 800;

}


.input-wrapper:has(.currency-prefix) input {

  padding-left: 32px;

}


/* ========================================================= */
/* HELPERS */
/* ========================================================= */

.field-footer {

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 10px;

  margin-top: 5px;

}


.field-help,
.field-error,
.field-warning,
.character-counter {

  margin-top: 5px;

  font-size: 0.62rem;

}


.field-help {

  color: #94a3b8;

}


.field-error {

  display: flex;

  align-items: center;

  gap: 4px;

  color: #dc2626;

  font-weight: 600;

}


.field-warning {

  color: #d97706;

}


.character-counter {

  flex-shrink: 0;

  color: #c0cad6;

}


/* ========================================================= */
/* NOTA */
/* ========================================================= */

.inventory-note {

  display: flex;

  align-items:
    flex-start;

  gap: 11px;

  margin-top: 24px;

  padding: 14px 15px;

  border:
    1px solid #bfdbfe;

  border-radius: 11px;

  background: #f8fbff;

}


.inventory-note > i {

  margin-top: 1px;

  color: #2563eb;

}


.inventory-note strong {

  display: block;

  color: #1e40af;

  font-size: 0.72rem;

}


.inventory-note p {

  margin: 3px 0 0;

  color: #64748b;

  font-size: 0.67rem;

  line-height: 1.5;

}


/* ========================================================= */
/* BOTONES */
/* ========================================================= */

.form-actions {

  display: flex;

  justify-content:
    flex-end;

  gap: 10px;

  margin-top: 25px;

  padding-top: 20px;

  border-top:
    1px solid #edf1f5;

}


.primary-button,
.secondary-button {

  min-height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding:
    0 16px;

  border-radius: 10px;

  font-size: 0.74rem;

  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;

}


.primary-button {

  min-width: 150px;

  border:
    1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;

}


.primary-button:hover:not(:disabled) {

  background: #1d4ed8;

  transform:
    translateY(-1px);

}


.primary-button:disabled {

  opacity: 0.55;

  cursor: not-allowed;

}


.secondary-button {

  border:
    1px solid #d8e0ea;

  background: #ffffff;

  color: #475569;

}


/* ========================================================= */
/* PREVIEW */
/* ========================================================= */

.preview-column {

  position: sticky;

  top: 100px;

  display: flex;

  flex-direction: column;

  gap: 15px;

}


.preview-card {

  padding: 23px;

}


.preview-header {

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  margin-bottom: 20px;

  color: #94a3b8;

  font-size: 0.6rem;

  font-weight: 800;

  letter-spacing: 0.11em;

}


.product-preview-icon {

  width: 68px;

  height: 68px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 16px;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #eff6ff,
      #dbeafe
    );

  color: #2563eb;

  font-size: 1.15rem;

  font-weight: 900;

}


.preview-card h3 {

  margin: 0;

  color: #25364d;

  font-size: 1.05rem;

  font-weight: 800;

  word-break: break-word;

}


.preview-provider {

  display: flex;

  align-items: center;

  gap: 6px;

  margin: 6px 0 0;

  color: #64748b;

  font-size: 0.7rem;

}


.preview-divider {

  height: 1px;

  margin:
    19px 0;

  background: #edf1f5;

}


.preview-details {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 14px;

}


.preview-details span {

  display: block;

  color: #94a3b8;

  font-size: 0.59rem;

  font-weight: 700;

  text-transform: uppercase;

}


.preview-details strong {

  display: block;

  margin-top: 3px;

  color: #334155;

  font-size: 0.74rem;

}


.preview-details .price-preview {

  color: #15803d;

}


.record-status {

  color: #2563eb !important;

}


/* ========================================================= */
/* TIPS */
/* ========================================================= */

.tips-card {

  padding: 18px 20px;

}


.tips-title {

  display: flex;

  align-items: center;

  gap: 7px;

  color: #475569;

  font-size: 0.72rem;

}


.tips-title i {

  color: #d97706;

}


.tips-card ul {

  margin:
    12px 0 0;

  padding-left: 18px;

  color: #64748b;

  font-size: 0.66rem;

  line-height: 1.6;

}


/* ========================================================= */
/* MENSAJES */
/* ========================================================= */

.message {

  max-width: 1300px;

  margin:
    0 auto 18px;

  display: flex;

  align-items:
    flex-start;

  gap: 10px;

  padding: 13px 15px;

  border-radius: 11px;

}


.message > i {

  margin-top: 2px;

}


.message strong {

  display: block;

  font-size: 0.72rem;

}


.message span {

  display: block;

  margin-top: 2px;

  font-size: 0.67rem;

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


/* ========================================================= */
/* LOADING */
/* ========================================================= */

.loading-card {

  max-width: 1300px;

  min-height: 300px;

  margin: 0 auto;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 11px;

  border:
    1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.74rem;

}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 950px) {

  .form-layout {

    grid-template-columns:
      1fr;

  }


  .preview-column {

    position: static;

  }

}


@media (max-width: 650px) {

  .product-form-page {

    padding: 16px;

  }


  .page-header {

    flex-direction: column;

    align-items: flex-start;

    padding: 21px;

  }


  .fields-grid {

    grid-template-columns:
      1fr;

  }


  .form-card {

    padding: 20px;

  }


  .form-actions {

    display: grid;

    grid-template-columns:
      1fr;

  }


  .primary-button,
  .secondary-button {

    width: 100%;

  }


  .preview-details {

    grid-template-columns:
      1fr;

  }

}

</style>