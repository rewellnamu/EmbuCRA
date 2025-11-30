import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    gtag: any;
  }
}

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: { page: string; views: number; }[];
  topEvents: { event: string; count: number; }[];
  deviceBreakdown: { device: string; percentage: number; }[];
  locationData: { country: string; users: number; }[];
  realtimeUsers: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  isLoading = true;
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
    { value: '90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Real-time update interval
  private realtimeInterval: any;

  ngOnInit(): void {
    this.loadAnalyticsData();
    this.startRealtimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }
  }

  loadAnalyticsData(): void {
    this.isLoading = true;

    // Simulate loading analytics data
    // In production, this would call Google Analytics API
    setTimeout(() => {
      this.analyticsData = this.getMockAnalyticsData();
      this.isLoading = false;
    }, 1000);
  }

  onDateRangeChange(): void {
    this.loadAnalyticsData();
  }

  startRealtimeUpdates(): void {
    // Update realtime users every 30 seconds
    this.updateRealtimeUsers();
    this.realtimeInterval = setInterval(() => {
      this.updateRealtimeUsers();
    }, 30000);
  }

  updateRealtimeUsers(): void {
    // Simulate realtime users (0-50 range)
    this.analyticsData.realtimeUsers = Math.floor(Math.random() * 50);
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

  // Mock data generator (replace with real Google Analytics API calls)
  private getMockAnalyticsData(): AnalyticsData {
    const ranges: any = {
      '7days': { multiplier: 1, days: 7 },
      '30days': { multiplier: 4, days: 30 },
      '90days': { multiplier: 12, days: 90 }
    };

    const range = ranges[this.selectedDateRange] || ranges['7days'];

    return {
      pageViews: Math.floor(Math.random() * 5000 * range.multiplier) + 1000,
      uniqueVisitors: Math.floor(Math.random() * 2000 * range.multiplier) + 500,
      avgSessionDuration: this.formatDuration(Math.floor(Math.random() * 300) + 60),
      bounceRate: `${Math.floor(Math.random() * 40) + 30}%`,
      topPages: [
        { page: '/services', views: Math.floor(Math.random() * 1000) + 500 },
        { page: '/news', views: Math.floor(Math.random() * 800) + 400 },
        { page: '/departments', views: Math.floor(Math.random() * 600) + 300 },
        { page: '/tenders', views: Math.floor(Math.random() * 500) + 200 },
        { page: '/downloads', views: Math.floor(Math.random() * 400) + 150 },
        { page: '/contact', views: Math.floor(Math.random() * 300) + 100 }
      ],
      topEvents: [
        { event: 'Service View', count: Math.floor(Math.random() * 500) + 200 },
        { event: 'File Download', count: Math.floor(Math.random() * 400) + 150 },
        { event: 'News Article View', count: Math.floor(Math.random() * 300) + 100 },
        { event: 'Button Click', count: Math.floor(Math.random() * 250) + 80 },
        { event: 'Search Query', count: Math.floor(Math.random() * 200) + 60 }
      ],
      deviceBreakdown: [
        { device: 'Mobile', percentage: Math.floor(Math.random() * 20) + 55 },
        { device: 'Desktop', percentage: Math.floor(Math.random() * 15) + 30 },
        { device: 'Tablet', percentage: Math.floor(Math.random() * 10) + 5 }
      ],
      locationData: [
        { country: 'Kenya', users: Math.floor(Math.random() * 1500) + 800 },
        { country: 'United States', users: Math.floor(Math.random() * 100) + 50 },
        { country: 'United Kingdom', users: Math.floor(Math.random() * 80) + 30 },
        { country: 'Canada', users: Math.floor(Math.random() * 60) + 20 },
        { country: 'Other', users: Math.floor(Math.random() * 200) + 100 }
      ],
      realtimeUsers: Math.floor(Math.random() * 50)
    };
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
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
      'Service View': '👁️',
      'File Download': '📥',
      'News Article View': '📰',
      'Button Click': '🖱️',
      'Search Query': '🔍'
    };
    return icons[event] || '📊';
  }

  getCountryFlag(country: string): string {
    const flags: any = {
      'Kenya': '🇰🇪',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Other': '🌍'
    };
    return flags[country] || '🌍';
  }
}