import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FixedExpense } from '../../models/fixed-expense';
import { Month } from '../../models/month';
import { MonthService } from '../../services/month';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-charges',
  imports: [CommonModule, FormsModule],
  templateUrl: './charges.html',
  styleUrl: './charges.scss',
})
export class Charges implements OnInit {
  currentMonth: Month | null = null;

  label = '';
  amount: number | null = null;
  dueDay: number | null = null;
  recurring = true;

  editingChargeId: string | null = null;

  constructor(
    private monthService: MonthService,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentMonth =
      await this.monthService.getSelectedMonth();

    this.changeDetectorRef.detectChanges();
  }

  async addCharge(): Promise<void> {
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

    const charge: FixedExpense = {
      id: crypto.randomUUID(),
      label: this.label.trim(),
      amount: this.amount,
      categoryId: 'fixed-expense',
      dueDay: this.dueDay ?? undefined,
      recurring: this.recurring,
    };

    this.currentMonth.fixedExpenses.push(
      charge
    );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  editCharge(
    charge: FixedExpense
  ): void {
    this.editingChargeId =
      charge.id;

    this.label =
      charge.label;

    this.amount =
      charge.amount;

    this.dueDay =
      charge.dueDay ?? null;

    this.recurring =
      charge.recurring;

    this.changeDetectorRef.detectChanges();
  }

  async updateCharge(): Promise<void> {
    if (
      !this.currentMonth ||
      !this.editingChargeId
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

    const charge =
      this.currentMonth.fixedExpenses.find(
        (item) =>
          item.id ===
          this.editingChargeId
      );

    if (!charge) {
      return;
    }

    charge.label =
      this.label.trim();

    charge.amount =
      this.amount;

    charge.dueDay =
      this.dueDay ?? undefined;

    charge.recurring =
      this.recurring;

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  async deleteCharge(
    id: string
  ): Promise<void> {
    if (!this.currentMonth) {
      return;
    }

    this.currentMonth.fixedExpenses =
      this.currentMonth.fixedExpenses.filter(
        (charge) =>
          charge.id !== id
      );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    if (
      this.editingChargeId === id
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
    this.dueDay = null;
    this.recurring = true;
    this.editingChargeId = null;
  }
}