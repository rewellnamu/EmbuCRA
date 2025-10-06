import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  query: string = '';
  results: { name: string; path: string }[] = [];

  // Define searchable pages (expand this list if needed)
  pages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Services', path: '/services' },
    { name: 'News', path: '/news' },
    { name: 'Tenders', path: '/tenders' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Contact', path: '/contact' },
  ];

  constructor(private router: Router) {}

  onSearch() {
    if (this.query.trim()) {
      this.results = this.pages.filter((page) =>
        page.name.toLowerCase().includes(this.query.toLowerCase())
      );

      // OPTIONAL: Auto-redirect immediately if exactly one match
      // if (this.results.length === 1) {
      //   this.router.navigate([this.results[0].path]);
      // }
    } else {
      this.results = [];
    }
  }

  goToPage(path: string) {
    this.router.navigate([path]);
    this.results = [];
    this.query = '';
  }
}
