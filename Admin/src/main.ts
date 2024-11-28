import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule, Routes, withHashLocation } from '@angular/router';
import { CategoriesIndexComponent } from './app/categories/categories-index/categories-index.component';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';  // Sử dụng SweetAlert2Module



registerLocaleData(localeVi, 'vi');

const routes: Routes = [
  {path: 'categories-index', component: CategoriesIndexComponent},
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
];


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    provideRouter(routes, withHashLocation()), provideAnimations(),
    importProvidersFrom(SweetAlert2Module.forRoot())
  ]
}).catch(err => console.error(err));
