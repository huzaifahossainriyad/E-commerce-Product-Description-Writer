// Fix: Changed from templateUrl to an inline template and added a "Generating..." message.
import { Component, ChangeDetectionStrategy, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-description-output',
  template: `
    <div class="bg-white p-8 rounded-lg shadow-md min-h-full">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ t().outputTitle }}</h2>
      
      @if (isLoading()) {
        <div class="flex flex-col justify-center items-center h-48 space-y-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          <p class="text-gray-600 animate-pulse">{{ t().generating }}</p>
        </div>
      } @else if (descriptions().length > 0) {
        <div class="space-y-4">
          @for (desc of descriptions(); track $index) {
            <div class="bg-gray-50 p-4 rounded-md relative group animate-fade-in" 
                 [style.animation-delay]="($index * 100) + 'ms'">
              <p class="text-gray-700 whitespace-pre-wrap">{{ desc }}</p>
              <button (click)="copyToClipboard(desc, $index)"
                      class="absolute top-2 right-2 p-1.5 bg-gray-200 text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                @if (copiedIndex() === $index) {
                  <svg class="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                } @else {
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042m-7.416 0v3.042c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                }
                <span class="sr-only">{{ copiedIndex() === $index ? t().copied : t().copy }}</span>
              </button>
            </div>
          }
        </div>
      } @else {
        <div class="text-center text-gray-500 py-16">
          <p>Your generated descriptions will appear here.</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class DescriptionOutputComponent {
  readonly isLoading = input.required<boolean>();
  readonly descriptions = input.required<string[]>();
  
  private readonly languageService = inject(LanguageService);
  readonly t = this.languageService.translations;

  copiedIndex = signal<number | null>(null);

  copyToClipboard(text: string, index: number): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedIndex.set(index);
      setTimeout(() => {
        if (this.copiedIndex() === index) {
          this.copiedIndex.set(null);
        }
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
}