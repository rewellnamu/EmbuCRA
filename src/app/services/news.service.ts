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
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly STORAGE_KEY = 'embu_news';
  private newsSubject = new BehaviorSubject<NewsArticle[]>(this.loadFromStorage());
  public news$: Observable<NewsArticle[]> = this.newsSubject.asObservable();

  constructor() {
    if (this.newsSubject.value.length === 0) {
      this.initializeDefaultNews();
    }
  }

  getNews(): NewsArticle[] {
    return this.newsSubject.value;
  }

  getNews$(): Observable<NewsArticle[]> {
    return this.news$;
  }

  getNewsById(id: string): NewsArticle | undefined {
    return this.newsSubject.value.find(article => article.id === id);
  }

  addNews(article: NewsArticle): void {
    const news = [article, ...this.newsSubject.value];
    this.saveToStorage(news);
  }

  updateNews(id: string, updatedArticle: NewsArticle): void {
    const news = this.newsSubject.value.map(article =>
      article.id === id ? updatedArticle : article
    );
    this.saveToStorage(news);
  }

  deleteNews(id: string): void {
    const news = this.newsSubject.value.filter(article => article.id !== id);
    this.saveToStorage(news);
  }

  getFeaturedNews(): NewsArticle[] {
    return this.newsSubject.value.filter(article => article.featured);
  }

  getNewsByCategory(category: string): NewsArticle[] {
    return this.newsSubject.value.filter(article => article.category === category);
  }

  private loadFromStorage(): NewsArticle[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading news from storage:', e);
        return [];
      }
    }
    return [];
  }

  private saveToStorage(news: NewsArticle[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
    this.newsSubject.next(news);
  }

  private initializeDefaultNews(): void {
    const defaultNews: NewsArticle[] = [
      {
        id: 'news-1',
        title: 'New Digital Revenue System Launched',
        summary: 'The county introduces a new digital platform to improve revenue collection efficiency.',
        content: 'Embu County has officially launched a state-of-the-art digital revenue collection system aimed at streamlining payment processes and improving efficiency. The new system allows residents and businesses to pay their fees online, track their payment history, and receive instant receipts. This initiative is part of the county\'s broader digital transformation strategy to enhance service delivery and transparency.',
        category: 'Technology',
        author: 'County Communications',
        publishDate: '2024-10-20',
        featured: true,
        tags: ['digital', 'revenue', 'technology']
      },
      {
        id: 'news-2',
        title: 'Public Participation on New Rates',
        summary: 'Stakeholders are invited for consultations on revised county rates.',
        content: 'The County Government of Embu invites all stakeholders to participate in public consultations regarding the proposed revision of county rates and fees. The consultations will be held across all sub-counties to ensure maximum participation. The proposed changes aim to make rates more equitable while ensuring sustainable revenue generation for county development projects.',
        category: 'Public Notice',
        author: 'Finance Department',
        publishDate: '2024-10-10',
        featured: false,
        tags: ['rates', 'public-participation', 'consultation']
      },
      {
        id: 'news-3',
        title: 'Governor Launches New Healthcare Initiative',
        summary: 'Embu County unveils ambitious healthcare program to improve service delivery',
        content: 'Governor Cecily Mbarire has launched a comprehensive healthcare initiative aimed at improving medical services across all county facilities. The program includes equipment upgrades, staff training, and expanded outreach services.',
        category: 'Health',
        author: 'County Communications',
        publishDate: '2024-10-15',
        featured: true,
        tags: ['health', 'governor', 'initiatives']
      },
      {
        id: 'news-4',
        title: 'Road Infrastructure Projects Underway',
        summary: '50km of roads under construction across the county',
        content: 'The county government has commenced construction of 50 kilometers of road network across various sub-counties. The projects are expected to improve accessibility and boost trade in rural areas.',
        category: 'Infrastructure',
        author: 'Roads Department',
        publishDate: '2024-10-05',
        featured: false,
        tags: ['roads', 'infrastructure', 'development']
      }
    ];
    this.saveToStorage(defaultNews);
  }
}