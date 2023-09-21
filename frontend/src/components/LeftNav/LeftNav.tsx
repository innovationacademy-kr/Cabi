import styled from "styled-components";
import LeftMainNavContainer from "@/components/LeftNav/LeftMainNav/LeftMainNav.container";
import LeftSectionNavContainer from "@/components/LeftNav/LeftSectionNav/LeftSectionNav.container";

const LeftNav: React.FC<{
  isVisible: boolean;
  isAdmin?: boolean;
  isProfile: boolean;
}> = ({ isAdmin, isVisible, isProfile }) => {
  return (
    <LeftNavWrapStyled id="leftNavWrap">
      <LeftMainNavContainer isAdmin={isAdmin} />
      <LeftSectionNavContainer isVisible={isVisible} isProfile={isProfile} />
    </LeftNavWrapStyled>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;
