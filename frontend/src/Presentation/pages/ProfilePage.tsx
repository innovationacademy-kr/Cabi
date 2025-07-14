import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import PresentationCardContainer from "@/Presentation/pages/PresentationCardContainer";
import LogTable from "@/Presentation/components/LogTable";
import { IPresentation } from "@/Presentation/components/PresentationCard";
import { ReactComponent as MyPageBanner } from "@/Presentation/assets/images/myPageBanner.svg";
import {
  axiosMyLikedPresentations,
  axiosMyPresentationLog,
} from "@/Presentation/api/axios/axios.custom";

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
  const [likedPresentations, setLikedPresentations] = useState<IPresentation[]>(
    []
  );

  // 나의 발표 기록 불러오기
  useEffect(() => {
    const getPresentationLog = async () => {
      try {
        const response = await axiosMyPresentationLog();
        setPresentationLog(response.data.data);
      } catch {
        setPresentationLog(HttpStatusCode.BadRequest);
      }
    };
    getPresentationLog();
  }, []);

  // 내가 좋아요한 발표 불러오기
  useEffect(() => {
    const getLikedPresentations = async () => {
      try {
        // page: 0, size: 6 등 원하는 값으로 지정
        const response = await axiosMyLikedPresentations(0, 100);
        setLikedPresentations(response.data.content); // 명세에 맞게 content 사용
      } catch {
        setLikedPresentations([]);
      }
    };
    getLikedPresentations();
  }, []);

  return (
    <>
      <MyPageBanner className="w-full block aspect-16-3" />
      <div className="flex flex-col justify-center items-center py-[70px] px-0 md:py-[40px] md:px-5 m-6">
        <div className="text-black text-center text-2xl font-bold tracking-tight mb-8">
          발표 기록
        </div>
        {/* <div className="text-center text-lg tracking-tight mb-6 text-gray-500">
        나의 발표 기록을 확인할 수 있습니다.
      </div> */}
        <LogTable presentationHistory={presentationLog} />

        {/* 내가 좋아요한 발표 */}
        <div className="text-black text-center text-2xl font-bold tracking-tight mt-16 mb-8">
          즐겨찾는 발표
        </div>
        {likedPresentations.length === 0 ? (
          <div className="text-gray-500">좋아요를 누른 발표가 없습니다</div>
        ) : (
          <PresentationCardContainer
            presentations={likedPresentations}
            maxCols={2}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage;
