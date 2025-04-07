import useMenu from "@/Cabinet/hooks/useMenu";
import TopNav from "@/Presentation_legacy/components/TopNav/TopNav";

const AdminTopNavContainer = () => {
  const { toggleLeftNav } = useMenu();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  return <TopNav onClickLogo={onClickLogo} isAdmin={true} />;
};

export default AdminTopNavContainer;
