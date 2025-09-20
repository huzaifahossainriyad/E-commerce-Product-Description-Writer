import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'bn';

const translations = {
  en: {
    title: 'AI Facebook Post Generator',
    selectLanguage: 'Language:',
    // Form
    formTitle: 'Product Details',
    textInputTab: 'Text Input',
    imageInputTab: 'Image Input',
    productNameLabel: 'Product Name',
    productNamePlaceholder: 'e.g., "Classic Leather Wallet"',
    featuresLabel: 'Key Features & Benefits',
    featuresPlaceholder: 'e.g., "Handmade, 100% genuine leather, RFID blocking"',
    toneLabel: 'Desired Tone of Voice (Optional)',
    tonePlaceholder: 'e.g., "Luxury, Playful, Professional"',
    targetAudienceLabel: 'Target Audience',
    targetAudiencePlaceholder: 'e.g., "Young professionals, tech enthusiasts"',
    imageUploadLabel: 'Upload Product Image (Optional)',
    imageUploadSublabel: 'Upload an image to generate a Facebook post.',
    infoNoteFacebook: 'A Facebook sales post will be generated based on your image. Just define the target audience below.',
    selectImage: 'Select or Drag Image',
    changeImage: 'Change Image',
    generateButton: 'Generate Captions',
    generatingButton: 'Generating...',
    dropImageHere: 'Drop image here',
    fileName: 'File name:',
    fileSize: 'File size:',
    invalidFileType: 'Invalid file type. Please upload a PNG, JPG, or WEBP image.',
    nameRequired: 'Product name is required.',
    featuresRequired: 'Key features are required.',
    audienceRequired: 'Target audience is required.',
    // Output
    outputTitle: 'Generated Captions',
    generating: 'Generating, please wait...',
    copy: 'Copy',
    copied: 'Copied!',
    // Errors
    errorNoDescriptions: 'The AI could not generate captions. Please try refining your input.',
    errorUnexpected: 'An unexpected error occurred. Please check the console for more details.',
  },
  bn: {
    title: 'এআই ফেসবুক পোস্ট জেনারেটর',
    selectLanguage: 'ভাষা:',
    // Form
    formTitle: 'পণ্যের বিবরণ',
    textInputTab: 'টেক্সট ইনপুট',
    imageInputTab: 'ছবি ইনপুট',
    productNameLabel: 'পণ্যের নাম',
    productNamePlaceholder: 'যেমন, "ক্লাসিক লেদার ওয়ালেট"',
    featuresLabel: 'মূল বৈশিষ্ট্য এবং সুবিধা',
    featuresPlaceholder: 'যেমন, "হস্তনির্মিত, ১০০% আসল চামড়া, আরএফআইডি ব্লকিং"',
    toneLabel: 'কথার কাঙ্খিত সুর (ঐচ্ছিক)',
    tonePlaceholder: 'যেমন, "বিলাসবহুল, খেলাধুলা, পেশাদার"',
    targetAudienceLabel: 'লক্ষ্য দর্শক',
    targetAudiencePlaceholder: 'যেমন, "তরুণ পেশাদার, প্রযুক্তি উৎসাহী"',
    imageUploadLabel: 'পণ্যের ছবি আপলোড করুন (ঐচ্ছিক)',
    imageUploadSublabel: 'ফেসবুক পোস্ট তৈরি করতে একটি ছবি আপলোড করুন।',
    infoNoteFacebook: 'আপনার ছবির উপর ভিত্তি করে একটি ফেসবুক সেলস পোস্ট তৈরি করা হবে। শুধু নিচের লক্ষ্য দর্শক নির্ধারণ করুন।',
    selectImage: 'ছবি নির্বাচন করুন বা টেনে আনুন',
    changeImage: 'ছবি পরিবর্তন করুন',
    generateButton: 'ক্যাপশন তৈরি করুন',
    generatingButton: 'তৈরি করা হচ্ছে...',
    dropImageHere: 'এখানে ছবি ছাড়ুন',
    fileName: 'ফাইলের নাম:',
    fileSize: 'ফাইলের আকার:',
    invalidFileType: 'অবৈধ ফাইলের প্রকার। অনুগ্রহ করে একটি PNG, JPG, বা WEBP ছবি আপলোড করুন।',
    nameRequired: 'পণ্যের নাম আবশ্যক।',
    featuresRequired: 'মূল বৈশিষ্ট্য আবশ্যক।',
    audienceRequired: 'লক্ষ্য দর্শক আবশ্যক।',
    // Output
    outputTitle: 'তৈরি করা ক্যাপশন',
    generating: 'তৈরি করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
    copy: 'অনুলিপি',
    copied: 'অনুলিপি করা হয়েছে!',
    // Errors
    errorNoDescriptions: 'এআই ক্যাপশন তৈরি করতে পারেনি। অনুগ্রহ করে আপনার ইনপুট পরিমার্জন করার চেষ্টা করুন।',
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