import styled from "styled-components";
import LeftNavContainer from "./LeftNavContainer";
import LeftNavOptionContainer from "./LeftNavOptionContainer";
import { useRecoilState } from "recoil";
import { isMobileState, toggleNavState } from "@/recoil/atoms";

const LeftNavAreaContainer = ({ style }: { style?: React.CSSProperties }) => {
  const [toggleNav, setToggleNav] = useRecoilState(toggleNavState);
  const [isMobile, setIsMobile] = useRecoilState(isMobileState);
  const clickhandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      if (toggleNav == true) {
        e.currentTarget.style.display = "none";
        document.getElementById("leftNavWrap")!.style.display = "none";
        setToggleNav(false);
      }
    }
  };

  return (
    <>
      {(!isMobile || toggleNav) && (
        <>
          <LeftNavBgStyled
            // className={isMobile ? "dfd" : "dfdf"}
            onClick={clickhandler}
            id="leftNavBg"
          ></LeftNavBgStyled>
          <LeftNavWrapStyled id="leftNavWrap">
            <LeftNavContainer></LeftNavContainer>
            <LeftNavOptionContainer style={style}></LeftNavOptionContainer>
          </LeftNavWrapStyled>
        </>
      )}
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
