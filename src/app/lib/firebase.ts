import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA7tvQoWW0BAE0KXVJOExZ-nJXNEZ1CPKc",
    authDomain: "laeqcloud.firebaseapp.com",
    projectId: "laeqcloud",
    storageBucket: "laeqcloud.firebasestorage.app",
    messagingSenderId: "618615143477",
    appId: "1:618615143477:web:60b553a021eb81d247857c",
    measurementId: "G-EZDGERT616"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // هترجع بيانات المستخدم
  } catch (error) {
    console.error(error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};
