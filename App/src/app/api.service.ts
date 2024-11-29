import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';

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
      return this.http.post(`${this.baseUrl}/user/login`, loginData).pipe(
        catchError((err) => {
          throw err;
        })
      );
    }
    

      // Xử lý đăng nhập thành công
      loginSuccess(email: string) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('email', email);
          
          this.isLoggedInSubject.next(true);
        }
      }
      // Get thông tin tài khoản
      getUserByEmail(email: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/user/get-by-email?email=${email}`);
      }
      
      // Cập nhật thông tin tài khoản
      updateProfile(userId: number, userData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/user/update-profile/${userId}`, userData);
      }
    
  }
