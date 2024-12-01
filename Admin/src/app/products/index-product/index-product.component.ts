import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-index-product',
  imports: [CommonModule, RouterModule],
  templateUrl: './index-product.component.html',
  styleUrl: './index-product.component.css'
})
export class IndexProductComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];  
  selectedCategoryId: number | null = null;  

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
  this.apiService.getAllProducts().subscribe((data) => {
    this.products = data;
    console.log('Danh sách sản phẩm:', this.products);
  });

  this.apiService.getAllCategories().subscribe(
    (data) => {
      this.categories = data;
      console.log('Danh sách danh mục:', this.categories);
    },
    (error) => {
      console.error('Có lỗi khi lấy danh mục:', error);
    }
  );
  }

  getCategoryName(categoryId: any): string {
    categoryId = Number(categoryId);
    const category = this.categories.find(cat => cat.category_id === categoryId);
    return category ? category.category_name : 'Không xác định';
  }
   
}
