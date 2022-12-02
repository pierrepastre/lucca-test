import { Component, Input } from '@angular/core';
import { Expense } from '../app.types';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'expense-item',
  template: `
    <div>
      <h2>{{ expense.nature }}</h2>
      <em>{{ expense.purchasedOn | date: 'dd-MM-YY' }}</em>
    </div>
    <div>
      <h3 [innerHTML]="EXP.displayAmount(expense.convertedAmount.amount)"></h3>
    </div>
  `,
  styles: [
    `
      @import 'variables';
      :host {
        display: flex;
        justify-content: space-between;
        padding: calc($gutter / 2);
        gap: 1rem;
        cursor: pointer;
        &:hover,
        &.active,
        &:focus {
          background-color: $color-light_alt;
        }
      }
      h2 {
        font-size: 1.2em;
      }
      h2::first-letter {
        text-transform: capitalize;
      }
      em {
        font-size: 0.9em;
      }
      h3 {
        font-size: 1.1em;
      }
    `,
  ],
})
export class ExpenseItemComponent {
  @Input() expense: Expense = {} as Expense;
  constructor(public EXP: ExpenseService) {}
}
