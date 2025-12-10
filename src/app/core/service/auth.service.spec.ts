import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: jest.fn((key: string) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
      };
    })();

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set token in sessionStorage and emit it', () => {
    const setItemSpy = jest.spyOn(sessionStorage, 'setItem');

    let emittedToken: string | null = null;
    service.token$.subscribe(token => emittedToken = token);

    service.setToken('my-token');

    expect(setItemSpy).toHaveBeenCalledWith('token', 'my-token');
    expect(emittedToken).toBe('my-token');
  });

  it('should remove token from sessionStorage and emit null', () => {
    const removeItemSpy = jest.spyOn(sessionStorage, 'removeItem');

    let emittedToken: string | null = 'initial';
    service.token$.subscribe(token => emittedToken = token);

    service.setToken(null);

    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(emittedToken).toBeNull();
  });

  it('should initialize tokenSubject with existing sessionStorage token', () => {
    sessionStorage.setItem('token', 'stored-token');

    const service2 = new AuthService();

    let emittedToken: string | null = null;
    service2.token$.subscribe(token => emittedToken = token);

    expect(emittedToken).toBe('stored-token');
  });
});
