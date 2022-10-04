import styled from "@emotion/styled";
import CabinetStatus from "../../../types/enum/cabinet.status.enum";
import CabinetType from "../../../types/enum/cabinet.type.enum";
import * as cabinetColor from "../../../themes/cabinetColor";
import { LentDto } from "../../../types/dto/lent.dto";
import { useAppSelector } from "../../../redux/hooks";
// import LentModal from "../modals/LentModal";

const Cabinet = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 88px;
  height: 88px;
  padding: 0;
  margin: 0;
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
  cabinet_id: number;
  lender: LentDto[];
  status: CabinetStatus;
}

// TODO: hybae
// 핸들러 추가
// line 64: 로그인 기능 추가 후 적용
const CabinetBoxButton = (props: CabinetBoxButtonProps): JSX.Element => {
  const { cabinet_type, cabinet_number, cabinet_id, lender, status } = props;
  const user = useAppSelector((state) => state.user);

  const setCabinetColor = (): string => {
    if (cabinet_id === user.cabinet_id) return cabinetColor.myCabinet;
    switch (status) {
      case CabinetStatus.AVAILABLE:
        return cabinetColor.emptyCabinet;
      case CabinetStatus.SET_EXPIRE_FULL:
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
    if (status === CabinetStatus.BANNED) return "사용불가";
    if (status === CabinetStatus.BROKEN) return "고장";
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

  return (
    <Cabinet color={setCabinetColor()}>
      <CabinetInfoNumber>{cabinet_number}</CabinetInfoNumber>
      <CabinetInfoText>{setCabinetText()}</CabinetInfoText>
    </Cabinet>
  );
};

export default CabinetBoxButton;
