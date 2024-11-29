import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;  // Trả về giá trị cookie dưới dạng chuỗi
      }
    }
    return null;  // Nếu không tìm thấy cookie, trả về null
  }
  
  getUserRole(): number {
    const roleString = this.getCookie('userRole');  // Lấy cookie là chuỗi
    console.log('Retrieved userRole from cookie:', roleString);
  
    // Kiểm tra nếu cookie không phải là null và có thể chuyển thành số
    return roleString ? parseInt(roleString, 10) : 0;
  }
  
  
}