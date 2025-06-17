import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-animated-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [@groupAnimation]="true" class="animated-group">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .animated-group {
      display: block;
    }
  `],
  animations: [
    trigger('groupAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AnimatedGroupComponent {
  @Input() variants: any = {};
}
