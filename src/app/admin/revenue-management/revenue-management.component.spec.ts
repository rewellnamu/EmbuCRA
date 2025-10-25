import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueManagementComponent } from './revenue-management.component';

describe('RevenueManagementComponent', () => {
  let component: RevenueManagementComponent;
  let fixture: ComponentFixture<RevenueManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
