import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8000';
  private provincesUrl = 'https://provinces.open-api.vn/api/?depth=2';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient,  @Inject(PLATFORM_ID) private platformId: object) {
  // Kiểm tra trạng thái đăng nhập khi khởi tạo
      if (isPlatformBrowser(this.platformId)) {
        const email = localStorage.getItem('email');
        this.isLoggedInSubject.next(!!email);
      }
  }

getAddresses(): Observable<any> {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return this.http.get(`${this.apiUrl}/useraddress/get-address-by-customer-id/${userId}`);
    } else {
      throw new Error('User ID not found in localStorage');
    }
  }

  //Lấy danh sách danh mục
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/get-all`);
  }
  
 //Lấy danh sách sản phẩm
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/get-all`);
  }

  // Lấy 6 sản phẩm ngẫu nhiên
  getRandomProducts(): Observable<any[]> {
    return this.getProducts().pipe(
      map(products => {
        // Trộn danh sách sản phẩm
        const shuffledProducts = this.shuffleArray(products);
        // Chọn 6 sản phẩm đầu tiên
        return shuffledProducts.slice(0, 6);
      })
    );
  }

  // Hàm trộn mảng ngẫu nhiên
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];  // Hoán đổi
    }
    return array;
  }
  // Lấy chi tiết sản phẩm theo ID
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/get-by-id/${productId}`);
  }

  //Đăng ký
    // Gửi yêu cầu đăng ký
    register(userData: { email: string; password: string; imageData: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}/user/register`, userData);
    }
  
    // Xác thực OTP
    verifyOtp(otpData: { email: string; otp: string }): Observable<any> {
      return this.http.put(`${this.apiUrl}/user/vertify-otp`, otpData);
    }
    

     // Đăng nhập
     login(loginData: { email: string; password: string }) {
      return this.http.post(`${this.apiUrl}/user/login`, loginData).pipe(
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
        return this.http.get(`${this.apiUrl}/user/get-by-email?email=${email}`);
      }
      
      // Cập nhật thông tin tài khoản
      updateProfile(userId: number, userData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/user/update-profile/${userId}`, userData);
      }

      //Tìm kiếm sản phẩm
      searchProductsByName(productName: string): Observable<any> {
        return this.http.get<any>(`http://localhost:8000/product/get-by-name`, {
          params: { product_name: productName }
        });
      }   
      
       //Tạo đơn hàng mới
      createOrder(orderData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/order/create`, orderData);
      }

      //Lấy mã giảm giá
      getCoupons(): Observable<any> {
        return this.http.get(`${this.apiUrl}/coupon/get-all`);
      }

      // Lấy sản phẩm theo danh mục
      getProductsByCategory(categoryId: number): Observable<any[]> {
        const url = `${this.apiUrl}/product/get-product-by-category/${categoryId}`;
        return this.http.get<any[]>(url);  // Gửi request GET đến API và nhận mảng dữ liệu
      }
  }
