import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient,  @Inject(PLATFORM_ID) private platformId: object) {
  // Kiểm tra trạng thái đăng nhập khi khởi tạo
      if (isPlatformBrowser(this.platformId)) {
        const email = localStorage.getItem('email');
        this.isLoggedInSubject.next(!!email);
      }
  }

  //Lấy danh sách danh mục
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/category/get-all`);
  }

  //Đăng ký
    // Gửi yêu cầu đăng ký
    register(userData: { email: string; password: string; imageData: string }): Observable<any> {
      return this.http.post(`${this.baseUrl}/user/register`, userData);
    }
  
    // Xác thực OTP
    verifyOtp(otpData: { email: string; otp: string }): Observable<any> {
      return this.http.put(`${this.baseUrl}/user/vertify-otp`, otpData);
    }

     // Đăng nhập
      login(loginData: { email: string; password: string }) {
        return this.http.post(`${this.baseUrl}/user/login`, loginData);
      }

      // Xử lý đăng nhập thành công
      loginSuccess(email: string) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('email', email);
          this.isLoggedInSubject.next(true);
        }
      }

      // Đăng xuất
      logout() {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('email');
          this.isLoggedInSubject.next(false);
        }
      }
  }
