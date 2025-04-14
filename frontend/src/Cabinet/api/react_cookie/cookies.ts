import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, option?: any): void => {
  return cookies.set(name, value, { ...option });
};

export const getCookie = (name: string): string => {
  return cookies.get<string>(name);
};

export const removeCookie = (name: string, option?: any): void => {
  return cookies.remove(name, { ...option });
};

export const removeAllCookies = (option: any): void => {
  // 모든 쿠키 이름 가져오기
  const allCookies = cookies.getAll();

  // 각 쿠키 삭제
  Object.keys(allCookies).forEach((name) => {
    cookies.remove(name, { ...option });
  });
};
