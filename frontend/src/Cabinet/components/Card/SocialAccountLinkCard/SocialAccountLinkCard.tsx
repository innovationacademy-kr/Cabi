import { useState } from "react";
import Card from "@/Cabinet/components/Card/Card";
import SocialAccountLinkCardContent from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCardContent";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";

export type TOAuthProviderOrEmpty = TOAuthProvider | "";
// TODO : 위치 변경

const SocialAccountLinkCard = () => {
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);

  return (
    <>
      <Card
        title="소셜 로그인"
        gridArea="socialAccountLink"
        height="276px"
        tooltipText="소셜 계정은 하나만 연결할 수 있습니다."
      >
        <SocialAccountLinkCardContent
          setIsUnlinkModalOpen={setIsUnlinkModalOpen}
          setIsSwitchModalOpen={setIsSwitchModalOpen}
        />
      </Card>
      <ModalPortal>
        {isUnlinkModalOpen && (
          <SocialAccountUnlinkModal setIsModalOpen={setIsUnlinkModalOpen} />
        )}
        {isSwitchModalOpen && (
          <SocialAccountSwitchModal setIsModalOpen={setIsSwitchModalOpen} />
        )}
      </ModalPortal>
    </>
  );
};

export default SocialAccountLinkCard;
