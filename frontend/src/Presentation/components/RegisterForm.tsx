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
  axiosUpdateAdminPresentation,
  axiosUpdatePresentation,
} from "@/Presentation/api/axios/axios.custom";
import {
  PresentationCategoryType,
  RegisterType,
} from "../types/enum/presentation.type.enum";
import {
  RegisterConfirmDialog,
  RegisterResultDialog,
} from "./Modals/PresentationResponseModal";
import RegisterCheckboxContainer from "./RegisterCheckboxContainer";
import RegisterDatePicker from "./RegisterDatePicker";
import RegisterImageUpload from "./RegisterImageUpload";
import RegisterInput from "./RegisterInput";
import RegisterRadioGroup from "./RegisterRadioGroup";
import RegisterTextarea from "./RegisterTextarea";
import { RegisterTimeSelect } from "./RegisterTimeSelect";

const MAX_TITLE = 20;
const MAX_CONTENT = 300;

const contactSchema = z
  .object({
    mode: z.nativeEnum(RegisterType),
    slotId: z.number().optional(),
    duration: z.string().optional(),
    title: z.string().max(50, "제목은 50자 이하여야 합니다").min(1, "입력없음"),
    summary: z
      .string()
      .max(100, "한 줄 요약은 100자 이하여야 합니다")
      .min(1, "입력없음"),
    outline: z
      .string()
      .min(1, "입력없음")
      .max(500, "목차는 500자 이하여야 합니다"),
    detail: z
      .string()
      .min(1, "입력없음")
      .max(10000, "내용은 10000자 이하여야 합니다"),
    recordingAllowed: z.boolean().optional(),
    publicAllowed: z.boolean().optional(),
    category: z.nativeEnum(PresentationCategoryType),
    thumbnail: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "이미지는 5MB 이하여야 합니다",
      }),
    videoLink: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "CREATE") {
      if (!data.slotId || data.slotId < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["slotId"],
          message: "날짜를 선택해 주세요",
        });
      }
      if (!data.duration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["duration"],
          message: "발표 소요 시간을 선택하세요",
        });
      }
    }
    // EDIT 모드에서는 slotId, duration이 없어도 에러 없음
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
  const [thumbnailChanged, setThumbnailChanged] = useState(false);
  // const [thumbnailUpdated, setThumbnailUpdated] = useState(false);

  const navigate = useNavigate();
  const isCreateMode = type === RegisterType.CREATE;
  const isEditMode = type === RegisterType.EDIT;
  const isAdminMode = type === RegisterType.ADMIN;

  // 각 항목별 수정 가능 여부
  const canEdit = {
    date: isCreateMode,
    time: isCreateMode || isAdminMode,
    category: isCreateMode || isAdminMode,
    title: isCreateMode || isAdminMode,
    summary: isCreateMode || isEditMode || isAdminMode,
    outline: isCreateMode || isEditMode || isAdminMode,
    detail: isCreateMode || isEditMode || isAdminMode,
    thumbnail: isCreateMode || isEditMode || isAdminMode,
    videoLink: isAdminMode,
    recordingAllowed: isCreateMode || isAdminMode,
    publicAllowed: isCreateMode || isEditMode || isAdminMode,
  };

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      mode: isEditMode
        ? RegisterType.EDIT
        : isAdminMode
        ? RegisterType.ADMIN
        : RegisterType.CREATE,
      slotId: 0,
      duration: undefined,
      videoLink: "",
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
      setOriginalThumbnail(initialData.data.thumbnailLink);

      const editFormDefaultValues = {
        // mode: "EDIT" as const, // 타입을 명확히 지정
        mode: isEditMode ? RegisterType.EDIT : RegisterType.ADMIN, // 타입을 명확히 지정
        slotId: initialData.data.slotId ?? 0,
        duration: initialData.data.duration ?? undefined,
        videoLink: initialData.data.videoLink ?? undefined,
        title: initialData.data.title ?? "",
        summary: initialData.data.summary ?? "",
        outline: initialData.data.outline ?? "",
        detail: initialData.data.detail ?? "",
        recordingAllowed: Boolean(initialData.data.recordingAllowed),
        publicAllowed: Boolean(initialData.data.publicAllowed),
        category: initialData.data.category as PresentationCategoryType,
        thumbnail: undefined, // 파일은 초기화 불가
      };
      form.reset(editFormDefaultValues);
    } else {
      const createFormDefaultValues = {
        mode: RegisterType.CREATE,
        slotId: 0,
        duration: undefined,
        title: "",
        summary: "",
        outline: "",
        detail: "",
        recordingAllowed: false,
        publicAllowed: false,
        category: PresentationCategoryType.DEVELOP,
        thumbnail: undefined,
      };
      form.reset(createFormDefaultValues);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (form.watch("thumbnail")) {
      setThumbnailChanged(true);
    }
  }, [form.watch("thumbnail")]);

  const createFormData = (data: z.infer<typeof contactSchema>) => {
    const formData = new FormData();
    const isThumbnailChanged = thumbnailChanged || !!data?.thumbnail;
    if (isEditMode) {
      // EDIT 모드: PATCH 요청용 데이터
      const requestBody = {
        category: data.category,
        title: data.title,
        summary: data.summary,
        outline: data.outline,
        detail: data.detail,
        videoLink: data.videoLink,
        recordingAllowed: data.recordingAllowed || false,
        publicAllowed: data.publicAllowed || false,
        thumbnailUpdated: isThumbnailChanged,
        slotId: data.slotId, // ← 추가
        duration: data.duration, // ← 추가
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
        recordingAllowed: data.recordingAllowed || false,
        publicAllowed: data.publicAllowed || false,
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
        if (isAdminMode) {
          navigate(`/admin/presentations/${presentationId}`);
        } else if (isCreateMode) {
          navigate(`/presentations/profile`);
        } else {
          navigate(`/presentations/${presentationId}`);
        }
      }, 500);
    }
  };
  const onFormValidated = (data: z.infer<typeof contactSchema>) => {
    // console.log("폼 제출 데이터:", data);
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
      //EDIT
      if (!isCreateMode && presentationId) {
        // PATCH 요청용 body와 파일 분리
        const body = {
          category: formDataToSubmit.category,
          title: formDataToSubmit.title,
          summary: formDataToSubmit.summary,
          outline: formDataToSubmit.outline,
          detail: formDataToSubmit.detail,
          videoLink: isAdminMode ? formDataToSubmit.videoLink : null, // CHECK :
          // videoLink: formDataToSubmit.videoLink,
          recordingAllowed: formDataToSubmit.recordingAllowed || false,
          publicAllowed: formDataToSubmit.publicAllowed || false,
          thumbnailUpdated: thumbnailChanged || undefined,
          duration: formDataToSubmit.duration,
          slotId: 0,
        };
        const thumbnailFile: File | null = formDataToSubmit.thumbnail
          ? (formDataToSubmit.thumbnail as File)
          : null;
        if (isEditMode) {
          await axiosUpdatePresentation(presentationId, body, thumbnailFile);
        } else if (isAdminMode) {
          await axiosUpdateAdminPresentation(
            presentationId,
            body,
            thumbnailFile
          );
        }
        console.log("수정 완료");
      } else {
        // CREATE 로직
        const formData = createFormData(formDataToSubmit);
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
          className="mt-10 mb-64 flex flex-col items-center space-y-6 w-full h-full sm:max-w-lg lg:max-w-3xl p-4 min-w-64"
        >
          <div className="w-full flex flex-col md:flex-row justify-between gap-4">
            <RegisterDatePicker
              control={form.control}
              name="slotId"
              title="날짜"
              isEditMode={!canEdit.date}
              startTime={startTime}
            />
            <RegisterTimeSelect
              control={form.control}
              name="duration"
              title="소요 시간"
              isEditMode={!canEdit.time}
            />
          </div>

          <RegisterRadioGroup
            control={form.control}
            name="category"
            title="카테고리"
            isEditMode={!canEdit.category}
          />

          {canEdit.videoLink && (
            <RegisterInput
              control={form.control}
              name="videoLink"
              title="유튜브 링크"
              maxLength={200}
              placeholder="발표 영상의 유튜브 url을 입력하세요"
              isEditMode={!canEdit.videoLink}
            />
          )}

          <RegisterInput
            control={form.control}
            name="title"
            title="제목"
            maxLength={50}
            placeholder="제목을 입력하세요"
            isEditMode={!canEdit.title}
          />

          <RegisterInput
            control={form.control}
            name="summary"
            title="한 줄 요약"
            maxLength={100}
            placeholder="한 줄 요약을 입력하세요"
            isEditMode={!canEdit.summary}
          />

          <RegisterTextarea
            control={form.control}
            name="outline"
            title="목차"
            maxLength={500}
            placeholder="목차를 입력하세요"
            rows={10}
            isEditMode={!canEdit.outline}
          />

          <RegisterTextarea
            control={form.control}
            name="detail"
            title="내용"
            maxLength={10000}
            placeholder="내용을 입력하세요"
            rows={10}
            isEditMode={!canEdit.detail}
          />

          <RegisterImageUpload
            control={form.control}
            name="thumbnail"
            title="썸네일"
            maxSize={5}
            accept=".jpg,.jpeg,.png"
            currentImageUrl={originalThumbnail}
            isEditMode={!canEdit.thumbnail}
            onRemoveFile={() => {
              if (canEdit.thumbnail) {
                form.setValue("thumbnail", null, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                setThumbnailChanged(true);
              }
            }}
            onFileUpload={() => {
              if (canEdit.thumbnail) setThumbnailChanged(true);
            }}
          />

          <RegisterCheckboxContainer
            control={form.control}
            title="컨텐츠 촬영 및 공개 동의"
            subtitle={``}
            props={[
              {
                name: "recordingAllowed",
                subtitle:"💡 영상 촬영 다시보기 제공 동의 시, 촬영된 영상은 향후 서비스 이용자들을 위한 다시보기 콘텐츠로 제공됩니다.",
                description: "촬영된 영상의 다시보기 제공에 동의합니다.",
                isEdit: !canEdit.recordingAllowed,
              },
              {
                name: "publicAllowed",
                subtitle : "💡 온라인 공개 동의 시, 로그인하지 않은 사용자도 귀하의 게시물을 볼 수 있어 개인 포트폴리오나 홍보 자료로 활용하실 수 있습니다.",
                description:
                  "본 영상 및 게시물을 온라인상에 공개하는 것에 동의합니다.",
                isEdit: !canEdit.publicAllowed,
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
                {isEditMode || isAdminMode ? "수정 중..." : "제출 중..."}
              </>
            ) : isEditMode || isAdminMode ? (
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
        isEditMode={isEditMode || isAdminMode }
        // formDataToSubmit={formDataToSubmit}
        onCancel={onCancelSubmit}
        onConfirm={onConfirmSubmit}
      />

      <RegisterResultDialog
        open={showResultModal}
        onOpenChange={setShowResultModal}
        isEditMode={isEditMode || isAdminMode}
        submitSuccess={submitSuccess}
        submitError={submitError}
        onClose={onCloseResultModal}
      />
    </>
  );
};

export default RegisterForm;
