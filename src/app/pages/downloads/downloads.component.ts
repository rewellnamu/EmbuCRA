import { Component, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TRANSLOCO_SCOPE, TranslocoService } from '@jsverse/transloco';

@Pipe({ name: 'fileType', standalone: true })
export class FileTypePipe implements PipeTransform {
  constructor(private translocoService: TranslocoService) {}

  transform(link: string): string {
    const scope = 'downloads';
    if (link.endsWith('.pdf')) 
      return this.translocoService.translate(`${scope}.fileTypes.pdf`);
    if (link.endsWith('.doc') || link.endsWith('.docx')) 
      return this.translocoService.translate(`${scope}.fileTypes.word`);
    if (link.endsWith('.xls') || link.endsWith('.xlsx'))
      return this.translocoService.translate(`${scope}.fileTypes.excel`);
    return this.translocoService.translate(`${scope}.fileTypes.file`);
  }
}

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule, FileTypePipe, TranslocoModule],
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'downloads'
    },
  ],
})
export class DownloadsComponent {
  files = [
    {
      nameKey: 'files.revenueGuidelines',
      link: '/assets/docs/guidelines.pdf',
    },
    {
      nameKey: 'files.permitForm',
      link: '/assets/docs/permit-form.pdf',
    },
    {
      nameKey: 'files.taxCompliance',
      link: '/assets/docs/tax-compliance.docx',
    },
    {
      nameKey: 'files.financialReport',
      link: '/assets/docs/financial-report.xlsx',
    },
    {
      nameKey: 'files.procurementManual',
      link: '/assets/docs/procurement-manual.pdf',
    },
    {
      nameKey: 'files.codeOfConduct',
      link: '/assets/docs/code-of-conduct.doc',
    }
  ];
}