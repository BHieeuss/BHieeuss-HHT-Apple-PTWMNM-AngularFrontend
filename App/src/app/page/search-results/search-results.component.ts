import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit{

  searchQuery: string = '';
  products: any[] = [];
  categories: any [] = [];
  
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      this.performSearch();
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

 // Thực hiện tìm kiếm với từ khóa
 performSearch(): void {
  if (this.searchQuery.trim()) {
    this.apiService.searchProductsByName(this.searchQuery).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      }
    );
  }
}

scrollToTop(): void {
  window.scrollTo(0, 0);
}
}