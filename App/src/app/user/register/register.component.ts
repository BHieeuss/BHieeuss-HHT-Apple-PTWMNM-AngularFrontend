import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
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
        
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          text: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
        }).then(() => {
          this.router.navigate(['/verify-otp'], { queryParams: { email: this.email } });
        });
      },
      error: (err) => {
        console.error('Lỗi khi đăng ký:', err);
      }
    });
  }
}