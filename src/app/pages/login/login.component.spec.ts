import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: { login: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    userServiceMock = { login: jest.fn().mockReturnValue(of({})) };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty controls', () => {
    const form = component.loginForm;
    expect(form.get('login')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
  });

  it('should not call login if form is invalid', () => {
    component.loginForm.patchValue({ login: '', password: '' });
    component.onSubmit();
    expect(userServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on valid form', fakeAsync(() => {
    component.loginForm.patchValue({ login: 'johndoe', password: '1234' });

    component.onSubmit();
    tick();

    expect(userServiceMock.login).toHaveBeenCalledWith({ login: 'johndoe', password: '1234' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should set submitted to true on submit', () => {
    expect(component.submitted).toBe(false);
    component.onSubmit();
    expect(component.submitted).toBe(true);
  });

  it('should reset form and submitted flag on onReset', () => {
    component.loginForm.patchValue({ login: 'user', password: '1234' });
    component.submitted = true;

    component.onReset();

    expect(component.loginForm.get('login')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.submitted).toBe(false);
  });
});
