import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: any[] = [];
  filters = {
    payeeName: '',
    status: '',
    payeeAddressLine1: '',
    payeeCity: '',
    payeeCountry: '',
    payeeProvinceOrState: '',
    payeePostalCode: '',
    payeePhoneNumber: '',
    payeeEmail: '',
    currency: ''
  };

  page: number = 1;
  pageSize: number = 10;
  totalPayments: number = 0;
  totalPages: number = 0;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(): void {
    const skip = (this.page - 1) * this.pageSize;

    this.paymentService.getPayments(skip, this.pageSize, this.filters).subscribe(response => {
      this.payments = response.data;
      this.totalPayments = response.total;
      this.totalPages = Math.ceil(this.totalPayments / this.pageSize);
    });
  }

  deletePayment(paymentId: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(paymentId).subscribe(
        () => {
          alert('Payment deleted successfully!');
          this.fetchPayments();
        },
        (error) => {
          console.error('Failed to delete payment', error);
        }
      );
    }
  }

  applyFilters(): void {
    this.page = 1;
    this.fetchPayments();
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchPayments();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchPayments();
    }
  }
}
