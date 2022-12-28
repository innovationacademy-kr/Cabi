import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import styled, { css } from "styled-components";

const MY_INFO: UserDto = {
  cabinet_id: 115,
  user_id: 131742,
  intra_id: "seycho",
};

const CabinetListItemContainer = (props: CabinetInfo): JSX.Element => {
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
  return (
    <CabinetListItemStyled status={props.status} cabinet_id={props.cabinet_id}>
      <CabinetIconNumberWrapperStyled>
        <CabinetIconContainerStyled
          lent_type={props.lent_type}
          cabinet_id={props.cabinet_id}
          status={props.status}
        />
        <CabinetNumberStyled
          status={props.status}
          cabinet_id={props.cabinet_id}
        >
          {props.cabinet_num}
        </CabinetNumberStyled>
      </CabinetIconNumberWrapperStyled>
      <CabinetLabelStyled status={props.status} cabinet_id={props.cabinet_id}>
        {cabinetLabelText}
      </CabinetLabelStyled>
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
  [CabinetType.PRIVATE]: "src/assets/images/soloIcon.svg",
  [CabinetType.SHARE]: "src/assets/images/groupIcon.svg",
  [CabinetType.CIRCLE]: "src/assets/images/clubIcon.svg",
};

const cabinetFilterMap = {
  [CabinetStatus.AVAILABLE]: "none",
  [CabinetStatus.SET_EXPIRE_FULL]: "brightness(100)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "none",
  [CabinetStatus.EXPIRED]: "brightness(100)",
  [CabinetStatus.BROKEN]: "brightness(100)",
  [CabinetStatus.BANNED]: "brightness(100)",
};

const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--black)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--white)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--black)",
  [CabinetStatus.EXPIRED]: "var(--white)",
  [CabinetStatus.BROKEN]: "var(--white)",
  [CabinetStatus.BANNED]: "var(--white)",
};

const CabinetListItemStyled = styled.div<{
  status: CabinetStatus;
  cabinet_id: number;
}>`
  position: relative;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
  ${(props) =>
    props.cabinet_id === MY_INFO.cabinet_id &&
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
  padding: 10px 10px 16px;
  transition: all 0.2s;
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
  cabinet_id: number;
}>`
  font-size: 14px;
  color: ${(props) => cabinetLabelColorMap[props.status]};
  ${(props) =>
    props.cabinet_id === MY_INFO.cabinet_id &&
    css`
      color: var(--black);
    `}
`;

const CabinetNumberStyled = styled.p<{
  status: CabinetStatus;
  cabinet_id: number;
}>`
  font-size: 14px;
  color: ${(props) => cabinetLabelColorMap[props.status]};
  ${(props) =>
    props.cabinet_id === MY_INFO.cabinet_id &&
    css`
      color: var(--black);
    `}
`;

const CabinetIconContainerStyled = styled.div<{
  lent_type: CabinetType;
  status: CabinetStatus;
  cabinet_id: number;
}>`
  width: 16px;
  height: 16px;
  background-image: url(${(props) => cabinetIconSrcMap[props.lent_type]});
  background-size: contain;
  filter: ${(props) => cabinetFilterMap[props.status]}
    ${(props) =>
      props.cabinet_id === MY_INFO.cabinet_id &&
      css`
        filter: none;
      `};
`;

export default CabinetListItemContainer;
