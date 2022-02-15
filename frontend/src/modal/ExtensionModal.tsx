import axios from 'axios'
import { useHistory } from "react-router-dom"
import "./extensionModal.css"

export default function ExtensionModal(props: any) {
	const history = useHistory();

	const handleSubmit = async () => {
    await axios.post("/api/extension").then((res:any)=>{
      if (res.status === 200){
        props.setContent('연장되었습니다!!');
      }else{
        props.setContent('다시 시도해주세요..');
      }
    }).catch((err)=>{console.log(err)});		
	}

	return (
		<div className="modal" id="extensionmodal" tabIndex={-1}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">이용 중인 사물함을 연장합니다.</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div className="modal-body">
						<p>사물함을 연장하시겠습니까?</p>
						<div id="extensionBody">연장은 최초 1회만 가능하고,</div>
						<div id="extensionBody">현재 날짜로부터 사용 기간이 7일 연장됩니다.</div>
					</div>
					<div className="modal-footer justify-content-center">
						<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
						<button type="button" className="btn btn-primary" id="btn-primary" data-bs-dismiss="modal" data-bs-target="#contentsmodal" onClick={handleSubmit}>확인</button>
					</div>
				</div>
			</div>
		</div>
	)
}
