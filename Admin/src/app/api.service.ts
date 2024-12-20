import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'; 

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
    const url = `${this.apiUrl}/category/update/${categoryId}`;
    return this.http.put(url, { category_name: categoryName });
  }

   // Lấy tất cả sản phẩm
   getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/get-all`);
  }

  // Thêm sản phẩm
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product/create`, {
      product_name: product.product_name,
      description: product.description,
      product_detail: product.product_detail,
      price: product.price,
      discount: product.discount,
      quantity: product.quantity,
      category_id: product.category_id,
      is_actived: product.is_actived,
      imageData: product.imageData
    });
  }

 // Lấy sản phẩm theo ID
 getProductById(productId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/product/get-by-id/${productId}`);
}

// Cập nhật sản phẩm
updateProduct(productId: number, product: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/product/update/${productId}`, product);
}


// Lấy tất cả Mã giảm giá
getAllCoupons(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/coupon/get-all`);
}

 // Phương thức tạo coupon
 createCoupon(coupon: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/coupon/create`, coupon);
}

// Lấy thông tin coupon theo ID
getCouponById(couponId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/coupon/get-by-id/${couponId}`);
}

// Cập nhật thông tin coupon
updateCoupon(couponId: number, coupon: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/coupon/update/${couponId}`, coupon);
}

//Đặt hàng
getOrders(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/order/get-all`);
}
}
