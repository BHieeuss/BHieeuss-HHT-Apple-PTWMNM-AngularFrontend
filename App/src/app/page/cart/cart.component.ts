import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  products: any[] = [];
  addresses: any[] = [];
  coupons: any[] = [];
  totalAmount: number = 0;
  discountAmount: number = 0;
  selectedCoupon: any = null; 
  selectedCouponDetails : any = null; 
  selectedAddressId: number | null = null;

  constructor(private apiService: ApiService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.getAddresses();
    this.getCoupons();
    this.calculateTotalAmount();
  }

  getAddresses(): void {
    this.apiService.getAddresses().subscribe(
      (response: any) => {
        if (response.status) {
          this.addresses = response.data;
        } else {
          console.error('Failed to fetch addresses');
        }
      },
      (error) => {
        console.error('Error fetching addresses', error);
      }
    );
  }

  getCoupons(): void {
    this.apiService.getCoupons().subscribe(
      (response: any) => {
        console.log('Coupons response:', response);
        if (response && response.length > 0) {
          this.coupons = response;
        } else {
          console.error('No coupons found or invalid response');
        }
      },
      (error) => {
        console.error('Error fetching coupons', error);
        alert('Có lỗi xảy ra khi tải mã giảm giá. Vui lòng thử lại sau.');
      }
    );
  }

  chooseCoupon(): void {
    Swal.fire({
      title: 'Chọn mã giảm giá',
      input: 'select',
      inputOptions: this.getCouponOptions(),
      inputPlaceholder: 'Chọn mã giảm giá',
      showCancelButton: true,
      confirmButtonText: 'Chọn',
      cancelButtonText: 'Hủy',
      preConfirm: (couponId) => {
        console.log('Coupon ID selected:', couponId);
  
        if (couponId) {
          const selectedCoupon = this.coupons.find(coupon => String(coupon.coupon_id) === String(couponId));
  
          if (selectedCoupon) {
            this.selectedCoupon = selectedCoupon.code;
            this.selectedCouponDetails = selectedCoupon;
            console.log('Mã giảm giá được chọn:', this.selectedCoupon);
            this.calculateTotalAmount();
          } else {
            console.error('No coupon found for ID:', couponId);
          }
        } else {
          console.error('No coupon ID passed');
        }
      }
    });
  }
  
  getCouponOptions(): any {
    let options: any = {};
    this.coupons.forEach(coupon => {
      options[coupon.coupon_id] = `${coupon.code} - ${coupon.discount_percent}% giảm giá`;
    });
    return options;
  } 
  
  selectAddress(target: any): void {
    this.selectedAddressId = target.value;
    console.log('Selected address ID:', this.selectedAddressId);
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

  removeProduct(index: number): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1); // Xóa sản phẩm tại vị trí index
    localStorage.setItem('cart', JSON.stringify(cart));
    this.products = cart.map((item: any) => item.product);
    this.cartItems = cart;
    this.calculateTotalAmount();
    window.location.reload();
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.products = [];
    this.cartItems = [];
    this.totalAmount = 0;
    window.location.reload();
  }

  calculateTotalAmount(): void {
    this.totalAmount = 0;
    this.discountAmount = 0;  // Reset discount
  
    // Tính tổng tiền ban đầu
    this.products.forEach((product: any, index: number) => {
      const quantity = this.cartItems[index]?.quantity;
      const price = parseFloat(product.price) - parseFloat(product.discount);
      this.totalAmount += price * quantity;
    });
  
    // Áp dụng giảm giá nếu có mã giảm giá
    if (this.selectedCouponDetails) {
      const discountPercent = this.selectedCouponDetails.discount_percent; // Lấy tỷ lệ giảm giá từ mã giảm giá
      if (discountPercent > 0) {
        // Tính tiền giảm giá
        this.discountAmount = (this.totalAmount * discountPercent) / 100;
        // Tính lại tổng tiền sau khi áp dụng giảm giá
        this.totalAmount -= this.discountAmount;
      }
    }
  
    console.log('Tổng tiền sau khi giảm giá:', this.totalAmount);
    console.log('Số tiền giảm giá:', this.discountAmount);
  }
  
  getProductTotal(product: any, index: number): number {
    const quantity = this.cartItems[index]?.quantity;
    const price = parseFloat(product.price) - parseFloat(product.discount);
    return price * quantity;
  }

  createOrder() {
    const userId = localStorage.getItem('user_id');
    const cartString = localStorage.getItem('cart');
  
    const cart = cartString ? JSON.parse(cartString) : [];
    console.log('Parsed cart:', cart);
  
    if (!userId || this.selectedAddressId === null || cart.length === 0) {
      console.error('Please select a valid address, user_id is missing, or no items in the cart');
      return;
    }
  
    const orderData = {
      user_id: userId,
      order_items: cart,
      user_address_id: this.selectedAddressId,
      code: this.selectedCoupon,
      payment: 'cash'
    };
  
    this.apiService.createOrder(orderData).subscribe(
      (response) => {
        console.log('Order created successfully:', response);
      },
      (error) => {
        console.error('Error creating order:', error);
      }
    );
  }
   
  
  
}