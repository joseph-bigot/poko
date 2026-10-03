import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Month } from '../../models/month';
import { BudgetService } from '../../services/budget';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-synthese',
  imports: [CommonModule, FormsModule],
  templateUrl: './synthese.html',
  styleUrl: './synthese.scss',
})
export class Synthese implements OnInit {
  months: Month[] = [];

  selectedStartMonth = '';
  selectedEndMonth = '';

  selectedPeriod = 'custom';

  totalRevenues = 0;
  totalFixedExpenses = 0;
  totalExpenses = 0;
  totalSavings = 0;
  availableAmount = 0;

  averageMonthlyRevenues = 0;
  averageMonthlyExpenses = 0;
  averageMonthlySavings = 0;
  averageMonthlyAvailable = 0;

  expenseCategories = [
    { id: 'courses', name: 'Courses', total: 0, percentage: 0 },
    { id: 'transport', name: 'Transport', total: 0, percentage: 0 },
    { id: 'loisirs', name: 'Loisirs', total: 0, percentage: 0 },
    { id: 'vetements', name: 'Vêtements', total: 0, percentage: 0 },
    { id: 'sante', name: 'Santé', total: 0, percentage: 0 },
    { id: 'maison', name: 'Maison', total: 0, percentage: 0 },
    { id: 'autres', name: 'Autres', total: 0, percentage: 0 },
  ];

  monthlyData: {
    label: string;
    revenues: number;
    expenses: number;
    savings: number;
    available: number;
    maxValue: number;
    revenuesWidth: number;
    expensesWidth: number;
    savingsWidth: number;
    availableWidth: number;
  }[] = [];

  loading = true;

  constructor(
    private storageService: StorageService,
    public budgetService: BudgetService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;

    try {
      this.months =
        await this.storageService.getAllMonths();

      this.months.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

      if (this.months.length > 0) {
        this.selectedStartMonth =
          this.months[0].id;

        this.selectedEndMonth =
          this.months[this.months.length - 1].id;

        this.selectedPeriod = 'custom';

        this.calculateSynthesis();
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement de la synthèse :',
        error
      );
    } finally {
      this.loading = false;

      this.changeDetectorRef.detectChanges();
    }
  }

  calculateSynthesis(): void {
    const selectedMonths =
      this.getSelectedMonths();

    this.totalRevenues = 0;
    this.totalFixedExpenses = 0;
    this.totalExpenses = 0;
    this.totalSavings = 0;
    this.availableAmount = 0;

    this.resetExpenseCategories();

    const rawMonthlyData =
      selectedMonths.map((month) => ({
        label: this.getMonthLabel(month),
        revenues:
          this.budgetService.calculateTotalRevenues(
            month
          ),
        expenses:
          this.budgetService.calculateTotalFixedExpenses(
            month
          ) +
          this.budgetService.calculateTotalExpenses(
            month
          ),
        savings:
          this.budgetService.calculateTotalSavings(
            month
          ),
        available:
          this.budgetService.calculateAvailableAmount(
            month
          ),
      }));

    const maxValue = Math.max(
      ...rawMonthlyData.flatMap((month) => [
        month.revenues,
        month.expenses,
        month.savings,
        Math.max(month.available, 0),
      ]),
      1
    );

    this.monthlyData =
      rawMonthlyData.map((month) => ({
        ...month,
        maxValue,
        revenuesWidth:
          (month.revenues / maxValue) * 100,
        expensesWidth:
          (month.expenses / maxValue) * 100,
        savingsWidth:
          (month.savings / maxValue) * 100,
        availableWidth:
          (Math.max(month.available, 0) / maxValue) * 100,
      }));

    for (const month of selectedMonths) {
      this.totalRevenues +=
        this.budgetService.calculateTotalRevenues(
          month
        );

      this.totalFixedExpenses +=
        this.budgetService.calculateTotalFixedExpenses(
          month
        );

      this.totalExpenses +=
        this.budgetService.calculateTotalExpenses(
          month
        );

      this.totalSavings +=
        this.budgetService.calculateTotalSavings(
          month
        );

      this.availableAmount +=
        this.budgetService.calculateAvailableAmount(
          month
        );

      for (const expense of month.expenses) {
        const category =
          this.expenseCategories.find(
            (item) =>
              item.id === expense.categoryId
          );

        if (category) {
          category.total += expense.amount;
        }
      }
    }

    for (const category of this.expenseCategories) {
      if (this.totalExpenses > 0) {
        category.percentage =
          (category.total / this.totalExpenses) * 100;
      } else {
        category.percentage = 0;
      }
    }

    const monthCount =
      selectedMonths.length;

    if (monthCount > 0) {
      this.averageMonthlyRevenues =
        this.totalRevenues / monthCount;

      this.averageMonthlyExpenses =
        this.totalExpenses / monthCount;

      this.averageMonthlySavings =
        this.totalSavings / monthCount;

      this.averageMonthlyAvailable =
        this.availableAmount / monthCount;
    } else {
      this.averageMonthlyRevenues = 0;
      this.averageMonthlyExpenses = 0;
      this.averageMonthlySavings = 0;
      this.averageMonthlyAvailable = 0;
    }

    this.changeDetectorRef.detectChanges();
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;

    if (this.months.length === 0) {
      return;
    }

    const lastMonthIndex =
      this.months.length - 1;

    if (period === 'current') {
      this.selectedStartMonth =
        this.months[lastMonthIndex].id;

      this.selectedEndMonth =
        this.months[lastMonthIndex].id;
    }

    if (period === '3months') {
      const startIndex =
        Math.max(0, lastMonthIndex - 2);

      this.selectedStartMonth =
        this.months[startIndex].id;

      this.selectedEndMonth =
        this.months[lastMonthIndex].id;
    }

    if (period === '6months') {
      const startIndex =
        Math.max(0, lastMonthIndex - 5);

      this.selectedStartMonth =
        this.months[startIndex].id;

      this.selectedEndMonth =
        this.months[lastMonthIndex].id;
    }

    if (period === 'year') {
      const lastMonth =
        this.months[lastMonthIndex];

      const yearMonths =
        this.months.filter(
          (month) =>
            month.year === lastMonth.year
        );

      if (yearMonths.length > 0) {
        this.selectedStartMonth =
          yearMonths[0].id;

        this.selectedEndMonth =
          yearMonths[yearMonths.length - 1].id;
      }
    }

    if (period === 'custom') {
      return;
    }

    this.calculateSynthesis();
  }

  getSelectedMonths(): Month[] {
    return this.months.filter((month) => {
      return (
        month.id >= this.selectedStartMonth &&
        month.id <= this.selectedEndMonth
      );
    });
  }

  getMonthLabel(month: Month): string {
    const date = new Date(
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

  private resetExpenseCategories(): void {
    for (const category of this.expenseCategories) {
      category.total = 0;
      category.percentage = 0;
    }
  }
}