import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
  currentCabinetIdState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import UnavailableModal from "@/components/Modals/UnavailableModal/UnavailableModal";
import {
  cabinetFilterMap,
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosCabinetById } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

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
  const isMine = MY_INFO ? MY_INFO.cabinetId === props.cabinetId : false;

  let cabinetLabelText = "";

  if (props.status !== "BANNED" && props.status !== "BROKEN") {
    //사용불가가 아닌 모든 경우
    if (props.lentType === "PRIVATE") cabinetLabelText = props.lents[0]?.name;
    else if (props.lentType === "SHARE") {
      const headcount = props.lents.length;
      const cabinetTitle = props.title ?? `${props.maxUser} / ${props.maxUser}`;

      cabinetLabelText =
        headcount === props.maxUser
          ? cabinetTitle
          : headcount + " / " + props.maxUser;
    } else if (props.lentType === "CLUB")
      cabinetLabelText = props.title ?? "동아리";
  } else {
    //사용불가인 경우
    cabinetLabelText = "사용불가";
  }

  const handleCloseUnavailableModal = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setShowUnavailableModal(false);
  };

  const selectCabinetOnClick = (status: CabinetStatus, cabinetId: number) => {
    if (currentCabinetId === cabinetId) {
      closeCabinet();
      return;
    }

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

  const cabinetItemTitleHandler = () => {
    let lentType;
    if (props.lentType === CabinetType.PRIVATE) lentType = "개인";
    else if (props.lentType === CabinetType.SHARE) lentType = "공유";
    else if (props.lentType === CabinetType.CLUB) lentType = "동아리";

    if (!cabinetLabelText) return `[${lentType}]`;
    return `[${lentType}] ${cabinetLabelText}`;
  };

  return (
    <CabinetListItemStyled
      status={props.status}
      isMine={isMine}
      isSelected={currentCabinetId === props.cabinetId}
      title={cabinetItemTitleHandler()}
      className="cabiButton"
      onClick={() => {
        selectCabinetOnClick(props.status, props.cabinetId);
      }}
    >
      <CabinetIconNumberWrapperStyled>
        <CabinetIconContainerStyled
          lentType={props.lentType}
          isMine={isMine}
          status={props.status}
        />
        <CabinetNumberStyled status={props.status} isMine={isMine}>
          {props.visibleNum}
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
  lentType: CabinetType;
  status: CabinetStatus;
  isMine: boolean;
}>`
  width: 16px;
  height: 16px;
  background-image: url(${(props) => cabinetIconSrcMap[props.lentType]});
  background-size: contain;
  filter: ${(props) => cabinetFilterMap[props.status]};
  ${(props) =>
    props.isMine &&
    css`
      filter: none;
    `};
`;

export default CabinetListItem;
