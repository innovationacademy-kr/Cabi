import './menualModal.css'

export default function MenualModal(props: any) {
  return (
    <div className="modal" id="menualmodal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">[ 42cabi 간단 사용안내서 ]</h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className='menual-body'>
            <p>
              <br />
              [이용안내]
              <br />
              - 각 cadet은 1인 당 1개의 사물함을 <br />대여할 수 있고, 대여기간 동안 자유롭게 사용할 수 있습니다.
              <br />
              <br />

              - 대여기간은 기본 30일 입니다. 기간만료 전에 <br />사물함을비우고 반납처리를 꼭 하셔야 한답니다.
              <br />
              <br />

              - 본인이 대여하신 사물함의 위치 / 번호를 꼭꼭! <br />확인하고 사용해주세요.( 대여된 번호와 다른 사물함을 사용하실 경우, 예고없이 사물함이 비워질 수 있답니다)
              <br />
              <br />

              - 비밀번호 관리/ 분실물 등의 사고가 <br />생기지 않도록,조심스럽게 사용해주세요.
              <br />
              <br />


              - 대여한 사물함이 잠겨 있다거나, 물건이 <br />남아있는 경우 등등, 이용 중 어려움이 생기셨다면, inno Front에 dm으로 문의하여 주시면 됩니다!
              <br />
              <br />
              <br />


              [사물함 이용방법]
              <br />

              - 대여한 사물함에 물건을 보관 후, <br />사용할 비밀번호 4자리를 누르시면 잠금기능이 활성화됩니다.
              <br />
              <br />

              - 물건을 찾으실 때에는, 잠글 때 <br />사용한 비밀번호를 다시 누르시기만 하면 됩니다.
              <br />
              <br />

              - 사용했던 비밀번호가 저장되지 <br />않으니, 다시 잠그실 때에는 비밀번호를 새로 입력해주세요.
              <br />
              <br />

              [서비스 목적]
              <br />

              - 본 서비스는 42seoul 의 <br />cadet분들의 원활한 사물함 이용을  위하여 제작되었습니다.
              <br />
              <br />

              - 서비스의 원활한 운용을 위해, 본 서비스는 <br />지속적으로 수정되고 확장될 수 있습니다.
              <br />
              <br />

              * 건의사항 및 문의는 https://github.com/innovationacademy-kr/42cabi/discussions 로 부탁드릴께요!
              <br />

              Written by spark
              2022.01.15
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Ok! 알았어요!</button>
          </div>
        </div>
      </div>
    </div>
  )
}