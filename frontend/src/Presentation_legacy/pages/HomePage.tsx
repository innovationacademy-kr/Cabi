import { useNavigate } from "react-router-dom";
import RecentPresentation from "@/Presentation_legacy/components/Home/RecentPresentation";

const HomePage = () => {
  const navigator = useNavigate();

  const presentButtonHandler = () => {
    navigator("/presentation/register");
  };
  return <RecentPresentation presentButtonHandler={presentButtonHandler} />;
};

export default HomePage;
