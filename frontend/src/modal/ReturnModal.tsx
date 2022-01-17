import axios from 'axios'
import './returnModal.css'
import { useHistory } from 'react-router-dom';

export default function ReturnModal(props:any){
  const history = useHistory();

  const handleClick = async () => {
		const url = '/api/return';
    await axios.post(url, {lent_id: props.lentCabinet.lent_id}).then((res:any)=>{
      if (res.status === 200){
        alert('반납되었습니다');
        history.push("/lent");
      }
    }).catch((err:any)=>{
      console.log(err);
      alert('다시 시도해주세요!');
    })
  }
  return (
    <div className="modal" id="returnmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">이용 중인 사물함을 반납합니다.</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>사물함을 반납하시겠습니까?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" className="btn btn-primary" id="btn-primary" data-bs-dismiss="modal" onClick={handleClick} >반납</button>
          </div>
        </div>
      </div>
    </div>
  )
}


