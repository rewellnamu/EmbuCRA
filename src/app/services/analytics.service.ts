import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

declare const gapi: any;
declare const google: any;

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
  private isGsiLoaded = false;
  private tokenClient: any;
  private accessToken: string | null = null;
  private isSignedIn = new BehaviorSubject<boolean>(false);
  public isSignedIn$ = this.isSignedIn.asObservable();

  constructor(private http: HttpClient) {
    this.initializeGoogleAuth();
  }

  // Initialize Google Identity Services (new method)
  private async initializeGoogleAuth(): Promise<void> {
    try {
      // Load Google Identity Services
      await this.loadGoogleIdentityServices();
      
      // Initialize token client
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: environment.google.clientId,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        callback: (response: any) => {
          if (response.error) {
            console.error('Token error:', response);
            this.isSignedIn.next(false);
            return;
          }
          this.accessToken = response.access_token;
          this.isSignedIn.next(true);
        },
      });
      
      this.isGsiLoaded = true;
      console.log('Google Identity Services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Identity Services:', error);
    }
  }

  // Load Google Identity Services library
  private loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait for google object to be available
        const checkGoogle = setInterval(() => {
          if (typeof google !== 'undefined' && google.accounts) {
            clearInterval(checkGoogle);
            resolve();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
          if (typeof google === 'undefined' || !google.accounts) {
            reject(new Error('Google Identity Services failed to load'));
          }
        }, 5000);
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
      document.head.appendChild(script);
    });
  }

  // Sign in to Google
  async signIn(): Promise<void> {
    if (!this.isGsiLoaded) {
      await this.initializeGoogleAuth();
    }

    if (!this.tokenClient) {
      throw new Error('Google authentication not initialized');
    }

    // Request access token
    this.tokenClient.requestAccessToken();
  }

  // Sign out from Google
  async signOut(): Promise<void> {
    if (this.accessToken) {
      // Revoke token
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      } catch (error) {
        console.error('Error revoking token:', error);
      }
    }
    
    this.accessToken = null;
    this.isSignedIn.next(false);
  }

  // Check if user is signed in
  isUserSignedIn(): boolean {
    return this.accessToken !== null;
  }

  // Get access token
  private getAccessToken(): string | null {
    return this.accessToken;
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

    try {
      return await this.http.post(url, body, { headers }).toPromise();
    } catch (error: any) {
      console.error(`Error running ${reportType} report:`, error);
      if (error.status === 403) {
        throw new Error('Access denied. Please ensure the Google Analytics Data API is enabled and you have access to this property.');
      }
      throw error;
    }
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
            notExpression: {
              filter: {
                fieldName: 'eventName',
                stringFilter: {
                  matchType: 'EXACT',
                  value: 'page_view',
                  caseSensitive: false
                }
              }
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
      percentage: totalDeviceUsers > 0 ? Math.round((parseInt(row.metricValues[0].value) / totalDeviceUsers) * 100) : 0
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