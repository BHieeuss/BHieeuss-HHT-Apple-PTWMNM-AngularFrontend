import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private http: HttpClient, private router: Router) {}


  onRegister() {
    const userData = { email: this.email, password: this.password, imageData: '' };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        console.log('Đăng ký thành công:', response);
        // Chuyển qua trang xác thực OTP
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        console.error('Lỗi khi đăng ký:', err);
      }
    });
  }
}