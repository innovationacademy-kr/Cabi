import styled from "styled-components";
import Button from "@/components/Common/Button";

const MAX_INPUT_LENGTH = 27;

const AddClubMemberModal: React.FC<{
  closeModal: React.MouseEventHandler;
  handleClickSave: () => void;
  newMemo: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}> = (props) => {
  return (
    <>
      <BackgroundStyled onClick={props.closeModal} />
      <ModalContainerStyled type={"confirm"}>
        <H2Styled>동아리 멤버 추가</H2Styled>
        <ContentSectionStyled>
          <ContentItemSectionStyled>
            <ContentItemWrapperStyled>
              <ContentItemTitleStyled>멤버 이름</ContentItemTitleStyled>
              <ContentItemInputStyled
                onKeyUp={(e: any) => {
                  if (e.key === "Enter") {
                    props.handleClickSave();
                  }
                }}
                ref={props.newMemo}
                maxLength={MAX_INPUT_LENGTH}
                id="input"
                autoFocus
              />
            </ContentItemWrapperStyled>
          </ContentItemSectionStyled>
        </ContentSectionStyled>
        <ButtonWrapperStyled>
          <Button
            onClick={props.handleClickSave}
            text="저장"
            theme="fill"
            disabled={props.isLoading}
          />
          <Button
            onClick={(e) => {
              props.newMemo.current!.value = "";
              props.closeModal(e);
            }}
            text="취소"
            theme="line"
          />
        </ButtonWrapperStyled>
      </ModalContainerStyled>
    </>
  );
};

const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: var(--bg-color);
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px;
`;

const H2Styled = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 30px 25px 0px;
  white-space: break-spaces;
  text-align: start;
`;

const ContentSectionStyled = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const ContentItemSectionStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentItemWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const ContentItemInputStyled = styled.input`
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  text-indent: 20px;
  font-size: 1.125rem;
  cursor: "input";
  color: "var(--normal-text-color)";
  &::placeholder {
    color: "var(--shared-gray-color-400)";
  }
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-shadow-color-100);
  z-index: 1000;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: "75px";
  @media (max-height: 745px) {
    margin-top: "68px";
  }
`;

export default AddClubMemberModal;
