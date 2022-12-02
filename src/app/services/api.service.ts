import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency, Expense } from '../app.types';
@Injectable({ providedIn: 'root' })
export class APIService {
  private apiUrl: string = 'http://localhost:3000/api/expenseItems';

  constructor(private httpClient: HttpClient) {}
  /******************************************
   * MAIN API CRUD
   ********************************************/

  public getAllExpenseItems(): Observable<any> {
    return this.httpClient.get(this.apiUrl);
  }

  public createExpenseItem(expenseItem: any): Observable<any> {
    return this.httpClient.post(this.apiUrl, expenseItem);
  }

  public updateExpenseItem(expenseItem: Partial<Expense>): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${expenseItem.id}`, expenseItem);
  }

  public deleteExpenseItem(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  /******************************************
   * exchangerate API GET
   ********************************************/

  public getExchangerateConvert(
    from: Currency,
    to: Currency,
    amount: number,
    date?: Date
  ): Observable<any> {
    let url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    if (date) url += `&date=${date}`;
    return this.httpClient.get(url);
  }
}
