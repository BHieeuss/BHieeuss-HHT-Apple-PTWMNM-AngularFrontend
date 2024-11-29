import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = {
    username: '',
    phone_number: '',
    date_of_birth: '',
    imageData: '',  
    content: 'string',  
    fileName: ''  
  };
  selectedFile: File | null = null;

  addresses = [
    { label: 'Nhà', address: '123 đường ABC, Hải Phòng' },
    { label: 'Công ty', address: '456 đường XYZ, Hải Phòng' }
  ];

  constructor(private cdr: ChangeDetectorRef, private apiService: ApiService) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    
    if (email) {
      this.getUserInfo(email);  // Gọi API lấy thông tin người dùng từ ApiService
    } else {
      console.log('Không tìm thấy email trong localStorage');
    }
  }
  
  getUserInfo(email: string): void {
    this.apiService.getUserByEmail(email).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.user = response[0];  
          console.log('Dữ liệu người dùng:', this.user);
          this.cdr.detectChanges();
        } else {
          console.log('Không tìm thấy người dùng');
        }
      },
      error: (err) => {
        console.error('Lỗi khi gọi API', err);
      }
    });
  }
 // Hàm để mở SweetAlert2 cho người dùng nhập thông tin
 openUpdateProfileDialog(): void {
  Swal.fire({
    title: 'Cập nhật tài khoản',
    html: `
      <div id="profile-form">
  <form>
    <div class="form-group mb-3">
      <label for="username" class="form-label text-start">Tên người dùng</label>
      <input id="username" class="form-control" placeholder="Tên người dùng" value="${this.user.username}">
    </div>
    
    <div class="form-group mb-3">
      <label for="phone_number">Số điện thoại</label>
      <input id="phone_number" class="form-control" placeholder="Số điện thoại" value="${this.user.phone_number}">
    </div>
    
    <div class="form-group mb-3">
      <label for="date_of_birth">Ngày sinh</label>
      <input id="date_of_birth" class="form-control" type="date" value="${this.user.date_of_birth}">
    </div>
    
    <div class="form-group mb-3">
      <label for="avatar">Ảnh đại diện</label>
      <input type="file" id="avatar" class="form-control-file">
    </div>
  </form>
</div>
    `,
    preConfirm: () => {
      const username = (document.getElementById('username') as HTMLInputElement).value;
      const phone_number = (document.getElementById('phone_number') as HTMLInputElement).value;
      const date_of_birth = (document.getElementById('date_of_birth') as HTMLInputElement).value;
      const fileInput = document.getElementById('avatar') as HTMLInputElement;
      
      if (fileInput && fileInput.files && fileInput.files[0]) {
        this.selectedFile = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.user.imageData = reader.result as string;  
          this.user.fileName = this.selectedFile?.name || '';
          this.user.username = username;
          this.user.phone_number = phone_number;
          this.user.date_of_birth = date_of_birth;
          this.updateProfile();
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.user.username = username;
        this.user.phone_number = phone_number;
        this.user.date_of_birth = date_of_birth;
        this.updateProfile();
      }
    },
    showCancelButton: true,
    cancelButtonText: 'Hủy',
  });
}

updateProfile(): void {
  const userUpdateData = {
    username: this.user.username,
    phone_number: this.user.phone_number,
    date_of_birth: this.user.date_of_birth,
    imageData: this.user.imageData,
    content: this.user.content,
    fileName: this.user.fileName
  };

  this.apiService.updateProfile(26, userUpdateData).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        text: 'Thông tin tài khoản đã được cập nhật.',
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi cập nhật tài khoản.',
      });
    }
  });
}
}