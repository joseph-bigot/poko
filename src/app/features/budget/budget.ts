import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Month } from '../../models/month';
import { BudgetService } from '../../services/budget';
import { MonthService } from '../../services/month';

@Component({
  selector: 'app-budget',
  imports: [CommonModule],
  templateUrl: './budget.html',
  styleUrl: './budget.scss',
})
export class Budget implements OnInit {
  currentMonth: Month | null = null;

  loadingMessage = 'Démarrage...';

  constructor(
    public budgetService: BudgetService,
    private monthService: MonthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingMessage =
      'Chargement du mois...';

    try {
      this.currentMonth =
        await this.monthService.getSelectedMonth();

      this.loadingMessage =
        'Mois chargé.';

      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error(
        'Erreur Budget :',
        error
      );

      this.loadingMessage =
        'Erreur lors du chargement du mois.';

      this.changeDetectorRef.detectChanges();
    }
  }

  getMonthLabel(): string {
    if (!this.currentMonth) {
      return '';
    }

    return this.monthService.getMonthLabel(
      this.currentMonth
    );
  }

  async goToCurrentMonth(): Promise<void> {
    this.monthService.clearSelectedMonth();

    await this.router.navigate([
      '/budget',
    ]);
  }

  isCurrentMonth(): boolean {
    if (!this.currentMonth) {
      return false;
    }

    const now = new Date();

    return (
      this.currentMonth.year ===
        now.getFullYear() &&
      this.currentMonth.month ===
        now.getMonth() + 1
    );
  }
}