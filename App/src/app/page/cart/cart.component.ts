import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  products: any[] = [];
  totalAmount: number = 0;
  addresses: any[] = [];
  selectedAddress: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.getAddresses();
  }

  getAddresses() {
    this.apiService.getAddresses().subscribe(
      (data) => {
        console.log('Addresses:', data);
        this.addresses = data || [];  // Đảm bảo là mảng nếu API trả về null hoặc undefined
      },
      (error) => {
        console.error('Error loading addresses:', error);
        this.addresses = [];  // Đảm bảo mảng trống nếu có lỗi
      }
    );
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
  }

  loadCartItems(): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length > 0) {
      const productRequests: Observable<any>[] = [];
      
      cart.forEach((item: any) => {
        const productId = item.product_id;
        productRequests.push(this.apiService.getProductById(productId));
      });
      
      forkJoin(productRequests).subscribe((responses: any[]) => {
        this.products = responses;
        this.cartItems = cart;
        this.calculateTotalAmount();
      });
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = 0;
    this.products.forEach((product: any, index: number) => {
      const quantity = this.cartItems[index].quantity;
      const price = parseFloat(product.price) - parseFloat(product.discount);
      this.totalAmount += price * quantity;
    });
  }

  getProductTotal(product: any, index: number): number {
    const quantity = this.cartItems[index]?.quantity;
    const price = parseFloat(product.price) - parseFloat(product.discount);
    return price * quantity;
  }
}