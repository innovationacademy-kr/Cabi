export default function ReturnEventModal(props: any) {
  return (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              🎉 42Cabinet 반납 이벤트 🎉
              <br />시크릿 사물함을 반납해라!
            </h5>
          </div>
          <div className="modal-body">
            <div>
              <div>축하합니다🎉 🎉 🎉 🎉 🎉 🎉 </div>
              <div>당신은 시크릿 사물함의 주인공입니다!</div>
              <div>#42seoul_club_cabinet 채널에 인증해주세요~</div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">확인</button>
          </div>
        </div>
      </div>
    </div>
  )
}