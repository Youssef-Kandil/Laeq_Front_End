"use client";

import { SessionProvider } from "next-auth/react";
// import { NextIntlClientProvider } from "next-intl";
import ReactQueryProvider from "./ReactQueryProvider";

export default function MainProviders({
  children,
//   locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <SessionProvider>
      {/* <NextIntlClientProvider locale={locale}> */}
        <ReactQueryProvider>{children}</ReactQueryProvider>
      {/* </NextIntlClientProvider> */}
    </SessionProvider>
  );
}
