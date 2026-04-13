import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthPayload } from '../models/auth.model';

const SESSION_KEY = 'comp3133_assignment2_session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly platformId = inject(PLATFORM_ID);

  getSession(): AuthPayload | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const rawSession = window.localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthPayload;
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  saveSession(payload: AuthPayload): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }

  clearSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.removeItem(SESSION_KEY);
  }
}
