import axios from 'axios'
import './passwordModal.css'

export default function PasswordModal(props: any) {
  // const handleClick = async () => {
  //   const url = "/api/return";

  //   await axios.post(url, { lent_id: props.lentCabinet.lent_id }).then((res: any) => {
  //     if (res.status === 200) {
  //       props.setContent("반납되었습니다");
  //       props.setPath("/lent");
  //     }
  //   }).catch((err: any) => {
  //     console.log(err);
  //     props.setContent("다시 시도해주세요!");
  //     props.setPath("");
  //   })
  // }
  let name:any;
  let password;

  const onChange = (e: any) => {
    password = name;
  };

  return (
<div className="modal fade" id="passwordmodal" tabIndex={-1}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">비밀번호를 로컬에 기록합니다</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
          <div className="mb-3">
            <label className="col-form-label">Recipient:</label>
            <input type="text" value={name} onChange={onChange}></input>
          </div>
          {/* <div className="mb-3">
            <label for="message-text" className="col-form-label">Message:</label>
            <textarea className="form-control" id="message-text"></textarea>
          </div> */}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Send message</button>
      </div>
    </div>
  </div>
</div>
  )
}