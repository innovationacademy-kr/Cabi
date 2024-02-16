import { useState } from "react";
import Card, { IButtonProps } from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDetailStyled,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import { NotificationModal } from "@/components/Modals/NotificationModal/NotificationModal";
import { LentExtensionDto } from "@/types/dto/lent.dto";
import { formatDate } from "@/utils/dateUtils";

interface ExtensionProps {
  extensionInfo: LentExtensionDto | null;
  button: IButtonProps;
}

const ExtensionCard = ({ extensionInfo, button }: ExtensionProps) => {
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  return (
<<<<<<< HEAD
    <>
      <Card
        title={"연장권"}
        onClickToolTip={() => {
          setShowNotificationModal(true);
        }}
        gridArea={"extension"}
        width={"350px"}
        height={"183px"}
        buttons={[button]}
      >
        <CardContentWrapper>
          <CardContentStyled>
            <ContentInfoStyled>사용 기한</ContentInfoStyled>
            <ContentDeatilStyled>
              {!!extensionInfo
                ? formatDate(new Date(extensionInfo.expiredAt), ".")
                : "-"}
            </ContentDeatilStyled>
          </CardContentStyled>
          <CardContentStyled>
            <ContentInfoStyled>연장 기간</ContentInfoStyled>
            <ContentDeatilStyled>
              {!!extensionInfo ? extensionInfo.extensionPeriod + "일" : "-"}
            </ContentDeatilStyled>
          </CardContentStyled>
        </CardContentWrapper>
      </Card>
      {showNotificationModal && (
        <NotificationModal
          title={"연장권 안내"}
          detail={
            "연장권은 매월 2일 제공되며,<br/>이전에 받은 연장권은 사용이 불가능 합니다.<br/>24HANE 기준 160시간을 출석한 경우,<br/> 연장권이 부여됩니다."
          }
          closeModal={() => setShowNotificationModal(false)}
        />
      )}
    </>
=======
    <Card
      title={"연장권"}
      gridArea={"extension"}
      width={"350px"}
      height={"183px"}
      buttons={[button]}
    >
      <CardContentWrapper>
        <CardContentStyled>
          <ContentInfoStyled>사용 기한</ContentInfoStyled>
          <ContentDetailStyled>
            {!!extensionInfo
              ? formatDate(new Date(extensionInfo.expiredAt), ".")
              : "-"}
          </ContentDetailStyled>
        </CardContentStyled>
        <CardContentStyled>
          <ContentInfoStyled>연장 기간</ContentInfoStyled>
          <ContentDetailStyled>
            {!!extensionInfo ? extensionInfo.extensionPeriod + "일" : "-"}
          </ContentDetailStyled>
        </CardContentStyled>
      </CardContentWrapper>
    </Card>
>>>>>>> dc7a099f69df811ffb8fb9ec7bc7e6801ac3f723
  );
};

export default ExtensionCard;
