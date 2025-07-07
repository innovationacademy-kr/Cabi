import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import CommentSection from "@/Presentation/components/CommentSection";
import {
  PresentationCategoryTypeLabelMap,
  PresentationLocationLabelMap,
  PresentationPeriodTypeNumberLabelMap,
  PresentationStatusTypeLabelMap,
} from "@/Presentation/assets/data/maps";
import type {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
  PresentationStatusType,
} from "@/Presentation/types/enum/presentation.type.enum";
import { axiosGetPresentationById } from "@/Presentation/api/axios/axios.custom";

interface IPresentationDetail {
  id: number;
  userName: string;
  category: PresentationCategoryType;
  duration: PresentationPeriodType;
  presentationLocation: PresentationLocation;
  startTime: string;
  title: string;
  summary: string;
  outline: string;
  detail: string;
  thumbnailLink: string | null;
  videoLink: string | null;
  recordingAllowed: boolean;
  publicAllowed: boolean;
  likeCount: number;
  likedByMe: boolean;
  presentationStatus: PresentationStatusType;
  editAllowed: boolean;
}

const PresentationDetailPage: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const [presentation, setPresentation] = useState<IPresentationDetail | null>(
    null
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  useEffect(() => {
    const fetchPresentation = async () => {
      if (!presentationId) return;
      try {
        const res = await axiosGetPresentationById(presentationId);
        setPresentation(res.data.data);
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };
    fetchPresentation();
  }, [presentationId]);

  if (!presentation) return <LoadingAnimation />;

  return (
    <>
      <div className="relative w-full h-auto text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              presentation.thumbnailLink ||
              "http://localhost:9000/local-cabi-bucket/presentation-thumbnail/ecc344ea-6d56-4c2b-b3f6-08c4c95e43ff_testImg.jp.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250617T064951Z&X-Amz-SignedHeaders=host&X-Amz-Credential=minio_root%2F20250617%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Expires=59940&X-Amz-Signature=559ded6f0f7fd4fe7d282bb989cf9dc4fb59303208f29d5925c8bdd3b43c8a11"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-16 z-10">
          <div className="flex flex-col md:flex-row items-start gap-10 relative">
            <img
              src={
                presentation.thumbnailLink ||
                "http://localhost:9000/local-cabi-bucket/presentation-thumbnail/ecc344ea-6d56-4c2b-b3f6-08c4c95e43ff_testImg.jp.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250617T064951Z&X-Amz-SignedHeaders=host&X-Amz-Credential=minio_root%2F20250617%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Expires=59940&X-Amz-Signature=559ded6f0f7fd4fe7d282bb989cf9dc4fb59303208f29d5925c8bdd3b43c8a11"
              }
              alt="발표 이미지"
              className="w-full md:w-[430px] rounded-lg shadow-lg aspect-video object-cover"
            />

            <div className="flex flex-col flex-1 h-full md:pt-[10px]">
              <div>
                <h1 className="text-3xl md:text-3xl font-semibold leading-snug tracking-tight">
                  {presentation.title}
                </h1>
                <p className="mt-4 text-neutral-300 text-base leading-relaxed">
                  {presentation.summary}
                </p>
              </div>
            </div>
            <div className="flex md:absolute bottom-2 md:bottom-[10px] md:ml-[470px] mt-6 md:mt-0 text-sm text-neutral-300 gap-2">
              <span>{formatDate(presentation.startTime)}</span>
              <span>|</span>
              <span>{presentation.userName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <p>
            📂 카테고리:{" "}
            {PresentationCategoryTypeLabelMap[presentation.category]}
          </p>
          <p>
            ⏱ 발표 시간:{" "}
            {PresentationPeriodTypeNumberLabelMap[presentation.duration]}분
          </p>
          <p>
            📍 장소:{" "}
            {PresentationLocationLabelMap[presentation.presentationLocation]}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-2">목차</h2>
          <p>{presentation.outline}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-2">상세 내용</h2>
          <p>{presentation.detail}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
            <div>
              <p>📽 영상 링크:</p>
              {presentation.videoLink ? (
                <a
                  href={presentation.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline break-all"
                >
                  {presentation.videoLink}
                </a>
              ) : (
                <span className="text-gray-400">없음</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-lg">👍 좋아요: {presentation.likeCount}</div>
            <div className="text-lg">
              🟢 상태:{" "}
              {PresentationStatusTypeLabelMap[presentation.presentationStatus]}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {presentationId && <CommentSection presentationId={presentationId} />}
      </div>
    </>
  );
};

export default PresentationDetailPage;
