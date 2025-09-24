import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  news = [
    { title: 'New Digital Revenue System Launched', date: '2025-01-20', desc: 'The county introduces a new digital platform to improve revenue collection efficiency.' },
    { title: 'Public Participation on New Rates', date: '2025-02-10', desc: 'Stakeholders are invited for consultations on revised county rates.' }
  ];
}
