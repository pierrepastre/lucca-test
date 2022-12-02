import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { currenciesList, Expense } from '../app.types';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'expense-form',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  template: `
    <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
      <label for="nature">Nature</label>
      <input type="text" formControlName="nature" />

      <div formGroupName="originalAmount">
        <label for="amount">Prix</label>
        <span>
          <input type="number" formControlName="amount" />
          <select formControlName="currency">
            <option *ngFor="let currency of currencyList" [value]="currency">
              {{ currency }}
            </option>
          </select>
        </span>
      </div>

      <label for="purchasedOn">Date d'achat</label>
      <input type="date" formControlName="purchasedOn" />

      <label for="comment">Commentaire</label>
      <textarea formControlName="comment"></textarea>

      <button type="submit">Valider</button>
    </form>
  `,
  styles: [
    `
      @import 'variables';
      form {
        margin-top: calc($gutter/2);
        > div {
          display: flex;
          flex-direction: column;
          margin-bottom: $gutter;
          span {
            gap: 1rem;
            display: flex;
            justify-content: space-between;
          }
        }
        label {
          margin-bottom: 0.5em;
        }
        > input,
        textarea {
          margin-bottom: $gutter;
        }
        select {
          width: auto;
        }
        textarea {
          height: 10em;
        }
      }
    `,
  ],
})
export class ExpenseFormComponent implements OnDestroy {
  private destroy$ = new Subject();
  public currencyList = [...currenciesList];
  private selectedExpense$ = this.EXP.selectedExpense$;

  public expenseForm = this.fb.group({
    purchasedOn: [new Date()],
    nature: [''],
    comment: [''],
    originalAmount: this.fb.group({
      amount: [0],
      currency: ['EUR'],
    }),
  });

  constructor(private fb: FormBuilder, private EXP: ExpenseService) {
    this.selectedExpense$
      .pipe(takeUntil(this.destroy$))
      .subscribe((expense) => {
        if (!expense) return this.expenseForm.reset();
        const { purchasedOn, nature, comment, originalAmount } = expense;
        const { amount, currency } = originalAmount || {
          amount: 0,
          currency: 'EUR',
        };
        this.expenseForm.patchValue({
          purchasedOn,
          nature,
          comment,
          originalAmount: { amount, currency },
        });
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  public onSubmit() {
    const formValues = this.expenseForm.value as any;

    const expense: Expense = {
      ...formValues,
      purchasedOn: formValues.purchasedOn,
    };

    this.EXP.submitExpense(expense);
  }
}
