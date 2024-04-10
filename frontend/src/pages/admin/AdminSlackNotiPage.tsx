import { useRef } from "react";
import styled from "styled-components";
import AdminSlackNotiSearchBar, {
  ISlackChannel,
} from "@/components/Search/AdminSlackNotiSearch/AdminSlackNotiSearchBar";
import { SlackAlarmTemplates, SlackChannels } from "@/assets/data/SlackAlarm";
import {
  axiosSendSlackNotificationToChannel,
  axiosSendSlackNotificationToUser,
} from "@/api/axios/axios.custom";

const AdminSlackNotiPage = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const searchTextArea = useRef<HTMLTextAreaElement>(null);

  const renderReceiverInput = (title: string) => {
    if (searchInput.current) searchInput.current.value = title;
  };

  const renderTemplateTextArea = (title: string) => {
    const template = SlackAlarmTemplates.find((template) => {
      return template.title === title;
    });
    if (searchTextArea.current)
      searchTextArea.current.value = template!.content;
  };

  const initializeInputandTextArea = () => {
    if (searchInput.current) searchInput.current.value = "";
    if (searchTextArea.current) searchTextArea.current.value = "";
  };

  const submit = async () => {
    if (!searchInput.current?.value) {
      alert("받는이를 입력해주세요.");
    } else if (!searchTextArea.current?.value) {
      alert("메시지 내용을 입력해주세요.");
    } else
      try {
        if (searchInput.current!.value[0] === "#") {
          let channelId = SlackChannels.find((channel) => {
            return searchInput.current!.value === channel.title;
          })?.channelId;
          await axiosSendSlackNotificationToChannel(
            searchInput.current.value,
            searchTextArea.current!.value,
            channelId
          );
        } else {
          await axiosSendSlackNotificationToUser(
            searchInput.current.value,
            searchTextArea.current!.value
          );
        }
        // TODO : 성공적으로 보냈다는 모달?
      } catch (error: any) {
        // TODO : response modal? alert?
        // setModalTitle(error.response.data.message);
        // setModalContent(error.response.data.message);
        // setHasErrorOnResponse(true);
      }
  };

  return (
    <WrapperStyled>
      <TitleContainerStyled>
        <h1 className="title">알림</h1>
      </TitleContainerStyled>
      <ContainerStyled>
        <SubTitleStyled>자주 쓰는 채널</SubTitleStyled>
        <CapsuleWappingStyled>
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
        </CapsuleWappingStyled>
      </ContainerStyled>
      <ContainerStyled>
        <SubTitleStyled>자주 쓰는 템플릿</SubTitleStyled>
        <CapsuleWappingStyled>
          {SlackAlarmTemplates.map((template: any, idx: number) => {
            return (
              <CapsuleButtonStyled
                key={idx}
                onClick={() => renderTemplateTextArea(template.title)}
              >
                {template.title}
              </CapsuleButtonStyled>
            );
          })}
          <CapsuleButtonStyled>사물함 대여</CapsuleButtonStyled>
          {/* TODO : 사물함 대여일때 템플릿 */}
        </CapsuleWappingStyled>
      </ContainerStyled>
      <ContainerStyled>
        <SubTitleStyled>알림 보내기</SubTitleStyled>
        <FormWappingStyled>
          <FormContainerStyled>
            <FormSubTitleStyled>
              받는이(Intra ID/ Channel)<span>*</span>
            </FormSubTitleStyled>
            <AdminSlackNotiSearchBar
              searchInput={searchInput}
              renderReceiverInput={renderReceiverInput}
            />
          </FormContainerStyled>
          <FormContainerStyled>
            <FormSubTitleStyled>
              메시지 내용<span>*</span>
            </FormSubTitleStyled>
            <FormTextareaStyled ref={searchTextArea} />
          </FormContainerStyled>
          <FormButtonContainerStyled>
            <FormButtonStyled onClick={initializeInputandTextArea}>
              초기화
            </FormButtonStyled>
            <FormButtonStyled primary={true} disabled={false} onClick={submit}>
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

const CapsuleWappingStyled = styled.div`
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
  background: #f5f5f5;
  border: 1px solid #eeeeee;
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
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
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

const FormButtonStyled = styled.div<{ primary?: boolean; disabled?: boolean }>`
  padding: 10px 16px;
  font-size: 0.875rem;
  background-color: ${(props) =>
    props.primary ? "var(--main-color)" : "var(--white)"};
  color: ${(props) => (props.primary ? "var(--white)" : "var(--black)")};
  font-weight: 700;
  border: 1px solid #eee;
  border-radius: 4px;
  opacity: ${(props) => (props.disabled ? "0.3" : "1")};
  cursor: pointer;
  :hover {
    opacity: 0.85;
  }
`;
export default AdminSlackNotiPage;
