import encryption from "./encryption";

export function decryptionLocalStorage(localStorage_Key: string) {

  if (typeof window === "undefined") {
    return null; 
  }

  const token = localStorage.getItem(localStorage_Key);
  if (!token) return null;

  const key = process.env.NEXT_PUBLIC_HASH_KEY as string;
  try {
     console.error("decryption : ",JSON.parse(encryption.decryption(token, key)));
    return encryption.decryption(token, key);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}
