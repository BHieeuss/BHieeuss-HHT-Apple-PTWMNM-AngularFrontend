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
import { AdminComponent } from './app/admin/admin.component';
import { HomeComponent } from './app/admin/home/home.component';



registerLocaleData(localeVi, 'vi');

const routes: Routes = [
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: 'home', component: HomeComponent, canActivate: [RoleGuard]},
  {path: 'products', component: ProductsComponent, canActivate: [RoleGuard]},
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
