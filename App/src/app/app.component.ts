import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingService } from './loading.service';
import { LoadingComponent } from './loading/loading.component';
import { SnowEffectComponent } from './snow-effect/snow-effect.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, RouterModule, LoadingComponent, SnowEffectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{

  title = 'App';
  constructor(private router: Router, public  loadingService: LoadingService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.setLoading(true);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationError) {
        setTimeout(() => {
          this.loadingService.setLoading(false); 
        }, 700);
      }
    });
  }
  
}

