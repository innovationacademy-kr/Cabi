import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './lentModal.css';
export default function ContentsModal(props:any){

  return (
    <div className="modal" id="lentmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"></h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p > {props.contents}</p>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-primary" id="btn-primary" data-bs-dismiss="modal" >확인</button>
          </div>
        </div>
      </div>
    </div>
  )
}

