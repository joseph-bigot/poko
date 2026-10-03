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
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-mois',
  imports: [CommonModule],
  templateUrl: './mois.html',
  styleUrl: './mois.scss',
})
export class Mois implements OnInit {
  months: Month[] = [];

  loading = true;
  creating = false;

  constructor(
    private monthService: MonthService,
    private storageService: StorageService,
    public budgetService: BudgetService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadMonths();
  }

  async loadMonths(): Promise<void> {
    this.loading = true;

    try {
      this.months =
        await this.storageService.getAllMonths();

      this.months.sort((a, b) =>
        b.id.localeCompare(a.id)
      );
    } catch (error) {
      console.error(
        'Erreur lors du chargement des mois :',
        error
      );
    } finally {
      this.loading = false;

      this.changeDetectorRef.detectChanges();
    }
  }

  async createNextMonth(): Promise<void> {
    if (this.creating) {
      return;
    }

    this.creating = true;

    try {
      const month =
        await this.monthService.createNextMonth();

      this.monthService.setSelectedMonth(
        month.id
      );

      await this.loadMonths();

      await this.openMonth(month);
    } catch (error) {
      console.error(
        'Erreur lors de la création du mois :',
        error
      );
    } finally {
      this.creating = false;

      this.changeDetectorRef.detectChanges();
    }
  }

  async deleteMonth(
    month: Month
  ): Promise<void> {
    const label =
      this.monthService.getMonthLabel(
        month
      );

    const confirmed =
      window.confirm(
        `Supprimer le mois ${label} ?\n\nCette action supprimera définitivement les revenus, charges, dépenses et objectifs associés.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await this.monthService.deleteMonth(
        month.id
      );

      await this.loadMonths();
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du mois :',
        error
      );
    }
  }

  async openMonth(
    month: Month
  ): Promise<void> {
    this.monthService.setSelectedMonth(
      month.id
    );

    await this.router.navigate([
      '/budget',
    ]);
  }

  getMonthLabel(
    month: Month
  ): string {
    return this.monthService.getMonthLabel(
      month
    );
  }

  getMonthSummary(
    month: Month
  ): {
    revenues: number;
    expenses: number;
    savings: number;
    available: number;
  } {
    return {
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
    };
  }
}