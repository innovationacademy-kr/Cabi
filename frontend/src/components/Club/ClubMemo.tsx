import { useState } from "react";
import styled from "styled-components";
import edit from "@/assets/images/edit.svg";
import ClubMemoModalContainer from "../Modals/ClubModal/ClubMemoModal.container";

const ClubMemo = ({
  clubId,
  clubNotice,
}: {
  clubId: number;
  clubNotice: string;
  page: number;
}) => {
  const [text, setText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ClubSubInfoBoxStyled>
      <ClubMemoHeaderStyled>
        동아리 메모
        <MemoIconStyled>
          <img src={edit} onClick={openModal} />
        </MemoIconStyled>
      </ClubMemoHeaderStyled>
      <ClubMemoStyled>{clubNotice}</ClubMemoStyled>
      {isModalOpen && (
        <ClubMemoModalContainer
          onClose={() => closeModal()}
          text={text}
          setText={setText}
          clubId={clubId}
          clubNotice={clubNotice}
        />
      )}
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
  width: 18px;
  height: 18px;
  margin-bottom: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export default ClubMemo;
