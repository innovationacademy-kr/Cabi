import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import useMenu from "@/hooks/useMenu";
import UnavailableModal from "@/components/Modals/UnavailableModal/UnavailableModal";
import { axiosCabinetById } from "@/api/axios/axios.custom";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled, { css } from "styled-components";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";

import { UserDto } from "@/types/dto/user.dto";
import {
  cabinetStatusColorMap,
  cabinetLabelColorMap,
  cabinetIconSrcMap,
  cabinetFilterMap,
} from "@/assets/data/maps";

const CabinetListItem = (props: CabinetInfo): JSX.Element => {
  const MY_INFO = useRecoilValue<UserDto>(userState);
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number>(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const [showUnavailableModal, setShowUnavailableModal] =
    useState<boolean>(false);
  const { openCabinet, closeCabinet } = useMenu();
  const isMine = MY_INFO ? MY_INFO.cabinet_id === props.cabinet_id : false;

  let cabinetLabelText = "";

  if (props.status !== "BANNED" && props.status !== "BROKEN") {
    //사용불가가 아닌 모든 경우
    if (props.lent_type === "PRIVATE")
      cabinetLabelText = props.lent_info[0]?.intra_id;
    else if (props.lent_type === "SHARE") {
      const headcount = props.lent_info.length;
      const cabinetTitle =
        props.cabinet_title ?? `${props.max_user} / ${props.max_user}`;

      cabinetLabelText =
        headcount === props.max_user
          ? cabinetTitle
          : headcount + " / " + props.max_user;
    } else if (props.lent_type === "CLUB")
      cabinetLabelText = props.cabinet_title ?? "동아리";
  } else {
    //사용불가인 경우
    cabinetLabelText = "사용불가";
  }

  const handleOpenUnavailableModal = () => {
    if (
      props.status === "BANNED" ||
      props.status === "BROKEN" ||
      props.status === "SET_EXPIRE_FULL" ||
      props.status === "EXPIRED"
    )
      setShowUnavailableModal(true);
  };

  const handleCloseUnavailableModal = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setShowUnavailableModal(false);
  };

  const selectCabinetOnClick = (status: CabinetStatus, cabinetId: number) => {
    if (currentCabinetId === cabinetId) {
      closeCabinet();
      return;
    }
    if (
      !isMine &&
      status !== CabinetStatus.AVAILABLE &&
      status !== CabinetStatus.SET_EXPIRE_AVAILABLE
    )
      return handleOpenUnavailableModal();

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
      {showUnavailableModal && (
        <UnavailableModal
          status={props.status}
          closeModal={handleCloseUnavailableModal}
        />
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
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
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
  line-height: 1.25rem;
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

export default CabinetListItem;
