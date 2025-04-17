import styled from "styled-components";
import { AGUHeaderStyled, AGUSubHeaderStyled } from "@/Cabinet/pages/AGUPage";
import { TAGUReturnPageExitEvent } from "@/Cabinet/components/AGU/AGUCabinetReturnSection.container";
import ButtonContainer from "@/Cabinet/components/Common/Button";

const AGUCabinetReturnSection = ({
  handleUserAction,
  isProcessingButtonClick,
  subHeaderMsg,
  tryReturnRequest,
  handlePageExit,
  renderReturnDetailMsg,
}: {
  handleUserAction: (key: string, callback: () => void) => void;
  isProcessingButtonClick: boolean;
  subHeaderMsg: string;
  tryReturnRequest: () => Promise<void>;
  handlePageExit: (e: TAGUReturnPageExitEvent, url?: string) => Promise<void>;
  renderReturnDetailMsg: () => JSX.Element;
}) => {
  return (
    <>
      <AGUHeaderStyled>A.G.U 사물함 반납</AGUHeaderStyled>
      <AGUSubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
      ></AGUSubHeaderStyled>
      <ReturnDetailWrapper>
        <ReturnDetailMsgStyled>{renderReturnDetailMsg()}</ReturnDetailMsgStyled>
      </ReturnDetailWrapper>
      <ButtonContainer
        onClick={() => {
          handleUserAction("aguReturn", tryReturnRequest);
        }}
        text="네, 반납할게요"
        theme="fill"
        maxWidth="500px"
        disabled={isProcessingButtonClick}
      />
      <ButtonContainer
        onClick={(e) => {
          handleUserAction("aguReturnCancel", () =>
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
