import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface SearchItem {
  name: string;
  path: string;
  description?: string;
  keywords?: string[];
  category?: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  query: string = '';
  results: SearchItem[] = [];

scrollingTexts: string[] = [
  '🎄 Happy Holidays from ECRA!',
  '✨ Kulipa Ushuru ni Kujitegemea',
  '🎅 Merry Christmas Embu County',
  '🎉 Tax Compliance = Development',
  '⭐ Festive Season Greetings',
  '🔔 Pay Taxes, Build Community',
  '🎄 Kulipa Ushuru Leo, Maendeleo Kesho',
  '🎊 Season of Giving, Season of Growth'
];

  // ✅ Expanded searchable data
  pages: SearchItem[] = [
    { 
      name: 'Home', 
      path: '/', 
      description: 'Overview of the Embu County Revenue Authority', 
      keywords: ['main', 'dashboard', 'overview'], 
      category: 'General' 
    },
    { 
      name: 'About', 
      path: '/about', 
      description: 'Learn more about ECRA’s mission, vision, and leadership', 
      keywords: ['info', 'organization', 'who we are'], 
      category: 'General' 
    },
    { 
      name: 'Departments', 
      path: '/departments', 
      description: 'Explore our functional departments handling revenue services', 
      keywords: ['division', 'units', 'sections'], 
      category: 'Services' 
    },
    { 
      name: 'Services', 
      path: '/services', 
      description: 'List of public services, licensing, and revenue management tools', 
      keywords: ['payments', 'permits', 'tax', 'licensing'], 
      category: 'Services' 
    },
    { 
      name: 'News', 
      path: '/news', 
      description: 'Stay updated with the latest ECRA announcements and updates', 
      keywords: ['updates', 'press', 'events'], 
      category: 'Media' 
    },
    { 
      name: 'Tenders', 
      path: '/tenders', 
      description: 'Procurement opportunities and tender announcements', 
      keywords: ['procurement', 'bids', 'contracts'], 
      category: 'Procurement' 
    },
    { 
      name: 'Downloads', 
      path: '/downloads', 
      description: 'Download official forms, reports, and documents', 
      keywords: ['forms', 'pdf', 'documents'], 
      category: 'Resources' 
    },
    { 
      name: 'Contact', 
      path: '/contact', 
      description: 'Reach out to us for inquiries or feedback', 
      keywords: ['support', 'help', 'call', 'email'], 
      category: 'Support' 
    },
  ];

  constructor(private router: Router) {}

  // ✅ Improved smart search
  onSearch() {
    const query = this.query.trim().toLowerCase();

    if (!query) {
      this.results = [];
      return;
    }

    // Broader matching: name, description, and keywords
    this.results = this.pages
      .map(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(query));

        // Give each type of match a weight for ranking
        let relevance = 0;
        if (nameMatch) relevance += 3;
        if (descMatch) relevance += 2;
        if (keywordMatch) relevance += 1;

        return { ...item, relevance };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  }

  goToPage(path: string) {
    this.router.navigate([path]);
    this.results = [];
    this.query = '';
  }
}
