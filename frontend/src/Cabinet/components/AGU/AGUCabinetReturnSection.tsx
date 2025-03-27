import { MouseEvent } from "react";
import styled from "styled-components";
import { AGUSubHeaderStyled } from "@/Cabinet/pages/AGUPage";
import ButtonContainer from "@/Cabinet/components/Common/Button";

const AGUCabinetReturnSection = ({
  handleButtonClick,
  isProcessingButtonClick,
  subHeaderMsg,
  returnDetailMsg,
  tryReturnRequest,
  handlePageExit,
}: {
  handleButtonClick: (key: string, callback: () => void) => void;
  isProcessingButtonClick: boolean;
  subHeaderMsg: string;
  returnDetailMsg: string;
  tryReturnRequest: () => Promise<void>;
  handlePageExit: (
    e: BeforeUnloadEvent | PopStateEvent | MouseEvent,
    url?: string
  ) => Promise<void>;
  // TODO : BeforeUnloadEvent | PopStateEvent | MouseEvent 타입 정의?
}) => {
  return (
    <>
      <AGUSubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
      ></AGUSubHeaderStyled>
      <ReturnDetailWrapper>
        <ReturnDetailMsgStyled
          dangerouslySetInnerHTML={{ __html: returnDetailMsg! }}
        />
      </ReturnDetailWrapper>
      <ButtonContainer
        onClick={() => {
          handleButtonClick("aguReturn", tryReturnRequest);
        }}
        text="네, 반납할게요"
        theme="fill"
        maxWidth="500px"
        disabled={isProcessingButtonClick}
      />
      <ButtonContainer
        onClick={(e) => {
          handleButtonClick("aguReturnCancel", () =>
            handlePageExit(e, "/login")
          );
        }}
        text="취소"
        theme="grayLine"
        maxWidth="500px"
        disabled={isProcessingButtonClick}
      />
    </>
  );
};

const ReturnDetailWrapper = styled.div`
  height: 100px;
  max-width: 500px;
  width: 100%;
  min-width: 290px;
  border-radius: 10px;
  border: 1px solid var(--inventory-item-title-border-btm-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 42px 0;
  width: 70%;
`;

const ReturnDetailMsgStyled = styled.div`
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 1rem;
  white-space: break-spaces;
  text-align: center;
`;

export default AGUCabinetReturnSection;
