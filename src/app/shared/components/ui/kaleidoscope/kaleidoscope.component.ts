import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-kaleidoscope',
  standalone: true,
  template: `<canvas #canvasRef class="canvas"></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      background:rgba(240, 238, 230, 0);
      border-radius: 8px;
      overflow: hidden;
    }

    .canvas {
      width: 100%;
      height: auto;
      display: block;
      background: transparent;
    }
  `]
})
export class KaleidoscopeComponent implements OnInit, OnDestroy {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationFrameId: number | null = null;
  private segmentCanvas: HTMLCanvasElement | null = null;
  private time = 0;

  ngOnInit(): void {
    this.initializeCanvas();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
    const width = cssWidth;
    const height = cssWidth; // carré

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;

    this.segmentCanvas = document.createElement('canvas');
    const segmentCtx = this.segmentCanvas.getContext('2d');
    if (!segmentCtx) {
      console.error('Could not get 2D context from segment canvas');
      return;
    }

    this.segmentCanvas.width = canvas.width;
    this.segmentCanvas.height = canvas.height;

    const animate = () => {
      this.time += 0.005;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      segmentCtx.clearRect(0, 0, this.segmentCanvas!.width, this.segmentCanvas!.height);

      const resolution = 1;
      const radiusMax = centerX;
      for (let x = 0; x < centerX + radiusMax; x += resolution) {
        for (let y = 0; y < centerY + radiusMax; y += resolution) {
          const dx = x - centerX;
          const dy = y - centerY;
          const r = Math.sqrt(dx * dx + dy * dy);
          const theta = Math.atan2(dy, dx);

          if (theta >= 0 && theta <= Math.PI / 4 && r < radiusMax) {
            const cornerRadius = 20;
            const edgeDistance = Math.min(
              radiusMax - r,
              r * Math.abs(Math.PI / 4 - theta) * 2.5
            );
            const edgeFade = Math.min(1, edgeDistance / cornerRadius);

            const wave1 = Math.sin(r * 0.1 - this.time * 2);
            const wave2 = Math.cos(theta * 8 + this.time);
            const wave3 = Math.sin((r - theta * 100) * 0.05 + this.time * 3);
            let value = (wave1 + wave2 + wave3) / 3;
            value += (Math.random() - 0.5) * 0.2;
            const opacity = Math.abs(value) * 0.8 * edgeFade;

            segmentCtx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            segmentCtx.fillRect(x, y, resolution, resolution);
          }
        }
      }

      const numSegments = 8;
      for (let i = 0; i < numSegments; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((i * Math.PI * 2) / numSegments);
        if (i % 2 === 1) {
          ctx.scale(1, -1);
        }
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(this.segmentCanvas!, 0, 0);
        ctx.restore();
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  private cleanup(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.segmentCanvas) {
      this.segmentCanvas.width = 0;
      this.segmentCanvas.height = 0;
      this.segmentCanvas = null;
    }
  }
}
