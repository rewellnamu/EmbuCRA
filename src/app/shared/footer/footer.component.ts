import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslocoModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'footer'
    },
  ],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}