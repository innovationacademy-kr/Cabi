import { deleteRecoilPersistFloorSection } from "@/Cabinet//utils/recoilPersistUtils";
import {
  deleteFcmToken,
  requestFcmAndGetDeviceToken,
} from "@/Cabinet/firebase/firebase-messaging-sw";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import AlarmCardContainer from "@/Cabinet/components/Card/AlarmCard/AlarmCard.container";
import DisplayStyleCardContainer from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard.container";
import LentInfoCardContainer from "@/Cabinet/components/Card/LentInfoCard/LentInfoCard.container";
import PointColorCardContainer from "@/Cabinet/components/Card/PointColorCard/PointColorCard.container";
import ProfileCardContainer from "@/Cabinet/components/Card/ProfileCard/ProfileCard.container";
import SnsConnectionCardContainer from "@/Cabinet/components/Card/SnsConnectionCard/SnsConnectionCard.container";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  axiosMyInfo,
  axiosUpdateDeviceToken,
} from "@/Cabinet/api/axios/axios.custom";
import instance from "../api/axios/axios.instance";

const axiosLinkGoogleAccount = async (oauthMail: string) => {
  try {
    const { data } = await instance.post(
      `${import.meta.env.VITE_BE_HOST}/v4/auth/mail`,
      { oauthMail }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useRecoilState(userState);

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await axiosMyInfo();
      if (myInfo.alarmTypes?.push && myInfo.isDeviceTokenExpired) {
        await deleteFcmToken();
        const deviceToken = await requestFcmAndGetDeviceToken();
        await axiosUpdateDeviceToken(deviceToken);
      }
      setMyInfo(myInfo);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    deleteRecoilPersistFloorSection();
    getMyInfo();
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const oauthMail = url.searchParams.get("oauthMail");
    if (oauthMail) {
      console.log(oauthMail);
      // link google account
      axiosLinkGoogleAccount(oauthMail);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <CardGridWrapper>
          <ProfileCardContainer name={myInfo.name} />
          <LentInfoCardContainer
            name={myInfo.name}
            unbannedAt={myInfo.unbannedAt}
          />
          <DisplayStyleCardContainer />
          <PointColorCardContainer />
          <AlarmCardContainer alarm={myInfo.alarmTypes} />
          <SnsConnectionCardContainer
            userOauthConnection={myInfo.userOauthConnection}
            // TODO : 백에서 받은 연동된 데이터
          />
        </CardGridWrapper>
      )}
    </>
  );
};

const CardGridWrapper = styled.div`
  display: grid;
  padding: 60px 0;
  justify-content: center;
  align-items: start;
  width: 100%;
  grid-gap: 20px;
  grid-template-columns: 350px 350px;
  grid-template-rows: 163px 183px 230px 230px;
  grid-template-areas: "profile lentInfo" // h: 163px h: 366px
    "displayStyle lentInfo" // h: 183px
    "pointColor alarm" // h: 230px h: 230px
    "snsConnection snsConnection"; // h: 230px

  @media (max-width: 768px) {
    grid-template-columns: 350px;
    grid-template-rows: 163px 366px 183px 230px 230px 230px;
    grid-template-areas:
      "profile"
      "lentInfo"
      "displayStyle"
      "pointColor"
      "alarm"
      "snsConnection";
  }
`;

export default ProfilePage;
