<template>
  <div class="gastos-page">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <section class="page-header">
      <div>
        <span class="eyebrow">
          CONTROL FINANCIERO
        </span>

        <h1>
          Gastos y movimientos
        </h1>

        <p>
          Visualiza las salidas de caja, gastos operativos
          y compras de productos del período.
        </p>
      </div>

      <div class="header-actions">

        <button
          type="button"
          class="secondary-button"
          @click="abrirCompra"
        >
          <i class="bi bi-box-seam"></i>
          Registrar compra
        </button>

        <button
          type="button"
          class="primary-button"
          @click="registrarGasto"
        >
          <i class="bi bi-plus-lg"></i>
          Registrar gasto
        </button>

      </div>
    </section>


    <!-- ===================================================== -->
    <!-- PERÍODO -->
    <!-- ===================================================== -->

    <section class="period-card">

      <button
        type="button"
        class="period-nav"
        @click="mesAnterior"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <div class="period-info">
        <span>PERÍODO</span>

        <strong>
          {{ nombreMes }} {{ anioSeleccionado }}
        </strong>
      </div>

      <button
        type="button"
        class="today-button"
        @click="irMesActual"
      >
        Mes actual
      </button>

      <button
        type="button"
        class="period-nav"
        @click="mesSiguiente"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

    </section>


    <!-- ===================================================== -->
    <!-- ERROR GENERAL -->
    <!-- ===================================================== -->

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
        @click="cargarDashboard"
      >
        Reintentar
      </button>
    </div>


    <!-- ===================================================== -->
    <!-- CARGANDO -->
    <!-- ===================================================== -->

    <div
      v-if="cargando"
      class="loading-card"
    >
      <div class="spinner-border text-primary"></div>

      <span>
        Cargando información financiera...
      </span>
    </div>


    <template v-else>

      <!-- =================================================== -->
      <!-- RESUMEN FINANCIERO GENERAL -->
      <!-- =================================================== -->

      <section class="financial-summary-grid">

        <article class="summary-card">
          <div class="summary-icon blue">
            <i class="bi bi-clipboard-check"></i>
          </div>
          <div>
            <span>Ejecutado</span>
            <strong>{{ formatearMoneda(resumenFinanciero.totalEjecutado) }}</strong>
            <small>Servicios ejecutados en el período</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon purple">
            <i class="bi bi-file-earmark-text"></i>
          </div>
          <div>
            <span>Facturado</span>
            <strong>{{ formatearMoneda(resumenFinanciero.totalFacturado) }}</strong>
            <small>Facturas emitidas en el período</small>
          </div>
        </article>

        <article class="summary-card principal">
          <div class="summary-icon green">
            <i class="bi bi-cash-coin"></i>
          </div>
          <div>
            <span>Cobrado real</span>
            <strong>{{ formatearMoneda(resumenFinanciero.totalCobrado) }}</strong>
            <small>Pagos recibidos en el período</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon orange">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <div>
            <span>Por cobrar</span>
            <strong>{{ formatearMoneda(resumenFinanciero.totalPorCobrar) }}</strong>
            <small>{{ resumenFinanciero.facturasPendientes || 0 }} facturas pendientes</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon red">
            <i class="bi bi-arrow-down-circle"></i>
          </div>
          <div>
            <span>Egresos</span>
            <strong>{{ formatearMoneda(resumenFinanciero.totalEgresos) }}</strong>
            <small>Gastos + compras del período</small>
          </div>
        </article>

        <article class="summary-card" :class="{ 'negative-flow': Number(resumenFinanciero.flujoReal || 0) < 0 }">
          <div class="summary-icon" :class="Number(resumenFinanciero.flujoReal || 0) >= 0 ? 'green' : 'red'">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <div>
            <span>Flujo real</span>
            <strong>{{ formatearMoneda(resumenFinanciero.flujoReal) }}</strong>
            <small>Cobrado real - egresos</small>
          </div>
        </article>

      </section>

      <div v-if="Number(resumenFinanciero.carteraVencida || 0) > 0" class="portfolio-alert">
        <i class="bi bi-exclamation-triangle"></i>
        <span>
          Cartera vencida: <strong>{{ formatearMoneda(resumenFinanciero.carteraVencida) }}</strong>
          · {{ resumenFinanciero.facturasVencidas || 0 }} facturas vencidas
        </span>
      </div>

      <!-- =================================================== -->
      <!-- DETALLE DE EGRESOS -->
      <!-- =================================================== -->

      <section class="summary-grid">

        <article class="summary-card principal">

          <div class="summary-icon blue">
            <i class="bi bi-wallet2"></i>
          </div>

          <div>
            <span>
              Salida total de caja
            </span>

            <strong>
              {{ formatearMoneda(resumen.totalSalidaCaja) }}
            </strong>

            <small>
              Gastos manuales + compras de productos
            </small>
          </div>

        </article>


        <article class="summary-card">

          <div class="summary-icon orange">
            <i class="bi bi-receipt"></i>
          </div>

          <div>
            <span>
              Gastos manuales
            </span>

            <strong>
              {{ formatearMoneda(resumen.totalGastosManuales) }}
            </strong>

            <small>
              {{ resumen.cantidadGastosManuales || 0 }}
              movimientos
            </small>
          </div>

        </article>


        <article class="summary-card">

          <div class="summary-icon purple">
            <i class="bi bi-box-seam"></i>
          </div>

          <div>
            <span>
              Compras de productos
            </span>

            <strong>
              {{ formatearMoneda(resumen.totalComprasProductos) }}
            </strong>

            <small>
              {{ resumen.cantidadComprasProductos || 0 }}
              compras
            </small>
          </div>

        </article>


        <article class="summary-card">

          <div class="summary-icon green">
            <i class="bi bi-list-check"></i>
          </div>

          <div>
            <span>
              Movimientos del mes
            </span>

            <strong>
              {{ cantidadMovimientos }}
            </strong>

            <small>
              registros financieros
            </small>
          </div>

        </article>

      </section>


      <!-- =================================================== -->
      <!-- ANÁLISIS -->
      <!-- =================================================== -->

      <section class="dashboard-grid">

        <!-- CATEGORÍAS -->

        <article class="panel">

          <div class="panel-header">
            <div>
              <h2>
                Gastos por categoría
              </h2>

              <p>
                Distribución de gastos registrados manualmente.
              </p>
            </div>
          </div>


          <div
            v-if="categorias.length === 0"
            class="empty-small"
          >
            <i class="bi bi-pie-chart"></i>

            <span>
              No hay gastos manuales en este período.
            </span>
          </div>


          <div
            v-else
            class="category-list"
          >

            <div
              v-for="categoria in categorias"
              :key="categoria.nombre"
              class="category-item"
            >

              <div class="category-header">

                <div>
                  <strong>
                    {{ formatearCategoria(categoria.nombre) }}
                  </strong>

                  <span>
                    {{ categoria.porcentaje.toFixed(1) }} %
                  </span>
                </div>

                <strong>
                  {{ formatearMoneda(categoria.total) }}
                </strong>

              </div>


              <div class="progress-track">
                <div
                  class="progress-value"
                  :style="{
                    width: `${categoria.porcentaje}%`
                  }"
                ></div>
              </div>

            </div>

          </div>

        </article>


        <!-- COMPOSICIÓN -->

        <article class="panel">

          <div class="panel-header">
            <div>
              <h2>
                Composición de la salida
              </h2>

              <p>
                Cómo se distribuyó el dinero del mes.
              </p>
            </div>
          </div>


          <div class="composition-list">

            <div class="composition-row">

              <div class="composition-icon orange">
                <i class="bi bi-cash-coin"></i>
              </div>

              <div class="composition-info">
                <span>
                  Gastos manuales
                </span>

                <strong>
                  {{ formatearMoneda(resumen.totalGastosManuales) }}
                </strong>
              </div>

              <span>
                {{ porcentajeGastosManuales.toFixed(1) }} %
              </span>

            </div>


            <div class="composition-row">

              <div class="composition-icon purple">
                <i class="bi bi-box-seam"></i>
              </div>

              <div class="composition-info">
                <span>
                  Compras de productos
                </span>

                <strong>
                  {{ formatearMoneda(resumen.totalComprasProductos) }}
                </strong>
              </div>

              <span>
                {{ porcentajeCompras.toFixed(1) }} %
              </span>

            </div>

          </div>


          <div class="financial-note">

            <i class="bi bi-info-circle"></i>

            <span>
              Las compras de productos representan salida de caja.
              El consumo posterior del inventario no se vuelve a sumar
              como salida para evitar duplicar el gasto.
            </span>

          </div>

        </article>

      </section>


      <!-- =================================================== -->
      <!-- MOVIMIENTOS -->
      <!-- =================================================== -->

      <section class="movements-panel">

        <div class="panel-header">

          <div>
            <h2>
              Movimientos del período
            </h2>

            <p>
              Gastos manuales y compras registradas durante el mes.
            </p>
          </div>

          <button
            type="button"
            class="refresh-button"
            @click="cargarDashboard"
          >
            <i class="bi bi-arrow-clockwise"></i>
            Actualizar
          </button>

        </div>


        <div
          v-if="movimientos.length === 0"
          class="empty-state"
        >
          <div>
            <i class="bi bi-wallet2"></i>
          </div>

          <h3>
            No hay movimientos
          </h3>

          <p>
            Este período todavía no tiene gastos ni compras registradas.
          </p>
        </div>


        <div
          v-else
          class="table-wrapper"
        >

          <table class="movements-table">

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Detalle</th>
                <th>Orden</th>
                <th>Forma de pago</th>

                <th class="text-center-custom">
                  Comprobante
                </th>

                <th class="text-right-custom">
                  Monto
                </th>

                <th class="text-center-custom">
                  Acciones
                </th>
              </tr>
            </thead>


            <tbody>

              <tr
                v-for="movimiento in movimientos"
                :key="`${movimiento.tipo}-${movimiento.id}`"
              >

                <!-- FECHA -->

                <td class="date-cell">
                  {{ formatearFecha(movimiento.fecha) }}
                </td>


                <!-- TIPO -->

                <td>

                  <span
                    class="type-badge"
                    :class="
                      movimiento.tipo === 'GASTO'
                        ? 'expense-type'
                        : 'purchase-type'
                    "
                  >

                    <i
                      class="bi"
                      :class="
                        movimiento.tipo === 'GASTO'
                          ? 'bi-receipt'
                          : 'bi-box-seam'
                      "
                    ></i>

                    {{
                      movimiento.tipo === "GASTO"
                        ? "Gasto"
                        : "Compra"
                    }}

                  </span>

                </td>


                <!-- DETALLE -->

                <td>

                  <div class="movement-detail">

                    <strong>
                      {{ movimiento.titulo }}
                    </strong>

                    <span>
                      {{
                        movimiento.descripcion
                        ||
                        "Sin descripción"
                      }}
                    </span>

                  </div>

                </td>


                <!-- ORDEN -->

                <td>

                  <span
                    v-if="movimiento.idOrden"
                    class="order-badge"
                  >
                    OT-{{ movimiento.idOrden }}
                  </span>

                  <span
                    v-else
                    class="no-data"
                  >
                    —
                  </span>

                </td>


                <!-- FORMA DE PAGO -->

                <td>

                  <span
                    v-if="movimiento.formaPago"
                  >
                    {{ formatearCategoria(movimiento.formaPago) }}
                  </span>

                  <span
                    v-else
                    class="no-data"
                  >
                    —
                  </span>

                </td>


                <!-- COMPROBANTE -->

                <td class="receipt-cell">

                  <button
                    v-if="movimiento.tieneComprobante"
                    type="button"
                    class="receipt-button"
                    @click="verComprobante(movimiento)"
                  >
                    <i class="bi bi-eye"></i>
                    Ver
                  </button>

                  <span
                    v-else
                    class="no-receipt"
                  >
                    —
                  </span>

                </td>


                <!-- MONTO -->

                <td class="amount-cell">
                  {{ formatearMoneda(movimiento.monto) }}
                </td>


                <!-- ACCIONES -->

                <td class="actions-cell">

                  <button
                    type="button"
                    class="edit-button"
                    @click="
                      movimiento.tipo === 'GASTO'
                        ? editarGasto(movimiento.id)
                        : editarCompra(movimiento.id)
                    "
                  >
                    <i class="bi bi-pencil-square"></i>
                    Editar
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </template>


    <!-- ===================================================== -->
    <!-- MODAL COMPROBANTE -->
    <!-- ===================================================== -->

    <div
      v-if="modalComprobante"
      class="modal-backdrop-custom"
      @click.self="cerrarComprobante"
    >

      <div class="receipt-modal">

        <div class="receipt-modal-header">

          <div>
            <span class="modal-eyebrow">
              COMPROBANTE
            </span>

            <h3>
              {{ nombreComprobante || "Comprobante del gasto" }}
            </h3>
          </div>

          <button
            type="button"
            class="close-modal-button"
            @click="cerrarComprobante"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <div class="receipt-modal-body">

          <div
            v-if="cargandoComprobante"
            class="receipt-loading"
          >
            <div class="spinner-border text-primary"></div>

            <span>
              Cargando comprobante...
            </span>
          </div>


          <template v-else>

            <img
              v-if="tipoComprobante === 'imagen'"
              :src="archivoPreview"
              class="receipt-image"
              alt="Comprobante del gasto"
            />


            <iframe
              v-else-if="tipoComprobante === 'pdf'"
              :src="archivoPreview"
              class="receipt-frame"
              title="Comprobante del gasto"
            ></iframe>


            <div
              v-else
              class="unsupported-file"
            >
              <i class="bi bi-file-earmark"></i>

              <strong>
                Vista previa no disponible
              </strong>

              <span>
                El archivo fue recuperado correctamente.
              </span>
            </div>

          </template>

        </div>


        <div class="receipt-modal-footer">

          <button
            type="button"
            class="secondary-button"
            @click="cerrarComprobante"
          >
            Cerrar
          </button>

          <button
            v-if="archivoPreview"
            type="button"
            class="primary-button"
            @click="abrirComprobanteNuevaVentana"
          >
            <i class="bi bi-box-arrow-up-right"></i>
            Abrir en nueva pestaña
          </button>

        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- MODAL REGISTRAR COMPRA -->
    <!-- ===================================================== -->

    <div
      v-if="modalCompra"
      class="modal-backdrop-custom"
      @click.self="cerrarCompra"
    >

      <div class="purchase-modal">

        <!-- HEADER -->

        <div class="purchase-modal-header">

          <div>
            <span class="modal-eyebrow">
              INVENTARIO
            </span>

            <h3>
              {{
                modoEdicionCompra
                  ? "Editar compra de producto"
                  : "Registrar compra de producto"
              }}
            </h3>

            <p>
              {{
                modoEdicionCompra
                  ? "Corrige los datos de la compra. El inventario se ajustará automáticamente."
                  : "La compra aumentará el stock y se registrará automáticamente como salida de caja."
              }}
            </p>
          </div>


          <button
            type="button"
            class="close-modal-button"
            :disabled="guardandoCompra"
            @click="cerrarCompra"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <!-- BODY -->

        <div class="purchase-modal-body">

          <!-- ERROR -->

          <div
            v-if="mensajeCompraError"
            class="purchase-message error"
          >
            <i class="bi bi-exclamation-circle-fill"></i>

            <span>
              {{ mensajeCompraError }}
            </span>
          </div>


          <!-- ÉXITO -->

          <div
            v-if="mensajeCompraExito"
            class="purchase-message success"
          >
            <i class="bi bi-check-circle-fill"></i>

            <span>
              {{ mensajeCompraExito }}
            </span>
          </div>


          <!-- CAMPOS -->

          <div class="purchase-grid">

            <!-- PRODUCTO -->

            <div class="purchase-field full">

              <label for="compraProducto">
                Producto
                <span>*</span>
              </label>

              <select
                id="compraProducto"
                v-model="compra.idProducto"
                :disabled="guardandoCompra || cargandoDatosCompra"
                @change="productoCompraCambiado"
              >
                <option
                  :value="null"
                  disabled
                >
                  Seleccione un producto
                </option>

                <option
                  v-for="producto in productos"
                  :key="producto.id"
                  :value="producto.id"
                >
                  {{ producto.nombre }}
                  · Stock {{ producto.cantidad }}
                  {{ producto.unidadMedida || "" }}
                </option>
              </select>

            </div>


            <!-- CANTIDAD -->

            <div class="purchase-field">

              <label for="compraCantidad">
                Cantidad comprada
                <span>*</span>
              </label>

              <input
                id="compraCantidad"
                v-model="compra.cantidad"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                :disabled="guardandoCompra"
              />

            </div>


            <!-- COSTO UNITARIO -->

            <div class="purchase-field">

              <label for="compraCosto">
                Costo unitario
                <span>*</span>
              </label>

              <div class="money-input">

                <span>$</span>

                <input
                  id="compraCosto"
                  v-model="compra.costoUnitario"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  :disabled="guardandoCompra"
                />

              </div>

            </div>


            <!-- PROVEEDOR -->

            <div class="purchase-field full">

              <label for="compraProveedor">
                Proveedor
              </label>

              <select
                id="compraProveedor"
                v-model="compra.idProveedor"
                :disabled="guardandoCompra"
              >
                <option :value="null">
                  Usar proveedor asociado al producto
                </option>

                <option
                  v-for="proveedor in proveedores"
                  :key="proveedor.id"
                  :value="proveedor.id"
                >
                  {{ proveedor.nombre }}
                </option>
              </select>

              <small class="purchase-help">
                Puedes dejarlo sin seleccionar para utilizar
                el proveedor configurado en el producto.
              </small>

            </div>


            <!-- ORDEN DE TRABAJO -->

            <div class="purchase-field full">

              <label for="compraOrden">
                Orden de trabajo relacionada
              </label>

              <select
                id="compraOrden"
                v-model="compra.idOrden"
                :disabled="guardandoCompra || cargandoDatosCompra"
              >
                <option :value="null">
                  Sin orden relacionada
                </option>

                <option
                  v-for="orden in ordenes"
                  :key="orden.id"
                  :value="orden.id"
                >
                  {{ textoOrdenCompra(orden) }}
                </option>
              </select>

              <small class="purchase-help">
                Déjalo vacío si la compra corresponde a inventario general.
              </small>

            </div>


            <!-- FORMA DE PAGO -->

            <div class="purchase-field">

              <label for="compraFormaPago">
                Forma de pago
              </label>

              <select
                id="compraFormaPago"
                v-model="compra.formaPago"
                :disabled="guardandoCompra"
              >
                <option value="">
                  No especificada
                </option>

                <option value="EFECTIVO">
                  Efectivo
                </option>

                <option value="TARJETA">
                  Tarjeta
                </option>

                <option value="TRANSFERENCIA">
                  Transferencia
                </option>

                <option value="OTRO">
                  Otro
                </option>
              </select>

            </div>


            <!-- DOCUMENTO -->

            <div class="purchase-field">

              <label for="compraDocumento">
                Número de documento
              </label>

              <input
                id="compraDocumento"
                v-model.trim="compra.numeroDocumento"
                type="text"
                maxlength="100"
                placeholder="Ej. FAC-001"
                :disabled="guardandoCompra"
              />

            </div>


            <!-- TOTAL -->

            <div class="purchase-field">

              <label>
                Total de compra
              </label>

              <div class="purchase-total">
                {{ formatearMoneda(totalCompra) }}
              </div>

            </div>


            <!-- OBSERVACIÓN -->

            <div class="purchase-field full">

              <label for="compraObservacion">
                Observación
              </label>

              <textarea
                id="compraObservacion"
                v-model.trim="compra.observacion"
                rows="3"
                maxlength="500"
                placeholder="Ej. Compra mensual de insumos..."
                :disabled="guardandoCompra"
              ></textarea>

              <small class="purchase-help">
                {{ compra.observacion.length }}/500
              </small>

            </div>


            <!-- COMPROBANTE -->

            <div class="purchase-field full">

              <label for="compraComprobante">
                Comprobante
              </label>

              <p class="purchase-help purchase-file-description">
                Adjunta factura, nota de venta, recibo o fotografía.
                PDF, JPG, PNG o WEBP · máximo 10 MB.
              </p>

              <input
                id="compraComprobante"
                ref="inputComprobanteCompra"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                hidden
                @change="seleccionarComprobanteCompra"
              />

              <div
                v-if="
                  modoEdicionCompra
                  &&
                  tieneComprobanteCompraExistente
                  &&
                  !comprobanteCompra
                "
                class="purchase-existing-file"
              >
                <div class="purchase-existing-icon">
                  <i class="bi bi-file-earmark-check"></i>
                </div>

                <div class="purchase-existing-info">
                  <strong>Comprobante actual</strong>
                  <span>
                    {{
                      nombreComprobanteCompraExistente
                      ||
                      "Comprobante asociado a la compra"
                    }}
                  </span>
                  <small>
                    Si seleccionas otro archivo, reemplazará al actual.
                  </small>
                </div>

                <button
                  type="button"
                  class="purchase-file-button"
                  :disabled="guardandoCompra"
                  @click="abrirSelectorComprobanteCompra"
                >
                  <i class="bi bi-arrow-repeat"></i>
                  Reemplazar
                </button>
              </div>

              <div
                v-else
                class="purchase-upload-box"
                :class="{ 'has-file': comprobanteCompra }"
                @click="abrirSelectorComprobanteCompra"
              >

                <div class="purchase-upload-icon">
                  <i
                    :class="
                      comprobanteCompra
                        ? 'bi bi-file-earmark-check'
                        : 'bi bi-cloud-arrow-up'
                    "
                  ></i>
                </div>

                <div class="purchase-upload-info">

                  <template v-if="!comprobanteCompra">
                    <strong>Adjuntar comprobante</strong>
                    <span>Haz clic para seleccionar un archivo</span>
                    <small>Campo opcional</small>
                  </template>

                  <template v-else>
                    <strong>{{ comprobanteCompra.name }}</strong>
                    <span>{{ formatearTamanoArchivo(comprobanteCompra.size) }}</span>
                    <small>Archivo listo para guardar</small>
                  </template>

                </div>

                <button
                  v-if="!comprobanteCompra"
                  type="button"
                  class="purchase-file-button"
                  :disabled="guardandoCompra"
                  @click.stop="abrirSelectorComprobanteCompra"
                >
                  <i class="bi bi-paperclip"></i>
                  Seleccionar
                </button>

                <button
                  v-else
                  type="button"
                  class="purchase-remove-file"
                  :disabled="guardandoCompra"
                  title="Quitar comprobante"
                  @click.stop="eliminarComprobanteCompra"
                >
                  <i class="bi bi-trash"></i>
                </button>

              </div>

            </div>

          </div>


          <!-- PRODUCTO SELECCIONADO -->

          <div
            v-if="productoSeleccionado"
            class="product-preview"
          >

            <div class="product-preview-icon">
              <i class="bi bi-box-seam"></i>
            </div>

            <div class="product-preview-info">

              <span>
                PRODUCTO SELECCIONADO
              </span>

              <strong>
                {{ productoSeleccionado.nombre }}
              </strong>

              <small>
                Stock actual:
                {{ productoSeleccionado.cantidad }}
                {{ productoSeleccionado.unidadMedida || "" }}
              </small>

            </div>


            <div class="stock-result">

              <span>
                Stock después
              </span>

              <strong>
                {{ stockPosterior }}
              </strong>

              <small>
                {{ productoSeleccionado.unidadMedida || "" }}
              </small>

            </div>

          </div>


          <!-- RESUMEN COMPRA -->

          <div
            v-if="compra.idProducto"
            class="purchase-summary"
          >

            <div>
              <span>
                CANTIDAD
              </span>

              <strong>
                {{ Number(compra.cantidad || 0).toFixed(2) }}
              </strong>
            </div>


            <div>
              <span>
                COSTO UNITARIO
              </span>

              <strong>
                {{ formatearMoneda(compra.costoUnitario) }}
              </strong>
            </div>


            <div class="purchase-summary-total">
              <span>
                TOTAL
              </span>

              <strong>
                {{ formatearMoneda(totalCompra) }}
              </strong>
            </div>

          </div>

        </div>


        <!-- FOOTER -->

        <div class="purchase-modal-footer">

          <button
            type="button"
            class="secondary-button"
            :disabled="guardandoCompra"
            @click="cerrarCompra"
          >
            Cancelar
          </button>


          <button
            type="button"
            class="primary-button"
            :disabled="
              guardandoCompra
              ||
              cargandoDatosCompra
            "
            @click="guardarCompra"
          >

            <span
              v-if="guardandoCompra"
              class="spinner-border spinner-border-sm"
            ></span>

            <i
              v-else
              class="bi bi-check-lg"
            ></i>

            {{
              guardandoCompra
                ? (
                    modoEdicionCompra
                      ? "Actualizando..."
                      : "Guardando..."
                  )
                : (
                    modoEdicionCompra
                      ? "Actualizar compra"
                      : "Registrar compra"
                  )
            }}

          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script>
import {
  obtenerComprasMesFachada,
  obtenerGastosMesFachada,
  obtenerResumenGastosFachada,
  obtenerComprobanteGastoFachada,
  obtenerComprobanteCompraFachada,
  crearCompraProductoFachada,
  actualizarCompraProductoFachada
} from "../helpers/gastosHelper";

import {
  obtenerTodosLosProductosFachada
} from "../../Producto/helpers/productosHelpers";

import {
  obtenerTodosLosProveedorsFachada
} from "../../Proveedor/helpers/proveedoresHelpers";

import {
  consultarOrdenFachada
} from "../../OrdenTrabajo/Helpers/OrdenTrabajoHelper";

import {
  obtenerResumenFinancieroFachada
} from "../../Finanzas/helpers/finanzasHelper";


export default {

  name: "GastosDashboard",


  data() {

    const ahora =
      new Date();


    return {

      anioSeleccionado:
        ahora.getFullYear(),

      mesSeleccionado:
        ahora.getMonth() + 1,


      resumen: {
        totalGastosManuales: 0,
        totalComprasProductos: 0,
        totalSalidaCaja: 0,
        cantidadGastosManuales: 0,
        cantidadComprasProductos: 0,
        gastosPorCategoria: {}
      },

      resumenFinanciero: {
        totalEjecutado: 0,
        totalFacturado: 0,
        totalCobrado: 0,
        totalEgresos: 0,
        flujoReal: 0,
        totalPorCobrar: 0,
        carteraVencida: 0,
        facturasPendientes: 0,
        facturasVencidas: 0,
        totalGastosManuales: 0,
        totalComprasProductos: 0
      },


      gastos: [],

      compras: [],

      productos: [],

      proveedores: [],

      ordenes: [],


      compra: {
        idProducto: null,
        cantidad: "",
        costoUnitario: "",
        idProveedor: null,
        idOrden: null,
        formaPago: "",
        numeroDocumento: "",
        observacion: ""
      },

      comprobanteCompra: null,


      cargando: false,

      mensajeError: "",


      // COMPRA

      modalCompra: false,

      guardandoCompra: false,

      cargandoDatosCompra: false,

      mensajeCompraError: "",

      mensajeCompraExito: "",

      modoEdicionCompra: false,

      compraEditandoId: null,

      idProductoOriginalCompra: null,

      cantidadOriginalCompra: 0,

      tieneComprobanteCompraExistente: false,

      nombreComprobanteCompraExistente: "",


      // COMPROBANTE

      modalComprobante: false,

      cargandoComprobante: false,

      archivoPreview: "",

      tipoComprobante: "",

      nombreComprobante: ""

    };

  },


  computed: {

    // =====================================================
    // PRODUCTO SELECCIONADO
    // =====================================================

    productoSeleccionado() {

      if (!this.compra.idProducto) {
        return null;
      }


      return this.productos.find(
        producto =>
          Number(producto.id) ===
          Number(this.compra.idProducto)
      ) || null;

    },


    // =====================================================
    // TOTAL COMPRA
    // =====================================================

    totalCompra() {

      const cantidad =
        Number(
          this.compra.cantidad || 0
        );


      const costo =
        Number(
          this.compra.costoUnitario || 0
        );


      return cantidad * costo;

    },


    // =====================================================
    // STOCK POSTERIOR
    // =====================================================

    stockPosterior() {

      if (!this.productoSeleccionado) {
        return "—";
      }


      const actual =
        Number(
          this.productoSeleccionado.cantidad || 0
        );


      const nuevaCantidad =
        Number(
          this.compra.cantidad || 0
        );


      if (!this.modoEdicionCompra) {

        return (
          actual + nuevaCantidad
        ).toFixed(2);
      }


      const mismoProducto =
        Number(this.compra.idProducto)
        ===
        Number(this.idProductoOriginalCompra);


      if (mismoProducto) {

        return (
          actual
          -
          Number(this.cantidadOriginalCompra || 0)
          +
          nuevaCantidad
        ).toFixed(2);
      }


      return (
        actual + nuevaCantidad
      ).toFixed(2);

    },


    // =====================================================
    // MES
    // =====================================================

    nombreMes() {

      return new Intl.DateTimeFormat(
        "es-EC",
        {
          month: "long"
        }
      )
        .format(
          new Date(
            this.anioSeleccionado,
            this.mesSeleccionado - 1,
            1
          )
        )
        .replace(
          /^\w/,
          letra =>
            letra.toUpperCase()
        );

    },


    // =====================================================
    // MOVIMIENTOS
    // =====================================================

    cantidadMovimientos() {

      return (
        Number(
          this.resumen.cantidadGastosManuales || 0
        )
        +
        Number(
          this.resumen.cantidadComprasProductos || 0
        )
      );

    },


    porcentajeGastosManuales() {

      const total =
        Number(
          this.resumen.totalSalidaCaja || 0
        );


      if (total <= 0) {
        return 0;
      }


      return (
        Number(
          this.resumen.totalGastosManuales || 0
        )
        /
        total
      ) * 100;

    },


    porcentajeCompras() {

      const total =
        Number(
          this.resumen.totalSalidaCaja || 0
        );


      if (total <= 0) {
        return 0;
      }


      return (
        Number(
          this.resumen.totalComprasProductos || 0
        )
        /
        total
      ) * 100;

    },


    categorias() {

      const mapa =
        this.resumen.gastosPorCategoria || {};


      const total =
        Number(
          this.resumen.totalGastosManuales || 0
        );


      return Object.entries(mapa)
        .map(
          ([nombre, valor]) => {

            const numero =
              Number(
                valor || 0
              );


            return {

              nombre,

              total:
                numero,

              porcentaje:
                total > 0
                  ? (numero / total) * 100
                  : 0

            };

          }
        )
        .sort(
          (a, b) =>
            b.total - a.total
        );

    },


    // =====================================================
    // TABLA UNIFICADA
    // =====================================================

    movimientos() {

      const gastos =
        this.gastos.map(
          gasto => ({

            id:
              gasto.id,

            tipo:
              "GASTO",

            fecha:
              gasto.fecha,

            titulo:
              this.formatearCategoria(
                gasto.categoria
              ),

            descripcion:
              gasto.descripcion,

            idOrden:
              gasto.idOrden,

            formaPago:
              gasto.formaPago,

            monto:
              Number(
                gasto.monto || 0
              ),

            tieneComprobante:
              Boolean(
                gasto.comprobanteStorageKey
              ),

            comprobanteNombre:
              gasto.comprobanteNombre
              ||
              "Comprobante",

            comprobanteMimeType:
              gasto.comprobanteMimeType
              ||
              ""

          })
        );


      const compras =
        this.compras.map(
          compra => {

            const producto =
              this.productos.find(
                p =>
                  Number(p.id) ===
                  Number(compra.idProducto)
              );


            return {

              id:
                compra.id,

              tipo:
                "COMPRA",

              fecha:
                compra.fecha,

              titulo:
                producto
                  ? `Compra · ${producto.nombre}`
                  : `Compra producto #${compra.idProducto}`,

              descripcion:
                compra.numeroDocumento
                  ? `Documento ${compra.numeroDocumento}`
                  : (
                      compra.observacion
                      ||
                      "Compra de inventario"
                    ),

              idOrden:
                compra.idOrden || null,

              formaPago:
                compra.formaPago || null,

              monto:
                Number(
                  compra.costoTotal || 0
                ),

              tieneComprobante:
                Boolean(
                  compra.comprobanteStorageKey
                ),

              comprobanteNombre:
                compra.comprobanteNombre
                ||
                "Comprobante de compra",

              comprobanteMimeType:
                compra.comprobanteMimeType
                ||
                ""

            };

          }
        );


      return [
        ...gastos,
        ...compras
      ].sort(
        (a, b) =>
          new Date(b.fecha)
          -
          new Date(a.fecha)
      );

    }

  },


  mounted() {

    this.cargarDashboard();

  },


  beforeUnmount() {

    this.liberarArchivoPreview();

  },


  methods: {

    // =====================================================
    // COMPROBANTE
    // =====================================================

    async verComprobante(
      movimiento
    ) {

      if (
        !movimiento.tieneComprobante
      ) {
        return;
      }


      this.modalComprobante =
        true;

      this.cargandoComprobante =
        true;

      this.nombreComprobante =
        movimiento.comprobanteNombre
        ||
        "Comprobante";

      this.tipoComprobante =
        "";


      this.liberarArchivoPreview();


      try {

        const blob =
          movimiento.tipo === "COMPRA"
            ? await obtenerComprobanteCompraFachada(
                movimiento.id
              )
            : await obtenerComprobanteGastoFachada(
                movimiento.id
              );


        this.archivoPreview =
          URL.createObjectURL(
            blob
          );


        const mime =
          String(
            blob.type
            ||
            movimiento.comprobanteMimeType
            ||
            ""
          ).toLowerCase();


        if (
          mime.startsWith(
            "image/"
          )
        ) {

          this.tipoComprobante =
            "imagen";

        } else if (
          mime.includes(
            "pdf"
          )
        ) {

          this.tipoComprobante =
            "pdf";

        } else {

          this.tipoComprobante =
            "otro";

        }


      } catch (error) {

        console.error(
          "Error cargando comprobante:",
          error
        );


        this.cerrarComprobante();


        this.mensajeError =
          "No se pudo abrir el comprobante.";


      } finally {

        this.cargandoComprobante =
          false;

      }

    },


    cerrarComprobante() {

      this.modalComprobante =
        false;

      this.cargandoComprobante =
        false;

      this.tipoComprobante =
        "";

      this.nombreComprobante =
        "";

      this.liberarArchivoPreview();

    },


    liberarArchivoPreview() {

      if (
        this.archivoPreview
        &&
        this.archivoPreview.startsWith(
          "blob:"
        )
      ) {

        URL.revokeObjectURL(
          this.archivoPreview
        );

      }


      this.archivoPreview =
        "";

    },


    abrirComprobanteNuevaVentana() {

      if (
        !this.archivoPreview
      ) {
        return;
      }


      window.open(
        this.archivoPreview,
        "_blank"
      );

    },


    // =====================================================
    // DASHBOARD
    // =====================================================

    async cargarDashboard() {

      this.cargando =
        true;

      this.mensajeError =
        "";


      try {

        const [
          resumen,
          gastos,
          compras,
          resumenFinanciero
        ] =
          await Promise.all([

            obtenerResumenGastosFachada(
              this.anioSeleccionado,
              this.mesSeleccionado
            ),

            obtenerGastosMesFachada(
              this.anioSeleccionado,
              this.mesSeleccionado
            ),

            obtenerComprasMesFachada(
              this.anioSeleccionado,
              this.mesSeleccionado
            ),

            obtenerResumenFinancieroFachada(
              this.anioSeleccionado,
              this.mesSeleccionado
            )

          ]);


        this.resumen =
          resumen || {};


        this.resumenFinanciero =
          resumenFinanciero || {};


        this.gastos =
          Array.isArray(gastos)
            ? gastos
            : [];


        this.compras =
          Array.isArray(compras)
            ? compras
            : [];


      } catch (error) {

        console.error(
          "Error cargando dashboard de gastos:",
          error
        );


        this.mensajeError =
          "No se pudo cargar la información financiera del período.";


      } finally {

        this.cargando =
          false;

      }

    },


    // =====================================================
    // CAMBIAR MES
    // =====================================================

    mesAnterior() {

      if (
        this.mesSeleccionado === 1
      ) {

        this.mesSeleccionado =
          12;

        this.anioSeleccionado--;

      } else {

        this.mesSeleccionado--;

      }


      this.cargarDashboard();

    },


    mesSiguiente() {

      if (
        this.mesSeleccionado === 12
      ) {

        this.mesSeleccionado =
          1;

        this.anioSeleccionado++;

      } else {

        this.mesSeleccionado++;

      }


      this.cargarDashboard();

    },


    irMesActual() {

      const ahora =
        new Date();


      this.anioSeleccionado =
        ahora.getFullYear();


      this.mesSeleccionado =
        ahora.getMonth() + 1;


      this.cargarDashboard();

    },


    // =====================================================
    // GASTOS
    // =====================================================

    registrarGasto() {

      this.$router.push(
        "/gastos/registrar"
      );

    },


    editarGasto(id) {

      if (!id) {
        return;
      }


      this.$router.push(
        `/gastos/editar/${id}`
      );

    },


    // =====================================================
    // COMPRA - ABRIR
    // =====================================================

    async abrirCompra() {

      this.resetCompra();

      this.modoEdicionCompra =
        false;

      this.compraEditandoId =
        null;

      this.modalCompra =
        true;


      await this.cargarDatosCompra();

    },


    // =====================================================
    // COMPRA - EDITAR
    // =====================================================

    async editarCompra(id) {

      const compraExistente =
        this.compras.find(
          compra =>
            Number(compra.id) === Number(id)
        );


      if (!compraExistente) {

        this.mensajeError =
          "No se pudo localizar la compra seleccionada.";

        return;
      }


      this.resetCompra();

      this.modoEdicionCompra =
        true;

      this.compraEditandoId =
        compraExistente.id;

      this.idProductoOriginalCompra =
        compraExistente.idProducto;

      this.cantidadOriginalCompra =
        Number(compraExistente.cantidad || 0);

      this.tieneComprobanteCompraExistente =
        Boolean(
          compraExistente.comprobanteStorageKey
        );

      this.nombreComprobanteCompraExistente =
        compraExistente.comprobanteNombre
        ||
        "";

      this.modalCompra =
        true;


      await this.cargarDatosCompra();


      this.compra = {

        idProducto:
          compraExistente.idProducto ?? null,

        cantidad:
          compraExistente.cantidad ?? "",

        costoUnitario:
          compraExistente.costoUnitario ?? "",

        idProveedor:
          compraExistente.idProveedor ?? null,

        idOrden:
          compraExistente.idOrden ?? null,

        formaPago:
          compraExistente.formaPago ?? "",

        numeroDocumento:
          compraExistente.numeroDocumento ?? "",

        observacion:
          compraExistente.observacion ?? ""

      };

    },


    // =====================================================
    // COMPRA - CARGAR DATOS
    // =====================================================

    async cargarDatosCompra() {

      this.cargandoDatosCompra =
        true;

      this.mensajeCompraError =
        "";


      try {

        const [
          productos,
          proveedores,
          ordenes
        ] =
          await Promise.all([

            obtenerTodosLosProductosFachada(),

            obtenerTodosLosProveedorsFachada(),

            consultarOrdenFachada()

          ]);


        this.productos =
          Array.isArray(productos)
            ? productos
            : [];


        this.proveedores =
          Array.isArray(proveedores)
            ? proveedores
            : [];


        this.ordenes =
          Array.isArray(ordenes)
            ? ordenes
            : [];


      } catch (error) {

        console.error(
          "Error cargando datos para compra:",
          error
        );


        this.mensajeCompraError =
          "No se pudieron cargar productos, proveedores u órdenes de trabajo.";


      } finally {

        this.cargandoDatosCompra =
          false;

      }

    },


    // =====================================================
    // PRODUCTO CAMBIADO
    // =====================================================

    productoCompraCambiado() {

      const producto =
        this.productoSeleccionado;


      if (!producto) {
        return;
      }


      /*
       * Si no se había seleccionado proveedor manualmente,
       * intentamos colocar el asociado al producto.
       */

      if (
        !this.compra.idProveedor
        &&
        producto.idProveedor
      ) {

        this.compra.idProveedor =
          producto.idProveedor;

      }

    },


    // =====================================================
    // COMPROBANTE DE COMPRA
    // =====================================================

    abrirSelectorComprobanteCompra() {

      if (
        this.guardandoCompra
      ) {
        return;
      }


      this.$refs.inputComprobanteCompra
        ?.click();

    },


    seleccionarComprobanteCompra(event) {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
      ];


      if (
        !tiposPermitidos.includes(
          file.type
        )
      ) {

        this.mensajeCompraError =
          "El comprobante debe ser PDF, JPG, PNG o WEBP.";

        event.target.value =
          "";

        return;
      }


      const maxSize =
        10 * 1024 * 1024;


      if (
        file.size > maxSize
      ) {

        this.mensajeCompraError =
          "El comprobante no puede superar los 10 MB.";

        event.target.value =
          "";

        return;
      }


      this.mensajeCompraError =
        "";

      this.comprobanteCompra =
        file;

    },


    eliminarComprobanteCompra() {

      this.comprobanteCompra =
        null;


      if (
        this.$refs.inputComprobanteCompra
      ) {

        this.$refs.inputComprobanteCompra.value =
          "";

      }

    },


    formatearTamanoArchivo(bytes) {

      if (!bytes) {
        return "0 KB";
      }


      if (
        bytes < 1024 * 1024
      ) {

        return (
          bytes / 1024
        ).toFixed(1) + " KB";

      }


      return (
        bytes /
        (1024 * 1024)
      ).toFixed(1) + " MB";

    },


    // =====================================================
    // GUARDAR / ACTUALIZAR COMPRA
    // =====================================================

    async guardarCompra() {

      this.mensajeCompraError =
        "";

      this.mensajeCompraExito =
        "";


      const cantidad =
        Number(
          this.compra.cantidad
        );


      const costoUnitario =
        Number(
          this.compra.costoUnitario
        );


      if (
        !this.compra.idProducto
      ) {

        this.mensajeCompraError =
          "Selecciona el producto comprado.";

        return;
      }


      if (
        !Number.isFinite(cantidad)
        ||
        cantidad <= 0
      ) {

        this.mensajeCompraError =
          "La cantidad debe ser mayor a cero.";

        return;
      }


      if (
        !Number.isFinite(costoUnitario)
        ||
        costoUnitario <= 0
      ) {

        this.mensajeCompraError =
          "El costo unitario debe ser mayor a cero.";

        return;
      }


      this.guardandoCompra =
        true;


      try {

        const body = {

          idProducto:
            Number(
              this.compra.idProducto
            ),

          cantidad,

          costoUnitario,

          numeroDocumento:
            this.compra.numeroDocumento
            ||
            null,

          observacion:
            this.compra.observacion
            ||
            null,

          formaPago:
            this.compra.formaPago
            ||
            null,

          idOrden:
            this.compra.idOrden
            !== null
            &&
            this.compra.idOrden !== ""
              ? Number(this.compra.idOrden)
              : null

        };


        if (
          this.compra.idProveedor
        ) {

          body.idProveedor =
            Number(
              this.compra.idProveedor
            );

        }


        if (
          this.modoEdicionCompra
        ) {

          await actualizarCompraProductoFachada(
            this.compraEditandoId,
            body,
            this.comprobanteCompra
          );


          this.mensajeCompraExito =
            "Compra actualizada correctamente. El inventario fue ajustado.";

        } else {

          await crearCompraProductoFachada(
            body,
            this.comprobanteCompra
          );


          this.mensajeCompraExito =
            "Compra registrada correctamente. El stock y el costo promedio fueron actualizados.";

        }


        const productosActualizados =
          await obtenerTodosLosProductosFachada();


        this.productos =
          Array.isArray(productosActualizados)
            ? productosActualizados
            : [];


        await this.cargarDashboard();


        setTimeout(
          () => {

            this.cerrarCompra();

          },
          1300
        );


      } catch (error) {

        console.error(
          this.modoEdicionCompra
            ? "Error actualizando compra:"
            : "Error registrando compra:",
          error
        );


        this.mensajeCompraError =
          typeof error.response?.data === "string"
            ? error.response.data
            : (
                this.modoEdicionCompra
                  ? "No se pudo actualizar la compra."
                  : "No se pudo registrar la compra."
              );


      } finally {

        this.guardandoCompra =
          false;

      }

    },


    // =====================================================
    // CERRAR COMPRA
    // =====================================================

    cerrarCompra() {

      if (
        this.guardandoCompra
      ) {
        return;
      }


      this.modalCompra =
        false;


      this.resetCompra();

    },


    // =====================================================
    // RESET COMPRA
    // =====================================================

    resetCompra() {

      this.compra = {
        idProducto: null,
        cantidad: "",
        costoUnitario: "",
        idProveedor: null,
        idOrden: null,
        formaPago: "",
        numeroDocumento: "",
        observacion: ""
      };


      this.comprobanteCompra =
        null;


      if (
        this.$refs.inputComprobanteCompra
      ) {

        this.$refs.inputComprobanteCompra.value =
          "";

      }


      this.mensajeCompraError =
        "";

      this.mensajeCompraExito =
        "";


      this.modoEdicionCompra =
        false;

      this.compraEditandoId =
        null;

      this.idProductoOriginalCompra =
        null;

      this.cantidadOriginalCompra =
        0;

      this.tieneComprobanteCompraExistente =
        false;

      this.nombreComprobanteCompraExistente =
        "";

    },


    textoOrdenCompra(orden) {

      if (!orden) {
        return "Orden";
      }


      const id =
        orden.id;


      const cliente =
        orden.cliente?.nombre
        ||
        orden.nombreCliente
        ||
        "";


      return cliente
        ? `OT-${id} · ${cliente}`
        : `OT-${id}`;

    },


    // =====================================================
    // FORMATOS
    // =====================================================

    formatearMoneda(
      valor
    ) {

      return new Intl.NumberFormat(
        "es-EC",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
        }
      ).format(
        Number(
          valor || 0
        )
      );

    },


    formatearFecha(
      fecha
    ) {

      if (!fecha) {
        return "—";
      }


      return new Intl.DateTimeFormat(
        "es-EC",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      ).format(
        new Date(
          fecha
        )
      );

    },


    formatearCategoria(
      valor
    ) {

      if (!valor) {
        return "Sin definir";
      }


      return String(
        valor
      )
        .replaceAll(
          "_",
          " "
        )
        .toLowerCase()
        .replace(
          /\b\w/g,
          letra =>
            letra.toUpperCase()
        );

    }

  }

};
</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.gastos-page {
  min-height: 100vh;
  padding: 34px;
  background: linear-gradient(135deg, #f8fbff 0%, #eef4fb 100%);
  color: #1e293b;
}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.page-header {
  max-width: 1450px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 29px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}


.eyebrow {
  display: block;
  color: #2563eb;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}


.page-header h1 {
  margin: 4px 0 0;
  color: #123b6d;
  font-size: 1.7rem;
  font-weight: 900;
}


.page-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 0.73rem;
}


.header-actions {
  display: flex;
  gap: 8px;
}


/* ========================================================= */
/* BOTONES GENERALES */
/* ========================================================= */

.primary-button,
.secondary-button,
.today-button,
.refresh-button {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 13px;
  border-radius: 9px;
  font-size: 0.66rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}


.primary-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
}


.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
}


.secondary-button {
  border: 1px solid #dce4ee;
  background: #ffffff;
  color: #475569;
}


.secondary-button:hover:not(:disabled) {
  background: #f8fafc;
}


.refresh-button,
.today-button {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}


button:disabled,
input:disabled,
select:disabled,
textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* ========================================================= */
/* PERÍODO */
/* ========================================================= */

.period-card {
  max-width: 1450px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}


.period-info {
  flex: 1;
  text-align: center;
}


.period-info span {
  display: block;
  color: #94a3b8;
  font-size: 0.48rem;
  font-weight: 900;
}


.period-info strong {
  display: block;
  margin-top: 2px;
  color: #334155;
  font-size: 0.78rem;
}


.period-nav {
  width: 35px;
  height: 35px;
  border: 1px solid #dce4ee;
  border-radius: 8px;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
}


/* ========================================================= */
/* RESUMEN */
/* ========================================================= */

.financial-summary-grid {
  max-width: 1450px;
  margin: 0 auto 13px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.portfolio-alert {
  max-width: 1450px;
  margin: 0 auto 18px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fff7f7;
  color: #991b1b;
  font-size: 0.78rem;
}

.summary-icon.red {
  background: #fef2f2;
  color: #dc2626;
}

.summary-card.negative-flow {
  border-color: #fecaca;
}

.summary-grid {
  max-width: 1450px;
  margin: 0 auto 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
}


.summary-card {
  min-height: 105px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  background: #ffffff;
}


.summary-card.principal {
  border-color: #bfdbfe;
  background: linear-gradient(135deg, #f8fbff, #ffffff);
}


.summary-icon {
  width: 47px;
  height: 47px;
  min-width: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  font-size: 1.05rem;
}


.summary-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}


.summary-icon.orange {
  background: #fff7ed;
  color: #ea580c;
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
  font-size: 0.62rem;
}


.summary-card strong {
  display: block;
  margin-top: 2px;
  color: #172033;
  font-size: 1.22rem;
  font-weight: 900;
}


.summary-card small {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.54rem;
}


/* ========================================================= */
/* PANELES */
/* ========================================================= */

.dashboard-grid {
  max-width: 1450px;
  margin: 0 auto 18px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 14px;
}


.panel,
.movements-panel {
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
  box-shadow: 0 7px 22px rgba(15, 23, 42, 0.04);
}


.panel {
  padding: 22px;
}


.movements-panel {
  max-width: 1450px;
  margin: 0 auto;
  padding: 22px;
}


.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 17px;
}


.panel-header h2 {
  margin: 0;
  color: #172033;
  font-size: 0.9rem;
  font-weight: 900;
}


.panel-header p {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 0.58rem;
}


/* ========================================================= */
/* CATEGORÍAS */
/* ========================================================= */

.category-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}


.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}


.category-header div strong {
  display: block;
  color: #475569;
  font-size: 0.63rem;
}


.category-header div span {
  color: #94a3b8;
  font-size: 0.52rem;
}


.category-header > strong {
  color: #334155;
  font-size: 0.67rem;
}


.progress-track {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: #eef2f7;
}


.progress-value {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}


/* ========================================================= */
/* COMPOSICIÓN */
/* ========================================================= */

.composition-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.composition-row {
  display: grid;
  grid-template-columns: 39px 1fr auto;
  align-items: center;
  gap: 9px;
  padding: 11px;
  border: 1px solid #edf1f5;
  border-radius: 10px;
  background: #fbfdff;
}


.composition-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
}


.composition-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}


.composition-icon.purple {
  background: #f5f3ff;
  color: #7c3aed;
}


.composition-info span {
  display: block;
  color: #64748b;
  font-size: 0.57rem;
}


.composition-info strong {
  display: block;
  color: #334155;
  font-size: 0.72rem;
}


.composition-row > span {
  color: #64748b;
  font-size: 0.58rem;
  font-weight: 800;
}


.financial-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin-top: 14px;
  padding: 10px;
  border: 1px solid #bfdbfe;
  border-radius: 9px;
  background: #eff6ff;
  color: #475569;
  font-size: 0.56rem;
  line-height: 1.5;
}


.financial-note i {
  color: #2563eb;
}


/* ========================================================= */
/* TABLA */
/* ========================================================= */

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e8edf3;
  border-radius: 11px;
}


.movements-table {
  width: 100%;
  min-width: 1050px;
  border-collapse: collapse;
}


.movements-table th {
  padding: 11px 12px;
  border-bottom: 1px solid #dfe7ef;
  background: #f3f7fc;
  color: #53657c;
  font-size: 0.56rem;
  font-weight: 900;
  text-align: left;
  text-transform: uppercase;
}


.movements-table td {
  padding: 12px;
  border-bottom: 1px solid #edf1f5;
  color: #475569;
  font-size: 0.62rem;
  vertical-align: middle;
}


.movements-table tbody tr:hover {
  background: #fbfdff;
}


.date-cell {
  white-space: nowrap;
}


.text-center-custom {
  text-align: center !important;
}


.text-right-custom {
  text-align: right !important;
}


.type-badge,
.order-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  border-radius: 999px;
  font-size: 0.52rem;
  font-weight: 800;
}


.expense-type {
  background: #fff7ed;
  color: #ea580c;
}


.purchase-type {
  background: #f5f3ff;
  color: #7c3aed;
}


.order-badge {
  background: #eff6ff;
  color: #2563eb;
}


.movement-detail strong {
  display: block;
  color: #334155;
  font-size: 0.63rem;
}


.movement-detail span {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.53rem;
}


.amount-cell {
  color: #b91c1c !important;
  font-weight: 900;
  text-align: right;
  white-space: nowrap;
}


.no-data,
.no-receipt {
  color: #b6c0cd;
}


/* ========================================================= */
/* COMPROBANTE / ACCIONES */
/* ========================================================= */

.receipt-cell,
.actions-cell {
  text-align: center;
  white-space: nowrap;
}


.receipt-button,
.edit-button {
  min-height: 31px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 10px;
  border: 1px solid #bfdbfe;
  border-radius: 7px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.55rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}


.receipt-button:hover,
.edit-button:hover {
  border-color: #93c5fd;
  background: #dbeafe;
  color: #1d4ed8;
}


/* ========================================================= */
/* VACÍOS / CARGANDO */
/* ========================================================= */

.empty-state,
.empty-small,
.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  text-align: center;
}


.empty-state {
  min-height: 230px;
}


.empty-small {
  min-height: 160px;
  color: #94a3b8;
  font-size: 0.6rem;
}


.empty-state > div {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
}


.empty-state h3 {
  margin: 3px 0 0;
  color: #475569;
  font-size: 0.74rem;
}


.empty-state p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.59rem;
}


.message,
.loading-card {
  max-width: 1450px;
  margin: 0 auto 18px;
}


.message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 13px;
  border-radius: 9px;
}


.message span {
  flex: 1;
}


.error-message {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.61rem;
}


.error-message button {
  border: none;
  background: transparent;
  color: #b91c1c;
  font-size: 0.58rem;
  font-weight: 900;
  cursor: pointer;
}


.loading-card {
  min-height: 270px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
  color: #64748b;
  font-size: 0.63rem;
}


/* ========================================================= */
/* MODALES */
 /* ========================================================= */

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(5px);
}


/* ========================================================= */
/* COMPROBANTE */
 /* ========================================================= */

.receipt-modal {
  width: min(100%, 1000px);
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 17px;
  background: #ffffff;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.35);
}


.receipt-modal-header,
.purchase-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  padding: 19px 22px;
  border-bottom: 1px solid #e8edf3;
  background: #ffffff;
}


.modal-eyebrow {
  display: block;
  color: #2563eb;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}


.receipt-modal-header h3,
.purchase-modal-header h3 {
  margin: 3px 0 0;
  color: #172033;
  font-size: 0.95rem;
  font-weight: 900;
}


.purchase-modal-header p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 0.58rem;
}


.close-modal-button {
  width: 36px;
  height: 36px;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
}


.close-modal-button:hover:not(:disabled) {
  background: #f1f5f9;
  color: #334155;
}


.receipt-modal-body {
  min-height: 350px;
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f4f7fb;
}


.receipt-image {
  display: block;
  max-width: 100%;
  max-height: 67vh;
  object-fit: contain;
  border-radius: 8px;
}


.receipt-frame {
  width: 100%;
  height: 67vh;
  border: none;
  border-radius: 8px;
  background: #ffffff;
}


.receipt-loading {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #64748b;
  font-size: 0.65rem;
}


.unsupported-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 40px;
  color: #64748b;
  text-align: center;
}


.unsupported-file i {
  color: #2563eb;
  font-size: 2rem;
}


.receipt-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid #e8edf3;
}


/* ========================================================= */
/* MODAL COMPRA */
 /* ========================================================= */

.purchase-modal {
  width: min(100%, 780px);
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.35);
}


.purchase-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 22px;
  background: #ffffff;
}


.purchase-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}


.purchase-field.full {
  grid-column: 1 / -1;
}


.purchase-field label {
  display: block;
  margin-bottom: 7px;
  color: #334155;
  font-size: 0.64rem;
  font-weight: 900;
}


.purchase-field label span {
  color: #dc2626;
}


.purchase-field input,
.purchase-field select,
.purchase-field textarea {
  width: 100%;
  border: 1px solid #d7e0ea;
  border-radius: 9px;
  background: #fbfdff;
  color: #334155;
  font-size: 0.68rem;
  outline: none;
  transition: all 0.2s ease;
}


.purchase-field input,
.purchase-field select {
  height: 44px;
  padding: 0 11px;
}


.purchase-field textarea {
  min-height: 88px;
  padding: 11px;
  resize: vertical;
}


.purchase-field input:focus,
.purchase-field select:focus,
.purchase-field textarea:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.07);
}


.purchase-help {
  display: block;
  margin-top: 5px;
  color: #94a3b8;
  font-size: 0.52rem;
}


.money-input {
  height: 44px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid #d7e0ea;
  border-radius: 9px;
  background: #fbfdff;
}


.money-input:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.07);
}


.money-input > span {
  padding-left: 12px;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 900;
}


.money-input input {
  height: 100%;
  border: none;
  background: transparent;
  box-shadow: none !important;
}


.purchase-total {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  border: 1px solid #bfdbfe;
  border-radius: 9px;
  background: #eff6ff;
  color: #b91c1c;
  font-size: 0.86rem;
  font-weight: 900;
}


/* ========================================================= */
/* PREVIEW PRODUCTO */
 /* ========================================================= */

.product-preview {
  display: grid;
  grid-template-columns: 45px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 14px;
  border: 1px solid #bfdbfe;
  border-radius: 11px;
  background: #f8fbff;
}


.product-preview-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
  font-size: 1rem;
}


.product-preview-info span,
.stock-result span {
  display: block;
  color: #64748b;
  font-size: 0.49rem;
  font-weight: 900;
}


.product-preview-info strong {
  display: block;
  margin-top: 2px;
  color: #334155;
  font-size: 0.7rem;
}


.product-preview-info small,
.stock-result small {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.53rem;
}


.stock-result {
  text-align: right;
}


.stock-result strong {
  display: block;
  margin-top: 2px;
  color: #15803d;
  font-size: 0.85rem;
  font-weight: 900;
}


/* ========================================================= */
/* RESUMEN COMPRA */
 /* ========================================================= */

.purchase-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}


.purchase-summary > div {
  padding: 11px 13px;
  border-right: 1px solid #e2e8f0;
  background: #fbfdff;
}


.purchase-summary > div:last-child {
  border-right: none;
}


.purchase-summary span {
  display: block;
  color: #94a3b8;
  font-size: 0.48rem;
  font-weight: 900;
}


.purchase-summary strong {
  display: block;
  margin-top: 3px;
  color: #334155;
  font-size: 0.7rem;
}


.purchase-summary-total {
  background: #eff6ff !important;
}


.purchase-summary-total strong {
  color: #b91c1c;
  font-size: 0.8rem;
}


/* ========================================================= */
/* MENSAJES COMPRA */
 /* ========================================================= */

.purchase-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 11px 12px;
  border-radius: 9px;
  font-size: 0.61rem;
}


.purchase-message.error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}


.purchase-message.success {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}


.purchase-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 15px 22px;
  border-top: 1px solid #e8edf3;
  background: #ffffff;
}


/* ========================================================= */
/* COMPROBANTE DE COMPRA */
/* ========================================================= */

.purchase-file-description {
  margin: -2px 0 8px;
}

.purchase-existing-file {
  min-height: 82px;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  margin-bottom: 10px;
  padding: 14px 15px;
  border: 1px solid #bbf7d0;
  border-radius: 11px;
  background: #f0fdf4;
}

.purchase-existing-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 1.1rem;
}

.purchase-existing-info {
  min-width: 0;
}

.purchase-existing-info strong,
.purchase-existing-info span,
.purchase-existing-info small {
  display: block;
}

.purchase-existing-info strong {
  color: #166534;
  font-size: 0.64rem;
  font-weight: 900;
}

.purchase-existing-info span {
  margin-top: 3px;
  overflow: hidden;
  color: #475569;
  font-size: 0.57rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-existing-info small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.5rem;
}


.purchase-upload-box {
  min-height: 92px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  padding: 14px 15px;
  border: 1.5px dashed #aebfd2;
  border-radius: 11px;
  background: #f8fbff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.purchase-upload-box:hover {
  border-color: #60a5fa;
  background: #f0f6ff;
}

.purchase-upload-box.has-file {
  border-style: solid;
  border-color: #86efac;
  background: #f0fdf4;
}

.purchase-upload-icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
  font-size: 1.15rem;
}

.purchase-upload-box.has-file .purchase-upload-icon {
  background: #dcfce7;
  color: #16a34a;
}

.purchase-upload-info {
  min-width: 0;
}

.purchase-upload-info strong,
.purchase-upload-info span,
.purchase-upload-info small {
  display: block;
}

.purchase-upload-info strong {
  overflow: hidden;
  color: #334155;
  font-size: 0.66rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-upload-info span {
  margin-top: 3px;
  color: #64748b;
  font-size: 0.57rem;
}

.purchase-upload-info small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.51rem;
}

.purchase-file-button {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 11px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #ffffff;
  color: #2563eb;
  font-size: 0.57rem;
  font-weight: 900;
  cursor: pointer;
}

.purchase-remove-file {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #ffffff;
  color: #dc2626;
  cursor: pointer;
}


/* ========================================================= */
/* RESPONSIVE */
 /* ========================================================= */

@media (max-width: 1000px) {

  .summary-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }


  .dashboard-grid {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 700px) {
  .financial-summary-grid {
    grid-template-columns: 1fr;
  }


  .gastos-page {
    padding: 16px;
  }


  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }


  .header-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }


  .header-actions button {
    width: 100%;
  }


  .summary-grid {
    grid-template-columns: 1fr;
  }


  .today-button {
    display: none;
  }


  .modal-backdrop-custom {
    padding: 10px;
  }


  .purchase-modal {
    max-height: 95vh;
  }


  .purchase-grid {
    grid-template-columns: 1fr;
  }


  .purchase-field.full {
    grid-column: auto;
  }


  .purchase-upload-box,
  .purchase-existing-file {
    grid-template-columns: 44px minmax(0, 1fr);
  }


  .purchase-existing-file .purchase-file-button {
    grid-column: 1 / -1;
    width: 100%;
  }


  .purchase-file-button,
  .purchase-remove-file {
    grid-column: 1 / -1;
  }


  .purchase-file-button {
    width: 100%;
  }


  .product-preview {
    grid-template-columns: 42px 1fr;
  }


  .stock-result {
    grid-column: 1 / -1;
    padding-top: 8px;
    border-top: 1px solid #dbeafe;
    text-align: right;
  }


  .purchase-summary {
    grid-template-columns: 1fr;
  }


  .purchase-summary > div {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }


  .purchase-summary > div:last-child {
    border-bottom: none;
  }


  .purchase-modal-footer,
  .receipt-modal-footer {
    display: grid;
    grid-template-columns: 1fr;
  }


  .purchase-modal-footer button,
  .receipt-modal-footer button {
    width: 100%;
  }


  .receipt-modal {
    max-height: 95vh;
  }


  .receipt-frame {
    height: 70vh;
  }

}
</style>