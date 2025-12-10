import { AuthInterceptor } from './auth.interceptor';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let next: HttpHandler;

  beforeEach(() => {
    interceptor = new AuthInterceptor();
    next = {
      handle: jest.fn().mockReturnValue(of('response'))
    } as any;
    sessionStorage.clear();
  });

  it('should add Authorization header if token exists', () => {
    sessionStorage.setItem('token', 'my-token');

    const req = new HttpRequest('GET', '/test');

    let handledReq: HttpRequest<any> | null = null;

    (next.handle as jest.Mock).mockImplementation((r: HttpRequest<any>) => {
      handledReq = r;
      return of('response');
    });

    interceptor.intercept(req, next).subscribe();

    expect(handledReq!.headers.get('Authorization')).toBe('Bearer my-token');
    expect(next.handle).toHaveBeenCalled();
  });

  it('should not add Authorization header if no token', () => {
    const req = new HttpRequest('GET', '/test');

    let handledReq: HttpRequest<any> | null = null;

    (next.handle as jest.Mock).mockImplementation((r: HttpRequest<any>) => {
      handledReq = r;
      return of('response');
    });

    interceptor.intercept(req, next).subscribe();

    expect(handledReq!.headers.has('Authorization')).toBe(false);
    expect(next.handle).toHaveBeenCalled();
  });

  it('should pass request to next.handle', () => {
    const req = new HttpRequest('GET', '/test');

    interceptor.intercept(req, next).subscribe();

    expect(next.handle).toHaveBeenCalled();
  });
});
