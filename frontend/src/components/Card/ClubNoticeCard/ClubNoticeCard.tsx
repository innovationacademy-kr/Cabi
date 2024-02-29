import { useState } from "react";
import styled from "styled-components";
import Card from "@/components/Card/Card";
import { CardContentWrapper } from "@/components/Card/CardStyles";
import ClubMemoModalContainer from "@/components/Modals/ClubModal/ClubMemoModal.container";

const ClubNoticeCard = ({
  notice,
  isMaster,
}: {
  notice: string;
  isMaster: boolean;
}) => {
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const [text, setText] = useState<string>(notice);

  const openModal = () => {
    setShowMemoModal(true);
  };

  return (
    <>
      <Card
        title={"동아리 메모"}
        gridArea={"clubNotice"}
        width={"350px"}
        height={"240px"}
        buttons={
          isMaster
            ? [
                {
                  onClick: openModal,
                  icon: "/src/assets/images/edit.svg",
                  isClickable: true,
                },
              ]
            : [
                // NOTE: 이 부분은 레이아웃을 유지하기 위한 placeholder 버튼입니다.
                {
                  backgroundColor: "var(--gray-100)",
                  // light
                  onClick: () => {},
                  icon: "",
                  isClickable: false,
                },
              ]
        }
      >
        <>
          <CardContentWrapper>
            <ClubNoticeTextStyled>{notice}</ClubNoticeTextStyled>
          </CardContentWrapper>
        </>
      </Card>
      {showMemoModal && (
        <ClubMemoModalContainer
          text={text}
          setText={setText}
          clubNotice={notice}
          setShowMemoModal={setShowMemoModal}
        />
      )}
    </>
  );
};

const ClubNoticeTextStyled = styled.div`
  width: 100%;
  height: 150px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.2rem;
  overflow-y: auto;
  letter-spacing: 0.8px;

  ::-webkit-scrollbar {
    width: 20px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: 50px;
    border: 6px solid transparent;
    background-clip: padding-box;
    display: inline-block;
  }
`;

export default ClubNoticeCard;
