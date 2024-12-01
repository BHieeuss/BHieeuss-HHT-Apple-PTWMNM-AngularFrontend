import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-coupon',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-coupon.component.html',
  styleUrl: './update-coupon.component.css'
})
export class UpdateCouponComponent implements OnInit{
  couponId: number = 0;
  coupon = {
    code: '',
    description: '',
    start_date: '',
    end_date: '',
    discount_percent: 0,
    times_available: 0,
    is_actived: 0 // Mặc định là 0 (Không kích hoạt)
  };

  constructor(
    private apiService: ApiService, private route: ActivatedRoute, private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy mã coupon từ URL
    this.couponId = +this.route.snapshot.paramMap.get('id')!;
    
    // Lấy thông tin coupon từ API
    this.apiService.getCouponById(this.couponId).subscribe(
      (coupon) => {
        this.coupon = coupon;
      },
      (error) => {
        console.error('Không thể lấy thông tin coupon:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin coupon.',
          confirmButtonText: 'Đóng'
        });
      }
    );
  }

  onIsActivedChange(): void {

    this.coupon.is_actived = this.coupon.is_actived ? 1 : 0;
  }
  

  updateCoupon(): void {
    // Trước khi gửi yêu cầu, đảm bảo is_actived là số (0 hoặc 1)
    if (this.coupon.is_actived !== 0 && this.coupon.is_actived !== 1) {
      this.coupon.is_actived = 0; // Nếu không có giá trị hợp lệ, mặc định là 0
    }

    this.apiService.updateCoupon(this.couponId, this.coupon).subscribe(
      (response) => {
        console.log('Coupon đã được cập nhật thành công', response);
        Swal.fire({
          icon: 'success',
          title: 'Coupon đã được sửa thành công!',
          showConfirmButton: true,
          confirmButtonText: 'Đóng',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/coupons']);
          }
        });
      },
      (error) => {
        console.error('Có lỗi khi cập nhật coupon:', error);
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Không thể cập nhật coupon, vui lòng thử lại.',
          confirmButtonText: 'Đóng'
        });
      }
    );
  }
}