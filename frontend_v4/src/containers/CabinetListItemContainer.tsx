import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  myCabinetInfoState,
  currentCabinetIdState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import { CabinetInfo, MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import styled, { css } from "styled-components";
import { axiosCabinetById } from "@/api/axios/axios.custom";

import { useState } from "react";
import Modal from "@/components/Modal";
import ModalPortal from "@/components/ModalPortal";

import useDetailInfo from "@/hooks/useDetailInfo";

const CabinetListItemContainer = (props: CabinetInfo): JSX.Element => {
  const MY_INFO = useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setCurrentCabinetId = useSetRecoilState<number>(currentCabinetIdState);
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const isMine = MY_INFO ? MY_INFO.cabinet_id === props.cabinet_id : false;

  let cabinetLabelText = "";
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
  if (props.status !== "BANNED" && props.status !== "BROKEN") {
    //사용불가가 아닌 모든 경우
    if (props.lent_type === "PRIVATE")
      cabinetLabelText = props.lent_info[0]?.intra_id;
    else if (props.lent_type === "SHARE")
      cabinetLabelText = props.lent_info.length + " / " + props.max_user;
    else if (props.lent_type === "CIRCLE")
      cabinetLabelText = props.cabinet_title ? props.cabinet_title : "";
  } else {
    //사용불가인 경우
    cabinetLabelText = "사용불가";
  }

  const { openCabinet, closeMap } = useDetailInfo();

  const selectCabinetOnClick = (cabinetId: number) => {
    setCurrentCabinetId(cabinetId);
    async function getData(cabinetId: number) {
      try {
        const { data } = await axiosCabinetById(cabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
    getData(cabinetId);
  };
  const handleOpenModal = () => {
    if (
      props.status === "BANNED" ||
      props.status === "BROKEN" ||
      props.status === "SET_EXPIRE_FULL" ||
      props.status === "EXPIRED"
    )
      setShowModal(true);
  };
  const handleCloseModal = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setShowModal(false);
  };
  return (
    <CabinetListItemStyled
      status={props.status}
      isMine={isMine}
      onClick={() => {
        selectCabinetOnClick(props.cabinet_id);
        if (!isMine) handleOpenModal();
        openCabinet();
        closeMap();
      }}
    >
      <CabinetIconNumberWrapperStyled>
        <CabinetIconContainerStyled
          lent_type={props.lent_type}
          isMine={isMine}
          status={props.status}
        />
        <CabinetNumberStyled status={props.status} isMine={isMine}>
          {props.cabinet_num}
        </CabinetNumberStyled>
      </CabinetIconNumberWrapperStyled>
      <CabinetLabelStyled
        className="textNowrap"
        status={props.status}
        isMine={isMine}
      >
        {cabinetLabelText}
      </CabinetLabelStyled>
      {showModal && (
        <ModalPortal>
          <Modal
            modalObj={modalPropsMap[props.status]}
            onClose={handleCloseModal}
          />
        </ModalPortal>
      )}
    </CabinetListItemStyled>
  );
};

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

const cabinetFilterMap = {
  [CabinetStatus.AVAILABLE]: "brightness(100)",
  [CabinetStatus.SET_EXPIRE_FULL]: "none",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "brightness(100)",
  [CabinetStatus.EXPIRED]: "brightness(100)",
  [CabinetStatus.BROKEN]: "brightness(100)",
  [CabinetStatus.BANNED]: "brightness(100)",
};

const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--white)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--black)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--white)",
  [CabinetStatus.EXPIRED]: "var(--white)",
  [CabinetStatus.BROKEN]: "var(--white)",
  [CabinetStatus.BANNED]: "var(--white)",
};

const CabinetListItemStyled = styled.div<{
  status: CabinetStatus;
  isMine: boolean;
}>`
  position: relative;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
  ${(props) =>
    props.isMine &&
    css`
      background-color: var(--mine);
    `}
  width: 80px;
  height: 80px;
  margin: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 8px 14px;
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

const CabinetIconNumberWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CabinetLabelStyled = styled.p<{
  status: CabinetStatus;
  isMine: boolean;
}>`
  font-size: 0.875rem;
  line-height: 1.125rem;
  letter-spacing: -0.02rem;
  color: ${(props) => cabinetLabelColorMap[props.status]};
  ${(props) =>
    props.isMine &&
    css`
      color: var(--black);
    `}
`;

const CabinetNumberStyled = styled.p<{
  status: CabinetStatus;
  isMine: boolean;
}>`
  font-size: 0.875rem;
  color: ${(props) => cabinetLabelColorMap[props.status]};
  ${(props) =>
    props.isMine &&
    css`
      color: var(--black);
    `}
`;

const CabinetIconContainerStyled = styled.div<{
  lent_type: CabinetType;
  status: CabinetStatus;
  isMine: boolean;
}>`
  width: 16px;
  height: 16px;
  background-image: url(${(props) => cabinetIconSrcMap[props.lent_type]});
  background-size: contain;
  filter: ${(props) => cabinetFilterMap[props.status]};
  ${(props) =>
    props.isMine &&
    css`
      filter: none;
    `};
`;

export default CabinetListItemContainer;
