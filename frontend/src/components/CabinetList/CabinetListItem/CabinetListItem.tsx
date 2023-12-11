import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled, { css, keyframes } from "styled-components";
import {
  currentBuildingNameState,
  currentCabinetIdState,
  currentFloorCabinetState,
  currentFloorNumberState,
  myCabinetInfoState,
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
import {
  CabinetInfo,
  CabinetPreviewInfo,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import {
  axiosCabinetByBuildingFloor,
  axiosCabinetById,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

const CabinetListItem = (props: CabinetPreviewInfo): JSX.Element => {
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number | null>(
    currentCabinetIdState
  );

  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );

  const [showUnavailableModal, setShowUnavailableModal] =
    useState<boolean>(false);
  const { openCabinet, closeCabinet } = useMenu();
  const isMine = myCabinetInfo
    ? myCabinetInfo.cabinetId === props.cabinetId &&
      props.status !== "AVAILABLE"
    : false;

  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  let cabinetLabelText = "";

  if (
    props.status !== "BANNED" &&
    props.status !== "BROKEN" &&
    props.status != "IN_SESSION" &&
    props.status != "PENDING"
  ) {
    if (props.lentType === "PRIVATE") cabinetLabelText = props.name;
    else if (props.lentType === "SHARE") {
      cabinetLabelText =
        !!props.title
          ? props.title
          : `${props.userCount} / ${props.maxUser}`;
    } else if (props.lentType === "CLUB")
      cabinetLabelText = props.title ? props.title : "동아리";
  } else {
    if (props.status === "IN_SESSION") cabinetLabelText = "대기중";
    else if (props.status === "PENDING") cabinetLabelText = "오픈예정";
    else cabinetLabelText = "사용불가";
  }

  const handleCloseUnavailableModal = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setShowUnavailableModal(false);
  };

  const currentBuilding = useRecoilValue<string>(currentBuildingNameState);
  const currentFloor = useRecoilValue<number>(currentFloorNumberState);
  const setCurrentFloorData = useSetRecoilState(currentFloorCabinetState);
  const myInfo = useRecoilValue(userState);

  const selectCabinetOnClick = (status: CabinetStatus, cabinetId: number) => {
    if (currentCabinetId === cabinetId) {
      closeCabinet();
      return;
    }
    setCurrentCabinetId(cabinetId);

    async function getData(cabinetId: number) {
      try {
        const { data: selectCabinetData } = await axiosCabinetById(cabinetId);
        setTargetCabinetInfo(selectCabinetData);

        if (myCabinetInfo.cabinetId === cabinetId) {
          const isLentedByMyUserId = selectCabinetData.lents.some(
            (user: { userId: number }) => user.userId === myInfo.userId
          );
          if (status !== selectCabinetData.status || !isLentedByMyUserId) {
            const { data: myCabinetData } = await axiosMyLentInfo();
            setMyLentInfo(myCabinetData);
          }
        } else if (status !== selectCabinetData.status) {
          const { data: floorData } = await axiosCabinetByBuildingFloor(
            currentBuilding,
            currentFloor
          );
          setCurrentFloorData(floorData);
        }
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
        <span className="cabinetLabelTextWrap">
          {props.status === "IN_SESSION" && (
            <span className="clockIconStyled" />
          )}
          {cabinetLabelText}
        </span>
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
  background-color: ${({ status, isMine }) =>
    isMine ? "var(--mine)" : cabinetStatusColorMap[status]};

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

  ${({ status }) =>
    status === "PENDING" &&
    css`
      border: 5px double var(--white);
    `}

  ${({ status }) =>
    status === "IN_SESSION" &&
    css`
      border: 2px solid var(--main-color);
    `}
    
  .cabinetLabelTextWrap {
    display: flex;
    align-items: center;
  }

  .clockIconStyled {
    width: 16px;
    height: 17px;
    background-color: var(--main-color);
    mask-image: url("data:image/svg+xml,%3Csvg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.6668 8.49967C14.6668 12.1797 11.6802 15.1663 8.00016 15.1663C4.32016 15.1663 1.3335 12.1797 1.3335 8.49967C1.3335 4.81967 4.32016 1.83301 8.00016 1.83301C11.6802 1.83301 14.6668 4.81967 14.6668 8.49967Z' stroke='%239747FF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M10.4734 10.6202L8.40675 9.38684C8.04675 9.1735 7.75342 8.66017 7.75342 8.24017V5.50684' stroke='%239747FF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    margin-right: 4px;
    display: ${(props) => (props.status === "IN_SESSION" ? "block" : "none")};
    ${({ status, isMine }) =>
      status === "IN_SESSION" &&
      css`
        animation: ${Rotation} 1s linear infinite;
        background-color: ${isMine ? "var(--black)" : "var(--main-color)"};
      `}
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }
`;

const Rotation = keyframes`
 to {
		transform : rotate(360deg)
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
  ${({ status }) =>
    status === "IN_SESSION" &&
    css`
      color: black;
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
