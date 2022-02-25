import './menualModal.css'

export default function MenualModal() {

  return (
    <div className="modal" id="menualmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title align-middle px-10">🗄 42cabi 이용 안내서</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className='menual-body' id='menual-body'>
              <ul>
                <li className='py-1'>1인 당 1개의 사물함을 대여할 수 있고,<br />대여기간 동안 자유롭게 사용할 수 있습니다.<br /></li>
                <li className='py-1'>대여기간은 대여한 날로 부터 +30일 입니다.<br /></li>
                <li className='py-1'>반납 시 두고가는 소지품이 없는 지 확인해주세요!<br /></li>
                <li className='py-1'>대여하신 사물함의 비밀번호는 저장하지<br />않으니 따로 기록해주세요.<br /></li>
                <li className='py-1'>사물함에 상할 수 있는 음식물이나 사물함이 <br />오염 될 수 있는 물품 보관은 자제해주세요.<br /></li>
                <li className='py-1'>대여한 사물함이 잠겨 있거나 비밀번호를 <br />분실하셨다면 프론트의 Staff 혹은 42cabi 슬랙 채널로 문의해주세요.<br /></li>
              </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" id="btn-primary" data-bs-dismiss="modal">Ok! 알았어요!</button>
          </div>
        </div>
      </div>
    </div>
  )
}
