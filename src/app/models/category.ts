export interface Category {
  id: string;
  name: string;
  type: 'income' | 'fixed-expense' | 'expense';
}