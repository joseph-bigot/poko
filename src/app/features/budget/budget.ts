import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { BudgetService } from '../../services/budget';
import { MonthService } from '../../services/month';
import { Month } from '../../models/month';

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
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingMessage = 'Chargement du mois...';

    try {
      this.currentMonth =
        await this.monthService.getOrCreateCurrentMonth();

      this.loadingMessage = 'Mois chargé.';

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
}