import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  countrySuggestions: { name: string; iso2: string }[] = [];
  stateSuggestions: string[] = [];
  citySuggestions: string[] = [];
  currencySuggestions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_payment_status: ['pending', Validators.required],
      payee_added_date_utc: ['', Validators.required],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''],
      payee_city: ['', Validators.required],
      payee_country: ['', [Validators.required]],
      payee_province_or_state: [''],
      payee_postal_code: ['', Validators.required],
      payee_phone_number: ['', [Validators.required, Validators.pattern(/^\+\d{1,15}$/)]],
      payee_email: ['', [Validators.required, Validators.email]],
      currency: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      discount_percent: [0.0, [Validators.min(0)]],
      tax_percent: [0.0, [Validators.min(0)]],
      due_amount: [0.0, [Validators.required, Validators.min(0)]]
    });    

    this.fetchCountries();
  }

  fetchCountries(): void {
    this.http.get<any>('https://countriesnow.space/api/v0.1/countries/positions').subscribe(
      (response) => {
        this.countrySuggestions = response.data.map((country: any) => ({
          name: country.name,
          iso2: country.iso2
        }));
      }
    );
  }

  onCountryChange(event: Event): void {
    const selectedCountry = (event.target as HTMLInputElement).value;
  
    if (selectedCountry) {
      this.paymentForm.patchValue({ payee_country: selectedCountry });
      this.fetchStates();
      this.fetchCurrencies()
    } else {
      this.stateSuggestions = [];
      this.currencySuggestions = [];
    }
  }

  fetchStates(): void {
    const country = this.paymentForm.get('payee_country')?.value;
    if (country) {
      this.http.post<any>('https://countriesnow.space/api/v0.1/countries/states', { country }).subscribe(response => {
        this.stateSuggestions = response.data.states.map((state: any) => state.name);
      });
    }
    else {
      this.stateSuggestions = [];
    }
  }

  fetchCities(): void {
    const country = this.paymentForm.get('payee_country')?.value;
    const state = this.paymentForm.get('payee_province_or_state')?.value;
    if (country && state) {
      const payload = { country, state };
      this.http.post<any>('https://countriesnow.space/api/v0.1/countries/state/cities', payload).subscribe( response => {
          this.citySuggestions = response.data || [];
        });
    }
    else {
      this.citySuggestions = [];
    }
  }

  fetchCurrencies(): void {
    const country = this.paymentForm.get('payee_country')?.value;
  
    if (country) {
      this.http.post<any>('https://countriesnow.space/api/v0.1/countries/currency', { country }).subscribe(
        (response) => {
          if (!response.error && response.data.currency) {
            this.currencySuggestions = [response.data.currency];
          } else {
            this.currencySuggestions = [];
          }
        }
      );
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = { ...this.paymentForm.value };
  
      paymentData.payee_added_date_utc = Math.floor(
        new Date(paymentData.payee_added_date_utc).getTime() / 1000
      );
  
      const dueDate = new Date(paymentData.payee_due_date);
      paymentData.payee_due_date = dueDate.toISOString().split('T')[0];
  
      const selectedCountry = this.countrySuggestions.find(
        (country) => country.name === paymentData.payee_country || country.iso2 === paymentData.payee_country
      );
      if (selectedCountry) {
        paymentData.payee_country = selectedCountry.iso2;
      } else {
        alert('Invalid country selected. Please choose a valid country.');
        return;
      }
  
      this.paymentService.addPayment(paymentData).subscribe(
        () => {
          alert('Payment added successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Failed to add payment', error);
          alert('An error occurred while adding the payment.');
        }
      );
    } else {
      alert('Please fill out all required fields.');
    }
  }  
}
