import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APIService } from 'src/app/services/api.service';
import { ExpenseService } from 'src/app/services/expense.service';

import { AppComponent } from './app.component';
import { ExpenseDetailComponent } from './components/expense-detail.component';
import { ExpenseFormComponent } from './components/expense-form.component';
import { ExpenseItemComponent } from './components/expense-item.component';

@NgModule({
  declarations: [AppComponent, ExpenseItemComponent, ExpenseDetailComponent],
  imports: [BrowserModule, HttpClientModule, ExpenseFormComponent],
  providers: [APIService, ExpenseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
