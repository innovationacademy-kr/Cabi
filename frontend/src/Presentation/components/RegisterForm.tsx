import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import {
  axiosCreatePresentation,
  axiosUpdatePresentation,
} from "../api/axios.custom";
import {
  PresentationCategoryType,
  PresentationPeriodType,
  RegisterType,
} from "../types/enum/presentation.type.enum";
import {
  RegisterConfirmDialog,
  RegisterResultDialog,
} from "./Modals/RegisterModal/PresentationResponseModal";
import RegisterCheckboxContainer from "./RegisterCheckboxContainer";
import RegisterDatePicker from "./RegisterDatePicker";
import RegisterImageUpload from "./RegisterImageUpload";
import RegisterInput from "./RegisterInput";
import RegisterRadioGroup from "./RegisterRadioGroup";
import RegisterTextarea from "./RegisterTextarea";
import { RegisterTimeSelect } from "./RegisterTimeSelect";

const MAX_TITLE = 20;
const MAX_CONTENT = 300;

const contactSchema = z.object({
  slotId: z.number({}).min(1, "날짜를 선택해 주세요"),
  duration: z.nativeEnum(PresentationPeriodType),
  title: z.string().max(50, "제목은 50자 이하여야 합니다").min(1, "입력해"),
  summary: z
    .string()
    .max(100, "한 줄 요약은 100자 이하여야 합니다")
    .min(1, "입력해"),
  outline: z.string().min(1, "입력해").max(500, "목차는 500자 이하여야 합니다"),
  detail: z
    .string()
    .min(1, "입력해")
    .max(10000, "내용은 10000자 이하여야 합니다"),
  recordingAllowed: z.boolean().optional(),
  publicAllowed: z.boolean().optional(),
  category: z.nativeEnum(PresentationCategoryType),
  thumbnail: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "이미지는 5MB 이하여야 합니다",
    }),
});

interface RegisterFormProps {
  type: RegisterType;
  initialData?: any;
  presentationId?: string; // EDIT 모드일 때 필요
}

const RegisterForm = ({
  type,
  initialData,
  presentationId,
}: RegisterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [formDataToSubmit, setFormDataToSubmit] = useState<z.infer<
    typeof contactSchema
  > | null>(null);
  const [startTime, setStartTime] = useState("");
  const [originalThumbnail, setOriginalThumbnail] = useState<string | null>(
    null
  );

  const navigate = useNavigate();
  const isEditMode = type === RegisterType.EDIT;

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      slotId: 0,
      duration: PresentationPeriodType.HALF,
      title: "",
      summary: "",
      outline: "",
      detail: "",
      recordingAllowed: false,
      publicAllowed: false,
      category: PresentationCategoryType.DEVELOP,
    },
  });

  useEffect(() => {
    if (initialData?.data) {
      setStartTime(initialData.data.startTime);
      setOriginalThumbnail(initialData.data.thumbnailUrl);

      const editFormDefaultValues = {
        slotId: initialData.data.slotId || 0,
        duration: initialData.data.duration,
        title: initialData.data.title,
        summary: initialData.data.summary,
        outline: initialData.data.outline,
        detail: initialData.data.detail,
        recordingAllowed: initialData.data.recordingAllowed,
        publicAllowed: initialData.data.publicAllowed,
        category: initialData.data.category,
        thumbnail: undefined, // 파일은 초기화 불가
      };
      form.reset(editFormDefaultValues);
    } else {
      const createFormDefaultValues = {
        slotId: 0,
        duration: PresentationPeriodType.HALF,
        title: "",
        summary: "",
        outline: "",
        detail: "",
        recordingAllowed: false,
        publicAllowed: false,
        category: PresentationCategoryType.DEVELOP,
      };
      form.reset(createFormDefaultValues);
    }
  }, [initialData, form]);

  const createFormData = (data: z.infer<typeof contactSchema>) => {
    const formData = new FormData();

    if (isEditMode) {
      // EDIT 모드: PATCH 요청용 데이터
      const requestBody = {
        category: data.category,
        title: data.title,
        summary: data.summary,
        outline: data.outline,
        detail: data.detail,
        videoLink: null, // 현재는 null로 처리
        isRecordingAllowed: data.recordingAllowed || false,
        isPublicAllowed: data.publicAllowed || false,
        thumbnailUpdated: !!data.thumbnail, // 썸네일 변경 여부
      };

      formData.append(
        "form",
        new Blob([JSON.stringify(requestBody)], {
          type: "application/json",
        })
      );

      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
    } else {
      // CREATE 모드: POST 요청용 데이터
      const requestBody = {
        duration: data.duration,
        category: data.category,
        title: data.title,
        summary: data.summary,
        outline: data.outline,
        detail: data.detail,
        isRecordingAllowed: data.recordingAllowed || false,
        isPublicAllowed: data.publicAllowed || false,
        slotId: data.slotId,
      };

      formData.append(
        "form",
        new Blob([JSON.stringify(requestBody)], {
          type: "application/json",
        })
      );

      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
    }

    return formData;
  };

  const onCloseResultModal = () => {
    setShowResultModal(false);

    if (submitSuccess) {
      // 성공했을 때만 페이지 이동
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/presentations/${presentationId}`);
        } else {
          navigate("/presentations/home");
        }
      }, 500);
    }
  };
  const onFormValidated = (data: z.infer<typeof contactSchema>) => {
    setFormDataToSubmit(data);
    setShowConfirmModal(true);
  };

  // 모달 취소
  const onCancelSubmit = () => {
    setShowConfirmModal(false);
    setFormDataToSubmit(null);
  };

  // API 호출
  const onConfirmSubmit = async () => {
    if (!formDataToSubmit) return;

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const formData = createFormData(formDataToSubmit);

      if (isEditMode && presentationId) {
        await axiosUpdatePresentation(presentationId, formData);
        console.log("수정 완료");
      } else {
        await axiosCreatePresentation(formData);
        console.log("생성 완료");
      }

      setSubmitSuccess(true);
      setSubmitError("");
      setShowResultModal(true);
    } catch (error: any) {
      console.error("제출 실패:", error);
      setSubmitSuccess(false);
      setSubmitError(
        error.response?.data?.message || "알 수 없는 오류가 발생했습니다."
      );
      setShowResultModal(true);
    } finally {
      setIsSubmitting(false);
      setFormDataToSubmit(null);
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onFormValidated)}
          className="mt-16 mb-64 flex flex-col items-center space-y-6 w-full h-full sm:max-w-lg lg:max-w-3xl p-4 min-w-64"
        >
          <div className="w-full flex flex-col md:flex-row justify-between gap-4">
            <RegisterDatePicker
              control={form.control}
              name="slotId"
              title="날짜"
              isEditMode={isEditMode}
              startTime={startTime}
            />
            <RegisterTimeSelect
              control={form.control}
              name="duration"
              title="소요 시간"
              isEditMode={isEditMode}
            />
          </div>

          <RegisterRadioGroup
            control={form.control}
            name="category"
            title="카테고리"
            isEditMode={isEditMode}
          />

          <RegisterInput
            control={form.control}
            name="title"
            title="제목"
            maxLength={MAX_TITLE}
            placeholder="제목을 입력하세요"
            isEditMode={isEditMode}
          />

          <RegisterInput
            control={form.control}
            name="summary"
            title="한 줄 요약"
            maxLength={MAX_TITLE}
            placeholder="한 줄 요약을 입력하세요"
          />

          <RegisterTextarea
            control={form.control}
            name="outline"
            title="목차"
            maxLength={MAX_CONTENT}
            placeholder="목차를 입력하세요"
            rows={10}
          />

          <RegisterTextarea
            control={form.control}
            name="detail"
            title="내용"
            maxLength={MAX_CONTENT}
            placeholder="내용을 입력하세요"
            rows={10}
          />

          <RegisterImageUpload
            control={form.control}
            name="thumbnail"
            title="썸네일"
            maxSize={5}
            accept=".jpg,.jpeg,.png"
            // currentImageUrl={originalThumbnail} // 기존 이미지 표시용
          />

          <RegisterCheckboxContainer
            control={form.control}
            title="컨텐츠 촬영 및 공개 동의"
            subtitle={`본 영상 촬영 서비스를 신청하시면, 촬영된 영상은 향후 서비스 이용자들을 위한 다시보기 콘텐츠로 제공됩니다.
            다음 항목에 대하여 각각의 동의 여부를 선택해주세요.`}
            props={[
              {
                name: "recordingAllowed",
                description: "촬영된 영상의 다시보기 제공에 동의합니다.",
              },
              {
                name: "publicAllowed",
                description:
                  "촬영된 영상 및 관련 게시물을 본 기관(42 Seoul) 외부 플랫폼 및 채널에 공개하는 것에 동의합니다.",
              },
            ]}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 w-full py-2 text-sm sm:text-base sm:max-w-lg lg:max-w-56"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "수정 중..." : "제출 중..."}
              </>
            ) : isEditMode ? (
              "수정하기"
            ) : (
              "신청하기"
            )}
          </Button>
        </form>
      </FormProvider>

      <RegisterConfirmDialog
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        isEditMode={isEditMode}
        // formDataToSubmit={formDataToSubmit}
        onCancel={onCancelSubmit}
        onConfirm={onConfirmSubmit}
      />

      <RegisterResultDialog
        open={showResultModal}
        onOpenChange={setShowResultModal}
        isEditMode={isEditMode}
        submitSuccess={submitSuccess}
        submitError={submitError}
        onClose={onCloseResultModal}
      />
    </>
  );
};

export default RegisterForm;
