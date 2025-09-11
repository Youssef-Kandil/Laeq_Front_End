import { AccountInfo } from "../Types/AccountsType";
import encryption from "./encryption";
import Cookies from "js-cookie";



// export function getAdminAccountInfo(): AccountInfo | null {
//   if (typeof window === "undefined") return null; // منع الكراش في السيرفر
//   const adminAccount = localStorage.getItem("AccountInfo");
//   return adminAccount ? (JSON.parse(adminAccount) as AccountInfo) : null;
// }


export function getAdminAccountInfo(localStorage_Key: string) : AccountInfo | null {


  // const token = localStorage.getItem(localStorage_Key);
  const token =  Cookies.get(localStorage_Key);
  console.warn("token :: ",token);
  if (!token) return null;

  const key = process.env.NEXT_PUBLIC_HASH_KEY as string;
  try {
    const decryption = encryption.decryption(token, key);
    return JSON.parse(decryption);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}


