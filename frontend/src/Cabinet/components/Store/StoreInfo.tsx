import styled from "styled-components";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import useMenu from "@/Cabinet/hooks/useMenu";
import StoreCoinCheckBox from "./StoreCoinCheckBox";

// mapinfo.container, mapinfo.tsx
const StoreInfo = () => {
  const { closeStore } = useMenu();
  return (
    <WrapperStyled id="storeInfo">
      <HeaderStyled>동전줍기</HeaderStyled>
      <StoreCoinCheckBox />
      <ButtonContainer
        onClick={() => openModal("memoModal")}
        text="획득하기"
        theme="fill"
      />
      <ButtonContainer onClick={() => closeStore()} text="취소" theme="line" />
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
`;
