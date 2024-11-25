import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router,  @Inject(PLATFORM_ID) private platformId: object) {}

  onLogin() {
    const loginData = { email: this.email, password: this.password };
  
    this.apiService.login(loginData).subscribe({
      next: (response: any) => {
        this.apiService.loginSuccess(this.email);
        alert('Đăng nhập thành công!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Lỗi khi đăng nhập:', err);
        this.errorMessage = 'Đăng nhập không thành công. Vui lòng thử lại.';
      },
    });
  }
}