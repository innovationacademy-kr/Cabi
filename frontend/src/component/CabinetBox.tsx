import { useNavigate } from "react-router-dom";
import { eventInfo } from "../pages/Event";
import "./cabinetBox.css";
import ReturnEventImage from "./EventImage";

export default function CabinetBox(props: any) {
  const navigate = useNavigate();
  let isExpired: boolean = false;
  let toggleName: string = props.intra_id !== "" ? "" : "modal";
  let targetName: string = props.isLent === -1 ? "#lentmodal" : "#contentsmodal";
  let vanilaClassName: string = "border justify-content-center";

  let isEventBox: null | eventInfo = props.checkEvent(props.intra_id);

  if (props.isLent && props.expire_time) {
    isExpired = new Date(props.expire_time) < new Date();
  }
  if (isExpired) {
    vanilaClassName += " expiredLentCabinet";
  } else if (props.intra_id === props.user) {
    vanilaClassName += " myLentCabinet";
  } else if (props.intra_id !== "") {
    vanilaClassName += " lentCabinet";
  }

  const clickHandler = () => {
    if (props.intra_id === props.user) {
      toggleName = "modal";
      targetName = "";
      navigate("/return");
      return;
    }
    props.setTarget(props.cabinet_id);
    props.setCabiNum(props.cabinet_num);
  };

  const checkEventImage = ():JSX.Element => {
    if (!isEventBox) {
      return <></>;
    }
    return <img src={ReturnEventImage(isEventBox.event_name)} alt='..'></img>;
  };

  return (
    <div
    className={vanilaClassName}
    data-bs-toggle={toggleName}
    data-bs-target={targetName}
    onClick={clickHandler}
    >
    { !isEventBox ?
      <>
        <div id="cabinet_num">{props.cabinet_num}</div>
        <div id="intra_id">{props.intra_id}</div>
      </>
    : <>
        <div id="cabinet_image">{checkEventImage()}</div>
      </>
    }
    </div>
  );
}
