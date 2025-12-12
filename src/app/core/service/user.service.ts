import { Injectable, inject } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  async register(user: Register): Promise<void>{
    await lastValueFrom(this.http.post('/api/register', user));
  }

  async login(user: Login): Promise<void> {
    const response = await lastValueFrom(this.http.post<LoginResponse>('/api/login', user));
    const token = response.token;
    this.authService.setToken(token);
  }
}
