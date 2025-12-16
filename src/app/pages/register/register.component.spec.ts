import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceMock: { register: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    userServiceMock = { register: jest.fn().mockReturnValue(of({})) };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    const form = component.registerForm;
    expect(form).toBeTruthy();
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('login')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.patchValue({ firstName: '', lastName: '', login: '', password: '' });
    component.onSubmit();
    expect(userServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call userService.register and navigate to login on valid form', fakeAsync(() => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234'
    });

    component.onSubmit();
    tick();

    expect(userServiceMock.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234'
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should set submitted to true on submit', () => {
    component.registerForm.patchValue({
      firstName: '',
      lastName: '',
      login: '',
      password: ''
    });
    expect(component.submitted).toBe(false);
    component.onSubmit();
    expect(component.submitted).toBe(true);
  });

  it('should reset the form on onReset', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234'
    });
    component.submitted = true;

    component.onReset();

    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('login')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.submitted).toBe(false);
  });
});
