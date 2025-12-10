import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule]
})
export class LoginComponent implements OnInit {

  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;
  submitted = false;

  constructor() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() { }

  get form() {
    return this.loginForm.controls;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const loginUser: Login = {
      login: this.form['login'].value,
      password: this.form['password'].value
    };

    try {
      await this.userService.login(loginUser);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset({ login: '', password: '' });
  }
}
