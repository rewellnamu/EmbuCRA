import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService, NewsArticle } from '../../services/news.service';
import { Subscription } from 'rxjs';

interface NewsItem {
  title: string;
  date: string;
  desc: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  news: NewsItem[] = [];
  private subscription?: Subscription;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    // Subscribe to news from service
    this.subscription = this.newsService.news$.subscribe(
      articles => {
        // Transform NewsArticle to NewsItem format for template
        this.news = articles.map(article => ({
          title: article.title,
          date: article.publishDate,
          desc: article.summary || article.content.substring(0, 150) + '...'
        }));
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}