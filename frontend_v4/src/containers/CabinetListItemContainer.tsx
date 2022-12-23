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
  if (props.status !== "BANNED") {
    //사용불가가 아닌 모든 경우
    if (props.lent_type === "PRIVATE")
      cabinetLabelText = props.lent_info[0].intra_id;
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
      <CabinetIconContainerStyled status={props.status}>
        <CabinetIconStyled type={props.lent_type} />
      </CabinetIconContainerStyled>
      <CabinetNumberStyled status={props.status} cabinet_id={props.cabinet_id}>
        {props.cabinet_num}
      </CabinetNumberStyled>
      <CabinetLabelStyled status={props.status} cabinet_id={props.cabinet_id}>
        {cabinetLabelText}
      </CabinetLabelStyled>
    </CabinetListItemStyled>
  );
};

const cabinetStatusColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--empty)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--lent)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--delay)",
  [CabinetStatus.EXPIRED]: "var(--delay)",
  [CabinetStatus.BROKEN]: "var(--broken)",
  [CabinetStatus.BANNED]: "var(--ban)",
};

const cabinetIconSrcMap = {
  [CabinetType.PRIVATE]: "@/assets/images/soloIcon.svg",
  [CabinetType.SHARE]: "src/assets/images/groupIcon.svg",
  [CabinetType.CIRCLE]: "src/assets/images/clubIcon.svg",
};

const cabinetLabelColorMap = {
  [CabinetStatus.AVAILABLE]: "var(--black)",
  [CabinetStatus.SET_EXPIRE_FULL]: "var(--white)",
  [CabinetStatus.SET_EXPIRE_AVAILABLE]: "var(--white)",
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
  display: inline-block;
`;

const CabinetLabelStyled = styled.p<{
  status: CabinetStatus;
  cabinet_id: number;
}>`
  position: absolute;
  top: 44px;
  left: 10px;
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
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
  color: ${(props) => cabinetLabelColorMap[props.status]};
  ${(props) =>
    props.cabinet_id === MY_INFO.cabinet_id &&
    css`
      color: var(--black);
    `}
`;

const CabinetIconContainerStyled = styled.div<{ status: string }>`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 10px;
  left: 10px;
`;

const CabinetIconStyled = styled.img.attrs({
  src: cabinetIconSrcMap.CIRCLE,
})<{ type: CabinetType }>`
  src: ${(props) => cabinetIconSrcMap[props.type]};
  object-fit: cover;
`;

export default CabinetListItemContainer;
