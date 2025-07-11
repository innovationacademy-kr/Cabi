import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { axiosGetPresentationById } from "../api/axios/axios.custom";
import { RegisterResultDialog } from "../components/Modals/PresentationResponseModal";
import RegisterForm from "../components/RegisterForm";
import { RegisterType } from "../types/enum/presentation.type.enum";

const RegisterPage = () => {
  const { presentationId } = useParams();
  const location = useLocation();
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
    if (isEditMode && presentationId) {
      fetchPresentationData(presentationId);
    } else {
      setInitialData(null);
    }
  }, [presentationId, isEditMode]);

  const fetchPresentationData = async (presentationId: string) => {
    setLoading(true);
    try {
      const res = await axiosGetPresentationById(presentationId);
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
    <div className="w-full h-screen flex flex-col justify-start items-center bg-neutral-100 overflow-y-auto">
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
  );
};

export default RegisterPage;
