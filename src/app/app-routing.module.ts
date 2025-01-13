import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { EditPaymentComponent } from './components/edit-payment/edit-payment.component';
import { ViewPaymentComponent } from './components/view-payment/view-payment.component';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';

const routes: Routes = [
  { path: '', component: PaymentListComponent },
  { path: 'add-payment', component: AddPaymentComponent },
  { path: 'edit-payment/:id', component: EditPaymentComponent },
  { path: 'view-payment/:id', component: ViewPaymentComponent },
  { path: 'upload-csv', component: UploadCsvComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
