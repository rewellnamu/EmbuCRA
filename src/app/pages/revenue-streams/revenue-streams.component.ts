import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revenue-streams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-streams.component.html',
  styleUrls: ['./revenue-streams.component.scss']
})
export class RevenueStreamsComponent {
  streams = [
    'Business Permits',
    'Land Rates',
    'Parking Fees',
    'Market Fees',
    'Cess Collection',
    'Advertising & Billboards'
  ];
}
