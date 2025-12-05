import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { AnalyticsComponent } from './analytics-dashboard.component';
import { AnalyticsService } from '../../services/analytics.service';

describe('AnalyticsDashboardComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AnalyticsService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBe(true);
    expect(component.isSignedIn).toBe(false);
    expect(component.selectedDateRange).toBe('7days');
  });

  it('should have date range options', () => {
    expect(component.dateRanges.length).toBe(3);
    expect(component.dateRanges[0].value).toBe('7days');
    expect(component.dateRanges[1].value).toBe('30days');
    expect(component.dateRanges[2].value).toBe('90days');
  });

  it('should format numbers correctly', () => {
    expect(component.formatNumber(1000)).toBe('1,000');
    expect(component.formatNumber(1000000)).toBe('1,000,000');
  });

  it('should return correct device icons', () => {
    expect(component.getDeviceIcon('Mobile')).toBe('📱');
    expect(component.getDeviceIcon('Desktop')).toBe('💻');
    expect(component.getDeviceIcon('Tablet')).toBe('📱');
  });

  it('should return correct country flags', () => {
    expect(component.getCountryFlag('Kenya')).toBe('🇰🇪');
    expect(component.getCountryFlag('United States')).toBe('🇺🇸');
    expect(component.getCountryFlag('Unknown')).toBe('🌍');
  });

  it('should initialize analytics data with zeros', () => {
    expect(component.analyticsData.pageViews).toBe(0);
    expect(component.analyticsData.uniqueVisitors).toBe(0);
    expect(component.analyticsData.realtimeUsers).toBe(0);
  });

  it('should stop realtime updates on destroy', () => {
    component['realtimeInterval'] = 123; // Set a fake interval ID
    spyOn(window, 'clearInterval');
    
    component.ngOnDestroy();
    
    expect(window.clearInterval).toHaveBeenCalledWith(123);
  });
});