import { useNavigate } from "react-router-dom";
import AnnounceTemplate from "@/components/Announce/AnnounceTemplate";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <AnnounceTemplate
      title="404 Not Found"
      subTitle="원하시는 페이지를 찾을 수 없습니다."
      content="요청하신 페이지가 사라졌거나, "
      subContent="잘못된 경로를 이용하셨습니다 :("
      buttonText="홈으로 가기"
      buttonHandler={() => navigate("/home")}
      type="ERROR"
    />
  );
};

export default NotFoundPage;
