"use client";
import {useLocale} from 'next-intl';

import { redirect } from 'next/navigation';

export default function Page() {
  const current_lang = useLocale();
  redirect(`${current_lang}/Screens/website/home`);
}

