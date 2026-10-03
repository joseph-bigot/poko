import { Revenue } from './revenue';
import { FixedExpense } from './fixed-expense';
import { Expense } from './expense';
import { SavingGoal } from './saving-goal';

export interface Month {
  id: string;
  year: number;
  month: number;

  revenues: Revenue[];
  fixedExpenses: FixedExpense[];
  expenses: Expense[];
  savings: SavingGoal[];

  createdAt: string;
  updatedAt: string;
}