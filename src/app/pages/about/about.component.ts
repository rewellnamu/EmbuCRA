import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'about'
    },
  ],
})
export class AboutComponent {
  // These arrays define the number of items to display
  // The actual text comes from translation files
  mandateItems = [1, 2, 3, 4]; // 4 mandate items
  coreValueItems = [1, 2, 3, 4, 5, 6, 7, 8]; // 8 core values
}