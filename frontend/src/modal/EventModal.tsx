import "./EventModal.css";
import React, { useState } from "react";

export default function EventModal(props: any) {
  const [show, setShow] = useState(true);

  const dismiss = () => {
    setShow(false);
  };

  const dismissAndPrevent = () => {
    setShow(false);
    localStorage.setItem("returnEventShown", "ok");
  };

  return (
    <div className={show ? "modal" : "modal hidden"} id="eventmodal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              🎉 다시 돌아온 42Cabinet 이벤트 🎉
              <br />
              시크릿 사물함을 반납해라!
            </h5>
          </div>
          <div className="modal-body">
            <p className="eventMessage"> ☼ 이벤트 기간 ⇒ 4/18 ~ 소진 시 ❗️ </p>
            <p className="eventMessage"> ☼ 당첨 인원 ⇒ 5명 (1명 당 5월렛) </p>
            <p className="eventMessage">
              {" "}
              ☼ 반납 시 특별한 팝업이 뜬다면 <br />
              &ensp; 그대는 시크릿 사물함의 주인 🥂{" "}
            </p>
            <p className="eventMessage">
              {" "}
              ☼ 특이사항 ⇒ 이벤트 기간 중, 대여기간 & 연장기간은 7일로 조정돼요.
              <br />
              &ensp; (이벤트종료 후 대여일은 30일로 조정될 예정입니다.)
              <br />
            </p>
            <p className="eventMessage">
              ☼ 자세한 이벤트 사항은 42Slack의{" "}
              <a
                className="link"
                href="https://42born2code.slack.com/archives/C02V6GE8LD7"
                target="_blank"
              >
                cabinet 채널
              </a>
              을 참고해주세요!
              <br />
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-primary"
              id="btn-primary"
              data-bs-dismiss="modal"
              onClick={dismissAndPrevent}
            >
              알겠어요!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <span className="eventMessage"> - 이벤트기간: 3/01 - 3/31 <br></br> 
- 특이사항: 이벤트 기간 중, 대여기간&연장기간은 7일로 조정되요. <br></br>
(이벤트종료 후에는, 본래 서비스 기간인 30일로 조정될 예정이랍니다)<br></br>
- 자세한 이벤트 사항은 42Slack의 <a className="dropdown-item" href="https://42born2code.slack.com/archives/C02V6GE8LD7" target="_blank">cabinet 채널</a>을 참고해주세요! <br></br>
</span> */
}
