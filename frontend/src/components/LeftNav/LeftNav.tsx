import styled from "styled-components";
import LeftMainNavContainer from "@/components/LeftNav/LeftMainNav/LeftMainNav.container";
import LeftSectionNavContainer from "@/components/LeftNav/LeftSectionNav/LeftSectionNav.container";

const LeftNav: React.FC<{ isVisible: boolean; isAdmin?: boolean }> = ({
  isAdmin,
  isVisible,
}) => {
  return (
    <>
      <LeftNavWrapStyled id="leftNavWrap">
        <LeftMainNavContainer isAdmin={isAdmin} />
        <LeftSectionNavContainer isVisible={isVisible} />
      </LeftNavWrapStyled>
    </>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;
