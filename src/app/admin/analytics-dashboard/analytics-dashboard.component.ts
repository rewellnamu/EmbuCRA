import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  isLoading = true;
  isSignedIn = false;
  errorMessage = '';
  
  analyticsData: AnalyticsData = {
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: '0m 0s',
    bounceRate: '0%',
    topPages: [],
    topEvents: [],
    deviceBreakdown: [],
    locationData: [],
    realtimeUsers: 0
  };

  selectedDateRange = '7days';
  dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' }
  ];

  // Real-time update interval
  private realtimeInterval: any;
  private signInSubscription?: Subscription;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Subscribe to sign-in state changes
    this.signInSubscription = this.analyticsService.isSignedIn$.subscribe(
      (isSignedIn) => {
        this.isSignedIn = isSignedIn;
        if (isSignedIn) {
          this.loadAnalyticsData();
          this.startRealtimeUpdates();
        } else {
          this.isLoading = false;
          this.stopRealtimeUpdates();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.stopRealtimeUpdates();
    if (this.signInSubscription) {
      this.signInSubscription.unsubscribe();
    }
  }

  async signIn(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      await this.analyticsService.signIn();
    } catch (error: any) {
      console.error('Sign-in error:', error);
      this.errorMessage = 'Failed to sign in. Please try again.';
      this.isLoading = false;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.analyticsService.signOut();
      this.analyticsData = {
        pageViews: 0,
        uniqueVisitors: 0,
        avgSessionDuration: '0m 0s',
        bounceRate: '0%',
        topPages: [],
        topEvents: [],
        deviceBreakdown: [],
        locationData: [],
        realtimeUsers: 0
      };
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  async loadAnalyticsData(): Promise<void> {
    if (!this.isSignedIn) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.analyticsData = await this.analyticsService.getAnalyticsData(this.selectedDateRange);
      this.isLoading = false;
    } catch (error: any) {
      console.error('Error loading analytics data:', error);
      this.errorMessage = 'Failed to load analytics data. Please try again.';
      this.isLoading = false;
    }
  }

  onDateRangeChange(): void {
    this.loadAnalyticsData();
  }

  startRealtimeUpdates(): void {
    // Update realtime data every 30 seconds
    this.realtimeInterval = setInterval(async () => {
      if (this.isSignedIn) {
        try {
          const data = await this.analyticsService.getAnalyticsData(this.selectedDateRange);
          this.analyticsData.realtimeUsers = data.realtimeUsers;
        } catch (error) {
          console.error('Error updating realtime data:', error);
        }
      }
    }, 30000);
  }

  stopRealtimeUpdates(): void {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
      this.realtimeInterval = null;
    }
  }

  exportReport(): void {
    const reportData = JSON.stringify(this.analyticsData, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  refreshData(): void {
    this.loadAnalyticsData();
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  getDeviceIcon(device: string): string {
    const icons: any = {
      'Mobile': '📱',
      'Desktop': '💻',
      'Tablet': '📱'
    };
    return icons[device] || '📱';
  }

  getEventIcon(event: string): string {
    const icons: any = {
      'Page View': '👁️',
      'Click': '🖱️',
      'Scroll': '📜',
      'File Download': '📥',
      'Video Play': '▶️',
      'Form Submit': '📝',
      'Search': '🔍',
      'User Engagement': '👤'
    };
    return icons[event] || '📊';
  }

  getCountryFlag(country: string): string {
    const flags: any = {
      'Kenya': '🇰🇪',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'India': '🇮🇳',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'China': '🇨🇳'
    };
    return flags[country] || '🌍';
  }
}