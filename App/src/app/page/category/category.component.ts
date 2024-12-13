import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-category',
  imports: [CommonModule, RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{

  categories: any[] = [];
  products: any[] = [];
  categoryId!: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = +params.get('categoryId')!;
      this.loadProducts();
    });

    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    );
  }

  loadProducts(): void {
    this.apiService.getProductsByCategory(this.categoryId).subscribe(
      (response: any) => {
        this.products = response.data;
        console.log('Sản phẩm:', this.products);
      },
      (error) => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}