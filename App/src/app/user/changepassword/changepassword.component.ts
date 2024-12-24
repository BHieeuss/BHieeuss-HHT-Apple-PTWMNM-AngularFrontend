import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-changepassword',
  imports: [CommonModule, FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent implements OnDestroy {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  otpSent: boolean = false;
  resendAvailable: boolean = false;
  countdown: number = 90;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  timerSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  // Gửi OTP
  sendOtp() {
    if (!this.email) {
      this.errorMessage = 'Email không được để trống!';
      return;
    }
    
    const payload = { email: this.email };
    this.http.post('http://localhost:8000/user/change-password', payload).subscribe(
      (response: any) => {
        this.otpSent = true;
        this.successMessage = 'OTP đã được gửi đến email của bạn.';
        this.errorMessage = null;

        // Bắt đầu đếm ngược
        this.startCountdown();
      },
      (error) => {
        this.errorMessage = 'Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại.';
        this.successMessage = null;
      }
    );
  }

  // Thay đổi mật khẩu
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp!';
      return;
    }

    const payload = {
      email: this.email,
      otp: this.otp,
      password: this.newPassword,
      confirm_password: this.confirmPassword
    };

    this.http.post('http://localhost:8000/user/update-password', payload).subscribe(
      (response: any) => {
        this.successMessage = 'Mật khẩu đã được thay đổi thành công!';
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = 'Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại.';
        this.successMessage = null;
      }
    );
  }

  startCountdown() {
    this.countdown = 90; 
    this.resendAvailable = false;
    this.timerSubscription = interval(1000).pipe(
      take(this.countdown) 
    ).subscribe(
      (timeElapsed) => {
        this.countdown = 90 - timeElapsed; 
      },
      () => {},
      () => {
        this.resendAvailable = true;
      }
    );
  }

  // Gửi lại OTP
  resendOtp() {
    if (this.resendAvailable) {
      const payload = { email: this.email };
      this.http.post('http://localhost:8000/user/resend-otp', payload).subscribe(
        (response: any) => {
          this.successMessage = 'OTP đã được gửi lại.';
          this.errorMessage = null;
          this.countdown = 90;  // Reset lại thời gian đếm ngược
          this.resendAvailable = false;
          this.startCountdown();  // Bắt đầu lại đếm ngược
        },
        (error) => {
          this.errorMessage = 'Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại.';
          this.successMessage = null;
        }
      );
    }
  }

  // Hủy subscription khi component bị huỷ
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}