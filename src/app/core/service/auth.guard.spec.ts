import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: { token$: BehaviorSubject<string | null> };
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceMock = { token$: new BehaviorSubject<string | null>(null) };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if token exists', done => {
    authServiceMock.token$.next('my-token');

    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should prevent activation and navigate to login if no token', done => {
    authServiceMock.token$.next(null);

    guard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
