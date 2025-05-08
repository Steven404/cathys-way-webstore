import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Select } from 'primeng/select';

import { SortOption } from '../../../../../../../commonTypes';
import { Category, ProductDoc } from '../../../../core/types';
import { removeGreekTonos } from '../../../../shared/common';
import { ApiService } from '../../../../shared/services/api/api.service';
import { CategoryService } from '../../../../shared/services/category/category.service';
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
  categoryService = inject(CategoryService);

  isLoading = false;

  category: Category;

  products: ProductDoc[] = [];
  totalProductsCount = 0;
  productPageCache: QueryDocumentSnapshot[][] = [];

  firstProductIndex = 1;

  lastProductIndex = 10;

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

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.categoryService.getCategoryById(this.id).subscribe((v) => {
        if (v) {
          this.category = {
            id: this.id,
            ...v,
          } as Category;
        }
      });
      await this.getProductsInit();
      // this.apiService.getCategoryProducts(parseInt(this.id), 0).subscribe({
      //   next: (v) => {
      //     this.products = v.products;
      //     this.totalProductsCount = v.totalCount;
      //     if (v.totalCount <= 10) {
      //       this.lastProductIndex = v.totalCount;
      //     } else {
      //       [...Array(Math.ceil(v.totalCount / 10)).keys()].forEach((v) =>
      //         this.pages.push(v + 1),
      //       );
      //     }
      //   },
      // });
      // this.apiService.getCategory(this.id).subscribe({
      //   next: (v) => {
      //     this.category = v.category;
      //   },
      // });
    }
  }

  async getProductsInit() {
    this.isLoading = true;
    try {
      const retrievedData = await this.categoryService.getCategoryProducts(
        this.id,
        this.productPageCache,
        0,
      );

      this.products = retrievedData.products;
      this.totalProductsCount = retrievedData.total;
      this.productPageCache = retrievedData.newProductsCache;

      if (this.totalProductsCount < 10) {
        this.lastProductIndex = this.totalProductsCount;
      }

      // Calculate pages number
      [...Array(Math.ceil(this.totalProductsCount / 10)).keys()].forEach((v) =>
        this.pages.push(v + 1),
      );
    } catch (e) {
      console.log(e);
    }
  }

  // async sortSelected(event: SelectChangeEvent & { value: SortOption }) {
  //   this.selectedSortBy = event.value;
  //   this.apiService
  //     .getCategoryProducts(parseInt(this.id), 0, event.value)
  //     .subscribe({
  //       next: (v) => {
  //         if (v && v.status === 200 && v.products.length) {
  //           this.products = v.products;
  //           this.activePage = 1;
  //         }
  //       },
  //     });
  // }

  async pageClicked(pageNumber: number) {
    this.activePage = pageNumber;

    const currentPageProductsCache = this.productPageCache[pageNumber - 1];
    if (currentPageProductsCache && currentPageProductsCache.length) {
      this.products = currentPageProductsCache.map(
        (c) => ({ id: c.id, ...c.data() }) as ProductDoc,
      );
    } else {
      try {
        const retrievedData = await this.categoryService.getCategoryProducts(
          this.id,
          this.productPageCache,
          pageNumber - 1,
        );

        this.products = retrievedData.products;
        this.productPageCache = retrievedData.newProductsCache;
        this.totalProductsCount = retrievedData.total;
      } catch (e) {
        console.log(e);
      }
    }
  }

  protected readonly removeGreekTonos = removeGreekTonos;
  protected readonly String = String;
}
