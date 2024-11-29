import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    const loginData = { email: this.email, password: this.password };
  
    this.apiService.login(loginData).subscribe({
      next: (response: any) => {
        if (response.message === 'Login successful.') {
          localStorage.setItem('email', this.email);
          localStorage.setItem('userInfo', JSON.stringify(response.userInfo));
  
          this.apiService.loginSuccess(this.email);
          alert('Đăng nhập thành công!');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Mật khẩu không đúng. Vui lòng thử lại.';
        } else {
          this.errorMessage = 'Lỗi đăng nhập. Vui lòng thử lại.';
        }
        console.error('Lỗi khi đăng nhập:', err);
      }
    });
  }
  
}