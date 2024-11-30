import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule, BrowserModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{
  base64Image: string = '';
  addProductForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      product_name: ['', Validators.required],
      description: ['', Validators.required],
      product_color: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      category_id: ['', Validators.required],
      is_actived: [false],
      imageData: ['']
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.base64Image = reader.result as string;
      this.addProductForm.patchValue({
        imageData: this.base64Image
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value;
      this.apiService.createProduct(productData).subscribe(
        (response) => {
          alert('Sản phẩm đã được thêm thành công!');
          this.router.navigate(['/products']);
        },
        (error) => {
          console.error('Lỗi khi thêm sản phẩm:', error);
        }
      );
    }
  }
}
