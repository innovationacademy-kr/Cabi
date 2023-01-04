import React, { useState } from "react";
import styled, { css } from "styled-components";
import ButtonContainer from "./ButtonContainer";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import cabiLogo from "@/assets/images/logo.svg";
import Modal from "@/components/Modal";
import ModalPortal from "@/components/ModalPortal";
import { DetailStyled } from "./ModalContainer";
import MemoModal from "@/components/MemoModal";
import { axiosLentId, axiosMyLentInfo } from "@/api/axios/axios.custom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  myCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";

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
  closeCabinet: () => void;
}> = (props) => {
  const { selectedCabinetInfo, closeCabinet } = props;
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  let expireDate = new Date();
  const addDays = selectedCabinetInfo?.lentType === "SHARE" ? 41 : 20;
  expireDate.setDate(expireDate.getDate() + addDays);
  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, "0");
  };
  const formatDate = (date: Date) => {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("/");
  };
  const formattedExpireDate = formatDate(expireDate);
  const returnCabinetModalProps = {
    type: "confirm",
    title: "사물함 반납하기",
    detail: (
      <DetailStyled>
        대여기간은 <strong>{formattedExpireDate} 23:59</strong>까지 입니다.
        <br /> 지금 반납 하시겠습니까?
      </DetailStyled>
    ),
    confirmMessage: "네, 반납할게요",
    onClickProceed: () => {
      // 사물함 반납 api호출
      alert("반납이 완료되었습니다");
    },
  };
  const modalPropsMap = {
    [CabinetStatus.AVAILABLE]: {
      type: "confirm",
      title: "이용 시 주의 사항",
      detail: (
        <DetailStyled>
          대여기간은 <strong>{formattedExpireDate} 23:59</strong>까지 입니다.
          <br />
          대여 후 72시간 이내 취소(반납) 시,
          <br /> 72시간의 대여 불가 패널티가 적용됩니다.
          <br />
          “메모 내용”은 공유 인원끼리 공유됩니다.
          <br />
          귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.
          <br />
        </DetailStyled>
      ),
      confirmMessage: "네, 대여할게요",
      onClickProceed: async () => {
        //사물함 대여 api호출
        try {
          await axiosLentId(currentCabinetId);
          //userCabinetId 세팅
          setMyInfo({ ...myInfo, cabinet_id: currentCabinetId });
          //userLentInfo 세팅
          try {
            const { data: myLentInfo } = await axiosMyLentInfo();

            setMyLentInfo(myLentInfo);
          } catch (error) {
            console.error(error);
          }
        } catch (error: any) {
          if (error.response.status !== 401) {
            alert(error.response.data.message);
          }
          console.log(error);
        }
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
      detail: (
        <p>
          대여기간은 <strong>{formattedExpireDate} 23:59</strong>까지 입니다.
          <br />
          대여 후 72시간 이내 취소(반납) 시,
          <br /> 72시간의 대여 불가 패널티가 적용됩니다.
          <br />
          “메모 내용”은 공유 인원끼리 공유됩니다.
          <br />
          귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.
          <br />
        </p>
      ),
      confirmMessage: "네, 대여할게요",
      onClickProceed: async () => {
        //사물함 대여 api호출
        try {
          await axiosLentId(currentCabinetId);
          //userCabinetId 세팅
          setMyInfo({ ...myInfo, cabinet_id: currentCabinetId });
          //userLentInfo 세팅
          try {
            const { data: myLentInfo } = await axiosMyLentInfo();

            setMyLentInfo(myLentInfo);
          } catch (error) {
            console.error(error);
          }
        } catch (error: any) {
          if (error.response.status !== 401) {
            alert(error.response.data.message);
          }
          console.log(error);
        }
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
  const handleOpenReturnModal = () => {
    setShowReturnModal(true);
  };
  const handleCloseReturnModal = (e: { stopPropagation: () => void }) => {
    setShowReturnModal(false);
  };
  const handleOpenMemoModal = () => {
    setShowMemoModal(true);
  };
  const handleCloseMemoModal = (e: { stopPropagation: () => void }) => {
    setShowMemoModal(false);
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
      <CabinetTypeIconStyled
        title={selectedCabinetInfo.lentType}
        cabinetType={selectedCabinetInfo.lentType}
      />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo.userNameList}
      </TextStyled>
      <CabinetInfoButtonsContainerStyled>
        {selectedCabinetInfo.isMine ? (
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
            <ButtonContainer
              onClick={handleOpenReturnModal}
              text="대여"
              theme="fill"
            />
            <ButtonContainer onClick={closeCabinet} text="취소" theme="line" />
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo.detailMessageColor}
      >
        {selectedCabinetInfo.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {selectedCabinetInfo.expireDate
          ? `${selectedCabinetInfo.expireDate.toString().substring(0, 10)}`
          : null}
      </CabinetLentDateInfoStyled>
      {showReturnModal && (
        <ModalPortal>
          <Modal
            modalObj={
              selectedCabinetInfo.isMine
                ? returnCabinetModalProps
                : modalPropsMap[selectedCabinetInfo.status]
            }
            onClose={handleCloseReturnModal}
          />
        </ModalPortal>
      )}
      {showMemoModal && (
        <ModalPortal>
          <MemoModal onClose={handleCloseMemoModal} />
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
  width: 24px;
  height: 24px;
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
  margin: 40px 0;
`;

const CabinetLentDateInfoStyled = styled.div<{ textColor: string }>`
  color: ${(props) => props.textColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;
