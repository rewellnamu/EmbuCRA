import { Component, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({ name: 'fileType', standalone: true })
export class FileTypePipe implements PipeTransform {
  transform(link: string): string {
    if (link.endsWith('.pdf')) return 'PDF Document';
    if (link.endsWith('.doc') || link.endsWith('.docx')) return 'Word Document';
    if (link.endsWith('.xls') || link.endsWith('.xlsx'))
      return 'Excel Spreadsheet';
    return 'File';
  }
}

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule, FileTypePipe],
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
})
export class DownloadsComponent {
  files = [
    {
      name: 'Revenue Payment Guidelines (PDF)',
      link: '/assets/docs/guidelines.pdf',
    },
    {
      name: 'Business Permit Application Form (PDF)',
      link: '/assets/docs/permit-form.pdf',
    },
  ];
}
