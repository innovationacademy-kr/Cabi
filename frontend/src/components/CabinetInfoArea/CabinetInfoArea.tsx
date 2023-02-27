import React, { useState } from "react";
import styled, { css } from "styled-components";
import ButtonContainer from "@/components/Common/Button";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import cabiLogo from "@/assets/images/logo.svg";
import MemoModalContainer from "@/components/Modals/MemoModal/MemoModal.container";
import LentModal from "@/components/Modals/LentModal/LentModal";
import ReturnModal from "@/components/Modals/ReturnModal/ReturnModal";
import UnavailableModal from "@/components/Modals/UnavailableModal/UnavailableModal";
import {
  additionalModalType,
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import useMultiSelect from "@/hooks/useMultiSelect";
import AdminReturnModal from "../Modals/ReturnModal/AdminReturnModal";
import StatusModalContainer from "@/components/Modals/StatusModal/StatusModal.container";
export interface ISelectedCabinetInfo {
  floor: number;
  section: string;
  cabinetId: number;
  cabinetNum: number;
  status: CabinetStatus;
  lentType: CabinetType;
  userNameList: string;
  expireDate?: Date;
  detailMessage: string | null;
  detailMessageColor: string;
  isAdmin: boolean;
}
export interface IMultiSelectTargetInfo {
  targetCabinetInfoList: CabinetInfo[];
  handleClickReturnAll: any;
  handleClickChangeStatusAll: any;
  typeCounts: {
    AVAILABLE: number;
    EXPIRED: number;
    SET_EXPIRE_FULL: number;
    BROKEN: number;
  };
}

const CabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
  myCabinetId?: number;
  closeCabinet: () => void;
  multiSelectTargetInfo: IMultiSelectTargetInfo | null;
}> = ({
  selectedCabinetInfo,
  myCabinetId,
  closeCabinet,
  multiSelectTargetInfo,
}) => {
  const {
    targetCabinetInfoList,
    handleClickReturnAll,
    handleClickChangeStatusAll,
    typeCounts,
  } = multiSelectTargetInfo ?? {};

  const [showUnavailableModal, setShowUnavailableModal] =
    useState<boolean>(false);
  const [showLentModal, setShowLentModal] = useState<boolean>(false);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const [showAdminReturnModal, setShowAdminReturnModal] =
    useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const isMine: boolean = myCabinetId
    ? selectedCabinetInfo?.cabinetId === myCabinetId
    : false;
  const { resetMultiSelectMode } = useMultiSelect();

  const handleOpenLentModal = () => {
    if (myCabinetId) return handleOpenUnavailableModal();
    setShowLentModal(true);
  };
  const handleCloseLentModal = () => {
    setShowLentModal(false);
  };
  const handleOpenReturnModal = () => {
    setShowReturnModal(true);
  };
  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
  };
  const handleOpenMemoModal = () => {
    setShowMemoModal(true);
  };
  const handleCloseMemoModal = () => {
    setShowMemoModal(false);
  };
  const handleOpenUnavailableModal = () => {
    setShowUnavailableModal(true);
  };
  const handleCloseUnavailableModal = () => {
    setShowUnavailableModal(false);
  };
  const handleOpenAdminReturnModal = () => {
    setShowAdminReturnModal(true);
  };
  const handleCloseAdminReturnModal = () => {
    setShowAdminReturnModal(false);
  };
  const handleOpenStatusModal = () => {
    setShowStatusModal(true);
  };
  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
  };

  if (
    (!multiSelectTargetInfo && selectedCabinetInfo === null) ||
    (multiSelectTargetInfo && targetCabinetInfoList!.length < 1)
  )
    // 아무 사물함도 선택하지 않았을 때, 또는 다중선택 모드 진입후 아무 사물함도 선택하지 않았을 때
    return (
      <NotSelectedStyled>
        <CabiLogoStyled src={cabiLogo} />
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
          사물함을 <br />
          선택해주세요
        </TextStyled>
      </NotSelectedStyled>
    );
  if (multiSelectTargetInfo) {
    // 다중 선택 모드 진입 후 캐비넷을 하나 이상 선택했을 시
    const currentFloor = targetCabinetInfoList![0].floor;
    const currentSection = targetCabinetInfoList![0].section;
    return (
      <CabinetDetailAreaStyled>
        <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
          {currentFloor + "F - " + currentSection}
        </TextStyled>
        <MultiCabinetIconWrapperStyled>
          <MultiCabinetIconStyled status={CabinetStatus.AVAILABLE}>
            {typeCounts![CabinetStatus.AVAILABLE]}
          </MultiCabinetIconStyled>
          <MultiCabinetIconStyled status={CabinetStatus.EXPIRED}>
            {typeCounts![CabinetStatus.EXPIRED]}
          </MultiCabinetIconStyled>
          <MultiCabinetIconStyled status={CabinetStatus.SET_EXPIRE_FULL}>
            {typeCounts![CabinetStatus.SET_EXPIRE_FULL]}
          </MultiCabinetIconStyled>
          <MultiCabinetIconStyled status={CabinetStatus.BROKEN}>
            {typeCounts![CabinetStatus.BROKEN]}
          </MultiCabinetIconStyled>
        </MultiCabinetIconWrapperStyled>
        <CabinetInfoButtonsContainerStyled>
          <ButtonContainer
            onClick={() => {}} //todo: admin 일괄 반납 모달 만들기
            text="일괄 반납"
            theme="fill"
          />
          <ButtonContainer
            onClick={handleOpenStatusModal} //todo: admin 일괄 상태관리 모달 만들기
            text="상태관리"
            theme="line"
          />
          <ButtonContainer
            onClick={() => {
              resetMultiSelectMode();
            }} //todo: 상태관리 모달 만들기
            text="취소"
            theme="grayLine"
          />
        </CabinetInfoButtonsContainerStyled>
      </CabinetDetailAreaStyled>
    );
  }
  // 단일 선택 시 보이는 cabinetInfoArea
  return (
    <CabinetDetailAreaStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo!.floor + "F - " + selectedCabinetInfo!.section}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo!.status}
        isMine={isMine}
      >
        {selectedCabinetInfo!.cabinetNum}
      </CabinetRectangleStyled>
      <CabinetTypeIconStyled
        title={selectedCabinetInfo!.lentType}
        cabinetType={selectedCabinetInfo!.lentType}
      />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo!.userNameList}
      </TextStyled>
      <CabinetInfoButtonsContainerStyled>
        {isMine ? (
          <>
            <ButtonContainer
              onClick={handleOpenReturnModal}
              text="반납"
              theme="fill"
            />
            <ButtonContainer
              onClick={handleOpenMemoModal}
              text="메모관리"
              theme="line"
            />
            <ButtonContainer
              onClick={closeCabinet}
              text="닫기"
              theme="grayLine"
            />
          </>
        ) : (
          <>
            {selectedCabinetInfo!.isAdmin ? (
              <>
                <ButtonContainer
                  onClick={handleOpenAdminReturnModal} //todo: admin 단일 반납 모달 만들기
                  text="반납"
                  theme="fill"
                />
                <ButtonContainer
                  onClick={handleOpenStatusModal} //todo: admin 단일 상태관리 모달 만들기
                  text="상태 관리"
                  theme="line"
                />
              </>
            ) : (
              <ButtonContainer
                onClick={handleOpenLentModal}
                text="대여"
                theme="fill"
              />
            )}
            <ButtonContainer onClick={closeCabinet} text="취소" theme="line" />
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo!.detailMessageColor}
      >
        {selectedCabinetInfo!.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {selectedCabinetInfo!.expireDate
          ? `${selectedCabinetInfo!.expireDate.toString().substring(0, 10)}`
          : null}
      </CabinetLentDateInfoStyled>
      {showUnavailableModal && (
        <UnavailableModal
          status={additionalModalType.MODAL_UNAVAILABLE_ALREADY_LENT}
          closeModal={handleCloseUnavailableModal}
        />
      )}
      {showLentModal && (
        <LentModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={handleCloseLentModal}
        />
      )}
      {showReturnModal && (
        <ReturnModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={handleCloseReturnModal}
        />
      )}
      {showMemoModal && <MemoModalContainer onClose={handleCloseMemoModal} />}
      {showAdminReturnModal && (
        <AdminReturnModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={handleCloseAdminReturnModal}
        />
      )}
      {showStatusModal && (
        <StatusModalContainer onClose={handleCloseStatusModal} />
      )}
    </CabinetDetailAreaStyled>
  );
};

export default CabinetInfoArea;

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
  color: ${({ status }) =>
    status === CabinetStatus.SET_EXPIRE_FULL ? "black" : "white"};
`;
