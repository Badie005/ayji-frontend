import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

interface RibbonSegment {
  x: number;
  y: number;
  angle: number;
  width: number;
  height: number;
  depth: number;
}

@Component({
  selector: 'app-ribbon',
  standalone: true,
  template: `<canvas #canvasRef class="canvas"></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      background: transparent;
      overflow: hidden;
    }

    .canvas {
      display: block;
      width: 100%;
      height: auto;
      background: transparent;
    }
  `]
})
export class RibbonComponent implements OnInit, OnDestroy {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationFrameId: number | null = null;
  private time = 0;
  private ribbon!: RibbonStrip;

  ngOnInit(): void {
    this.initializeCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.ribbon) {
      this.ribbon.cleanup();
    }
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
    const height = width;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    this.ribbon = new RibbonStrip(width, height);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      this.time += 0.00125;
      this.ribbon.update(this.time);
      this.ribbon.draw(ctx);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}

class RibbonStrip {
  private segments: RibbonSegment[] = [];
  private segmentCount = 30;
  private width = 100;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(private cWidth: number, private cHeight: number) {
    this.canvasWidth = cWidth;
    this.canvasHeight = cHeight;
    this.initialize();
  }

  initialize(): void {
    this.segments = [];
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        x: 0,
        y: 0,
        angle: 0,
        width: this.width,
        height: 20,
        depth: 0,
      });
    }
  }

  update(time: number): void {
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    for (let i = 0; i < this.segments.length; i++) {
      const t = i / (this.segments.length - 1);
      const seg = this.segments[i];
      const smoothTime = time * 0.25;
      const baseAngle = t * Math.PI * 6 + smoothTime;
      const foldPhase = Math.sin(smoothTime * 0.01 + t * Math.PI * 4);
      const heightPhase = Math.cos(smoothTime * 0.00375 + t * Math.PI * 3);
      const radius = 120 + foldPhase * 60;

      seg.x = centerX + Math.cos(baseAngle) * radius;
      seg.y = centerY + Math.sin(baseAngle) * radius + heightPhase * 30;
      seg.angle = baseAngle + foldPhase * Math.PI * 0.5;
      seg.width = this.width * (1 + foldPhase * 0.3);
      seg.depth = Math.sin(baseAngle + time * 0.15);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);

    const sorted = [...this.segments].sort((a, b) => a.depth - b.depth);

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = sorted[i];
      const next = sorted[i + 1];

      ctx.save();
      ctx.beginPath();

      const cos1 = Math.cos(curr.angle);
      const sin1 = Math.sin(curr.angle);
      const cos2 = Math.cos(next.angle);
      const sin2 = Math.sin(next.angle);

      const p1 = { x: curr.x - sin1 * curr.width / 2, y: curr.y + cos1 * curr.width / 2 };
      const p2 = { x: curr.x + sin1 * curr.width / 2, y: curr.y - cos1 * curr.width / 2 };
      const p3 = { x: next.x + sin2 * next.width / 2, y: next.y - cos2 * next.width / 2 };
      const p4 = { x: next.x - sin2 * next.width / 2, y: next.y + cos2 * next.width / 2 };

      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();

      const depthFactor = (curr.depth + 1) * 0.5;
      const opacity = 0.6 + depthFactor * 0.4;
      ctx.strokeStyle = `rgba(40,40,40,${opacity})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(curr.x, curr.y);
      ctx.lineTo(next.x, next.y);
      ctx.strokeStyle = `rgba(80,80,80,${opacity * 0.7})`;
      ctx.stroke();

      ctx.restore();
    }

    ctx.setLineDash([]);
  }

  cleanup(): void {
    this.segments = [];
  }
}
