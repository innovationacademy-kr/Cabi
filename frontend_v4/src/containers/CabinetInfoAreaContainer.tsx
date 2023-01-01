import React, { useState } from "react";
import styled, { css } from "styled-components";
import ButtonContainer from "./ButtonContainer";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import cabiLogo from "@/assets/images/logo.svg";
import Modal from "@/components/Modal";
import ModalPortal from "@/components/ModalPortal";

export interface ISelectedCabinetInfo {
  floor: number;
  section: string;
  isMine: boolean;
  cabinetNum: number;
  status: CabinetStatus;
  lentType: CabinetType;
  userNameList: string;
  expireDate?: Date;
  detailMessage: string | null;
  detailMessageColor: string;
}

const CabinetInfoAreaContainer: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
}> = (props) => {
  const { selectedCabinetInfo } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const returnCabinetModalProps = {
    type: "confirm",
    title: "반납 시 주의 사항",
    detail: `대여기간은 ${
      Date.now() + 21
    } 23:59까지 입니다. 대여 후 72시간 이내 취소(반납) 시, 72시간의 대여 불가 패널티가 적용됩니다.“메모 내용”은 공유 인원끼리 공유됩니다.귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.`,
    confirmMessage: "네, 반납할게요",
    onClickProceed: () => {
      alert("반납이 완료되었습니다");
    },
  };
  const modalPropsMap = {
    [CabinetStatus.AVAILABLE]: {
      type: "confirm",
      title: "이용 시 주의 사항",
      detail: `대여기간은 ${
        Date.now() + 21
      } 23:59까지 입니다. 대여 후 72시간 이내 취소(반납) 시, 72시간의 대여 불가 패널티가 적용됩니다.“메모 내용”은 공유 인원끼리 공유됩니다.귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.`,
      confirmMessage: "네, 대여할게요",
      onClickProceed: () => {
        alert("대여가 완료되었습니다");
      },
    },
    [CabinetStatus.SET_EXPIRE_FULL]: {
      type: "error",
      title: "이미 사용 중인 사물함입니다",
      detail: null,
      confirmMessage: "",
      onClickProceed: () => {},
    },
    [CabinetStatus.SET_EXPIRE_AVAILABLE]: {
      type: "confirm",
      title: "이용 시 주의 사항",
      detail: `대여기간은 ${
        Date.now() + 42
      } 23:59까지 입니다. 대여 후 72시간 이내 취소(반납) 시, 72시간의 대여 불가 패널티가 적용됩니다.“메모 내용”은 공유 인원끼리 공유됩니다.귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.`,
      confirmMessage: "네, 대여할게요",
      onClickProceed: () => {
        alert("대여가 완료되었습니다");
      },
    },
    [CabinetStatus.EXPIRED]: {
      type: "error",
      title: `반납이 지연되고 있어\n현재 대여가 불가합니다`,
      detail: null,
      confirmMessage: "",
      onClickProceed: () => {},
    },
    [CabinetStatus.BROKEN]: {
      type: "error",
      title: "사용이 불가한 사물함입니다",
      detail: null,
      confirmMessage: "",
      onClickProceed: () => {},
    },
    [CabinetStatus.BANNED]: {
      type: "error",
      title: "사용이 불가한 사물함입니다",
      detail: null,
      confirmMessage: "",
      onClickProceed: () => {},
    },
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (selectedCabinetInfo === null)
    return (
      <NotSelectedStyled>
        <CabiLogoStyled src={cabiLogo} />
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
          사물함을 <br />
          선택해주세요
        </TextStyled>
      </NotSelectedStyled>
    );

  return (
    <CabinetDetailAreaStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo.floor + "F - " + selectedCabinetInfo.section}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo.status}
        isMine={selectedCabinetInfo.isMine}
      >
        {selectedCabinetInfo.cabinetNum}
      </CabinetRectangleStyled>
      <CabinetTypeIconStyled cabinetType={selectedCabinetInfo.lentType} />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo.userNameList}
      </TextStyled>
      <CabinetInfoButtonsContainerStyled>
        {selectedCabinetInfo.isMine ? (
          <>
            <ButtonContainer
              onClick={handleOpenModal}
              text="반납"
              theme="dark"
            />
            <ButtonContainer onClick={() => {}} text="메모관리" theme="white" />
            <ButtonContainer onClick={() => {}} text="취소" theme="white" />
          </>
        ) : (
          <>
            <ButtonContainer
              onClick={handleOpenModal}
              text="대여"
              theme="dark"
            />
            <ButtonContainer onClick={() => {}} text="취소" theme="white" />
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {selectedCabinetInfo.expireDate
          ? `~ ${selectedCabinetInfo.expireDate.toString().substring(0, 10)}`
          : null}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo.detailMessageColor}
      >
        {selectedCabinetInfo.detailMessage}
      </CabinetLentDateInfoStyled>
      {showModal && (
        <ModalPortal>
          <Modal
            modalObj={
              selectedCabinetInfo.isMine
                ? returnCabinetModalProps
                : modalPropsMap[selectedCabinetInfo.status]
            }
            onClose={handleCloseModal}
          />
        </ModalPortal>
      )}
    </CabinetDetailAreaStyled>
  );
};

export default CabinetInfoAreaContainer;

const cabinetStatusColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--available)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--full)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--available)",
  [CabinetStatus.EXPIRED]: "var(--expired)",
  [CabinetStatus.BROKEN]: "var(--broken)",
  [CabinetStatus.BANNED]: "var(--banned)",
};

const cabinetIconSrcMap = {
  [CabinetType.PRIVATE]: "src/assets/images/privateIcon.svg",
  [CabinetType.SHARE]: "src/assets/images/shareIcon.svg",
  [CabinetType.CIRCLE]: "src/assets/images/circleIcon.svg",
};

const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--white)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--black)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--white)",
  [CabinetStatus.EXPIRED]: "var(--white)",
  [CabinetStatus.BROKEN]: "var(--white)",
  [CabinetStatus.BANNED]: "var(--white)",
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
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
  background-image: url(${(props) => cabinetIconSrcMap[props.cabinetType]});
  background-size: contain;
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
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 60px;
  background-color: ${(props) => cabinetStatusColorMap[props.cabinetStatus]};
  ${(props) =>
    props.isMine &&
    css`
      background-color: var(--mine);
    `};
  font-size: 32px;
  line-height: 80px;
  color: ${(props) => cabinetLabelColorMap[props.cabinetStatus]};
  text-align: center;
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 40px;
`;

const CabinetLentDateInfoStyled = styled.div<{ textColor: string }>`
  margin-top: 35px;
  color: ${(props) => props.textColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;
