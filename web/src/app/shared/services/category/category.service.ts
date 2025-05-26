import { Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  docData,
  Firestore,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  startAfter,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { throwNewCustomError } from '../../../core/common';
import { Category, ProductDoc } from '../../../core/types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoriesSignal = signal<Category[]>([]);

  constructor(private firestore: Firestore) {}

  getCategoryById(id: string) {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return docData(categoryDoc) as Observable<Category>;
  }

  async fetchCategories() {
    console.log('trying');
    try {
      const categories = await this.getCategories();
      this.categoriesSignal.set(categories);
    } catch (e) {
      console.log(e);
    }
  }

  async getCategories(): Promise<Category[]> {
    console.log('getting cats...');
    const categoriesCollection = collection(
      this.firestore,
      'categories',
    ) as CollectionReference<Category>;
    const q = query(categoriesCollection);

    const categoryDocs = await getDocs(q);

    return categoryDocs.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  async getCategoryProducts(
    categoryId: string,
    productsCache: QueryDocumentSnapshot[][],
    pageIndex = 0,
    orderByPrice?: 'asc' | 'desc',
  ) {
    const productsCollection = collection(this.firestore, 'products');
    let productsQuery;
    const newProductsCache = productsCache;

    const filters: (QueryFieldFilterConstraint | QueryOrderByConstraint)[] = [
      where('categoryId', '==', categoryId),
    ];

    if (orderByPrice) {
      filters.push(orderBy('price', orderByPrice));
    }

    if (pageIndex === 0) {
      productsQuery = query(productsCollection, ...filters, limit(10));
    } else {
      const queryRequiredProductCache = newProductsCache[pageIndex - 1];

      let lastDoc;

      if (!queryRequiredProductCache) {
        let tempSnapshot;
        while (pageIndex + 1 > newProductsCache.length) {
          const lastAvailableCachePage =
            newProductsCache[newProductsCache.length - 1];

          lastDoc = lastAvailableCachePage[lastAvailableCachePage.length - 1];

          productsQuery = query(
            productsCollection,
            ...filters,
            startAfter(lastDoc),
            limit(10),
          );

          tempSnapshot = await getDocs(productsQuery);
          newProductsCache.push(tempSnapshot.docs);
        }
      } else {
        lastDoc =
          queryRequiredProductCache[queryRequiredProductCache.length - 1];
      }

      productsQuery = query(
        productsCollection,
        ...filters,
        startAfter(lastDoc),
        limit(10),
      );
    }

    const snapshot = await getDocs(productsQuery);
    const products = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as ProductDoc),
    })) as ProductDoc[];

    newProductsCache.push(snapshot.docs as QueryDocumentSnapshot[]);

    const countSnapshot = await getCountFromServer(
      query(productsCollection, ...filters),
    );
    const total = countSnapshot.data().count;

    return { products, total, newProductsCache };
  }

  async createCategory(name: string, description: string) {
    const categoriesCollection = collection(
      this.firestore,
      'categories',
    ) as CollectionReference<Category>;
    const q = query(categoriesCollection);
    const querySnapshot = await getDocs(q);

    const allCategories = [];

    querySnapshot.forEach((doc) => allCategories.push(doc.data()));
    allCategories.forEach((categ) => {
      if (categ.name.toLowerCase() === name.toLowerCase()) {
        throwNewCustomError(
          'Category with this name already exists',
          'already-exists',
        );
      }
    });

    const newCategoryObject: Omit<Category, 'id'> = {
      name: name,
      description: description,
    };

    await addDoc(categoriesCollection, newCategoryObject);
  }
}
