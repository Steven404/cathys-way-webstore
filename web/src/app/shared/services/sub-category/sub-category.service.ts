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
import { SubCategory } from '../../../core/types';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  firestore = inject(Firestore);

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
}
