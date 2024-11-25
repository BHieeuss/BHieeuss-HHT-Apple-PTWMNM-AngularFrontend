import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { ApiService } from '../api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  email: string | null = null;
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
    }

    // Lấy danh mục từ API
    this.apiService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  isLoggedIn(): boolean {
    // Kiểm tra trạng thái đăng nhập (localStorage chỉ hoạt động trong trình duyệt)
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('email');
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email'); // Xóa email khỏi localStorage
    }
    alert('Bạn đã đăng xuất.');
    this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
  }
}
