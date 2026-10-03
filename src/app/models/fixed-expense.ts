export interface FixedExpense {
  id: string;
  label: string;
  amount: number;
  categoryId: string;
  dueDay?: number;
  recurring: boolean;
}