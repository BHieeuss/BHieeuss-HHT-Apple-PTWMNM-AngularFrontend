import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule ,MatToolbarModule, MatButtonModule, MatIconModule, 
    MatSidenavModule, MatListModule, MatSidenavModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  isSidebarVisible = true;
  showNav: boolean = true;

  constructor(private router: Router) {}
  ngOnInit() {
    // Kiểm tra đường dẫn hiện tại và ẩn/hiện nav
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/access-denied') {
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
