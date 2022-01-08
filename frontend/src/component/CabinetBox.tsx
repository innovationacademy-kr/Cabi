import axios from "axios";

export default function CabinetBox(props:any){
    return (
        <div className={`col-4 col-sm-3 col-lg-2 border text-center${props.intra_id ? ' bg-secondary' : ''}`} id="lentBtn" >
            <div>{props.cabinet_id}</div>
            <div>{props.intra_id}</div>
        </div>
    );
}