// import Menu from '../component/Menu' 
// import './lent.css'

export default function ReturnModal(){

  const handleClick = () => {
    alert("반납완료?!")
    // 사실, 여기 함수를 이용하여 반납완료 시, 반납성공 한번 띄워주고는
    // 바로 lent 페이지로 날려주고 싶스므니다. 더 찾아보겟스므니다.
}
    return (
      <div className="modal" id="returnmodal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">이용 중인 사물함을 반납합니다.</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>사물함을 반납하시겠습니까?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" className="btn btn-primary" onClick={handleClick} >반납</button>
            </div>
          </div>
        </div>
      </div>
    )
}


