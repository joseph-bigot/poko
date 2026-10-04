import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface GoodDealLink {
  name: string;
  description: string;
  url: string;
  category: 'shopping' | 'second-hand' | 'deals' | 'cashback';
}

@Component({
  selector: 'app-bons-plans',
  imports: [CommonModule],
  templateUrl: './bons-plans.html',
  styleUrl: './bons-plans.scss',
})
export class BonsPlans {
  readonly links: GoodDealLink[] = [
    {
      name: 'Leboncoin',
      description: 'Acheter et vendre des produits d’occasion près de chez vous.',
      url: 'https://www.leboncoin.fr/',
      category: 'second-hand',
    },
    {
      name: 'Vinted',
      description: 'Vêtements, accessoires et objets d’occasion.',
      url: 'https://www.vinted.fr/',
      category: 'second-hand',
    },
    {
      name: 'eBay',
      description: 'Enchères et achats de produits neufs ou d’occasion.',
      url: 'https://www.ebay.fr/',
      category: 'shopping',
    },
    {
      name: 'Amazon',
      description: 'Comparer rapidement les prix sur de nombreux produits.',
      url: 'https://www.amazon.fr/',
      category: 'shopping',
    },
    {
      name: 'Dealabs',
      description: 'Repérer les promotions et bons plans partagés par la communauté.',
      url: 'https://www.dealabs.com/',
      category: 'deals',
    },
    {
      name: 'iGraal',
      description: 'Obtenir du cashback sur certains achats en ligne.',
      url: 'https://fr.igraal.com/',
      category: 'cashback',
    },
    {
      name: 'Poulpeo',
      description: 'Cashback et réductions chez de nombreux marchands.',
      url: 'https://www.poulpeo.com/',
      category: 'cashback',
    },
    {
      name: 'Idealo',
      description: 'Comparer les prix d’un produit entre différents marchands.',
      url: 'https://www.idealo.fr/',
      category: 'deals',
    },
  ];

  get shoppingLinks(): GoodDealLink[] {
    return this.links.filter((link) => link.category === 'shopping');
  }

  get secondHandLinks(): GoodDealLink[] {
    return this.links.filter((link) => link.category === 'second-hand');
  }

  get dealLinks(): GoodDealLink[] {
    return this.links.filter((link) => link.category === 'deals');
  }

  get cashbackLinks(): GoodDealLink[] {
    return this.links.filter((link) => link.category === 'cashback');
  }
}