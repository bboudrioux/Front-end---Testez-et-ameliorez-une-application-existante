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

    service.register(mockUser).subscribe(response => {
      expect(response).toBeTruthy();
    });

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
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne('/api/register');
    req.flush({ message: 'Invalid data' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should call /api/login and set token', async () => {
    const mockLogin: Login = { login: 'johndoe', password: '1234' };
    const mockResponse = { token: 'fake-jwt-token' };

    const loginPromise = service.login(mockLogin);

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLogin);

    req.flush(mockResponse);

    await loginPromise;

    expect(authServiceSpy.setToken).toHaveBeenCalledWith('fake-jwt-token');
  });

  it('should handle login error and not call setToken', async () => {
    const mockLogin: Login = { login: 'johndoe', password: '1234' };

    let errorCaught = false;

    try {
      const loginPromise = service.login(mockLogin);
      const req = httpMock.expectOne('/api/login');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      await loginPromise;
    } catch (err: any) {
      errorCaught = true;
    }

    expect(errorCaught).toBe(true);
    expect(authServiceSpy.setToken).not.toHaveBeenCalled();
  });
});
