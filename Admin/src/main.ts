import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule, Routes, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';  // Sử dụng SweetAlert2Module
import { CategoriesComponent } from './app/categories/categories.component';
import { ProductsComponent } from './app/products/products.component';
import { AccessDeniedComponent } from './app/access-denied/access-denied.component';
import { RoleGuard } from './app/role.guard';
import { HomeComponent } from './app/admin/home/home.component';
import { CreateProductComponent } from './app/products/create-product/create-product.component';
import { IndexProductComponent } from './app/products/index-product/index-product.component';
import { UpdateProductComponent } from './app/products/update-product/update-product.component';
import { IndexCouponComponent } from './app/coupons/index-coupon/index-coupon.component';
import { CreateCouponComponent } from './app/coupons/create-coupon/create-coupon.component';
import { UpdateCouponComponent } from './app/coupons/update-coupon/update-coupon.component';
import { CouponsComponent } from './app/coupons/coupons.component';



registerLocaleData(localeVi, 'vi');

const routes: Routes = [
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: 'home', component: HomeComponent, canActivate: [RoleGuard]},

  {path: 'index-product', component: IndexProductComponent, canActivate: [RoleGuard]},
  { path: 'create-product', component: CreateProductComponent, canActivate: [RoleGuard]},
  { path: 'update-product/:id', component: UpdateProductComponent, canActivate: [RoleGuard]},

  // Sản phẩm
  { path: 'products', component: ProductsComponent, children: [
    { path: '', redirectTo: 'index-product', pathMatch: 'full' },
    { path: 'create-product', component: CreateProductComponent },
    { path: 'index-product', component: IndexProductComponent },
    { path: 'update-product/:id', component: UpdateProductComponent},
  ]},

  // Mã giảm giá
  { path: 'index-coupon', component: IndexCouponComponent, canActivate: [RoleGuard]},
  { path: 'create-coupon', component: CreateCouponComponent, canActivate: [RoleGuard]},
  { path: 'update-coupon/:id', component: UpdateCouponComponent, canActivate: [RoleGuard]},

  { path: 'coupons', component: CouponsComponent, children: [
    { path: '', redirectTo: 'index-coupon', pathMatch: 'full' },
    { path: 'index-coupon', component: IndexCouponComponent },
    { path: 'create-coupon', component: CreateCouponComponent },
    { path: 'update-coupon/:id', component: UpdateCouponComponent},
  ]},


  {path: 'categories', component: CategoriesComponent, canActivate: [RoleGuard]},
  { path: 'home', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', redirectTo: '/access-denied' }
];


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    provideRouter(routes, withHashLocation()), provideAnimations(),
    importProvidersFrom(SweetAlert2Module.forRoot())
  ]
}).catch(err => console.error(err));
