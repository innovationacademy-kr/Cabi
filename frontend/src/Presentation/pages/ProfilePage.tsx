import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import LogTable from "@/Presentation/components/LogTable";
import { axiosMyPresentationLog } from "@/Presentation/api/axios/axios.custom";

export interface PresentationHistoryDto {
  presentationId: number;
  startTime: string;
  presentationLocation: "BASEMENT" | "FIRST" | "THIRD";
  title: string;
  presentationStatus: "DONE" | "UPCOMING" | "CANCELED";
}
export type PresentationHistoryResponseType =
  | PresentationHistoryDto[]
  | number
  | undefined;

const ProfilePage = () => {
  const [presentationLog, setPresentationLog] =
    useState<PresentationHistoryResponseType>(undefined);

  const getPresentationLog = async () => {
    try {
      const response = await axiosMyPresentationLog();
      // 실제 데이터는 response.data.data에 있음
      setTimeout(() => {
        setPresentationLog(response.data.data);
        console.log("불러오기 성공 : ", response.data.data)
      }, 500);
    } catch {
      setTimeout(() => {
        setPresentationLog(HttpStatusCode.BadRequest);
        console.log("불러오기 실패 : ")

      }, 500);
    }
  };

  useEffect(() => {
    getPresentationLog();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center py-[70px] px-0 md:py-[40px] md:px-5">
      <div className="text-center text-2xl font-bold tracking-tight mb-8">
        발표 기록
      </div>
      <div className="text-center text-lg tracking-tight mb-6 text-gray-500">
        나의 발표 기록을 확인할 수 있습니다.
      </div>
      <LogTable presentationHistory={presentationLog} />
    </div>
  );
};

export default ProfilePage;
