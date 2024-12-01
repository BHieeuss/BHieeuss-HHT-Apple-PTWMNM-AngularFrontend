import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-index-coupon',
  imports: [RouterModule, CommonModule],
  templateUrl: './index-coupon.component.html',
  styleUrl: './index-coupon.component.css'
})
export class IndexCouponComponent implements OnInit {
  coupons: any[] = [];
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Gọi API để lấy tất cả các coupon
    this.apiService.getAllCoupons().subscribe(data => {
      this.coupons = data;
    }, error => {
      console.error('Có lỗi khi lấy coupon:', error);
    });
  }

  // Điều hướng đến trang cập nhật coupon
  editCoupon(couponId: number): void {
    this.router.navigate(['/products/update-coupon', couponId]);
  }
}
