import styled from "styled-components";
import LeftMainNavContainer from "@/components/LeftNav/LeftMainNav/LeftMainNav.container";
import LeftSectionNavContainer from "@/components/LeftNav/LeftSectionNav/LeftSectionNav.container";

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
