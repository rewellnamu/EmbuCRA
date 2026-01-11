import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { TendersService, Tender } from '../../services/tenders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tenders',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'tenders'
    },
  ],
})
export class TendersComponent implements OnInit, OnDestroy {
  tenders: Tender[] = [];
  selectedTender: Tender | null = null;
  private subscription?: Subscription;

  constructor(private tendersService: TendersService) {}

  ngOnInit(): void {
    // Subscribe to tenders from service
    this.subscription = this.tendersService.tenders$.subscribe(
      tenders => {
        this.tenders = tenders;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openTenderDetails(tender: Tender): void {
    this.selectedTender = tender;
  }

  downloadTenderDocs(tender: Tender): void {
    if (tender.documentUrl) {
      window.open(tender.documentUrl, '_blank');
    } else {
      // Alert message will be translated in template
      this.selectedTender = tender;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'open':
        return '#27ae60';
      case 'closed':
        return '#e74c3c';
      case 'awarded':
        return '#3498db';
      default:
        return '#6c757d';
    }
  }

  formatCurrency(amount?: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}