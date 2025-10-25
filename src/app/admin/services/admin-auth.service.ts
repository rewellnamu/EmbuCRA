import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Default admin credentials - CHANGE THESE IN PRODUCTION!
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'embu2024';
  private readonly AUTH_TOKEN_KEY = 'embu_admin_token';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      const token = this.generateToken();
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  private generateToken(): string {
    return btoa(`${this.ADMIN_USERNAME}:${Date.now()}`);
  }
}