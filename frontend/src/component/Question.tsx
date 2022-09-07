// QuestionButton.tsx로 사용 중

import QuestionModal from "../modal/QuestionModal";
import "./question.css"
export default function Question() {
	return (
		<div>
			<i className="bi bi-question-circle"  data-bs-toggle="modal" data-bs-target="#questionmodal"></i>
			<QuestionModal></QuestionModal>
		</div>
	)
}
