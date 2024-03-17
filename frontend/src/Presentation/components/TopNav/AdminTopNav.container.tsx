import React, { SetStateAction } from "react";
import useMenu from "@/Cabinet/hooks/useMenu";
import TopNav from "@/Presentation/components/TopNav/TopNav";

const AdminTopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const { toggleLeftNav } = useMenu();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  return <TopNav onClickLogo={onClickLogo} isAdmin={true} />;
};

export default AdminTopNavContainer;
