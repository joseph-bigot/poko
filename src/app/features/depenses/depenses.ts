import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Expense } from '../../models/expense';
import { Month } from '../../models/month';
import { MonthService } from '../../services/month';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-depenses',
  imports: [CommonModule, FormsModule],
  templateUrl: './depenses.html',
  styleUrl: './depenses.scss',
})
export class Depenses implements OnInit {
  currentMonth: Month | null = null;

  label = '';
  amount: number | null = null;
  categoryId = 'courses';
  date = '';

  editingExpenseId: string | null = null;

  categories = [
    { id: 'courses', name: 'Courses' },
    { id: 'transport', name: 'Transport' },
    { id: 'loisirs', name: 'Loisirs' },
    { id: 'vetements', name: 'Vêtements' },
    { id: 'sante', name: 'Santé' },
    { id: 'maison', name: 'Maison' },
    { id: 'autres', name: 'Autres' },
  ];

  constructor(
    private monthService: MonthService,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentMonth =
      await this.monthService.getOrCreateCurrentMonth();

    this.date =
      new Date().toISOString().split('T')[0];

    this.changeDetectorRef.detectChanges();
  }

  async addExpense(): Promise<void> {
    if (!this.currentMonth) {
      return;
    }

    if (
      !this.label.trim() ||
      this.amount === null ||
      this.amount <= 0
    ) {
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      label: this.label.trim(),
      amount: this.amount,
      categoryId: this.categoryId,
      date: this.date,
    };

    this.currentMonth.expenses.push(expense);

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  editExpense(expense: Expense): void {
    this.editingExpenseId = expense.id;

    this.label = expense.label;
    this.amount = expense.amount;
    this.categoryId = expense.categoryId;
    this.date = expense.date;

    this.changeDetectorRef.detectChanges();
  }

  async updateExpense(): Promise<void> {
    if (
      !this.currentMonth ||
      !this.editingExpenseId
    ) {
      return;
    }

    if (
      !this.label.trim() ||
      this.amount === null ||
      this.amount <= 0
    ) {
      return;
    }

    const expense =
      this.currentMonth.expenses.find(
        (item) =>
          item.id === this.editingExpenseId
      );

    if (!expense) {
      return;
    }

    expense.label = this.label.trim();
    expense.amount = this.amount;
    expense.categoryId = this.categoryId;
    expense.date = this.date;

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  async deleteExpense(id: string): Promise<void> {
    if (!this.currentMonth) {
      return;
    }

    this.currentMonth.expenses =
      this.currentMonth.expenses.filter(
        (expense) =>
          expense.id !== id
      );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    if (this.editingExpenseId === id) {
      this.resetForm();
    }

    this.changeDetectorRef.detectChanges();
  }

  cancelEdit(): void {
    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  getCategoryName(categoryId: string): string {
    const category =
      this.categories.find(
        (item) =>
          item.id === categoryId
      );

    return category?.name ?? 'Autres';
  }

  private resetForm(): void {
    this.label = '';
    this.amount = null;
    this.categoryId = 'courses';

    this.date =
      new Date().toISOString().split('T')[0];

    this.editingExpenseId = null;
  }
}