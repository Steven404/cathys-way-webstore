import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

import { Category, Product } from '../../../../commonTypes';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ApiService } from '../shared/services/api/api.service';

interface SortOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [NgIf, NgForOf, ProductCardComponent, DropdownModule],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
})
export class CategoryViewComponent implements OnInit {
  id: string;

  category: Category;
  products: Product[] = [];

  totalProductsCount = 0;

  firstProductIndex = 1;

  lastProductIndex = 12;

  sortOptions: SortOption[] = [
    {
      name: 'Αύξουσα τιμή',
      code: 'ascendingPrice',
    },
    {
      name: 'Φθίνουσα τιμή',
      code: 'descendingPrice',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiService.getCategoryProducts(this.id).subscribe({
        next: (v) => {
          this.products = v.products;
          this.totalProductsCount = v.totalCount;
          if (v.totalCount < 12) {
            this.lastProductIndex = v.totalCount;
          }
        },
      });
      this.apiService.getCategory(this.id).subscribe({
        next: (v) => {
          this.category = v.category;
        },
      });
    }
  }
}
