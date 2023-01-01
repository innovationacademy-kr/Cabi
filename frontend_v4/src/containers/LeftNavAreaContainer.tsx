import styled from "styled-components";
import LeftNavContainer from "./LeftNavContainer";
import LeftNavOptionContainer from "./LeftNavOptionContainer";
import { useRecoilState, useRecoilValue } from "recoil";
import { isMobileState, toggleNavState } from "@/recoil/atoms";

const LeftNavAreaContainer = ({ style }: { style?: React.CSSProperties }) => {
  const [toggleNav, setToggleNav] = useRecoilState(toggleNavState);
  const isMobile = useRecoilValue(isMobileState);
  const clickhandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      if (toggleNav == true) {
        document.getElementById("leftNavBg")!.classList.remove("on");
        document.getElementById("leftNavWrap")!.classList.remove("on");
        setToggleNav(false);
      }
    }
  };

  return (
    <>
      <LeftNavBgStyled
        onClick={isMobile ? clickhandler : undefined}
        id="leftNavBg"
      ></LeftNavBgStyled>
      <LeftNavWrapStyled id="leftNavWrap">
        <LeftNavContainer></LeftNavContainer>
        <LeftNavOptionContainer style={style}></LeftNavOptionContainer>
      </LeftNavWrapStyled>
    </>
  );
};

const LeftNavBgStyled = styled.div`
  display: none;
`;

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNavAreaContainer;
