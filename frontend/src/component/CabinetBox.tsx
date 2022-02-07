import { useHistory } from 'react-router-dom';
import './cabinetBox.css'

export default function CabinetBox(props:any){
  const history = useHistory();
  const clickHandler = () => {
    props.setTarget(props.cabinet_id);
    props.setCabiNum(props.cabinet_num);
  }
  const clickMyCabinet = () => {
    history.push('/return');
  }
  let clickEvent = clickHandler;
  let toggleName = props.intra_id !== "" ? "" : "modal";
  let targetName = props.isLent === -1 ? "#lentmodal" : "#contentsmodal";
  let vanilaClassName = `border justify-content-center${props.intra_id !== "" ? " lentCabinet" : ""}`;
  if (props.intra_id === props.user)
  {
    vanilaClassName = `border justify-content-center myLentCabinet`;
    toggleName = "modal";
    targetName = "";
    clickEvent = clickMyCabinet;
  }
  return (
    <div className={vanilaClassName} data-bs-toggle={toggleName} data-bs-target={targetName} onClick={clickEvent}>
      <div id="cabinet_num">{props.cabinet_num}</div>
      <div id="intra_id">{props.intra_id}</div>
    </div>
  );
}
