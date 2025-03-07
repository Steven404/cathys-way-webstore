import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { Select, SelectChangeEvent } from 'primeng/select';
import { firstValueFrom } from 'rxjs';

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
  imports: [NgIf, NgForOf, ProductCardComponent, DropdownModule, Select],
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
      field: { fieldName: 'price', order: 'asc' },
    },
    {
      name: 'Φθίνουσα τιμή',
      field: { fieldName: 'price', order: 'desc' },
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiService.getCategoryProducts(parseInt(this.id)).subscribe({
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

  async sortSelected(event: SelectChangeEvent & { value: SortOption }) {
    const response = await firstValueFrom(
      this.apiService.getCategoryProducts(parseInt(this.id), event.value),
    );

    if (response && response.status === 200 && response.products.length) {
      this.products = response.products;
      console.log(this.products);
    }
  }

  protected readonly removeGreekTonos = removeGreekTonos;
}
