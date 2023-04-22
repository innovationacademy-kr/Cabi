import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  targetCabinetInfoState,
  selectedTypeOnSearchState,
} from "@/recoil/atoms";
import useMenu from "@/hooks/useMenu";
import { axiosCabinetById } from "@/api/axios/axios.custom";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled, { css } from "styled-components";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";

import {
  cabinetStatusColorMap,
  cabinetLabelColorMap,
  cabinetIconSrcMap,
  cabinetFilterMap,
} from "@/assets/data/maps";
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
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
  const { openCabinet, closeCabinet } = useMenu();
  //  const isMine = MY_INFO ? MY_INFO.cabinet_id === props.cabinet_id : false;
  const { isMultiSelect, clickCabinetOnMultiSelectMode, containsCabinet } =
    useMultiSelect();
  let cabinetLabelText = "";

  if (cabinet.status !== "BANNED" && cabinet.status !== "BROKEN") {
    //사용불가가 아닌 모든 경우
    if (cabinet.lent_type === "PRIVATE")
      cabinetLabelText = cabinet.lent_info[0]?.intra_id;
    else if (cabinet.lent_type === "SHARE") {
      const headcount = cabinet.lent_info.length;
      const cabinetTitle =
        cabinet.cabinet_title ?? `${cabinet.max_user} / ${cabinet.max_user}`;

      cabinetLabelText =
        headcount === cabinet.max_user
          ? cabinetTitle
          : headcount + " / " + cabinet.max_user;
    } else if (cabinet.lent_type === "CLUB")
      cabinetLabelText = cabinet.cabinet_title ?? "동아리";
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
    if (cabinet.lent_type === CabinetType.PRIVATE) lentType = "개인";
    else if (cabinet.lent_type === CabinetType.SHARE) lentType = "공유";
    else if (cabinet.lent_type === CabinetType.CLUB) lentType = "동아리";

    if (!cabinetLabelText) return `[${lentType}]`;
    return `[${lentType}] ${cabinetLabelText}`;
  };

  return (
    <CabinetListItemStyled
      status={cabinet.status}
      isMine={false}
      isSelected={currentCabinetId === cabinet.cabinet_id}
      isMultiSelect={isMultiSelect}
      isMultiSelected={containsCabinet(cabinet.cabinet_id)}
      title={cabinetItemTitleHandler()}
      className="cabiButton"
      onClick={() => {
        if (isMultiSelect) clickCabinetOnMultiSelectMode(cabinet);
        else selectCabinetOnClick(cabinet.cabinet_id);
      }}
    >
      <CabinetIconNumberWrapperStyled>
        <CabinetIconContainerStyled
          lent_type={cabinet.lent_type}
          isMine={false}
          status={cabinet.status}
        />
        <CabinetNumberStyled status={cabinet.status} isMine={false}>
          {cabinet.cabinet_num}
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

export default AdminCabinetListItem;
