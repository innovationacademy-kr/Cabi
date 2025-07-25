import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { ReactComponent as RegisterBanner } from "@/Presentation/assets/images/registerBanner.svg";
import { axiosGetPresentationById } from "../api/axios/axios.custom";
import { axiosGetAdminPresentationById } from "../api/axios/axios.custom";
import { RegisterResultDialog } from "../components/Modals/PresentationResponseModal";
import RegisterForm from "../components/RegisterForm";
import { RegisterType } from "../types/enum/presentation.type.enum";


const RegisterPage = () => {
  const { presentationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 추가: 에러 모달 상태
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const isEditMode = !!presentationId;
  // admin 경로 판별
  const isAdminMode = location.pathname.includes("/admin/");
  
  useEffect(() => {
    // console.log(location.state?.from);
    const token = getCookie("access_token");
    if (!token) {
      const message =
        "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?";
      const shouldRedirect = window.confirm(message);
      if (shouldRedirect) {
        window.location.href = '/login';
      } else {
        // 이전 히스토리에 남아있는 주소 가져오기
        const previousPath = location.state?.from || '/presentations';
        // 이전 주소가 있다면 해당 주소로 이동
          window.location.href = previousPath;
      }
    }
  }, []);

  useEffect(() => {
    if (isEditMode && presentationId) {
      fetchPresentationData(presentationId);
    } else {
      setInitialData(null);
    }
    // eslint-disable-next-line
  }, [presentationId, isEditMode]);

  const fetchPresentationData = async (presentationId: string) => {
    setLoading(true);
    try {
      const res = await (isAdminMode
        ? axiosGetAdminPresentationById(presentationId)
        : axiosGetPresentationById(presentationId));
      // editAllowed == false면 수정 불가 (not admin, not owner)
      if (!res.data.data.editAllowed) {
        alert("수정 권한이 없습니다.");
        navigate("/presentations/" + presentationId);
        return;
      }
      setInitialData(res.data);
    } catch (error) {
      console.error("신청폼 불러오기 실패:", error);
      setSubmitSuccess(false);
      setSubmitError("신청 정보를 불러오지 못했습니다.");
      setShowResultModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <div className="relative w-full">
        <RegisterBanner className="w-full block aspect-16-3" />
        <div className="w-full bg-white" />
      </div>
      <div className="w-full flex flex-col justify-start items-center bg-neutral-100">
        <div className="flex-1 w-full flex justify-center">
          <RegisterForm
            type={
              isAdminMode
                ? RegisterType.ADMIN
                : isEditMode
                ? RegisterType.EDIT
                : RegisterType.CREATE
            }
            initialData={initialData}
            presentationId={presentationId}
          />
        </div>
        {/* 에러 모달 */}
        <RegisterResultDialog
          open={showResultModal}
          onOpenChange={setShowResultModal}
          isEditMode={isEditMode}
          submitSuccess={submitSuccess}
          submitError={submitError}
          onClose={() => setShowResultModal(false)}
        />
      </div>
    </>
  );
};

export default RegisterPage;
