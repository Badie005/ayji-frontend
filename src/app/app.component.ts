import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    CommonModule
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.css',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'my-app';
  showHeaderFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Observer les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Masquer les éléments sur les pages login et register
      const currentRoute = event.urlAfterRedirects;
      this.showHeaderFooter = !(
        currentRoute.includes('/login') ||
        currentRoute.includes('/signup')
      );
    });
  }
}
