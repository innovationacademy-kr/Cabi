import styled from "styled-components";
import LeftMainNav from "@/components/LeftNav/LeftMainNav/LeftMainNav";
import LeftSectionNav from "@/components/LeftNav/LeftSectionNav/LeftSectionNav";

const LeftNav: React.FC<{ isVisible: boolean }> = (props) => {
  return (
    <>
      <LeftNavWrapStyled id="leftNavWrap">
        <LeftMainNav></LeftMainNav>
        <LeftSectionNav isVisible={props.isVisible}></LeftSectionNav>
      </LeftNavWrapStyled>
    </>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;
