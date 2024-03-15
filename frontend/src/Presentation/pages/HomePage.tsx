import RecentPresentation from "@/Presentation/components/Home/RecentPresentation";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigator = useNavigate();

  const presentButtonHandler = () => {
    navigator("/presentation/register");
  };
  return <RecentPresentation presentButtonHandler={presentButtonHandler} />;
};

export default HomePage;
