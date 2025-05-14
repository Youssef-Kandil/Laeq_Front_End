class encryption {
 // تحويل النص إلى مشفر
  encryption = (token :string , key:string) => {
    let encrypted = "";
    for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        
        // طبّق XOR مع المفتاح
        const xored = charCode ^ keyCharCode;
        
        // أضف الإزاحة بناءً على موقع الحرف
        const offsetCharCode = xored + (i % 3 === 0 ? keyCharCode % 10 : -keyCharCode % 7);
        
        // حوّل النتيجة إلى حرف
        encrypted += String.fromCharCode(offsetCharCode);
    }
    
    // أضف خلط للحروف
    return encrypted.split("").reverse().join("");
};

// فك التشفير
 decryption = (encryptedToken:string, key:string) => {
    // فك خلط الحروف
    const reversedToken = encryptedToken.split("").reverse().join("");
    
    let decrypted = "";
    for (let i = 0; i < reversedToken.length; i++) {
        const offsetCharCode = reversedToken.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % key.length);
        
        // أزل الإزاحة بناءً على موقع الحرف
        const xored = offsetCharCode - (i % 3 === 0 ? keyCharCode % 10 : -keyCharCode % 7);
        
        // فك XOR مع المفتاح
        const originalCharCode = xored ^ keyCharCode;
        
        // حوّل النتيجة إلى الحرف الأصلي
        decrypted += String.fromCharCode(originalCharCode);
    }
    
    return decrypted;
};
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new encryption();

