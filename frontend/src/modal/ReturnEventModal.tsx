import { useState } from "react";
import "./returnEventModal.css";

export default function ReturnEventModal() {
  const [open, setOpen] = useState(true);
  
  const handleClick = () => {
    setOpen(!open);
  }
  return (
    <div className={open ? "modal" : "modal hidden"} id="returneventmodal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content returnEvent">
          <div className="modal-header">
            <h5 className="modal-title">
              🎉 42Cabinet 깐부 이벤트 🎉
              <br />
              나의 깐부를 찾아라!
            </h5>
          </div>
          <div className="modal-body">
            <div>축하합니다🎉 🎉 🎉 🎉 🎉 🎉 </div>
            <div>당신은 깐부 이벤트에 당첨되었습니다!</div>
            <div>내 사물함을 확인해주세요!</div>
            <div>#42seoul_club_cabinet</div>
            <div>~채널에서 짝을 찾아주세요~</div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-primary returnEventBtn"
              data-bs-dismiss="modal"
              onClick={handleClick}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
