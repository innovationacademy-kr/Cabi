import styled from "styled-components";
import LeftMainNavContainer from "./LeftMainNav/LeftMainNav.container";
import LeftSectionNavContainer from "./LeftSectionNav/LeftSectionNav.container";

const LeftNav: React.FC<{ isVisible: boolean }> = (props) => {
  return (
    <>
      <LeftNavWrapStyled id="leftNavWrap">
        <LeftMainNavContainer></LeftMainNavContainer>
        <LeftSectionNavContainer isVisible={props.isVisible} />
      </LeftNavWrapStyled>
    </>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;
