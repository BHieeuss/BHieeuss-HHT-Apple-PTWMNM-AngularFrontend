import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Nhập AuthService

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userRole = this.authService.getUserRole();  
    console.log('User role from RoleGuard:', userRole); 

    if (userRole === 1) {
      return true;  
    }

    this.router.navigate(['/access-denied']);
    return false;
  }
}
