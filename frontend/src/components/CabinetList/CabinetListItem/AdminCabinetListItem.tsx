import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { css, keyframes } from "styled-components";
import {
  currentCabinetIdState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import {
  cabinetFilterMap,
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import { CabinetInfo, CabinetPreviewInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosCabinetById } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";

const AdminCabinetListItem = (props: CabinetPreviewInfo): JSX.Element => {
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number | null>(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const setSelectedTypeOnSearch = useSetRecoilState<string>(
    selectedTypeOnSearchState
  );
  const { openCabinet, closeCabinet } = useMenu();
  const { isMultiSelect, clickCabinetOnMultiSelectMode, containsCabinet } =
    useMultiSelect();

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
        props.userCount === props.maxUser && !!props.title
          ? props.title
          : `${props.userCount} / ${props.maxUser}`;
    } else if (props.lentType === "CLUB")
      cabinetLabelText = props.title ? props.title : "동아리";
  } else {
    if (props.status == "IN_SESSION") cabinetLabelText = "대기중";
    else if (props.status == "PENDING") cabinetLabelText = "오픈예정";
    else cabinetLabelText = "사용불가";
  }
  const selectCabinetOnClick = (cabinetId: number) => {
    if (currentCabinetId === cabinetId) {
      closeCabinet();
      return;
    }

    setCurrentCabinetId(cabinetId);
    setSelectedTypeOnSearch("CABINET");
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
      isMine={false}
      isSelected={currentCabinetId === props.cabinetId}
      isMultiSelect={isMultiSelect}
      isMultiSelected={containsCabinet(props.cabinetId)}
      title={cabinetItemTitleHandler()}
      className="cabiButton"
      onClick={() => {
        if (isMultiSelect) clickCabinetOnMultiSelectMode(props);
        else selectCabinetOnClick(props.cabinetId);
      }}
    >
      <CabinetIconNumberWrapperStyled>
        <CabinetIconContainerStyled
          lentType={props.lentType}
          isMine={false}
          status={props.status}
        />
        <CabinetNumberStyled status={props.status} isMine={false}>
          {props.visibleNum}
        </CabinetNumberStyled>
      </CabinetIconNumberWrapperStyled>
      <CabinetLabelStyled
        className="textNowrap"
        status={props.status}
        isMine={false}
      >
        <span className="cabinetLabelTextWrap">
          {props.status === "IN_SESSION" && (
            <span className="clockIconStyled" />
          )}
          {cabinetLabelText}
        </span>
      </CabinetLabelStyled>
    </CabinetListItemStyled>
  );
};

const CabinetListItemStyled = styled.div<{
  status: CabinetStatus;
  isMine: boolean;
  isSelected: boolean;
  isMultiSelect: boolean;
  isMultiSelected: boolean;
}>`
  position: relative;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
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
  ${({ isMultiSelect }) =>
    isMultiSelect &&
    css`
      opacity: 0.3;
    `}
  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.9;
      transform: scale(1.05);
      box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.25),
        0px 4px 4px rgba(0, 0, 0, 0.25);
    `}
  ${({ isMultiSelected }) =>
    isMultiSelected &&
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
    ${({ status }) =>
      status === "IN_SESSION" &&
      css`
        animation: ${Rotation} 1s linear infinite;
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
`;

const CabinetNumberStyled = styled.p<{
  status: CabinetStatus;
  isMine: boolean;
}>`
  font-size: 0.875rem;
  color: ${(props) => cabinetLabelColorMap[props.status]};
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
`;

export default AdminCabinetListItem;
