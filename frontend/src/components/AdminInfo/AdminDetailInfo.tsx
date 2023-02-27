import { selectAdminDetailState } from "@/recoil/atoms";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

const AdminDetailInfo = ({ toggle }: { toggle: boolean }) => {
  //  const adminDetailInfo = useRecoilValue(selectAdminDetailState);

  //  console.log(adminDetailInfo);
  return <DetailInfoStyled toggle={toggle} />;
};

const DetailInfoStyled = styled.div<{ toggle: boolean }>`
  min-width: 330px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  padding: 45px 40px 20px;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-y: auto;
  display: ${({ toggle }) => (toggle ? "block" : "none")};
  z-index: 3;
`;

export default AdminDetailInfo;
