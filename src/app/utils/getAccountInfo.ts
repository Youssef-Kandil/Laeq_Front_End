import { AccountInfo } from "../Types/AccountsType";
import encryption from "./encryption";

// export function getAdminAccountInfo(): AccountInfo | null {
//   if (typeof window === "undefined") return null; // منع الكراش في السيرفر
//   const adminAccount = localStorage.getItem("AccountInfo");
//   return adminAccount ? (JSON.parse(adminAccount) as AccountInfo) : null;
// }


export function getAdminAccountInfo(localStorage_Key: string) : AccountInfo | null {

  if (typeof window === "undefined") {
    return null; 
  }

  const token = localStorage.getItem(localStorage_Key);
  if (!token) return null;

  const key = process.env.NEXT_PUBLIC_HASH_KEY as string;
  try {
    const decryption = encryption.decryption(token, key);
    console.error("decryption : ",JSON.parse(decryption));
    return JSON.parse(decryption);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}


