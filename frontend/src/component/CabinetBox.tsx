import { useHistory } from 'react-router-dom';
import './cabinetBox.css'

export default function CabinetBox(props:any){
  const history = useHistory();
  let isExpired:boolean = false;
  let toggleName = props.intra_id !== "" ? "" : "modal";
  let targetName = props.isLent === -1 ? "#lentmodal" : "#contentsmodal";
  let vanilaClassName = "border justify-content-center";
  
  if (props.isLent && props.expire_time){
    isExpired = new Date(props.expire_time) < new Date();
  }
  if (isExpired){
    vanilaClassName += " expiredLentCabinet";
    console.log("expiredLentCabinet\n");
  }else if (props.intra_id === props.user){
    vanilaClassName += " myLentCabinet";
    console.log("myLentCabinet\n");
  }else if (props.intra_id !== ""){
    vanilaClassName += " lentCabinet";
    console.log("lentCabinet\n");
  }

  const clickHandler = () => {
    if (props.intra_id === props.user){
      toggleName = "modal";
      targetName = "";
      history.push('/return');
      return ;
    }
    props.setTarget(props.cabinet_id);
    props.setCabiNum(props.cabinet_num);
  }

  return (
    <div className={vanilaClassName} data-bs-toggle={toggleName} data-bs-target={targetName} onClick={clickHandler}>
      <div id="cabinet_num">{props.cabinet_num}</div>
      <div id="intra_id">{props.intra_id}</div>
    </div>
  );
}
