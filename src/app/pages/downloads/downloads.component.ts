import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent {
  files = [
    { name: 'Revenue Payment Guidelines (PDF)', link: '/assets/docs/guidelines.pdf' },
    { name: 'Business Permit Application Form (PDF)', link: '/assets/docs/permit-form.pdf' }
  ];
}
