export const getLocalStorageItem = (key: string) => {
  return localStorage.getItem(key);
};

export const removeLocalStorageItem = (key: string) => {
  return localStorage.removeItem(key);
};

export const setLocalStorageItem = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};
