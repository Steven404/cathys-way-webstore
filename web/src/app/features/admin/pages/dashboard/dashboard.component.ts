import { Component, inject, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import {
  Category,
  CustomError,
  ProductColour,
  ProductDoc,
  SubCategory,
} from '../../../../core/types';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { ProductService } from '../../../../shared/services/product/product.service';
import { SubCategoryService } from '../../../../shared/services/sub-category/sub-category.service';
import { ImageService } from '../../../shared/services/image.service';
import { CreateCategoryDialogComponent } from '../../components/create-category-dialog/create-category-dialog.component';
import { CreateProductDialogComponent } from '../../components/create-product-dialog/create-product-dialog.component';
import { CreateSubcategoryDialogComponent } from '../../components/create-subcategory-dialog/create-subcategory-dialog.component';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { newProductFormGroup } from '../../constants';

@Component({
  selector: 'app-dashboard',
  imports: [
    ToolbarComponent,
    CreateSubcategoryDialogComponent,
    CreateCategoryDialogComponent,
    CreateProductDialogComponent,
    ProductsTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  categoryService = inject(CategoryService);
  subCategoryService = inject(SubCategoryService);
  productService = inject(ProductService);
  imageService = inject(ImageService);

  mainImage: File;
  extraImages: File[] = [];

  isLoading = false;

  isProductDialogVisible = false;
  isCategoryDialogVisible = false;
  isSubCategoryDialogVisible = false;

  products: ProductDoc[] = [];
  totalProductsCount = 0;
  lastProductsCache: QueryDocumentSnapshot[] = [];

  productForm = newProductFormGroup;
  newProductColours: ProductColour[] = [];
  subCategoryFormControl = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });
  categoryFormControl = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });

  allCategories: Category[] = [];
  allSubCategories: SubCategory[] = [];

  constructor(private messageService: MessageService) {}

  async ngOnInit() {
    this.allCategories = await this.categoryService.getCategories();
    this.allSubCategories = await this.subCategoryService.getSubCategories();
    await this.getProducts();
    if (typeof window !== 'undefined') {
      document.getElementById('appHeader').style.display = 'none';
    }
  }

  async getProducts() {
    this.isLoading = true;
    const retrievedData = await this.productService.getAllProducts();
    this.products = retrievedData.products;
    this.totalProductsCount = retrievedData.totalProductsCount;
    if (retrievedData.lastDoc) {
      this.lastProductsCache = [retrievedData.lastDoc];
    }
    this.isLoading = false;
  }

  async createProduct() {
    this.isLoading = true;
    const newProductValues = this.productForm.value;

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const newProduct: Omit<ProductDoc, 'id'> = {
      name: newProductValues.name.trim(),
      code: newProductValues.code.trim(),
      description: newProductValues.description.trim(),
      price: newProductValues.price,
      categoryId: newProductValues.category.id,
      subCategoryId: newProductValues.subCategory.id,
      colours: this.newProductColours,
    };

    try {
      const productDoc = await this.productService.createProduct(newProduct);
      const productDocId = productDoc.id;

      await this.imageService.uploadImagesAndGetUrls(
        productDocId,
        this.mainImage,
        this.extraImages,
      );

      this.messageService.add({
        key: 'global-toast',
        severity: 'success',
        summary: 'Επιτυχία',
        detail: `Η καταχώριση του προϊόντος με κωδικό "${newProduct.code}" πραγματοποιήθηκε με επιτυχία`,
        life: 4000,
      });

      this.mainImage = undefined;
      this.extraImages = [];

      this.isProductDialogVisible = false;
      this.productForm.reset();
      await this.getProducts();
    } catch (e) {
      const error = e as CustomError;
      if (error?.code && error.code === 'already-exists') {
        this.messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Σφάλμα',
          detail: `Υπάρχει ήδη προϊόν με κωδικό "${newProduct.code}"`,
          life: 4000,
        });
      }
    }
    this.isLoading = false;
  }

  async createCategory() {
    const categoryName = this.categoryFormControl.value.trim();
    this.isLoading = true;
    try {
      await this.categoryService.createCategory(categoryName, '');
      this.messageService.add({
        key: 'global-toast',
        severity: 'success',
        summary: 'Επιτυχία',
        detail: `Η καταχώριση της κατηγορίας "${categoryName}" πραγματοποιήθηκε με επιτυχία`,
        life: 5000,
      });
      this.isCategoryDialogVisible = false;
      this.categoryFormControl.reset();
    } catch (e) {
      const error = e as CustomError;
      if (error?.code && error.code === 'already-exists') {
        this.messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Σφάλμα',
          detail: `Υπάρχει ήδη κατηγορία με ονομασία "${categoryName}"`,
          life: 5000,
        });
      }
    }
    this.isLoading = false;
  }

  async createSubCategory() {
    const subCategoryName = this.subCategoryFormControl.value.trim();
    this.isLoading = true;
    try {
      await this.subCategoryService.createSubcategory(subCategoryName, '');
      this.messageService.add({
        key: 'global-toast',
        severity: 'success',
        summary: 'Επιτυχία',
        detail: `Η καταχώριση της υποκατηγορίας "${subCategoryName}" πραγματοποιήθηκε με επιτυχία`,
        life: 4000,
      });
      this.isSubCategoryDialogVisible = false;
      this.subCategoryFormControl.reset();
    } catch (e) {
      const error = e as CustomError;
      if (error?.code && error.code === 'already-exists') {
        this.messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Σφάλμα',
          detail: `Υπάρχει ήδη υποκατηγορία με ονομασία "${subCategoryName}"`,
          life: 4000,
        });
      }
    }
    this.isLoading = false;
  }
}
