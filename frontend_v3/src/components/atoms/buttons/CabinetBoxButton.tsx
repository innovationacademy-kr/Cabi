import styled from "@emotion/styled";
import { useState } from "react";
import GuideModal from "../modals/GuideModal";
import LentBox from "../modals/LentBox";
import { UserDto } from "../../../types/dto/user.dto";
import CabinetStatus from "../../../types/enum/cabinet.status.enum";
import CabinetType from "../../../types/enum/cabinet.type.enum";
import * as cabinetColor from "../../../themes/cabinetColor";
// import LentModal from "../modals/LentModal";

const Cabinet = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 90px;
  height: 90px;
  padding: 0;
  border: 1px solid #dee2e6;
  border-radius: 0;
  outline: 0;
  background: ${(props): string => props.color || "white"};
`;

const CabinetInfoNumber = styled.div`
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
`;

const CabinetInfoText = styled.div`
  color: #464646;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
`;

interface CabinetBoxButtonProps {
  cabinet_type: CabinetType;
  cabinet_number: number;
  is_expired: boolean;
  lender: UserDto[];
  activation: CabinetStatus;
  user: string;
}

// TODO: hybae
// 핸들러 추가
// line 64: 로그인 기능 추가 후 적용
const CabinetBoxButton = (props: CabinetBoxButtonProps): JSX.Element => {
  const { cabinet_type, cabinet_number, is_expired, lender, user, activation } =
    props;

  const setCabinetColor = (): string => {
    // if (lender.findIndex((e) => e.intra_id === user))
    //   return cabinetColor.myCabinet;
    switch (activation) {
      case CabinetStatus.AVAILABLE:
        return cabinetColor.emptyCabinet;
      case CabinetStatus.FULL:
        return cabinetColor.lentedCabinet;
      case CabinetStatus.EXPIRED:
        return cabinetColor.expiredCabinet;
      case CabinetStatus.BROKEN:
        return cabinetColor.brokenCabinet;
      case CabinetStatus.BANNED:
        return cabinetColor.bannedCabinet;
      default:
        return cabinetColor.defaultColor;
    }
  };

  const setCabinetText = (): string => {
    switch (cabinet_type) {
      case CabinetType.PRIVATE:
        return lender.length === 0 ? "" : lender[0].intra_id;
      case CabinetType.SHARE:
        return `[${lender.length} / 3]`;
      case CabinetType.CIRCLE:
        return lender.length === 0 ? "" : lender[0].intra_id;
      default:
        return "";
    }
  };

  const backgroundColor = setCabinetColor();
  const cabinet_text = setCabinetText();

  // const handleClick = (): void => {
  //   console.log(`TYPE : ${cabinet_type}\nLEN : ${lender.length}`);
  // };
  return (
    // <Cabinet onClick={handleClick} color={backgroundColor}>
    <Cabinet color={backgroundColor}>
      <CabinetInfoNumber>{cabinet_number}</CabinetInfoNumber>
      <CabinetInfoText>{cabinet_text}</CabinetInfoText>
      {/* {isModalOpen && (
        <LentModal
          cabinet_type={cabinet_type}
          cabinet_number={cabinet_number}
          lender={lender}
          handleClose={handleClick}
        />
      )} */}
    </Cabinet>
  );
};

export default CabinetBoxButton;
