import { StorageReference, UploadTask } from '@angular/fire/storage';

export interface StoreType {
  shoppingCart: CartProduct[];
}

export interface CustomError {
  message: string;
  code: string;
}

export interface ProductColour {
  name: string;
  hexCode: string;
}

export interface SubCategory {
  name: string;
  id: string;
  description: string;
}

export interface Category {
  name: string;
  id: string;
  description: string;
  image?: string;
}

export interface ProductDoc {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  description: string;
  price: number;
  colours: ProductColour[];
  mainImageUrl?: string;
  extraImageUrls?: string[];
}

export interface CustomUploadTask {
  ref: StorageReference;
  uploadTask: UploadTask;
}

export type CartProduct = Omit<
  ProductDoc,
  'colours' | 'extraImageUrls' | 'description' | ''
> & { selectedColour?: string; quantity: number };
