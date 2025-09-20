// Fix: Implemented the missing LanguageService to handle translations.
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translationsDb: any = {
    en: {
      title: 'AI Product Description Generator',
      selectLanguage: 'Select Language:',
      formTitle: 'Product Details',
      nameLabel: 'Product Name',
      namePlaceholder: 'e.g., "Handcrafted Leather Wallet"',
      featuresLabel: 'Key Features / Benefits',
      featuresPlaceholder: 'e.g., "Durable, stylish, multiple compartments"',
      toneLabel: 'Tone of Voice',
      targetAudienceLabel: 'Target Audience (for social media posts)',
      targetAudiencePlaceholder: 'e.g., "Young professionals, fashion enthusiasts"',
      imageLabel: 'Or Upload a Product Image',
      imageSubtext: 'For social media post generation',
      generateButton: 'Generate Descriptions',
      generatingButton: 'Generating...',
      removeImageButton: 'Remove Image',
      outputTitle: 'Generated Descriptions',
      generating: 'Generating...',
      copied: 'Copied!',
      copy: 'Copy',
      errorNoDescriptions: 'The AI could not generate descriptions. Please try refining your input.',
      errorUnexpected: 'An unexpected error occurred. Please check the console for more details.',
    },
    bn: {
      title: 'এআই পণ্য বিবরণ জেনারেটর',
      selectLanguage: 'ভাষা নির্বাচন করুন:',
      formTitle: 'পণ্যের বিবরণ',
      nameLabel: 'পণ্যের নাম',
      namePlaceholder: 'যেমন, "হস্তনির্মিত চামড়ার ওয়ালেট"',
      featuresLabel: 'মূল বৈশিষ্ট্য / সুবিধা',
      featuresPlaceholder: 'যেমন, "টেকসই, স্টাইলিশ, একাধিক পকেট"',
      toneLabel: 'কথার সুর',
      targetAudienceLabel: 'লক্ষ্য দর্শক (সোশ্যাল মিডিয়া পোস্টের জন্য)',
      targetAudiencePlaceholder: 'যেমন, "তরুণ পেশাদার, ফ্যাশন উত্সাহী"',
      imageLabel: 'অথবা একটি পণ্যের ছবি আপলোড করুন',
      imageSubtext: 'সোশ্যাল মিডিয়া পোস্ট তৈরির জন্য',
      generateButton: 'বিবরণ তৈরি করুন',
      generatingButton: 'তৈরি হচ্ছে...',
      removeImageButton: 'ছবি সরান',
      outputTitle: 'তৈরি করা বিবরণ',
      generating: 'তৈরি হচ্ছে...',
      copied: 'অনুলিপি করা হয়েছে!',
      copy: 'অনুলিপি',
      errorNoDescriptions: 'এআই বিবরণ তৈরি করতে পারেনি। আপনার ইনপুট পরিমার্জন করার চেষ্টা করুন।',
      errorUnexpected: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আরো বিস্তারিত জানার জন্য কনসোল চেক করুন।',
    }
  };

  langSignal = signal<'en' | 'bn'>('en');

  translations = computed(() => this.translationsDb[this.langSignal()]);

  setLanguage(lang: 'en' | 'bn'): void {
    this.langSignal.set(lang);
  }
}
