// src/utils/cookies.js

export function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') {
    // Handle server-side rendering or non-browser environment
    return;
  }

  const cookieOptions = {
    path: '/',
    ...options
  };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.expires instanceof Date) {
    cookieOptions.expires = cookieOptions.expires.toUTCString();
  }

  if (cookieOptions.expires) {
    cookieString += `; Expires=${cookieOptions.expires}`;
  }

  if (cookieOptions.maxAge) {
    cookieString += `; Max-Age=${cookieOptions.maxAge}`;
  }

  if (cookieOptions.domain) {
    cookieString += `; Domain=${cookieOptions.domain}`;
  }

  if (cookieOptions.path) {
    cookieString += `; Path=${cookieOptions.path}`;
  }

  if (cookieOptions.secure) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

export function getCookie(name) {
  if (typeof document === 'undefined') {
    // Handle server-side rendering or non-browser environment
    return null;
  }

  const cookies = document.cookie ? document.cookie.split('; ') : [];

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [cookieName, cookieValue] = cookie.split('=');
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

export function deleteCookie(name) {
  if (typeof document === 'undefined') {
    // Handle server-side rendering or non-browser environment
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/;`;
}
