import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
import ExtensionCardContainer from "@/components/Card/ExtensionCard/ExtensionCard.container";
import LentInfoCardContainer from "@/components/Card/LentInfoCard/LentInfoCard.container";
import NotificationCardContainer from "@/components/Card/NotificationCard/NotificationCard.container";
import ProfileCardContainer from "@/components/Card/ProfileCard/ProfileCard.container";
import ThemeColorCardContainer from "@/components/Card/ThemeColorCard/ThemeColorCard.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const myInfo = useRecoilValue(userState);

  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <CardGridWrapper>
          <ProfileCardContainer name={myInfo.name} />
          <ExtensionCardContainer extensible={myInfo.extensible} />
          <LentInfoCardContainer />
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
  grid-template-areas:
    "profile lentInfo"
    "extension lentInfo"
    "theme notification";

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
