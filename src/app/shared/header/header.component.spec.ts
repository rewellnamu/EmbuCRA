import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: {} }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});