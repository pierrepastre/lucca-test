export const currenciesList = ['USD', 'EUR', 'CHF', 'GBP'] as const;

export type Currency = typeof currenciesList[number];

export interface Amount {
  amount: number;
  currency: Currency;
}

export interface Expense {
  id: string; // identifiant unique de la dépense. La valeur est readonly
  purchasedOn: Date; // date de la dépense
  nature: string; // type de la dépense (comme "Restaurant", "Hôtel", "Parking", etc). Le champ est limité à 120 caractères
  originalAmount: Amount; // montant et devise de la dépense d'origine.
  convertedAmount: Amount; // montant converti dans votre devise
  comment: string; // le commentaire de la dépense, limité à 600 caractères
  createdAt: Date; // date et heure (GMT) de la création de la dépense. La valeur est readonly
  lastModifiedAt: Date; // date et heure (GMT) de la dernière modification de la dépense. La valeur est readonly
}
