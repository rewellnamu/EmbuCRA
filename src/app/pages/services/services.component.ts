import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { ServicesDataService, CountyService } from '../../services/services-data.service';
import { Subscription } from 'rxjs';

interface ServiceRequirement {
  document: string;
  required: boolean;
}

interface ServiceFee {
  description: string;
  amount: number;
  period?: string;
}

interface Service {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  fees: ServiceFee[];
  requirements: ServiceRequirement[];
  processingTime: string;
  location: string[];
  digitalAvailable: boolean;
  featured: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'services'
    },
  ],
})
export class ServicesComponent implements OnInit, OnDestroy {
  selectedCategory = 'all';
  selectedService: Service | null = null;
  services: Service[] = [];
  private subscription?: Subscription;
  
  categories = [
    { id: 'all', name: 'All Services', icon: '🏛️' },
    { id: 'business', name: 'Business & Trade', icon: '💼' },
    { id: 'property', name: 'Property & Land', icon: '🏘️' },
    { id: 'transport', name: 'Transport & Parking', icon: '🚗' },
    { id: 'health', name: 'Health Services', icon: '🏥' },
    { id: 'agriculture', name: 'Agriculture & Livestock', icon: '🌾' },
    { id: 'environment', name: 'Environment & Water', icon: '💧' },
    { id: 'social', name: 'Social Services', icon: '👥' }
  ];

  constructor(private servicesDataService: ServicesDataService) {}

  ngOnInit(): void {
    this.subscription = this.servicesDataService.services$.subscribe(
      services => {
        this.services = services.map(s => ({
          ...s,
          name: s.title,
          fees: this.parseFees(s.fees || ''),
          requirements: this.parseRequirements(s.requirements || []),
          processingTime: s.processingTime || '3-5 working days',
          location: s.location || ['ECRA Offices'],
          digitalAvailable: s.digitalAvailable || false,
          featured: s.featured || false
        }));
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private parseFees(feesString: string): ServiceFee[] {
    if (!feesString) return [];
    try {
      return JSON.parse(feesString);
    } catch {
      return [{ description: 'Service Fee', amount: 0, period: 'Variable' }];
    }
  }

  private parseRequirements(requirements: string[]): ServiceRequirement[] {
    if (!requirements || requirements.length === 0) {
      return [{ document: 'National ID', required: true }];
    }
    return requirements.map(req => ({
      document: req,
      required: true
    }));
  }

  getFilteredServices(): Service[] {
    if (this.selectedCategory === 'all') {
      return this.services;
    }
    return this.services.filter(service => service.category === this.selectedCategory);
  }

  getFeaturedServices(): Service[] {
    return this.services.filter(service => service.featured);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.selectedService = null;
  }

  selectService(service: Service): void {
    this.selectedService = this.selectedService?.id === service.id ? null : service;
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'Variable';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getTotalServices(): number {
    return this.services.length;
  }

  getDigitalServices(): number {
    return this.services.filter(s => s.digitalAvailable).length;
  }

  getAverageProcessingTime(): string {
    return '3-5 working days';
  }

  trackByServiceId(index: number, service: Service): string {
    return service.id;
  }

  getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(service => service.category === categoryId);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Services';
  }
}