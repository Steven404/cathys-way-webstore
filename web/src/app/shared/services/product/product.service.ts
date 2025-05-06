import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
  getCountFromServer,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from '@angular/fire/firestore';

import { throwNewCustomError } from '../../../core/common';
import { ProductDoc } from '../../../core/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  firestore = inject(Firestore);

  async createProduct(newProduct: Omit<ProductDoc, 'id'>) {
    const productsCollection = collection(
      this.firestore,
      'products',
    ) as CollectionReference<ProductDoc>;
    const q = query(productsCollection);
    const querySnapshot = await getDocs(q);
    const allProducts = querySnapshot.docs.map((product) => ({
      ...product.data(),
      id: product.id,
    }));

    allProducts.forEach((product) => {
      if (product.code.toLowerCase() === newProduct.code.toLowerCase()) {
        throwNewCustomError(
          'Product with this code already exists',
          'already-exists',
        );
      }
    });

    await addDoc(productsCollection, newProduct);
  }

  async getAllProducts(
    pageSize = 8,
    pageIndex = 0,
    lastDocsCache: QueryDocumentSnapshot[] = [],
  ): Promise<{
    products: ProductDoc[];
    totalProductsCount: number;
    lastDoc: QueryDocumentSnapshot | null;
  }> {
    const productsCollection = collection(this.firestore, 'products');

    let productsQuery;

    if (pageIndex === 0) {
      productsQuery = query(productsCollection, limit(pageSize));
    } else {
      let tempLastDoc;
      let tempSnapShot;

      // This is for the case that user skips a page (for example from 1 goes to 3)
      while (lastDocsCache.length < pageIndex) {
        productsQuery = query(
          productsCollection,
          startAfter(lastDocsCache[lastDocsCache.length - 1]),
          limit(pageSize),
        );
        tempSnapShot = await getDocs(productsQuery);
        tempLastDoc = tempSnapShot.docs[tempSnapShot.docs.length - 1];
        lastDocsCache.push(tempLastDoc);
      }

      const lastDoc = lastDocsCache[pageIndex - 1];
      productsQuery = query(
        productsCollection,
        startAfter(lastDoc),
        limit(pageSize),
      );
    }

    const snapshot = await getDocs(productsQuery);
    const products: ProductDoc[] = snapshot.docs.map((product) => ({
      ...(product.data() as ProductDoc),
      id: product.id,
    })) as ProductDoc[];

    const countSnapshot = await getCountFromServer(query(productsQuery));
    const total = countSnapshot.data().count;

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

    return { products, totalProductsCount: total, lastDoc };
  }
}
