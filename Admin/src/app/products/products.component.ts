import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];  
  selectedCategoryId: number | null = null;  

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
     // Lấy danh sách sản phẩm từ API
  this.apiService.getAllProducts().subscribe((data) => {
    this.products = data;
    console.log('Danh sách sản phẩm:', this.products);
  });

    // Lấy danh sách danh mục từ API
  this.apiService.getAllCategories().subscribe(
    (data) => {
      this.categories = data;
      console.log('Danh sách danh mục:', this.categories); // Kiểm tra danh mục có đúng không
    },
    (error) => {
      console.error('Có lỗi khi lấy danh mục:', error);
    }
  );
  }

  addProduct() {
    if (this.categories.length === 0) {
      Swal.fire('Lỗi!', 'Không có danh mục nào.', 'error');
      return;
    }
  
    // Tạo HTML cho dropdown từ danh sách categories
    let categoryOptions = this.categories.map(category => {
      return `<option value="${category.category_id}">${category.category_name}</option>`;
    }).join('');
  
    Swal.fire({
      title: 'Nhập thông tin sản phẩm mới',
      html: `
        <div class="form-group mb-3">
          <input id="product_name" class="form-control" placeholder="Tên sản phẩm" required>
        </div>
        <div class="form-group mb-3">
          <input id="description" class="form-control" placeholder="Mô tả sản phẩm" required>
        </div>
        <div class="form-group mb-3">
          <input id="product_detail" class="form-control" placeholder="Chi tiết sản phẩm" required>
        </div>
        <div class="form-group mb-3">
          <input id="price" type="number" class="form-control" placeholder="Giá" required>
        </div>
        <div class="form-group mb-3">
          <input id="discount" type="number" class="form-control" placeholder="Giảm giá" required>
        </div>
        <div class="form-group mb-3">
          <input id="quantity" type="number" class="form-control" placeholder="Số lượng" required>
        </div>
        <div class="form-group mb-3">
          <select id="category_id" class="form-control" required>
            <option value="" disabled selected>Chọn danh mục</option>
            ${categoryOptions}
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="is_actived" class="form-check-label">Kích hoạt sản phẩm</label>
          <input type="checkbox" id="is_actived" class="form-check-input">
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const product_name = (document.getElementById('product_name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
        const product_detail = (document.getElementById('product_detail') as HTMLInputElement).value;
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const discount = parseFloat((document.getElementById('discount') as HTMLInputElement).value);
        const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value, 10);
        const category_id = (document.getElementById('category_id') as HTMLSelectElement).value;
        const is_actived = (document.getElementById('is_actived') as HTMLInputElement).checked;
  
        // Kiểm tra bắt buộc
        if (!product_name) {
          Swal.fire('Lỗi!', 'Tên sản phẩm là bắt buộc.', 'error');
          return null;
        }
        if (!description) {
          Swal.fire('Lỗi!', 'Mô tả sản phẩm là bắt buộc.', 'error');
          return null;
        }
        if (!product_detail) {
          Swal.fire('Lỗi!', 'Chi tiết sản phẩm là bắt buộc.', 'error');
          return null;
        }
        if (isNaN(price) || price <= 0) {
          Swal.fire('Lỗi!', 'Giá sản phẩm là bắt buộc và phải lớn hơn 0.', 'error');
          return null;
        }
        if (isNaN(discount)) {
          Swal.fire('Lỗi!', 'Giảm giá phải là một số hợp lệ.', 'error');
          return null;
        }
        if (isNaN(quantity) || quantity <= 0) {
          Swal.fire('Lỗi!', 'Số lượng sản phẩm là bắt buộc và phải lớn hơn 0.', 'error');
          return null;
        }
        if (!category_id) {
          Swal.fire('Lỗi!', 'Danh mục là bắt buộc.', 'error');
          return null;
        }
        return {
          product_name,
          description,
          product_detail,
          price,
          discount,
          quantity,
          category_id: parseInt(category_id, 10),
          is_actived
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newProduct = result.value;
  
        // Gọi API để thêm sản phẩm
        this.apiService.createProduct(newProduct).subscribe(
          (response) => {
            this.products.push(response);
            Swal.fire('Thêm sản phẩm thành công!', '', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Có lỗi khi thêm sản phẩm:', error);
            Swal.fire('Thêm không thành công', 'Đã xảy ra lỗi khi thêm sản phẩm', 'error');
          }
        );
      } else if (result.isDismissed) {
        Swal.fire('Thêm bị hủy', '', 'info');
      }
    });
  }
  
  

  getCategoryName(categoryId: any): string {
    categoryId = Number(categoryId);
    console.log('Tìm category với ID:', categoryId); 
    const category = this.categories.find(cat => cat.category_id === categoryId);
    if (!category) {
      console.log('Không tìm thấy category với ID:', categoryId);
    }
    return category ? category.category_name : 'Không xác định';
  }
  
  editProduct(productId: number) {
    // Tìm sản phẩm từ danh sách sản phẩm hiện có
    const product = this.products.find(p => p.product_id === productId);
    if (!product) {
      Swal.fire('Lỗi!', 'Sản phẩm không tồn tại.', 'error');
      return;
    }

    // Tạo HTML cho dropdown từ danh sách categories
    let categoryOptions = this.categories.map(category => {
      return `<option value="${category.category_id}" ${category.category_id === product.category_id ? 'selected' : ''}>${category.category_name}</option>`;
    }).join('');

    Swal.fire({
      title: 'Chỉnh sửa thông tin sản phẩm',
      html: `
        <div class="form-group mb-3">
          <input id="product_name" class="form-control" value="${product.product_name}" required>
        </div>
        <div class="form-group mb-3">
          <input id="description" class="form-control" value="${product.description}" required>
        </div>
        <div class="form-group mb-3">
          <input id="product_detail" class="form-control" value="${product.product_detail}" required>
        </div>
        <div class="form-group mb-3">
          <input id="price" type="number" class="form-control" value="${product.price}" required>
        </div>
        <div class="form-group mb-3">
          <input id="discount" type="number" class="form-control" value="${product.discount}" required>
        </div>
        <div class="form-group mb-3">
          <input id="quantity" type="number" class="form-control" value="${product.quantity}" required>
        </div>
        <div class="form-group mb-3">
          <select id="category_id" class="form-control" required>
            <option value="" disabled>Chọn danh mục</option>
            ${categoryOptions}
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="is_actived" class="form-check-label">Kích hoạt sản phẩm</label>
          <input type="checkbox" id="is_actived" class="form-check-input" ${product.is_actived ? 'checked' : ''}>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const product_name = (document.getElementById('product_name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
        const product_detail = (document.getElementById('product_detail') as HTMLInputElement).value;
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const discount = parseFloat((document.getElementById('discount') as HTMLInputElement).value);
        const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value, 10);
        const category_id = (document.getElementById('category_id') as HTMLSelectElement).value;
        const is_actived = (document.getElementById('is_actived') as HTMLInputElement).checked;

        // Kiểm tra bắt buộc
        if (!product_name || !description || !product_detail || isNaN(price) || price <= 0 || isNaN(discount) || isNaN(quantity) || quantity <= 0 || !category_id) {
          Swal.fire('Lỗi!', 'Vui lòng điền đầy đủ thông tin và kiểm tra lại dữ liệu.', 'error');
          return null;
        }
        return {
          product_name,
          description,
          product_detail,
          price,
          discount,
          quantity,
          category_id: parseInt(category_id, 10),
          is_actived
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedProduct = result.value;

        // Gọi API để cập nhật sản phẩm
        this.apiService.updateProduct(
          productId,
          updatedProduct.product_name,
          updatedProduct.description,
          updatedProduct.product_detail,
          updatedProduct.price,
          updatedProduct.discount,
          updatedProduct.quantity,
          updatedProduct.category_id,
          updatedProduct.is_actived
        ).subscribe(
          (response) => {
            const index = this.products.findIndex(p => p.product_id === productId);
            if (index > -1) {
              this.products[index] = response;
            }
            Swal.fire('Sửa sản phẩm thành công!', '', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Có lỗi khi sửa sản phẩm:', error);
            Swal.fire('Sửa không thành công', 'Đã xảy ra lỗi khi sửa sản phẩm', 'error');
          }
        );
      } else if (result.isDismissed) {
        Swal.fire('Sửa bị hủy', '', 'info');
      }
    });
}


  
  
}
