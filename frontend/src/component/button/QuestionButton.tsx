import QuestionModal from "../../modal/QuestionModal";
import styled from "@emotion/styled"
// import "./question.css"

const ICircle = styled.div`
	font-size: x-large;
`;

export default function QuestionButton() {
	return (
		<div>
			<ICircle className="bi bi-question-circle"  data-bs-toggle="modal" data-bs-target="#questionmodal" />
			<QuestionModal></QuestionModal>
		</div>
	)
}
