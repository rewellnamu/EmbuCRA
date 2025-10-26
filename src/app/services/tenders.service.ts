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
}

@Injectable({
  providedIn: 'root'
})
export class TendersService {
  private readonly STORAGE_KEY = 'embu_tenders';
  private tendersSubject = new BehaviorSubject<Tender[]>(this.loadFromStorage());
  public tenders$: Observable<Tender[]> = this.tendersSubject.asObservable();

  constructor() {
    if (this.tendersSubject.value.length === 0) {
      this.initializeDefaultTenders();
    }
  }

  getTenders(): Tender[] {
    return this.tendersSubject.value;
  }

  getTenders$(): Observable<Tender[]> {
    return this.tenders$;
  }

  getTenderById(id: string): Tender | undefined {
    return this.tendersSubject.value.find(tender => tender.id === id);
  }

  addTender(tender: Tender): void {
    const tenders = [tender, ...this.tendersSubject.value];
    this.saveToStorage(tenders);
  }

  updateTender(id: string, updatedTender: Tender): void {
    const tenders = this.tendersSubject.value.map(tender =>
      tender.id === id ? updatedTender : tender
    );
    this.saveToStorage(tenders);
  }

  deleteTender(id: string): void {
    const tenders = this.tendersSubject.value.filter(tender => tender.id !== id);
    this.saveToStorage(tenders);
  }

  private loadFromStorage(): Tender[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading tenders from storage:', e);
        return [];
      }
    }
    return [];
  }

  private saveToStorage(tenders: Tender[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tenders));
    this.tendersSubject.next(tenders);
  }

  private initializeDefaultTenders(): void {
    const defaultTenders: Tender[] = [
      {
        id: 'tender-1',
        title: 'Road Construction Project - Embu Town',
        description: 'Construction and rehabilitation of 5km road network in Embu town',
        category: 'Infrastructure',
        openingDate: '2024-10-01',
        closingDate: '2024-11-15',
        status: 'open',
        value: 25000000
      },
      {
        id: 'tender-2',
        title: 'Supply of Medical Equipment',
        description: 'Procurement of medical equipment for Level 4 hospitals',
        category: 'Health',
        openingDate: '2024-09-15',
        closingDate: '2024-10-30',
        status: 'open',
        value: 15000000
      }
    ];
    this.saveToStorage(defaultTenders);
  }
}