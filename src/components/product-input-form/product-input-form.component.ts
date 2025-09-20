// Fix: Replaced placeholder content with a complete, functional Angular component.
import { Component, ChangeDetectionStrategy, output, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductDetails } from '../../services/gemini.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-product-input-form',
  template: `
    <div class="bg-white p-8 rounded-lg shadow-md min-h-full">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ t().formTitle }}</h2>
      
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            (click)="selectTab('text')"
            [class.border-indigo-500]="activeTab() === 'text'"
            [class.text-indigo-600]="activeTab() === 'text'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none transition-colors duration-200">
            {{ t().textInputTab }}
          </button>
          <button 
            (click)="selectTab('image')"
            [class.border-indigo-500]="activeTab() === 'image'"
            [class.text-indigo-600]="activeTab() === 'image'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none transition-colors duration-200">
            {{ t().imageInputTab }}
          </button>
        </nav>
      </div>

      <div class="mt-6">
        @if (activeTab() === 'text') {
          <form [formGroup]="textForm" (ngSubmit)="onSubmit()" class="space-y-6 animate-fade-in">
            <div>
              <label for="productName" class="block text-sm font-medium text-gray-700">{{ t().productNameLabel }}</label>
              <input type="text" id="productName" formControlName="name"
                     [placeholder]="t().productNamePlaceholder"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              @if (textForm.get('name')?.invalid && textForm.get('name')?.touched) {
                <p class="mt-1 text-sm text-red-600">{{ t().nameRequired }}</p>
              }
            </div>

            <div>
              <label for="features" class="block text-sm font-medium text-gray-700">{{ t().featuresLabel }}</label>
              <textarea id="features" formControlName="features" rows="4"
                        [placeholder]="t().featuresPlaceholder"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              @if (textForm.get('features')?.invalid && textForm.get('features')?.touched) {
                <p class="mt-1 text-sm text-red-600">{{ t().featuresRequired }}</p>
              }
            </div>

            <div>
              <label for="tone" class="block text-sm font-medium text-gray-700">{{ t().toneLabel }}</label>
              <input type="text" id="tone" formControlName="tone"
                     [placeholder]="t().tonePlaceholder"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="targetAudience" class="block text-sm font-medium text-gray-700">{{ t().targetAudienceLabel }}</label>
              <input type="text" id="targetAudience" formControlName="targetAudience"
                     [placeholder]="t().targetAudiencePlaceholder"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              @if (textForm.get('targetAudience')?.invalid && textForm.get('targetAudience')?.touched) {
                <p class="mt-1 text-sm text-red-600">{{ t().audienceRequired }}</p>
              }
            </div>

            <div>
              <button type="submit" [disabled]="isLoading() || textForm.invalid"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors">
                @if(isLoading()){
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
        }

        @if (activeTab() === 'image') {
          <form [formGroup]="imageForm" (ngSubmit)="onSubmit()" class="space-y-6 animate-fade-in">
            <div class="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-md">
              {{ t().infoNoteFacebook }}
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t().imageUploadLabel }}</label>
              <p class="text-sm text-gray-500">{{ t().imageUploadSublabel }}</p>
              @if (!imagePreview()) {
                <div (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)"
                     [class.border-indigo-500]="isDragging()" [class.bg-indigo-50]="isDragging()"
                     class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors duration-200">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600 justify-center">
                      <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>{{ t().selectImage }}</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)" accept="image/png, image/jpeg, image/webp">
                      </label>
                      @if (isDragging()) {
                         <p class="pl-1">{{ t().dropImageHere }}</p>
                      }
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, WEBP</p>
                  </div>
                </div>
              } @else {
                <div class="mt-2">
                  <div class="flex items-start space-x-4 p-3 border rounded-md bg-gray-50">
                    <img [src]="imagePreview()" alt="Image preview" class="h-20 w-20 rounded-md object-cover">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">{{ t().fileName }} {{ imageFile()?.name }}</p>
                      <p class="text-sm text-gray-500">{{ t().fileSize }} {{ formatBytes(imageFile()?.size || 0) }}</p>
                      <button type="button" (click)="removeImage()" class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">{{ t().changeImage }}</button>
                    </div>
                  </div>
                </div>
              }
              @if (imageError()) {
                <p class="mt-1 text-sm text-red-600">{{ imageError() }}</p>
              }
              @if (imageForm.get('image')?.invalid && imageForm.get('image')?.touched && !imageFile()) {
                 <p class="mt-1 text-sm text-red-600">{{ t().imageUploadLabel }} is required.</p>
              }
            </div>

            <div>
              <label for="imageTargetAudience" class="block text-sm font-medium text-gray-700">{{ t().targetAudienceLabel }}</label>
              <input type="text" id="imageTargetAudience" formControlName="targetAudience"
                     [placeholder]="t().targetAudiencePlaceholder"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              @if (imageForm.get('targetAudience')?.invalid && imageForm.get('targetAudience')?.touched) {
                <p class="mt-1 text-sm text-red-600">{{ t().audienceRequired }}</p>
              }
            </div>

            <div>
              <button type="submit" [disabled]="isLoading() || imageForm.invalid"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors">
                @if(isLoading()){
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
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProductInputFormComponent {
  isLoading = input.required<boolean>();
  generate = output<ProductDetails>();
  
  private readonly fb = inject(FormBuilder);
  readonly languageService = inject(LanguageService);
  readonly t = this.languageService.translations;

  activeTab = signal<'text' | 'image'>('text');
  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  imageError = signal<string | null>(null);
  isDragging = signal(false);

  textForm: FormGroup;
  imageForm: FormGroup;

  constructor() {
    this.textForm = this.fb.group({
      name: ['', Validators.required],
      features: ['', Validators.required],
      tone: [''],
      targetAudience: ['', Validators.required],
    });

    this.imageForm = this.fb.group({
      targetAudience: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  selectTab(tab: 'text' | 'image'): void {
    this.activeTab.set(tab);
    this.imageError.set(null);
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (file) {
      this.handleFile(file);
    }
    element.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.imageError.set(null);
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.imageError.set(this.t().invalidFileType);
      return;
    }

    this.imageFile.set(file);
    this.imageForm.patchValue({ image: file });
    this.imageForm.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = (e) => this.imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.imageForm.patchValue({ image: null });
    this.imageForm.get('image')?.updateValueAndValidity();
    this.imageError.set(null);
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.activeTab() === 'text') {
        if (this.textForm.valid) {
            this.generate.emit(this.textForm.value);
        } else {
            this.textForm.markAllAsTouched();
        }
    } else {
        if (this.imageForm.valid) {
            const file = this.imageFile();
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = (e.target?.result as string).split(',')[1];
                if (!base64String) return;

                const productDetails: ProductDetails = {
                    targetAudience: this.imageForm.value.targetAudience,
                    imageData: {
                        mimeType: file.type,
                        data: base64String
                    }
                };
                this.generate.emit(productDetails);
            };
            reader.readAsDataURL(file);
        } else {
            this.imageForm.markAllAsTouched();
        }
    }
  }
}
