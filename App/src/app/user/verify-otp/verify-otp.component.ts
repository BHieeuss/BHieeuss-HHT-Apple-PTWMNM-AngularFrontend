import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {
  email: string = '';
  otp: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Lấy email từ query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onVerifyOtp() {
    const otpData = { email: this.email, otp: this.otp };

    this.apiService.verifyOtp(otpData).subscribe({
      next: (response) => {
        console.log('Xác thực OTP thành công:', response);
        Swal.fire({
          icon: 'success',
          title: 'Xác thực OTP thành công',
          text: 'Hãy đăng nhập vào Website',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Lỗi khi xác thực OTP:', err);
      }
    });
  }
}