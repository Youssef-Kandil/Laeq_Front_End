import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // locales: ['en', 'ar'], 
  locales: ['en'], 
  defaultLocale:'en',
  // localePrefix: "as-needed",
  localePrefix: "always",
});