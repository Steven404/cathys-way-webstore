import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

import {
  ApiResponse,
  Category,
  Product,
  SortOption,
} from '../../../../../../commonTypes';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../common';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<ApiResponse & { categories: Category[] }> {
    return this.http
      .get<
        ApiResponse & { categories: Category[] }
      >(this.api + '/categories/getAll')
      .pipe(catchError(handleError));
  }

  getCategory(id: string): Observable<ApiResponse & { category: Category }> {
    return this.http
      .get<
        ApiResponse & { category: Category }
      >(this.api + '/categories/get?categoryId=' + id)
      .pipe(catchError(handleError));
  }

  getCategoryProducts(
    categoryId: number,
    offset: number,
    sort?: SortOption,
  ): Observable<ApiResponse & { products: Product[]; totalCount: number }> {
    let url =
      this.api + `/products/category?categoryId=${categoryId}&offset=${offset}`;
    if (sort) {
      url = url + `&sort=${JSON.stringify(sort.field)}`;
    }
    return this.http
      .get<ApiResponse & { products: Product[]; totalCount: number }>(url)
      .pipe(catchError(handleError));
  }

  getProduct(
    productId: number,
  ): Observable<ApiResponse & { product: Product }> {
    return this.http
      .get<
        ApiResponse & { product: Product }
      >(this.api + '/products/?id=' + productId)
      .pipe(catchError(handleError));
  }
}
