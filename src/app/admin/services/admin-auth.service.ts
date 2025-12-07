import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Store hashed credentials (SHA-256)
  private readonly ADMIN_USERNAME_HASH = environment.admin.usernameHash;
  private readonly ADMIN_PASSWORD_HASH = environment.admin.passwordHash;
  private readonly AUTH_TOKEN_KEY = 'embu_admin_token';
  private readonly TOKEN_EXPIRY_KEY = 'embu_token_expiry';
  private readonly MAX_LOGIN_ATTEMPTS_KEY = 'login_attempts';
  private readonly LOCKOUT_TIME_KEY = 'lockout_until';
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 2 * 60 * 1000; // 2 minutes
  private readonly TOKEN_VALIDITY = 5 * 60 * 1000; // 5 minutes

  constructor(private router: Router) {
    this.checkTokenExpiry();
  }

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Check if account is locked
    const lockoutUntil = localStorage.getItem(this.LOCKOUT_TIME_KEY);
    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil);
      if (Date.now() < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
        return {
          success: false,
          message: `Account locked. Try again in ${remainingMinutes} minutes.`
        };
      } else {
        // Lockout expired, clear it
        localStorage.removeItem(this.LOCKOUT_TIME_KEY);
        localStorage.removeItem(this.MAX_LOGIN_ATTEMPTS_KEY);
      }
    }

    // Hash the input credentials
    const usernameHash = await this.hashString(username);
    const passwordHash = await this.hashString(password);

    // Compare hashes
    if (usernameHash === this.ADMIN_USERNAME_HASH && 
        passwordHash === this.ADMIN_PASSWORD_HASH) {
      
      // Successful login - clear attempts and set token
      localStorage.removeItem(this.MAX_LOGIN_ATTEMPTS_KEY);
      localStorage.removeItem(this.LOCKOUT_TIME_KEY);
      
      const token = await this.generateSecureToken(username);
      const expiryTime = Date.now() + this.TOKEN_VALIDITY;
      
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      this.isAuthenticatedSubject.next(true);
      
      return { success: true };
    } else {
      // Failed login - increment attempts
      const attempts = this.incrementLoginAttempts();
      
      if (attempts >= this.MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + this.LOCKOUT_DURATION;
        localStorage.setItem(this.LOCKOUT_TIME_KEY, lockoutUntil.toString());
        return {
          success: false,
          message: `Too many failed attempts. Account locked for 2 minutes.`
        };
      }
      
      return {
        success: false,
        message: `Invalid credentials. ${this.MAX_ATTEMPTS - attempts} attempts remaining.`
      };
    }
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return false;
    }

    // Check if token has expired
    if (Date.now() > parseInt(expiry)) {
      this.logout();
      return false;
    }

    return true;
  }

  private checkTokenExpiry(): void {
    // Check token expiry every minute
    setInterval(() => {
      if (this.hasToken() && !this.hasValidToken()) {
        this.logout();
      }
    }, 60000);
  }

  private incrementLoginAttempts(): number {
    const attempts = localStorage.getItem(this.MAX_LOGIN_ATTEMPTS_KEY);
    const newAttempts = attempts ? parseInt(attempts) + 1 : 1;
    localStorage.setItem(this.MAX_LOGIN_ATTEMPTS_KEY, newAttempts.toString());
    return newAttempts;
  }

  private async generateSecureToken(username: string): Promise<string> {
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36);
    const tokenString = `${username}:${timestamp}:${randomValue}`;
    return await this.hashString(tokenString);
  }

  private async hashString(str: string): Promise<string> {
    // Use Web Crypto API for hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}