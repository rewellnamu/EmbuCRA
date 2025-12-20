import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  openingDate: string;
  closingDate: string;
  status: 'open' | 'closed' | 'awarded';
  value?: number;
  documentUrl?: string;
  isDefault?: boolean; // Flag to identify default tenders
}

@Injectable({
  providedIn: 'root'
})
export class TendersService {
  private readonly STORAGE_KEY = 'embu_tenders';
  private tendersSubject!: BehaviorSubject<Tender[]>;
  public tenders$!: Observable<Tender[]>;

  constructor() {
    // Initialize tenders immediately
    const initialTenders = this.initializeTenders();
    this.tendersSubject = new BehaviorSubject<Tender[]>(initialTenders);
    this.tenders$ = this.tendersSubject.asObservable();
    
    console.log('TendersService initialized with', initialTenders.length, 'tenders');
  }

  // Initialize tenders - always loads defaults first
  private initializeTenders(): Tender[] {
    const defaultTenders = this.getDefaultTenders();
    const stored = this.loadFromStorage();

    // If no stored data or stored is empty, use defaults
    if (!stored || stored.length === 0) {
      console.log('No stored tenders, using defaults');
      this.saveToStorage(defaultTenders);
      return defaultTenders;
    }

    // Merge: Keep default tenders always, add any custom ones
    const customTenders = stored.filter(tender => !tender.isDefault);
    const mergedTenders = [...defaultTenders, ...customTenders];
    
    console.log('Merged tenders:', mergedTenders.length);
    this.saveToStorage(mergedTenders);
    return mergedTenders;
  }

  // Get current tenders value
  getTenders(): Tender[] {
    return this.tendersSubject.value;
  }

  // Get tenders as observable
  getTenders$(): Observable<Tender[]> {
    return this.tenders$;
  }

  // Get single tender by ID
  getTenderById(id: string): Tender | undefined {
    return this.tendersSubject.value.find(tender => tender.id === id);
  }

  // Add new tender (custom only, cannot override defaults)
  addTender(tender: Tender): void {
    if (this.isDefaultTenderId(tender.id)) {
      console.warn('Cannot add tender with default ID:', tender.id);
      return;
    }
    tender.isDefault = false; // Mark as custom
    const tenders = [tender, ...this.tendersSubject.value];
    this.saveToStorage(tenders);
  }

  // Update existing tender (can only update custom tenders)
  updateTender(id: string, updatedTender: Tender): void {
    const existing = this.getTenderById(id);
    if (existing?.isDefault) {
      console.warn('Cannot update default tender:', id);
      return;
    }
    
    const tenders = this.tendersSubject.value.map(tender =>
      tender.id === id ? { ...updatedTender, isDefault: false } : tender
    );
    this.saveToStorage(tenders);
  }

  // Delete tender (can only delete custom tenders)
  deleteTender(id: string): void {
    const existing = this.getTenderById(id);
    if (existing?.isDefault) {
      console.warn('Cannot delete default tender:', id);
      return;
    }
    
    const tenders = this.tendersSubject.value.filter(tender => tender.id !== id);
    this.saveToStorage(tenders);
  }

  // Reset to default tenders
  resetToDefaults(): void {
    const defaults = this.getDefaultTenders();
    this.saveToStorage(defaults);
    console.log('Tenders reset to defaults');
  }

  // Get open tenders only
  getOpenTenders(): Tender[] {
    return this.tendersSubject.value.filter(tender => tender.status === 'open');
  }

  // Get tenders by category
  getTendersByCategory(category: string): Tender[] {
    return this.tendersSubject.value.filter(tender => tender.category === category);
  }

  // Check if ID belongs to a default tender
  private isDefaultTenderId(id: string): boolean {
    const defaultIds = [
      'tender-road-embu-2024',
      'tender-medical-equipment-2024',
      'tender-water-supply-2024',
      'tender-ict-infrastructure-2024',
      'tender-market-modernization-2024',
      'tender-waste-management-2024'
    ];
    return defaultIds.includes(id);
  }

  // Private methods
  private loadFromStorage(): Tender[] {
    try {
      // Check if localStorage is available (not available in some test environments)
      if (typeof localStorage === 'undefined') {
        return [];
      }
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Loaded from storage:', parsed.length, 'tenders');
        return parsed;
      }
    } catch (e) {
      console.error('Error loading tenders from storage:', e);
    }
    return [];
  }

  private saveToStorage(tenders: Tender[]): void {
    try {
      // Check if localStorage is available and tendersSubject is initialized
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tenders));
        console.log('Saved to storage:', tenders.length, 'tenders');
      }
      
      // Update the subject only if it's initialized
      if (this.tendersSubject) {
        this.tendersSubject.next(tenders);
      }
    } catch (e) {
      console.error('Error saving tenders to storage:', e);
    }
  }

  // Get default tenders - these are always loaded
  private getDefaultTenders(): Tender[] {
    const defaultTenders: Tender[] = [
      {
        id: 'tender-road-embu-2024',
        title: 'Road Construction Project - Embu Town',
        description: 'Construction and rehabilitation of 5km road network in Embu town including drainage systems, street lighting, and pedestrian walkways.',
        category: 'Infrastructure',
        openingDate: '2024-10-01',
        closingDate: '2024-11-15',
        status: 'open',
        value: 25000000,
        documentUrl: '/documents/tenders/road-embu-2024.pdf',
        isDefault: true
      },
      {
        id: 'tender-medical-equipment-2024',
        title: 'Supply of Medical Equipment',
        description: 'Procurement of modern medical equipment for Level 4 hospitals across Embu County including ultrasound machines, patient monitors, and laboratory equipment.',
        category: 'Health',
        openingDate: '2024-09-15',
        closingDate: '2024-10-30',
        status: 'open',
        value: 15000000,
        documentUrl: '/documents/tenders/medical-equipment-2024.pdf',
        isDefault: true
      },
      {
        id: 'tender-water-supply-2024',
        title: 'Water Supply Infrastructure Upgrade',
        description: 'Upgrading water supply systems in rural areas including drilling of boreholes, installation of water tanks, and pipeline network expansion.',
        category: 'Water & Environment',
        openingDate: '2024-11-01',
        closingDate: '2024-12-15',
        status: 'open',
        value: 18000000,
        documentUrl: '/documents/tenders/water-supply-2024.pdf',
        isDefault: true
      },
      {
        id: 'tender-ict-infrastructure-2024',
        title: 'ICT Infrastructure Development',
        description: 'Supply, installation and configuration of ICT equipment for county offices including computers, servers, networking equipment and software licenses.',
        category: 'ICT',
        openingDate: '2024-10-15',
        closingDate: '2024-11-30',
        status: 'open',
        value: 12000000,
        documentUrl: '/documents/tenders/ict-infrastructure-2024.pdf',
        isDefault: true
      },
      {
        id: 'tender-market-modernization-2024',
        title: 'Market Modernization Project',
        description: 'Construction and modernization of county markets including stalls, sanitation facilities, waste management systems and parking areas.',
        category: 'Trade & Commerce',
        openingDate: '2024-09-20',
        closingDate: '2024-11-05',
        status: 'open',
        value: 22000000,
        documentUrl: '/documents/tenders/market-modernization-2024.pdf',
        isDefault: true
      },
      {
        id: 'tender-waste-management-2024',
        title: 'Solid Waste Management Services',
        description: 'Provision of solid waste collection, transportation and disposal services for Embu County including supply of waste collection equipment.',
        category: 'Environment',
        openingDate: '2024-08-01',
        closingDate: '2024-10-15',
        status: 'closed',
        value: 8000000,
        documentUrl: '/documents/tenders/waste-management-2024.pdf',
        isDefault: true
      }
    ];

    return defaultTenders;
  }
}