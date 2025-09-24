import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  mission = "Assess, collect, and manage county revenue with integrity and efficiency as per relevant laws and regulations.";
  vision = "Excel in revenue collection and management fostering compliance, optimizing collection, and enhancing County's financial growth.";
  
  mandate = [
    "Assessing, collecting and accounting for all revenue in accordance with the County and national laws related to revenue",
    "Administering and enforcing County laws related to revenue",
    "Advising the Executive Member on all matters related to administration and collection of revenue under County laws",
    "Carry out such other roles necessary for the implementation of the objects and purpose of this Act"
  ];

  coreValues = [
    "Respect",
    "Integrity", 
    "Transparency",
    "Fairness",
    "Accountability",
    "Trustworthy",
    "Ethical",
    "Competency"
  ];
}