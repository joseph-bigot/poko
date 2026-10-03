import { Injectable } from '@angular/core';
import { Month } from '../models/month';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  calculateTotalRevenues(month: Month): number {
    return month.revenues.reduce(
      (total, revenue) => total + revenue.amount,
      0
    );
  }

  calculateTotalFixedExpenses(month: Month): number {
    return month.fixedExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  calculateTotalExpenses(month: Month): number {
    return month.expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  calculateTotalSavings(month: Month): number {
    return month.savings.reduce(
      (total, saving) => total + saving.currentAmount,
      0
    );
  }

  calculateAvailableAmount(month: Month): number {
    const revenues = this.calculateTotalRevenues(month);
    const fixedExpenses = this.calculateTotalFixedExpenses(month);
    const expenses = this.calculateTotalExpenses(month);
    const savings = this.calculateTotalSavings(month);

    return revenues - fixedExpenses - expenses - savings;
  }
}