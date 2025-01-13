import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-payment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss']
})
export class ViewPaymentComponent implements OnInit {
  payment: any = null;
  paymentId: string = '';

  constructor(private route: ActivatedRoute, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchPaymentDetails();
  }

  fetchPaymentDetails(): void {
    if (this.paymentId) {
      this.paymentService.getPaymentById(this.paymentId).subscribe(
        (response) => {
          const paymentData = response.data;

          paymentData.payee_added_date_utc = new Date(paymentData.payee_added_date_utc * 1000);
          if (paymentData.evidence_file_path) {
            paymentData.evidence_file_url = this.paymentService.getEvidenceFileUrl(this.getFileName(paymentData.evidence_file_path));
          }
          this.payment = paymentData;
        },
        (error) => {
          console.error('Failed to fetch payment details', error);
        }
      );
    }
  }

  getFileName(filePath: string): string {
    if (!filePath) return '';
    return filePath.split('/').pop() || '';
  }
}
