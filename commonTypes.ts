export interface Category {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
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

export interface SortOption {
    name: string;
    field: { fieldName: 'price'; order: 'asc' | 'desc' };
}

export type OrderStatus = 'pending' | 'paid';
export type PaymentMethod = 'card' | 'iris' | 'bank_transfer';

export interface Order {
    id: string;
    stripe_session_id: string;
    status: OrderStatus;
    products: string[];
    payment_method: PaymentMethod;
    order_number: string;
    amount: number;
    hasSendEmail: boolean;
    email: string;
    selectedColours: { productId: string; colour: string }[];
    createdAt: any; // Firestore Timestamp
}
