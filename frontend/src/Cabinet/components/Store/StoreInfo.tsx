import { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import StoreCoinCheckBox from "@/Cabinet/components/Store/StoreCoinCheckBox";
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
  const [modalContent, setModalContent] = useState<string>("");
  const [monthlyCoinCount, setmonthlyCoinCount] = useState<number>(0);
  const [todayCoinCollection, setTodayCoinCollection] =
    useState<boolean>(false);

  // /v5/items/coin 으로 get ->
  // 왼족 날개 열기  == /v5/items/coin 으로 GET => 성공시 현재 코인개수, 오늘 클릭할수 있는지 반환
  // 동전줍기 클릭시 == /v5/items/coin 으로 POST  => 성공시 reward 반환
  const tryCoinCheckGet = async () => {
    try {
      const res = await axiosCoinCheckGet();
      setTodayCoinCollection(res.data.todayCoinCollection);
      setmonthlyCoinCount(res.data.monthlyCoinCount);
      console.log("res Get", res);
    } catch (error) {
      throw error;
    }
  };

  const tryCoinCheckPost = async () => {
    setIsLoading(true);
    try {
      // coin 줍기 axios
      if (todayCoinCollection === true) {
        setHasErrorOnResponse(true);
      } else {
        const res = await axiosCoinCheckPost();
        console.log("coin 줍기 axios Post", res);
        setModalContent(`${res.data.reward}까비를 획득했습니다.`);
        setmonthlyCoinCount(monthlyCoinCount + 1);
        setTodayCoinCollection(false);
      }
    } catch (error) {
      setHasErrorOnResponse(true);
      throw error;
    } finally {
      setShowResponseModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 날개 열때마다 get요청 안함 -> 처음 랜더링 될때 한번에 다 불러옴
    // 그리고 post되서 성공될때마다 get요청해서 정보 최신화 시키기
    tryCoinCheckGet();
  }, [todayCoinCollection]);

  return (
    <WrapperStyled id="storeInfo">
      <HeaderStyled>동전줍기</HeaderStyled>
      <StoreCoin />
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
            modalTitle="동전 획득에 실패했습니다."
            closeModal={() => {
              setShowResponseModal(false);
              setHasErrorOnResponse(false);
            }}
          />
        ) : (
          <SuccessResponseModal
            modalTitle="동전을 획득했습니다."
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
  box-shadow: 0 0 40px 0 var(--bg-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
  overflow-y: auto;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ButtonContainerStyled = styled.div`
  width: 100%;
  max-height: 140px;
`;
