import { Injectable } from '@angular/core';

import { Month } from '../models/month';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class MonthService {

  constructor(
    private storageService: StorageService
  ) {}

  createMonth(year: number, month: number): Month {
    const now = new Date().toISOString();

    return {
      id: `${year}-${String(month).padStart(2, '0')}`,
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

    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const id =
      `${year}-${String(month).padStart(2, '0')}`;

    const existingMonth =
      await this.storageService.getMonth(id);

    if (existingMonth) {
      return existingMonth;
    }

    const newMonth =
      this.createMonth(year, month);

    await this.storageService.saveMonth(newMonth);

    return newMonth;
  }
}