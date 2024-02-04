import { useState } from "react";
import styled from "styled-components";
import MemoModalTestContainer from "../Modals/ClubModal/ClubMemoModal.container";

const ClubMemo = ({
  openModal,
  closeModal,
  isModalOpen,
}: {
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
}) => {
  const [text, setText] = useState<string>("");
  const [newText, setNewText] = useState<string>("");

  const handleSaveMemo = (newMemo: string | null) => {
    setNewText(newMemo ?? "");
  };

  return (
    <ClubSubInfoBoxStyled>
      <ClubMemoHeaderStyled>
        동아리 메모
        <MemoIconStyled>
          <img src="/src/assets/images/more.svg" onClick={openModal}></img>
        </MemoIconStyled>
      </ClubMemoHeaderStyled>
      <ClubMemoStyled>{isModalOpen ? newText : text}</ClubMemoStyled>
      <MemoModalTestContainer
        onClose={() => closeModal()}
        isModalOpen={isModalOpen}
        text={text}
        setText={setText}
        onSave={handleSaveMemo}
      />
	  {/* {isModalOpenTest && <ModifyClubPwModal
        // password="1234"
        // isModalOpen={isModalOpen}
        // onClose={() => closeModal()}
        modalContents={testModal}
        password="1234"
        // isModalOpen={isModalOpen}
        // onClose={() => closeModal()}
      />} */}
    </ClubSubInfoBoxStyled>
  );
};

const ClubMemoStyled = styled.div`
  width: 100%;
  height: 180px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  text-align: start;
  font-size: 16px;
  line-height: 22px;
  font-size: 16px;
  line-height: 22px;
  overflow-y: auto;
  word-break: break-all;
  white-space: pre-wrap;
`;

const ClubSubInfoBoxStyled = styled.div`
  width: 380px;
  height: 285px;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const ClubMemoHeaderStyled = styled.div`
  font-size: 20px;
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MemoIconStyled = styled.div`
  width: 30px;
  width: 30px;
  height: 20px;
  margin-bottom: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const TextCountStyled = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: end;
  margin-top: 10px;
`;

export default ClubMemo;
