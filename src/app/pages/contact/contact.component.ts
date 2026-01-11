import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'contact'
    },
  ],
})
export class ContactComponent {
  contacts = {
    phone: '0718500767',
    email: 'ecra@embu.go.ke',
    address: 'Embu County Headquarters, Embu, Kenya',
  };

  form = {
    name: '',
    email: '',
    message: '',
  };

  successMessage = '';

  onSubmit() {
    // Simulate form submission
    console.log('Form submitted:', this.form);
    
    this.successMessage = 'success'; // Changed to translation key
    
    // Reset form
    this.form = { 
      name: '', 
      email: '', 
      message: '' 
    };
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }
}