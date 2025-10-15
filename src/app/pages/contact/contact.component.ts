import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
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
    
    this.successMessage = 'Thank you for contacting us! We will get back to you soon.';
    
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