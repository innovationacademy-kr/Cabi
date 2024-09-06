import React, { useState } from "react";
import styled from "styled-components";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import SelectInduction from "@/Cabinet/components/Common/SelectInduction";
import BanModal from "@/Cabinet/components/Modals/BanModal/BanModal";
import {
  cabinetIconComponentMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/Cabinet/assets/data/maps";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";

export interface ISelectedUserCabinetInfo {
  name: string;
  userId: number | null;
  isBanned: boolean;
  bannedInfo?: string;
}

const UserCabinetInfoArea: React.FC<{
  selectedUserInfo?: ISelectedUserCabinetInfo;
  closeCabinet: () => void;
  openLent: React.MouseEventHandler;
}> = (props) => {
  const { selectedUserInfo, closeCabinet, openLent } = props;
  const [showBanModal, setShowBanModal] = useState<boolean>(false);
  const CabinetTypeIcon = cabinetIconComponentMap[CabinetType.PRIVATE];

  const handleOpenBanModal = () => {
    setShowBanModal(true);
  };

  const handleCloseBanModal = () => {
    setShowBanModal(false);
  };

  if (selectedUserInfo === undefined)
    return (
      <SelectInduction
        msg="유저를
              선택해주세요"
      />
    );

  return (
    <CabinetDetailAreaStyled>
      <LinkTextStyled onClick={openLent}>대여기록</LinkTextStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-line-btn-color)">
        대여 중이 아닌 사용자
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={
          selectedUserInfo.isBanned ? CabinetStatus.OVERDUE : CabinetStatus.FULL
        }
      >
        {selectedUserInfo.isBanned ? "!" : "-"}
      </CabinetRectangleStyled>
      <CabinetTypeIconStyled>
        <CabinetTypeIcon />
      </CabinetTypeIconStyled>
      <TextStyled fontSize="1rem" fontColor="var(--normal-text-color)">
        {selectedUserInfo.name}
      </TextStyled>

      <CabinetInfoButtonsContainerStyled>
        <ButtonContainer
          onClick={handleOpenBanModal}
          text="밴 해제"
          theme="fill"
          disabled={selectedUserInfo.isBanned === false}
        />
        <ButtonContainer onClick={closeCabinet} text="닫기" theme="grayLine" />
      </CabinetInfoButtonsContainerStyled>
      {selectedUserInfo.isBanned && (
        <CabinetLentDateInfoStyled textColor="var(--expired-color)">
          {selectedUserInfo.bannedInfo!}
        </CabinetLentDateInfoStyled>
      )}
      {showBanModal && (
        <BanModal
          userId={selectedUserInfo.userId}
          closeModal={handleCloseBanModal}
        />
      )}
    </CabinetDetailAreaStyled>
  );
};

const CabinetDetailAreaStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CabinetTypeIconStyled = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;

  & > svg {
    width: 24px;
    height: 24px;
  }

  & > svg > path {
    stroke: var(--normal-text-color);
  }
`;

const LinkTextStyled = styled.div`
  position: absolute;
  top: 3%;
  right: 6%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: var(--sys-sub-color);
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

const TextStyled = styled.p<{ fontSize: string; fontColor: string }>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
  & strong {
    color: var(--sys-main-color);
  }
`;

const CabinetRectangleStyled = styled.div<{
  cabinetStatus: CabinetStatus;
}>`
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 3vh;
  background-color: ${(props) => cabinetStatusColorMap[props.cabinetStatus]};
  font-size: 2rem;
  color: ${(props) => cabinetLabelColorMap[props.cabinetStatus]};
  text-align: center;
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 210px;
  margin: 3vh 0;
  width: 100%;
`;

const CabinetLentDateInfoStyled = styled.div<{ textColor: string }>`
  color: ${(props) => props.textColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;

export default UserCabinetInfoArea;
