import axios from "axios";
import "./returnModal.css";
// import { useState } from "react";

export default function ReturnModal(props: any) {
  // 리턴 모달에 이벤트를 띄울 시, 하단의 함수를 사용하여 returnTarget의 값을 바꾸어 사용했어요.
  // 현재 리턴모달 측 변경하는 이벤트를 사용하지 않으므로, returnTarget의 값은 기본값인 contentsmodal 이 됩니다.

  // const handleReturn = () => {
  //   let result: number = 0;
  //   const second: number = new Date().getSeconds();
  //   const key: number = import.meta.env.VITE_KEY
  //     ? parseInt(import.meta.env.VITE_KEY)
  //     : 42;
  //   const quote: number = import.meta.env.VITE_QUOTE
  //     ? parseInt(import.meta.env.VITE_QUOTE)
  //     : 42;

  //   if (new Date() < new Date(2022, 3, 18, 10, 0, 0)) {
  //     return false;
  //   }
  //   if (props.user && props.lentCabinet) {
  //     result = props.user.user_id + props.lentCabinet.lent_cabinet_id + second;
  //   }
  //   if (result && result % key === quote) {
  //     return true;
  //   }
  //   return false;
  // };
  // const returnTarget: string = handleReturn()
  //   ? "#returneventmodal"
  //   : "#contentsmodal";
  const returnTarget: string = "#contentsmodal";

  // const handleEventReturn = () => {
  //   const url = "/api/event/return"
  //   axios.post(url)
  //     .catch((err) => {console.log(err)});
  // };

  const handleClick = async () => {
    const url = "/api/return";
    await axios
      .post(url, { lent_id: props.lentCabinet.lent_id })
      .then((res: any) => {
        if (res.status === 200) {
          localStorage.clear();
          props.setContent("반납되었습니다");
          props.setPath("/lent");
        }
      })
      .catch((err: any) => {
        console.log(err);
        props.setContent("다시 시도해주세요!");
        props.setPath("");
      });

    // 5월 이벤트 사용을 위해, event 테이블에 당첨자가 return 했음을 알려주는 함수입니다.
    // handleEventReturn();
  };

  return (
    <div className="modal" id="returnmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">이용 중인 사물함을 반납합니다.</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>사물함을 반납하시겠습니까?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              취소
            </button>
            <button
              type="button"
              className="btn btn-primary"
              id="btn-primary"
              data-bs-toggle="modal"
              data-bs-target={returnTarget}
              data-bs-dismiss="modal"
              onClick={handleClick}
            >
              반납
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
