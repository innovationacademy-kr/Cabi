export default function CabinetBox(props:any){
    const clickHandler = () => {
        props.setTarget(props.cabinet_id);
        props.setCabiNum(props.cabinet_num);
    }
    return (
        <div className={`border text-center${props.intra_id !== "" ? ' bg-secondary' : ''}`}  data-bs-toggle={props.intra_id !== '' ? '':'modal'} data-bs-target={props.isLent === -1 ? "#lentmodal": "#contentsmodal"} onClick={clickHandler}>
            <div>{props.cabinet_num}</div>
            <div>{props.intra_id}</div>
        </div>
    );
}
