import { Root } from '../definitions';

export interface Order {
  id: number;
  email: string;
  description: string;
  status: "OPEN" | "PAID" | "IN_PROGRESS" | "CANCELED" | "COMPLETE" | "PARTIALLY_CANCELED";
  subTotal: number;
  createDate: Date;
  lastModifiedDate: Date;
}

export type OrdersResponse = Root<Order>

export interface PaymentResponse {
  checkoutUrl: string;
}