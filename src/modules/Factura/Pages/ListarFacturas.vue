<template>
  <div class="invoices-page">
    <section class="page-header">
      <div>
        <span class="page-eyebrow">FACTURACIÓN Y COBROS</span>
        <h1>Facturas</h1>
        <p>Controla lo facturado, lo realmente cobrado y los saldos pendientes de tus clientes.</p>
      </div>
      <button type="button" class="primary-button" @click="redirigirCrearFactura">
        <i class="bi bi-plus-lg"></i> Nueva factura
      </button>
    </section>

    <section class="summary-grid">
      <div class="summary-card">
        <div class="summary-icon blue"><i class="bi bi-receipt"></i></div>
        <div><span>Total facturado</span><strong>{{ moneda(totalFacturado) }}</strong></div>
      </div>
      <div class="summary-card">
        <div class="summary-icon green"><i class="bi bi-cash-stack"></i></div>
        <div><span>Total cobrado</span><strong>{{ moneda(totalCobrado) }}</strong></div>
      </div>
      <div class="summary-card">
        <div class="summary-icon orange"><i class="bi bi-hourglass-split"></i></div>
        <div><span>Por cobrar</span><strong>{{ moneda(totalPendiente) }}</strong></div>
      </div>
      <div class="summary-card">
        <div class="summary-icon red"><i class="bi bi-exclamation-triangle"></i></div>
        <div><span>Facturas vencidas</span><strong>{{ facturasVencidas.length }}</strong></div>
      </div>
    </section>

    <section v-if="facturasPorCobrar.length" class="pending-alert">
      <div class="pending-alert-icon"><i class="bi bi-wallet2"></i></div>
      <div class="pending-alert-content">
        <span class="pending-alert-eyebrow">CARTERA POR COBRAR</span>
        <strong>{{ facturasPorCobrar.length }} factura(s) mantienen saldo pendiente</strong>
        <p>Registre los cobros cuando el dinero sea efectivamente recibido. No cambie el estado manualmente.</p>
      </div>
      <div class="pending-alert-count">{{ facturasPorCobrar.length }}</div>
    </section>

    <div v-if="mensajeExito" class="message success-message">
      <i class="bi bi-check-circle-fill"></i><span>{{ mensajeExito }}</span>
    </div>
    <div v-if="mensajeError" class="message error-message">
      <i class="bi bi-exclamation-circle-fill"></i><span>{{ mensajeError }}</span>
      <button type="button" @click="cargarFacturas">Reintentar</button>
    </div>

    <section class="invoices-panel">
      <div class="panel-header">
        <div>
          <h2>Listado de facturas</h2>
          <p>{{ facturasFiltradas.length }} factura(s) encontrada(s)</p>
        </div>
        <button type="button" class="refresh-button" :disabled="cargando" @click="cargarFacturas">
          <i class="bi bi-arrow-clockwise" :class="{ rotating: cargando }"></i> Actualizar
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model.trim="filtro" placeholder="Buscar por cliente, orden o estado...">
          <button v-if="filtro" type="button" @click="filtro = ''"><i class="bi bi-x"></i></button>
        </div>
        <select v-model="filtroEstado" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="PARCIAL">Pago parcial</option>
          <option value="PAGADA">Pagadas</option>
          <option value="ANULADA">Anuladas</option>
          <option value="VENCIDA">Vencidas</option>
        </select>
        <button v-if="filtro || filtroEstado" class="clear-filters-button" @click="limpiarFiltros">
          <i class="bi bi-funnel"></i> Limpiar
        </button>
      </div>

      <div v-if="cargando" class="loading-state">
        <div class="spinner-border text-primary"></div><span>Cargando facturas y cobros...</span>
      </div>

      <div v-else-if="!facturasFiltradas.length" class="empty-state">
        <div class="empty-icon"><i class="bi bi-receipt"></i></div>
        <h3>No encontramos facturas</h3>
        <p>Prueba cambiando los filtros o registra una nueva factura.</p>
      </div>

      <template v-else>
        <div class="table-wrapper">
          <table class="invoices-table">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Orden</th>
                <th>Facturado</th>
                <th>Cobrado</th>
                <th>Saldo</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in facturasPaginadas" :key="f.id" :class="{ 'overdue-row': f.vencida }">
                <td>
                  <div class="date-cell">
                    <div class="date-icon"><i class="bi bi-calendar3"></i></div>
                    <div><strong>{{ formatearFecha(f.fechaEmision || f.fecha) }}</strong><span>Factura #{{ f.id
                        }}</span></div>
                  </div>
                </td>
                <td>
                  <div class="client-cell">
                    <div class="client-avatar">{{ iniciales(f.nombreCliente) }}</div>
                    <strong>{{ f.nombreCliente || "Cliente no disponible" }}</strong>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="claseEstado(f)">
                    <span class="status-dot"></span>{{ f.vencida ? "Vencida" : textoEstado(f.estadoFactura) }}
                  </span>
                </td>
                <td><span class="order-badge"><i class="bi bi-clipboard-check"></i> Orden {{ f.idOrden }}</span></td>
                <td class="money"><strong>{{ moneda(f.totalFactura) }}</strong></td>
                <td class="money collected"><strong>{{ moneda(f.totalCobrado) }}</strong></td>
                <td class="money" :class="{ debt: Number(f.saldoPendiente) > 0 }"><strong>{{ moneda(f.saldoPendiente)
                    }}</strong></td>
                <td>
                  <div class="due-cell">
                    <strong>{{ f.fechaVencimiento ? fechaLocal(f.fechaVencimiento) : "Sin fecha" }}</strong>
                    <span v-if="f.vencida">{{ f.diasVencida }} día(s) vencida</span>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="action-button view" title="Ver factura" @click="verFactura(f.id)"><i
                        class="bi bi-eye"></i></button>
                    <button class="action-button edit" title="Editar factura" @click="editarFactura(f.id)"><i
                        class="bi bi-pencil-square"></i></button>
                    <button v-if="f.archivos?.length" class="action-button document" title="Ver documento"
                      @click="abrirPreview(f.archivos[0])"><i class="bi bi-file-earmark-text"></i></button>
                    <button v-if="puedeCobrar(f)" class="collect-button" @click="abrirCobro(f)">
                      <i class="bi bi-cash-coin"></i> Registrar cobro
                    </button>
                    <button v-if="f.totalCobrado > 0" class="history-button" @click="abrirHistorial(f)">
                      <i class="bi bi-clock-history"></i> Pagos
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <span>Mostrando {{ indiceInicial + 1 }} - {{ indiceFinal }} de {{ facturasFiltradas.length }}</span>
          <div class="pagination">
            <button :disabled="paginaActual === 1" @click="paginaActual--"><i class="bi bi-chevron-left"></i></button>
            <span>Página <strong>{{ paginaActual }}</strong> de <strong>{{ totalPaginas }}</strong></span>
            <button :disabled="paginaActual === totalPaginas" @click="paginaActual++"><i
                class="bi bi-chevron-right"></i></button>
          </div>
        </div>
      </template>
    </section>

    <!-- REGISTRAR COBRO -->
    <div v-if="facturaCobro" class="modal-backdrop-custom" @click.self="cerrarCobro">
      <div class="payment-modal">
        <div class="modal-header-custom">
          <div><span class="modal-eyebrow">REGISTRAR INGRESO REAL</span>
            <h3>Registrar cobro</h3>
          </div>
          <button @click="cerrarCobro"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="payment-summary">
          <div><span>Factura</span><strong>#{{ facturaCobro.id }}</strong></div>
          <div><span>Facturado</span><strong>{{ moneda(facturaCobro.totalFactura) }}</strong></div>
          <div><span>Cobrado</span><strong>{{ moneda(facturaCobro.totalCobrado) }}</strong></div>
          <div class="pending"><span>Saldo pendiente</span><strong>{{ moneda(facturaCobro.saldoPendiente) }}</strong>
          </div>
        </div>

        <div class="modal-grid">
          <div class="field">
            <label>Monto recibido *</label>
            <div class="input-wrap"><i class="bi bi-currency-dollar"></i><input v-model="pago.monto" type="number"
                min="0.01" :max="facturaCobro.saldoPendiente" step="0.01"></div>
          </div>
          <div class="field">
            <label>Fecha de pago *</label>
            <div class="input-wrap"><i class="bi bi-calendar-check"></i><input v-model="pago.fechaPago"
                type="datetime-local"></div>
          </div>
          <div class="field">
            <label>Forma de pago *</label>
            <div class="input-wrap"><i class="bi bi-credit-card"></i>
              <select v-model="pago.formaPago">
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>N.º comprobante</label>
            <div class="input-wrap"><i class="bi bi-hash"></i><input v-model.trim="pago.numeroComprobante"
                placeholder="Opcional"></div>
          </div>
        </div>

        <div class="field full">
          <label>Observación</label><textarea v-model.trim="pago.observacion" rows="3"
            placeholder="Detalle opcional del cobro"></textarea>
        </div>

        <label class="receipt-upload">
          <input type="file" hidden @change="seleccionarComprobante">
          <i class="bi bi-paperclip"></i>
          <div><strong>{{ comprobantePago ? comprobantePago.name : "Adjuntar comprobante"
              }}</strong><span>Opcional</span>
          </div>
        </label>

        <div v-if="errorPago" class="payment-error"><i class="bi bi-exclamation-circle"></i>{{ errorPago }}</div>

        <div class="modal-actions">
          <button class="secondary-button" :disabled="guardandoPago" @click="cerrarCobro">Cancelar</button>
          <button class="primary-button" :disabled="guardandoPago" @click="registrarPago">
            <span v-if="guardandoPago" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i> Confirmar cobro
          </button>
        </div>
      </div>
    </div>

    <!-- HISTORIAL -->
    <div v-if="facturaHistorial" class="modal-backdrop-custom" @click.self="cerrarHistorial">
      <div class="history-modal">
        <div class="modal-header-custom">
          <div><span class="modal-eyebrow">MOVIMIENTOS</span>
            <h3>Pagos de factura #{{ facturaHistorial.id }}</h3>
          </div>
          <button @click="cerrarHistorial"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="history-summary">
          <span>Facturado <strong>{{ moneda(facturaHistorial.totalFactura) }}</strong></span>
          <span>Cobrado <strong>{{ moneda(facturaHistorial.totalCobrado) }}</strong></span>
          <span>Saldo <strong>{{ moneda(facturaHistorial.saldoPendiente) }}</strong></span>
        </div>
        <div v-if="cargandoHistorial" class="loading-state small">
          <div class="spinner-border spinner-border-sm"></div>
        </div>
        <div v-else-if="!pagosHistorial.length" class="empty-history">No existen pagos registrados.</div>
        <div v-else class="payments-list">
          <div v-for="p in pagosHistorial" :key="p.id" class="payment-row">
            <div class="payment-icon"><i class="bi bi-cash-stack"></i></div>
            <div class="payment-main"><strong>{{ moneda(p.monto) }}</strong><span>{{ formatearFechaHora(p.fechaPago) }}
                · {{
                  textoFormaPago(p.formaPago) }}</span></div>
            <div class="payment-extra">
              <span v-if="p.numeroComprobante"># {{ p.numeroComprobante }}</span>
              <button v-if="p.tieneComprobante" @click="verComprobantePago(p)"><i class="bi bi-paperclip"></i>
                Ver</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PREVIEW -->
    <div v-if="mostrarPreview" class="preview-backdrop" @click.self="cerrarPreview">
      <div class="preview-modal">
        <div class="modal-header-custom">
          <div><span class="modal-eyebrow">DOCUMENTO</span>
            <h3>Previsualización</h3>
          </div><button @click="cerrarPreview"><i class="bi bi-x-lg"></i></button>
        </div>
        <iframe v-if="archivoPreview" :src="archivoPreview"></iframe>
        <div v-else class="loading-state">
          <div class="spinner-border text-primary"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/config/api";
import { consultarFacturaFachada, obtenerArchivoFacturaFachada } from "../Helpers/FacturaHelper";

export default {
  name: "ListaFacturas",
  data() {
    return {
      facturas: [], filtro: "", filtroEstado: "", paginaActual: 1, facturasPorPagina: 10,
      cargando: false, mensajeExito: "", mensajeError: "",
      facturaCobro: null, guardandoPago: false, errorPago: "", comprobantePago: null,
      pago: { monto: "", fechaPago: "", formaPago: "TRANSFERENCIA", numeroComprobante: "", observacion: "" },
      facturaHistorial: null, pagosHistorial: [], cargandoHistorial: false,
      archivoPreview: "", mostrarPreview: false
    };
  },
  computed: {
    facturasPorCobrar() { return this.facturas.filter(f => !["PAGADA", "ANULADA"].includes(f.estadoFactura) && Number(f.saldoPendiente) > 0); },
    facturasVencidas() { return this.facturas.filter(f => f.vencida); },
    totalFacturado() { return this.facturas.filter(f => f.estadoFactura !== "ANULADA").reduce((s, f) => s + Number(f.totalFactura || 0), 0); },
    totalCobrado() { return this.facturas.reduce((s, f) => s + Number(f.totalCobrado || 0), 0); },
    totalPendiente() { return this.facturas.filter(f => f.estadoFactura !== "ANULADA").reduce((s, f) => s + Number(f.saldoPendiente || 0), 0); },
    facturasFiltradas() {
      const q = this.normalizar(this.filtro);
      return this.facturas.filter(f => {
        const estadoOk = !this.filtroEstado || (this.filtroEstado === "VENCIDA" ? f.vencida : f.estadoFactura === this.filtroEstado);
        if (!estadoOk) return false;
        return !q || this.normalizar([f.id, f.nombreCliente, f.idOrden, f.estadoFactura].join(" ")).includes(q);
      });
    },
    totalPaginas() { return Math.max(1, Math.ceil(this.facturasFiltradas.length / this.facturasPorPagina)); },
    indiceInicial() { return (this.paginaActual - 1) * this.facturasPorPagina; },
    indiceFinal() { return Math.min(this.indiceInicial + this.facturasPorPagina, this.facturasFiltradas.length); },
    facturasPaginadas() { return this.facturasFiltradas.slice(this.indiceInicial, this.indiceFinal); }
  },
  watch: { filtro() { this.paginaActual = 1; }, filtroEstado() { this.paginaActual = 1; } },
  mounted() { this.cargarFacturas(); },
  beforeUnmount() { this.liberarPreview(); },
  methods: {
    async cargarFacturas() {
      this.cargando = true; this.mensajeError = "";
      try {
        const lista = await consultarFacturaFachada();
        const base = Array.isArray(lista) ? lista : [];
        this.facturas = await Promise.all(base.map(async f => {
          try {
            const { data: r } = await api.get(`/pago/factura/${f.id}/resumen`);
            return { ...f, ...r, id: f.id, archivos: f.archivos || [] };
          } catch (e) {
            console.error(`Resumen factura ${f.id}:`, e);
            const total = Number(f.totalFactura || 0);
            return { ...f, totalCobrado: 0, saldoPendiente: total, vencida: false, diasVencida: 0 };
          }
        }));
      } catch (e) { console.error(e); this.mensajeError = "No se pudo cargar el listado de facturas."; }
      finally { this.cargando = false; }
    },
    puedeCobrar(f) { return !["PAGADA", "ANULADA"].includes(f.estadoFactura) && Number(f.saldoPendiente) > 0; },
    abrirCobro(f) {
      this.facturaCobro = f; this.errorPago = ""; this.comprobantePago = null;
      this.pago = { monto: Number(f.saldoPendiente).toFixed(2), fechaPago: this.ahoraLocal(), formaPago: "TRANSFERENCIA", numeroComprobante: "", observacion: "" };
    },
    cerrarCobro() { if (this.guardandoPago) return; this.facturaCobro = null; this.errorPago = ""; this.comprobantePago = null; },
    ahoraLocal() { const d = new Date(); const l = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return l.toISOString().slice(0, 16); },
    seleccionarComprobante(e) { this.comprobantePago = e.target.files?.[0] || null; e.target.value = ""; },
    async registrarPago() {
      const monto = Number(this.pago.monto);
      if (!Number.isFinite(monto) || monto <= 0) { this.errorPago = "Ingrese un monto mayor a cero."; return; }
      if (monto > Number(this.facturaCobro.saldoPendiente)) { this.errorPago = "El cobro no puede superar el saldo pendiente."; return; }
      if (!this.pago.fechaPago || !this.pago.formaPago) { this.errorPago = "Complete fecha y forma de pago."; return; }
      this.guardandoPago = true; this.errorPago = "";
      try {
        const payload = {
          idFactura: this.facturaCobro.id, fechaPago: `${this.pago.fechaPago}:00`, monto,
          formaPago: this.pago.formaPago, numeroComprobante: this.pago.numeroComprobante || null,
          observacion: this.pago.observacion || null
        };
        const fd = new FormData();
        fd.append("pago", new Blob([JSON.stringify(payload)], { type: "application/json" }));
        if (this.comprobantePago) fd.append("comprobante", this.comprobantePago);
        await api.post("/pago", fd);
        this.cerrarCobroForzado();
        this.mensajeExito = "Cobro registrado correctamente. El estado y el saldo fueron recalculados.";
        await this.cargarFacturas();
        setTimeout(() => this.mensajeExito = "", 4000);
      } catch (e) {
        console.error(e); const d = e.response?.data;
        this.errorPago = (typeof d === "string" ? d : (d?.message || d?.mensaje || d?.error)) || "No se pudo registrar el cobro.";
      } finally { this.guardandoPago = false; }
    },
    cerrarCobroForzado() { this.facturaCobro = null; this.comprobantePago = null; this.errorPago = ""; },
    async abrirHistorial(f) {
      this.facturaHistorial = f; this.pagosHistorial = []; this.cargandoHistorial = true;
      try { const { data } = await api.get(`/pago/factura/${f.id}`); this.pagosHistorial = Array.isArray(data) ? data : []; }
      catch (e) { console.error(e); this.mensajeError = "No se pudo consultar el historial de pagos."; }
      finally { this.cargandoHistorial = false; }
    },
    cerrarHistorial() { this.facturaHistorial = null; this.pagosHistorial = []; },
    async verComprobantePago(p) {
      try { const r = await api.get(`/pago/${p.id}/comprobante`, { responseType: "blob" }); this.mostrarBlob(r.data); }
      catch (e) { console.error(e); this.mensajeError = "No se pudo abrir el comprobante de pago."; }
    },
    async abrirPreview(a) {
      if (!a?.id) return; this.liberarPreview(); this.mostrarPreview = true;
      try { const blob = await obtenerArchivoFacturaFachada(a.id); this.archivoPreview = URL.createObjectURL(blob); }
      catch (e) { console.error(e); this.cerrarPreview(); this.mensajeError = "No se pudo abrir el documento."; }
    },
    mostrarBlob(blob) { this.liberarPreview(); this.archivoPreview = URL.createObjectURL(blob); this.mostrarPreview = true; },
    cerrarPreview() { this.mostrarPreview = false; this.liberarPreview(); },
    liberarPreview() { if (this.archivoPreview?.startsWith("blob:")) URL.revokeObjectURL(this.archivoPreview); this.archivoPreview = ""; },
    claseEstado(f) { if (f.vencida) return "status-overdue"; return { PAGADA: "status-paid", PARCIAL: "status-partial", ANULADA: "status-cancelled" }[f.estadoFactura] || "status-pending"; },
    textoEstado(e) { return { PENDIENTE: "Pendiente", PARCIAL: "Parcial", PAGADA: "Pagada", ANULADA: "Anulada" }[e] || e; },
    textoFormaPago(e) { return { EFECTIVO: "Efectivo", TRANSFERENCIA: "Transferencia", TARJETA: "Tarjeta", OTRO: "Otro" }[e] || e; },
    moneda(v) { return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Number(v || 0)); },
    formatearFecha(v) { if (!v) return "Sin fecha"; const d = new Date(v); return Number.isNaN(d.getTime()) ? "Sin fecha" : new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(d); },
    fechaLocal(v) { if (!v) return "Sin fecha"; const p = String(v).slice(0, 10).split("-"); return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(+p[0], +p[1] - 1, +p[2])); },
    formatearFechaHora(v) { if (!v) return "Sin fecha"; return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)); },
    iniciales(n) { return n ? String(n).trim().split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase() : "CL"; },
    normalizar(v) { return String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); },
    limpiarFiltros() { this.filtro = ""; this.filtroEstado = ""; this.paginaActual = 1; },
    redirigirCrearFactura() { this.$router.push("/factura"); },
    verFactura(id) { this.$router.push(`/factura/ver/${id}`); },
    editarFactura(id) { this.$router.push(`/factura/editar/${id}`); }
  }
};
</script>

<style scoped>
.invoices-page {
  min-height: 100vh;
  padding: 34px;
  background: linear-gradient(135deg, #f8fbff, #eef4fb);
  color: #1e293b
}

.page-header,
.invoices-panel,
.summary-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .06)
}

.page-header {
  max-width: 1500px;
  margin: 0 auto 22px;
  padding: 28px 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px
}

.page-eyebrow,
.modal-eyebrow {
  display: block;
  color: #2563eb;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .12em
}

.page-header h1 {
  margin: 3px 0;
  color: #123b6d;
  font-size: 2rem
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: .85rem
}

.primary-button,
.secondary-button,
.refresh-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 15px;
  border-radius: 10px;
  font-size: .74rem;
  font-weight: 800
}

.primary-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff
}

.secondary-button {
  border: 1px solid #d8e0ea;
  background: #fff;
  color: #475569
}

.refresh-button {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb
}

.summary-grid {
  max-width: 1500px;
  margin: 0 auto 22px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px
}

.summary-card {
  min-height: 105px;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px
}

.summary-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-size: 1.2rem
}

.summary-icon.blue {
  background: #eff6ff;
  color: #2563eb
}

.summary-icon.green {
  background: #ecfdf5;
  color: #16a34a
}

.summary-icon.orange {
  background: #fff7ed;
  color: #ea580c
}

.summary-icon.red {
  background: #fef2f2;
  color: #dc2626
}

.summary-card span {
  display: block;
  color: #64748b;
  font-size: .7rem
}

.summary-card strong {
  font-size: 1.3rem
}

.pending-alert {
  max-width: 1500px;
  margin: 0 auto 22px;
  padding: 17px 20px;
  border: 1px solid #fed7aa;
  border-radius: 15px;
  background: #fffaf5;
  display: flex;
  align-items: center;
  gap: 15px
}

.pending-alert-icon {
  width: 47px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #ffedd5;
  color: #ea580c
}

.pending-alert-content {
  flex: 1
}

.pending-alert-eyebrow {
  color: #ea580c;
  font-size: .58rem;
  font-weight: 900
}

.pending-alert-content strong {
  display: block;
  color: #9a3412;
  font-size: .82rem
}

.pending-alert-content p {
  margin: 3px 0 0;
  color: #7c2d12;
  font-size: .68rem
}

.pending-alert-count {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background: #ea580c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900
}

.invoices-panel {
  max-width: 1500px;
  margin: auto;
  padding: 25px;
  border-radius: 20px
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px
}

.panel-header h2 {
  margin: 0;
  font-size: 1.15rem
}

.panel-header p {
  margin: 3px 0;
  color: #94a3b8;
  font-size: .7rem
}

.filters {
  display: grid;
  grid-template-columns: 1fr 200px auto;
  gap: 10px;
  margin-bottom: 20px
}

.search-box {
  position: relative
}

.search-box>i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8
}

.search-box input,
.filter-select {
  width: 100%;
  height: 43px;
  border: 1px solid #dce4ee;
  border-radius: 10px;
  background: #f8fafc;
  font-size: .77rem
}

.search-box input {
  padding: 0 40px
}

.search-box button {
  position: absolute;
  right: 7px;
  top: 7px;
  border: 0;
  background: transparent
}

.filter-select {
  padding: 0 10px
}

.clear-filters-button {
  border: 1px solid #dce4ee;
  border-radius: 10px;
  background: #fff;
  color: #64748b;
  font-size: .7rem
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e8edf3;
  border-radius: 13px
}

.invoices-table {
  width: 100%;
  min-width: 1400px;
  border-collapse: collapse
}

.invoices-table th {
  padding: 13px;
  background: #f3f7fc;
  border-bottom: 1px solid #dde5ee;
  color: #53657c;
  font-size: .63rem;
  text-transform: uppercase
}

.invoices-table td {
  padding: 13px;
  border-bottom: 1px solid #edf1f5;
  font-size: .71rem;
  vertical-align: middle
}

.overdue-row {
  background: #fff8f8
}

.date-cell,
.client-cell {
  display: flex;
  align-items: center;
  gap: 9px
}

.date-icon,
.client-avatar {
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #eff6ff;
  color: #2563eb
}

.date-cell span {
  display: block;
  color: #94a3b8;
  font-size: .58rem
}

.client-avatar {
  font-size: .62rem;
  font-weight: 900
}

.status-badge,
.order-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: .61rem;
  font-weight: 800
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor
}

.status-paid {
  background: #f0fdf4;
  color: #16a34a
}

.status-partial {
  background: #eff6ff;
  color: #2563eb
}

.status-pending {
  background: #fff7ed;
  color: #ea580c
}

.status-cancelled {
  background: #f1f5f9;
  color: #64748b
}

.status-overdue {
  background: #fef2f2;
  color: #dc2626
}

.order-badge {
  background: #f1f5f9;
  color: #475569
}

.money strong {
  white-space: nowrap
}

.money.collected {
  color: #15803d
}

.money.debt {
  color: #c2410c
}

.due-cell span {
  display: block;
  margin-top: 2px;
  color: #dc2626;
  font-size: .57rem
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px
}

.action-button {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #fff
}

.action-button.view {
  border: 1px solid #bfdbfe;
  color: #2563eb
}

.action-button.edit {
  border: 1px solid #fde68a;
  color: #d97706
}

.action-button.document {
  border: 1px solid #bbf7d0;
  color: #16a34a
}

.collect-button,
.history-button {
  height: 34px;
  border-radius: 8px;
  padding: 0 9px;
  font-size: .61rem;
  font-weight: 800
}

.collect-button {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #15803d
}

.history-button {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  color: #64748b;
  font-size: .68rem
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px
}

.pagination button {
  width: 34px;
  height: 34px;
  border: 1px solid #dce4ee;
  border-radius: 8px;
  background: #fff
}

.message {
  max-width: 1500px;
  margin: 0 auto 18px;
  padding: 12px 15px;
  border-radius: 11px;
  display: flex;
  gap: 9px;
  font-size: .73rem
}

.success-message {
  background: #f0fdf4;
  color: #15803d
}

.error-message {
  background: #fef2f2;
  color: #b91c1c
}

.message span {
  flex: 1
}

.loading-state,
.empty-state {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px
}

.loading-state.small {
  min-height: 100px
}

.empty-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #2563eb
}

.modal-backdrop-custom,
.preview-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5000;
  padding: 20px;
  background: rgba(15, 23, 42, .62);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center
}

.payment-modal,
.history-modal {
  width: 100%;
  max-width: 700px;
  max-height: 92vh;
  overflow: auto;
  padding: 25px;
  border-radius: 18px;
  background: #fff
}

.history-modal {
  max-width: 760px
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px
}

.modal-header-custom h3 {
  margin: 3px 0 0
}

.modal-header-custom>button {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #f8fafc
}

.payment-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px
}

.payment-summary>div {
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc
}

.payment-summary span,
.payment-summary strong {
  display: block;
  font-size: .64rem
}

.payment-summary strong {
  margin-top: 3px;
  font-size: .8rem
}

.payment-summary .pending {
  background: #fff7ed;
  color: #c2410c
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px
}

.field label {
  display: block;
  margin-bottom: 5px;
  color: #475569;
  font-size: .65rem;
  font-weight: 800
}

.input-wrap {
  height: 42px;
  position: relative;
  border: 1px solid #d8e0ea;
  border-radius: 9px
}

.input-wrap>i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8
}

.input-wrap input,
.input-wrap select {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 0 10px 0 36px;
  font-size: .75rem
}

.field.full {
  margin-top: 14px
}

.field textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d8e0ea;
  border-radius: 9px;
  font-size: .75rem
}

.receipt-upload {
  margin-top: 14px;
  padding: 12px;
  border: 1px dashed #bfdbfe;
  border-radius: 10px;
  background: #f8fbff;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer
}

.receipt-upload strong,
.receipt-upload span {
  display: block;
  font-size: .65rem
}

.receipt-upload span {
  color: #94a3b8
}

.payment-error {
  margin-top: 12px;
  padding: 10px;
  border-radius: 9px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: .68rem
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 20px
}

.history-summary {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px
}

.history-summary span {
  padding: 8px 10px;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: .64rem
}

.payments-list {
  display: flex;
  flex-direction: column;
  gap: 8px
}

.payment-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e8edf3;
  border-radius: 10px
}

.payment-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #ecfdf5;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center
}

.payment-main {
  flex: 1
}

.payment-main strong,
.payment-main span {
  display: block
}

.payment-main span {
  margin-top: 2px;
  color: #64748b;
  font-size: .61rem
}

.payment-extra {
  text-align: right;
  font-size: .61rem
}

.payment-extra span {
  display: block
}

.payment-extra button {
  margin-top: 3px;
  border: 0;
  background: transparent;
  color: #2563eb
}

.empty-history {
  padding: 30px;
  text-align: center;
  color: #94a3b8
}

.preview-modal {
  width: 100%;
  max-width: 1100px;
  height: 85vh;
  padding: 20px;
  border-radius: 18px;
  background: #fff;
  display: flex;
  flex-direction: column
}

.preview-modal iframe {
  width: 100%;
  flex: 1;
  border: 0;
  background: #f8fafc
}

.rotating {
  animation: rotation 1s linear infinite
}

@keyframes rotation {
  to {
    transform: rotate(360deg)
  }
}

@media(max-width:1050px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr)
  }

  .filters {
    grid-template-columns: 1fr 1fr
  }
}

@media(max-width:700px) {
  .invoices-page {
    padding: 16px
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start
  }

  .summary-grid,
  .filters,
  .payment-summary,
  .modal-grid {
    grid-template-columns: 1fr
  }

  .table-footer {
    flex-direction: column;
    gap: 10px
  }
}
</style>
