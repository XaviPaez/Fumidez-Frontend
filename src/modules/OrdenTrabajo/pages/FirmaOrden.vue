
<template>
  <div class="firma-contenedor">
    <h3>{{ titulo }}</h3>

    <canvas
      ref="canvasFirma"
      class="firma-canvas"
    ></canvas>

    <div class="firma-acciones">
      <button type="button" @click="limpiar">
        Limpiar
      </button>

      <button type="button" @click="guardar">
        Guardar firma
      </button>
    </div>
  </div>
</template>

<script>
import SignaturePad from "signature_pad";

export default {
  name: "FirmaOrden",

  emits: ["firma-guardada"],

  props: {
    titulo: {
      type: String,
      default: "Firma del cliente"
    }
  },

  data() {
    return {
      signaturePad: null
    };
  },

  mounted() {
    const canvas = this.$refs.canvasFirma;

    // Adaptar el canvas a su tamaño visible.
    const ratio = Math.max(
      window.devicePixelRatio || 1,
      1
    );

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    canvas.getContext("2d").scale(ratio, ratio);

    this.signaturePad = new SignaturePad(canvas, {
      penColor: "#00268c",
      backgroundColor: "rgba(255,255,255,0)"
    });
  },

  methods: {
    limpiar() {
      this.signaturePad.clear();
    },

    guardar() {
      if (this.signaturePad.isEmpty()) {
        alert("Primero debes firmar.");
        return;
      }

      const firmaBase64 =
        this.signaturePad.toDataURL("image/png");

      this.$emit("firma-guardada", firmaBase64);
    }
  }
};
</script>

<style scoped>
.firma-contenedor {
  width: 100%;
}

.firma-canvas {
  width: 100%;
  height: 180px;
  border: 1px solid #00268c;
  border-radius: 6px;
  background: white;
  touch-action: none;
}

.firma-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.firma-acciones button {
  padding: 9px 16px;
  cursor: pointer;
}
</style>
