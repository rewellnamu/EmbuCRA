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
        id: 'news-2',
        title: 'Road Infrastructure Projects Underway',
        summary: '50km of roads under construction across the county',
        content: 'The county government has commenced construction of 50 kilometers of road network across various sub-counties. The projects are expected to improve accessibility and boost trade in rural areas.',
        category: 'Infrastructure',
        author: 'Roads Department',
        publishDate: '2024-10-10',
        featured: false,
        tags: ['roads', 'infrastructure', 'development']
      }
    ];
    this.saveToStorage(defaultNews);
  }
}