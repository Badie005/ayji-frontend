import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() highlightColor: string = 'yellow';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }
}
