import { useState } from "react";
import styled from "styled-components";
import Card from "@/components/Card/Card";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";

const ClubMemoCard = ({ clubInfo }: { clubInfo: ClubInfoResponseDto }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [newText, setNewText] = useState<string>("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMemo = (newMemo: string | null) => {
    setNewText(newMemo ?? "");
  };

  return (
    <Card
      title="동아리 메모"
      width="350px"
      height="250px"
      gridArea="clubMemo"
      buttons={[
        {
          label: "수정",
          onClick: openModal,
          isClickable: true,
        },
      ]}
    >
      <>
        <ClubMemo>{isModalOpen ? newText : text}</ClubMemo>
      </>
    </Card>
  );
};

const ClubMemoHeader = styled.div`
  font-size: 20px;
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ClubMemo = styled.div`
  width: 300px;
  height: 150px;
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
  margin-top: 14px;
`;

const MemoIcon = styled.div`
  width: 30px;
  width: 30px;
  height: 20px;
  margin-bottom: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export default ClubMemoCard;
