import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-shop-single',
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-single.component.html',
  styleUrl: './shop-single.component.css'
})
export class ShopSingleComponent implements OnInit {
  product: any = {}; 
  quantity: number = 1;

  constructor(private apiService: ApiService, private cartService: CartService, private route: ActivatedRoute) { }

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

    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  } 
}
