import {
  deleteFcmToken,
  requestFcmAndGetDeviceToken,
} from "@/Cabinet/firebase/firebase-messaging-sw";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "@/Cabinet/recoil/atoms";
import AnnounceTemplate from "@/Cabinet/components/Announce/AnnounceTemplate";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosMyInfo,
  axiosUpdateDeviceToken,
} from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";

const PostLogin = (): JSX.Element => {
  const setMyInfo = useSetRecoilState(userState);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const token = getCookie("access_token");

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await axiosMyInfo();
      setUser(myInfo);
      if (myInfo.alarmTypes?.push && myInfo.isDeviceTokenExpired) {
        await deleteFcmToken();
        const deviceToken = await requestFcmAndGetDeviceToken();
        await axiosUpdateDeviceToken(deviceToken);
      }
      setMyInfo(myInfo);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    else if (token) {
      getMyInfo();
      let time = setTimeout(() => {
        navigate("/home");
      }, 600);

      return () => {
        clearTimeout(time);
      };
    }
  }, []);

  return (
    <AnnounceTemplate
      title="로그인 중"
      subTitle="로그인 중입니다. "
      content="잠시만 기다려주세요 :)"
      type="LOADING"
    />
  );
};

export default PostLogin;
