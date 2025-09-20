import { Component, ChangeDetectionStrategy, output, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductDetails } from '../../services/gemini.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-product-input-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ t().formTitle }}</h2>
      
      <div class="mb-4 border-b border-gray-200">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            (click)="activeTab.set('text')"
            [class.border-indigo-500]="activeTab() === 'text'"
            [class.text-indigo-600]="activeTab() === 'text'"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none">
            {{ t().textInputTab }}
          </button>
          <button
            (click)="activeTab.set('image')"
            [class.border-indigo-500]="activeTab() === 'image'"
            [class.text-indigo-600]="activeTab() === 'image'"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none">
            {{ t().imageInputTab }}
          </button>
        </nav>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @if (activeTab() === 'text') {
          <div class="space-y-4 animate-fade-in">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">{{ t().productNameLabel }}</label>
              <input type="text" id="name" formControlName="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" [placeholder]="t().productNamePlaceholder">
            </div>
            <div>
              <label for="features" class="block text-sm font-medium text-gray-700">{{ t().featuresLabel }}</label>
              <textarea id="features" formControlName="features" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" [placeholder]="t().featuresPlaceholder"></textarea>
            </div>
            <div>
              <label for="tone" class="block text-sm font-medium text-gray-700">{{ t().toneLabel }}</label>
              <input type="text" id="tone" formControlName="tone" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" [placeholder]="t().tonePlaceholder">
            </div>
          </div>
        } @else {
          <div class="space-y-4 animate-fade-in">
             <div>
                <label for="targetAudience" class="block text-sm font-medium text-gray-700">{{ t().targetAudienceLabel }}</label>
                <input type="text" id="targetAudience" formControlName="targetAudience" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" [placeholder]="t().targetAudiencePlaceholder">
             </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">{{ t().imageUploadLabel }}</label>
              <p class="text-sm text-gray-500 mb-2">{{ t().imageUploadSublabel }}</p>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  @if (imageData()) {
                    <img [src]="imageData()" alt="Product preview" class="mx-auto h-32 w-auto object-contain rounded-md mb-4">
                  } @else {
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  }
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>{{ imageData() ? t().changeImage : t().selectImage }}</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileChange($event)" accept="image/png, image/jpeg, image/webp">
                    </label>
                  </div>
                   @if(!imageData()){
                    <p class="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  }
                </div>
              </div>
            </div>
          </div>
        }
        
        <div class="mt-6">
          <button type="submit" 
                  [disabled]="!form.valid || isLoading()"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t().generatingButton }}
            } @else {
              {{ t().generateButton }}
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductInputFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  readonly t = this.languageService.translations;

  readonly isLoading = input<boolean>(false);
  readonly generate = output<ProductDetails>();

  activeTab = signal<'text' | 'image'>('text');
  imageData = signal<string | null>(null);
  imageFile = signal<{ mimeType: string; data: string } | null>(null);

  form = this.fb.group({
    name: [''],
    features: [''],
    tone: [''],
    targetAudience: [''],
    image: [null as File | null]
  });

  constructor() {
    effect(() => {
      const tab = this.activeTab();
      if (tab === 'text') {
        this.form.controls.name.setValidators([Validators.required]);
        this.form.controls.features.setValidators([Validators.required]);
        this.form.controls.tone.setValidators([Validators.required]);
        this.form.controls.targetAudience.clearValidators();
        this.form.controls.image.clearValidators();
      } else { // image tab
        this.form.controls.name.clearValidators();
        this.form.controls.features.clearValidators();
        this.form.controls.tone.clearValidators();
        this.form.controls.targetAudience.setValidators([Validators.required]);
        this.form.controls.image.setValidators([Validators.required]);
      }
      this.form.controls.name.updateValueAndValidity();
      this.form.controls.features.updateValueAndValidity();
      this.form.controls.tone.updateValueAndValidity();
      this.form.controls.targetAudience.updateValueAndValidity();
      this.form.controls.image.updateValueAndValidity();
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData.set(e.target.result);
        const base64String = e.target.result.split(',')[1];
        this.imageFile.set({
          mimeType: file.type,
          data: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const details: ProductDetails = {};
    if (this.activeTab() === 'text') {
        details.name = this.form.value.name ?? '';
        details.features = this.form.value.features ?? '';
        details.tone = this.form.value.tone ?? '';
    } else {
        details.targetAudience = this.form.value.targetAudience ?? '';
        details.imageData = this.imageFile() ?? undefined;
    }

    this.generate.emit(details);
  }
}
