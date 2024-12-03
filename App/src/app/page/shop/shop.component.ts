import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit{

  products: any [] = [];
  categories: any [] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getProducts().subscribe(
      (data) => {
        this.products = data; 
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    );
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    );
  }

  
}
