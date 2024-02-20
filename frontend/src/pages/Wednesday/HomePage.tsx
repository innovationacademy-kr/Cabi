import { useNavigate } from "react-router-dom";
import RecentPresentation from "@/components/Wednesday/Home/RecentPresentation";

const HomePage = () => {
  const navigator = useNavigate();

  const presentButtonHandler = () => {
    navigator("/wed/register");
  };
  return <RecentPresentation presentButtonHandler={presentButtonHandler} />;
};

export default HomePage;
