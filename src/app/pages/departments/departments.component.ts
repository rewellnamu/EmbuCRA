import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RevenueStream {
  name: string;
  description?: string;
  amount?: number;
}

interface Department {
  id: string;
  name: string;
  shortName?: string;
  icon: string;
  description: string;
  revenueStreams: RevenueStream[];
  totalRevenue?: number;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {
  selectedDepartment: Department | null = null;

  departments: Department[] = [
    {
      id: 'finance',
      name: 'Finance & Economic Planning (ECRA)',
      shortName: 'Finance & Planning',
      icon: '💰',
      description: 'Responsible for financial planning, budgeting, and various revenue collection activities including market operations and business permits.',
      revenueStreams: [
        { name: 'SBP (Single Business Permit)', description: 'Business licensing and permits' },
        { name: 'Stalls Rent', description: 'Market stall rental fees' },
        { name: 'Market Fees', description: 'Market operation and trading fees' },
        { name: 'Miraa Fees', description: 'Miraa trading and licensing fees' },
        { name: 'Buspark', description: 'Bus park and transport terminal fees' },
        { name: 'Street Parking', description: 'Street parking and metered parking fees' },
        { name: 'Cess', description: 'Agricultural produce cess collection' },
        { name: 'Advert Fees', description: 'Advertisement and signage fees' },
        { name: 'Miscellaneous', description: 'Other miscellaneous revenue' },
        { name: 'Technical Fees', description: 'Technical services and consultations' },
        { name: 'Audit Fee', description: 'Audit and compliance services' }
      ]
    },
    {
      id: 'public-health',
      name: 'Public Health (Sub County)',
      shortName: 'Public Health',
      icon: '🏥',
      description: 'Manages public health services, inspections, and health-related revenue collection at sub-county level.',
      revenueStreams: [
        { name: 'Health Inspections', description: 'Food premises and public health inspections' },
        { name: 'Health Certificates', description: 'Health certificates and clearances' },
        { name: 'Public Health Services', description: 'Various public health service fees' }
      ]
    },
    {
      id: 'trade-tourism',
      name: 'Trade, Tourism, Investment and Industrialization',
      shortName: 'Trade & Tourism',
      icon: '🏢',
      description: 'Promotes trade, tourism, investment opportunities and manages related revenue streams.',
      revenueStreams: [
        { name: 'Liquor', description: 'Liquor licensing and permits' },
        { name: 'Weights', description: 'Weights and measures certification' },
        { name: 'Mwea National Park', description: 'Tourism and park-related fees' }
      ]
    },
    {
      id: 'lands-housing',
      name: 'Lands, Housing, Physical Planning and Urban Development',
      shortName: 'Lands & Housing',
      icon: '🏘️',
      description: 'Handles land administration, housing, physical planning and urban development revenue.',
      revenueStreams: [
        { name: 'Land Rates', description: 'Property rates and land taxes' },
        { name: 'Subdivision', description: 'Land subdivision and planning fees' },
        { name: 'House Rent', description: 'County housing rental income' }
      ]
    },
    {
      id: 'administration',
      name: 'Administration, Public Service & ICT',
      shortName: 'Administration & ICT',
      icon: '⚙️',
      description: 'Manages administrative services, public service delivery and ICT infrastructure.',
      revenueStreams: [
        { name: 'Enforcement', description: 'Revenue enforcement and compliance fees' }
      ]
    },
    {
      id: 'roads-transport',
      name: 'Roads, Transport & Public Works',
      shortName: 'Roads & Transport',
      icon: '🚧',
      description: 'Responsible for road infrastructure, transport services and public works projects.',
      revenueStreams: [
        { name: 'Cemetery', description: 'Cemetery services and burial fees' }
      ]
    },
    {
      id: 'youth-gender',
      name: 'Youth, Gender, Sports, Culture & Social Services',
      shortName: 'Youth & Sports',
      icon: '🏃',
      description: 'Promotes youth development, gender equality, sports, culture and social services.',
      revenueStreams: [
        { name: 'Youth Empowerment', description: 'Youth development programs and services' }
      ]
    },
    {
      id: 'education',
      name: 'Education',
      shortName: 'Education',
      icon: '📚',
      description: 'Manages educational services, libraries and early childhood development programs.',
      revenueStreams: [
        { name: 'Library Fees', description: 'Library services and membership fees' },
        { name: 'ECDE Approvals/Inspection', description: 'Early Childhood Development Education approvals' }
      ]
    },
    {
      id: 'agriculture',
      name: 'Agriculture, Livestock & Co-operative Development',
      shortName: 'Agriculture',
      icon: '🌾',
      description: 'Supports agricultural development, livestock management and cooperative societies.',
      revenueStreams: [
        { name: 'Veterinary', description: 'Veterinary services and livestock fees' },
        { name: 'Slaughter Fees', description: 'Slaughterhouse and meat inspection fees' },
        { name: 'AMS (Agricultural Marketing Services)', description: 'Agricultural marketing and storage services' },
        { name: 'Coffee Pulping', description: 'Coffee processing and pulping fees' },
        { name: 'Fisheries', description: 'Fisheries licensing and management fees' }
      ]
    },
    {
      id: 'water-environment',
      name: 'Water, Irrigation, Environment, Climate Change & Natural Resources',
      shortName: 'Water & Environment',
      icon: '💧',
      description: 'Manages water resources, irrigation, environmental conservation and climate change initiatives.',
      revenueStreams: [
        { name: 'Water and Irrigation', description: 'Water supply and irrigation services' },
        { name: 'Borehole Drilling Charges', description: 'Borehole drilling and water point services' },
        { name: 'Environment & Conservancy Administration Fees', description: 'Environmental management and conservation fees' }
      ]
    },
    {
      id: 'health',
      name: 'Health Services',
      shortName: 'Health',
      icon: '🏥',
      description: 'Comprehensive healthcare delivery through various health facilities across the county.',
      revenueStreams: [
        { name: 'Embu L5', description: 'Level 5 Hospital - Embu Referral Hospital' },
        { name: 'Runyenjes L4', description: 'Level 4 Hospital - Runyenjes Sub-County Hospital' },
        { name: 'Siakago L4', description: 'Level 4 Hospital - Siakago Sub-County Hospital' },
        { name: 'Ishiara L4', description: 'Level 4 Hospital - Ishiara Sub-County Hospital' },
        { name: 'Kianjokoma L4', description: 'Level 4 Hospital - Kianjokoma Sub-County Hospital' },
        { name: 'Kiritiri L4', description: 'Level 4 Hospital - Kiritiri Sub-County Hospital' },
        { name: 'Gategi L4', description: 'Level 4 Hospital - Gategi Sub-County Hospital' },
        { name: 'Level 3s', description: 'Level 3 Health Centers across the county' },
        { name: 'Level 2s', description: 'Level 2 Dispensaries and community health facilities' },
        { name: 'Public Health Services', description: 'General public health services and programs' }
      ]
    }
  ];

  constructor() {
    // Calculate total revenue for each department (sample data)
    this.departments.forEach(dept => {
      dept.totalRevenue = Math.floor(Math.random() * 200000000) + 50000000;
    });
  }

  selectDepartment(department: Department): void {
    this.selectedDepartment = this.selectedDepartment?.id === department.id ? null : department;
  }

  getTotalCountyRevenue(): number {
    return this.departments.reduce((total, dept) => total + (dept.totalRevenue || 0), 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getPercentageOfTotal(departmentRevenue: number): number {
    const total = this.getTotalCountyRevenue();
    return Math.round((departmentRevenue / total) * 100);
  }

  trackByDepartmentId(index: number, department: Department): string {
    return department.id;
  }

  trackByStreamName(index: number, stream: RevenueStream): string {
    return stream.name;
  }

  getTotalRevenueStreams(): number {
    return this.departments.reduce((total, dept) => total + dept.revenueStreams.length, 0);
  }

  getAverageRevenue(): number {
    const total = this.getTotalCountyRevenue();
    return Math.floor(total / this.departments.length);
  }

  getTopPerformingDepartment(): { name: string, percentage: number } {
    const topDept = this.departments.reduce((max, dept) => 
      (dept.totalRevenue || 0) > (max.totalRevenue || 0) ? dept : max
    );
    return {
      name: topDept.shortName || topDept.name,
      percentage: this.getPercentageOfTotal(topDept.totalRevenue || 0)
    };
  }
}