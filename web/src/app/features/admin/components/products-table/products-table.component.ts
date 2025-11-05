import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { Category, ProductDoc, SubCategory } from '../../../../core/types';

@Component({
  selector: 'app-products-table',
  imports: [TableModule, Button, CurrencyPipe, Dialog, Skeleton, NgFor, NgIf],
  templateUrl: './products-table.component.html',
  standalone: true,
  styleUrl: './products-table.component.scss',
})
export class ProductsTableComponent {
  @Input() products: ProductDoc[] = [];
  @Input() totalProducts = 0;
  @Input() categories: Category[] = [];
  @Input() subCategories: SubCategory[] = [];

  @Input() isLoading = false;

  @Output() lazyLoadEmitter = new EventEmitter<TableLazyLoadEvent>();

  isDescriptionDialogVisible = false;

  selectedProductDescriptionDialogHeader = '';
  selectedProductDescription = '';

  getCategoryName(categoryId: string) {
    return this.categories.find((category) => category.id === categoryId).name;
  }

  getSubCategoryName(subCategoryId: string) {
    return this.subCategories.find((category) => category.id === subCategoryId)
      .name;
  }

  showDescriptionDialog(product: ProductDoc) {
    this.selectedProductDescriptionDialogHeader = `${product.code} ${product.name}`;
    this.selectedProductDescription = product.description;
    this.isDescriptionDialogVisible = true;
  }
}
