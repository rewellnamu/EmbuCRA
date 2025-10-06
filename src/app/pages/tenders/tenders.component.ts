import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss'],
})
export class TendersComponent {
  tenders = [
    { title: 'Supply of Office Equipment', closing: '2025-10-15' },
    { title: 'Construction of Market Stalls', closing: '2025-11-05' },
  ];

  selectedTender: any = null;

  openTenderDetails(tender: any) {
    this.selectedTender = tender;
  }

  downloadTenderDocs(tender: any) {
    // Implement actual download logic here
    alert('Download for "' + tender.title + '" not implemented.');
  }
}
