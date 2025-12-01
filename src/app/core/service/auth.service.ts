import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('token'));
  token$ = this.tokenSubject.asObservable();

  setToken(token: string | null) {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
    this.tokenSubject.next(token);
  }
}
