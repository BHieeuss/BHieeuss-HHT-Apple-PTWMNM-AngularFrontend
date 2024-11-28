import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000';  // Base URL chung cho toàn bộ API

  constructor(private http: HttpClient) {}

  // Lấy tất cả danh mục
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/get-all`); 
  }

   // Thêm danh mục mới
   createCategory(categoryName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/category/create`, { category_name: categoryName });
  }

  // Cập nhật danh mục
  updateCategory(categoryId: number, categoryName: string): Observable<any> {
    const url = `${this.apiUrl}/category/update/${categoryId}`;  // Endpoint cho "update"
    return this.http.put(url, { category_name: categoryName });
  }
}
