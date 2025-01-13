import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000';
  private paymentsBaseUrl = `${this.apiUrl}/payments/`;
  private csvUploadUrl = `${this.apiUrl}/normalize-csv/`;

  constructor(private http: HttpClient) {}

  getPayments(skip: number, limit: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
  
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
  
    return this.http.get(this.paymentsBaseUrl, { params });
  }

  getPaymentById(id: string): Observable<any> {
    return this.http.get(`${this.paymentsBaseUrl}${id}`);
  }

  addPayment(payment: any): Observable<any> {
    return this.http.post(this.paymentsBaseUrl, payment);
  }

  updatePaymentWithEvidence(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.paymentsBaseUrl}${id}/update`, formData);
  }

  deletePayment(id: string): Observable<any> {
    return this.http.delete(`${this.paymentsBaseUrl}${id}`);
  }

  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.csvUploadUrl, formData);
  }
  
  getEvidenceFileUrl(filePath: string): string {
    return `${this.apiUrl}/evidence/${filePath}`;
  }
  
}
