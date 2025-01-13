import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Import standalone components
import { AppComponent } from './app.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { EditPaymentComponent } from './components/edit-payment/edit-payment.component';
import { ViewPaymentComponent } from './components/view-payment/view-payment.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppComponent,
    PaymentListComponent,
    AddPaymentComponent,
    EditPaymentComponent,
    ViewPaymentComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
