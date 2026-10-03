import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Month } from '../../models/month';
import { Revenue } from '../../models/revenue';
import { MonthService } from '../../services/month';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-revenus',
  imports: [CommonModule, FormsModule],
  templateUrl: './revenus.html',
  styleUrl: './revenus.scss',
})
export class Revenus implements OnInit {
  currentMonth: Month | null = null;

  label = '';
  amount: number | null = null;
  date = '';
  recurring = true;

  editingRevenueId: string | null = null;

  constructor(
    private monthService: MonthService,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentMonth =
      await this.monthService.getSelectedMonth();

    this.date =
      new Date().toISOString().split('T')[0];

    this.changeDetectorRef.detectChanges();
  }

  async addRevenue(): Promise<void> {
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

    const revenue: Revenue = {
      id: crypto.randomUUID(),
      label: this.label.trim(),
      amount: this.amount,
      categoryId: 'income',
      date: this.date,
      recurring: this.recurring,
    };

    this.currentMonth.revenues.push(
      revenue
    );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  editRevenue(
    revenue: Revenue
  ): void {
    this.editingRevenueId =
      revenue.id;

    this.label =
      revenue.label;

    this.amount =
      revenue.amount;

    this.date =
      revenue.date;

    this.recurring =
      revenue.recurring;

    this.changeDetectorRef.detectChanges();
  }

  async updateRevenue(): Promise<void> {
    if (
      !this.currentMonth ||
      !this.editingRevenueId
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

    const revenue =
      this.currentMonth.revenues.find(
        (item) =>
          item.id ===
          this.editingRevenueId
      );

    if (!revenue) {
      return;
    }

    revenue.label =
      this.label.trim();

    revenue.amount =
      this.amount;

    revenue.date =
      this.date;

    revenue.recurring =
      this.recurring;

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  async deleteRevenue(
    id: string
  ): Promise<void> {
    if (!this.currentMonth) {
      return;
    }

    this.currentMonth.revenues =
      this.currentMonth.revenues.filter(
        (revenue) =>
          revenue.id !== id
      );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    if (
      this.editingRevenueId === id
    ) {
      this.resetForm();
    }

    this.changeDetectorRef.detectChanges();
  }

  cancelEdit(): void {
    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  private resetForm(): void {
    this.label = '';
    this.amount = null;

    this.date =
      new Date().toISOString().split('T')[0];

    this.recurring = true;
    this.editingRevenueId = null;
  }
}