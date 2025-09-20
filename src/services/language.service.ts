import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'bn';

const translations = {
  en: {
    title: 'AI Product Description Generator',
    selectLanguage: 'Language:',
    // Form
    formTitle: 'Product Details',
    textInputTab: 'Text Input',
    imageInputTab: 'Image Input',
    productNameLabel: 'Product Name',
    productNamePlaceholder: 'e.g., "Classic Leather Wallet"',
    featuresLabel: 'Key Features & Benefits',
    featuresPlaceholder: 'e.g., "Handmade, 100% genuine leather, RFID blocking"',
    toneLabel: 'Desired Tone of Voice',
    tonePlaceholder: 'e.g., "Luxury, Playful, Professional"',
    targetAudienceLabel: 'Target Audience',
    targetAudiencePlaceholder: 'e.g., "Young professionals, tech enthusiasts"',
    imageUploadLabel: 'Upload Product Image',
    imageUploadSublabel: 'Upload an image and describe your target audience to get Facebook post captions.',
    selectImage: 'Select Image',
    changeImage: 'Change Image',
    generateButton: 'Generate Descriptions',
    generatingButton: 'Generating...',
    // Output
    outputTitle: 'Generated Descriptions',
    generating: 'Generating, please wait...',
    copy: 'Copy',
    copied: 'Copied!',
    // Errors
    errorNoDescriptions: 'The AI could not generate descriptions. Please try refining your input.',
    errorUnexpected: 'An unexpected error occurred. Please check the console for more details.',
  },
  bn: {
    title: 'এআই পণ্য বিবরণ জেনারেটর',
    selectLanguage: 'ভাষা:',
    // Form
    formTitle: 'পণ্যের বিবরণ',
    textInputTab: 'টেক্সট ইনপুট',
    imageInputTab: 'ছবি ইনপুট',
    productNameLabel: 'পণ্যের নাম',
    productNamePlaceholder: 'যেমন, "ক্লাসিক লেদার ওয়ালেট"',
    featuresLabel: 'মূল বৈশিষ্ট্য এবং সুবিধা',
    featuresPlaceholder: 'যেমন, "হস্তনির্মিত, ১০০% আসল চামড়া, আরএফআইডি ব্লকিং"',
    toneLabel: 'কথার কাঙ্খিত সুর',
    tonePlaceholder: 'যেমন, "বিলাসবহুল, খেলাধুলা, পেশাদার"',
    targetAudienceLabel: 'লক্ষ্য দর্শক',
    targetAudiencePlaceholder: 'যেমন, "তরুণ পেশাদার, প্রযুক্তি উৎসাহী"',
    imageUploadLabel: 'পণ্যের ছবি আপলোড করুন',
    imageUploadSublabel: 'ফেসবুক পোস্ট ক্যাপশন পেতে একটি ছবি আপলোড করুন এবং আপনার লক্ষ্য দর্শক বর্ণনা করুন।',
    selectImage: 'ছবি নির্বাচন করুন',
    changeImage: 'ছবি পরিবর্তন করুন',
    generateButton: 'বিবরণ তৈরি করুন',
    generatingButton: 'তৈরি করা হচ্ছে...',
    // Output
    outputTitle: 'তৈরি করা বিবরণ',
    generating: 'তৈরি করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
    copy: 'অনুলিপি',
    copied: 'অনুলিপি করা হয়েছে!',
    // Errors
    errorNoDescriptions: 'এআই বিবরণ তৈরি করতে পারেনি। অনুগ্রহ করে আপনার ইনপুট পরিমার্জন করার চেষ্টা করুন।',
    errorUnexpected: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আরো বিস্তারিত জানার জন্য কনসোল চেক করুন।',
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  langSignal = signal<Lang>('en');

  setLanguage(lang: Lang) {
    this.langSignal.set(lang);
  }

  translations = computed(() => translations[this.langSignal()]);
}
