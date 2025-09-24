import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent {
  faqs = [
    { q: 'How do I pay my county revenue?', a: 'You can pay through mobile money (M-Pesa) or via county revenue offices.' },
    { q: 'Where do I apply for a business permit?', a: 'Applications are available online or at the county offices.' },
    { q: 'Are there penalties for late payments?', a: 'Yes, penalties are charged based on the type of revenue owed.' },
  ];
}
