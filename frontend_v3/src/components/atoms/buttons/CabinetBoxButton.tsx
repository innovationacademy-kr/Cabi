import styled from "@emotion/styled";

const Cabinet = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 5rem;
  height: 5rem;
  padding: 0;
  border: 0.1rem solid #dee2e6;
  border-radius: 0;
  outline: 0;
  background: ${(props) => props.color || "white"};
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

//TODO: hybae
// Data type 정리
interface UserDto {
  user_id: number; // 42 고유 ID
  intra_id: string; // 42 로그인 ID
  email?: string; // 42 이메일 ID (확장성을 위해 옵셔널 필드로 지정)
}

interface CabinetBoxButtonProps {
  cabinet_type: string;
  cabinet_number: number;
  is_expired: boolean;
  lender: UserDto[];
  isLent: number;
  user: string;
}

const emptyCabinet = "#dee2e6";
const myCabinet = "#7566ab";
const lentedCabinet = "rgba(128, 117, 140)";
const expiredCabinet = "#b90e7a";

//TODO: hybae
//핸들러 추가
const CabinetBoxButton = (props: CabinetBoxButtonProps): JSX.Element => {
  const { cabinet_type, cabinet_number, is_expired, lender, user } = props;

  const setCabinetColor = (): string => {
    if (is_expired) return expiredCabinet;
    if (lender.findIndex((index) => index.intra_id === user) !== -1)
      return myCabinet;
    if ((cabinet_type === "SHARE" && lender.length < 3) || lender.length === 0)
      return emptyCabinet;
    return lentedCabinet;
  };

  const setCabinetText = (): string => {
    switch (cabinet_type) {
      case "PRIVATE":
        return lender === undefined ? "" : lender[0].intra_id;
      case "SHARE":
        return `[${lender.length} / 3]`;
      case "CIRCLE":
        return lender === undefined ? "" : lender[0].intra_id;
      default:
        return "";
    }
  };

  const backgroundColor = setCabinetColor();
  const cabinet_text = setCabinetText();

  const handleClick = (): void => {};

  return (
    <Cabinet onClick={handleClick} color={backgroundColor}>
      <CabinetInfoNumber>{cabinet_number}</CabinetInfoNumber>
      <CabinetInfoText>{cabinet_text}</CabinetInfoText>
    </Cabinet>
  );
};

export default CabinetBoxButton;
