import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
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
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosCabinetById } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";

interface IAdminCabinetListItem {
  cabinet: CabinetInfo;
}

const AdminCabinetListItem = ({
  cabinet,
}: IAdminCabinetListItem): JSX.Element => {
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number>(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const setSelectedTypeOnSearch = useSetRecoilState<string>(
    selectedTypeOnSearchState
  );
  const { openCabinet, closeCabinet } = useMenu();
  //  const isMine = MY_INFO ? MY_INFO.cabinetId === props.cabinetId : false;
  const { isMultiSelect, clickCabinetOnMultiSelectMode, containsCabinet } =
    useMultiSelect();
  let cabinetLabelText = "";

  if (cabinet.status !== "BANNED" && cabinet.status !== "BROKEN") {
    //사용불가가 아닌 모든 경우
    if (cabinet.lentType === "PRIVATE")
      cabinetLabelText = cabinet.lents[0]?.intraId;
    else if (cabinet.lentType === "SHARE") {
      const headcount = cabinet.lents.length;
      const cabinetTitle =
        cabinet.title ?? `${cabinet.maxUser} / ${cabinet.maxUser}`;

      cabinetLabelText =
        headcount === cabinet.maxUser
          ? cabinetTitle
          : headcount + " / " + cabinet.maxUser;
    } else if (cabinet.lentType === "CLUB")
      cabinetLabelText = cabinet.title ?? "동아리";
  } else {
    //사용불가인 경우
    cabinetLabelText = "사용불가";
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
    if (cabinet.lentType === CabinetType.PRIVATE) lentType = "개인";
    else if (cabinet.lentType === CabinetType.SHARE) lentType = "공유";
    else if (cabinet.lentType === CabinetType.CLUB) lentType = "동아리";

    if (!cabinetLabelText) return `[${lentType}]`;
    return `[${lentType}] ${cabinetLabelText}`;
  };

  return (
    <CabinetListItemStyled
      status={cabinet.status}
      isMine={false}
      isSelected={currentCabinetId === cabinet.cabinetId}
      isMultiSelect={isMultiSelect}
      isMultiSelected={containsCabinet(cabinet.cabinetId)}
      title={cabinetItemTitleHandler()}
      className="cabiButton"
      onClick={() => {
        if (isMultiSelect) clickCabinetOnMultiSelectMode(cabinet);
        else selectCabinetOnClick(cabinet.cabinetId);
      }}
    >
      <CabinetIconNumberWrapperStyled>
        <CabinetIconContainerStyled
          lentType={cabinet.lentType}
          isMine={false}
          status={cabinet.status}
        />
        <CabinetNumberStyled status={cabinet.status} isMine={false}>
          {cabinet.visibleNum}
        </CabinetNumberStyled>
      </CabinetIconNumberWrapperStyled>
      <CabinetLabelStyled
        className="textNowrap"
        status={cabinet.status}
        isMine={false}
      >
        {cabinetLabelText}
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

export default AdminCabinetListItem;
