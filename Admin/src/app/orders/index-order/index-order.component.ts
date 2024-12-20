declare const bootstrap: any;
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index-order',
  imports: [RouterModule, CommonModule],
  templateUrl: './index-order.component.html',
  styleUrl: './index-order.component.css'
})
export class IndexOrderComponent {
  orders: any[] = [];
  orderItems: any[] = [];
  totalPrice: number = 0; 

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.apiService.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Lỗi khi tải dữ liệu đơn hàng:', error);
      }
    );
  }

  showOrderDetails(orderId: number): void {
    this.http.get<any>(`http://localhost:8000/order/get-by-id/${orderId}`).subscribe(
      async (data) => {
        this.orderItems = data.order_items || []; 
        this.totalPrice = this.calculateTotalPrice(this.orderItems);
        const address = data.address ? `
          <p><strong>Họ và tên:</strong> ${data.address.full_name}</p>
          <p><strong>Số điện thoại:</strong> ${data.address.phone}</p>
          <p><strong>Địa chỉ:</strong> ${data.address.final_address}</p>
        ` : '<p>Không có thông tin địa chỉ</p>';
  
        const status = data.status ? `<p><strong>Trạng thái:</strong> ${data.status}</p>` : '<p>Không có trạng thái</p>';
  
        let productDetails = '';
        if (data.order_items && data.order_items.length > 0) {
          productDetails = `
            <table class="table table-bordered">
              <thead class="table-primary">
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá (VND)</th>
                  <th>Tổng (VND)</th>
                </tr>
              </thead>
              <tbody>
          `;
  
          // Duyệt qua các sản phẩm và gọi API `get-by-id` cho từng sản phẩm
          for (const item of data.order_items) {
            const product = await this.http.get<any>(`http://localhost:8000/product/get-by-id/${item.product_id}`).toPromise();
            productDetails += `
              <tr>
                <td><img src="https://localhost:1009/${product.image_url}" alt="${product.product_name}" width="100" height="100"></td>
                <td>${product.product_name}</td>
                <td>${item.quantity}</td>
                <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.unit_price))}</td>
                <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}</td>
              </tr>      
            `;
          }
  
          productDetails += `
              </tbody>
            </table>
          `;
        } else {
          productDetails = '<p>Không có sản phẩm trong đơn hàng này</p>';
        }
  
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
  
        if (modalTitle) modalTitle.innerHTML = `Chi tiết đơn hàng #${orderId}`;
        if (modalBody) modalBody.innerHTML = `
          ${address}
          ${status}
          <hr />
          <h5>Danh sách sản phẩm:</h5>
          ${productDetails}
        `;
  
        const modalElement = document.getElementById('orderDetailsModal');
        if (modalElement) {
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }
      },
      (error) => {
        console.error('Lỗi khi tải thông tin đơn hàng:', error);
        alert('Không thể lấy thông tin đơn hàng.');
      }
    );
  }
  calculateTotalPrice(orderItems: any[]): number {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0);
  }
  
}
