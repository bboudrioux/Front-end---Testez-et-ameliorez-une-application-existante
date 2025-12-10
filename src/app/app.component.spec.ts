import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/service/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      token$: of('my-token'),
      setToken: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        importProvidersFrom(RouterModule.forRoot([])) // remplace RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have token$ observable', (done) => {
    component.token$.subscribe(token => {
      expect(token).toBe('my-token');
      done();
    });
  });

  it('should call setToken(null) and navigate to /login on logout', () => {
    const router = TestBed.inject(Router);
    const authService = TestBed.inject(AuthService);

    jest.spyOn(router, 'navigate');
    component.logout();

    expect(authService.setToken).toHaveBeenCalledWith(null);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
