import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ServicesDataService, CountyService } from '../../services/services-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './services-management.component.html',
  styleUrl: './services-management.component.scss'
})
export class ServicesManagementComponent implements OnInit, OnDestroy {
  services: CountyService[] = [];
  showModal = false;
  editMode = false;
  currentService: CountyService | null = null;
  serviceForm!: FormGroup;
  searchTerm = '';
  private subscription?: Subscription;

  categories = [
    { id: 'business', name: 'Business & Trade' },
    { id: 'property', name: 'Property & Land' },
    { id: 'transport', name: 'Transport & Parking' },
    { id: 'health', name: 'Health Services' },
    { id: 'agriculture', name: 'Agriculture & Livestock' },
    { id: 'environment', name: 'Environment & Water' },
    { id: 'social', name: 'Social Services' }
  ];

  constructor(
    private fb: FormBuilder,
    private servicesDataService: ServicesDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm(): void {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      icon: ['', Validators.required],
      processingTime: ['', Validators.required],
      digitalAvailable: [false],
      featured: [false],
      contactInfo: [''],
      fees: this.fb.array([]),
      requirements: this.fb.array([]),
      locations: this.fb.array([])
    });
  }

  get feesArray(): FormArray {
    return this.serviceForm.get('fees') as FormArray;
  }

  get requirementsArray(): FormArray {
    return this.serviceForm.get('requirements') as FormArray;
  }

  get locationsArray(): FormArray {
    return this.serviceForm.get('locations') as FormArray;
  }

  addFee(): void {
    const feeGroup = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      period: ['']
    });
    this.feesArray.push(feeGroup);
  }

  removeFee(index: number): void {
    this.feesArray.removeAt(index);
  }

  addRequirement(): void {
    const reqControl = this.fb.control('', Validators.required);
    this.requirementsArray.push(reqControl);
  }

  removeRequirement(index: number): void {
    this.requirementsArray.removeAt(index);
  }

  addLocation(): void {
    const locControl = this.fb.control('', Validators.required);
    this.locationsArray.push(locControl);
  }

  removeLocation(index: number): void {
    this.locationsArray.removeAt(index);
  }

  loadServices(): void {
    this.subscription = this.servicesDataService.services$.subscribe(
      services => {
        this.services = services;
      }
    );
  }

  get filteredServices(): CountyService[] {
    if (!this.searchTerm) return this.services;
    
    const term = this.searchTerm.toLowerCase();
    return this.services.filter(service => 
      service.title.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term)
    );
  }

  openModal(service?: CountyService): void {
    this.showModal = true;
    
    // Clear arrays
    while (this.feesArray.length) this.feesArray.removeAt(0);
    while (this.requirementsArray.length) this.requirementsArray.removeAt(0);
    while (this.locationsArray.length) this.locationsArray.removeAt(0);

    if (service) {
      this.editMode = true;
      this.currentService = service;
      
      // Parse fees from JSON string
      let fees = [];
      try {
        fees = service.fees ? JSON.parse(service.fees) : [];
      } catch {
        fees = [];
      }

      this.serviceForm.patchValue({
        title: service.title,
        description: service.description,
        category: service.category,
        icon: service.icon,
        processingTime: service.processingTime || '',
        digitalAvailable: service.digitalAvailable || false,
        featured: service.featured || false,
        contactInfo: service.contactInfo || ''
      });
      
      // Add fees
      fees.forEach((fee: any) => {
        const feeGroup = this.fb.group({
          description: [fee.description, Validators.required],
          amount: [fee.amount, [Validators.required, Validators.min(0)]],
          period: [fee.period || '']
        });
        this.feesArray.push(feeGroup);
      });

      // Add requirements
      (service.requirements || []).forEach(req => {
        this.requirementsArray.push(this.fb.control(req, Validators.required));
      });

      // Add locations
      (service.location || []).forEach(loc => {
        this.locationsArray.push(this.fb.control(loc, Validators.required));
      });
    } else {
      this.editMode = false;
      this.currentService = null;
      this.serviceForm.reset({ digitalAvailable: false, featured: false });
      // Add one empty fee, requirement, and location
      this.addFee();
      this.addRequirement();
      this.addLocation();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.currentService = null;
    this.serviceForm.reset();
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) return;

    const formValue = this.serviceForm.value;
    const serviceData: CountyService = {
      id: this.editMode && this.currentService 
        ? this.currentService.id 
        : 'service-' + Date.now(),
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      icon: formValue.icon,
      fees: JSON.stringify(formValue.fees),
      requirements: formValue.requirements,
      processingTime: formValue.processingTime,
      location: formValue.locations,
      digitalAvailable: formValue.digitalAvailable,
      featured: formValue.featured,
      contactInfo: formValue.contactInfo
    };

    if (this.editMode && this.currentService) {
      this.servicesDataService.updateService(this.currentService.id, serviceData);
    } else {
      this.servicesDataService.addService(serviceData);
    }

    this.closeModal();
  }

  deleteService(service: CountyService): void {
    if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
      this.servicesDataService.deleteService(service.id);
    }
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'Variable';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getFees(service: CountyService): any[] {
    try {
      return service.fees ? JSON.parse(service.fees) : [];
    } catch {
      return [];
    }
  }

  trackByServiceId(index: number, service: CountyService): string {
    return service.id;
  }
}