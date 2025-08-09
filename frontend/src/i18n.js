import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import axios from 'axios';
// Remove these imports as they don't work in browser context
// import fs from 'fs';
// import path from 'path';

// Function to translate missing text using the Flask API
const translateMissingText = async (text, toLang) => {
  try {
    if (toLang === 'en') return text; // Don't translate English
    
    const data = JSON.stringify({
      text: text,
      from_lang: 'en',
      to_lang: toLang
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://127.0.0.1:3000/translate', // Your Flask API endpoint
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    console.log(`Translated "${text}" to ${toLang}:`, response.data.translated_text);
    return response.data.translated_text;
  } catch (error) {
    console.error(`Translation error for "${text}":`, error);
    return text; // Return original text if translation fails
  }
};

// Helper function to save translations to file
const saveTranslationToFile = async (key, translation, lang) => {
  // This part needs to be handled differently in a browser environment
  // since direct file system access isn't available
  try {
    // In a real implementation, you would send this to your backend
    // to handle the file writing
    console.log(`Would save translation: "${key}" → "${translation}" (${lang})`);
    
    // For demo purposes, we'll store in localStorage temporarily
    const pendingWrites = JSON.parse(localStorage.getItem('pendingTranslationWrites') || '{}');
    if (!pendingWrites[lang]) pendingWrites[lang] = {};
    pendingWrites[lang][key] = translation;
    localStorage.setItem('pendingTranslationWrites', JSON.stringify(pendingWrites));
  } catch (error) {
    console.error('Error saving translation:', error);
  }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'hi', 'bn', 'ta', 'gu', 'as', 'kn', 'ml', 'ur', 'mr', 'bho'],
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false,
    },
    saveMissing: true,
    missingKeyHandler: async (lng, ns, key, fallbackValue) => {
      // Only process if it's not English
      if (lng !== 'en') {
        console.log(`Missing translation: [${lng}] ${key}`);
        
        // Get current language from localStorage
        const currentLang = localStorage.getItem('i18nextLng') || lng;
        
        // Translate the text
        const translatedText = await translateMissingText(
          fallbackValue || key, 
          currentLang
        );
        
        // Save to appropriate translation file
        if (translatedText && translatedText !== key) {
          await saveTranslationToFile(key, translatedText, currentLang);
        }
      }
    }
  }).then(() => {
    // Add a timeout to ensure all initial translations are processed
    // This will execute only once after i18n is initialized
    setTimeout(() => {
      console.log('All translations completed. Pending translations in localStorage:');
      const pendingTranslations = JSON.parse(localStorage.getItem('pendingTranslationWrites') || '{}');
      const currentLang = localStorage.getItem("i18nextLng");
      const langTranslations = pendingTranslations[currentLang] || {};
      const data = {
        translated_data: JSON.stringify(langTranslations),
        lang: currentLang
      };


      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:3000/update-translations',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      console.log('kaam ho gaya bhai');
      console.log(data);
      if(data != '{}') {
      axios.request(config)
        .then(response => {
          console.log('Pending translations sent to server:', response.data);
        })
        .catch(error => {
          console.error('Error sending pending translations:', error);
        });
      }
    }, 2000);
  });
  

// Utility function for developers to extract pending translations
if (process.env.NODE_ENV === 'development') {
  window.extractPendingTranslations = () => {
    const pendingWrites = JSON.parse(localStorage.getItem('pendingTranslationWrites') || '{}');
    
    // Format each language's translations as JSON
    Object.entries(pendingWrites).forEach(([lang, translations]) => {
      console.log(`\n=== Translations for ${lang} ===`);
      console.log(JSON.stringify(translations, null, 2));
      
      // Create instructions for adding to translation files
      console.log(`\nCopy these translations to: /locales/${lang}/translation.json\n`);
    });
    
    // Offer to clear pending translations
    console.log('\nTo clear pending translations, run: localStorage.removeItem("pendingTranslationWrites")');
  };
  
  // Add a function to display all pending translations at any time
  window.showAllPendingTranslations = () => {
    console.log('Current pending translations in localStorage:');
    console.log(localStorage.getItem('pendingTranslationWrites'));
  };
  
  console.info("To extract pending translations for file updates, run: window.extractPendingTranslations()");
  console.info("To view raw pending translations, run: window.showAllPendingTranslations()");
}

export default i18n;