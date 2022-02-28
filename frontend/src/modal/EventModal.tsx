import "./EventModal.css"
import React, {useState} from 'react'

export default function EventModal(props:any){

    const [show, setShow] = useState(true);

    const dismiss = () =>{
        setShow(false);
    }

    const dismissAndPrevent = () =>{
        setShow(false);
        localStorage.setItem('eventshown',"ok");
    }

    return(
        <div className={show ? "modal" : "modal hidden"} id="eventmodal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            [42Cabinet Beta 오픈 이벤트 - 시크릿 사물함을 찾아라!]
                        </h5>
                    </div>
                    <div className="modal-body">
                        <p className="eventMessage"> - 이벤트기간: 3/01 - 3/31 <br/> </p>
                        <p className="eventMessage"> - 특이사항: 이벤트 기간 중, 대여기간&연장기간은 7일로 조정돼요.<br/>
                        (이벤트종료 후에는, 본래 서비스 기간인 30일로 조정될 예정이랍니다)<br/></p>
                        <p className="eventMessage">- 자세한 이벤트 사항은 42Slack의 <a className="link" href="https://42born2code.slack.com/archives/C02V6GE8LD7" target="_blank">cabinet 채널</a>을 참고해주세요!<br/></p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={dismiss}>알겠어요!</button>
                        <button type="button" className="btn btn-primary" id="btn-primary" data-bs-dismiss="modal" onClick={dismissAndPrevent}>42.. 아니 24시간 동안 알겠어요!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


{/* <span className="eventMessage"> - 이벤트기간: 3/01 - 3/31 <br></br> 
- 특이사항: 이벤트 기간 중, 대여기간&연장기간은 7일로 조정되요. <br></br>
(이벤트종료 후에는, 본래 서비스 기간인 30일로 조정될 예정이랍니다)<br></br>
- 자세한 이벤트 사항은 42Slack의 <a className="dropdown-item" href="https://42born2code.slack.com/archives/C02V6GE8LD7" target="_blank">cabinet 채널</a>을 참고해주세요! <br></br>
</span> */}