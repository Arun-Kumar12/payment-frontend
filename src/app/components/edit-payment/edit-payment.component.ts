import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {
  editPaymentForm: FormGroup;
  paymentId: string = '';
  showFileUpload = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.editPaymentForm = this.fb.group({
      payee_first_name: [{ value: '', disabled: true }, Validators.required],
      payee_last_name: [{ value: '', disabled: true }, Validators.required],
      payee_payment_status: ['', Validators.required],
      payee_added_date_utc: [{ value: '', disabled: true }, Validators.required],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: [{ value: '', disabled: true }, Validators.required],
      payee_address_line_2: [{ value: '', disabled: true }],
      payee_city: [{ value: '', disabled: true }, Validators.required],
      payee_country: [{ value: '', disabled: true }, Validators.required],
      payee_province_or_state: [{ value: '', disabled: true }],
      payee_postal_code: [{ value: '', disabled: true }, Validators.required],
      payee_phone_number: [{ value: '', disabled: true }, Validators.required],
      payee_email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      currency: [{ value: '', disabled: true }, Validators.required],
      discount_percent: [{ value: 0.0, disabled: true }],
      tax_percent: [{ value: 0.0, disabled: true }],
      due_amount: [0.0, [Validators.required, Validators.min(0)]],
      total_due: [{ value: 0.0, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchPaymentDetails();
  }

  fetchPaymentDetails(): void {
    if (this.paymentId) {
      this.paymentService.getPaymentById(this.paymentId).subscribe(
        (response) => {
          if (response.data) {
            const payment = response.data;

            payment.payee_added_date_utc = new Date(payment.payee_added_date_utc * 1000).toISOString().slice(0, 16);
            payment.payee_due_date = new Date(payment.payee_due_date).toISOString().slice(0, 16);

            this.editPaymentForm.patchValue(payment);
            this.showFileUpload = payment.payee_payment_status === 'completed';
          }
        },
        (error) => {
          console.error('Failed to fetch payment details', error);
        }
      );
    }
  }

  onStatusChange(): void {
    this.showFileUpload = this.editPaymentForm.get('payee_payment_status')?.value === 'completed';
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  onSubmit(): void {
    if (!this.editPaymentForm.valid) {
      alert('Please fix validation errors before submitting.');
      return;
    }
  
    const updatedPayment = this.editPaymentForm.getRawValue();
    const formData = new FormData();
    formData.append('due_date', updatedPayment.payee_due_date);
    formData.append('due_amount', updatedPayment.due_amount);
    formData.append('status', updatedPayment.payee_payment_status);
  
    if (this.showFileUpload && this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    this.paymentService.updatePaymentWithEvidence(this.paymentId, formData).subscribe(
      (response: any) => {
        alert(response.message || 'Payment updated successfully!');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Failed to update payment', error);
        alert(error.error?.detail || 'An error occurred while updating the payment. Please try again.');
      }
    );
  }
  
}
