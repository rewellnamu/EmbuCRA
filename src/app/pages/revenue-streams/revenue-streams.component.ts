import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';

@Component({
  selector: 'app-revenue-streams',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './revenue-streams.component.html',
  styleUrls: ['./revenue-streams.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'revenuestreams'  // Changed to match new file name
    },
  ],
})
export class RevenueStreamsComponent {
  streams = [
    'businessPermits',
    'landRates',
    'parkingFees',
    'marketFees',
    'cessCollection',
    'advertising'
  ];
}