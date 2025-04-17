import { useState } from "react";
import Card from "@/Cabinet/components/Card/Card";
import SocialAccountLinkCardContent from "@/Cabinet/components/Card/SocialAccountLinkCard/SocialAccountLinkCardContent";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import SocialAccountSwitchModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "@/Cabinet/components/Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";

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
