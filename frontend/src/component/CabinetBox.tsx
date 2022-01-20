import './cabinetBox.css'

export default function CabinetBox(props:any){
    const toggleName = props.intra_id !== '' ? '':'modal';
    const targetName = props.isLent === -1 ? "#lentmodal": "#contentsmodal";
    const vanilaClassName = `border justify-content-center${props.intra_id !== "" ? ' lentCabinet' : ''}`;

    const clickHandler = () => {
        props.setTarget(props.cabinet_id);
        props.setCabiNum(props.cabinet_num);
    }
    return (
        <div className={vanilaClassName}  data-bs-toggle={toggleName} data-bs-target={targetName} onClick={clickHandler}>
            <div id="cabinet_num">{props.cabinet_num}</div>
            <div id="intra_id">{props.intra_id}</div>
        </div>
    );
}
