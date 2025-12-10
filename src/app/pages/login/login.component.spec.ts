import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: { login: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    userServiceMock = { login: jest.fn().mockResolvedValue(undefined) };
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

  it('should not call login if form is invalid', async () => {
    component.loginForm.patchValue({ login: '', password: '' });
    await component.onSubmit();
    expect(userServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on valid form', async () => {
    component.loginForm.patchValue({ login: 'johndoe', password: '1234' });

    await component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith({ login: 'johndoe', password: '1234' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set submitted to true on submit', async () => {
    expect(component.submitted).toBe(false);
    await component.onSubmit();
    expect(component.submitted).toBe(true);
  });

  it('should handle login error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    userServiceMock.login.mockRejectedValueOnce(new Error('Login failed'));
    component.loginForm.patchValue({ login: 'johndoe', password: 'wrong' });

    await component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
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
