import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  categories: any[] = [];

  constructor(private modalService: NgbModal, private categoryService: ApiService) {} 

  open(content: any) {
    this.modalService.open(content);
  }
    ngOnInit() {
      this.categoryService.getCategories().subscribe((data) => {
        this.categories = data;
      });
    }
}
