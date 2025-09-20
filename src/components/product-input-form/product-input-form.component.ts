// Fix: Implemented the missing ProductInputFormComponent with a reactive form and image upload functionality.
import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductDetails } from '../../services/gemini.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-product-input-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ t().formTitle }}</h2>
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="space-y-6">
          <!-- Product Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">{{ t().nameLabel }}</label>
            <input type="text" id="name" formControlName="name"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   [placeholder]="t().namePlaceholder">
          </div>

          <!-- Key Features -->
          <div>
            <label for="features" class="block text-sm font-medium text-gray-700">{{ t().featuresLabel }}</label>
            <textarea id="features" formControlName="features" rows="3"
                      class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      [placeholder]="t().featuresPlaceholder"></textarea>
          </div>

          <!-- Tone -->
          <div>
            <label for="tone" class="block text-sm font-medium text-gray-700">{{ t().toneLabel }}</label>
            <select id="tone" formControlName="tone"
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="witty">Witty</option>
              <option value="friendly">Friendly</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          
          <div class="border-t border-gray-200 pt-6">
             <label for="targetAudience" class="block text-sm font-medium text-gray-700">{{ t().targetAudienceLabel }}</label>
             <p class="text-xs text-gray-500 mb-2">{{ t().imageSubtext }}</p>
             <input type="text" id="targetAudience" formControlName="targetAudience"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   [placeholder]="t().targetAudiencePlaceholder">
          </div>


          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700">{{ t().imageLabel }}</label>
            @if (!imagePreview()) {
              <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileChange($event)">
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            } @else {
              <div class="mt-2 relative">
                <img [src]="imagePreview()" alt="Product image preview" class="w-full h-auto rounded-md shadow-sm">
                <button (click)="removeImage()" type="button"
                        class="absolute top-2 right-2 bg-white rounded-full p-1.5 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span class="sr-only">{{ t().removeImageButton }}</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8">
          <button type="submit" [disabled]="isLoading()"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ t().generatingButton }}</span>
            } @else {
              <span>{{ t().generateButton }}</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInputFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  readonly t = this.languageService.translations;

  isLoading = input.required<boolean>();
  generate = output<ProductDetails>();

  productForm: FormGroup;
  imagePreview = signal<string | null>(null);
  private imageData: ProductDetails['imageData'] | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: [''],
      features: [''],
      tone: ['professional'],
      targetAudience: [''],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.imagePreview.set(e.target.result as string);
        this.imageData = {
          mimeType: file.type,
          data: base64String
        };
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.imageData = null;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid && !this.imageData) {
      this.productForm.markAllAsTouched();
      return;
    }
    
    const details: ProductDetails = {
      ...this.productForm.value,
      imageData: this.imageData,
    };
    this.generate.emit(details);
  }
}
