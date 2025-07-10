import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosGetPresentationById } from "../api/axios.custom";
import { RegisterResultDialog } from "../components/Modals/PresentationResponseModal";
import RegisterForm from "../components/RegisterForm";
import { RegisterType } from "../types/enum/presentation.type.enum";

const RegisterPage = () => {
  const { presentationId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 추가: 에러 모달 상태
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isEditMode = !!presentationId;

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
      console.log(res.data);
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
      <div className="flex flex-col items-center justify-center bg-blue-500 w-full h-64 flex-shrink-0">
        <h1 className="font-bold text-4xl text-white">
          당신의 지식이 누군가의 영감이 됩니다
        </h1>
        <p className="font-bold text-xl text-white">
          모든 지식이 소중합니다. 부담 없이 시작해보세요
        </p>
      </div>
      <div className="flex-1 w-full flex justify-center">
        <RegisterForm
          type={isEditMode ? RegisterType.EDIT : RegisterType.CREATE}
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
