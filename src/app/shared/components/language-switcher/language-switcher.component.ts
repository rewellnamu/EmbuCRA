import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  isDropdownOpen = false;

  languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'ke', name: 'Kiembu', flag: '🇰🇪' },
    { code: 'ki', name: 'Kikuyu', flag: '🇰🇪' }
  ];

  currentLanguage: Language = this.languages[0];

  constructor(private transloco: TranslocoService) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.transloco.setActiveLang(savedLang);

    const lang = this.languages.find(l => l.code === savedLang);
    if (lang) {
      this.currentLanguage = lang;
    }

    document.documentElement.lang = savedLang;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectLanguage(language: Language): void {
    if (language.code === this.currentLanguage.code) {
      this.isDropdownOpen = false;
      return;
    }

    this.currentLanguage = language;
    this.transloco.setActiveLang(language.code);
    localStorage.setItem('selectedLanguage', language.code);
    document.documentElement.lang = language.code;
    
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 150);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.language-switcher');

    if (!clickedInside && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  trackByLanguage(index: number, language: Language): string {
    return language.code;
  }
}