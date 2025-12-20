import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, sw: {} },
          translocoConfig: {
            availableLangs: ['en', 'sw'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});