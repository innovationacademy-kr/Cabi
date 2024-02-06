import { useState } from "react";
import styled from "styled-components";
import Card from "@/components/Card/Card";
import { CardContentWrapper } from "@/components/Card/CardStyles";
import ClubMemoModalContainer from "@/components/Modals/ClubModal/ClubMemoModal.container";

const ClubNoticeCard = ({ notice }: { notice: string }) => {
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const [text, setText] = useState<string>(notice);

  const openModal = () => {
    setShowMemoModal(true);
  };

  const closeModal = () => {
    setShowMemoModal(false);
  };

  return (
    <>
      <Card
        title={"동아리 메모"}
        gridArea={"clubNotice"}
        width={"350px"}
        height={"240px"}
        buttons={[
          {
            onClick: openModal,
            icon: "/src/assets/images/edit.svg",
            isClickable: true,
          },
        ]}
      >
        <>
          <CardContentWrapper>
            <ClubNoticeTextStyled>{notice}</ClubNoticeTextStyled>
          </CardContentWrapper>
        </>
      </Card>
      {showMemoModal && (
        <ClubMemoModalContainer
          onClose={() => closeModal()}
          text={text}
          setText={setText}
          clubNotice={notice}
        />
      )}
    </>
  );
};

const ClubNoticeTextStyled = styled.div`
  width: 100%;
  /* height: 100%; */
  min-height: 150px;
  font-size: 1rem;
  /* font-weight: bold; */
  padding: 0.5rem 1rem;
`;

export default ClubNoticeCard;
