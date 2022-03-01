import { parseCookie } from "./parseCookie";
import CryptoJS from 'crypto-js'

export const getUserIdFromCookie = (
  req: Request & { headers: Headers & { cookie: string; }; }
) => {  
  const cookies = req.headers.cookie && parseCookie(req.headers.cookie);
  
  if (cookies?.reddituid) {
    const bytes = CryptoJS.AES.decrypt(
      cookies.reddituid,
      process.env.SECRET_KEY_TO_ENCODE_USER_ID?.toString() || '123haha'
    );
    const originalUserID = bytes.toString(CryptoJS.enc.Utf8);
    
    return +originalUserID;
  } else {
    return null;
  }
};
