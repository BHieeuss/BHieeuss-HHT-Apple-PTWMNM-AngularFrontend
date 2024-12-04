import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { ApiService } from '../api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchActive: boolean = false; 
  searchQuery: string = ''; 
  email: string | null = null; 
  cartCount: number = 0; 
  userInfo: any = null;
  categories: any[] = [];

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateCartCount();
      this.email = localStorage.getItem('email');

      if (this.email) {
        this.apiService.getUserByEmail(this.email).subscribe({
          next: (response: any) => {
            this.userInfo = response[0]; 
            console.log('User Info:', this.userInfo);
            console.log('User Roles:', this.userInfo.roles);
            // Lưu user_id vào localStorage
          if (this.userInfo && this.userInfo.user_id) {
            localStorage.setItem('user_id', this.userInfo.user_id);
            console.log('User ID saved to localStorage:', this.userInfo.user_id);
          }
            // Kiểm tra nếu vai trò là 1, thì lưu vào cookie
            if (this.userInfo.roles === 1) {
              document.cookie = "userRole=1; path=/; SameSite=Lax;";
              console.log('User role 1 saved to cookie');
              console.log(document.cookie);

            }
          },
          error: (err) => {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
          }
        });
      }
    }

    this.apiService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('email');
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email'); 
      localStorage.removeItem('userInfo');
      localStorage.removeItem('user_id');
    this.deleteCookie('userRole');
    }   
    alert('Bạn đã đăng xuất.');
    this.router.navigate(['/login']); 
  }
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
  }
  toggleSearch() {
    this.searchActive = !this.searchActive;
  }

  performSearch() {
    console.log('Từ khóa tìm kiếm:', this.searchQuery);
    this.toggleSearch(); 
  }

  updateCartCount(): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  isAdmin(): boolean {
    if (this.userInfo && (this.userInfo.roles === 1 || this.userInfo.roles === 2)) {
      return true;
    }
    return false;
  }

  navigateToAdmin() {
    window.location.href = 'http://localhost:4201/#/home';
  }

}
