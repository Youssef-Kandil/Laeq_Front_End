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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setAdminAccountInfo(localStorage_Key: string,value:any) : boolean {

  const key = process.env.NEXT_PUBLIC_HASH_KEY as string;

  try {
    const stringified = JSON.stringify(value);
    const encrypted = encryption.encryption(stringified, key);

    // تخزين في الكوكيز
    Cookies.set(localStorage_Key, encrypted, { expires: 30 }); 
    return true;
    // expires = 7 يعني الكوكي هيقعد أسبوع (تقدر تغيرها)
  } catch (err) {
    console.error("Encryption failed:", err);
    return false;
  }
}


