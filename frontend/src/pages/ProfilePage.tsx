import { useState } from "react";
import styled from "styled-components";
import ThemeColorContainer from "@/components/Profile/ThemeColor.container";

const ProfilePage = () => {
  const [showThemeChange, setShowThemeChange] = useState(false);
  return (
    <WrapperStyled>
      {showThemeChange && <BackgroundOverlayStyled />}
      <ItemStyeld>
        <ThemeColorContainer
          showColorPicker={showThemeChange}
          setShowColorPicker={setShowThemeChange}
        />
      </ItemStyeld>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
  @media screen and (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const BackgroundOverlayStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
`;

const ItemStyeld = styled.div`
  z-index: 1;
`;
export default ProfilePage;
