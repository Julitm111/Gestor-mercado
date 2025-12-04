export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  defaultStore: string;
  estimatedPrice: number;
}

export interface ListItem {
  id: string;
  productId?: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  store: string;
  estimatedPrice: number;
  subtotal: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  budget: number;
  items: ListItem[];
  estimatedTotal: number;
}

export interface Store {
  id: string;
  name: string;
}
