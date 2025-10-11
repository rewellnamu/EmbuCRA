import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  openDropdown: string | null = null;

  toggleDropdown(dropdownName: string): void {
    this.openDropdown = this.openDropdown === dropdownName ? null : dropdownName;
  }

  closeDropdown(): void {
    this.openDropdown = null;
  }

  isDropdownOpen(dropdownName: string): boolean {
    return this.openDropdown === dropdownName;
  }
}
