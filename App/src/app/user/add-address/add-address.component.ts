import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { isPlatformBrowser } from '@angular/common';  // Thêm import isPlatformBrowser

@Component({
  selector: 'app-add-address',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit {
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  newAddress = {
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: ''
  };

  email: string | null = '';
  userId: number | null = null;

  constructor(private http: HttpClient, private apiService: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.fetchProvinces();

    if (isPlatformBrowser(this.platformId)) {  // Kiểm tra môi trường Browser
      // Lấy email từ localStorage
      this.email = localStorage.getItem('email');

      if (this.email) {
        // Gọi API để lấy thông tin người dùng
        this.apiService.getUserByEmail(this.email).subscribe({
          next: (response: any) => {
            if (response && response.length > 0) {
              // Chỉ lấy user_id
              this.userId = response[0].user_id;
              console.log('User ID:', this.userId);
            } else {
              console.error('Không tìm thấy người dùng với email này');
            }
          },
          error: (err) => {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
          }
        });
      } else {
        console.error('Không tìm thấy email trong localStorage');
      }
    }
  }

  fetchProvinces(): void {
    this.http.get<any[]>('https://provinces.open-api.vn/api/p/')
      .subscribe(provinces => {
        this.provinces = provinces;
        console.log('Provinces:', this.provinces);
      });
  }
  
  fetchDistricts(provinceCode: string): void {
    if (!provinceCode) return;
    this.http.get<any>(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .subscribe(data => {
        this.districts = data.districts;
        this.wards = []; // reset wards khi thay đổi tỉnh
        console.log('Districts:', this.districts);
      });
  }
  
  fetchWards(districtCode: string): void {
    if (!districtCode) return;
    this.http.get<any>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .subscribe(data => {
        this.wards = data.wards;
        console.log('Wards:', this.wards);
      });
  }
  
  addAddress(): void {
    if (!this.userId) {
      alert('Không thể lấy thông tin người dùng.');
      return;
    }

    console.log('Province:', this.newAddress.province);
    console.log('District:', this.newAddress.district);
    console.log('Ward:', this.newAddress.ward);

    if (!this.newAddress.province || !this.newAddress.district || !this.newAddress.ward) {
      alert('Vui lòng chọn đầy đủ thông tin địa chỉ.');
      return;
    }
    console.log('Provinces:', this.provinces);
    console.log('Districts:', this.districts);
    console.log('Wards:', this.wards); 
    
    const province = this.provinces.find(p => String(p.code) === String(this.newAddress.province));
    const district = this.districts.find(d => String(d.code) === String(this.newAddress.district));
    const ward = this.wards.find(w => String(w.code) === String(this.newAddress.ward));
    
    console.log('Province:', province);
    console.log('District:', district);
    console.log('Ward:', ward);
    
    const provinceName = province ? province.name : '';
    const districtName = district ? district.name : '';
    const wardName = ward ? ward.name : '';
    
    console.log('Province Name:', provinceName);
    console.log('District Name:', districtName);
    console.log('Ward Name:', wardName);
    
    const addressData = {
      user_id: this.userId,
      full_name: this.newAddress.fullName,
      tel: this.newAddress.phone,
      address: this.newAddress.address,
      province: provinceName,
      district: districtName,
      ward: wardName,
      is_actived: true
    };

    console.log('Address Data:', addressData); 

    this.http.post('http://localhost:8000/useraddress/create', addressData)
      .subscribe(
        response => {
          alert('Địa chỉ mới đã được thêm thành công!');
        },
        error => {
          console.error('Error adding address:', error);
          alert('Không thể kết nối tới máy chủ hoặc dữ liệu không hợp lệ.');
        }
      );
  }

}