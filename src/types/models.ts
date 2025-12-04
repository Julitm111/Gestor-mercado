export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Store {
  id: string;
  name: string;
  location?: string;
}

export interface Item {
  id: string;
  name: string;
  defaultCategoryId: string;
  defaultStoreId?: string;
  unit?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  budget?: number;
}

export interface ShoppingListItem {
  id: string;
  listId: string;
  itemId?: string;
  name: string;
  categoryId: string;
  storeId?: string;
  quantity: number;
  unit?: string;
  estimatedPrice?: number;
  isChecked: boolean;
}
