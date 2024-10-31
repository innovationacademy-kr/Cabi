// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  Messaging,
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
let messaging: null | Messaging = null;
let isApiSupported = false;

isSupported().then((result) => {
  isApiSupported = result;
  if (
    typeof window !== "undefined" &&
    typeof window.navigator !== "undefined" &&
    isApiSupported
  ) {
    messaging = getMessaging(app);
  }
});
// NOTE : 사용자 브라우저가 푸시 알림 기능을 지원하는지 확인

const unsupportedMsg = `사용 중인 환경에서는 푸시 알림 기능이
지원되지 않습니다.
데스크탑 이용을 권장드립니다.`;

const checkBrowserSupport = () => {
  if (!isApiSupported) {
    let error = new Error(unsupportedMsg);
    error.name = "브라우저 알림 지원 제한";
    throw error;
  }
};

// FCM APP을 등록 후 브라우저 알림 권한을 요청하고, 토큰을 반환
export const requestFcmAndGetDeviceToken = async (): Promise<string | null> => {
  checkBrowserSupport();

  console.log("권한 요청 중...");
  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return null;
  }

  console.log("알림 권한이 허용됨");

  const token = await getToken(messaging!, {
    vapidKey: import.meta.env.VITE_FIREBASE_APP_VAPID_KEY,
  });

  if (token) console.log("token: ", token);
  else console.log("Can not get Token");

  onMessage(messaging!, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
    // ...
  });

  return token;
};

// FCM 토큰 제거 및 브라우저 알람 권한 해제
export const deleteFcmToken = async (): Promise<void> => {
  checkBrowserSupport();

  await deleteToken(messaging!);
  console.log("Token deleted.");
};
