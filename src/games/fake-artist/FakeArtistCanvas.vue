<script>
export default {
  name: 'fake-artist-canvas',
  props: {
    drawnLines: {
      type: Array,
      default: () => []
    },
    currentLine: {
      type: Array,
      default: () => []
    },
    sideLength: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    this.overcanvas = this.$refs['overcanvas'].getContext('2d');
    this.overcanvas.lineWidth = 3;
    this.overcanvas.lineCap = 'round';
    this.overcanvas.lineJoin = 'round';
    this.undercanvas = this.$refs['undercanvas'].getContext('2d');
    this.undercanvas.lineWidth = 3;
    this.undercanvas.lineCap = 'round';
    this.undercanvas.lineJoin = 'round';

    for (let line of this.drawnLines) {
      this.drawLineToCanvas(this.undercanvas, line);
    }

    for (let line of this.drawnLines) {
      this.drawLineToCanvas(this.undercanvas, line);
    }
  },
  data: () => ({
    drawing: false,
  }),
  watch: {
    drawnLines: function(lines) {
      for (let line of lines) {
        this.drawLineToCanvas(this.undercanvas, line);
      }
    },
    currentLine: function(line) {
      this.drawLineToCanvas(this.overcanvas, line);
    }
  },
  methods: {
    drawLineToCanvas(canvas, line) {
      if (line.length > 1) {
        canvas.beginPath();
        const firstPoint = line[0];
        canvas.moveTo(this.scaleFromModel(firstPoint.x), this.scaleFromModel(firstPoint.y));
        for (let point of line) {
          canvas.lineTo(this.scaleFromModel(point.x), this.scaleFromModel(point.y));
        }
        canvas.stroke();
      }
    },
    startDrawing() {
      this.drawing = true;
    },
    scaleToModel(val) {
      return val / this.sideLength * 500
    },
    scaleFromModel(val) {
      return val / 500 * this.sideLength;
    },
    draw(e) {
      if (this.drawing) {
        this.$emit('draw', this.scaleToModel(e.offsetX), this.scaleToModel(e.offsetY));
      }
    },
    touchDraw(e) {
      if (this.drawing) {
        e = e.touches.item(0);
        let currentEl = e.target;
        let x = e.pageX, y = e.pageY;
        if (currentEl.offsetParent) {
          do {
            x -= currentEl.offsetLeft;
            y -= currentEl.offsetTop;
          } while ((currentEl = currentEl.offsetParent));
        }
        this.$emit('draw', this.scaleToModel(x), this.scaleToModel(y));
      }
    },
    stopDrawing() {
      this.$emit('stopDraw');
      this.drawing = false;
    },
  }
};
</script>

<!---->

<template lang='pug'>
#fake-artist-canvas
  canvas#overcanvas(:disabled='disabled' ref='overcanvas' :width='sideLength' :height='sideLength'
    @mousedown='startDrawing'
    @mousemove='draw'
    @mouseup='stopDrawing'
    @mouseleave='stopDrawing'
    @touchstart.prevent='startDrawing'
    @touchmove.prevent='touchDraw'
    @touchend='stopDrawing'
  )
  canvas#undercanvas(ref='undercanvas' :width='sideLength' :height='sideLength')
</template>

<!---->

<style lang='scss' scoped>
#fake-artist-canvas {
  width: min-content;
}

#overcanvas {
  background: url('./fake-artist-frame.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  z-index: 10;
}

</style>
