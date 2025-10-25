import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface RevenueStream {
  id: number;
  name: string;
  category: string;
  amount: string;
  status: 'active' | 'inactive';
  description: string;
}

@Component({
  selector: 'app-revenue-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './revenue-management.component.html',
  styleUrl: './revenue-management.component.scss'
})
export class RevenueManagementComponent implements OnInit {
  revenueStreams: RevenueStream[] = [];
  showModal = false;
  editMode = false;
  currentStream: RevenueStream | null = null;
  revenueForm!: FormGroup;
  searchTerm = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRevenueStreams();
  }

  initForm(): void {
    this.revenueForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['active', Validators.required],
      description: ['']
    });
  }

  loadRevenueStreams(): void {
    // Load from localStorage or initialize with sample data
    const stored = localStorage.getItem('embu_revenue_streams');
    if (stored) {
      this.revenueStreams = JSON.parse(stored);
    } else {
      this.revenueStreams = [
        {
          id: 1,
          name: 'Business Permits',
          category: 'Licenses',
          amount: 'KES 5,000',
          status: 'active',
          description: 'Annual business operating permits'
        },
        {
          id: 2,
          name: 'Market Fees',
          category: 'Trade',
          amount: 'KES 200',
          status: 'active',
          description: 'Daily market stall fees'
        },
        {
          id: 3,
          name: 'Parking Fees',
          category: 'Transport',
          amount: 'KES 50',
          status: 'active',
          description: 'Public parking charges'
        },
        {
          id: 4,
          name: 'Land Rates',
          category: 'Property',
          amount: 'KES 10,000',
          status: 'active',
          description: 'Annual property land rates'
        }
      ];
      this.saveToStorage();
    }
  }

  saveToStorage(): void {
    localStorage.setItem('embu_revenue_streams', JSON.stringify(this.revenueStreams));
  }

  get filteredStreams(): RevenueStream[] {
    if (!this.searchTerm) return this.revenueStreams;
    
    const term = this.searchTerm.toLowerCase();
    return this.revenueStreams.filter(stream => 
      stream.name.toLowerCase().includes(term) ||
      stream.category.toLowerCase().includes(term) ||
      stream.description.toLowerCase().includes(term)
    );
  }

  openModal(stream?: RevenueStream): void {
    this.showModal = true;
    if (stream) {
      this.editMode = true;
      this.currentStream = stream;
      this.revenueForm.patchValue({
        name: stream.name,
        category: stream.category,
        amount: stream.amount.replace('KES ', '').replace(',', ''),
        status: stream.status,
        description: stream.description
      });
    } else {
      this.editMode = false;
      this.currentStream = null;
      this.revenueForm.reset({ status: 'active' });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.currentStream = null;
    this.revenueForm.reset();
  }

  onSubmit(): void {
    if (this.revenueForm.invalid) return;

    const formValue = this.revenueForm.value;
    const streamData = {
      name: formValue.name,
      category: formValue.category,
      amount: `KES ${parseFloat(formValue.amount).toLocaleString()}`,
      status: formValue.status,
      description: formValue.description
    };

    if (this.editMode && this.currentStream) {
      const index = this.revenueStreams.findIndex(s => s.id === this.currentStream!.id);
      this.revenueStreams[index] = { ...this.currentStream, ...streamData };
    } else {
      const newStream: RevenueStream = {
        id: Date.now(),
        ...streamData
      };
      this.revenueStreams.unshift(newStream);
    }

    this.saveToStorage();
    this.closeModal();
  }

  deleteStream(stream: RevenueStream): void {
    if (confirm(`Are you sure you want to delete "${stream.name}"?`)) {
      this.revenueStreams = this.revenueStreams.filter(s => s.id !== stream.id);
      this.saveToStorage();
    }
  }

  toggleStatus(stream: RevenueStream): void {
    stream.status = stream.status === 'active' ? 'inactive' : 'active';
    this.saveToStorage();
  }
}