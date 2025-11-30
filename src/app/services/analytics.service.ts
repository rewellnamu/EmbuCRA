import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  token: string | null = null;

  constructor() {}

  // Step 1: Sign in using Google Identity Services
  initAuth() {
    return new Promise<void>((resolve) => {
      google.accounts.oauth2.initTokenClient({
        client_id: environment.google.clientId,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        callback: (response: any) => {
          this.token = response.access_token;
          resolve();
        },
      }).requestAccessToken();
    });
  }

  // Helper request method
  private async fetchReport(body: any) {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${environment.google.analyticsPropertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      }
    );
    return res.json();
  }

  // 🟢 Active Users Right Now (Realtime)
  async getActiveUsers() {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${environment.google.analyticsPropertyId}:runRealtimeReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }]
        }),
      }
    );
    return res.json();
  }

  // 🟦 Page Views
  getPageViews() {
    return this.fetchReport({
      metrics: [{ name: 'screenPageViews' }]
    });
  }

  // 🟩 Top Pages
  getTopPages() {
    return this.fetchReport({
      dimensions: [{ name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    });
  }

  // 🟧 Sessions count
  getSessions() {
    return this.fetchReport({
      metrics: [{ name: 'sessions' }]
    });
  }

  // 🟥 Bounce Rate
  getBounceRate() {
    return this.fetchReport({
      metrics: [{ name: 'bounceRate' }]
    });
  }

  // 🟪 Events count
  getEvents() {
    return this.fetchReport({
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 10
    });
  }
}
