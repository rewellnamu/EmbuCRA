import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DepartmentsService, Department, RevenueStream } from '../../services/departments.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-departments-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './departments-management.component.html',
  styleUrl: './departments-management.component.scss'
})
export class DepartmentsManagementComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  selectedDepartment: Department | null = null;
  showModal = false;
  showDetailsModal = false;
  editMode = false;
  currentDepartment: Department | null = null;
  departmentForm!: FormGroup;
  searchTerm = '';
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private departmentsService: DepartmentsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm(): void {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      shortName: [''],
      icon: ['', Validators.required],
      description: ['', Validators.required],
      revenueStreams: this.fb.array([])
    });
  }

  get revenueStreamsArray(): FormArray {
    return this.departmentForm.get('revenueStreams') as FormArray;
  }

  addRevenueStream(): void {
    const streamGroup = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
    this.revenueStreamsArray.push(streamGroup);
  }

  removeRevenueStream(index: number): void {
    this.revenueStreamsArray.removeAt(index);
  }

  loadDepartments(): void {
    // Subscribe to departments service
    this.subscription = this.departmentsService.departments$.subscribe(
      departments => {
        this.departments = departments;
      }
    );
  }

  get filteredDepartments(): Department[] {
    if (!this.searchTerm) return this.departments;
    
    const term = this.searchTerm.toLowerCase();
    return this.departments.filter(dept => 
      dept.name.toLowerCase().includes(term) ||
      dept.description.toLowerCase().includes(term) ||
      dept.revenueStreams.some(stream => stream.name.toLowerCase().includes(term))
    );
  }

  getTotalCountyRevenue(): number {
    return this.departmentsService.getTotalRevenue();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getPercentageOfTotal(departmentRevenue: number): number {
    const total = this.getTotalCountyRevenue();
    return total > 0 ? Math.round((departmentRevenue / total) * 100) : 0;
  }

  openModal(department?: Department): void {
    this.showModal = true;
    
    // Clear the form array first
    while (this.revenueStreamsArray.length) {
      this.revenueStreamsArray.removeAt(0);
    }

    if (department) {
      this.editMode = true;
      this.currentDepartment = department;
      this.departmentForm.patchValue({
        name: department.name,
        shortName: department.shortName || '',
        icon: department.icon,
        description: department.description
      });
      
      // Add existing revenue streams
      department.revenueStreams.forEach(stream => {
        const streamGroup = this.fb.group({
          name: [stream.name, Validators.required],
          description: [stream.description || '']
        });
        this.revenueStreamsArray.push(streamGroup);
      });
    } else {
      this.editMode = false;
      this.currentDepartment = null;
      this.departmentForm.reset();
      // Add one empty revenue stream for new departments
      this.addRevenueStream();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.currentDepartment = null;
    this.departmentForm.reset();
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) return;

    const formValue = this.departmentForm.value;
    const departmentData: Department = {
      id: this.editMode && this.currentDepartment 
        ? this.currentDepartment.id 
        : this.generateId(formValue.name),
      name: formValue.name,
      shortName: formValue.shortName || formValue.name,
      icon: formValue.icon,
      description: formValue.description,
      revenueStreams: formValue.revenueStreams,
      totalRevenue: this.editMode && this.currentDepartment 
        ? this.currentDepartment.totalRevenue 
        : Math.floor(Math.random() * 200000000) + 50000000
    };

    if (this.editMode && this.currentDepartment) {
      // Update existing department using service
      this.departmentsService.updateDepartment(this.currentDepartment.id, departmentData);
    } else {
      // Add new department using service
      this.departmentsService.addDepartment(departmentData);
    }

    this.closeModal();
  }

  generateId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20) + '-' + Date.now();
  }

  deleteDepartment(department: Department): void {
    if (confirm(`Are you sure you want to delete "${department.name}"? This will also remove all its revenue streams.`)) {
      this.departmentsService.deleteDepartment(department.id);
    }
  }

  viewDetails(department: Department): void {
    this.selectedDepartment = department;
    this.showDetailsModal = true;
  }

  closeDetails(): void {
    this.selectedDepartment = null;
    this.showDetailsModal = false;
  }

  trackByDepartmentId(index: number, department: Department): string {
    return department.id;
  }
}