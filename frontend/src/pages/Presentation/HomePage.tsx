import { useNavigate } from "react-router-dom";
import RecentPresentation from "@/components/Presentation/Home/RecentPresentation";

const HomePage = () => {
  const navigator = useNavigate();

  const presentButtonHandler = () => {
    navigator("/presentation/register");
  };
  return <RecentPresentation presentButtonHandler={presentButtonHandler} />;
};

export default HomePage;
