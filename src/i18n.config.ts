import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { type GetRequestConfigParams } from "next-intl/server";

export const locales = ["en", "ar"]; // اللغات المدعومة
export const defaultLocale = "en"; // اللغة الافتراضية

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => {
  const selectedLocale = locale ?? defaultLocale; // ✅ التأكد من أن `locale` ليست `undefined`

  if (!locales.includes(selectedLocale)) notFound();

  return {
    locale: selectedLocale, // ✅ `locale` لن تكون `undefined` الآن
    messages: (await import(`./locales/${selectedLocale}.json`)).default,
  };
});
