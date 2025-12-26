import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentsComponent } from './departments.component';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';

describe('DepartmentsComponent', () => {
  let component: DepartmentsComponent;
  let fixture: ComponentFixture<DepartmentsComponent>;
  let translocoService: TranslocoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DepartmentsComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              departments: {
                header: {
                  title: 'Departments'
                }
              }
            }
          }
        })
      ]
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService);
    translocoService.setActiveLang('en');

    fixture = TestBed.createComponent(DepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
