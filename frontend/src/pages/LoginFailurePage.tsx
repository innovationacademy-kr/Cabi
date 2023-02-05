import { useNavigate } from "react-router-dom";
import ErrorTemplate from "@/components/Error/ErrorTemplate";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorTemplate
      title="Unfortunately"
      subTitle="You cannot access the Cabi."
      content="This site is provided "
      subContent="only to 42seoul students."
      buttonText="Go to Sign In"
      buttonHandler={() => navigate("/login")}
    />
  );
};

export default NotFoundPage;
