import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RevenueStream {
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  shortName?: string;
  icon: string;
  description: string;
  revenueStreams: RevenueStream[];
  totalRevenue?: number;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private readonly STORAGE_KEY = 'embu_departments';
  private departmentsSubject!: BehaviorSubject<Department[]>;
  public departments$!: Observable<Department[]>;

  constructor() {
    // Initialize departments immediately
    const initialDepartments = this.initializeDepartments();
    this.departmentsSubject = new BehaviorSubject<Department[]>(initialDepartments);
    this.departments$ = this.departmentsSubject.asObservable();
    
    console.log('DepartmentsService initialized with', initialDepartments.length, 'departments');
  }

  // Initialize departments - always loads defaults first
  private initializeDepartments(): Department[] {
    const defaultDepartments = this.getDefaultDepartments();
    const stored = this.loadFromStorage();

    // If no stored data or stored is empty, use defaults
    if (!stored || stored.length === 0) {
      console.log('No stored departments, using defaults');
      this.saveToStorage(defaultDepartments);
      return defaultDepartments;
    }

    // Merge: Keep default departments always, add any custom ones
    const customDepartments = stored.filter(dept => !dept.isDefault);
    const mergedDepartments = [...defaultDepartments, ...customDepartments];
    
    console.log('Merged departments:', mergedDepartments.length);
    this.saveToStorage(mergedDepartments);
    return mergedDepartments;
  }

  // Get current departments value
  getDepartments(): Department[] {
    return this.departmentsSubject.value;
  }

  // Get departments as observable
  getDepartments$(): Observable<Department[]> {
    return this.departments$;
  }

  // Get single department by ID
  getDepartmentById(id: string): Department | undefined {
    return this.departmentsSubject.value.find(dept => dept.id === id);
  }

  // Add new department (custom only)
  addDepartment(department: Department): void {
    if (this.isDefaultDepartmentId(department.id)) {
      console.warn('Cannot add department with default ID:', department.id);
      return;
    }
    department.isDefault = false;
    const departments = [...this.departmentsSubject.value, department];
    this.saveToStorage(departments);
  }

  // Update existing department (can only update custom departments)
  updateDepartment(id: string, updatedDepartment: Department): void {
    const existing = this.getDepartmentById(id);
    if (existing?.isDefault) {
      console.warn('Cannot update default department:', id);
      return;
    }
    
    const departments = this.departmentsSubject.value.map(dept =>
      dept.id === id ? { ...updatedDepartment, isDefault: false } : dept
    );
    this.saveToStorage(departments);
  }

  // Delete department (can only delete custom departments)
  deleteDepartment(id: string): void {
    const existing = this.getDepartmentById(id);
    if (existing?.isDefault) {
      console.warn('Cannot delete default department:', id);
      return;
    }
    
    const departments = this.departmentsSubject.value.filter(dept => dept.id !== id);
    this.saveToStorage(departments);
  }

  // Reset to default departments
  resetToDefaults(): void {
    const defaults = this.getDefaultDepartments();
    this.saveToStorage(defaults);
    console.log('Departments reset to defaults');
  }

  // Calculate total county revenue
  getTotalRevenue(): number {
    return this.departmentsSubject.value.reduce(
      (total, dept) => total + (dept.totalRevenue || 0),
      0
    );
  }

  // Check if ID belongs to a default department
  private isDefaultDepartmentId(id: string): boolean {
    const defaultIds = [
      'finance', 'trade-tourism', 'lands-housing', 'administration',
      'roads-transport', 'youth-gender', 'education', 'agriculture',
      'water-environment', 'health'
    ];
    return defaultIds.includes(id);
  }

  // Private methods
private loadFromStorage(): Department[] {
  try {
    // Check if localStorage is available (not available in some test environments)
    if (typeof localStorage === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded from storage:', parsed.length, 'departments');
      return parsed;
    }
  } catch (e) {
    console.error('Error loading departments from storage:', e);
  }
  return [];
}

private saveToStorage(departments: Department[]): void {
  try {
    // Check if localStorage is available and departmentsSubject is initialized
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(departments));
      console.log('Saved to storage:', departments.length, 'departments');
    }
    
    // Update the subject only if it's initialized
    if (this.departmentsSubject) {
      this.departmentsSubject.next(departments);
    }
  } catch (e) {
    console.error('Error saving departments to storage:', e);
  }
}
  // Get default departments - these are always loaded
  private getDefaultDepartments(): Department[] {
    const defaultDepartments: Department[] = [
      {
        id: 'finance',
        name: 'Finance & Economic Planning (ECRA)',
        shortName: 'Finance & Economic Planning',
        icon: '💰',
        description: 'Responsible for financial planning, budgeting, and various revenue collection activities including market operations and business permits.',
        totalRevenue: 185000000,
        isDefault: true,
        revenueStreams: [
          { name: 'SBP (Single Business Permit)', description: 'Business licensing and permits' },
          { name: 'Stalls Rent', description: 'Market stall rental fees' },
          { name: 'Market Fees', description: 'Market operation and trading fees' },
          { name: 'Miraa Fees', description: 'Miraa trading and licensing fees' },
          { name: 'Buspark', description: 'Bus park and transport terminal fees' },
          { name: 'Street Parking', description: 'Street parking and metered parking fees' },
          { name: 'Cess', description: 'Agricultural produce cess collection' },
          { name: 'Advert Fees', description: 'Advertisement and signage fees' },
          { name: 'Miscellaneous', description: 'Other miscellaneous revenue' },
          { name: 'Technical Fees', description: 'Technical services and consultations' },
          { name: 'Audit Fee', description: 'Audit and compliance services' },
          { name: 'Public Health (Sub County)', description: 'Public health fees' },
        ]
      },
      {
        id: 'trade-tourism',
        name: 'Trade, Tourism, Investment and Industrialization',
        shortName: 'Trade & Tourism',
        icon: '🏢',
        description: 'Promotes trade, tourism, investment opportunities and manages related revenue streams.',
        totalRevenue: 125000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Liquor', description: 'Liquor licensing and permits' },
          { name: 'Weights', description: 'Weights and measures certification' },
          { name: 'Mwea National Park', description: 'Tourism and park-related fees' },
        ]
      },
      {
        id: 'lands-housing',
        name: 'Lands, Housing, Physical Planning and Urban Development',
        shortName: 'Lands, Housing & Urban Development',
        icon: '🏘️',
        description: 'Handles land administration, housing, physical planning and urban development revenue.',
        totalRevenue: 165000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Land Rates', description: 'Property rates and land taxes' },
          { name: 'Subdivision', description: 'Land subdivision and planning fees' },
          { name: 'House Rent', description: 'County housing rental income' },
        ]
      },
      {
        id: 'administration',
        name: 'Administration, Public Service & ICT',
        shortName: 'Administration & ICT',
        icon: '⚙️',
        description: 'Manages administrative services, public service delivery and ICT infrastructure.',
        totalRevenue: 95000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Enforcement', description: 'Revenue enforcement and compliance fees' },
        ]
      },
      {
        id: 'roads-transport',
        name: 'Roads, Transport & Public Works',
        shortName: 'Roads & Transport',
        icon: '🚧',
        description: 'Responsible for road infrastructure, transport services and public works projects.',
        totalRevenue: 112000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Cemetery', description: 'Cemetery services and burial fees' },
        ]
      },
      {
        id: 'youth-gender',
        name: 'Youth, Gender, Sports, Culture & Social Services',
        shortName: 'Youth, Gender & Sports',
        icon: '🏃',
        description: 'Promotes youth development, gender equality, sports, culture and social services.',
        totalRevenue: 78000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Youth Empowerment', description: 'Youth development programs and services' },
        ]
      },
      {
        id: 'education',
        name: 'Education',
        shortName: 'Education',
        icon: '📚',
        description: 'Manages educational services, libraries and early childhood development programs.',
        totalRevenue: 102000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Library Fees', description: 'Library services and membership fees' },
          { name: 'ECDE Approvals/Inspection', description: 'Early Childhood Development Education approvals' },
        ]
      },
      {
        id: 'agriculture',
        name: 'Agriculture, Livestock & Co-operative Development',
        shortName: 'Agriculture & Livestock',
        icon: '🌾',
        description: 'Supports agricultural development, livestock management and cooperative societies.',
        totalRevenue: 142000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Veterinary', description: 'Veterinary services and livestock fees' },
          { name: 'Slaughter Fees', description: 'Slaughterhouse and meat inspection fees' },
          { name: 'AMS (Agricultural Marketing Services)', description: 'Agricultural marketing and storage services' },
          { name: 'Coffee Pulping', description: 'Coffee processing and pulping fees' },
          { name: 'Fisheries', description: 'Fisheries licensing and management fees' },
        ]
      },
      {
        id: 'water-environment',
        name: 'Water, Irrigation, Environment, Climate Change & Natural Resources',
        shortName: 'Water & Environment',
        icon: '💧',
        description: 'Manages water resources, irrigation, environmental conservation and climate change initiatives.',
        totalRevenue: 128000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Water and Irrigation', description: 'Water supply and irrigation services' },
          { name: 'Borehole Drilling Charges', description: 'Borehole drilling and water point services' },
          { name: 'Environment & Conservancy Administration Fees', description: 'Environmental management and conservation fees' },
        ]
      },
      {
        id: 'health',
        name: 'Health Services',
        shortName: 'Health',
        icon: '🏥',
        description: 'Comprehensive healthcare delivery through various health facilities across the county.',
        totalRevenue: 245000000,
        isDefault: true,
        revenueStreams: [
          { name: 'Embu L5', description: 'Level 5 Hospital - Embu Referral Hospital' },
          { name: 'Runyenjes L4', description: 'Level 4 Hospital - Runyenjes Sub-County Hospital' },
          { name: 'Siakago L4', description: 'Level 4 Hospital - Siakago Sub-County Hospital' },
          { name: 'Ishiara L4', description: 'Level 4 Hospital - Ishiara Sub-County Hospital' },
          { name: 'Kianjokoma L4', description: 'Level 4 Hospital - Kianjokoma Sub-County Hospital' },
          { name: 'Kiritiri L4', description: 'Level 4 Hospital - Kiritiri Sub-County Hospital' },
          { name: 'Gategi L4', description: 'Level 4 Hospital - Gategi Sub-County Hospital' },
          { name: 'Level 3s', description: 'Level 3 Health Centers across the county' },
          { name: 'Level 2s', description: 'Level 2 Dispensaries and community health facilities' },
          { name: 'Public Health Services', description: 'General public health services and programs' },
        ]
      },
    ];

    return defaultDepartments;
  }
}