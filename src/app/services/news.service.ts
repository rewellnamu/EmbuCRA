import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  featured?: boolean;
  tags?: string[];
  isDefault?: boolean; // Flag to identify default news articles
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly STORAGE_KEY = 'embu_news';
  private newsSubject!: BehaviorSubject<NewsArticle[]>;
  public news$!: Observable<NewsArticle[]>;

  constructor() {
    // Initialize news immediately
    const initialNews = this.initializeNews();
    this.newsSubject = new BehaviorSubject<NewsArticle[]>(initialNews);
    this.news$ = this.newsSubject.asObservable();
    
    console.log('NewsService initialized with', initialNews.length, 'articles');
  }

  // Initialize news - always loads defaults first
  private initializeNews(): NewsArticle[] {
    const defaultNews = this.getDefaultNews();
    const stored = this.loadFromStorage();

    // If no stored data or stored is empty, use defaults
    if (!stored || stored.length === 0) {
      console.log('No stored news, using defaults');
      this.saveToStorage(defaultNews);
      return defaultNews;
    }

    // Merge: Keep default news always, add any custom ones
    const customNews = stored.filter(article => !article.isDefault);
    const mergedNews = [...defaultNews, ...customNews];
    
    console.log('Merged news:', mergedNews.length);
    this.saveToStorage(mergedNews);
    return mergedNews;
  }

  // Get current news value
  getNews(): NewsArticle[] {
    return this.newsSubject.value;
  }

  // Get news as observable
  getNews$(): Observable<NewsArticle[]> {
    return this.news$;
  }

  // Get single news article by ID
  getNewsById(id: string): NewsArticle | undefined {
    return this.newsSubject.value.find(article => article.id === id);
  }

  // Add new news article (custom only, cannot override defaults)
  addNews(article: NewsArticle): void {
    if (this.isDefaultNewsId(article.id)) {
      console.warn('Cannot add news with default ID:', article.id);
      return;
    }
    article.isDefault = false; // Mark as custom
    const news = [article, ...this.newsSubject.value];
    this.saveToStorage(news);
  }

  // Update existing news article (can only update custom articles)
  updateNews(id: string, updatedArticle: NewsArticle): void {
    const existing = this.getNewsById(id);
    if (existing?.isDefault) {
      console.warn('Cannot update default news article:', id);
      return;
    }
    
    const news = this.newsSubject.value.map(article =>
      article.id === id ? { ...updatedArticle, isDefault: false } : article
    );
    this.saveToStorage(news);
  }

  // Delete news article (can only delete custom articles)
  deleteNews(id: string): void {
    const existing = this.getNewsById(id);
    if (existing?.isDefault) {
      console.warn('Cannot delete default news article:', id);
      return;
    }
    
    const news = this.newsSubject.value.filter(article => article.id !== id);
    this.saveToStorage(news);
  }

  // Get featured news articles
  getFeaturedNews(): NewsArticle[] {
    return this.newsSubject.value.filter(article => article.featured);
  }

  // Get news articles by category
  getNewsByCategory(category: string): NewsArticle[] {
    return this.newsSubject.value.filter(article => article.category === category);
  }

  // Get recent news (sorted by date)
  getRecentNews(limit?: number): NewsArticle[] {
    const sorted = [...this.newsSubject.value].sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Reset to default news
  resetToDefaults(): void {
    const defaults = this.getDefaultNews();
    this.saveToStorage(defaults);
    console.log('News reset to defaults');
  }

  // Check if ID belongs to a default news article
  private isDefaultNewsId(id: string): boolean {
    const defaultIds = [
      'news-digital-revenue-2024',
      'news-public-participation-2024',
      'news-healthcare-initiative-2024',
      'news-road-infrastructure-2024',
      'news-education-program-2024',
      'news-revenue-collection-2024'
    ];
    return defaultIds.includes(id);
  }

  // Private methods
  private loadFromStorage(): NewsArticle[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Loaded from storage:', parsed.length, 'articles');
        return parsed;
      }
    } catch (e) {
      console.error('Error loading news from storage:', e);
    }
    return [];
  }

  private saveToStorage(news: NewsArticle[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
      this.newsSubject.next(news);
      console.log('Saved to storage:', news.length, 'articles');
    } catch (e) {
      console.error('Error saving news to storage:', e);
    }
  }

  // Get default news articles - these are always loaded
  private getDefaultNews(): NewsArticle[] {
    const defaultNews: NewsArticle[] = [
      {
        id: 'news-digital-revenue-2024',
        title: 'New Digital Revenue System Launched',
        summary: 'The county introduces a new digital platform to improve revenue collection efficiency.',
        content: 'Embu County has officially launched a state-of-the-art digital revenue collection system aimed at streamlining payment processes and improving efficiency. The new system allows residents and businesses to pay their fees online, track their payment history, and receive instant receipts. This initiative is part of the county\'s broader digital transformation strategy to enhance service delivery and transparency. Governor Cecily Mbarire emphasized that the digital platform will reduce waiting times, eliminate manual processes, and provide real-time revenue tracking for better financial management.',
        category: 'Technology',
        author: 'County Communications',
        publishDate: '2024-10-20',
        featured: true,
        tags: ['digital', 'revenue', 'technology', 'innovation'],
        isDefault: true
      },
      {
        id: 'news-public-participation-2024',
        title: 'Public Participation on New Rates',
        summary: 'Stakeholders are invited for consultations on revised county rates.',
        content: 'The County Government of Embu invites all stakeholders to participate in public consultations regarding the proposed revision of county rates and fees. The consultations will be held across all sub-counties to ensure maximum participation. The proposed changes aim to make rates more equitable while ensuring sustainable revenue generation for county development projects. Citizens can submit their views through physical meetings, online platforms, or written submissions. The Finance and Economic Planning department has committed to incorporating public feedback before finalizing the new rate structure.',
        category: 'Public Notice',
        author: 'Finance Department',
        publishDate: '2024-10-10',
        featured: false,
        tags: ['rates', 'public-participation', 'consultation', 'finance'],
        isDefault: true
      },
      {
        id: 'news-healthcare-initiative-2024',
        title: 'Governor Launches New Healthcare Initiative',
        summary: 'Embu County unveils ambitious healthcare program to improve service delivery',
        content: 'Governor Cecily Mbarire has launched a comprehensive healthcare initiative aimed at improving medical services across all county facilities. The program includes equipment upgrades, staff training, and expanded outreach services. The initiative targets upgrading all Level 4 hospitals with modern diagnostic equipment, deploying mobile clinics to remote areas, and establishing a telemedicine platform for consultation services. Additionally, the county has allocated funds for recruiting additional healthcare workers and providing continuous professional development. The governor stated that quality healthcare is a fundamental right and this initiative will ensure accessible, affordable, and quality health services for all Embu residents.',
        category: 'Health',
        author: 'County Communications',
        publishDate: '2024-10-15',
        featured: true,
        tags: ['health', 'governor', 'initiatives', 'hospitals'],
        isDefault: true
      },
      {
        id: 'news-road-infrastructure-2024',
        title: 'Road Infrastructure Projects Underway',
        summary: '50km of roads under construction across the county',
        content: 'The county government has commenced construction of 50 kilometers of road network across various sub-counties. The projects are expected to improve accessibility and boost trade in rural areas. The Roads, Transport and Public Works department has engaged multiple contractors to ensure timely completion of the projects. Key routes include market access roads, farm-to-market connections, and urban street improvements. The infrastructure development is expected to reduce transportation costs, improve agricultural produce movement, and enhance emergency service delivery. Community leaders have welcomed the initiative as a major step towards opening up rural areas for economic development.',
        category: 'Infrastructure',
        author: 'Roads Department',
        publishDate: '2024-10-05',
        featured: false,
        tags: ['roads', 'infrastructure', 'development', 'construction'],
        isDefault: true
      },
      {
        id: 'news-education-program-2024',
        title: 'County Launches ECDE Excellence Program',
        summary: 'New initiative to improve Early Childhood Development Education standards',
        content: 'Embu County has unveiled the ECDE Excellence Program aimed at transforming early childhood education across all sub-counties. The initiative includes constructing modern ECDE centers, training teachers, providing learning materials, and implementing a nutritious feeding program. The county will work with development partners to ensure every child has access to quality early education. The program also includes parental engagement sessions to promote holistic child development. Education Executive emphasized that investing in early childhood education creates a strong foundation for future academic success and overall child development.',
        category: 'Education',
        author: 'Education Department',
        publishDate: '2024-09-28',
        featured: true,
        tags: ['education', 'ECDE', 'children', 'development'],
        isDefault: true
      },
      {
        id: 'news-revenue-collection-2024',
        title: 'County Revenue Surpasses Quarterly Targets',
        summary: 'ECRA reports 15% increase in revenue collection for Q3 2024',
        content: 'The Embu County Revenue Authority (ECRA) has announced that revenue collection for the third quarter of 2024 exceeded targets by 15%, marking the highest collection period in the county\'s history. The achievement is attributed to improved compliance, digital payment platforms, and enhanced enforcement mechanisms. Key revenue streams showing significant growth include Single Business Permits, parking fees, and land rates. ECRA Director credited the success to strategic partnerships with stakeholders, taxpayer education programs, and streamlined processes. The increased revenue will support critical development projects in health, education, infrastructure, and agriculture sectors across the county.',
        category: 'Revenue',
        author: 'ECRA',
        publishDate: '2024-10-25',
        featured: true,
        tags: ['revenue', 'ECRA', 'finance', 'achievement'],
        isDefault: true
      }
    ];

    return defaultNews;
  }
}