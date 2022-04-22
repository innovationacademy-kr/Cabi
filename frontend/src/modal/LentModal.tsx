import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./lentModal.css";

export default function LentModal(props: any) {
  const history = useHistory();
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
          history.push("/return");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
              대여기간은 +7일입니다.<br></br> 이용 중 귀중품 분실에 책임지지
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
