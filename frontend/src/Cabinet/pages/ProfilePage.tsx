import { deleteRecoilPersistFloorSection } from "@/Cabinet//utils/recoilPersistUtils";
import {
  deleteFcmToken,
  requestFcmAndGetDeviceToken,
} from "@/Cabinet/firebase/firebase-messaging-sw";
import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import { linkedProviderState } from "@/Cabinet/recoil/selectors";
import AlarmCardContainer from "@/Cabinet/components/Card/AlarmCard/AlarmCard.container";
import DisplayStyleCardContainer from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard.container";
import LentInfoCardContainer from "@/Cabinet/components/Card/LentInfoCard/LentInfoCard.container";
import PointColorCardContainer from "@/Cabinet/components/Card/PointColorCard/PointColorCard.container";
import ProfileCardContainer from "@/Cabinet/components/Card/ProfileCard/ProfileCard.container";
import SocialAccountLinkCard from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCard";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  axiosMyInfo,
  axiosUpdateDeviceToken,
} from "@/Cabinet/api/axios/axios.custom";
import useOAuth from "../hooks/useOAuth";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParamValue = searchParams.get("status");
  // TODO : hook / utils로 분리
  const linkedProvider = useRecoilValue(linkedProviderState);
  const { updateUnlinkedProviderStatus } = useOAuth();

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

  const socialAccountLinkSuccessHandler = () => {
    if (linkedProvider) updateUnlinkedProviderStatus(linkedProvider, false);
  };

  useEffect(() => {
    setIsLoading(true);
    deleteRecoilPersistFloorSection();
    getMyInfo();
    if (statusParamValue && Number(statusParamValue) === HttpStatusCode.Ok) {
      socialAccountLinkSuccessHandler();
      navigator("/profile");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
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
          <SocialAccountLinkCard />
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
  grid-template-rows: 163px 183px 230px 276px;
  grid-template-areas: "profile lentInfo" // h: 163px h: 366px
    "displayStyle lentInfo" // h: 183px
    "pointColor alarm" // h: 230px h: 230px
    "socialAccountLink socialAccountLink"; // h: 276px

  @media (max-width: 768px) {
    grid-template-columns: 350px;
    grid-template-rows: 163px 366px 183px 230px 230px 276px;
    grid-template-areas:
      "profile"
      "lentInfo"
      "displayStyle"
      "pointColor"
      "alarm"
      "socialAccountLink";
  }
`;

export default ProfilePage;
