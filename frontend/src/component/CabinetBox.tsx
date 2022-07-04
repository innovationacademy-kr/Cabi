import { useNavigate } from "react-router-dom";
import "./cabinetBox.css";

export default function CabinetBox(props: any) {
  const navigate = useNavigate();
  let isExpired: boolean = false;
  let isDisabled: boolean = props.activation == 0 ? true : false;
  let isLongTerm: boolean = props.activation == 3 ? true : false;
  let uniqueCabinetMessage: string = "";
  let toggleName: string = props.intra_id !== "" ? "" : "modal";
  let targetName =
    props.isLent === -1 && !isDisabled && !isLongTerm
      ? "#lentmodal"
      : "#contentsmodal";
  let vanilaClassName: string = "border justify-content-center";

  if (props.isLent && props.expire_time) {
    isExpired = new Date(props.expire_time) < new Date();
  }
  if (isExpired) {
    vanilaClassName += " expiredLentCabinet";
  } else if (isDisabled) {
    vanilaClassName += " disabledCabinet";
    uniqueCabinetMessage = "고장";
  } else if (isLongTerm) {
    vanilaClassName += " longTermCabinet";
    // uniqueCabinetMessage = "단체 대여";
    uniqueCabinetMessage = "스탬프 이벤트";
  } else if (props.intra_id === props.user) {
    vanilaClassName += " myLentCabinet";
  } else if (props.intra_id !== "") {
    vanilaClassName += " lentCabinet";
  }

  const clickHandler = () => {
    if (!isDisabled && !isLongTerm) {
      if (props.intra_id === props.user) {
        toggleName = "modal";
        targetName = "";
        navigate("/return");
        return;
      }
      props.setModalMessage("이미 대여중인 사물함이 있어요 :)");
      props.setTarget(props.cabinet_id);
      props.setCabiNum(props.cabinet_num);
    } else {
      if (isDisabled) {
        props.setModalMessage("대여할 수 없는 사물함입니다 :(");
      } else {
        props.setModalMessage(
          "📦 사물함 사용 방법 \n\n1.비밀번호🔑 4자리(4242)를 입력한다!\n2.사물함을 열고 도장💯을 찍는다!\n3.문을 닫고 비밀번호 4자리(4242)를 입력한다!\n\n자세한 사용법🔖은 우측 상단 메뉴\n'이용안내'를 꼭 읽어봐주세요 :)\n\n🤜42서울 7기 화이팅!!🤛"
        );
      }
    }
  };

  return (
    <div
      className={vanilaClassName}
      data-bs-toggle={toggleName}
      data-bs-target={targetName}
      onClick={clickHandler}
    >
      <div id="cabinet_num">{props.cabinet_num}</div>
      <div id="intra_id">
        {props.intra_id}
        {uniqueCabinetMessage}
      </div>
    </div>
  );
}
