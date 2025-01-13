import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss'],
})
export class UploadCsvComponent {
  selectedFile: File | null = null;
  message: string = '';

  constructor(private paymentService: PaymentService) {}

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0] || null;
    this.message = '';
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a CSV file to upload.';
      return;
    }

    this.paymentService.uploadCsv(this.selectedFile).subscribe(
      (response: any) => {
        this.message = response.message || 'File uploaded successfully!';
      },
      (error) => {
        console.error(error);
        this.message = error.error.detail || 'An error occurred during file upload.';
      }
    );
  }
}
