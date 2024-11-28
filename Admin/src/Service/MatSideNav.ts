import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  private sidenav: MatSidenav | undefined;

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  toggle(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
