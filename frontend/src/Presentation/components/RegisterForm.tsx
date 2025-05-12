import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react"; // 로딩 아이콘
import RegisterInput from "./RegisterInput";
import RegisterTextarea from "./RegisterTextarea";
import RegisterCheckbox from "./RegisterCheckbox";
import RegisterDatePicker from "./DatePicker";
import { PresentationTimeKey } from "@/Presentation_legacy/pages/RegisterPage";
import { RegisterTimeSelect, SelectForm } from "./RegisterTimeSelect";
const MAX_TITLE = 20
const MAX_CONTENT = 300

export enum ConsentType {
  // RECORDING = "agreements.recording",           // 촬영 동의
  // PUBLISHING = "agreements.publishing",         // 공개 동의
  RECORDING = "isRecordingAllowed",           // 촬영 동의
  PUBLISHING = "isPublicAllowed",         // 공개 동의
}

export enum PresentationTimeType {
  HALF = "30분",
  HOUR = "1시간",
  HOUR_HALF = "1시간 30분",
  TWO_HOUR = "2시간",
}

export interface IFormValues {
  date: Date;  // 날짜 필드 추가
  // time: string;  // 시간 필드 추가
  title: string;
  summary: string;
  outline: string;
  content: string;
  agreements: {
    recording: false,
    publishing: false,
  }
}

const contactSchema = z.object({
  date: z.date({
    required_error: "날짜를 선택해주세요",
  }),
  time: z.string({
    required_error: "시간을 입력해주세요",
  }),
  title: z.string().max(20, "제목은 20자 이하여야 합니다"),
  summary: z.string().max(20, "한 줄 요약은 20자 이하여야 합니다"),
  outline: z
    .string()
    .min(10, "목차는 10자 이상이어야 합니다")
    .max(300, "목차는 300자 이하여야 합니다"),
  content: z
    .string()
    .min(10, "내용은 10자 이상이어야 합니다")
    .max(300, "내용은 300자 이하여야 합니다"),
    agreements: z.object({
      recording: z.boolean().optional(),
      publishing: z.boolean().optional(),
      // publishing: z.boolean().refine(val => val === true, {
      //   message: "서비스 이용 약관에 동의해야 합니다."
      // })

    })
});

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      date: undefined,  // 날짜 기본값
      time: "",         // 시간 기본값
      title: "",
      summary: "",
      outline: "",
      content: "",
      agreements: {
        recording: false,
        publishing: false,
      }
    },
  });

    const [time, setTime] = useState<PresentationTimeKey>("");
  
  async function onSubmit(data :any) {
    // setIsSubmitting(true);
    console.log(data);
    
    // try {
    //   // API 호출 시뮬레이션
    //   // await new Promise(resolve => setTimeout(resolve, 1500));
    //   console.log("문의 내용:", data);
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
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col items-center space-y-6 w-full mx-auto sm:max-w-lg lg:max-w-3xl p-4 min-w-64">
      {/* <DatePickerDemo></DatePickerDemo> */}
      <div className=" w-full flex flex-col md:flex-row justify-between gap-4">
        <RegisterDatePicker
          control={form.control}
          name="date"
          title="날짜"
          ></RegisterDatePicker>
        <RegisterTimeSelect
          control={form.control}
          name="time"
          title="시간"
          />
      </div>
      {/* <RegisterDateTimeField
          control={form.control}
          /> */}
      <RegisterInput
          control={form.control}
          name="title"
          title="제목"
          maxLength={MAX_TITLE}
          placeholder="제목을 입력하세요"
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
            name="content"
            title="내용"
            maxLength={MAX_CONTENT}
            placeholder="내용을 입력하세요"
            rows={10}
        />
        <RegisterCheckbox
          control={form.control}
          title="컨텐츠 촬영 및 공개 동의"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || isSuccess}
          className="w-full py-2 text-sm sm:text-base sm:max-w-lg lg:max-w-56 "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              전송 중...
            </>
          ) : isSuccess ? (
            "전송 완료!"
          ) : (
            "문의하기"
          )}
        </Button>
      </form>
    </Form>
  );
}


export default RegisterForm;