import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Month } from '../../models/month';
import { SavingGoal } from '../../models/saving-goal';
import { MonthService } from '../../services/month';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-objectifs',
  imports: [CommonModule, FormsModule],
  templateUrl: './objectifs.html',
  styleUrl: './objectifs.scss',
})
export class Objectifs implements OnInit {
  currentMonth: Month | null = null;

  name = '';
  targetAmount: number | null = null;
  currentAmount: number | null = null;
  deadline = '';

  editingGoalId: string | null = null;

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

  async addGoal(): Promise<void> {
    if (!this.currentMonth) {
      return;
    }

    if (
      !this.name.trim() ||
      this.targetAmount === null ||
      this.targetAmount <= 0
    ) {
      return;
    }

    const goal: SavingGoal = {
      id: crypto.randomUUID(),
      name: this.name.trim(),
      targetAmount: this.targetAmount,
      currentAmount:
        this.currentAmount !== null &&
        this.currentAmount >= 0
          ? this.currentAmount
          : 0,
      deadline:
        this.deadline || undefined,
    };

    this.currentMonth.savings.push(
      goal
    );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  editGoal(
    goal: SavingGoal
  ): void {
    this.editingGoalId =
      goal.id;

    this.name =
      goal.name;

    this.targetAmount =
      goal.targetAmount;

    this.currentAmount =
      goal.currentAmount;

    this.deadline =
      goal.deadline ?? '';

    this.changeDetectorRef.detectChanges();
  }

  async updateGoal(): Promise<void> {
    if (
      !this.currentMonth ||
      !this.editingGoalId
    ) {
      return;
    }

    if (
      !this.name.trim() ||
      this.targetAmount === null ||
      this.targetAmount <= 0
    ) {
      return;
    }

    const goal =
      this.currentMonth.savings.find(
        (item) =>
          item.id ===
          this.editingGoalId
      );

    if (!goal) {
      return;
    }

    goal.name =
      this.name.trim();

    goal.targetAmount =
      this.targetAmount;

    goal.currentAmount =
      this.currentAmount !== null &&
      this.currentAmount >= 0
        ? this.currentAmount
        : 0;

    goal.deadline =
      this.deadline || undefined;

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  async deleteGoal(
    id: string
  ): Promise<void> {
    if (!this.currentMonth) {
      return;
    }

    this.currentMonth.savings =
      this.currentMonth.savings.filter(
        (goal) =>
          goal.id !== id
      );

    this.currentMonth.updatedAt =
      new Date().toISOString();

    await this.storageService.saveMonth(
      this.currentMonth
    );

    if (
      this.editingGoalId === id
    ) {
      this.resetForm();
    }

    this.changeDetectorRef.detectChanges();
  }

  cancelEdit(): void {
    this.resetForm();

    this.changeDetectorRef.detectChanges();
  }

  getProgress(
    goal: SavingGoal
  ): number {
    if (
      goal.targetAmount <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (goal.currentAmount /
          goal.targetAmount) *
          100
      )
    );
  }

  getRemainingAmount(
    goal: SavingGoal
  ): number {
    return Math.max(
      0,
      goal.targetAmount -
        goal.currentAmount
    );
  }

  private resetForm(): void {
    this.name = '';
    this.targetAmount = null;
    this.currentAmount = null;
    this.deadline = '';
    this.editingGoalId = null;
  }
}