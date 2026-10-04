import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'poko-theme';

  private currentTheme: Theme = this.loadTheme();

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;

    localStorage.setItem(
      this.storageKey,
      theme
    );

    this.applyTheme(theme);
  }

  toggleTheme(): void {
    this.setTheme(
      this.currentTheme === 'light'
        ? 'dark'
        : 'light'
    );
  }

  private loadTheme(): Theme {
    const savedTheme = localStorage.getItem(
      this.storageKey
    );

    if (
      savedTheme === 'light' ||
      savedTheme === 'dark'
    ) {
      return savedTheme;
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    );
  }
}