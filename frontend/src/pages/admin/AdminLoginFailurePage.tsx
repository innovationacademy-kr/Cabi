import { useNavigate } from "react-router-dom";
import ErrorTemplate from "@/components/Error/ErrorTemplate";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorTemplate
      title="401 Unauthorized"
      subTitle="권한 승인이 필요합니다."
      content="#42seoul_club_cabinet "
      subContent="슬랙 채널에 문의하세요"
      buttonText="뒤로 가기"
      buttonHandler={() => navigate("/admin/login")}
    />
  );
};

export default NotFoundPage;
