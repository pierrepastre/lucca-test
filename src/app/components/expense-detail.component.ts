import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'expense-detail',
  template: `
    <article *ngIf="selectedExpense$ | async as expense">
      <header>
        <div>
          <h2>{{ expense.nature }}</h2>
          <em>{{ expense.purchasedOn | date: 'dd-MM-YYY' }}</em>
        </div>
        <div>
          <h3
            [innerHTML]="EXP.displayAmount(expense.convertedAmount.amount)"
          ></h3>
          <em
            [innerHTML]="
              EXP.displayAmount(
                expense.originalAmount.amount,
                expense?.originalAmount?.currency
              )
            "
          >
          </em>
        </div>
      </header>
      <main>
        <p>{{ expense.comment }}</p>
      </main>
    </article>
  `,
  styles: [
    `
      @import 'variables';
      article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: $gutter 0;
        gap: $gutter;
        min-height: 15rem;
      }
      header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        h2 {
          line-height: 1em;
          &::first-letter {
            text-transform: capitalize;
          }
        }
        > div:last-child {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        em {
          font-size: 0.9em;
        }
      }
      main {
        color: #666;
      }
    `,
  ],
})
export class ExpenseDetailComponent {
  public selectedExpense$ = this.EXP.selectedExpense$;
  constructor(public EXP: ExpenseService) {}
}
