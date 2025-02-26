import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

// Directives
import { HighlightDirective } from './directives/highlight.directive';

// Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  // Retirez les déclarations car ces composants sont standalone
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // Importez les composants standalone ici
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    HighlightDirective,
    DateFormatPipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // Vous pouvez exporter les composants importés
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    HighlightDirective,
    DateFormatPipe
  ]
})
export class SharedModule { }
