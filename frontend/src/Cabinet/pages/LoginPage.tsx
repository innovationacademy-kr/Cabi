import { HttpStatusCode } from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "@/Cabinet/assets/css/loginPage.css";
import LoginTemplate from "@/Cabinet/components/Login/LoginTemplate";
import { oAuthErrorMsgMap } from "@/Cabinet/assets/data/maps";
import { OAuthErrorType } from "@/Cabinet/types/enum/error.type.enum";

const LoginPage = () => {
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();
  const messageParamValue = searchParams.get("message");
  const statusParamValue = searchParams.get("status");

  const getOAuthErrorMessage = (errorType: string | null) => {
    const defaultErrorMsg = "오류가 발생했습니다. 다시 시도해 주세요.";
    const isValidErrorType = Object.values(OAuthErrorType).includes(
      errorType as OAuthErrorType
    );
    if (errorType && isValidErrorType)
      return oAuthErrorMsgMap[errorType as OAuthErrorType];

    return defaultErrorMsg;
  };

  const handleOAuthError = () => {
    const alertMsg = getOAuthErrorMessage(messageParamValue);

    alert(alertMsg);
    navigator("/login");
  };

  useEffect(() => {
    if (statusParamValue && Number(statusParamValue) !== HttpStatusCode.Ok) {
      handleOAuthError();
    }
  }, []);

  return <LoginTemplate />;
};

export default LoginPage;
