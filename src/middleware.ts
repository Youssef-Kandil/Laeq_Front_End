import createMiddleware from 'next-intl/middleware';
import { NextRequest } from "next/server";
import {routing} from './i18n/routing';

 
// export default createMiddleware(routing);

export default function middleware(req:NextRequest) {
  return createMiddleware(routing)(req);
}
 
export const config = {
  // matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  // matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  matcher: ["/","/(ar|en):path*"],
};