import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Select, SelectChangeEvent } from 'primeng/select';

import {
  Category,
  Product,
  SortOption,
} from '../../../../../../../commonTypes';
import { removeGreekTonos } from '../../../../shared/common';
import { ApiService } from '../../../../shared/services/api/api.service';
import { ProductCardComponent } from '../../../product/components/product-card/product-card.component';

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ProductCardComponent,
    DropdownModule,
    Select,
    Button,
    NgClass,
  ],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
})
export class CategoryViewComponent implements OnInit {
  id: string;

  category: Category;
  products: Product[] = [];

  totalProductsCount = 0;

  firstProductIndex = 1;

  lastProductIndex = 10;

  offset = 0;

  pages: number[] = [];
  activePage = 1;

  sortOptions: SortOption[] = [
    {
      name: 'Αύξουσα τιμή',
      field: { fieldName: 'price', order: 'asc' },
    },
    {
      name: 'Φθίνουσα τιμή',
      field: { fieldName: 'price', order: 'desc' },
    },
  ];

  selectedSortBy: SortOption | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiService.getCategoryProducts(parseInt(this.id), 0).subscribe({
        next: (v) => {
          this.products = v.products;
          this.totalProductsCount = v.totalCount;
          if (v.totalCount <= 10) {
            this.lastProductIndex = v.totalCount;
          } else {
            [...Array(Math.ceil(v.totalCount / 10)).keys()].forEach((v) =>
              this.pages.push(v + 1),
            );
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

  async sortSelected(event: SelectChangeEvent & { value: SortOption }) {
    this.selectedSortBy = event.value;
    this.apiService
      .getCategoryProducts(parseInt(this.id), 0, event.value)
      .subscribe({
        next: (v) => {
          if (v && v.status === 200 && v.products.length) {
            this.products = v.products;
            this.activePage = 1;
          }
        },
      });
  }

  pageClicked(pageNumber: number) {
    this.activePage = pageNumber;
    this.offset = (pageNumber - 1) * 10;

    this.apiService
      .getCategoryProducts(this.category.id, this.offset, this.selectedSortBy)
      .subscribe((response) => {
        if (response.status === 200) {
          console.log(response.products.length);
          this.products = response.products;
        }
      });
  }

  protected readonly removeGreekTonos = removeGreekTonos;
  protected readonly String = String;
}
