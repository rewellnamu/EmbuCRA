import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TendersService, Tender } from '../../services/tenders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tenders-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tenders-management.component.html',
  styleUrl: './tenders-management.component.scss'
})
export class TendersManagementComponent implements OnInit, OnDestroy {
  tenders: Tender[] = [];
  showModal = false;
  editMode = false;
  currentTender: Tender | null = null;
  tenderForm!: FormGroup;
  searchTerm = '';
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private tendersService: TendersService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTenders();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm(): void {
    this.tenderForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      openingDate: ['', Validators.required],
      closingDate: ['', Validators.required],
      status: ['open', Validators.required],
      value: [''],
      documentUrl: ['']
    });
  }

  loadTenders(): void {
    this.subscription = this.tendersService.tenders$.subscribe(
      tenders => {
        this.tenders = tenders;
      }
    );
  }

  get filteredTenders(): Tender[] {
    if (!this.searchTerm) return this.tenders;
    
    const term = this.searchTerm.toLowerCase();
    return this.tenders.filter(tender => 
      tender.title.toLowerCase().includes(term) ||
      tender.description.toLowerCase().includes(term) ||
      tender.category.toLowerCase().includes(term)
    );
  }

  openModal(tender?: Tender): void {
    this.showModal = true;
    
    if (tender) {
      this.editMode = true;
      this.currentTender = tender;
      this.tenderForm.patchValue({
        title: tender.title,
        description: tender.description,
        category: tender.category,
        openingDate: tender.openingDate,
        closingDate: tender.closingDate,
        status: tender.status,
        value: tender.value || '',
        documentUrl: tender.documentUrl || ''
      });
    } else {
      this.editMode = false;
      this.currentTender = null;
      this.tenderForm.reset({ status: 'open' });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.currentTender = null;
    this.tenderForm.reset();
  }

  onSubmit(): void {
    if (this.tenderForm.invalid) return;

    const formValue = this.tenderForm.value;
    const tenderData: Tender = {
      id: this.editMode && this.currentTender 
        ? this.currentTender.id 
        : 'tender-' + Date.now(),
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      openingDate: formValue.openingDate,
      closingDate: formValue.closingDate,
      status: formValue.status,
      value: formValue.value ? parseFloat(formValue.value) : undefined,
      documentUrl: formValue.documentUrl || undefined
    };

    if (this.editMode && this.currentTender) {
      this.tendersService.updateTender(this.currentTender.id, tenderData);
    } else {
      this.tendersService.addTender(tenderData);
    }

    this.closeModal();
  }

  deleteTender(tender: Tender): void {
    if (confirm(`Are you sure you want to delete "${tender.title}"?`)) {
      this.tendersService.deleteTender(tender.id);
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'open':
        return 'badge-success';
      case 'closed':
        return 'badge-danger';
      case 'awarded':
        return 'badge-info';
      default:
        return 'badge-secondary';
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

  trackByTenderId(index: number, tender: Tender): string {
    return tender.id;
  }
}