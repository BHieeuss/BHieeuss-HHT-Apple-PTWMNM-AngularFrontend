import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-index',
  imports: [CommonModule],
  templateUrl: './categories-index.component.html',
  styleUrls: ['./categories-index.component.css']
})

export class CategoriesIndexComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: ApiService) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }

   // Thêm danh mục mới
   addCategory() {
    Swal.fire({
      title: 'Nhập tên danh mục mới',
      input: 'text',
      inputPlaceholder: 'Nhập tên danh mục',
      showCancelButton: true,
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn phải nhập tên danh mục';
        }
        return null;
      }      
    }).then((result) => {
      if (result.isConfirmed) {
        const newCategoryName = result.value;
        
        this.categoryService.createCategory(newCategoryName).subscribe(
          (response) => {           
            this.categories.push(response); 
            Swal.fire('Thêm danh mục thành công!', '', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          (error) => {
            console.error('Có lỗi khi thêm danh mục:', error);
            Swal.fire('Thêm không thành công', 'Đã xảy ra lỗi khi thêm danh mục', 'error');
          }
        );
      } else {
        Swal.fire('Thêm bị hủy', '', 'info');
      }
    });
  }
//  Sửa danh mục
  editCategory(category: any) {
  Swal.fire({
    title: 'Nhập tên mới cho danh mục',
    input: 'text',
    inputValue: category.category_name, 
    showCancelButton: true,
    confirmButtonText: 'Cập nhật',
    cancelButtonText: 'Hủy',
    inputValidator: (value) => {
      if (!value) {
        return 'Bạn phải nhập tên danh mục'; 
      }
      return null; 
    }
  }).then((result) => {
    if (result.isConfirmed && result.value !== category.category_name) {
      // Gọi API cập nhật danh mục
      this.categoryService.updateCategory(category.category_id, result.value).subscribe(
        (response) => {
          // Cập nhật tên danh mục sau khi API trả về kết quả
          category.category_name = result.value;
          Swal.fire('Cập nhật thành công!', '', 'success');
        },
        (error) => {
          console.error('Có lỗi khi cập nhật danh mục:', error);
          Swal.fire('Cập nhật không thành công', 'Đã xảy ra lỗi khi cập nhật danh mục', 'error');
        }
      );
    } else {
      Swal.fire('Cập nhật bị hủy', '', 'info');
    }
  });
}
}