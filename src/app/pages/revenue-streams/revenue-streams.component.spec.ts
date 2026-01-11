import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { RevenueStreamsComponent } from './revenue-streams.component';

describe('RevenueStreamsComponent', () => {
  let component: RevenueStreamsComponent;
  let fixture: ComponentFixture<RevenueStreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RevenueStreamsComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
          preloadLangs: true
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueStreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});