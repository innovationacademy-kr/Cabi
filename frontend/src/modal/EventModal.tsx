import "./EventModal.css";
import { useState } from "react";

export default function EventModal(props: any) {
  const [show, setShow] = useState(true);

  const dismiss = () => {
    setShow(false);
  };

  const dismissAndPrevent = () => {
    setShow(false);
    localStorage.setItem("eventShown", "ok");
  };

  return (
    <div className={show ? "modal" : "modal hidden"} id="eventmodal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              🎉 또 다시 돌아온 42 Cabi 5월 이벤트! 🎉
              <br />
              나의 깐부를 찾아라!!
            </h5>
          </div>
          <div className="modal-body">
            <p className="eventMessage"> ☼ 이벤트 기간 ⇒ 5/16 ~ 소진 시 ❗️ </p>
            <p className="eventMessage">
              {" "}
              ☼ 당첨 인원 ⇒ 5팀 (총 10명, 인당 10월렛💰){" "}
            </p>
            <p className="eventMessage">
              {" "}
              ☼ 사물함 목록에서 당신의 사물함에 사진이 뜬다면..? <br />
              &ensp; 사진과 꼭 맞는 깐부🫂를 찾아주세요!! <br />
              &ensp; (깐부끼리는 서로 볼 수 있다던데..?)
            </p>
            <p className="eventMessage">
              {" "}
              ☼ 이번 이벤트는 깐부를 직접 만나서 오프라인 인증샷을 찍어주세요!
              <br />
              &ensp; 인증샷📸을 슬랙 cabinet 채널에 올리시면 선착순으로 당첨!!
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
