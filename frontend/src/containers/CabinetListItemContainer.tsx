import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import styled, { css } from "styled-components";
import { axiosCabinetById } from "@/api/axios/axios.custom";

import { useState } from "react";
import Modal from "@/components/Modal";
import ModalPortal from "@/components/ModalPortal";

import useDetailInfo from "@/hooks/useDetailInfo";
import { UserDto } from "@/types/dto/user.dto";
import {
  cabinetFilterMap,
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
  modalPropsMap,
} from "@/maps";

const CabinetListItemContainer = (props: CabinetInfo): JSX.Element => {
  const MY_INFO = useRecoilValue<UserDto>(userState);
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number>(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const isMine = MY_INFO ? MY_INFO.cabinet_id === props.cabinet_id : false;

  let cabinetLabelText = "";

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

  const selectCabinetOnClick = (status: CabinetStatus, cabinetId: number) => {
    if (
      !isMine &&
      status !== CabinetStatus.AVAILABLE &&
      status !== CabinetStatus.SET_EXPIRE_AVAILABLE
    )
      return handleOpenModal();

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
    openCabinet();
    closeMap();
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
      isSelected={currentCabinetId === props.cabinet_id}
      onClick={() => {
        selectCabinetOnClick(props.status, props.cabinet_id);
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

const CabinetListItemStyled = styled.div<{
  status: CabinetStatus;
  isMine: boolean;
  isSelected: boolean;
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
  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.9;
      transform: scale(1.05);
      box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.25),
        0px 4px 4px rgba(0, 0, 0, 0.25);
    `}
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
