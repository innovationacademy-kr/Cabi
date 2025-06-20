import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import RegisterCheckboxContainer from "./RegisterCheckboxContainer";
import RegisterDatePicker from "./RegisterDatePicker";
import RegisterImageUpload from "./RegisterImageUpload";
// 로딩 아이콘
import RegisterInput from "./RegisterInput";
import RegisterRadioGroup from "./RegisterRadioGroup";
import RegisterTextarea from "./RegisterTextarea";
import { RegisterTimeSelect } from "./RegisterTimeSelect";
import { PresentationCategoryType, RegisterType, PresentationPeriodType } from "../types/enum/presentation.type.enum";

const MAX_TITLE = 20;
const MAX_CONTENT = 300;


const contactSchema = z.object({
  slotId: z.number({}),
  duration: z.nativeEnum(PresentationPeriodType),
  title: z.string().max(20, "제목은 20자 이하여야 합니다"),
  summary: z.string().max(20, "한 줄 요약은 20자 이하여야 합니다"),
  outline: z
    .string()
    .min(10, "목차는 10자 이상이어야 합니다")
    .max(300, "목차는 300자 이하여야 합니다"),
  detail: z
    .string()
    .min(10, "내용은 10자 이상이어야 합니다")
    .max(300, "내용은 300자 이하여야 합니다"),
  isRecordingAllowed: z.boolean().optional(),
  isPublicAllowed: z.boolean().optional(),
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
  presentationId?: string;
}
//구조분해할당으로 바로 사용
const RegisterForm = ({ type, presentationId }: RegisterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      slotId: 0,
      duration: PresentationPeriodType.HALF, // 시간 기본값
      title: "",
      summary: "",
      outline: "",
      detail: "",
      isRecordingAllowed: false,
      isPublicAllowed: false,
      category: PresentationCategoryType.DEVELOP,
    },
  });



  async function onSubmit(data: any) {
    // setIsSubmitting(true); // 전송 중 버튼 클릭 막기
    console.log(data);

    // try {
    //   // API 호출 시뮬레이션
    //   // await 
    //   setIsSuccess(true);

    //   // 성공 후 3초 후 폼 초기화
    //   setTimeout(() => {
    //     form.reset();
    //     setIsSuccess(false);
    //   }, 3000);
    // } catch (error) {
    //   console.error("오류 발생:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  }




  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-16 mb-64 flex flex-col items-center space-y-6 w-full h-full sm:max-w-lg lg:max-w-3xl p-4 min-w-64 "
      >
        <div className=" w-full flex flex-col md:flex-row justify-between gap-4">
          <RegisterDatePicker
            control={form.control}
            name="slotId"
            title="날짜"
            isEditMode={type === RegisterType.EDIT}
          />
          <RegisterTimeSelect
            control={form.control}
            name="duration"
            title="소요 시간"
            isEditMode={type === RegisterType.EDIT}
          />
        </div>
        <RegisterRadioGroup
          control={form.control}
          name="category"
          title="카테고리"
          isEditMode={type === RegisterType.EDIT}
        />
        <RegisterInput
          control={form.control}
          name="title"
          title="제목"
          maxLength={MAX_TITLE}
          placeholder="제목을 입력하세요"
          isEditMode={type === RegisterType.EDIT}
        />
        <RegisterInput
          control={form.control}
          name="summary"
          title="한 줄 요약"
          maxLength={MAX_TITLE}
          placeholder="한 줄 요약을 입력하세요"
          // isEditMode={type === RegisterType.EDIT}
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
          // multiple={true}
        />
        <RegisterCheckboxContainer
          control={form.control}
          title="컨텐츠 촬영 및 공개 동의"
          subtitle={`본 영상 촬영 서비스를 신청하시면, 촬영된 영상은 향후 서비스 이용자들을 위한 다시보기 콘텐츠로 제공됩니다.
            다음 항목에 대하여 각각의 동의 여부를 선택해주세요.`}
          props={[
            {
              name: "isRecordingAllowed",
              description: "촬영된 영상의 다시보기 제공에 동의합니다.",
              isEditMode : type === RegisterType.EDIT
            },
            {
              name: "isPublicAllowed",
              description:
                "촬영된 영상 및 관련 게시물을 본 기관(42 Seoul) 외부 플랫폼 및 채널에 공개하는 것에 동의합니다.",
            },
          ]}
        />

        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className=" bg-blue-500 w-full py-2 text-sm sm:text-base sm:max-w-lg lg:max-w-56 "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              전송 중...
            </>
          ) : isSuccess ? (
            "전송 완료!"
          ) : (
            "신청하기"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;