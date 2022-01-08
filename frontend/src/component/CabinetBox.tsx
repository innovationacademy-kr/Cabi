import LentModal from '../modal/LentModal'

export default function CabinetBox(props:any){
    return (
        <div className={`col-4 col-sm-3 col-lg-2 border text-center${props.intra_id !== "" ? ' bg-secondary' : ''}`}>
            <div data-bs-toggle={props.intra_id !== '' ? '':'modal'} data-bs-target="#lentmodal">
                <div>{props.cabinet_id}</div>
                <div>{props.intra_id}</div>
            </div>
            <LentModal></LentModal>
        </div>
    );
}