import { ShoppingItem } from "./shopping";

export interface CartItem {
  cartItemId?: string; // Optional for backward compatibility
  shoppingItem: ShoppingItem;
  quantity: number;
}

export interface ShippingAndTaxValues {
  shippingCost: number; 
  taxAmount: number
}
  