import {
  deleteFcmToken,
  requestFcmAndGetDeviceToken,
} from "@/firebase/firebase-messaging-sw";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms";
import { UserDto } from "@/types/dto/user.dto";
import { axiosMyInfo, axiosUpdateDeviceToken } from "@/api/axios/axios.custom";
import { getCookie } from "@/api/react_cookie/cookies";

const PostLogin = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [myInfo, setMyInfo] = useRecoilState(userState);

  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie("access_token");

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await axiosMyInfo();
      setUser(myInfo);
      setIsValidToken(true);
      console.log(myInfo);
      if (myInfo.alarmTypes?.push && myInfo.isDeviceTokenExpired) {
        await deleteFcmToken();
        const deviceToken = await requestFcmAndGetDeviceToken();
        await axiosUpdateDeviceToken(deviceToken);
      }
      setMyInfo(myInfo);
      navigate("/home");
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    else if (token) {
      getMyInfo();
    }
  }, []);

  return (
    <div className="App">
      <h1>Auth</h1>
    </div>
  );
};

export default PostLogin;
