import styled from "styled-components";
import LeftMainNavContainer from "@/Presentation/components/LeftNav/LeftMainNav/LeftMainNav.container";

const LeftNav: React.FC<{
  isVisible: boolean;
  isAdmin?: boolean;
}> = ({ isAdmin, isVisible }) => {
  return (
    <LeftNavWrapStyled id="leftNavWrap">
      <LeftMainNavContainer isAdmin={isAdmin} />
      {/* <LeftSectionNavContainer isVisible={isVisible} /> */}
    </LeftNavWrapStyled>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;
