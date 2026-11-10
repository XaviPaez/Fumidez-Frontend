<template>
  <div class="ipm-page">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <section class="page-header">

      <div class="header-main">

        <button type="button" class="back-button" @click="redirigirListadoInforme">
          <i class="bi bi-arrow-left"></i>
        </button>

        <div>
          <span class="eyebrow">
            INFORME TÉCNICO
          </span>

          <h1>
            {{ ver_informe ? "Editar Informe IPM" : "Nuevo Informe IPM" }}
          </h1>

          <p>
            Registra la información técnica, procedimientos,
            productos utilizados y evidencia del servicio.
          </p>
        </div>

      </div>


      <div v-if="ver_informe" class="report-reference">
        <span>INFORME</span>
        <strong>#{{ informeId }}</strong>
      </div>

    </section>


    <!-- ===================================================== -->
    <!-- NAVEGACIÓN DEL FORMULARIO -->
    <!-- ===================================================== -->

    <nav class="form-navigation">

      <button type="button" @click="irASeccion('datos-generales')">
        <span>01</span>
        Datos generales
      </button>

      <button type="button" @click="irASeccion('procedimientos')">
        <span>02</span>
        Procedimientos
      </button>

      <button type="button" @click="irASeccion('plagas')">
        <span>03</span>
        Plagas y productos
      </button>

      <button type="button" @click="irASeccion('sanitizacion')">
        <span>04</span>
        Sanitización
      </button>

      <button type="button" @click="irASeccion('evidencias')">
        <span>05</span>
        Evidencias
      </button>

    </nav>


    <!-- ===================================================== -->
    <!-- MENSAJES -->
    <!-- ===================================================== -->

    <div v-if="mensajeConfirmacion" class="message success-message">
      <i class="bi bi-check-circle-fill"></i>

      <div>
        <strong>Operación exitosa</strong>
        <span>{{ mensajeConfirmacion }}</span>
      </div>
    </div>


    <div v-if="mensajeError" class="message error-message" :class="{ 'stock-error': esErrorStock }">
      <i class="bi" :class="esErrorStock
        ? 'bi-box-seam-fill'
        : 'bi-exclamation-circle-fill'
        "></i>

      <div>
        <strong>
          {{
            esErrorStock
              ? "Stock insuficiente"
              : "No se pudo guardar el informe"
          }}
        </strong>

        <span>
          {{ mensajeError }}
        </span>
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- LOADING -->
    <!-- ===================================================== -->

    <div v-if="cargando" class="loading-card">
      <div class="spinner-border text-primary"></div>

      <span>
        Cargando información del informe...
      </span>
    </div>


    <!-- ===================================================== -->
    <!-- FORMULARIO -->
    <!-- ===================================================== -->

    <form v-else @submit.prevent="submitForm" class="form-content">

      <!-- =================================================== -->
      <!-- 01 DATOS GENERALES -->
      <!-- =================================================== -->

      <section id="datos-generales" class="form-card">

        <div class="section-header">

          <div class="section-icon blue">
            <i class="bi bi-file-earmark-text"></i>
          </div>

          <div>
            <span class="section-number">01</span>

            <h2>
              Datos generales
            </h2>

            <p>
              Información principal del informe y la orden asociada.
            </p>
          </div>

        </div>


        <div class="form-grid">

          <!-- ORDEN -->

          <div class="field-group">

            <label for="ordenSelect">
              Orden de trabajo
              <span class="required">*</span>
            </label>

            <div class="input-wrapper select-wrapper">

              <i class="bi bi-clipboard-check"></i>

              <select id="ordenSelect" v-model="informe.idOrden" required>
                <option disabled value="">
                  Seleccione una orden
                </option>

                <option v-for="orden in ordenes" :key="orden.id" :value="orden.id">
                  {{
                    orden.numeroOrden
                    || `OT-${orden.id}`
                  }}
                </option>
              </select>

            </div>

            <span v-if="ordenes.length === 0" class="field-warning">
              No existen órdenes disponibles.
            </span>

          </div>


          <!-- FACTURA -->

          <div class="field-group">

            <label for="numFactura">
              Número de factura
              <span class="required">*</span>
            </label>

            <div class="input-wrapper">

              <i class="bi bi-receipt"></i>

              <input id="numFactura" v-model.trim="informe.numFactura" type="text" maxlength="80" required
                placeholder="Ej. FAC-2026-001" />

            </div>

          </div>


          <!-- FRECUENCIA -->

          <div class="field-group">

            <label for="frecuencia">
              Frecuencia
              <span class="required">*</span>
            </label>

            <div class="input-wrapper select-wrapper">

              <i class="bi bi-arrow-repeat"></i>

              <select id="frecuencia" v-model="informe.frecuencia" required>
                <option disabled value="">
                  Seleccione una frecuencia
                </option>

                <option v-for="frecuencia in frecuencias" :key="frecuencia" :value="frecuencia">
                  {{ frecuencia }}
                </option>
              </select>

            </div>

          </div>


          <!-- TIEMPO -->

          <div class="field-group">

            <label for="tiempo">
              Tiempo empleado
              <span class="required">*</span>
            </label>

            <div class="input-wrapper">

              <i class="bi bi-clock"></i>

              <input id="tiempo" v-model="informe.tiempo" type="time" required />

            </div>

          </div>


          <!-- PRECIO -->

          <div class="field-group">

            <label for="precio">
              Precio
              <span class="required">*</span>
            </label>

            <div class="input-wrapper">

              <i class="bi bi-currency-dollar"></i>

              <input id="precio" v-model.number="informe.precio" type="number" min="0" step="0.01" required
                placeholder="0.00" />

            </div>

          </div>


          <!-- RESUMEN ORDEN -->

          <div v-if="ordenSeleccionada" class="order-preview">

            <span>
              ORDEN ASOCIADA
            </span>

            <strong>
              {{
                ordenSeleccionada.numeroOrden
                || `OT-${ordenSeleccionada.id}`
              }}
            </strong>

            <small>
              {{
                ordenSeleccionada.descripcion
                || "Sin descripción"
              }}
            </small>

          </div>


          <!-- OBSERVACION -->

          <div class="field-group full-width">

            <label for="observacion">
              Observaciones
              <span class="required">*</span>
            </label>

            <textarea id="observacion" v-model.trim="informe.observacion" maxlength="1500" rows="5" required
              placeholder="Registra los hallazgos y observaciones encontradas durante el servicio..."></textarea>

            <div class="field-footer">
              <span>
                Describe las condiciones observadas durante la inspección.
              </span>

              <span>
                {{ informe.observacion.length }}/1500
              </span>
            </div>

          </div>


          <!-- RECOMENDACIONES -->

          <div class="field-group full-width">

            <label for="recomendaciones">
              Recomendaciones
              <span class="required">*</span>
            </label>

            <textarea id="recomendaciones" v-model.trim="informe.recomendaciones" maxlength="1500" rows="5" required
              placeholder="Ingresa recomendaciones preventivas o correctivas para el cliente..."></textarea>

            <div class="field-footer">
              <span>
                Incluye recomendaciones claras para reducir riesgos futuros.
              </span>

              <span>
                {{ informe.recomendaciones.length }}/1500
              </span>
            </div>

          </div>

        </div>

      </section>


      <!-- =================================================== -->
      <!-- 02 PROCEDIMIENTOS -->
      <!-- =================================================== -->

      <section id="procedimientos" class="form-card">

        <div class="section-header section-header-actions">

          <div class="section-title-wrapper">

            <div class="section-icon purple">
              <i class="bi bi-tools"></i>
            </div>

            <div>
              <span class="section-number">02</span>

              <h2>
                Procedimientos aplicados
              </h2>

              <p>
                Selecciona las técnicas utilizadas durante el servicio.
              </p>
            </div>

          </div>


          <button type="button" class="add-button purple-button" @click="addProcedimiento">
            <i class="bi bi-plus-lg"></i>
            Añadir procedimiento
          </button>

        </div>


        <div class="procedures-list">

          <div v-for="(procedimiento, index) in informe.procedimientos" :key="index" class="procedure-row">

            <div class="item-number purple-number">
              {{ index + 1 }}
            </div>


            <div class="procedure-select">

              <label>
                Procedimiento {{ index + 1 }}
              </label>

              <select v-model="procedimiento.tipoProcedimiento" required>
                <option disabled value="">
                  Seleccione un procedimiento
                </option>

                <option v-for="(nombre, id) in procedimientosLista" :key="id" :value="id">
                  {{ nombre }}
                </option>
              </select>

            </div>


            <button type="button" class="remove-button" :disabled="informe.procedimientos.length === 1"
              @click="removeProcedimiento(index)">
              <i class="bi bi-trash3"></i>
            </button>

          </div>

        </div>

      </section>


      <!-- =================================================== -->
      <!-- 03 PLAGAS Y PRODUCTOS -->
      <!-- =================================================== -->

      <section id="plagas" class="form-card">

        <div class="section-header section-header-actions">

          <div class="section-title-wrapper">

            <div class="section-icon orange">
              <i class="bi bi-bug"></i>
            </div>

            <div>
              <span class="section-number">03</span>

              <h2>
                Plagas y productos utilizados
              </h2>

              <p>
                Registra cada plaga tratada y los productos consumidos.
              </p>
            </div>

          </div>


          <button type="button" class="add-button orange-button" @click="addPlaga">
            <i class="bi bi-plus-lg"></i>
            Añadir plaga
          </button>

        </div>


        <div class="pests-list">

          <article v-for="(plaga, plagaIndex) in informe.plagas" :key="plagaIndex" class="pest-card">

            <div class="pest-header">

              <div class="pest-title">

                <div class="pest-number">
                  {{ plagaIndex + 1 }}
                </div>

                <div>
                  <span>PLAGA</span>

                  <strong>
                    {{
                      plaga.tipoPlaga
                      || `Plaga ${plagaIndex + 1}`
                    }}
                  </strong>
                </div>

              </div>


              <button type="button" class="remove-pest-button" :disabled="informe.plagas.length === 1"
                @click="removePlaga(plagaIndex)">
                <i class="bi bi-trash3"></i>
                Eliminar plaga
              </button>

            </div>


            <div class="pest-type-field">

              <label>
                Tipo de plaga
                <span class="required">*</span>
              </label>

              <div class="input-wrapper">

                <i class="bi bi-bug"></i>

                <input v-model.trim="plaga.tipoPlaga" type="text" required
                  placeholder="Ej. Cucarachas, roedores, hormigas..." />

              </div>

            </div>


            <!-- PRODUCTOS -->

            <div class="products-section">

              <div class="products-header">

                <div>
                  <strong>
                    Productos utilizados
                  </strong>

                  <span>
                    Registra producto y cantidad aplicada.
                  </span>
                </div>


                <button type="button" class="small-add-button" @click="addProducto(plagaIndex)">
                  <i class="bi bi-plus-lg"></i>
                  Producto
                </button>

              </div>


              <div v-for="(producto, productoIndex) in plaga.cantidadProductoPlaga" :key="productoIndex"
                class="product-row" :class="{
                  'product-stock-warning':
                    tieneStockBajo(producto),

                  'product-stock-danger':
                    tieneStockInsuficiente(producto)
                }">

                <div class="product-index">
                  {{ productoIndex + 1 }}
                </div>


                <div class="product-field">

                  <label>
                    Producto
                    <span class="required">*</span>
                  </label>

                  <select v-model="producto.productoDto" required>
                    <option disabled value="">
                      Seleccione un producto
                    </option>

                    <option v-for="productoS in productos" :key="productoS.id" :value="productoS">
                      {{ productoS.nombre }}
                    </option>
                  </select>


                  <div v-if="producto.productoDto" class="stock-indicator" :class="claseStock(producto)">

                    <i :class="iconoStock(producto)"></i>


                    <span v-if="tieneStockInsuficiente(producto)">
                      Stock insuficiente:
                      disponible
                      {{ obtenerStockProducto(producto) }}
                    </span>


                    <span v-else-if="tieneStockBajo(producto)">
                      Stock bajo:
                      quedan
                      {{ obtenerStockProducto(producto) }}
                    </span>


                    <span v-else>
                      Stock disponible:
                      {{ obtenerStockProducto(producto) }}
                    </span>

                  </div>

                </div>


                <div class="quantity-field">

                  <label>
                    Cantidad
                    <span class="required">*</span>
                  </label>

                  <input v-model.number="producto.cantidadProducto" type="number" min="0" step="0.01" required
                    placeholder="0" />

                </div>


                <button type="button" class="remove-product-button" :disabled="plaga.cantidadProductoPlaga.length === 1
                  " @click="
                    removeProducto(
                      plagaIndex,
                      productoIndex
                    )
                    ">
                  <i class="bi bi-trash3"></i>
                </button>

              </div>

            </div>

          </article>

        </div>

      </section>


      <!-- =================================================== -->
      <!-- 04 SANITIZACIÓN -->
      <!-- =================================================== -->

      <section id="sanitizacion" class="form-card">

        <div class="section-header">

          <div class="section-icon green">
            <i class="bi bi-shield-check"></i>
          </div>

          <div>
            <span class="section-number">04</span>

            <h2>
              Evaluación de sanitización
            </h2>

            <p>
              Registra la valoración de las áreas evaluadas.
            </p>
          </div>

        </div>


        <div class="sanitization-grid">

          <!-- INTERNA -->

          <div class="sanitization-card">

            <div class="sanitization-title">
              <i class="bi bi-house"></i>

              <div>
                <span>ÁREA PRINCIPAL</span>
                <strong>Área interna</strong>
              </div>
            </div>


            <select v-model="informe.sanitizacionConfidenciales.areaInterna" required>
              <option disabled value="">
                Seleccione
              </option>

              <option v-for="n in 4" :key="n" :value="n">
                Nivel {{ n }}
              </option>
            </select>

          </div>


          <!-- EXTERNA -->

          <div class="sanitization-card">

            <div class="sanitization-title">
              <i class="bi bi-tree"></i>

              <div>
                <span>ÁREA PRINCIPAL</span>
                <strong>Área externa</strong>
              </div>
            </div>


            <select v-model="informe.sanitizacionConfidenciales.areaExterna" required>
              <option disabled value="">
                Seleccione
              </option>

              <option v-for="n in 4" :key="n" :value="n">
                Nivel {{ n }}
              </option>
            </select>

          </div>


          <!-- OPCIONAL 1 -->

          <div class="sanitization-card optional-area">

            <div class="sanitization-title">
              <i class="bi bi-geo-alt"></i>

              <div>
                <span>ÁREA ADICIONAL</span>
                <strong>Área opcional 1</strong>
              </div>
            </div>


            <input v-model.trim="informe
              .sanitizacionConfidenciales
              .areaNombreOpc1
              " type="text" placeholder="Nombre del área" />


            <select v-model="informe
              .sanitizacionConfidenciales
              .areaOpc1
              ">
              <option disabled value="">
                Sin valoración
              </option>

              <option v-for="n in 4" :key="n" :value="n">
                Nivel {{ n }}
              </option>
            </select>

          </div>


          <!-- OPCIONAL 2 -->

          <div class="sanitization-card optional-area">

            <div class="sanitization-title">
              <i class="bi bi-geo-alt"></i>

              <div>
                <span>ÁREA ADICIONAL</span>
                <strong>Área opcional 2</strong>
              </div>
            </div>


            <input v-model.trim="informe
              .sanitizacionConfidenciales
              .areaNombreOpc2
              " type="text" placeholder="Nombre del área" />


            <select v-model="informe
              .sanitizacionConfidenciales
              .areaOpc2
              ">
              <option disabled value="">
                Sin valoración
              </option>

              <option v-for="n in 4" :key="n" :value="n">
                Nivel {{ n }}
              </option>
            </select>

          </div>

        </div>


        <div class="scale-help">

          <i class="bi bi-info-circle"></i>

          <span>
            La escala conserva los valores actuales del sistema:
            niveles del 1 al 4.
          </span>

        </div>

      </section>


      <!-- =================================================== -->
      <!-- 05 EVIDENCIAS -->
      <!-- =================================================== -->

      <section id="evidencias" class="form-card">

        <div class="section-header section-header-actions">

          <div class="section-title-wrapper">

            <div class="section-icon photo">
              <i class="bi bi-images"></i>
            </div>

            <div>
              <span class="section-number">05</span>

              <h2>
                Evidencia fotográfica
              </h2>

              <p>
                Adjunta fotografías que documenten el servicio realizado.
              </p>
            </div>

          </div>


          <button type="button" class="add-button photo-button" @click="abrirModal">
            <i class="bi bi-camera"></i>

            Gestionar imágenes
          </button>

        </div>


        <div class="evidence-summary">

          <div class="evidence-icon">
            <i class="bi bi-images"></i>
          </div>


          <div>

            <strong>
              Fotografías del informe
            </strong>

            <span>
              {{
                fotos.length === 0
                  ? "Todavía no hay imágenes seleccionadas."
                  : `${fotos.length} ${fotos.length === 1
                    ? "imagen"
                    : "imágenes"
                  } asociadas o pendientes.`
              }}
            </span>

          </div>


          <button type="button" @click="abrirModal">
            Ver fotografías
          </button>

        </div>

      </section>


      <!-- =================================================== -->
      <!-- RESUMEN -->
      <!-- =================================================== -->

      <section class="report-summary">

        <div class="summary-heading">

          <div class="summary-icon-main">
            <i class="bi bi-clipboard-data"></i>
          </div>

          <div>
            <span>RESUMEN DEL INFORME</span>

            <strong>
              {{
                informe.numFactura
                || "Informe sin número de factura"
              }}
            </strong>
          </div>

        </div>


        <div class="summary-items">

          <div>
            <span>Orden</span>

            <strong>
              {{
                ordenSeleccionada?.numeroOrden
                || "Sin seleccionar"
              }}
            </strong>
          </div>


          <div>
            <span>Frecuencia</span>

            <strong>
              {{
                informe.frecuencia
                || "Sin definir"
              }}
            </strong>
          </div>


          <div>
            <span>Procedimientos</span>

            <strong>
              {{ cantidadProcedimientos }}
            </strong>
          </div>


          <div>
            <span>Plagas</span>

            <strong>
              {{ informe.plagas.length }}
            </strong>
          </div>


          <div>
            <span>Productos aplicados</span>

            <strong>
              {{ cantidadProductos }}
            </strong>
          </div>


          <div>
            <span>Precio</span>

            <strong class="price-summary">
              {{ formatearMoneda(informe.precio) }}
            </strong>
          </div>

        </div>

      </section>


      <!-- =================================================== -->
      <!-- BOTONES -->
      <!-- =================================================== -->

      <section class="form-actions">

        <button type="button" class="secondary-button" :disabled="guardando" @click="redirigirListadoInforme">
          <i class="bi bi-arrow-left"></i>
          Volver al listado
        </button>


        <button type="submit" class="primary-button" :disabled="guardando">

          <span v-if="guardando" class="spinner-border spinner-border-sm"></span>

          <i v-else class="bi bi-floppy"></i>


          {{
            guardando
              ? "Guardando..."
              : ver_informe
                ? "Guardar cambios"
                : "Guardar informe"
          }}

        </button>

      </section>

    </form>


    <!-- ===================================================== -->
    <!-- MODAL FOTOS -->
    <!-- ===================================================== -->

    <div v-if="isModalOpen" class="photo-modal-backdrop" @click.self="cerrarModal">

      <div class="photo-modal">

        <!-- HEADER -->

        <div class="photo-modal-header">

          <div>

            <span>
              EVIDENCIA FOTOGRÁFICA
            </span>

            <h3>
              Fotografías del informe
            </h3>

            <p>
              Agrega o revisa las evidencias fotográficas.
            </p>

          </div>


          <button type="button" class="modal-close" :disabled="guardandoFotos" @click="cerrarModal">
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <!-- BODY -->

        <div class="photo-modal-body">

          <div v-if="cargandoFotos" class="modal-loading">
            <div class="spinner-border text-primary"></div>

            <span>
              Cargando fotografías...
            </span>
          </div>


          <template v-else>

            <!-- EXISTENTES / PENDIENTES -->

            <div v-if="fotos.length > 0" class="photos-grid">

              <article v-for="(foto, index) in fotos" :key="foto.data?.id
                || `nueva-${index}`
                " class="photo-card">

                <div class="photo-image">

                  <img :src="foto.foto" alt="Evidencia fotográfica" />


                  <span class="photo-status" :class="foto.guardada
                    ? 'saved-photo'
                    : 'new-photo'
                    ">
                    {{
                      foto.guardada
                        ? "Guardada"
                        : "Nueva"
                    }}
                  </span>


                  <button type="button" class="photo-delete" @click="eliminarFoto(index, foto)">
                    <i class="bi bi-trash3"></i>
                  </button>

                </div>


                <div class="photo-info">

                  <strong>
                    {{
                      foto.data?.nombre
                      || foto.archivo?.name
                      || "Fotografía"
                    }}
                  </strong>

                  <span>
                    {{
                      foto.guardada
                        ? "Imagen asociada al informe"
                        : "Pendiente de guardar"
                    }}
                  </span>
                  <div class="photo-caption-field">

  <label>
    Pie de foto
  </label>

  <textarea
    v-model.trim="foto.pieImagen"
    rows="2"
    maxlength="255"
    placeholder="Describe brevemente esta fotografía..."
    :disabled="foto.guardada"
  ></textarea>

  <small>
    {{ (foto.pieImagen || "").length }}/255
  </small>

</div>

                  <div class="photo-caption-field">
                    <label>Pie de foto</label>

                    <input v-model.trim="foto.pieFoto" type="text" maxlength="255"
                      placeholder="Ej. Evidencia de presencia de plaga en área de producción" />
                  </div>

                </div>

              </article>

            </div>


            <div v-else class="empty-photos">
              <div>
                <i class="bi bi-camera"></i>
              </div>

              <strong>
                Sin fotografías
              </strong>

              <span>
                Selecciona imágenes para documentar el servicio.
              </span>
            </div>


            <!-- UPLOAD -->

            <label class="photo-upload-zone" for="photoInput">

              <input id="photoInput" type="file" accept="image/*" multiple hidden @change="manejarArchivo" />


              <div class="upload-icon">
                <i class="bi bi-cloud-arrow-up"></i>
              </div>


              <div>

                <strong>
                  Seleccionar fotografías
                </strong>

                <span>
                  Puedes seleccionar varias imágenes.
                </span>

              </div>

            </label>

          </template>

        </div>


        <!-- FOOTER -->

        <div class="photo-modal-footer">

          <span>
            {{ fotosNuevas.length }}
            {{
              fotosNuevas.length === 1
                ? "imagen nueva"
                : "imágenes nuevas"
            }}
          </span>


          <div>

            <button type="button" class="secondary-button" :disabled="guardandoFotos" @click="cerrarModal">
              Cerrar
            </button>


            <button type="button" class="primary-button" :disabled="fotosNuevas.length === 0
              ||
              guardandoFotos
              ||
              !informeId
              " @click="guardarFotos">

              <span v-if="guardandoFotos" class="spinner-border spinner-border-sm"></span>

              <i v-else class="bi bi-cloud-arrow-up"></i>

              {{
                guardandoFotos
                  ? "Guardando..."
                  : "Guardar fotografías"
              }}

            </button>

          </div>

        </div>


 <div
  v-if="!informeId"
  class="photo-save-info"
>
  <i class="bi bi-info-circle"></i>

  Las fotografías y sus pies de foto se guardarán
  automáticamente al crear el informe.
</div>

      </div>

    </div>

  </div>
</template>


<script>
import {
  obtenerTodosLosProductosFachada
} from "../../Producto/helpers/productosHelpers";

import {
  consultarOrdenFachada
} from "../../OrdenTrabajo/helpers/OrdenTrabajoHelper";

import {
  crearInformePlagaFachada,
  consultarInformePorIdFachada
} from "../helpers/informeHelper";

import {
  consultarFotosIdInformeFachada,
  eliminarFotoFachada,
  guardarFotosFachada
} from "../helpers/fotosHelper";

import {
  api
} from "@/config/api";


export default {

  name: "InformeIpmFormulario",


  data() {

    return {

      informeId:
        this.$route.params.id
        || null,

      ver_informe: false,

      cargando: true,

      guardando: false,

      isModalOpen: false,

      cargandoFotos: false,

      guardandoFotos: false,

      mensajeConfirmacion: "",

      mensajeError: "",

      esErrorStock: false,


      informe: {

        numFactura: "",

        observacion: "",

        recomendaciones: "",

        tiempo: "",

        frecuencia: "",

        precio: "",

        idOrden: "",


        sanitizacionConfidenciales: {

          areaInterna: "",

          areaExterna: "",

          areaOpc1: "",

          areaOpc2: "",

          areaNombreOpc1: "",

          areaNombreOpc2: ""

        },


        plagas: [

          {

            tipoPlaga: "",

            cantidadProductoPlaga: [

              {
                cantidadProducto: 0,
                productoDto: ""
              }

            ]

          }

        ],


        procedimientos: [

          {
            tipoProcedimiento: ""
          }

        ]

      },


      procedimientosLista: {

        0: "NEBULIZADOR TÉRMICO",

        1: "ASPERSOR MANUAL",

        2: "NEBULIZADOR UVL ELÉCTRICO DIINA FOG",

        3: "NEBULIZADOR MECÁNICO",

        4: "LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS",

        5: "BIOMONITORES PEGABLES",

        6: "ESTACIONES DE CEBADO",

        7: "CORDÓN SANITARIO PERIMETRAL",

        8: "NEBULIZADOR UVL ELECTRICO",

        9: "NEBULIZADOR MECÁNICO",

        10: "SANITIZACIÓN"

      },


      productos: [],

      ordenes: [],

      frecuencias: [
        "MENSUAL",
        "BIMENSUAL",
        "TRIMESTRAL",
        "OCASIONAL"
      ],


      fotos: []

    };

  },


  computed: {

    ordenSeleccionada() {

      return this.ordenes.find(
        orden =>
          String(orden.id)
          ===
          String(this.informe.idOrden)
      )
        || null;

    },


    cantidadProcedimientos() {

      return this.informe.procedimientos.filter(
        procedimiento =>
          procedimiento.tipoProcedimiento !== ""
          &&
          procedimiento.tipoProcedimiento !== null
          &&
          procedimiento.tipoProcedimiento !== undefined
      ).length;

    },


    cantidadProductos() {

      return this.informe.plagas.reduce(
        (total, plaga) =>
          total
          +
          plaga.cantidadProductoPlaga.filter(
            producto =>
              Boolean(producto.productoDto)
          ).length,
        0
      );

    },


    fotosNuevas() {

      return this.fotos.filter(
        foto =>
          !foto.guardada
      );

    }

  },


  async mounted() {

    await this.inicializarFormulario();

  },


  beforeUnmount() {

    this.liberarUrlsFotos();

  },


  methods: {

    // =====================================================
    // INICIALIZAR
    // =====================================================

    async inicializarFormulario() {

      this.cargando =
        true;


      try {

        await Promise.all([
          this.cargarProductos(),
          this.cargarOrdenes()
        ]);


        await this.consultarPorIdInforme();


      } catch (error) {

        console.error(
          "Error inicializando informe:",
          error
        );


        this.mensajeError =
          "No se pudo cargar la información necesaria para el informe.";

      } finally {

        this.cargando =
          false;

      }

    },


    // =====================================================
    // CARGAR INFORME
    // =====================================================

    async consultarPorIdInforme() {

      if (!this.informeId) {

        this.ver_informe =
          false;

        return;

      }


      try {

        const inf =
          await consultarInformePorIdFachada(
            this.informeId
          );


        this.informe = {

          numFactura:
            inf.numFactura
            || "",

          observacion:
            inf.observacion
            || "",

          recomendaciones:
            inf.recomendaciones
            || "",

          tiempo:
            inf.tiempo
            || "",

          frecuencia:
            inf.frecuencia
            || "",

          precio:
            inf.precio
            ?? "",


          idOrden:
            inf.ordenDto?.id
            ??
            inf.idOrden
            ??
            "",


          sanitizacionConfidenciales:

            inf.sanitizacionConfidencialDto
            ||
            {
              areaInterna: "",
              areaExterna: "",
              areaOpc1: "",
              areaOpc2: "",
              areaNombreOpc1: "",
              areaNombreOpc2: ""
            },


          plagas:

            (inf.plagaDtos || [])
              .map(
                plaga => ({

                  ...plaga,

                  cantidadProductoPlaga:

                    (
                      plaga.cantidadProductoPlaga
                      || []
                    )
                      .map(
                        producto => ({

                          cantidadProducto:
                            producto.cantidadProducto
                            ?? 0,

                          productoDto:

                            producto.productoDto?.id

                              ? this.productos.find(
                                p =>
                                  p.id
                                  ===
                                  producto.productoDto.id
                              )
                              || ""

                              : ""

                        })
                      )

                })
              ),


          procedimientos:

            inf.procedimientoDtos?.length

              ? inf.procedimientoDtos

              : [
                {
                  tipoProcedimiento: ""
                }
              ]

        };


        if (
          this.informe.plagas.length === 0
        ) {

          this.informe.plagas = [
            {
              tipoPlaga: "",
              cantidadProductoPlaga: [
                {
                  cantidadProducto: 0,
                  productoDto: ""
                }
              ]
            }
          ];

        }


        this.ver_informe =
          true;


      } catch (error) {

        console.error(
          "Error cargando informe:",
          error
        );


        this.mensajeError =
          "No se pudo cargar el informe solicitado.";

      }

    },


    // =====================================================
    // PRODUCTOS
    // =====================================================

    async cargarProductos() {

      const response =
        await obtenerTodosLosProductosFachada();


      this.productos =
        Array.isArray(response)
          ? response
          : [];

    },


    // =====================================================
    // ORDENES
    // =====================================================

    async cargarOrdenes() {

      const response =
        await consultarOrdenFachada();


      this.ordenes =
        Array.isArray(response)
          ? response
          : [];

    },


    // =====================================================
    // PROCEDIMIENTOS
    // =====================================================

    addProcedimiento() {

      this.informe.procedimientos.push({
        tipoProcedimiento: ""
      });

    },


    removeProcedimiento(index) {

      if (
        this.informe.procedimientos.length
        <=
        1
      ) {

        return;

      }


      this.informe.procedimientos.splice(
        index,
        1
      );

    },


    // =====================================================
    // PLAGAS
    // =====================================================

    addPlaga() {

      this.informe.plagas.push({

        tipoPlaga: "",

        cantidadProductoPlaga: [

          {
            cantidadProducto: 0,
            productoDto: ""
          }

        ]

      });

    },


    removePlaga(plagaIndex) {

      if (
        this.informe.plagas.length
        <=
        1
      ) {

        return;

      }


      this.informe.plagas.splice(
        plagaIndex,
        1
      );

    },


    addProducto(plagaIndex) {

      this.informe
        .plagas[
        plagaIndex
      ]
        .cantidadProductoPlaga
        .push({

          cantidadProducto: 0,

          productoDto: ""

        });

    },


    removeProducto(
      plagaIndex,
      productoIndex
    ) {

      const productosPlaga =
        this.informe
          .plagas[
          plagaIndex
        ]
          .cantidadProductoPlaga;


      if (
        productosPlaga.length
        <=
        1
      ) {

        return;

      }


      productosPlaga.splice(
        productoIndex,
        1
      );

    },


    // =====================================================
    // STOCK
    // =====================================================

    obtenerStockProducto(producto) {

      if (!producto?.productoDto) {
        return 0;
      }


      /*
       * Tu producto históricamente usa "cantidad".
       * Dejamos compatibilidad con posibles nombres alternos.
       */

      return Number(
        producto.productoDto.cantidad
        ??
        producto.productoDto.stock
        ??
        producto.productoDto.existencia
        ??
        0
      );

    },


    tieneStockInsuficiente(producto) {

      if (!producto?.productoDto) {
        return false;
      }


      const cantidad =
        Number(
          producto.cantidadProducto
          || 0
        );


      const stock =
        this.obtenerStockProducto(
          producto
        );


      return cantidad > stock;

    },


    tieneStockBajo(producto) {

      if (
        !producto?.productoDto
        ||
        this.tieneStockInsuficiente(producto)
      ) {

        return false;

      }


      const stock =
        this.obtenerStockProducto(
          producto
        );


      return stock > 0
        &&
        stock <= 5;

    },


    claseStock(producto) {

      if (
        this.tieneStockInsuficiente(
          producto
        )
      ) {

        return "stock-danger";

      }


      if (
        this.tieneStockBajo(
          producto
        )
      ) {

        return "stock-warning";

      }


      return "stock-ok";

    },


    iconoStock(producto) {

      if (
        this.tieneStockInsuficiente(
          producto
        )
      ) {

        return "bi bi-x-circle-fill";

      }


      if (
        this.tieneStockBajo(
          producto
        )
      ) {

        return "bi bi-exclamation-triangle-fill";

      }


      return "bi bi-check-circle-fill";

    },


    // =====================================================
    // GUARDAR INFORME
    // =====================================================

    async submitForm() {

      if (this.isModalOpen) {
        return;
      }


      this.mensajeError =
        "";

      this.mensajeConfirmacion =
        "";

      this.esErrorStock =
        false;


      const existeStockInsuficiente =
        this.informe.plagas.some(
          plaga =>
            plaga.cantidadProductoPlaga.some(
              producto =>
                this.tieneStockInsuficiente(
                  producto
                )
            )
        );


      if (existeStockInsuficiente) {

        this.esErrorStock =
          true;


        this.mensajeError =
          "Uno o más productos superan el stock disponible. Ajuste las cantidades antes de continuar.";


        this.irASeccion(
          "plagas"
        );


        return;

      }


      this.guardando =
        true;


      try {

        const informeDto = {

          numFactura:
            this.informe.numFactura,

          observacion:
            this.informe.observacion,


          procedimientoDtos:

            this.informe.procedimientos.map(
              p => ({
                tipoProcedimiento:
                  p.tipoProcedimiento
              })
            ),


          recomendaciones:
            this.informe.recomendaciones,

          frecuencia:
            this.informe.frecuencia,

          precio:
            this.informe.precio,

          tiempo:
            this.informe.tiempo,


          ordenDto: {

            id:
              this.informe.idOrden

          },


          plagaDtos:

            this.informe.plagas.map(
              plaga => ({

                tipoPlaga:
                  plaga.tipoPlaga,


                cantidadProductoPlaga:

                  plaga
                    .cantidadProductoPlaga
                    .map(
                      cp => ({

                        productoDto:
                          cp.productoDto,

                        cantidadProducto:
                          cp.cantidadProducto

                      })
                    )

              })
            ),


          sanitizacionConfidencialDto: {

            areaInterna:
              this.informe
                .sanitizacionConfidenciales
                .areaInterna,

            areaExterna:
              this.informe
                .sanitizacionConfidenciales
                .areaExterna,

            areaOpc1:
              this.informe
                .sanitizacionConfidenciales
                .areaOpc1,

            areaOpc2:
              this.informe
                .sanitizacionConfidenciales
                .areaOpc2,

            areaNombreOpc1:
              this.informe
                .sanitizacionConfidenciales
                .areaNombreOpc1,

            areaNombreOpc2:
              this.informe
                .sanitizacionConfidenciales
                .areaNombreOpc2

          }

        };


        if (this.ver_informe) {

          /*
           * IMPORTANTE:
           *
           * En tu código original NO había una llamada real
           * para actualizar el informe.
           *
           * No inventamos actualizarInformeFachada hasta
           * revisar informeHelper.
           */

          this.mensajeError =
            "La edición está cargada correctamente, pero todavía debemos conectar el endpoint real de actualización del informe.";


          return;

        }


        const nuevoInforme =
          await crearInformePlagaFachada(
            informeDto
          );


        this.informeId =
          nuevoInforme.id;


        /*
         * Si el usuario seleccionó fotografías antes de guardar,
         * las enviamos ahora que ya tenemos informeId.
         */

        if (
          this.fotosNuevas.length > 0
        ) {

          await this.guardarFotos();

        }


        this.mensajeConfirmacion =
          "El informe IPM fue creado correctamente.";


        this.limpiarFormulario();


      } catch (error) {

        console.error(
          "Error al guardar informe IPM:",
          error
        );


        this.mensajeConfirmacion =
          "";


        if (
          error.response?.data?.error
          ===
          "STOCK_INSUFICIENTE"
        ) {

          this.esErrorStock =
            true;


          this.mensajeError =
            error.response.data.mensaje
            ||
            "No existe suficiente stock para uno de los productos seleccionados.";


          this.irASeccion(
            "plagas"
          );


        } else {

          this.esErrorStock =
            false;


          this.mensajeError =
            error.response?.data?.mensaje
            ||
            (
              typeof error.response?.data
                ===
                "string"
                ? error.response.data
                : "Ocurrió un error al guardar el informe. Intente nuevamente."
            );

        }


      } finally {

        this.guardando =
          false;

      }

    },


    // =====================================================
    // FOTOS
    // =====================================================

    async abrirModal() {

      this.isModalOpen =
        true;


      if (
        !this.ver_informe
        ||
        !this.informeId
      ) {

        return;

      }


      this.cargandoFotos =
        true;


      try {

        await this.cargarFotosExistentes();


      } catch (error) {

        console.error(
          "Error cargando fotografías:",
          error
        );


        this.mensajeError =
          "No se pudieron cargar las fotografías del informe.";

      } finally {

        this.cargandoFotos =
          false;

      }

    },


    async cargarFotosExistentes() {

      this.liberarUrlsFotosGuardadas();


      const fotosBackend =
        await consultarFotosIdInformeFachada(
          this.informeId
        );


      const lista =
        Array.isArray(
          fotosBackend
        )
          ? fotosBackend
          : [];


      const fotosNuevasActuales =
        this.fotos.filter(
          foto =>
            !foto.guardada
        );


      const fotosGuardadas =
        [];


      for (const foto of lista) {

        try {

          const contenidoUrl =
            foto.contenidoUrl
            ||
            `/almacenamiento/${foto.id}/contenido`;


          const response =
            await api.get(
              contenidoUrl,
              {
                responseType:
                  "blob"
              }
            );


          const url =
            URL.createObjectURL(
              response.data
            );


         fotosGuardadas.push({

  data:
    foto,

  foto:
    url,

  archivo:
    null,

  guardada:
    true,

  mimeType:
    foto.mimeType
    ||
    response.data.type
    ||
    "image/jpeg",

  pieImagen:
    foto.pieImagen
    || ""

});

        } catch (error) {

          console.error(
            `Error cargando foto ${foto.id}:`,
            error
          );

        }

      }


      this.fotos = [
        ...fotosGuardadas,
        ...fotosNuevasActuales
      ];

    },


    manejarArchivo(event) {

  const archivos =
    Array.from(
      event.target.files || []
    );

  archivos.forEach(
    archivo => {

      this.fotos.push({

        data: null,

        foto:
          URL.createObjectURL(
            archivo
          ),

        archivo,

        guardada: false,

        mimeType:
          archivo.type,

        pieImagen: ""

      });

    }
  );

  event.target.value = "";
},


    async eliminarFoto(index, foto) {

      try {

        if (
          foto.guardada
          &&
          foto.data?.id
        ) {

          await eliminarFotoFachada(
            foto.data.id
          );

        }


        if (
          foto.foto
          &&
          foto.foto.startsWith("blob:")
        ) {

          URL.revokeObjectURL(
            foto.foto
          );

        }


        this.fotos.splice(
          index,
          1
        );


      } catch (error) {

        console.error(
          "Error eliminando fotografía:",
          error
        );


        this.mensajeError =
          "No se pudo eliminar la fotografía.";

      }

    },


   async guardarFotos() {

  if (
    !this.informeId
    ||
    this.fotosNuevas.length === 0
  ) {
    return;
  }

  this.guardandoFotos = true;

  try {

    const formData =
      new FormData();


    /*
     * IMPORTANTE:
     *
     * Cada foto y su pie deben conservar
     * exactamente el mismo orden.
     */
    this.fotosNuevas.forEach(
      foto => {

        if (!foto.archivo) {
          return;
        }

        // Archivo
        formData.append(
          "fotos",
          foto.archivo
        );

        // Pie correspondiente a ese archivo
        formData.append(
          "piesImagen",
          foto.pieImagen || ""
        );

      }
    );


    // Informe al que pertenecen
    formData.append(
      "id",
      this.informeId
    );


    await guardarFotosFachada(
      formData
    );


    /*
     * Si estamos editando, recargamos
     * las fotografías desde backend.
     */
    if (this.ver_informe) {

      await this.cargarFotosExistentes();

    } else {

      /*
       * Si acabamos de crear el informe,
       * ya se guardaron correctamente.
       */
      this.liberarUrlsFotos();

      this.fotos = [];

    }


  } catch (error) {

    console.error(
      "Error guardando fotografías:",
      error
    );

    throw error;

  } finally {

    this.guardandoFotos = false;

  }

},

    cerrarModal() {

      if (this.guardandoFotos) {
        return;
      }


      this.isModalOpen =
        false;

    },


    liberarUrlsFotosGuardadas() {

      this.fotos
        .filter(
          foto =>
            foto.guardada
        )
        .forEach(
          foto => {

            if (
              foto.foto
              &&
              foto.foto.startsWith("blob:")
            ) {

              URL.revokeObjectURL(
                foto.foto
              );

            }

          }
        );

    },


    liberarUrlsFotos() {

      this.fotos.forEach(
        foto => {

          if (
            foto.foto
            &&
            foto.foto.startsWith("blob:")
          ) {

            URL.revokeObjectURL(
              foto.foto
            );

          }

        }
      );

    },


    // =====================================================
    // LIMPIAR
    // =====================================================

    limpiarFormulario() {

      this.liberarUrlsFotos();


      this.informe = {

        numFactura: "",

        observacion: "",

        recomendaciones: "",

        tiempo: "",

        frecuencia: "",

        precio: "",

        idOrden: "",


        sanitizacionConfidenciales: {

          areaInterna: "",

          areaExterna: "",

          areaOpc1: "",

          areaOpc2: "",

          areaNombreOpc1: "",

          areaNombreOpc2: ""

        },


        plagas: [

          {

            tipoPlaga: "",

            cantidadProductoPlaga: [

              {
                cantidadProducto: 0,
                productoDto: ""
              }

            ]

          }

        ],


        procedimientos: [

          {
            tipoProcedimiento: ""
          }

        ]

      };


      this.fotos =
        [];


      this.informeId =
        null;

    },


    // =====================================================
    // FORMATO
    // =====================================================

    formatearMoneda(valor) {

      return new Intl.NumberFormat(
        "es-EC",
        {
          style:
            "currency",

          currency:
            "USD",

          minimumFractionDigits:
            2
        }
      ).format(
        Number(valor || 0)
      );

    },


    // =====================================================
    // SCROLL
    // =====================================================

    irASeccion(id) {

      this.$nextTick(
        () => {

          document
            .getElementById(id)
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start"
            });

        }
      );

    },


    // =====================================================
    // NAVEGACIÓN
    // =====================================================

    redirigirListadoInforme() {

      this.$router.push(
        "/informe_lista"
      );

    }

  }

};
</script>


<style scoped>
/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.ipm-page {
  min-height: 100vh;
  padding: 34px;

  background:
    linear-gradient(135deg,
      #f8fbff 0%,
      #eef4fb 100%);

  color: #1e293b;
}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.page-header {
  max-width: 1250px;
  margin: 0 auto 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 25px 28px;

  border: 1px solid #e2e8f0;
  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.06);
}


.header-main {
  display: flex;
  align-items: center;
  gap: 16px;
}


.back-button {
  width: 43px;
  height: 43px;
  min-width: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #dbe5f0;
  border-radius: 11px;

  background: #f8fafc;
  color: #2563eb;
}


.eyebrow {
  display: block;
  margin-bottom: 4px;

  color: #2563eb;

  font-size: 0.6rem;
  font-weight: 900;

  letter-spacing: 0.14em;
}


.page-header h1 {
  margin: 0;

  color: #123b6d;

  font-size: 1.75rem;
  font-weight: 800;
}


.page-header p {
  max-width: 700px;

  margin: 6px 0 0;

  color: #64748b;

  font-size: 0.76rem;
  line-height: 1.5;
}


.report-reference {
  min-width: 110px;

  padding: 9px 13px;

  border: 1px solid #bfdbfe;
  border-radius: 10px;

  background: #eff6ff;

  text-align: center;
}


.report-reference span {
  display: block;

  color: #64748b;

  font-size: 0.52rem;
  font-weight: 800;
}


.report-reference strong {
  display: block;

  margin-top: 2px;

  color: #2563eb;

  font-size: 0.82rem;
}


/* ========================================================= */
/* NAV */
/* ========================================================= */

.form-navigation {
  position: sticky;
  top: 65px;
  z-index: 50;

  max-width: 1250px;

  margin: 0 auto 17px;

  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  overflow: hidden;

  border: 1px solid #e2e8f0;
  border-radius: 13px;

  background: rgba(255, 255, 255, 0.96);

  box-shadow:
    0 6px 16px rgba(15, 23, 42, 0.05);

  backdrop-filter: blur(10px);
}


.form-navigation button {
  min-height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  border: none;
  border-right: 1px solid #edf1f5;

  background: transparent;

  color: #64748b;

  font-size: 0.65rem;
  font-weight: 800;
}


.form-navigation button:last-child {
  border-right: none;
}


.form-navigation button:hover {
  background: #f8fbff;

  color: #2563eb;
}


.form-navigation span {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 0.55rem;
}


/* ========================================================= */
/* CONTENIDO */
/* ========================================================= */

.form-content {
  max-width: 1250px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  gap: 17px;
}


.form-card,
.report-summary,
.form-actions {
  border: 1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 8px 25px rgba(15, 23, 42, 0.045);
}


.form-card {
  padding: 27px;

  scroll-margin-top: 135px;
}


/* ========================================================= */
/* SECTION HEADER */
/* ========================================================= */

.section-header {
  display: flex;
  align-items: center;

  gap: 13px;

  margin-bottom: 22px;

  padding-bottom: 17px;

  border-bottom: 1px solid #edf1f5;
}


.section-header-actions {
  justify-content: space-between;
}


.section-title-wrapper {
  display: flex;
  align-items: center;

  gap: 13px;
}


.section-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  font-size: 1rem;
}


.section-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}


.section-icon.purple {
  background: #f5f3ff;
  color: #7c3aed;
}


.section-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}


.section-icon.green {
  background: #ecfdf3;
  color: #16a34a;
}


.section-icon.photo {
  background: #f0f9ff;
  color: #0284c7;
}


.section-number {
  display: block;

  color: #94a3b8;

  font-size: 0.52rem;
  font-weight: 900;

  letter-spacing: 0.08em;
}


.section-header h2 {
  margin: 1px 0 0;

  color: #172033;

  font-size: 0.98rem;
  font-weight: 800;
}


.section-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.65rem;
}


/* ========================================================= */
/* CAMPOS */
/* ========================================================= */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;
}


.full-width {
  grid-column: 1 / -1;
}


.field-group label,
.product-field label,
.quantity-field label,
.pest-type-field label,
.procedure-select label {
  display: block;

  margin-bottom: 7px;

  color: #475569;

  font-size: 0.68rem;
  font-weight: 800;
}


.required {
  color: #dc2626;
}


.input-wrapper {
  position: relative;
}


.input-wrapper>i {
  position: absolute;

  top: 50%;
  left: 13px;

  transform: translateY(-50%);

  color: #94a3b8;

  pointer-events: none;
}


.input-wrapper input,
.input-wrapper select {
  padding-left: 38px !important;
}


input,
select,
textarea {
  width: 100%;

  border: 1px solid #dce4ee;
  border-radius: 10px;

  background: #fbfdff;

  color: #334155;

  outline: none;

  font-size: 0.76rem;

  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}


input,
select {
  height: 44px;

  padding: 0 11px;
}


textarea {
  padding: 11px;

  resize: vertical;
}


input:focus,
select:focus,
textarea:focus {
  border-color: #60a5fa;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.07);
}


.field-footer {
  display: flex;
  justify-content: space-between;

  gap: 15px;

  margin-top: 5px;

  color: #94a3b8;

  font-size: 0.57rem;
}


.field-warning {
  display: block;

  margin-top: 5px;

  color: #dc2626;

  font-size: 0.6rem;
}


/* ========================================================= */
/* ORDEN PREVIEW */
/* ========================================================= */

.order-preview {
  min-height: 76px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 11px 14px;

  border: 1px solid #bfdbfe;
  border-radius: 10px;

  background: #f8fbff;
}


.order-preview span {
  color: #2563eb;

  font-size: 0.52rem;
  font-weight: 900;
}


.order-preview strong {
  display: block;

  margin-top: 2px;

  color: #1e40af;

  font-size: 0.76rem;
}


.order-preview small {
  display: block;

  margin-top: 3px;

  overflow: hidden;

  color: #64748b;

  font-size: 0.59rem;

  white-space: nowrap;
  text-overflow: ellipsis;
}


/* ========================================================= */
/* BOTONES ADD */
/* ========================================================= */

.add-button,
.small-add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  border-radius: 9px;

  font-size: 0.66rem;
  font-weight: 800;
}


.add-button {
  min-height: 37px;

  padding: 0 11px;
}


.purple-button {
  border: 1px solid #ddd6fe;

  background: #f5f3ff;

  color: #7c3aed;
}


.orange-button {
  border: 1px solid #fed7aa;

  background: #fff7ed;

  color: #ea580c;
}


.photo-button {
  border: 1px solid #bae6fd;

  background: #f0f9ff;

  color: #0284c7;
}


.small-add-button {
  min-height: 34px;

  padding: 0 9px;

  border: 1px solid #bfdbfe;

  background: #eff6ff;

  color: #2563eb;
}


/* ========================================================= */
/* PROCEDIMIENTOS */
/* ========================================================= */

.procedures-list {
  display: flex;
  flex-direction: column;

  gap: 9px;
}


.procedure-row {
  display: grid;

  grid-template-columns:
    34px 1fr 38px;

  align-items: end;

  gap: 10px;

  padding: 11px;

  border: 1px solid #ebe9f5;
  border-radius: 10px;

  background: #fdfcff;
}


.item-number {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 7px;

  border-radius: 50%;

  font-size: 0.63rem;
  font-weight: 900;
}


.purple-number {
  background: #ede9fe;
  color: #7c3aed;
}


.remove-button,
.remove-product-button {
  width: 38px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #fecaca;
  border-radius: 9px;

  background: #ffffff;

  color: #dc2626;
}


/* ========================================================= */
/* PLAGAS */
/* ========================================================= */

.pests-list {
  display: flex;
  flex-direction: column;

  gap: 15px;
}


.pest-card {
  padding: 17px;

  border: 1px solid #fed7aa;
  border-radius: 13px;

  background:
    linear-gradient(135deg,
      #fffdfa,
      #ffffff);
}


.pest-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 15px;

  padding-bottom: 13px;

  border-bottom: 1px solid #ffedd5;
}


.pest-title {
  display: flex;
  align-items: center;

  gap: 9px;
}


.pest-number {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #ffedd5;

  color: #ea580c;

  font-size: 0.68rem;
  font-weight: 900;
}


.pest-title span {
  display: block;

  color: #ea580c;

  font-size: 0.5rem;
  font-weight: 900;
}


.pest-title strong {
  display: block;

  margin-top: 1px;

  color: #7c2d12;

  font-size: 0.74rem;
}


.remove-pest-button {
  min-height: 34px;

  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 0 9px;

  border: 1px solid #fecaca;
  border-radius: 8px;

  background: #ffffff;

  color: #dc2626;

  font-size: 0.61rem;
  font-weight: 700;
}


.products-section {
  margin-top: 17px;

  padding-top: 15px;

  border-top: 1px solid #ffedd5;
}


.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
}


.products-header strong {
  display: block;

  color: #475569;

  font-size: 0.7rem;
}


.products-header span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.57rem;
}


.product-row {
  display: grid;

  grid-template-columns:
    30px minmax(240px, 1fr) 125px 38px;

  align-items: start;

  gap: 9px;

  margin-top: 8px;

  padding: 11px;

  border: 1px solid #e8edf3;
  border-radius: 10px;

  background: #ffffff;
}


.product-stock-warning {
  border-color: #fed7aa;

  background: #fffaf5;
}


.product-stock-danger {
  border-color: #fecaca;

  background: #fff7f7;
}


.product-index {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 24px;

  border-radius: 50%;

  background: #f1f5f9;

  color: #64748b;

  font-size: 0.59rem;
  font-weight: 800;
}


.stock-indicator {
  display: flex;
  align-items: center;

  gap: 5px;

  margin-top: 5px;

  font-size: 0.57rem;
  font-weight: 700;
}


.stock-ok {
  color: #15803d;
}


.stock-warning {
  color: #d97706;
}


.stock-danger {
  color: #dc2626;
}


/* ========================================================= */
/* SANITIZACIÓN */
/* ========================================================= */

.sanitization-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 13px;
}


.sanitization-card {
  padding: 15px;

  border: 1px solid #dfe7ef;
  border-radius: 12px;

  background: #fbfdff;
}


.sanitization-title {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-bottom: 11px;
}


.sanitization-title>i {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #ecfdf3;

  color: #16a34a;
}


.sanitization-title span {
  display: block;

  color: #16a34a;

  font-size: 0.48rem;
  font-weight: 900;
}


.sanitization-title strong {
  display: block;

  color: #334155;

  font-size: 0.68rem;
}


.optional-area {
  display: grid;

  grid-template-columns: 1fr 130px;

  column-gap: 9px;
}


.optional-area .sanitization-title {
  grid-column: 1 / -1;
}


.scale-help {
  display: flex;
  align-items: center;

  gap: 7px;

  margin-top: 13px;

  padding: 10px;

  border: 1px solid #bfdbfe;
  border-radius: 9px;

  background: #f8fbff;

  color: #64748b;

  font-size: 0.6rem;
}


/* ========================================================= */
/* EVIDENCIAS */
/* ========================================================= */

.evidence-summary {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 15px;

  border: 1px dashed #bae6fd;
  border-radius: 12px;

  background: #f7fcff;
}


.evidence-icon {
  width: 43px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #e0f2fe;

  color: #0284c7;
}


.evidence-summary>div:nth-child(2) {
  flex: 1;
}


.evidence-summary strong {
  display: block;

  color: #334155;

  font-size: 0.72rem;
}


.evidence-summary span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.6rem;
}


.evidence-summary button {
  min-height: 35px;

  padding: 0 9px;

  border: 1px solid #bae6fd;
  border-radius: 8px;

  background: #ffffff;

  color: #0284c7;

  font-size: 0.62rem;
  font-weight: 700;
}


/* ========================================================= */
/* RESUMEN */
/* ========================================================= */

.report-summary {
  display: flex;
  align-items: center;

  gap: 25px;

  padding: 20px 22px;

  background:
    linear-gradient(135deg,
      #f8fbff,
      #ffffff);
}


.summary-heading {
  min-width: 180px;

  display: flex;
  align-items: center;

  gap: 9px;
}


.summary-icon-main {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #dbeafe;

  color: #2563eb;
}


.summary-heading span {
  display: block;

  color: #2563eb;

  font-size: 0.5rem;
  font-weight: 900;
}


.summary-heading strong {
  display: block;

  max-width: 180px;

  margin-top: 2px;

  overflow: hidden;

  color: #172033;

  font-size: 0.68rem;

  white-space: nowrap;
  text-overflow: ellipsis;
}


.summary-items {
  flex: 1;

  display: grid;

  grid-template-columns:
    repeat(6, minmax(0, 1fr));

  gap: 12px;
}


.summary-items span {
  display: block;

  color: #94a3b8;

  font-size: 0.5rem;
}


.summary-items strong {
  display: block;

  margin-top: 2px;

  overflow: hidden;

  color: #334155;

  font-size: 0.63rem;

  white-space: nowrap;
  text-overflow: ellipsis;
}


.price-summary {
  color: #15803d !important;
}


/* ========================================================= */
/* ACTIONS */
/* ========================================================= */

.form-actions {
  display: flex;
  justify-content: flex-end;

  gap: 10px;

  padding: 18px 21px;
}


.primary-button,
.secondary-button {
  min-height: 42px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 16px;

  border-radius: 10px;

  font-size: 0.7rem;
  font-weight: 800;
}


.primary-button {
  border: 1px solid #2563eb;

  background: #2563eb;

  color: #ffffff;
}


.secondary-button {
  border: 1px solid #dce4ee;

  background: #ffffff;

  color: #475569;
}


button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}


/* ========================================================= */
/* MESSAGES */
/* ========================================================= */

.message,
.loading-card {
  max-width: 1250px;

  margin: 0 auto 16px;
}


.message {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 12px 14px;

  border-radius: 10px;
}


.message strong {
  display: block;

  font-size: 0.7rem;
}


.message span {
  display: block;

  margin-top: 2px;

  font-size: 0.64rem;
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


.stock-error {
  border-width: 2px;

  background:
    linear-gradient(135deg,
      #fff7f7,
      #fff1f2);
}


.loading-card {
  min-height: 250px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 9px;

  border: 1px solid #e2e8f0;
  border-radius: 18px;

  background: #ffffff;

  color: #64748b;

  font-size: 0.7rem;
}


/* ========================================================= */
/* MODAL */
/* ========================================================= */

.photo-modal-backdrop {
  position: fixed;

  inset: 0;

  z-index: 6000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background:
    rgba(15, 23, 42, 0.65);

  backdrop-filter: blur(5px);
}


.photo-modal {
  width: 100%;
  max-width: 1000px;

  max-height: 92vh;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  border-radius: 19px;

  background: #ffffff;

  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.3);
}


.photo-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 22px;

  border-bottom: 1px solid #e8edf3;
}


.photo-modal-header span {
  color: #0284c7;

  font-size: 0.55rem;
  font-weight: 900;

  letter-spacing: 0.09em;
}


.photo-modal-header h3 {
  margin: 2px 0 0;

  color: #172033;

  font-size: 1rem;
}


.photo-modal-header p {
  margin: 3px 0 0;

  color: #94a3b8;

  font-size: 0.61rem;
}


.modal-close {
  width: 36px;
  height: 36px;

  border: 1px solid #e2e8f0;
  border-radius: 9px;

  background: #f8fafc;

  color: #64748b;
}


.photo-modal-body {
  flex: 1;

  overflow-y: auto;

  padding: 21px;
}


.photos-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 13px;
}


.photo-card {
  overflow: hidden;

  border: 1px solid #e2e8f0;
  border-radius: 12px;

  background: #ffffff;
}


.photo-image {
  position: relative;

  height: 165px;

  overflow: hidden;

  background: #f1f5f9;
}


.photo-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.photo-status {
  position: absolute;

  bottom: 7px;
  left: 7px;

  padding: 4px 7px;

  border-radius: 999px;

  font-size: 0.52rem;
  font-weight: 800;
}


.saved-photo {
  background: rgba(240, 253, 244, 0.95);

  color: #15803d;
}


.new-photo {
  background: rgba(239, 246, 255, 0.95);

  color: #2563eb;
}


.photo-delete {
  position: absolute;

  top: 7px;
  right: 7px;

  width: 31px;
  height: 31px;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.94);

  color: #dc2626;
}


.photo-info {
  padding: 9px 10px;
}


.photo-info strong {
  display: block;

  overflow: hidden;

  color: #334155;

  font-size: 0.65rem;

  white-space: nowrap;
  text-overflow: ellipsis;
}


.photo-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.55rem;
}


.empty-photos {
  min-height: 165px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 5px;

  border: 1px dashed #cbd5e1;
  border-radius: 11px;

  background: #f8fafc;
}


.empty-photos div {
  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #e0f2fe;

  color: #0284c7;
}


.empty-photos strong {
  color: #475569;

  font-size: 0.68rem;
}


.empty-photos span {
  color: #94a3b8;

  font-size: 0.58rem;
}


.photo-upload-zone {
  min-height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 11px;

  margin-top: 15px;

  padding: 15px;

  border: 1px dashed #bae6fd;
  border-radius: 11px;

  background: #f7fcff;

  cursor: pointer;
}


.upload-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #e0f2fe;

  color: #0284c7;
}


.photo-upload-zone strong {
  display: block;

  color: #334155;

  font-size: 0.68rem;
}


.photo-upload-zone span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 0.57rem;
}


.photo-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 14px 21px;

  border-top: 1px solid #e8edf3;

  background: #fbfdff;
}


.photo-modal-footer>span {
  color: #64748b;

  font-size: 0.6rem;
}


.photo-modal-footer>div {
  display: flex;

  gap: 8px;
}


.photo-save-info {
  display: flex;
  align-items: center;

  gap: 7px;

  padding: 10px 21px;

  border-top: 1px solid #bfdbfe;

  background: #eff6ff;

  color: #1e40af;

  font-size: 0.59rem;
}


.modal-loading {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 8px;

  color: #64748b;

  font-size: 0.65rem;
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 1000px) {

  .summary-items {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }


  .report-summary {
    align-items: flex-start;

    flex-direction: column;
  }

}


@media (max-width: 850px) {

  .form-navigation {
    position: static;

    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .form-navigation button {
    border-bottom: 1px solid #edf1f5;
  }


  .photos-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}


@media (max-width: 700px) {

  .ipm-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .header-main {
    align-items: flex-start;
  }


  .report-reference {
    width: 100%;

    text-align: left;
  }


  .form-navigation {
    grid-template-columns: 1fr;
  }


  .form-grid,
  .sanitization-grid {
    grid-template-columns: 1fr;
  }


  .full-width {
    grid-column: auto;
  }


  .section-header-actions {
    align-items: flex-start;

    flex-direction: column;
  }


  .section-header-actions .add-button {
    width: 100%;
  }


  .product-row {
    grid-template-columns: 30px 1fr;
  }


  .quantity-field {
    grid-column: 2;
  }


  .remove-product-button {
    grid-column: 2;

    width: 100%;
  }


  .optional-area {
    grid-template-columns: 1fr;
  }


  .optional-area .sanitization-title {
    grid-column: auto;
  }


  .summary-items {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .form-actions {
    flex-direction: column-reverse;
  }


  .form-actions button {
    width: 100%;
  }


  .photos-grid {
    grid-template-columns: 1fr;
  }


  .photo-modal-footer {
    align-items: stretch;

    flex-direction: column;
  }


  .photo-modal-footer>div {
    display: grid;

    grid-template-columns: 1fr;
  }


  .photo-modal-footer button {
    width: 100%;
  }

}
</style>