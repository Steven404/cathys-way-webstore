export interface Category {
    id: number;
    name: string;
    description?: string;
    parent_id?: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    status: number;
}