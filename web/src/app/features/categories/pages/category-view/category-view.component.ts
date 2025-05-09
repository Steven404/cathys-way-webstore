import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Select, SelectChangeEvent } from 'primeng/select';

import { SortOption } from '../../../../../../../commonTypes';
import { Category, ProductDoc } from '../../../../core/types';
import { removeGreekTonos } from '../../../../shared/common';
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
  animations: [
    trigger('fadeInFadeOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
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

  sortOptions = [
    {
      name: 'Αύξουσα τιμή',
      value: 'asc',
    },
    {
      name: 'Φθίνουσα τιμή',
      value: 'desc',
    },
  ];

  priceOrderBy: 'asc' | 'desc' | null = null;

  constructor(private activatedRoute: ActivatedRoute) {}

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      try {
        this.categoryService.getCategoryById(this.id).subscribe((v) => {
          if (v) {
            this.category = {
              id: this.id,
              ...v,
            } as Category;
          }
        });
        await this.getProductsInit();
      } catch (e) {
        console.log(e);
      }
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

  async sortSelected(event: SelectChangeEvent & { value: SortOption }) {
    this.priceOrderBy = event.value;
    this.products = [];

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    try {
      const retrievedData = await this.categoryService.getCategoryProducts(
        this.id,
        this.productPageCache,
        0,
        this.priceOrderBy,
      );

      this.products = retrievedData.products;
    } catch (e) {
      console.log(e);
    }
  }

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
          this.priceOrderBy,
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
