import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contacts = {
    phone: '0718500767',
    email: 'ecra@embu.go.ke',
    address: 'Embu County Headquarters, Embu, Kenya'
  };
}
