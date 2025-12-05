import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

declare const gapi: any;

export interface AnalyticsData {
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

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isGapiLoaded = false;
  private isSignedIn = new BehaviorSubject<boolean>(false);
  public isSignedIn$ = this.isSignedIn.asObservable();

  constructor(private http: HttpClient) {
    this.loadGapiClient();
  }

  // Load Google API client library
  private loadGapiClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isGapiLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              clientId: environment.google.clientId,
              scope: 'https://www.googleapis.com/auth/analytics.readonly',
              discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta']
            });

            // Listen for sign-in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn: boolean) => {
              this.isSignedIn.next(isSignedIn);
            });

            // Check initial sign-in state
            const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            this.isSignedIn.next(isSignedIn);

            this.isGapiLoaded = true;
            resolve();
          } catch (error) {
            console.error('Error initializing Google API client:', error);
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Sign in to Google
  async signIn(): Promise<void> {
    await this.loadGapiClient();
    return gapi.auth2.getAuthInstance().signIn();
  }

  // Sign out from Google
  async signOut(): Promise<void> {
    return gapi.auth2.getAuthInstance().signOut();
  }

  // Check if user is signed in
  isUserSignedIn(): boolean {
    if (!this.isGapiLoaded || !gapi.auth2) return false;
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  // Get access token
  private getAccessToken(): string | null {
    if (!this.isUserSignedIn()) return null;
    return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  }

  // Fetch analytics data from GA4
  async getAnalyticsData(dateRange: string): Promise<AnalyticsData> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('User not authenticated');
    }

    const { startDate, endDate } = this.getDateRangeValues(dateRange);
    const propertyId = `properties/${environment.google.analyticsPropertyId}`;

    try {
      // Fetch multiple reports in parallel
      const [
        overviewData,
        topPagesData,
        topEventsData,
        deviceData,
        locationData,
        realtimeData
      ] = await Promise.all([
        this.runReport(accessToken, propertyId, startDate, endDate, 'overview'),
        this.runReport(accessToken, propertyId, startDate, endDate, 'topPages'),
        this.runReport(accessToken, propertyId, startDate, endDate, 'topEvents'),
        this.runReport(accessToken, propertyId, startDate, endDate, 'device'),
        this.runReport(accessToken, propertyId, startDate, endDate, 'location'),
        this.getRealtimeUsers(accessToken, propertyId)
      ]);

      return this.parseAnalyticsData(
        overviewData,
        topPagesData,
        topEventsData,
        deviceData,
        locationData,
        realtimeData
      );
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  // Run GA4 report
  private async runReport(
    accessToken: string,
    propertyId: string,
    startDate: string,
    endDate: string,
    reportType: string
  ): Promise<any> {
    const url = `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    const body = this.getReportBody(reportType, startDate, endDate);

    return this.http.post(url, body, { headers }).toPromise();
  }

  // Get report body based on type
  private getReportBody(reportType: string, startDate: string, endDate: string): any {
    const baseConfig = {
      dateRanges: [{ startDate, endDate }]
    };

    switch (reportType) {
      case 'overview':
        return {
          ...baseConfig,
          metrics: [
            { name: 'screenPageViews' },
            { name: 'totalUsers' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' }
          ]
        };

      case 'topPages':
        return {
          ...baseConfig,
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10
        };

      case 'topEvents':
        return {
          ...baseConfig,
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: 10,
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'EXACT',
                value: 'page_view',
                caseSensitive: false
              },
              notExpression: true
            }
          }
        };

      case 'device':
        return {
          ...baseConfig,
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'totalUsers' }]
        };

      case 'location':
        return {
          ...baseConfig,
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'totalUsers' }],
          orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
          limit: 10
        };

      default:
        return baseConfig;
    }
  }

  // Get realtime users
  private async getRealtimeUsers(accessToken: string, propertyId: string): Promise<any> {
    const url = `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runRealtimeReport`;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    const body = {
      metrics: [{ name: 'activeUsers' }]
    };

    try {
      return await this.http.post(url, body, { headers }).toPromise();
    } catch (error) {
      console.warn('Realtime data not available:', error);
      return { rows: [{ metricValues: [{ value: '0' }] }] };
    }
  }

  // Parse analytics data from GA4 response
  private parseAnalyticsData(
    overview: any,
    topPages: any,
    topEvents: any,
    device: any,
    location: any,
    realtime: any
  ): AnalyticsData {
    // Parse overview metrics
    const overviewRow = overview.rows?.[0]?.metricValues || [];
    const pageViews = parseInt(overviewRow[0]?.value || '0');
    const uniqueVisitors = parseInt(overviewRow[1]?.value || '0');
    const avgSessionSeconds = parseFloat(overviewRow[2]?.value || '0');
    const bounceRate = parseFloat(overviewRow[3]?.value || '0');

    // Parse top pages
    const topPagesArray = (topPages.rows || []).map((row: any) => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value)
    }));

    // Parse top events
    const topEventsArray = (topEvents.rows || []).map((row: any) => ({
      event: this.formatEventName(row.dimensionValues[0].value),
      count: parseInt(row.metricValues[0].value)
    }));

    // Parse device breakdown
    const totalDeviceUsers = (device.rows || []).reduce(
      (sum: number, row: any) => sum + parseInt(row.metricValues[0].value),
      0
    );
    const deviceBreakdownArray = (device.rows || []).map((row: any) => ({
      device: this.formatDeviceName(row.dimensionValues[0].value),
      percentage: Math.round((parseInt(row.metricValues[0].value) / totalDeviceUsers) * 100)
    }));

    // Parse location data
    const locationDataArray = (location.rows || []).map((row: any) => ({
      country: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value)
    }));

    // Parse realtime users
    const realtimeUsers = parseInt(realtime.rows?.[0]?.metricValues?.[0]?.value || '0');

    return {
      pageViews,
      uniqueVisitors,
      avgSessionDuration: this.formatDuration(Math.round(avgSessionSeconds)),
      bounceRate: `${Math.round(bounceRate * 100)}%`,
      topPages: topPagesArray,
      topEvents: topEventsArray,
      deviceBreakdown: deviceBreakdownArray,
      locationData: locationDataArray,
      realtimeUsers
    };
  }

  // Helper functions
  private getDateRangeValues(dateRange: string): { startDate: string; endDate: string } {
    const endDate = 'today';
    let startDate: string;

    switch (dateRange) {
      case '7days':
        startDate = '7daysAgo';
        break;
      case '30days':
        startDate = '30daysAgo';
        break;
      case '90days':
        startDate = '90daysAgo';
        break;
      default:
        startDate = '7daysAgo';
    }

    return { startDate, endDate };
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  private formatEventName(eventName: string): string {
    // Convert snake_case to Title Case
    return eventName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatDeviceName(device: string): string {
    const deviceMap: any = {
      'mobile': 'Mobile',
      'desktop': 'Desktop',
      'tablet': 'Tablet'
    };
    return deviceMap[device.toLowerCase()] || device;
  }
}