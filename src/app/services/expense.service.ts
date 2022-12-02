import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  first,
  map,
  Observable,
  of,
  retry,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Amount, Currency, Expense } from '../app.types';
import { APIService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  /******************************************
   * All Expenses
   ********************************************/

  private refreshList$ = new BehaviorSubject<Boolean>(true);

  public readonly expenseList$ = this.refreshList$.pipe(
    switchMap(() => this.API.getAllExpenseItems()),
    map((expenses) =>
      expenses.sort(
        (a: Expense, b: Expense) =>
          new Date(b.purchasedOn).getTime() - new Date(a.purchasedOn).getTime()
      )
    ),
    shareReplay()
  );

  public totalExpense$ = this.expenseList$.pipe(
    map((expenses: Expense[]) =>
      expenses.reduce(
        (acc: number, expense: Expense) =>
          acc + (expense.convertedAmount?.amount || 0),
        0
      )
    )
  );

  /******************************************
   * Selected Expense
   ********************************************/

  private readonly _selectedExpense = new BehaviorSubject<Expense | null>(null);

  public readonly selectedExpense$ = this._selectedExpense.asObservable();

  public get selectedExpense() {
    return this._selectedExpense.getValue();
  }

  public set selectedExpense(expense: Expense | null) {
    this._selectedExpense.next(expense);
  }

  /******************************************/

  constructor(private API: APIService) {}

  /******************************************
   * Methods
   ********************************************/
  public submitExpense(expense: Partial<Expense> | null) {
    if (!expense) return;
    const originalAmount = expense.originalAmount || {
      amount: 0,
      currency: 'EUR',
    };

    this.convertAmount(originalAmount, expense.purchasedOn)
      .pipe(
        switchMap((convertedAmount: Amount) => {
          const data: Partial<Expense> = {
            ...this.selectedExpense,
            ...expense,
            convertedAmount,
          };
          return !!data?.id
            ? this.API.updateExpenseItem(data)
            : this.API.createExpenseItem(data);
        })
      )
      .pipe(retry(3), first())
      .subscribe(() => {
        this.selectedExpense = null;
        this.refreshList$.next(true);
      });
  }

  public removeExpense() {
    const id = this.selectedExpense?.id;
    if (!id) return;
    return this.API.deleteExpenseItem(id)
      .pipe(retry(3), first())
      .subscribe(() => {
        this.selectedExpense = null;
        this.refreshList$.next(true);
      });
  }

  /******************************************
   * Display & utils
   ********************************************/

  public convertAmount(
    originalAmount: Amount,
    date?: Date
  ): Observable<Amount> {
    const { amount, currency } = originalAmount;
    if (currency === 'EUR') return of(originalAmount);
    return this.API.getExchangerateConvert(currency, 'EUR', amount, date).pipe(
      map((res) => {
        return {
          amount: res.result as number,
          currency: 'EUR',
        };
      })
    );
  }
  public displayAmount = (amount: number = 0, currency?: Currency) =>
    `${amount.toFixed(2)}&#8239;${currency || '€'}`;
}
