import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  Firestore,
  getCountFromServer,
  getDoc,
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
  productsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.productsCollection = collection(
      this.firestore,
      'products',
    ) as CollectionReference<ProductDoc>;
  }

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

    return await addDoc(productsCollection, newProduct);
  }

  async getProduct(id: string) {
    const productDocRef = doc(this.firestore, `products/${id}`);
    return await getDoc(productDocRef);
  }

  async getAllProducts(
    pageSize = 8,
    pageIndex = 0,
    productsCache: QueryDocumentSnapshot[][] = [],
  ) {
    let productsQuery;
    const newProductsCache = productsCache;

    if (pageIndex === 0) {
      console.log('first one');
      productsQuery = query(this.productsCollection, limit(pageSize));
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
            this.productsCollection,
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
        this.productsCollection,
        startAfter(lastDoc),
        limit(10),
      );
    }

    const snapshot = await getDocs(productsQuery);
    const products: ProductDoc[] = snapshot.docs.map((product) => ({
      ...(product.data() as ProductDoc),
      id: product.id,
    })) as ProductDoc[];

    newProductsCache.push(snapshot.docs as QueryDocumentSnapshot[]);

    const countSnapshot = await getCountFromServer(
      query(this.productsCollection),
    );
    const total = countSnapshot.data().count;

    return { products, total, newProductsCache };
  }
}
