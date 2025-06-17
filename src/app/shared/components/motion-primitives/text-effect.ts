import { Component, Input, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-text-effect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `,
  animations: [
    trigger('fadeInBlur', [
      transition(':enter', [
        style({ opacity: 0, filter: 'blur(12px)', transform: 'translateY(10px)' }),
        animate('1.5s ease-out', style({ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' }))
      ])
    ])
  ],
  host: {
    '[@fadeInBlur]': ''
  }
})
export class TextEffectComponent implements OnInit, AfterViewInit {
  @Input() preset: 'fade-in-blur' = 'fade-in-blur';
  @Input() as: string = 'div';
  @Input() delay: number = 0;
  @Input() speedSegment: number = 0.3;
  @Input() per: 'line' | 'word' | 'char' = 'word';
  
  @ViewChild('textContainer') textContainer!: ElementRef;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    // Appliquer les classes selon les props
    const element = this.el.nativeElement;
    element.style.display = 'block';
  }
  
  ngAfterViewInit() {
    // Pour une implémentation plus avancée, on pourrait ajouter un splitting du texte
    // et appliquer des animations plus sophistiquées par mot ou caractère
  }
}
