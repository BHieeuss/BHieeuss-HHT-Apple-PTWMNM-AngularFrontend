import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { RegisterComponent } from './app/user/register/register.component';
import { LoginComponent } from './app/user/login/login.component';
import { VerifyOtpComponent } from './app/user/verify-otp/verify-otp.component';
import { HomeComponent } from './app/home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfileComponent } from './app/user/profile/profile.component';
import { ChangepasswordComponent } from './app/user/changepassword/changepassword.component';
import { AboutComponent } from './app/about/about.component';
import { ShopComponent } from './app/page/shop/shop.component';
import { ShopSingleComponent } from './app/page/shop-single/shop-single.component';
import { AddAddressComponent } from './app/user/add-address/add-address.component';


const routes: Routes = [
    { path: 'app', component: AppComponent},
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent, data: { breadcrumb: 'Đăng ký' } },
    { path: 'login', component: LoginComponent, data: { breadcrumb: 'Đăng nhập' } },
    { path: 'about', component: AboutComponent, data: { breadcrumb: 'Về chúng tôi' } },
    { path: 'verify-otp', component: VerifyOtpComponent, data: { breadcrumb: 'Xác thực' } },
    { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Trang cá nhân' } },
    { path: 'profile/add-address', component: AddAddressComponent, data: { breadcrumb: 'Thêm địa chỉ' } },
    { path: 'changepass', component: ChangepasswordComponent, data: { breadcrumb: 'Quên mật khẩu' } },
    { path: 'shop', component: ShopComponent, data: { breadcrumb: 'Sản phẩm' } },
    { path: 'product/:id', component: ShopSingleComponent, data: { breadcrumb: 'Sản phẩm' } },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideHttpClient(), provideAnimationsAsync(),
    ],
}).catch((err) => console.error(err));
