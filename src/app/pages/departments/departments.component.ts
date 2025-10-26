import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsService, Department, RevenueStream } from '../../services/departments.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  selectedDepartment: Department | null = null;
  departments: Department[] = [];
  private subscription?: Subscription;

  constructor(private departmentsService: DepartmentsService) {}

  ngOnInit(): void {
    // Subscribe to departments from service
    this.subscription = this.departmentsService.departments$.subscribe(
      departments => {
        this.departments = departments;
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectDepartment(department: Department): void {
    this.selectedDepartment =
      this.selectedDepartment?.id === department.id ? null : department;
  }

  openDetails(dept: Department): void {
    this.selectedDepartment = dept;
  }

  closeDetails(): void {
    this.selectedDepartment = null;
  }

  getTotalCountyRevenue(): number {
    return this.departmentsService.getTotalRevenue();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getPercentageOfTotal(departmentRevenue: number): number {
    const total = this.getTotalCountyRevenue();
    return total > 0 ? Math.round((departmentRevenue / total) * 100) : 0;
  }

  trackByDepartmentId(index: number, department: Department): string {
    return department.id;
  }

  trackByStreamName(index: number, stream: RevenueStream): string {
    return stream.name;
  }

  getTotalRevenueStreams(): number {
    return this.departments.reduce(
      (total, dept) => total + dept.revenueStreams.length,
      0
    );
  }

  getAverageRevenue(): number {
    const total = this.getTotalCountyRevenue();
    return this.departments.length > 0 
      ? Math.floor(total / this.departments.length) 
      : 0;
  }

  getTopPerformingDepartment(): { name: string; percentage: number } {
    if (this.departments.length === 0) {
      return { name: 'N/A', percentage: 0 };
    }

    const topDept = this.departments.reduce((max, dept) =>
      (dept.totalRevenue || 0) > (max.totalRevenue || 0) ? dept : max
    );
    
    return {
      name: topDept.shortName || topDept.name,
      percentage: this.getPercentageOfTotal(topDept.totalRevenue || 0),
    };
}
}