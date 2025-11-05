import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StatCard {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  color: string;
}

interface RecentActivity {
  title: string;
  description: string;
  time: string;
  type: 'revenue' | 'department' | 'content' | 'user';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: 'KES 810M',
      change: '+12.5%',
      positive: true,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'blue'
    },
    {
      title: 'Active Departments',
      value: '10',
      change: '+2',
      positive: true,
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'green'
    },
    {
      title: 'Revenue Streams',
      value: '24',
      change: '+3',
      positive: true,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'purple'
    },
    {
      title: 'Published Content',
      value: '48',
      change: '+8',
      positive: true,
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'orange'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      title: 'New Revenue Stream Added',
      description: 'Market Fee collection added to the system',
      time: '2 hours ago',
      type: 'revenue'
    },
    {
      title: 'Department Updated',
      description: 'Health Services department information updated',
      time: '5 hours ago',
      type: 'department'
    },
    {
      title: 'Content Published',
      description: 'New tender announcement published',
      time: '1 day ago',
      type: 'content'
    },
    {
      title: 'System Configuration',
      description: 'Payment gateway settings updated',
      time: '2 days ago',
      type: 'user'
    }
  ];

  quickActions = [
    {
      title: 'Manage Services',
      description: ' Add or update services',
      icon: 'M12 4v16m8-8H4',
      route: '/admin/services',
      color: 'blue'
    },
    {
      title: 'Manage Departments',
      description: 'Update department information',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      route: '/admin/departments',
      color: 'green'
    },
    {
      title: 'Publish News',
      description: 'Add news articles',
      icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
      route: '/admin/news',
      color: 'purple'
    },
    {
      title: 'Publish Tenders',
      description: 'Add new tender opportunities',
      icon: 'M9 17v-6a2 2 0 012-2h6M9 17H5a2 2 0 01-2-2v-6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2z',
      route: '/admin/tenders',
      color: 'orange'
    }
  ];

  ngOnInit(): void {
    // Initialize any data loading here
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      revenue: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      department: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      content: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      user: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    };
    return icons[type] || icons['user'];
  }
}