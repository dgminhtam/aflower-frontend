import { Category } from "../categories/definitions";
import { Root } from "../definitions";
import { Media } from "../media/definitions";

export const STATUS_VALUES = ["PUBLISHED", "DRAFT"] as const;
export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originPrice: number;
  categories: Category[];
  image: Media;
  status: typeof STATUS_VALUES[number];
  gallery: Media[];
  alternativeProducts?: Product[];
}

export type ProductResponse = Root<Product>;

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  originPrice: number;
  status: string;
  categoryIds: number[];
  imageId: number | null;
  gallery: number[];
}

export interface ChangeStatusRequest {
  status: string;
}