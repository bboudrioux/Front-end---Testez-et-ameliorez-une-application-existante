import { Injectable, inject } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  register(user: Register): Observable<Object>{
    return this.http.post('/api/register', user);
  }

  login(user: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/login', user);
  }
}
