// Fix: Changed from templateUrl to an inline template for completeness and translated the error message.
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInputFormComponent } from './components/product-input-form/product-input-form.component';
import { DescriptionOutputComponent } from './components/description-output/description-output.component';
import { GeminiService, ProductDetails } from './services/gemini.service';
import { LanguageService } from './services/language.service';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="bg-gray-100 min-h-screen font-sans">
      <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">{{ t().title }}</h1>
          <app-language-switcher></app-language-switcher>
        </div>
      </header>
    
      <main class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <app-product-input-form (generate)="handleGenerate($event)" [isLoading]="isLoading()"></app-product-input-form>
          </div>
          <div>
            <app-description-output [isLoading]="isLoading()" [descriptions]="descriptions()"></app-description-output>
            @if (error()) {
              <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-fade-in" role="alert">
                <span class="block sm:inline">{{ error() === 'The AI could not generate descriptions. Please try refining your input.' ? t().errorNoDescriptions : t().errorUnexpected }}</span>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ProductInputFormComponent,
    DescriptionOutputComponent,
    LanguageSwitcherComponent
  ]
})
export class AppComponent {
  private readonly geminiService = inject(GeminiService);
  private readonly languageService = inject(LanguageService);
  readonly t = this.languageService.translations;

  isLoading = signal<boolean>(false);
  descriptions = signal<string[]>([]);
  error = signal<string | null>(null);

  async handleGenerate(details: ProductDetails): Promise<void> {
    this.isLoading.set(true);
    this.descriptions.set([]);
    this.error.set(null);

    try {
      const result = await this.geminiService.generateDescriptions(details);
      if (result.length === 0) {
        this.error.set('The AI could not generate descriptions. Please try refining your input.');
      } else {
        this.descriptions.set(result);
      }
    } catch (e) {
      console.error(e);
      this.error.set('An unexpected error occurred. Please check the console for more details.');
    } finally {
      this.isLoading.set(false);
    }
  }
}