import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  email: string = 'hhtapple@gmail.com';

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
