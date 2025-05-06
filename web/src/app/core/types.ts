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
}
