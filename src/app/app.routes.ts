import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Budget } from './features/budget/budget';
import { Revenus } from './features/revenus/revenus';
import { Depenses } from './features/depenses/depenses';
import { Charges } from './features/charges/charges';
import { Synthese } from './features/synthese/synthese';
import { Mois } from './features/mois/mois';
import { Objectifs } from './features/objectifs/objectifs';
import { BonsPlans } from './features/bons-plans/bons-plans';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'budget',
    component: Budget,
  },
  {
    path: 'revenus',
    component: Revenus,
  },
  {
    path: 'depenses',
    component: Depenses,
  },
  {
    path: 'charges',
    component: Charges,
  },
  {
    path: 'synthese',
    component: Synthese,
  },
  {
    path: 'mois',
    component: Mois,
  },
  {
    path: 'objectifs',
    component: Objectifs,
  },
  {
    path: 'bons-plans',
    component: BonsPlans,
  },
  {
    path: '**',
    redirectTo: '',
  },
];