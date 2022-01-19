import './cabinetBox.css'

export default function CabinetBox(props:any){
    const clickHandler = () => {
        props.setTarget(props.cabinet_id);
        props.setCabiNum(props.cabinet_num);
    }
    return (
        <div className={`border justify-conten${props.intra_id !== "" ? ' bg-secondary' : ''}`}  data-bs-toggle={props.intra_id !== '' ? '':'modal'} data-bs-target={props.isLent === -1 ? "#lentmodal": "#contentsmodal"} onClick={clickHandler}>
            <div id="cabinet_num">{props.cabinet_num}</div>
            <div id="intra_id">{props.intra_id}</div>
        </div>
    );
}
