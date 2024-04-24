import AnnounceTemplate from "@/Cabinet/components/Announce/AnnounceTemplate";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <AnnounceTemplate
      title="Unfortunately"
      subTitle="You cannot access the Cabi."
      content="This site is provided "
      subContent="only to 42seoul students."
      buttonText="Go to Sign In"
      buttonHandler={() => navigate("/login")}
      type="ERORR"
    />
  );
};

export default NotFoundPage;
