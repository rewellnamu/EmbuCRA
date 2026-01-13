import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'home'
    },
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  // ---------------- Hero Background Slideshow ----------------
  backgroundImages: string[] = [
    'assets/GOV.jpg',
    'assets/EMBFLAG.png',
    'assets/post.jpg',
    'assets/embrewell.jpg',
    'assets/ecrabanner.png',
    'assets/mount.png',
    'assets/construction.jpg',
    'assets/construction2.jpg',
    'assets/tourism.jpg',
    'assets/revenue3Copy.jpg',
    'assets/revenue4.jpeg',
    'assets/naturalenvironment.jpg',

  ];
  
  currentBgIndex: number = 0;
  previousBgIndex: number = -1;
  intervalId: any;
  isTransitioning = false;

  ngOnInit(): void {
    this.startBackgroundSlideshow();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startBackgroundSlideshow() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.previousBgIndex = this.currentBgIndex;
    this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
    setTimeout(() => { this.isTransitioning = false; }, 1500);
  }

  goToSlide(index: number) {
    if (this.isTransitioning || index === this.currentBgIndex) return;
    this.isTransitioning = true;
    this.previousBgIndex = this.currentBgIndex;
    this.currentBgIndex = index;
    setTimeout(() => { this.isTransitioning = false; }, 1500);
  }

  getBackgroundStyle(index: number) {
    return { 'background-image': `url(${this.backgroundImages[index]})` };
  }

  isActiveSlide(index: number): boolean { return index === this.currentBgIndex; }
  isPreviousSlide(index: number): boolean { return index === this.previousBgIndex; }

  // ---------------- Translated Data ----------------

  highlights = [
    { key: 'highlights.collection', icon: '💰' },
    { key: 'highlights.transparency', icon: '🔍' },
    { key: 'highlights.service', icon: '🏛️' },
  ];

  boardOfDirectors = [
    { name: 'Dr. Jane Mwangi', positionKey: 'positions.chair', image: 'images/placeholder2.png' },
    { name: 'Mr. Peter Kiprotich', positionKey: 'positions.viceChair', image: 'images/placeholder1.png' },
    { name: 'Ms. Grace Njeri', positionKey: 'positions.member', image: 'images/placeholder2.png' },
    { name: 'Mr. David Mutua', positionKey: 'positions.member', image: 'images/placeholder1.png' },
    { name: 'Mrs. Sarah Wanjiku', positionKey: 'positions.member', image: 'images/placeholder2.png' },
  ];

  management = {
    directors: [
      { name: 'Mr. John Kamau', positionKey: 'positions.dg', deptKey: 'depts.admin', image: 'images/placeholder1.png' },
      { name: 'Ms. Mary Waithera', positionKey: 'positions.director', deptKey: 'depts.collection', image: 'images/placeholder2.png' },
      { name: 'Mr. Paul Mwangi', positionKey: 'positions.director', deptKey: 'depts.finance', image: 'images/placeholder1.png' },
    ],
    deputyDirectors: [
      { name: 'Mr. James Kariuki', positionKey: 'positions.deputy', deptKey: 'depts.ops', image: 'images/placeholder1.png' },
      { name: "Ms. Elizabeth Ndung'u", positionKey: 'positions.deputy', deptKey: 'depts.ict', image: 'images/placeholder2.png' },
      { name: 'Mr. Samuel Githinji', positionKey: 'positions.deputy', deptKey: 'depts.hr', image: 'images/placeholder1.png' },
    ],
    revenueOfficers: [
      { name: 'Mr. Francis Mburu', positionKey: 'positions.seniorOfficer', station: 'Embu Town', image: 'images/placeholder1.png' },
      { name: 'Ms. Lucy Wanjiru', positionKey: 'positions.officer', station: 'Runyenjes', image: 'images/placeholder2.png' },
      { name: 'Mr. Joseph Njue', positionKey: 'positions.officer', station: 'Siakago', image: 'images/placeholder1.png' },
      { name: 'Ms. Ann Muthoni', positionKey: 'positions.officer', station: 'Mbeere South', image: 'images/placeholder2.png' },
    ],
  };

  revenuePerformance = {
    currentFY: '2024/2025',
    previousFY: '2023/2024',
    data: [
      { categoryKey: 'categories.property', target: 450000000, collected: 380000000, percentage: 84.4 },
      { categoryKey: 'categories.permits', target: 180000000, collected: 165000000, percentage: 91.7 },
      { categoryKey: 'categories.market', target: 120000000, collected: 98000000, percentage: 81.7 },
      { categoryKey: 'categories.parking', target: 85000000, collected: 79000000, percentage: 92.9 },
      { categoryKey: 'categories.other', target: 95000000, collected: 88000000, percentage: 92.6 },
    ],
    totalTarget: 930000000,
    totalCollected: 810000000,
    overallPerformance: 87.1,
  };

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}