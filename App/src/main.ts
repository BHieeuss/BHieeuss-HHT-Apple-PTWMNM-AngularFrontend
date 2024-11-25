import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { RegisterComponent } from './app/user/register/register.component';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/user/login/login.component';
import { VerifyOtpComponent } from './app/user/verify-otp/verify-otp.component';


const routes: Routes = [
    { path: 'app', component: AppComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'verify-otp', component: VerifyOtpComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideHttpClient(),
    ],
}).catch((err) => console.error(err));
