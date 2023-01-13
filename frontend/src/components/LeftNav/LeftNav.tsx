import styled from "styled-components";
import LeftMainNav from "@/components/LeftNav/LeftMainNav/LeftMainNav";
import LeftSectionNav from "@/components/LeftNav/LeftSectionNav/LeftSectionNav";
import useLeftNav from "@/hooks/useLeftNav";

const LeftNav: React.FC<{ isVisible: boolean }> = (props) => {
  const { closeLeftNav } = useLeftNav();

  return (
    <>
      <LeftNavBgStyled onClick={closeLeftNav} id="leftNavBg"></LeftNavBgStyled>
      <LeftNavWrapStyled id="leftNavWrap">
        <LeftMainNav></LeftMainNav>
        <LeftSectionNav isVisible={props.isVisible}></LeftSectionNav>
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

export default LeftNav;
