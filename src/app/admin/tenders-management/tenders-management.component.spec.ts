import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendersManagementComponent } from './tenders-management.component';

describe('TendersManagementComponent', () => {
  let component: TendersManagementComponent;
  let fixture: ComponentFixture<TendersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TendersManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TendersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
