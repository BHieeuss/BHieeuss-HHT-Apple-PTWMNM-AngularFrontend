import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{
  newProduct = {
    product_name: '',
    description: '',
    product_color: '',
    price: 0,
    discount: 0,
    quantity: 0,
    category_id: '',
    is_actived: true,
    imageData: ''
  };
  
  categories: any[] = [];

  constructor(private apiService: ApiService, private router: Router,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.apiService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.cdr.detectChanges(); 
    }, error => {
      console.error('Có lỗi khi lấy danh mục:', error);
    });
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
      this.newProduct.imageData = reader.result as string;
    };
  }
  
  onSubmit(): void {
    if (this.newProduct.imageData) {
      this.apiService.createProduct(this.newProduct).subscribe(response => {
        console.log('Sản phẩm đã được thêm thành công', response);
  
        Swal.fire({
          icon: 'success',
          title: 'Sản phẩm đã được thêm thành công!',
          text: 'Nhấn nút đóng để trở về trang sản phẩm.',
          showConfirmButton: true,
          confirmButtonText: 'Đóng',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/products']);
          }
        });
      }, error => {
        console.error('Có lỗi khi thêm sản phẩm:', error);
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Không thể thêm sản phẩm, vui lòng thử lại.',
          confirmButtonText: 'Đóng'
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn ảnh!',
        text: 'Vui lòng chọn ảnh sản phẩm.',
        confirmButtonText: 'Đóng'
      });
    }
  }
  
}