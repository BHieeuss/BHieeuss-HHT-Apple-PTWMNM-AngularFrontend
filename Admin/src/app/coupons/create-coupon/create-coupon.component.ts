import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-coupon',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.css'
})
export class CreateCouponComponent {
  coupon = {
    code: '',
    description: '',
    start_date: '',
    end_date: '',
    is_actived: 0, // Giá trị mặc định là 0
    discount_percent: 0,
    times_available: 0
  };

  constructor(private apiService: ApiService, private router: Router) {}

  // Hàm xử lý khi checkbox thay đổi
  onIsActivedChange(event: any): void {
    // Chuyển đổi giá trị thành số: 0 hoặc 1
    this.coupon.is_actived = event.target.checked ? 1 : 0;
  }

  createCoupon(): void {
    // Đảm bảo là dữ liệu hợp lệ trước khi gửi yêu cầu
    if (this.coupon.code && this.coupon.description && this.coupon.start_date && this.coupon.end_date && this.coupon.discount_percent >= 0 && this.coupon.times_available >= 0) {
      // Gửi yêu cầu tạo coupon tới API
      this.apiService.createCoupon(this.coupon).subscribe(
        (response) => {
          console.log('Coupon created successfully', response);
          // Chuyển hướng đến danh sách coupon sau khi tạo thành công
          this.router.navigate(['/coupons']);
        },
        (error) => {
          console.error('Error creating coupon:', error);
          alert('Có lỗi khi tạo coupon, vui lòng thử lại!');
        }
      );
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
}