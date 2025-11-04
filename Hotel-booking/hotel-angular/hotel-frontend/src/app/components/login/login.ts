import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };
  isAdminLogin = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.isAdminLogin) {
      this.authService.adminLogin(this.loginRequest).subscribe({
        next: (admin) => {
          this.authService.setCurrentUser(admin);
          // Redirect admin to admin dashboard
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Invalid admin credentials';
        }
      });
    } else {
      this.authService.userLogin(this.loginRequest).subscribe({
        next: (user) => {
          this.authService.setCurrentUser(user);
          // Redirect regular user to rooms page
          this.router.navigate(['/rooms']);
        },
        error: (error) => {
          this.errorMessage = 'Invalid username or password';
        }
      });
    }
  }

  toggleLoginType(): void {
    this.isAdminLogin = !this.isAdminLogin;
    this.errorMessage = '';
  }
}