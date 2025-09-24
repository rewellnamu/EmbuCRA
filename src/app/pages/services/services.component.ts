import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  selectedCategory = 'all';
  selectedService: Service | null = null;
  
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

  services: Service[] = [
    // Business & Trade Services
    {
      id: 'single-business-permit',
      name: 'Single Business Permit (SBP)',
      description: 'Unified business licensing system combining multiple permits into one comprehensive permit for ease of doing business.',
      category: 'business',
      icon: '📋',
      fees: [
        { description: 'Small Business (Turnover < 1M)', amount: 3000 },
        { description: 'Medium Business (1M - 5M)', amount: 10000 },
        { description: 'Large Business (> 5M)', amount: 25000 }
      ],
      requirements: [
        { document: 'Business Registration Certificate', required: true },
        { document: 'National ID/Passport', required: true },
        { document: 'KRA PIN Certificate', required: true },
        { document: 'Lease Agreement/Title Deed', required: true },
        { document: 'Site Plan', required: false }
      ],
      processingTime: '3-5 working days',
      location: ['ECRA Offices - Embu', 'Sub-County Offices', 'Online Portal'],
      digitalAvailable: true,
      featured: true
    },
    {
      id: 'liquor-license',
      name: 'Liquor Licensing',
      description: 'Permits for sale, manufacture, and distribution of alcoholic beverages within Embu County.',
      category: 'business',
      icon: '🍺',
      fees: [
        { description: 'Wine & Beer License', amount: 15000, period: 'annual' },
        { description: 'Spirits License', amount: 30000, period: 'annual' },
        { description: 'Manufacturer License', amount: 50000, period: 'annual' }
      ],
      requirements: [
        { document: 'Business Permit', required: true },
        { document: 'Certificate of Good Conduct', required: true },
        { document: 'Premises Inspection Report', required: true },
        { document: 'Fire Safety Certificate', required: true }
      ],
      processingTime: '7-10 working days',
      location: ['ECRA Headquarters', 'Trade Department'],
      digitalAvailable: false,
      featured: false
    },
    {
      id: 'market-stalls',
      name: 'Market Stall Allocation',
      description: 'Rental and allocation of market stalls in county markets for trade and business activities.',
      category: 'business',
      icon: '🏪',
      fees: [
        { description: 'Permanent Stall', amount: 2000, period: 'monthly' },
        { description: 'Temporary Stall', amount: 100, period: 'daily' },
        { description: 'Market Entry Fee', amount: 20, period: 'daily' }
      ],
      requirements: [
        { document: 'National ID', required: true },
        { document: 'Business Permit', required: false },
        { document: 'Medical Certificate', required: true }
      ],
      processingTime: 'Same day',
      location: ['Various County Markets', 'Market Administration Offices'],
      digitalAvailable: true,
      featured: true
    },

    // Property & Land Services
    {
      id: 'property-rates',
      name: 'Property Rates Payment',
      description: 'Annual property tax based on the unimproved site value of land and properties within the county.',
      category: 'property',
      icon: '🏠',
      fees: [
        { description: 'Residential Property', amount: 0, period: 'Rate varies by valuation' },
        { description: 'Commercial Property', amount: 0, period: 'Rate varies by valuation' },
        { description: 'Industrial Property', amount: 0, period: 'Rate varies by valuation' }
      ],
      requirements: [
        { document: 'Title Deed', required: true },
        { document: 'National ID', required: true },
        { document: 'Previous Rate Payment Receipt', required: false }
      ],
      processingTime: 'Immediate',
      location: ['ECRA Offices', 'Online Portal', 'Mobile Money'],
      digitalAvailable: true,
      featured: true
    },
    {
      id: 'subdivision-approval',
      name: 'Land Subdivision Approval',
      description: 'Approval for subdivision of land parcels and issuance of subdivision permits.',
      category: 'property',
      icon: '📏',
      fees: [
        { description: 'Survey Fee', amount: 15000 },
        { description: 'Approval Fee', amount: 5000 },
        { description: 'Processing Fee', amount: 2000 }
      ],
      requirements: [
        { document: 'Original Title Deed', required: true },
        { document: 'Survey Plan', required: true },
        { document: 'Environmental Impact Assessment', required: true },
        { document: 'Site Plan', required: true }
      ],
      processingTime: '14-21 working days',
      location: ['Lands Department', 'Physical Planning Office'],
      digitalAvailable: false,
      featured: false
    },

    // Transport & Parking Services
    {
      id: 'parking-fees',
      name: 'Digital Parking Payment',
      description: 'Convenient digital payment system for vehicle parking in designated county parking zones.',
      category: 'transport',
      icon: '🅿️',
      fees: [
        { description: 'Hourly Parking', amount: 20, period: 'per hour' },
        { description: 'Daily Parking', amount: 100, period: 'per day' },
        { description: 'Monthly Pass', amount: 1500, period: 'monthly' }
      ],
      requirements: [
        { document: 'Vehicle Registration', required: false },
        { document: 'Mobile Phone', required: true }
      ],
      processingTime: 'Instant',
      location: ['CBD Parking Zones', 'Mobile App', 'SMS Service'],
      digitalAvailable: true,
      featured: true
    },
    {
      id: 'transport-permits',
      name: 'Transport & PSV Permits',
      description: 'Permits for public service vehicles, matatu stages, and transport operations.',
      category: 'transport',
      icon: '🚌',
      fees: [
        { description: 'PSV Permit', amount: 5000, period: 'annual' },
        { description: 'Stage License', amount: 10000, period: 'annual' },
        { description: 'Route Permit', amount: 3000, period: 'annual' }
      ],
      requirements: [
        { document: 'Vehicle Logbook', required: true },
        { document: 'Insurance Certificate', required: true },
        { document: 'Road License', required: true },
        { document: 'Driver\'s License', required: true }
      ],
      processingTime: '5-7 working days',
      location: ['Transport Department', 'ECRA Offices'],
      digitalAvailable: false,
      featured: false
    },

    // Health Services
    {
      id: 'health-certificates',
      name: 'Health Certificates',
      description: 'Medical certificates for food handlers, business operators, and health clearances.',
      category: 'health',
      icon: '🏥',
      fees: [
        { description: 'Food Handler Certificate', amount: 300 },
        { description: 'Business Health Certificate', amount: 1000 },
        { description: 'Health Clearance', amount: 500 }
      ],
      requirements: [
        { document: 'National ID', required: true },
        { document: 'Medical Examination', required: true },
        { document: 'Passport Photo', required: true }
      ],
      processingTime: '1-2 working days',
      location: ['County Health Facilities', 'Public Health Office'],
      digitalAvailable: false,
      featured: false
    },

    // Agriculture & Livestock Services
    {
      id: 'veterinary-services',
      name: 'Veterinary Services',
      description: 'Animal health services, livestock registration, and veterinary permits.',
      category: 'agriculture',
      icon: '🐄',
      fees: [
        { description: 'Livestock Registration', amount: 500, period: 'per animal' },
        { description: 'Vaccination Services', amount: 200, period: 'per animal' },
        { description: 'Health Certificate', amount: 1000 }
      ],
      requirements: [
        { document: 'National ID', required: true },
        { document: 'Livestock Ownership Proof', required: true }
      ],
      processingTime: 'Same day',
      location: ['Veterinary Offices', 'Livestock Markets'],
      digitalAvailable: false,
      featured: false
    },
    {
      id: 'cess-collection',
      name: 'Agricultural Produce Cess',
      description: 'Tax collection on agricultural produce transported within and outside the county.',
      category: 'agriculture',
      icon: '🚚',
      fees: [
        { description: 'Coffee Cess', amount: 2, period: 'per kg' },
        { description: 'Tea Cess', amount: 1, period: 'per kg' },
        { description: 'General Produce', amount: 50, period: 'per ton' }
      ],
      requirements: [
        { document: 'Produce Manifest', required: true },
        { document: 'Transport Permit', required: true }
      ],
      processingTime: 'Instant',
      location: ['County Barriers', 'Agricultural Offices'],
      digitalAvailable: true,
      featured: false
    },

    // Environment & Water Services
    {
      id: 'water-connection',
      name: 'Water Connection Services',
      description: 'New water connections, reconnections, and water service applications.',
      category: 'environment',
      icon: '💧',
      fees: [
        { description: 'New Connection', amount: 5000 },
        { description: 'Reconnection Fee', amount: 2000 },
        { description: 'Meter Installation', amount: 3000 }
      ],
      requirements: [
        { document: 'National ID', required: true },
        { document: 'Proof of Land Ownership', required: true },
        { document: 'Site Plan', required: true }
      ],
      processingTime: '7-14 working days',
      location: ['Water Department', 'Sub-County Offices'],
      digitalAvailable: true,
      featured: false
    },
    {
      id: 'borehole-permit',
      name: 'Borehole Drilling Permits',
      description: 'Permits for drilling boreholes and groundwater abstraction.',
      category: 'environment',
      icon: '🏗️',
      fees: [
        { description: 'Drilling Permit', amount: 10000 },
        { description: 'Water Abstraction License', amount: 5000 },
        { description: 'Environmental Clearance', amount: 3000 }
      ],
      requirements: [
        { document: 'Land Ownership Document', required: true },
        { document: 'Hydrogeological Survey', required: true },
        { document: 'Environmental Impact Assessment', required: true }
      ],
      processingTime: '14-21 working days',
      location: ['Water Resources Department', 'ECRA Headquarters'],
      digitalAvailable: false,
      featured: false
    }
  ];

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