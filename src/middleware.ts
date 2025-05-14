import createMiddleware from 'next-intl/middleware';
import { NextRequest } from "next/server";
import {routing} from './i18n/routing';

 
// export default createMiddleware(routing);

export default function middleware(req:NextRequest) {
  console.log("Middleware locale:", req.nextUrl.locale); // طباعة اللغة الحالية
  console.log("Search Params:", req.nextUrl.search);
  return createMiddleware(routing)(req);
}
 
export const config = {
  // matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  // matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  matcher: ["/","/(ar|en):path*"],
};