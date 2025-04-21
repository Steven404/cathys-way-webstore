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
export class CategoryService {
  firestore = inject(Firestore);

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

    const newSubCategoryObject: SubCategory = {
      name: name,
      description: description,
      id: (allSubCategories.length + 1).toString(),
    };
    await addDoc(subCategoriesCollection, newSubCategoryObject);
  }
}
