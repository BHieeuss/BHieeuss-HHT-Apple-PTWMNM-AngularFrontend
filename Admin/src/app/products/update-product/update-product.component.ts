import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {
  productId: number = 0;
  product = {
    product_name: '',
    description: '',
    product_detail: '',
    price: 0,
    discount: 0,
    quantity: 0,
    category_id: '',
    is_actived: 1, 
    imageData: ''
  };
  
  categories: any[] = [];

  constructor(
    private apiService: ApiService, private route: ActivatedRoute, private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    
    this.apiService.getProductById(this.productId).subscribe(
      (product) => {
        this.product = product;
      },
      (error) => {
        console.error('Không thể lấy thông tin sản phẩm:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin sản phẩm.',
          confirmButtonText: 'Đóng'
        });
      }
    );

    this.apiService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Có lỗi khi lấy danh mục:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải danh mục sản phẩm.',
          confirmButtonText: 'Đóng'
        });
      }
    );
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  private convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.product.imageData = reader.result as string;
    };
  }

  onSubmit(): void {
    if (this.product.product_name && this.product.price >= 0 && this.product.quantity >= 0 && this.product.category_id) {
      this.product.is_actived = this.product.is_actived ? 1 : 0;

      this.apiService.updateProduct(this.productId, this.product).subscribe(
        (response) => {
          console.log('Sản phẩm đã được cập nhật thành công', response);
          Swal.fire({
            icon: 'success',
            title: 'Sản phẩm đã được sửa thành công!',
            showConfirmButton: true,
            confirmButtonText: 'Đóng',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/products']);
            }
          });
        },
        (error) => {
          console.error('Có lỗi khi cập nhật sản phẩm:', error);
          Swal.fire({
            icon: 'error',
            title: 'Có lỗi xảy ra!',
            text: 'Không thể cập nhật sản phẩm, vui lòng thử lại.',
            confirmButtonText: 'Đóng'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng điền đầy đủ thông tin!',
        text: 'Tất cả các trường bắt buộc phải được điền.',
        confirmButtonText: 'Đóng'
      });
    }
  }
}