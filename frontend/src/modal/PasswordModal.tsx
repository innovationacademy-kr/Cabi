import axios from 'axios'
import './passwordModal.css'

export default function PasswordModal(props: any) {
  const setCabinetPassword = props.setCabinetPassword;

  const onChange = (e: any) => {
    localStorage.setItem('cabinetPassword', e.target.value);
    setCabinetPassword(e.target.value);
  };

  return (
    <div className="modal" id="passwordmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">* 비밀번호 메모 정보는 서버에 저장되지 않습니다 :)</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mt-3">
              <div> 내 사물함 비밀번호는 ... </div>
              <input className='input my-4 p-2' type="text" onChange={onChange} maxLength={10} placeholder='ex)생년월일,4242, ...'></input>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">기록완료!</button>
          </div>
        </div>
      </div>
    </div>
  )
}
