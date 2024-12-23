declare const bootstrap: any;
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
 export class ProfileComponent implements OnInit {
  user: any = {
    user_id: null,
    username: '',
    phone_number: '',
    date_of_birth: '',
    imageData: '',
    content: 'string',
    fileName: ''
  };

  orders: any[] = [];
  orderItems: any[] = [];
  totalPrice: number = 0; 
  addresses: any[] = [];

  selectedFile: File | null = null;

  constructor(private cdr: ChangeDetectorRef, private apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAddresses();

    const email = localStorage.getItem('email');
    if (email) {
      this.getUserInfo(email);
    } else {
      console.log('Không tìm thấy email trong localStorage');
    }
  }

  getUserInfo(email: string): void {
    this.apiService.getUserByEmail(email).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.user = response[0];
          console.log('Dữ liệu người dùng:', this.user);
          if (this.user.date_of_birth) {
            this.user.date_of_birth = this.user.date_of_birth.split(' ')[0];
          }
          this.cdr.detectChanges();
        } else {
          console.log('Không tìm thấy người dùng');
        }
      },
      error: (err) => {
        console.error('Lỗi khi gọi API', err);
      }
    });
  }
  openUpdateProfileDialog(): void {
    Swal.fire({
      title: 'Cập nhật tài khoản',
      html: `
        <div id="profile-form">
          <form>
            <div class="form-group mb-3">
              <label for="username" class="form-label text-start">Tên người dùng</label>
              <input id="username" class="form-control" placeholder="Tên người dùng" value="${this.user.username}">
            </div>

            <div class="form-group mb-3">
              <label for="phone_number">Số điện thoại</label>
              <input id="phone_number" class="form-control" placeholder="Số điện thoại" value="${this.user.phone_number}">
            </div>

            <div class="form-group mb-3">
              <label for="date_of_birth">Ngày sinh</label>
              <input id="date_of_birth" class="form-control" type="date" value="${this.user.date_of_birth}">
            </div>
          </form>
        </div>
      `,
      preConfirm: () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const phone_number = (document.getElementById('phone_number') as HTMLInputElement).value;
        const date_of_birth = (document.getElementById('date_of_birth') as HTMLInputElement).value;

        this.user.username = username;
        this.user.phone_number = phone_number;
        this.user.date_of_birth = date_of_birth;
        this.updateProfile(this.user.user_id);
      },
      showCancelButton: true,
      cancelButtonText: 'Hủy',
    });
  }

  openUpdateImageDialog(): void {
    Swal.fire({
      title: 'Cập nhật ảnh đại diện',
      html: `
        <div id="image-form">
          <input type="file" id="avatar" class="form-control-file">
        </div>
      `,
      preConfirm: () => {
        const fileInput = document.getElementById('avatar') as HTMLInputElement;

        if (fileInput && fileInput.files && fileInput.files[0]) {
          this.selectedFile = fileInput.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.user.imageData = reader.result as string;
            this.user.fileName = this.selectedFile?.name || '';
            this.updateProfileImage(this.user.user_id);
          };
          reader.readAsDataURL(this.selectedFile);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Chưa chọn ảnh',
            text: 'Vui lòng chọn ảnh đại diện.',
          });
        }
      },
      showCancelButton: true,
      cancelButtonText: 'Hủy',
    });
  }

  updateProfile(userId: number): void {
    const userUpdateData = {
      username: this.user.username,
      phone_number: this.user.phone_number,
      date_of_birth: this.user.date_of_birth,
      imageData: this.user.imageData,
      content: this.user.content,
      fileName: this.user.fileName
    };

    this.apiService.updateProfile(userId, userUpdateData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: 'Thông tin tài khoản đã được cập nhật.',
        }).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi khi cập nhật tài khoản.',
        });
      }
    });
  }

  updateProfileImage(userId: number): void {
    const imageUpdateData = {
      imageData: this.user.imageData,
      fileName: this.user.fileName
    };

    this.apiService.updateProfile(userId, imageUpdateData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật ảnh đại diện thành công!',
          text: 'Ảnh đại diện đã được cập nhật.',
        }).then(() => {
          // Reload lại trang sau khi ấn OK
          window.location.reload();
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi khi cập nhật ảnh đại diện.',
        });
      }
    });
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

    showOrderDetails(): void {
      // Lấy customerId từ localStorage
      const customerId = localStorage.getItem('user_id');
      if (!customerId) {
        alert('Không tìm thấy thông tin khách hàng.');
        return;
      }
    
      this.http.get<any[]>(`http://localhost:8000/order/get-by-customer-id/${customerId}`).subscribe(
        async (orders) => {
          if (!orders || orders.length === 0) {
            alert('Không có đơn hàng nào của khách hàng này.');
            return;
          }
    
          // Xử lý tất cả các đơn hàng trong mảng
          let orderDetails = '';
          for (const order of orders) {
            // Tính tổng giá tiền
            const totalPrice = this.calculateTotalPrice(order.order_items);
    
            // Xử lý địa chỉ
            const address = order.address
              ? `
                <p><strong>Họ và tên:</strong> ${order.address.full_name}</p>
                <p><strong>Số điện thoại:</strong> ${order.address.phone}</p>
                <p><strong>Địa chỉ:</strong> ${order.address.final_address}</p>
              `
              : '<p>Không có thông tin địa chỉ</p>';
    
            // Xử lý trạng thái
            const status = order.status
              ? `<p><strong>Trạng thái:</strong> ${order.status}</p>`
              : '<p>Không có trạng thái</p>';
    
            // Danh sách sản phẩm
            let productDetails = '';
            if (order.order_items && order.order_items.length > 0) {
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
    
              // Sử dụng Promise.all để tải thông tin sản phẩm
              const productPromises = order.order_items.map(async (item: any) => {
                const product = await this.http
                  .get<any>(`http://localhost:8000/product/get-by-id/${item.product_id}`)
                  .toPromise();
    
                return `
                  <tr>
                    <td><img src="https://localhost:1009/${product.image_url}" alt="${product.product_name}" width="100" height="100"></td>
                    <td>${product.product_name}</td>
                    <td>${item.quantity}</td>
                    <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.unit_price))}</td>
                    <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}</td>
                  </tr>`;
              });
    
              const productRows = await Promise.all(productPromises);
              productDetails += productRows.join('');
              productDetails += `
                  </tbody>
                </table>`;
            } else {
              productDetails = '<p>Không có sản phẩm trong đơn hàng này</p>';
            }
    
            // Gộp chi tiết đơn hàng vào chuỗi
            orderDetails += `
              <div class="order-details">
                <h4>Đơn hàng #${order.id}</h4>
                ${address}
                ${status}
                <h5>Danh sách sản phẩm:</h5>
                ${productDetails}
                <p><strong>Tổng giá tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</p>
                <hr />
              </div>
            `;
          }
    
          // Hiển thị nội dung trong modal
          const modalBody = document.getElementById('modalBody');
          if (modalBody) modalBody.innerHTML = orderDetails;
    
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
      if (!orderItems || orderItems.length === 0) return 0;
      return orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    }
    
}