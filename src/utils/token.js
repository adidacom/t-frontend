import jwtDecode from 'jwt-decode';

export const JWT_KEY = 't4_jwt';

const getTokenPayload = (token) => jwtDecode(token);

export function validJwt(token, decoder = getTokenPayload, currentTime = +new Date()) {
  const decoded = decoder(token);
  const now = currentTime / 1000;
  const { exp: expiration } = decoded;
  return expiration > now;
}

export function getToken() {
  if (localStorage.getItem(JWT_KEY)) return localStorage.getItem(JWT_KEY);
  return sessionStorage.getItem(JWT_KEY);
}

export function removeToken() {
  sessionStorage.removeItem(JWT_KEY);
  localStorage.removeItem(JWT_KEY);
}

export function storeToken(token, rememberMe = false) {
  sessionStorage.setItem(JWT_KEY, token);
  if (rememberMe) localStorage.setItem(JWT_KEY, token);
}
