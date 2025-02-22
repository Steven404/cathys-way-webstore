export interface Category {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    code: string;
    name: string;
    categoryId: number;
    subCategoryId: number;
    dimensions?: string;
    imageFile?: string;
    price: number;
    description?: string;
    colours: string[];
}

export interface ApiResponse {
    status: number;
}