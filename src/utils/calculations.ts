import { Category, ShoppingListItem } from '../types/models';

export const getListEstimatedTotal = (listItems: ShoppingListItem[]): number => {
  return listItems.reduce((sum, item) => {
    const price = item.estimatedPrice ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);
};

export const getListProgressPercentage = (listItems: ShoppingListItem[], budget?: number): number => {
  if (!budget || budget <= 0) return 0;
  const total = getListEstimatedTotal(listItems);
  return Math.min(Math.round((total / budget) * 100), 200); // se limita a 200% para evitar barras infinitas
};

export const getCategoryTotals = (
  listItems: ShoppingListItem[],
  categories: Category[],
): { categoryId: string; total: number }[] => {
  return categories.map((category) => {
    const itemsForCategory = listItems.filter((item) => item.categoryId === category.id);
    return {
      categoryId: category.id,
      total: getListEstimatedTotal(itemsForCategory),
    };
  });
};
