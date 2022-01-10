
export default function CabinetBox(props:any){
    return (
        <div className={`border text-center${props.intra_id !== "" ? ' bg-secondary' : ''}`}  data-bs-toggle={props.intra_id !== '' ? '':'modal'} data-bs-target="#lentmodal">
            <div>{props.cabinet_id}</div>
            <div>{props.intra_id}</div>
        </div>
    );
}