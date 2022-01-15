import axios from 'axios';
import './lentModal.css';

export default function LentModal(props:any){

  const handleClick = () => {
    const local_url = "http://localhost:4242/api/lent"
    const dev_url = "api/lent"
    axios.post(dev_url, {cabinet_id : props.target}).then((res:any)=>{
      window.location.href="/return"
    }).catch((err)=>{console.log(err)});
  }

  return (
    <div className="modal" id="lentmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"></h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p >  선택하신    [ {props.cabiNum} ]   번 사물함을 대여하시겠습니까?</p>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" className="btn btn-primary" id="btn-primary" onClick={handleClick}>대여</button>
          </div>
        </div>
      </div>
    </div>
  )
}

