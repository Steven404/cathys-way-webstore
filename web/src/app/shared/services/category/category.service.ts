import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
  getDocs,
  query,
} from '@angular/fire/firestore';

import { throwNewCustomError } from '../../../core/common';
import { Category, SubCategory } from '../../../core/types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  firestore = inject(Firestore);

  async getCategories(): Promise<Category[]> {
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

  async getSubCategories() {
    const subCategoriesCollection = collection(
      this.firestore,
      'subcategories',
    ) as CollectionReference<SubCategory>;
    const q = query(subCategoriesCollection);
    const subCategoryDocs = await getDocs(q);

    const result = [];

    subCategoryDocs.forEach((subCategDoc) =>
      result.push({ ...subCategDoc.data(), id: subCategDoc.id }),
    );

    return result;
  }

  async createSubcategory(name: string, description: string) {
    const subCategoriesCollection = collection(
      this.firestore,
      'subcategories',
    ) as CollectionReference<SubCategory>;
    const q = query(subCategoriesCollection);
    const querySnapshot = await getDocs(q);
    const allSubCategories = [];

    querySnapshot.forEach((doc) => allSubCategories.push(doc.data()));

    allSubCategories.forEach((subcategory) => {
      if (subcategory.name.toLowerCase() === name.toLowerCase()) {
        throwNewCustomError(
          'Subcategory with this name already exists',
          'already-exists',
        );
      }
    });

    const newSubCategoryObject: Omit<SubCategory, 'id'> = {
      name: name,
      description: description,
    };
    await addDoc(subCategoriesCollection, newSubCategoryObject);
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
