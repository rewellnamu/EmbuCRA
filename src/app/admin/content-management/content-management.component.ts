import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-management.component.html',
  styleUrl: './content-management.component.scss'
})
export class ContentManagementComponent {
  contentTypes = [
    { 
      name: 'News Articles', 
      count: 24, 
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
      color: 'blue',
      description: 'Manage news and announcements'
    },
    { 
      name: 'Tenders', 
      count: 12, 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'green',
      description: 'Publish procurement notices'
    },
    { 
      name: 'FAQs', 
      count: 36, 
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'purple',
      description: 'Update frequently asked questions'
    },
    { 
      name: 'Downloads', 
      count: 18, 
      icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'orange',
      description: 'Manage downloadable documents'
    }
  ];

  recentContent = [
    { title: 'County Budget Announcement 2024', type: 'News', date: '2024-10-20', status: 'published' },
    { title: 'Road Construction Tender', type: 'Tender', date: '2024-10-18', status: 'published' },
    { title: 'How to Apply for Business Permit', type: 'FAQ', date: '2024-10-15', status: 'published' },
    { title: 'Revenue Collection Guidelines', type: 'Download', date: '2024-10-12', status: 'draft' }
  ];
}