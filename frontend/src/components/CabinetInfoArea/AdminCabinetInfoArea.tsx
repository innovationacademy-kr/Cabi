import React from "react";
import { useRecoilValue } from "recoil";
import styled, { css } from "styled-components";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import {
  IAdminCurrentModalStateInfo,
  IMultiSelectTargetInfo,
  ISelectedCabinetInfo,
  TAdminModalState,
} from "@/components/CabinetInfoArea/CabinetInfoArea.container";
import ButtonContainer from "@/components/Common/Button";
import AdminReturnModal from "@/components/Modals/ReturnModal/AdminReturnModal";
import StatusModalContainer from "@/components/Modals/StatusModal/StatusModal.container";
import {
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import cabiLogo from "@/assets/images/logo.svg";
import { CabinetPreviewInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import useMultiSelect from "@/hooks/useMultiSelect";

const AdminCabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
  myCabinetId?: number;
  closeCabinet: () => void;
  multiSelectTargetInfo: IMultiSelectTargetInfo | null;
  openLent: React.MouseEventHandler;
  adminModal: IAdminCurrentModalStateInfo;
  openModal: (moadlName: TAdminModalState) => void;
  closeModal: (moadlName: TAdminModalState) => void;
  checkMultiReturn: (selectedCabinets: CabinetPreviewInfo[]) => boolean;
  checkMultiStatus: (selectedCabinets: CabinetPreviewInfo[]) => boolean;
  expireDate: string | null;
}> = ({
  selectedCabinetInfo,
  closeCabinet,
  multiSelectTargetInfo,
  openLent,
  adminModal,
  openModal,
  closeModal,
  checkMultiReturn,
  checkMultiStatus,
  expireDate,
}) => {
  const currentFloor = useRecoilValue(currentFloorNumberState);
  const currentSection = useRecoilValue(currentSectionNameState);
  const { targetCabinetInfoList, typeCounts } = multiSelectTargetInfo ?? {};
  const { resetMultiSelectMode } = useMultiSelect();

  const isLented: boolean = selectedCabinetInfo?.userNameList.at(0) !== "-";

  // 아무 사물함도 선택하지 않았을 때, 또는 다중선택 모드 진입후 아무 사물함도 선택하지 않았을 때
  if (
    (!multiSelectTargetInfo && selectedCabinetInfo === null) ||
    (multiSelectTargetInfo && targetCabinetInfoList!.length < 1)
  )
    return (
      <NotSelectedStyled>
        <CabiLogoStyled src={cabiLogo} />
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
          사물함/유저를 <br />
          선택해주세요
        </TextStyled>
      </NotSelectedStyled>
    );
  // 다중 선택 모드 진입 후 캐비넷을 하나 이상 선택했을 시
  if (multiSelectTargetInfo) {
    return (
      <CabinetDetailAreaStyled>
        <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
          {currentFloor + "F - " + currentSection}
        </TextStyled>
        <MultiCabinetIconWrapperStyled>
          <MultiCabinetIconStyled status={CabinetStatus.AVAILABLE}>
            {typeCounts![CabinetStatus.AVAILABLE]}
          </MultiCabinetIconStyled>
          <MultiCabinetIconStyled status={CabinetStatus.OVERDUE}>
            {typeCounts![CabinetStatus.OVERDUE]}
          </MultiCabinetIconStyled>
          <MultiCabinetIconStyled status={CabinetStatus.FULL}>
            {typeCounts![CabinetStatus.FULL]}
          </MultiCabinetIconStyled>
          <MultiCabinetIconStyled status={CabinetStatus.BROKEN}>
            {typeCounts![CabinetStatus.BROKEN]}
          </MultiCabinetIconStyled>
        </MultiCabinetIconWrapperStyled>
        <CabinetInfoButtonsContainerStyled>
          <ButtonContainer
            onClick={() => openModal("returnModal")}
            text="일괄 반납"
            theme="fill"
            disabled={!checkMultiReturn(targetCabinetInfoList!)}
          />
          <ButtonContainer
            onClick={() => openModal("statusModal")}
            text="상태관리"
            theme="line"
            disabled={!checkMultiStatus(targetCabinetInfoList!)}
          />
          <ButtonContainer
            onClick={() => {
              resetMultiSelectMode();
              closeCabinet();
            }}
            text="취소"
            theme="grayLine"
          />
        </CabinetInfoButtonsContainerStyled>
        {adminModal.returnModal && (
          <AdminReturnModal closeModal={() => closeModal("returnModal")} />
        )}
        {adminModal.statusModal && (
          <StatusModalContainer onClose={() => closeModal("statusModal")} />
        )}
      </CabinetDetailAreaStyled>
    );
  }
  // 단일 선택 시 보이는 cabinetInfoArea
  return (
    <CabinetDetailAreaStyled>
      <LinkTextStyled onClick={openLent}>대여기록</LinkTextStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo!.floor + "F - " + selectedCabinetInfo!.section}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo!.status}
        isMine={false}
      >
        {selectedCabinetInfo!.visibleNum}
      </CabinetRectangleStyled>
      <CabinetTypeIconStyled
        title={selectedCabinetInfo!.lentType}
        cabinetType={selectedCabinetInfo!.lentType}
      />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo!.userNameList}
      </TextStyled>
      <CabinetInfoButtonsContainerStyled>
        <ButtonContainer
          onClick={() => openModal("returnModal")}
          text="반납"
          theme="fill"
          disabled={
            selectedCabinetInfo!.lentType === CabinetType.CLUB || !isLented
          }
        />
        <ButtonContainer
          onClick={() => openModal("statusModal")}
          text="상태 관리"
          theme="line"
        />
        <ButtonContainer onClick={closeCabinet} text="취소" theme="line" />
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo!.detailMessageColor}
      >
        {selectedCabinetInfo!.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {expireDate}
      </CabinetLentDateInfoStyled>
      {adminModal.returnModal && (
        <AdminReturnModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={() => closeModal("returnModal")}
        />
      )}
      {adminModal.statusModal && (
        <StatusModalContainer onClose={() => closeModal("statusModal")} />
      )}
    </CabinetDetailAreaStyled>
  );
};

const NotSelectedStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CabinetDetailAreaStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CabiLogoStyled = styled.img`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
`;

const CabinetTypeIconStyled = styled.div<{ cabinetType: CabinetType }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;
  background-image: url(${(props) => cabinetIconSrcMap[props.cabinetType]});
  background-size: contain;
  background-repeat: no-repeat;
`;

const LinkTextStyled = styled.div`
  position: absolute;
  top: 3%;
  right: 6%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: var(--lightpurple-color);
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
`;

const CabinetRectangleStyled = styled.div<{
  cabinetStatus: CabinetStatus;
  isMine: boolean;
}>`
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 3vh;
  background-color: ${(props) => cabinetStatusColorMap[props.cabinetStatus]};
  ${(props) =>
    props.isMine &&
    css`
      background-color: var(--mine);
    `};
  font-size: 32px;
  color: ${(props) =>
    props.isMine
      ? cabinetLabelColorMap["MINE"]
      : cabinetLabelColorMap[props.cabinetStatus]};
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

const MultiCabinetIconWrapperStyled = styled.div`
  display: grid;
  grid-template-columns: 40px 40px;
  width: 90px;
  height: 90px;
  margin-top: 15px;
  grid-gap: 10px;
`;

const MultiCabinetIconStyled = styled.div<{ status: CabinetStatus }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ status }) => cabinetStatusColorMap[status]};
  border-radius: 5px;
  color: ${({ status }) => (status === CabinetStatus.FULL ? "black" : "white")};
`;

export default AdminCabinetInfoArea;
