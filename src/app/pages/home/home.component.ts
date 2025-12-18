import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // ---------------- Hero Background Slideshow ----------------
  backgroundImages: string[] = [
    'assets/EMBFLAG.png',
    'assets/ecrabanner.png',
    'assets/embrewell.png',
    'assets/mount.png',
    'assets/construction.jpg',
    'assets/night.jpg',
    'assets/construction2.jpg',
    'assets/tourism.jpg',
    'assets/revenue3Copy.jpg',
    'assets/revenue4.jpeg',
    'assets/naturalenvironment.jpg',
    'images/tourism2.jpg',
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
    // Change image every 6 seconds (slower for better viewing)
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  nextSlide() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.previousBgIndex = this.currentBgIndex;
    this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500); // Match CSS transition duration
  }

  previousSlide() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.previousBgIndex = this.currentBgIndex;
    this.currentBgIndex = this.currentBgIndex === 0 
      ? this.backgroundImages.length - 1 
      : this.currentBgIndex - 1;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500);
  }

  goToSlide(index: number) {
    if (this.isTransitioning || index === this.currentBgIndex) return;
    
    this.isTransitioning = true;
    this.previousBgIndex = this.currentBgIndex;
    this.currentBgIndex = index;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500);
  }

  getBackgroundStyle(index: number) {
    return {
      'background-image': `url(${this.backgroundImages[index]})`
    };
  }

  isActiveSlide(index: number): boolean {
    return index === this.currentBgIndex;
  }

  isPreviousSlide(index: number): boolean {
    return index === this.previousBgIndex;
  }

  highlights = [
    {
      title: 'Efficient Revenue Collection',
      desc: 'Digital systems for better service delivery.',
      icon: '💰',
    },
    {
      title: 'Transparency & Accountability',
      desc: 'Clear processes and open reporting.',
      icon: '🔍',
    },
    {
      title: 'Service to Citizens',
      desc: 'Ensuring Embu residents get value from revenue.',
      icon: '🏛️',
    },
  ];

  boardOfDirectors = [
    {
      name: 'Dr. Jane Mwangi',
      position: 'Chairperson',
      image: 'images/placeholder2.png',
    },
    {
      name: 'Mr. Peter Kiprotich',
      position: 'Vice Chairperson',
      image: 'images/placeholder1.png',
    },
    {
      name: 'Ms. Grace Njeri',
      position: 'Board Member',
      image: 'images/placeholder2.png',
    },
    {
      name: 'Mr. David Mutua',
      position: 'Board Member',
      image: 'images/placeholder1.png',
    },
    {
      name: 'Mrs. Sarah Wanjiku',
      position: 'Board Member',
      image: 'images/placeholder2.png',
    },
  ];

  management = {
    directors: [
      {
        name: 'Mr. John Kamau',
        position: 'Director General',
        department: 'Administration',
        image: 'images/placeholder1.png',
      },
      {
        name: 'Ms. Mary Waithera',
        position: 'Director',
        department: 'Revenue Collection',
        image: 'images/placeholder2.png',
      },
      {
        name: 'Mr. Paul Mwangi',
        position: 'Director',
        department: 'Finance & Administration',
        image: 'images/placeholder1.png',
      },
    ],
    deputyDirectors: [
      {
        name: 'Mr. James Kariuki',
        position: 'Deputy Director',
        department: 'Revenue Operations',
        image: 'images/placeholder1.png',
      },
      {
        name: "Ms. Elizabeth Ndung'u",
        position: 'Deputy Director',
        department: 'ICT & Innovation',
        image: 'images/placeholder2.png',
      },
      {
        name: 'Mr. Samuel Githinji',
        position: 'Deputy Director',
        department: 'Human Resources',
        image: 'images/placeholder1.png',
      },
    ],
    revenueOfficers: [
      {
        name: 'Mr. Francis Mburu',
        position: 'Senior Revenue Officer',
        station: 'Embu Town',
        image: 'images/placeholder1.png',
      },
      {
        name: 'Ms. Lucy Wanjiru',
        position: 'Revenue Officer',
        station: 'Runyenjes',
        image: 'images/placeholder2.png',
      },
      {
        name: 'Mr. Joseph Njue',
        position: 'Revenue Officer',
        station: 'Siakago',
        image: 'images/placeholder1.png',
      },
      {
        name: 'Ms. Ann Muthoni',
        position: 'Revenue Officer',
        station: 'Mbeere South',
        image: 'images/placeholder2.png',
      },
    ],
  };

  revenuePerformance = {
    currentFY: '2024/2025',
    previousFY: '2023/2024',
    data: [
      {
        category: 'Property Rates',
        target: 450000000,
        collected: 380000000,
        percentage: 84.4,
      },
      {
        category: 'Business Permits',
        target: 180000000,
        collected: 165000000,
        percentage: 91.7,
      },
      {
        category: 'Market Fees',
        target: 120000000,
        collected: 98000000,
        percentage: 81.7,
      },
      {
        category: 'Parking Fees',
        target: 85000000,
        collected: 79000000,
        percentage: 92.9,
      },
      {
        category: 'Other Revenue',
        target: 95000000,
        collected: 88000000,
        percentage: 92.6,
      },
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