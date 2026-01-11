import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TendersComponent } from './tenders.component';

describe('TendersComponent', () => {
  let component: TendersComponent;
  let fixture: ComponentFixture<TendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TendersComponent,
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

    fixture = TestBed.createComponent(TendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});