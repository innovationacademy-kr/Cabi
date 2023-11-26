import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
import ExtensionCardContainer from "@/components/Card/ExtensionCard/ExtensionCard.container";
import LentInfoCardContainer from "@/components/Card/LentInfoCard/LentInfoCard.container";
import NotificationCardContainer from "@/components/Card/NotificationCard/NotificationCard.container";
import ProfileCardContainer from "@/components/Card/ProfileCard/ProfileCard.container";
import ThemeColorCardContainer from "@/components/Card/ThemeColorCard/ThemeColorCard.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { axiosMyInfo } from "@/api/axios/axios.custom";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useRecoilState(userState);

  const updateLocalStorage = () => {
    const recoilPersist = localStorage.getItem("recoil-persist");
    if (recoilPersist) {
      let recoilPersistObj = JSON.parse(recoilPersist);
      delete recoilPersistObj.CurrentFloor;
      delete recoilPersistObj.CurrentSection;
      localStorage.setItem("recoil-persist", JSON.stringify(recoilPersistObj));
    }
  };

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await axiosMyInfo();
      setMyInfo(myInfo);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    updateLocalStorage();
    getMyInfo();
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
          <ExtensionCardContainer
            extensionInfo={myInfo.lentExtensionResponseDto}
          />
          <LentInfoCardContainer
            name={myInfo.name}
            banned={!!myInfo.unbannedAt}
          />
          <ThemeColorCardContainer />
          <NotificationCardContainer />
        </CardGridWrapper>
      )}
    </>
  );
};

const CardGridWrapper = styled.div`
  display: grid;
  padding: 60px 0;
  justify-content: center;
  align-items: center;
  width: 100%;
  grid-gap: 20px;
  grid-template-columns: 350px 350px;
  grid-template-rows: 163px 183px 215px;
  grid-template-areas: "profile lentInfo" // h: 163px h: 366px
    "extension lentInfo" // h: 183px
    "theme notification"; // h: 215px h: 215px

  @media (max-width: 768px) {
    grid-template-columns: 350px;
    grid-template-rows: 163px 366px 183px 215px 215px;
    grid-template-areas:
      "profile"
      "lentInfo"
      "extension"
      "theme"
      "notification";
  }
`;

export default ProfilePage;
