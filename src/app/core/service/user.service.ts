import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

interface LoginResponse {
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  async login(user: Login): Promise<LoginResponse> {
    return lastValueFrom(this.httpClient.post<LoginResponse>('/api/login', user));
  }
}
