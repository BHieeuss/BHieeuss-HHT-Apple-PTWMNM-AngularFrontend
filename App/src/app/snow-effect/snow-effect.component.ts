import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-snow-effect',
  template: `<canvas></canvas>`,
  styles: [
    `
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      }
    `,
  ],
})
export class SnowEffectComponent implements OnInit {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private snowflakes: any[] = [];
  private numFlakes = 100;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.canvas = this.el.nativeElement.querySelector('canvas');
    if (this.canvas) {
      const context = this.canvas.getContext('2d');
      if (context) {
        this.ctx = context;
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.createSnowflakes();
        this.animateSnowflakes();
      } else {
        console.error('Canvas context could not be initialized.');
      }
    } else {
      console.error('Canvas element not found.');
    }
  }
  

  private resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    } else {
      console.error('Canvas element is not initialized.');
    }
  }
  

  private createSnowflakes() {
    if (!this.canvas) {
      console.error('Canvas element is not initialized.');
      return;
    }
  
    this.numFlakes = 20;
  
    for (let i = 0; i < this.numFlakes; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 1,
        color: `rgba(${Math.random() * 100 + 150}, ${Math.random() * 200 + 50}, 255, 0.5)`,
      });
    }
  }
  
  
  private drawSnowflakes() {
    if (!this.canvas || !this.ctx) {
      console.error('Canvas or context is not initialized.');
      return;
    }
  
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    for (let flake of this.snowflakes) {
      this.ctx.font = `${flake.radius * 5}px Arial`;
      this.ctx.fillStyle = flake.color;
  
      this.ctx.fillText('❄️', flake.x, flake.y);
    }
  }
  
  

  private updateSnowflakes() {
    if (!this.canvas) {
      console.error('Canvas element is not initialized.');
      return;
    }
  
    for (let flake of this.snowflakes) {
      flake.y += flake.speed;
      if (flake.y > this.canvas.height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * this.canvas.width;
      }
    }
  }
    
  private animateSnowflakes() {
    this.updateSnowflakes();
    this.drawSnowflakes();
    requestAnimationFrame(this.animateSnowflakes.bind(this));
  }
}
