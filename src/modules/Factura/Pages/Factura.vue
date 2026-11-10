<template>
  <div class="invoice-form-page">
    <section class="page-header">
      <div>
        <button class="back-link" type="button" @click="volver"><i class="bi bi-arrow-left"></i> Volver a
          facturas</button>
        <span class="eyebrow">FACTURACIÓN</span>
        <h1>{{ esEdicion ? "Editar factura" : "Nueva factura" }}</h1>
        <p>Registra la factura, su valor y vencimiento. Los cobros se registran por separado.</p>
      </div>
      <span class="mode-badge"><i class="bi bi-receipt"></i> {{ esEdicion ? "Modo edición" : "Nueva factura" }}</span>
    </section>

    <div v-if="mensajeConfirmacion" class="message success"><i class="bi bi-check-circle-fill"></i>{{
      mensajeConfirmacion }}</div>
    <div v-if="mensajeError" class="message error"><i class="bi bi-exclamation-circle-fill"></i>{{ mensajeError }}</div>

    <div v-if="cargandoInicial" class="loading-card">
      <div class="spinner-border text-primary"></div><span>Cargando información...</span>
    </div>

    <div v-else class="layout">
      <section class="form-card">
        <form @submit.prevent="guardarFactura">
          <header class="section-header">
            <span class="section-icon"><i class="bi bi-receipt-cutoff"></i></span>
            <div>
              <h2>Información de la factura</h2>
              <p>Seleccione la orden asociada. El estado financiero es automático.</p>
            </div>
          </header>

          <div class="grid">
            <div class="field">
              <label>Orden de trabajo <b>*</b></label>
              <div class="input-wrap" :class="{ invalid: errores.idOrden }">
                <i class="bi bi-clipboard-check"></i>
                <select v-model="factura.idOrden" @change="cambiarOrden">
                  <option disabled :value="null">Seleccione una orden</option>
                  <option v-for="o in ordenes" :key="o.id" :value="o.id">
                    {{ o.numeroOrden || `OT-${o.id}` }} - {{ o.cliente?.nombre || "Cliente no disponible" }}
                  </option>
                </select>
              </div>
              <small v-if="errores.idOrden" class="field-error">{{ errores.idOrden }}</small>
              <small v-else>Orden de trabajo relacionada con la factura.</small>
            </div>

            <div class="field">
              <label>Estado financiero</label>
              <div class="state-box">
                <span class="status" :class="claseEstado"><i></i>{{ textoEstado(estadoMostrado) }}</span>
                <span class="locked"><i class="bi bi-lock"></i> Automático</span>
              </div>
              <small>PENDIENTE, PARCIAL y PAGADA dependen de los cobros.</small>
            </div>
          </div>

          <div v-if="ordenSeleccionada" class="order-summary">
            <span class="order-icon"><i class="bi bi-clipboard-data"></i></span>
            <div>
              <small>ORDEN SELECCIONADA</small>
              <strong>{{ ordenSeleccionada.numeroOrden || `OT-${ordenSeleccionada.id}` }}</strong>
              <p><i class="bi bi-building"></i> {{ ordenSeleccionada.cliente?.nombre || "Cliente no disponible" }}
                &nbsp; <i class="bi bi-calendar3"></i> {{ formatearFecha(ordenSeleccionada.fecha) }}</p>
            </div>
          </div>

          <header class="section-header second">
            <span class="section-icon green"><i class="bi bi-cash-coin"></i></span>
            <div>
              <h2>Información financiera</h2>
              <p>Compare el valor ejecutado con el valor que se facturará.</p>
            </div>
          </header>

          <div v-if="cargandoInforme" class="notice"><span class="spinner-border spinner-border-sm"></span> Consultando
            Informe IPM...</div>
          <div v-else-if="factura.idOrden && !informeEncontrado" class="notice warning">
            <i class="bi bi-exclamation-triangle"></i>
            <div><strong>Esta orden no tiene Informe IPM.</strong><span>Ingrese manualmente el valor a facturar.</span>
            </div>
          </div>

          <div class="financial-grid">
            <div class="executed" :class="{ empty: valorEjecutado === null }">
              <small>VALOR EJECUTADO</small>
              <strong>{{ valorEjecutado === null ? "Sin informe" : moneda(valorEjecutado) }}</strong>
              <span>Según Informe IPM</span>
            </div>

            <div class="field">
              <label>Valor a facturar <b>*</b></label>
              <div class="input-wrap" :class="{ invalid: errores.totalFactura }">
                <i class="bi bi-currency-dollar"></i>
                <input v-model="factura.totalFactura" type="number" min="0.01" step="0.01" placeholder="0.00"
                  @input="limpiarError('totalFactura')">
              </div>
              <small v-if="errores.totalFactura" class="field-error">{{ errores.totalFactura }}</small>
              <small v-else>Puede ajustarse respecto al valor ejecutado.</small>
            </div>

            <div class="field">
              <label>Fecha de emisión <b>*</b></label>
              <div class="input-wrap" :class="{ invalid: errores.fechaEmision }">
                <i class="bi bi-calendar-event"></i>
                <input v-model="factura.fechaEmision" type="date" @change="limpiarError('fechaEmision')">
              </div>
              <small v-if="errores.fechaEmision" class="field-error">{{ errores.fechaEmision }}</small>
            </div>

            <div class="field">
              <label>Fecha de vencimiento</label>
              <div class="input-wrap" :class="{ invalid: errores.fechaVencimiento }">
                <i class="bi bi-calendar-x"></i>
                <input v-model="factura.fechaVencimiento" type="date" @change="limpiarError('fechaVencimiento')">
              </div>
              <small v-if="errores.fechaVencimiento" class="field-error">{{ errores.fechaVencimiento }}</small>
              <small v-else>Opcional. Permitirá identificar cartera vencida.</small>
            </div>
          </div>

          <div v-if="mostrarDiferencia" class="difference">
            <span>Diferencia ejecutado vs. facturado</span><strong>{{ moneda(diferencia) }}</strong>
          </div>

          <header class="section-header second">
            <span class="section-icon purple"><i class="bi bi-files"></i></span>
            <div>
              <h2>Documentos</h2>
              <p>Adjunta archivos relacionados con la factura.</p>
            </div>
          </header>

          <label class="upload-zone">
            <input type="file" multiple hidden @change="handleFiles">
            <i class="bi bi-cloud-arrow-up"></i>
            <div><strong>{{ archivos.length ? "Agregar más archivos" : "Seleccionar archivos" }}</strong><span>PDF,
                imágenes u otros documentos.</span></div>
          </label>

          <div v-if="archivos.length" class="files">
            <div class="files-head"><strong>{{ archivos.length }} archivo(s)</strong><button type="button"
                @click="archivos = []">Quitar todos</button></div>
            <div v-for="(a, i) in archivos" :key="`${a.name}-${i}`" class="file">
              <i class="bi" :class="iconoArchivo(a)"></i>
              <div><strong>{{ a.name }}</strong><small>{{ tamano(a.size) }}</small></div>
              <button type="button" @click="archivos.splice(i, 1)"><i class="bi bi-x-lg"></i></button>
            </div>
          </div>

          <div class="info-note">
            <i class="bi bi-info-circle"></i>
            <p><strong>Flujo financiero.</strong> Crear una factura no registra ingreso real. El dinero se considera
              cobrado únicamente cuando se registra un pago.</p>
          </div>

          <footer class="actions">
            <button type="button" class="secondary" :disabled="guardando" @click="volver">Cancelar</button>
            <button class="primary" type="submit" :disabled="guardando || !ordenes.length">
              <span v-if="guardando" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi" :class="esEdicion ? 'bi-check-lg' : 'bi-plus-lg'"></i>
              {{ guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear factura" }}
            </button>
          </footer>
        </form>
      </section>

      <aside>
        <section class="preview-card">
          <span class="eyebrow">RESUMEN</span>
          <div class="receipt-icon"><i class="bi bi-receipt"></i></div>
          <h3>{{ esEdicion ? `Factura #${facturaId}` : "Nueva factura" }}</h3>
          <span class="status" :class="claseEstado"><i></i>{{ textoEstado(estadoMostrado) }}</span>
          <hr>
          <div class="preview-row"><span>Orden</span><strong>{{ ordenSeleccionada ? (ordenSeleccionada.numeroOrden ||
            `OT-${ordenSeleccionada.id}`) : "Sin seleccionar" }}</strong></div>
          <div class="preview-row"><span>Cliente</span><strong>{{ ordenSeleccionada?.cliente?.nombre || "Sin definir"
              }}</strong></div>
          <div class="preview-row"><span>Ejecutado</span><strong>{{ valorEjecutado === null ? "Sin referencia" :
            moneda(valorEjecutado) }}</strong></div>
          <div class="preview-row"><span>Facturado</span><strong>{{ factura.totalFactura ? moneda(factura.totalFactura)
              : "$0.00" }}</strong></div>
          <div class="preview-row"><span>Emisión</span><strong>{{ fechaVisual(factura.fechaEmision) }}</strong></div>
          <div class="preview-row"><span>Vencimiento</span><strong>{{ factura.fechaVencimiento ?
            fechaVisual(factura.fechaVencimiento) : "Sin vencimiento" }}</strong></div>
          <div class="preview-row"><span>Archivos nuevos</span><strong>{{ archivos.length }}</strong></div>
        </section>

        <section class="tips">
          <strong><i class="bi bi-lightbulb"></i> Recomendaciones</strong>
          <ul>
            <li>El valor ejecutado proviene del Informe IPM.</li>
            <li>El valor facturado puede ajustarse.</li>
            <li>Los cobros se registran independientemente.</li>
            <li>El estado cambia automáticamente según los cobros.</li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import { obtenerFacturaFachada, actualizarFacturaFachada, crearFacturaFachada } from "../Helpers/FacturaHelper";
import { consultarOrdenFachada } from "../../OrdenTrabajo/Helpers/OrdenTrabajoHelper";
import { consultarInformePorOrdenFachada } from "../../InformeIpm/helpers/informeHelper";

export default {
  name: "FacturaFormulario",
  data() {
    return {
      factura: { estadoFactura: "PENDIENTE", idOrden: null, totalFactura: "", fechaEmision: this.hoy(), fechaVencimiento: "" },
      informeOrden: null, informeEncontrado: false, cargandoInforme: false,
      ordenes: [], archivos: [], facturaId: this.$route.params.id || null,
      cargandoInicial: false, guardando: false, mensajeConfirmacion: "", mensajeError: "",
      errores: { idOrden: "", totalFactura: "", fechaEmision: "", fechaVencimiento: "" }
    };
  },
  computed: {
    esEdicion() { return Boolean(this.facturaId); },
    ordenSeleccionada() { return this.ordenes.find(o => String(o.id) === String(this.factura.idOrden)) || null; },
    valorEjecutado() {
      const v = this.informeOrden?.precio;
      if (v === null || v === undefined || v === "") return null;
      const n = Number(v); return Number.isFinite(n) ? n : null;
    },
    estadoMostrado() { return this.factura.estadoFactura || "PENDIENTE"; },
    claseEstado() { return { PAGADA: "paid", PARCIAL: "partial", ANULADA: "cancelled", PENDIENTE: "pending" }[this.estadoMostrado] || "pending"; },
    diferencia() { return Number(this.factura.totalFactura || 0) - Number(this.valorEjecutado || 0); },
    mostrarDiferencia() { return this.valorEjecutado !== null && this.factura.totalFactura !== ""; }
  },
  async mounted() { await this.cargar(); },
  methods: {
    hoy() {
      const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 10);
    },
    async cargar() {
      this.cargandoInicial = true;
      try {
        await this.cargarOrdenes();
        if (this.esEdicion) { await this.consultarFactura(); await this.cargarInforme(false); }
      } finally { this.cargandoInicial = false; }
    },
    async cargarOrdenes() {
      try { const r = await consultarOrdenFachada(); this.ordenes = Array.isArray(r) ? r : []; }
      catch (e) { console.error(e); this.mensajeError = "No se pudieron cargar las órdenes de trabajo."; }
    },
    async consultarFactura() {
      try {
        const f = await obtenerFacturaFachada(this.facturaId);
        this.factura = {
          estadoFactura: f.estadoFactura || "PENDIENTE",
          idOrden: f.idOrden ?? null,
          totalFactura: f.totalFactura ?? "",
          fechaEmision: this.extraerFecha(f.fechaEmision) || this.hoy(),
          fechaVencimiento: this.extraerFecha(f.fechaVencimiento)
        };
      } catch (e) { console.error(e); this.mensajeError = "No se pudo cargar la factura solicitada."; }
    },
    async cambiarOrden() {
      this.limpiarError("idOrden"); this.informeOrden = null; this.informeEncontrado = false;
      if (this.factura.idOrden) await this.cargarInforme(!this.esEdicion);
    },
    async cargarInforme(copiar = true) {
      if (!this.factura.idOrden) return;
      this.cargandoInforme = true;
      try {
        const inf = await consultarInformePorOrdenFachada(this.factura.idOrden);
        this.informeOrden = inf; this.informeEncontrado = Boolean(inf);
        if (copiar && inf?.precio !== null && inf?.precio !== undefined && inf?.precio !== "") {
          this.factura.totalFactura = Number(inf.precio).toFixed(2);
        }
      } catch (e) {
        console.error(e); this.informeOrden = null; this.informeEncontrado = false;
        this.mensajeError = "No se pudo consultar el Informe IPM de la orden seleccionada.";
      } finally { this.cargandoInforme = false; }
    },
    validar() {
      this.errores = { idOrden: "", totalFactura: "", fechaEmision: "", fechaVencimiento: "" }; let ok = true;
      if (!this.factura.idOrden) { this.errores.idOrden = "Seleccione una orden de trabajo."; ok = false; }
      const total = Number(this.factura.totalFactura);
      if (this.factura.totalFactura === "" || !Number.isFinite(total) || total <= 0) { this.errores.totalFactura = "Ingrese un valor mayor a cero."; ok = false; }
      if (!this.factura.fechaEmision) { this.errores.fechaEmision = "Seleccione la fecha de emisión."; ok = false; }
      if (this.factura.fechaVencimiento && this.factura.fechaVencimiento < this.factura.fechaEmision) {
        this.errores.fechaVencimiento = "El vencimiento no puede ser anterior a la emisión."; ok = false;
      }
      return ok;
    },
    async guardarFactura() {
      this.mensajeError = ""; this.mensajeConfirmacion = "";
      if (!this.validar()) { this.mensajeError = "Revise los campos marcados antes de continuar."; return; }
      this.guardando = true;
      const body = {
        idOrden: Number(this.factura.idOrden),
        totalFactura: Number(this.factura.totalFactura),
        fechaEmision: `${this.factura.fechaEmision}T00:00:00`,
        fechaVencimiento: this.factura.fechaVencimiento || null
      };
      try {
        if (this.esEdicion) {
          await actualizarFacturaFachada(this.facturaId, body);
          this.mensajeConfirmacion = "La factura fue actualizada correctamente.";
          await this.consultarFactura(); await this.cargarInforme(false);
        } else {
          await crearFacturaFachada(body, this.archivos);
          this.mensajeConfirmacion = "La factura fue creada correctamente."; this.reset();
        }
      } catch (e) {
        console.error(e); const d = e.response?.data;
        this.mensajeError = (typeof d === "string" ? d : (d?.mensaje || d?.message || d?.error)) || "No se pudo guardar la factura.";
      } finally { this.guardando = false; }
    },
    limpiarError(c) { if (this.errores[c]) this.errores[c] = ""; this.mensajeError = ""; },
    handleFiles(e) { this.archivos = [...this.archivos, ...Array.from(e.target.files || [])]; e.target.value = ""; },
    iconoArchivo(a) { const t = a?.type || ""; return t.includes("pdf") ? "bi-file-earmark-pdf" : t.startsWith("image/") ? "bi-file-earmark-image" : "bi-file-earmark"; },
    tamano(b) { const n = Number(b || 0); return n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`; },
    textoEstado(e) { return { PENDIENTE: "Pendiente", PARCIAL: "Parcial", PAGADA: "Pagada", ANULADA: "Anulada" }[e] || e; },
    moneda(v) { return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Number(v || 0)); },
    extraerFecha(v) { return v ? String(v).slice(0, 10) : ""; },
    fechaVisual(v) {
      if (!v) return "Sin fecha"; const p = String(v).slice(0, 10).split("-");
      const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
      return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(d);
    },
    formatearFecha(v) { if (!v) return "Sin fecha"; const d = new Date(v); return Number.isNaN(d.getTime()) ? "Fecha inválida" : new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" }).format(d); },
    reset() { this.factura = { estadoFactura: "PENDIENTE", idOrden: null, totalFactura: "", fechaEmision: this.hoy(), fechaVencimiento: "" }; this.informeOrden = null; this.informeEncontrado = false; this.archivos = []; },
    volver() { this.$router.push("/facturas_lista"); }
  }
};
</script>

<style scoped>
.invoice-form-page {
  min-height: 100vh;
  padding: 34px;
  background: linear-gradient(135deg, #f8fbff, #eef4fb);
  color: #1e293b
}

.page-header,
.form-card,
.preview-card,
.tips {
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .06)
}

.page-header {
  max-width: 1300px;
  margin: 0 auto 22px;
  padding: 27px 30px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px
}

.page-header h1 {
  margin: 4px 0;
  font-size: 1.65rem;
  color: #1e3a5f
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: .78rem
}

.eyebrow {
  display: block;
  color: #2563eb;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .11em
}

.back-link {
  border: 0;
  background: transparent;
  padding: 0;
  margin-bottom: 14px;
  color: #64748b;
  font-size: .72rem;
  font-weight: 700
}

.mode-badge {
  padding: 7px 11px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: .67rem;
  font-weight: 800
}

.layout {
  max-width: 1300px;
  margin: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
  align-items: start
}

.form-card {
  border-radius: 18px;
  padding: 26px
}

.section-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px
}

.section-header.second {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #edf1f5
}

.section-header h2 {
  margin: 0;
  font-size: .95rem
}

.section-header p {
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: .67rem
}

.section-icon,
.order-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #dbeafe;
  color: #2563eb
}

.section-icon.green {
  background: #ecfdf5;
  color: #059669
}

.section-icon.purple {
  background: #f5f3ff;
  color: #7c3aed
}

.grid,
.financial-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px
}

.field label {
  display: block;
  margin-bottom: 6px;
  color: #475569;
  font-size: .68rem;
  font-weight: 800
}

.field label b {
  color: #dc2626
}

.input-wrap {
  height: 44px;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #d8e0ea;
  border-radius: 10px;
  background: #fff;
  overflow: hidden
}

.input-wrap:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .08)
}

.input-wrap.invalid {
  border-color: #fca5a5
}

.input-wrap>i {
  position: absolute;
  left: 13px;
  color: #94a3b8
}

.input-wrap input,
.input-wrap select {
  width: 100%;
  height: 100%;
  padding: 0 35px 0 39px;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: .79rem;
  color: #334155
}

.field small {
  display: block;
  margin-top: 5px;
  color: #94a3b8;
  font-size: .62rem
}

.field-error {
  color: #dc2626 !important;
  font-weight: 700
}

.state-box {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px
}

.locked {
  color: #64748b;
  font-size: .62rem
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: .62rem;
  font-weight: 800
}

.status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor
}

.status.pending {
  background: #fff7ed;
  color: #ea580c
}

.status.partial {
  background: #eff6ff;
  color: #2563eb
}

.status.paid {
  background: #f0fdf4;
  color: #16a34a
}

.status.cancelled {
  background: #fef2f2;
  color: #dc2626
}

.order-summary {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 22px;
  padding: 15px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #f8fbff
}

.order-summary small {
  display: block;
  color: #2563eb;
  font-size: .58rem;
  font-weight: 900
}

.order-summary strong {
  display: block;
  font-size: .8rem
}

.order-summary p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: .63rem
}

.notice {
  display: flex;
  gap: 8px;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
  font-size: .68rem
}

.notice.warning {
  border: 1px solid #fde68a;
  background: #fffbeb;
  color: #92400e
}

.notice strong,
.notice span {
  display: block
}

.executed {
  min-height: 88px;
  padding: 14px 16px;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  background: #f0fdf4
}

.executed small,
.executed span {
  display: block;
  font-size: .6rem;
  color: #64748b
}

.executed strong {
  display: block;
  margin: 5px 0;
  color: #166534;
  font-size: 1.2rem
}

.executed.empty {
  border-color: #e2e8f0;
  background: #f8fafc
}

.executed.empty strong {
  color: #64748b
}

.difference {
  margin-top: 14px;
  padding: 11px 14px;
  border-radius: 10px;
  background: #f8fafc;
  color: #475569;
  display: flex;
  justify-content: space-between;
  font-size: .68rem
}

.upload-zone {
  min-height: 120px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px dashed #bfdbfe;
  border-radius: 13px;
  background: #f8fbff;
  cursor: pointer
}

.upload-zone>i {
  font-size: 1.5rem;
  color: #2563eb
}

.upload-zone strong,
.upload-zone span {
  display: block
}

.upload-zone span {
  margin-top: 3px;
  color: #64748b;
  font-size: .67rem
}

.files {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px
}

.files-head,
.file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px
}

.files-head {
  margin-bottom: 8px
}

.files button {
  border: 0;
  background: transparent;
  color: #dc2626;
  font-size: .62rem
}

.file {
  padding: 9px;
  border-top: 1px solid #edf1f5
}

.file>i {
  color: #64748b
}

.file div {
  flex: 1
}

.file strong,
.file small {
  display: block;
  font-size: .65rem
}

.file small {
  color: #94a3b8
}

.info-note {
  display: flex;
  gap: 10px;
  margin-top: 24px;
  padding: 14px;
  border: 1px solid #bfdbfe;
  border-radius: 11px;
  background: #f8fbff;
  color: #64748b;
  font-size: .67rem
}

.info-note>i {
  color: #2563eb
}

.info-note p {
  margin: 0
}

.info-note strong {
  color: #1e40af
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #edf1f5
}

.actions button {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: .74rem;
  font-weight: 800
}

.primary {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff
}

.secondary {
  border: 1px solid #d8e0ea;
  background: #fff;
  color: #475569
}

aside {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 15px
}

.preview-card,
.tips {
  border-radius: 16px;
  padding: 22px
}

.receipt-icon {
  width: 62px;
  height: 62px;
  margin: 17px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 1.35rem
}

.preview-card h3 {
  font-size: 1.05rem
}

.preview-card hr {
  border-color: #edf1f5
}

.preview-row {
  margin-bottom: 13px
}

.preview-row span {
  display: block;
  color: #94a3b8;
  font-size: .58rem;
  text-transform: uppercase
}

.preview-row strong {
  display: block;
  margin-top: 3px;
  font-size: .74rem
}

.tips {
  font-size: .67rem;
  color: #64748b
}

.tips>strong {
  color: #475569
}

.tips ul {
  padding-left: 18px;
  line-height: 1.7
}

.message {
  max-width: 1300px;
  margin: 0 auto 18px;
  display: flex;
  gap: 9px;
  padding: 13px 15px;
  border-radius: 11px;
  font-size: .7rem
}

.message.success {
  background: #f0fdf4;
  color: #15803d
}

.message.error {
  background: #fef2f2;
  color: #b91c1c
}

.loading-card {
  max-width: 1300px;
  min-height: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fff;
  border-radius: 18px
}

@media(max-width:960px) {
  .layout {
    grid-template-columns: 1fr
  }

  aside {
    position: static
  }
}

@media(max-width:680px) {
  .invoice-form-page {
    padding: 18px
  }

  .page-header {
    align-items: flex-start
  }

  .grid,
  .financial-grid {
    grid-template-columns: 1fr
  }

  .actions {
    flex-direction: column-reverse
  }

  .actions button {
    width: 100%
  }
}
</style>
