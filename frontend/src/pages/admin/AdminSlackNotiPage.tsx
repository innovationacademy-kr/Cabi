import { useRef } from "react";
import styled from "styled-components";
import SlackNotiSearchBar from "@/components/SlackNoti/SlackNotiSearchBar";
import {
  ISlackAlarmTemplate,
  ISlackChannel,
  SlackAlarmTemplates,
  SlackChannels,
} from "@/assets/data/SlackAlarm";
import {
  axiosSendSlackNotificationToChannel,
  axiosSendSlackNotificationToUser,
} from "@/api/axios/axios.custom";

const AdminSlackNotiPage = () => {
  const receiverInputRef = useRef<HTMLInputElement>(null);
  const msgTextAreaRef = useRef<HTMLTextAreaElement>(null);

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
  };

  const submit = async () => {
    if (!receiverInputRef.current?.value) {
      return alert("받는이를 입력해주세요.");
    } else if (!msgTextAreaRef.current?.value) {
      return alert("메시지 내용을 입력해주세요.");
    }

    try {
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
    } catch (error: any) {
      alert(error.response.data.message);
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
                onClick={() => renderReceiverInput(channel.title)}
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
                  onClick={() => renderTemplateTextArea(template.title)}
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
            <FormButtonStyled primary={true} onClick={submit}>
              보내기
            </FormButtonStyled>
          </FormButtonContainerStyled>
        </FormWappingStyled>
      </ContainerStyled>
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
  border-bottom: 2px solid #d9d9d9;
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

const CapsuleButtonStyled = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  background: var(--lightgray-color);
  border: 1px solid var(--full);
  border-radius: 22px;
  cursor: pointer;

  :hover {
    background: #b08cff5f;
    color: var(--main-color);
    border: 1px solid var(--main-color);
  }
`;

const FormWappingStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* width: 80%; */
  /* max-width: 1000px; */
  background-color: var(--lightgray-color);
  border-radius: 10px;
  padding: 30px 20px;
  gap: 20px;
`;

const FormContainerStyled = styled.div`
  width: 100%;
`;
const FormSubTitleStyled = styled.h3`
  font-size: 0.875rem;
  color: var(--gray-color);
  margin-bottom: 10px;
  span {
    color: var(--expired);
  }
`;

const FormTextareaStyled = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;
  background-color: var(--white);
  border-radius: 8px;
  border: 1px solid var(--full);
  resize: none;
  outline: none;
  :focus {
    border: 1px solid var(--main-color);
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
    props.primary ? "var(--main-color)" : "var(--white)"};
  color: ${(props) => (props.primary ? "var(--white)" : "var(--black)")};
  font-weight: 700;
  border: 1px solid var(--full);
  border-radius: 4px;
  cursor: pointer;
  :hover {
    opacity: 0.85;
  }
`;

export default AdminSlackNotiPage;
