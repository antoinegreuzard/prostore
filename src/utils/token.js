import { APP_KEY } from './constants/appConstants';

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(APP_KEY, JSON.stringify(token));
  }
};

export const getToken = () => {
  const tokenLocalStorage = localStorage.getItem(`${APP_KEY}`);

  return tokenLocalStorage ? JSON.parse(tokenLocalStorage) : null;
};

export const removeToken = async () => {
  localStorage.removeItem(APP_KEY);
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (!response.ok) {
      Error(response.status);
    }
  } catch (error) {
    Error(error.status);
  }
};
