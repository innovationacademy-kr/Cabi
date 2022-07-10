import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentsModal from "./ContentsModal";
import "./lentModal.css";

export default function LentModal(props: any) {
  const navigate = useNavigate();
  const [errorModal, setError] = useState<boolean>(false);
  const [state, setState] = useState<boolean>(false);

  const handleClick = () => {
    const url = "/api/lent";

    axios
      .post(url, { cabinet_id: props.target })
      .then((res: any) => {
        if (res.data.cabinet_id && res.data.cabinet_id === -2) {
          alert("이미 대여중인 사물함입니다!");
          return;
        }
        if (res.status === 200) {
          navigate("/return");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("🚨 대여에 실패했습니다 🚨");
      });

      // 5월 이벤트 사용을 위해, event 테이블에 당첨자가 lent 했음을 알려주는 함수입니다.
      // handleEventLent();
  };

  // const handleEventLent = () => {
  //   const url = "/api/event/lent"
  //   axios.post(url)
	// 		.then(res => {})
  //     .catch(err => {console.error(err)});
  // };

  return (
    <div className="modal" id="lentmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              [ {props.cabiNum} ] 번 사물함을 대여합니다.
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="alretMessage">
              {" "}
              대여기간은 +30일 입니다.<br></br> 이용 중 귀중품 분실에 책임지지
              않습니다.
            </p>
            <p className="agreeMessage">
              {" "}
              알겠습니다. 대여할게요!{" "}
              <input
                type="checkbox"
                id="check"
                onClick={() => setState(!state)}
              ></input>
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              취소
            </button>
            <button
              type="button"
              className={`btn btn-primary ${state ? "" : "disabled"}`}
              id="btn-primary"
              data-bs-dismiss="modal"
              onClick={handleClick}
            >
              대여
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
