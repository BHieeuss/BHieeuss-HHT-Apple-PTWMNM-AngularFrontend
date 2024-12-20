import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute) { }

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

  addToCart(): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    const existingProduct = cart.find((item: any) => item.product_id === this.product.product_id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        product_id: this.product.product_id,
        quantity: 1
      });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
  
    Swal.fire({
      icon: 'success',
      title: 'Sản phẩm đã được thêm vào giỏ hàng!',
      text: 'Bạn có thể tiếp tục mua sắm hoặc thanh toán.',
      showCancelButton: true,
      confirmButtonText: 'Thanh toán',
      cancelButtonText: 'Tiếp tục mua sắm',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/checkout']);
      } else if (result.isDismissed) {
        this.router.navigate(['/shop']);
      }
    });
  }
}
