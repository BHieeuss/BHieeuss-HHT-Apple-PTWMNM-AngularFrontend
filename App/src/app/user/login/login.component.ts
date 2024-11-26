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
  
    this.apiService.getUserByEmail(this.email).subscribe({
      next: (userInfo: any) => {
        // Lưu email và thông tin người dùng vào localStorage
        localStorage.setItem('email', this.email);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));  // Lưu toàn bộ thông tin người dùng vào localStorage
        
        // Cập nhật trạng thái đăng nhập thành công
        this.apiService.loginSuccess(this.email);  
        alert('Đăng nhập thành công!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        this.errorMessage = 'Lỗi khi lấy thông tin người dùng. Vui lòng thử lại.';
      }
    });
  }
  
}