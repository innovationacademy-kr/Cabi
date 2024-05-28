import { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import StoreCoinCheckBox from "@/Cabinet/components/Store/StoreCoinCheckBox";
import { ReactComponent as CloseIcon } from "@/Cabinet/assets/images/exitButton.svg";
import { ReactComponent as StoreCoin } from "@/Cabinet/assets/images/storeCoin.svg";
import {
  axiosCoinCheckGet,
  axiosCoinCheckPost,
} from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const StoreInfo = () => {
  // 처음 날개 열었을 때 get요청 로딩 함수
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { closeStore } = useMenu();
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [monthlyCoinCount, setmonthlyCoinCount] = useState<number>(0);
  const [todayCoinCollection, setTodayCoinCollection] =
    useState<boolean>(false);

  const tryCoinCheckGet = async () => {
    try {
      const res = await axiosCoinCheckGet();
      setTodayCoinCollection(res.data.todayCoinCollection);
      setmonthlyCoinCount(res.data.monthlyCoinCount);
    } catch (error: any) {
      throw error;
    }
  };

  const tryCoinCheckPost = async () => {
    setIsLoading(true);
    try {
      if (todayCoinCollection === true) {
        throw { data: { message: "오늘은 동전을 이미 주웠습니다" } };
      } else {
        const res = await axiosCoinCheckPost();
        setModalTitle("동전 줍기 성공");
        setModalContent(
          `<strong>${res.data.reward}까비</strong>를 획득했습니다.`
        );
        setmonthlyCoinCount(monthlyCoinCount + 1);
        setTodayCoinCollection(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setModalTitle("동전 줍기 실패");
      } else {
        setModalTitle(error.data.message || error.response.data.message);
      }
      setHasErrorOnResponse(true);
      setIsLoading(false);
    } finally {
      setShowResponseModal(true);
    }
  };

  useEffect(() => {
    if (todayCoinCollection === true) setIsLoading(true);
    tryCoinCheckGet();
  }, [todayCoinCollection]);

  return (
    <WrapperStyled id="storeInfo">
      <HeaderStyled>
        동전 줍기
        <CloseIcon
          onClick={closeStore}
          style={{ width: "24px", cursor: "pointer", marginLeft: "auto" }}
        />
      </HeaderStyled>
      <StoreIconContainer>
        <StoreCoin />
      </StoreIconContainer>
      <StoreCoinCheckBox monthlyCoinCount={monthlyCoinCount} />

      <ButtonContainerStyled>
        <ButtonContainer
          onClick={() => tryCoinCheckPost()}
          text="줍기"
          theme="fill"
          disabled={isLoading}
        />
        <ButtonContainer
          onClick={() => closeStore()}
          text="취소"
          theme="line"
        />
      </ButtonContainerStyled>
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={() => {
              setShowResponseModal(false);
              setHasErrorOnResponse(false);
            }}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={() => setShowResponseModal(false)}
          />
        ))}
    </WrapperStyled>
  );
};

export default StoreInfo;

const WrapperStyled = styled.div`
  position: fixed;
  top: 120px;
  right: 0;
  min-width: 330px;
  width: 330px;
  height: calc(100% - 120px);
  padding: 40px;
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--left-nav-border-shadow-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color);
  border-left: 1px solid var(--line-color);
  overflow-y: auto;
  border-left: 1px solid var(--line-color); ;
`;

const HeaderStyled = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  color: var(--normal-text-color);
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const ButtonContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 140px;
`;

// 확대시 꺠짐 방지 div
const StoreIconContainer = styled.div``;
