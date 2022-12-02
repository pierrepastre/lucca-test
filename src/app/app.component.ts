import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Expense } from './app.types';
import { ExpenseService } from './services/expense.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public editMode: boolean = false;
  public openFooter: boolean = false;
  public expenseItem$: Observable<Expense[]> = this.EXP.expenseList$;
  public selectedExpense$ = this.EXP.selectedExpense$;
  public totalExpense$ = this.EXP.totalExpense$;
  public expenseTrackBy = (index: number, expense: Expense) => expense.id;

  constructor(public EXP: ExpenseService) {}

  public selectExpenseItem(expense: Expense): void {
    this.editMode = false;
    this.openExpenseEditor();
    this.EXP.selectedExpense = expense;
  }
  public openExpenseEditor(): void {
    this.openFooter = true;
  }
  public closeExpenseEditor(): void {
    this.openFooter = false;
    this.EXP.selectedExpense = null;
  }
  public removeSelectedExpense(): void {
    this.EXP.removeExpense();
  }
  public addExpense(): void {
    this.editMode = true;
    this.openExpenseEditor();
    this.EXP.selectedExpense = {} as Expense;
  }
}
