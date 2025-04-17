import { HttpStatusCode } from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { linkedProviderState } from "@/Cabinet/recoil/selectors";
import { oAuthErrorMsgMap } from "@/Cabinet/assets/data/maps";
import { OAuthErrorType } from "@/Cabinet/types/enum/error.type.enum";
import { removeLocalStorageItem } from "@/Cabinet/api/local_storage/local.storage";
import useOAuth from "@/Cabinet/hooks/useOAuth";
import useURLSearchParams from "@/Cabinet/hooks/useURLSearchParams";

const useOAuthStatus = () => {
  const linkedProvider = useRecoilValue(linkedProviderState);
  const { updateUnlinkedProviderStatus } = useOAuth();
  const { getSearchParam } = useURLSearchParams();
  const status = getSearchParam("status");
  const message = getSearchParam("message");
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const getOAuthErrorMessage = (errorType: string | null) => {
    const defaultErrorMsg = "오류가 발생했습니다. 다시 시도해 주세요.";
    const isValidErrorType = Object.values(OAuthErrorType).includes(
      errorType as OAuthErrorType
    );
    if (errorType && isValidErrorType)
      return oAuthErrorMsgMap[errorType as OAuthErrorType];

    return defaultErrorMsg;
  };

  // 로그인 성공 처리
  useEffect(() => {
    if (
      pathname.includes("home") &&
      status &&
      Number(status) === HttpStatusCode.Ok
    ) {
      removeLocalStorageItem("isLoggedOut");
      navigator("/home");
    }
  }, [status]);

  // 계정 연결 성공 처리
  useEffect(() => {
    if (
      pathname.includes("profile") &&
      status &&
      Number(status) === HttpStatusCode.Ok
    ) {
      if (linkedProvider) {
        updateUnlinkedProviderStatus(linkedProvider, false);
        navigator("/profile");
      }
    }
  }, [status, linkedProvider]);

  // 실패 처리
  useEffect(() => {
    if (
      pathname.includes("login") &&
      status &&
      Number(status) !== HttpStatusCode.Ok
    ) {
      const alertMsg = getOAuthErrorMessage(message);

      alert(alertMsg);
      navigator("/login");
    }
  }, [status]);
};

export default useOAuthStatus;
