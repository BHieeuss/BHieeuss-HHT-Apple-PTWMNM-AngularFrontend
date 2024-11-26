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
      this.email = localStorage.getItem('email');

      if (this.email) {
        this.apiService.getUserByEmail(this.email).subscribe({
          next: (response: any) => {
            this.userInfo = response[0]; 
            console.log('User Info:', this.userInfo);
            console.log('User Roles:', this.userInfo.roles);
          },
          error: (err) => {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
          }
        });
      }
    }

    // Lấy danh mục từ API
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
    }
    alert('Bạn đã đăng xuất.');
    this.router.navigate(['/login']); 
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
  }

  performSearch() {
    console.log('Từ khóa tìm kiếm:', this.searchQuery);
    this.toggleSearch(); 
  }

  updateCartCount() {
    this.cartCount = 5;
  }

  isAdmin(): boolean {
    if (this.userInfo && (this.userInfo.roles === 1 || this.userInfo.roles === 2)) {
      return true;
    }
    return false;
  }
  

}
