import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-single',
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-single.component.html',
  styleUrl: './shop-single.component.css'
})
export class ShopSingleComponent implements OnInit {
  product: any = {}; 
  quantity: number = 1;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id'); 
    if (productId) {
      this.getProductDetail(productId);
    }
  }

  getProductDetail(productId: string): void {
    this.apiService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response;
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
      }
    });
  }

  // addToCart(): void {
  //   const cartItem = {
  //     product_id: this.product.product_id,
  //     quantity: this.quantity
  //   };

  //   this.apiService.addToCart(cartItem).subscribe({
  //     next: (response) => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Thêm vào giỏ hàng thành công!',
  //         text: 'Sản phẩm đã được thêm vào giỏ hàng.',
  //       });
  //     },
  //     error: (err) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Lỗi!',
  //         text: 'Không thể thêm sản phẩm vào giỏ hàng.',
  //       });
  //     }
  //   });
  // }
}
