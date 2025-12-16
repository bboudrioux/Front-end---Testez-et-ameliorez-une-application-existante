import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: { setToken: jest.Mock };

  beforeEach(() => {
    authServiceSpy = { setToken: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call /api/register with user data', () => {
    const mockUser: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234'
    };

    service.register(mockUser)
      .subscribe((user) => expect(user).toEqual(mockUser));

    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush({});
  });

  it('should handle register error', () => {
    const mockUser: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234'
    };

    service.register(mockUser).subscribe({
      next: () => fail('expected an error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('/api/register');

    req.flush({ message: 'Invalid data' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should call /api/login and set token', () => {
    const mockLogin: Login = { login: 'johndoe', password: '1234' };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(mockLogin)
      .subscribe((response) => expect(response).toEqual(mockResponse));

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLogin);

    req.flush(mockResponse);
  });

  it('should handle login error and not call setToken', () => {
    const mockLogin: Login = { login: 'johndoe', password: '1234' };

    service.login(mockLogin)
      .subscribe({
        next: () => fail('expected an error'),
        error: (err: HttpErrorResponse) => expect(err.status).toBe(400)
      });

    const req = httpMock.expectOne('/api/login');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.setToken).not.toHaveBeenCalled();
  });
});
