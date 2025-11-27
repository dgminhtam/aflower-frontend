export interface ProductCollection {
    id: number;
    name: string;
    slug: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    isFeatured: boolean;
    imageId?: number;
    image?: {
        id: number;
        url: string;
        caption?: string;
    };
    status: 'ACTIVE' | 'INACTIVE';
    createdDate?: string;
    lastModifiedDate?: string;
}

export interface ProductCollectionResponse {
    content: ProductCollection[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface ProductCollectionDetailResponse extends ProductCollection {
    products: any[]; // TODO: Replace with Product type when available
}

export interface CreateProductCollectionRequest {
    name: string;
    slug?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    isFeatured?: boolean;
    imageId?: number;
    status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateProductCollectionRequest extends CreateProductCollectionRequest { }
