import { Injectable } from '@angular/core';

import { Month } from '../models/month';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class MonthService {
  private selectedMonthId: string | null = null;

  constructor(
    private storageService: StorageService
  ) {}

  createMonth(
    year: number,
    month: number
  ): Month {
    const now =
      new Date().toISOString();

    return {
      id: this.getMonthId(year, month),
      year,
      month,
      revenues: [],
      fixedExpenses: [],
      expenses: [],
      savings: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  async getOrCreateCurrentMonth(): Promise<Month> {
    const now = new Date();

    const year =
      now.getFullYear();

    const month =
      now.getMonth() + 1;

    const id =
      this.getMonthId(year, month);

    const existingMonth =
      await this.storageService.getMonth(id);

    if (existingMonth) {
      return existingMonth;
    }

    return this.createMonthFromPrevious(
      year,
      month
    );
  }

  async getSelectedMonth(): Promise<Month> {
    if (this.selectedMonthId) {
      const selectedMonth =
        await this.storageService.getMonth(
          this.selectedMonthId
        );

      if (selectedMonth) {
        return selectedMonth;
      }
    }

    return this.getOrCreateCurrentMonth();
  }

  setSelectedMonth(monthId: string): void {
    this.selectedMonthId = monthId;
  }

  clearSelectedMonth(): void {
    this.selectedMonthId = null;
  }

  async createMonthFromPrevious(
    year: number,
    month: number
  ): Promise<Month> {
    const id =
      this.getMonthId(year, month);

    const existingMonth =
      await this.storageService.getMonth(id);

    if (existingMonth) {
      return existingMonth;
    }

    const months =
      await this.storageService.getAllMonths();

    const previousMonths =
      months
        .filter((item) => item.id < id)
        .sort((a, b) =>
          b.id.localeCompare(a.id)
        );

    const previousMonth =
      previousMonths[0];

    const newMonth =
      this.createMonth(
        year,
        month
      );

    if (previousMonth) {
      newMonth.revenues =
        previousMonth.revenues
          .filter(
            (revenue) =>
              revenue.recurring
          )
          .map((revenue) => ({
            ...revenue,
            id: crypto.randomUUID(),
            date:
              this.getDefaultDate(
                year,
                month
              ),
          }));

      newMonth.fixedExpenses =
        previousMonth.fixedExpenses
          .filter(
            (expense) =>
              expense.recurring
          )
          .map((expense) => ({
            ...expense,
            id: crypto.randomUUID(),
          }));
    }

    await this.storageService.saveMonth(
      newMonth
    );

    return newMonth;
  }

  async createNextMonth(): Promise<Month> {
    const months =
      await this.storageService.getAllMonths();

    if (months.length === 0) {
      const now = new Date();

      return this.createMonthFromPrevious(
        now.getFullYear(),
        now.getMonth() + 1
      );
    }

    months.sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    const lastMonth =
      months[months.length - 1];

    const nextDate =
      new Date(
        lastMonth.year,
        lastMonth.month,
        1
      );

    return this.createMonthFromPrevious(
      nextDate.getFullYear(),
      nextDate.getMonth() + 1
    );
  }

  async deleteMonth(
    id: string
  ): Promise<void> {
    await this.storageService.deleteMonth(
      id
    );

    if (
      this.selectedMonthId === id
    ) {
      this.selectedMonthId = null;
    }
  }

  getMonthId(
    year: number,
    month: number
  ): string {
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  getMonthLabel(
    month: Month
  ): string {
    const date =
      new Date(
        month.year,
        month.month - 1,
        1
      );

    return date.toLocaleDateString(
      'fr-FR',
      {
        month: 'long',
        year: 'numeric',
      }
    );
  }

  private getDefaultDate(
    year: number,
    month: number
  ): string {
    return `${year}-${String(month).padStart(2, '0')}-01`;
  }
}