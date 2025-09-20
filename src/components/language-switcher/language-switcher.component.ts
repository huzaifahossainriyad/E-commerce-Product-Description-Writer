// Fix: Created the LanguageSwitcherComponent with an inline template.
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700">{{ languageService.translations().selectLanguage }}</span>
        <div class="relative">
          <select [value]="currentLang()" (change)="setLanguage($any($event.target).value)"
                  class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="en">English</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
  languageService = inject(LanguageService);
  currentLang = this.languageService.langSignal;

  setLanguage(lang: 'en' | 'bn'): void {
    this.languageService.setLanguage(lang);
  }
}
