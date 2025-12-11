import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Download {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize?: string;
  fileUrl: string;
  uploadDate: string;
  downloadCount?: number;
  isDefault?: boolean; // Flag to identify default downloads
}

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
  private readonly STORAGE_KEY = 'embu_downloads';
  private downloadsSubject!: BehaviorSubject<Download[]>;
  public downloads$!: Observable<Download[]>;

  constructor() {
    // Initialize downloads immediately
    const initialDownloads = this.initializeDownloads();
    this.downloadsSubject = new BehaviorSubject<Download[]>(initialDownloads);
    this.downloads$ = this.downloadsSubject.asObservable();
    
    console.log('DownloadsService initialized with', initialDownloads.length, 'downloads');
  }

  // Initialize downloads - always loads defaults first
  private initializeDownloads(): Download[] {
    const defaultDownloads = this.getDefaultDownloads();
    const stored = this.loadFromStorage();

    // If no stored data or stored is empty, use defaults
    if (!stored || stored.length === 0) {
      console.log('No stored downloads, using defaults');
      this.saveToStorage(defaultDownloads);
      return defaultDownloads;
    }

    // Merge: Keep default downloads always, add any custom ones
    const customDownloads = stored.filter(download => !download.isDefault);
    const mergedDownloads = [...defaultDownloads, ...customDownloads];
    
    console.log('Merged downloads:', mergedDownloads.length);
    this.saveToStorage(mergedDownloads);
    return mergedDownloads;
  }

  // Get current downloads value
  getDownloads(): Download[] {
    return this.downloadsSubject.value;
  }

  // Get downloads as observable
  getDownloads$(): Observable<Download[]> {
    return this.downloads$;
  }

  // Get single download by ID
  getDownloadById(id: string): Download | undefined {
    return this.downloadsSubject.value.find(download => download.id === id);
  }

  // Add new download (custom only, cannot override defaults)
  addDownload(download: Download): void {
    if (this.isDefaultDownloadId(download.id)) {
      console.warn('Cannot add download with default ID:', download.id);
      return;
    }
    download.isDefault = false; // Mark as custom
    const downloads = [download, ...this.downloadsSubject.value];
    this.saveToStorage(downloads);
  }

  // Update existing download (can only update custom downloads)
  updateDownload(id: string, updatedDownload: Download): void {
    const existing = this.getDownloadById(id);
    if (existing?.isDefault) {
      console.warn('Cannot update default download:', id);
      return;
    }
    
    const downloads = this.downloadsSubject.value.map(download =>
      download.id === id ? { ...updatedDownload, isDefault: false } : download
    );
    this.saveToStorage(downloads);
  }

  // Delete download (can only delete custom downloads)
  deleteDownload(id: string): void {
    const existing = this.getDownloadById(id);
    if (existing?.isDefault) {
      console.warn('Cannot delete default download:', id);
      return;
    }
    
    const downloads = this.downloadsSubject.value.filter(download => download.id !== id);
    this.saveToStorage(downloads);
  }

  // Increment download count (works for all downloads)
  incrementDownloadCount(id: string): void {
    const downloads = this.downloadsSubject.value.map(download =>
      download.id === id 
        ? { ...download, downloadCount: (download.downloadCount || 0) + 1 }
        : download
    );
    this.saveToStorage(downloads);
  }

  // Get downloads by category
  getDownloadsByCategory(category: string): Download[] {
    return this.downloadsSubject.value.filter(download => download.category === category);
  }

  // Get most downloaded files
  getMostDownloaded(limit?: number): Download[] {
    const sorted = [...this.downloadsSubject.value].sort((a, b) => 
      (b.downloadCount || 0) - (a.downloadCount || 0)
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Get recent uploads
  getRecentUploads(limit?: number): Download[] {
    const sorted = [...this.downloadsSubject.value].sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Reset to default downloads
  resetToDefaults(): void {
    const defaults = this.getDefaultDownloads();
    this.saveToStorage(defaults);
    console.log('Downloads reset to defaults');
  }

  // Check if ID belongs to a default download
  private isDefaultDownloadId(id: string): boolean {
    const defaultIds = [
      'download-budget-2024-25',
      'download-sbp-form',
      'download-land-rates-form',
      'download-parking-permit-form',
      'download-county-strategic-plan',
      'download-revenue-report-2024',
      'download-building-permit-form',
      'download-market-stall-form',
      'download-health-certificate-form',
      'download-water-connection-form'
    ];
    return defaultIds.includes(id);
  }

  // Private methods
  private loadFromStorage(): Download[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Loaded from storage:', parsed.length, 'downloads');
        return parsed;
      }
    } catch (e) {
      console.error('Error loading downloads from storage:', e);
    }
    return [];
  }

  private saveToStorage(downloads: Download[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(downloads));
      this.downloadsSubject.next(downloads);
      console.log('Saved to storage:', downloads.length, 'downloads');
    } catch (e) {
      console.error('Error saving downloads to storage:', e);
    }
  }

  // Get default downloads - these are always loaded
  private getDefaultDownloads(): Download[] {
    const defaultDownloads: Download[] = [
      {
        id: 'download-budget-2024-25',
        title: 'County Budget 2024/2025',
        description: 'Annual county budget allocation and expenditure plan for fiscal year 2024/2025',
        category: 'Finance',
        fileType: 'PDF',
        fileSize: '2.5 MB',
        fileUrl: '/documents/downloads/budget-2024-25.pdf',
        uploadDate: '2024-07-01',
        downloadCount: 245,
        isDefault: true
      },
      {
        id: 'download-sbp-form',
        title: 'Single Business Permit Application Form',
        description: 'Official form for single business permit (SBP) application and renewal',
        category: 'Licenses',
        fileType: 'PDF',
        fileSize: '500 KB',
        fileUrl: '/documents/forms/sbp-application-form.pdf',
        uploadDate: '2024-08-15',
        downloadCount: 892,
        isDefault: true
      },
      {
        id: 'download-land-rates-form',
        title: 'Land Rates Payment Form',
        description: 'Form for property rates payment and assessment',
        category: 'Forms',
        fileType: 'PDF',
        fileSize: '350 KB',
        fileUrl: '/documents/forms/land-rates-form.pdf',
        uploadDate: '2024-08-20',
        downloadCount: 456,
        isDefault: true
      },
      {
        id: 'download-parking-permit-form',
        title: 'Monthly Parking Permit Application',
        description: 'Application form for monthly parking permits in designated zones',
        category: 'Forms',
        fileType: 'PDF',
        fileSize: '280 KB',
        fileUrl: '/documents/forms/parking-permit-form.pdf',
        uploadDate: '2024-09-01',
        downloadCount: 327,
        isDefault: true
      },
      {
        id: 'download-county-strategic-plan',
        title: 'County Integrated Development Plan (CIDP)',
        description: 'Embu County Integrated Development Plan 2023-2027',
        category: 'Reports',
        fileType: 'PDF',
        fileSize: '5.8 MB',
        fileUrl: '/documents/reports/cidp-2023-2027.pdf',
        uploadDate: '2024-01-15',
        downloadCount: 678,
        isDefault: true
      },
      {
        id: 'download-revenue-report-2024',
        title: 'Annual Revenue Performance Report 2023/2024',
        description: 'Comprehensive report on county revenue collection and performance',
        category: 'Reports',
        fileType: 'PDF',
        fileSize: '3.2 MB',
        fileUrl: '/documents/reports/revenue-report-2023-24.pdf',
        uploadDate: '2024-07-30',
        downloadCount: 412,
        isDefault: true
      },
      {
        id: 'download-building-permit-form',
        title: 'Building Permit Application Form',
        description: 'Application form for building plan approval and construction permits',
        category: 'Licenses',
        fileType: 'PDF',
        fileSize: '650 KB',
        fileUrl: '/documents/forms/building-permit-form.pdf',
        uploadDate: '2024-08-10',
        downloadCount: 534,
        isDefault: true
      },
      {
        id: 'download-market-stall-form',
        title: 'Market Stall Allocation Form',
        description: 'Application form for allocation of market stalls in county markets',
        category: 'Forms',
        fileType: 'PDF',
        fileSize: '300 KB',
        fileUrl: '/documents/forms/market-stall-form.pdf',
        uploadDate: '2024-09-05',
        downloadCount: 289,
        isDefault: true
      },
      {
        id: 'download-health-certificate-form',
        title: 'Food Handler Certificate Application',
        description: 'Medical examination form for food handlers certificate',
        category: 'Forms',
        fileType: 'PDF',
        fileSize: '250 KB',
        fileUrl: '/documents/forms/food-handler-form.pdf',
        uploadDate: '2024-08-25',
        downloadCount: 523,
        isDefault: true
      },
      {
        id: 'download-water-connection-form',
        title: 'Water Connection Application Form',
        description: 'Application form for new water connection services',
        category: 'Forms',
        fileType: 'PDF',
        fileSize: '400 KB',
        fileUrl: '/documents/forms/water-connection-form.pdf',
        uploadDate: '2024-09-10',
        downloadCount: 367,
        isDefault: true
      }
    ];

    return defaultDownloads;
  }
}