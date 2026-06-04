import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register{
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: 'user' | 'support' | 'admin' = 'user';

  loading = false;
  errorMessage = '';

  register(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Name, email and password are required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: (res) => {
          this.authService.saveAuth(res);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed';
        },
      });
  }
}