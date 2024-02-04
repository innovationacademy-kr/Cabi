import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Button from "@/components/Common/Button";
import { IModalContents } from "@/components/Modals/Modal";
import { ReactComponent as CheckIcon } from "@/assets/images/checkIcon.svg";
import useMultiSelect from "@/hooks/useMultiSelect";

const ModifyClubPwModal: React.FC<{
  modalContents: IModalContents;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendPassword: () => void;
}> = ({ modalContents, password, onChange, onSendPassword }) => {
  const {
    type,
    iconScaleEffect,
    title,
    detail,
    renderAdditionalComponent,
    proceedBtnText,
    onClickProceed,
    cancelBtnText,
    closeModal,
    isLoading,
    iconType,
  } = modalContents;
  const { isMultiSelect, closeMultiSelectMode } = useMultiSelect();
  const [list, setList] = useState(["", "", "", ""]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    const temp = [...password.split("")];
    for (let i = 0; i < 4 - password.length; i++) {
      temp.push("");
    }
    setList([...temp]);
    if (inputRef.current) inputRef.current.focus();
  }, [password]);

  const handleEnterPress = () => {
    // if (tryLentRequest && password.length == 4) tryLentRequest();
  };

  return (
    <>
      <BackgroundStyled
        onClick={(e) => {
          closeModal(e);
          if (isMultiSelect) {
            closeMultiSelectMode();
          }
        }}
      />
      <ModalStyled onClick={type === "noBtn" ? closeModal : undefined}>
        {iconType === "CHECK" && (
          <ModalIconImgStyled iconScaleEffect={iconScaleEffect}>
            <CheckIcon stroke="var(--main-color)" />
          </ModalIconImgStyled>
        )}
        <H2Styled>{title}</H2Styled>
        {detail && (
          <DetailStyled dangerouslySetInnerHTML={{ __html: detail }} />
        )}
        <PasswordStyled>
          {list.map((val, idx) => (
            <PasswordNumberStyled
              className={idx === 0 && val === "" ? "active" : ""}
              onClick={onClick}
              key={idx}
              val={val}
            >
              {val}
            </PasswordNumberStyled>
          ))}
        </PasswordStyled>
        <InputStyled
          ref={inputRef}
          onChange={onChange}
          maxLength={4}
          onKeyUp={(e: any) => {
            if (e.key === "Enter") {
              handleEnterPress();
            }
          }}
        />
        <ButtonWrapperStyled>
          <Button
            onClick={closeModal}
            text={cancelBtnText || "취소"}
            theme="line"
          />
          <Button
            onClick={(e) => {
              // onClickProceed!(e);
              onSendPassword();
            }}
            text={proceedBtnText || "확인"}
            theme="fill"
            disabled={password.length < 4 || isLoading}
          />
        </ButtonWrapperStyled>
      </ModalStyled>
    </>
  );
};

const InputStyled = styled.input`
  height: 0;
  color: transparent;
  caret-color: transparent;
`;

const PasswordNumberStyled = styled.div<{ val: string }>`
  width: 20%;
  height: 100%;
  border-radius: 10px;
  border: ${({ val }) =>
    val ? "2px solid var(--main-color)" : "1px solid var(--sub-color)"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: var(--main-color);
  &.active {
    border: 2px solid var(--main-color);
  }
`;

const PasswordStyled = styled.div`
  width: 240px;
  height: 60px;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalStyled = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: white;
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  animation: fadeInModal 0.5s;
  @keyframes fadeInModal {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1.5;
    }
  }
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
`;

const ModalIconImgStyled = styled.div<{ iconScaleEffect: boolean | undefined }>`
  svg {
    width: 70px;
    margin-bottom: 20px;
    animation: ${(props) =>
      props.iconScaleEffect &&
      css`
        scaleUpModalIcon 1s;
      `};
  }
  @keyframes scaleUpModalIcon {
    0% {
      transform: scale(0.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const DetailStyled = styled.p`
  margin-top: 20px;
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 300;
  white-space: break-spaces;
`;

const H2Styled = styled.h2`
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  white-space: break-spaces;
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(0, 0, 0);
  opacity: 0.4;
  animation: fadeInBg 0.5s;
  @keyframes fadeInBg {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.4;
    }
  }
  z-index: 1000;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export default ModifyClubPwModal;
