import { useState } from "react";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import ModalPortal from "../../Modals/ModalPortal";
import SocialAccountSwitchModal from "../../Modals/SocialAccountLinkModal/SocialAccountSwitchModal";
import SocialAccountUnlinkModal from "../../Modals/SocialAccountLinkModal/SocialAccountUnlinkModal";
import Card from "../Card";
import SocialAccountLinkCardContent from "./SocialAccountLinkCardContent";

export type TOAuthProviderOrEmpty = TOAuthProvider | "";
// TODO : 타입 다른데에서도 사용

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
