import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import SlackNotiSearchBar from "@/Cabinet/components/SlackNoti/SlackNotiSearchBar";
import {
  ISlackAlarmTemplate,
  ISlackChannel,
  SlackAlarmTemplates,
  SlackChannels,
} from "@/Cabinet/assets/data/SlackAlarm";
import {
  axiosSendSlackNotificationToChannel,
  axiosSendSlackNotificationToUser,
} from "@/Cabinet/api/axios/axios.custom";

const AdminSlackNotiPage = () => {
  const receiverInputRef = useRef<HTMLInputElement>(null);
  const msgTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [channelBtnIdx, setChannelBtnIdx] = useState<number>(-1);
  const [templateBtnIdx, setTemplateBtnIdx] = useState<number>(-1);

  const renderReceiverInput = (title: string) => {
    if (receiverInputRef.current) receiverInputRef.current.value = title;
  };

  const renderTemplateTextArea = (title: string) => {
    const template = SlackAlarmTemplates.find((template) => {
      return template.title === title;
    });
    if (msgTextAreaRef.current)
      msgTextAreaRef.current.value = template!.content;
  };

  const initializeInputandTextArea = () => {
    if (receiverInputRef.current) receiverInputRef.current.value = "";
    if (msgTextAreaRef.current) msgTextAreaRef.current.value = "";
    if (channelBtnIdx > -1) setChannelBtnIdx(-1);
    if (templateBtnIdx > -1) setTemplateBtnIdx(-1);
  };

  const handleSubmitButton = async () => {
    if (!receiverInputRef.current?.value) {
      return alert("받는이를 입력해주세요.");
    } else if (!msgTextAreaRef.current?.value) {
      return alert("메시지 내용을 입력해주세요.");
    }

    try {
      setIsLoading(true);
      if (receiverInputRef.current!.value[0] === "#") {
        let channelId = SlackChannels.find((channel) => {
          return receiverInputRef.current!.value === channel.title;
        })?.channelId;
        await axiosSendSlackNotificationToChannel(
          receiverInputRef.current.value,
          msgTextAreaRef.current!.value,
          channelId
        );
      } else {
        await axiosSendSlackNotificationToUser(
          receiverInputRef.current.value,
          msgTextAreaRef.current!.value
        );
      }
      setModalTitle("알림이 전송되었습니다");
    } catch (error: any) {
      setHasErrorOnResponse(true);
      setModalContent(error.response.data.message);
    } finally {
      setShowResponseModal(true);
      setIsLoading(false);
    }
  };

  return (
    <WrapperStyled>
      <TitleContainerStyled>
        <h1 className="title">알림</h1>
      </TitleContainerStyled>
      <ContainerStyled>
        <SubTitleStyled>자주 쓰는 채널</SubTitleStyled>
        <CapsuleWrappingStyled>
          {SlackChannels.map((channel: ISlackChannel, idx: number) => {
            return (
              <CapsuleButtonStyled
                key={idx}
                onClick={() => {
                  renderReceiverInput(channel.title);
                  if (channelBtnIdx !== idx) setChannelBtnIdx(idx);
                }}
                channelBtnIsClicked={channelBtnIdx === idx}
              >
                {channel.title}
              </CapsuleButtonStyled>
            );
          })}
        </CapsuleWrappingStyled>
      </ContainerStyled>
      <ContainerStyled>
        <SubTitleStyled>자주 쓰는 템플릿</SubTitleStyled>
        <CapsuleWrappingStyled>
          {SlackAlarmTemplates.map(
            (template: ISlackAlarmTemplate, idx: number) => {
              return (
                <CapsuleButtonStyled
                  key={idx}
                  onClick={() => {
                    renderTemplateTextArea(template.title);
                    if (channelBtnIdx !== idx) setTemplateBtnIdx(idx);
                  }}
                  templateBtnIsClicked={templateBtnIdx === idx}
                >
                  {template.title}
                </CapsuleButtonStyled>
              );
            }
          )}
        </CapsuleWrappingStyled>
      </ContainerStyled>
      <ContainerStyled>
        <SubTitleStyled>알림 보내기</SubTitleStyled>
        <FormWappingStyled>
          <FormContainerStyled>
            <FormSubTitleStyled>
              받는이(Intra ID/ Channel)<span>*</span>
            </FormSubTitleStyled>
            <SlackNotiSearchBar
              searchInput={receiverInputRef}
              renderReceiverInput={renderReceiverInput}
            />
          </FormContainerStyled>
          <FormContainerStyled>
            <FormSubTitleStyled>
              메시지 내용<span>*</span>
            </FormSubTitleStyled>
            <FormTextareaStyled ref={msgTextAreaRef} />
          </FormContainerStyled>
          <FormButtonContainerStyled>
            <FormButtonStyled onClick={initializeInputandTextArea}>
              초기화
            </FormButtonStyled>
            <FormButtonStyled
              primary={true}
              onClick={handleSubmitButton}
              disabled={isLoading}
            >
              보내기
            </FormButtonStyled>
          </FormButtonContainerStyled>
        </FormWappingStyled>
      </ContainerStyled>
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalContents={modalContent}
            closeModal={() => {
              setShowResponseModal(false);
              setHasErrorOnResponse(false);
            }}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={() => setShowResponseModal(false)}
          />
        ))}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;

const TitleContainerStyled = styled.div`
  width: 80%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--service-man-title-border-btm-color);
  margin-bottom: 70px;
  font-weight: 700;

  .title {
    font-size: 1.25rem;
    letter-spacing: -0.02rem;
    margin-bottom: 20px;
  }
`;

const ContainerStyled = styled.div`
  width: 80%;
  max-width: 1000px;
  margin-bottom: 40px;
`;

const SubTitleStyled = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const CapsuleWrappingStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const CapsuleButtonStyled = styled.span<{
  channelBtnIsClicked?: boolean;
  templateBtnIsClicked?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  background: var(--card-bg-color);
  border: 1px solid var(--capsule-btn-border-color);
  border-radius: 22px;
  cursor: pointer;

  :hover {
    background: var(--capsule-btn-hover-bg-color);
    color: var(--sys-main-color);
    border: 1px solid var(--sys-main-color);
  }

  ${({ channelBtnIsClicked, templateBtnIsClicked }) =>
    (channelBtnIsClicked || templateBtnIsClicked) &&
    css`
      background: var(--capsule-btn-hover-bg-color);
      color: var(--sys-main-color);
      border: 1px solid var(--sys-main-color);
    `}
`;

const FormWappingStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--card-bg-color);
  border-radius: 10px;
  padding: 30px 20px;
  gap: 20px;
`;

const FormContainerStyled = styled.div`
  width: 100%;
`;
const FormSubTitleStyled = styled.h3`
  font-size: 0.875rem;
  color: var(--gray-line-btn-color);
  margin-bottom: 10px;
  span {
    color: var(--expired-color);
  }
`;

const FormTextareaStyled = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;
  background-color: var(--card-content-bg-color);
  border-radius: 8px;
  border: 1px solid var(--capsule-btn-border-color);
  resize: none;
  outline: none;
  :focus {
    border: 1px solid var(--sys-main-color);
  }
  text-align: left;
  padding: 10px;
  ::placeholder {
    color: var(--line-color);
  }
`;

const FormButtonContainerStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const FormButtonStyled = styled.button<{ primary?: boolean }>`
  width: auto;
  height: auto;
  padding: 10px 16px;
  font-size: 0.875rem;
  background-color: ${(props) =>
    props.primary ? "var(--sys-main-color)" : "var(--card-content-bg-color)"};
  color: ${(props) =>
    props.primary
      ? "var(--white-text-with-bg-color)"
      : "var(--normal-text-color)"};
  font-weight: 700;
  border: 1px solid var(--capsule-btn-border-color);
  border-radius: 4px;
  cursor: pointer;
  :hover {
    opacity: 0.85;
  }
`;

export default AdminSlackNotiPage;
