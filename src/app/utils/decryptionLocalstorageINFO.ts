import encryption from "./encryption";
import Cookies from "js-cookie";


export function decryptionLocalStorage(localStorage_Key: string) {

  if (typeof window === "undefined") {
    return null; 
  }

  const token = Cookies.get(localStorage_Key);
  if (!token) return null;

  const key = process.env.NEXT_PUBLIC_HASH_KEY as string;
  try {
    return encryption.decryption(token, key);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}
