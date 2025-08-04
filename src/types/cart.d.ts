import { ShoppingItem } from "./shopping";

export interface CartItem {
  shoppingItem: ShoppingItem;
  quantity: number;
}

export interface ShippingAndTaxValues {
  shippingCost: number; 
  taxAmount: number
}
  