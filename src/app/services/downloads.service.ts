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
}

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
  private readonly STORAGE_KEY = 'embu_downloads';
  private downloadsSubject = new BehaviorSubject<Download[]>(this.loadFromStorage());
  public downloads$: Observable<Download[]> = this.downloadsSubject.asObservable();

  constructor() {
    if (this.downloadsSubject.value.length === 0) {
      this.initializeDefaultDownloads();
    }
  }

  getDownloads(): Download[] {
    return this.downloadsSubject.value;
  }

  getDownloads$(): Observable<Download[]> {
    return this.downloads$;
  }

  getDownloadById(id: string): Download | undefined {
    return this.downloadsSubject.value.find(download => download.id === id);
  }

  addDownload(download: Download): void {
    const downloads = [download, ...this.downloadsSubject.value];
    this.saveToStorage(downloads);
  }

  updateDownload(id: string, updatedDownload: Download): void {
    const downloads = this.downloadsSubject.value.map(download =>
      download.id === id ? updatedDownload : download
    );
    this.saveToStorage(downloads);
  }

  deleteDownload(id: string): void {
    const downloads = this.downloadsSubject.value.filter(download => download.id !== id);
    this.saveToStorage(downloads);
  }

  incrementDownloadCount(id: string): void {
    const downloads = this.downloadsSubject.value.map(download =>
      download.id === id 
        ? { ...download, downloadCount: (download.downloadCount || 0) + 1 }
        : download
    );
    this.saveToStorage(downloads);
  }

  private loadFromStorage(): Download[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading downloads from storage:', e);
        return [];
      }
    }
    return [];
  }

  private saveToStorage(downloads: Download[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(downloads));
    this.downloadsSubject.next(downloads);
  }

  private initializeDefaultDownloads(): void {
    const defaultDownloads: Download[] = [
      {
        id: 'download-1',
        title: 'County Budget 2024/2025',
        description: 'Annual county budget allocation and expenditure plan',
        category: 'Finance',
        fileType: 'PDF',
        fileSize: '2.5 MB',
        fileUrl: '#',
        uploadDate: '2024-07-01',
        downloadCount: 245
      },
      {
        id: 'download-2',
        title: 'Business Permit Application Form',
        description: 'Official form for single business permit application',
        category: 'Licenses',
        fileType: 'PDF',
        fileSize: '500 KB',
        fileUrl: '#',
        uploadDate: '2024-08-15',
        downloadCount: 892
      }
    ];
    this.saveToStorage(defaultDownloads);
  }
}