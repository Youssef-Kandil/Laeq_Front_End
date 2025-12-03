"use client";
import {useLocale} from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const current_lang = useLocale();
  const router = useRouter();
  
  useEffect(() => {
    router.push(`${current_lang}/Screens/website/home`);
  }, [current_lang, router]);
  
  return null;
}

