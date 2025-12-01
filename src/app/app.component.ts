import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  token$ = this.authService.token$;

  logout() {
    this.authService.setToken(null);
    this.router.navigate(['/login']);
  }
}
