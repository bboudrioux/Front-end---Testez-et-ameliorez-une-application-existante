import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  title = 'etudiant-frontend';
  token: string | null = null;

  ngOnInit() {
    const token = sessionStorage.getItem("token");
    this.token = token;
    if (!token) this.router.navigate(["/login"]);
  }

  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }
}
