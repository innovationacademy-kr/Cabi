import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  PresentationCategoryTypeLabelMap,
  PresentationLocationLabelMap,
  PresentationPeriodTypeNumberLabelMap,
  PresentationStatusTypeLabelMap,
} from "@/Presentation/assets/data/maps";
import { ReactComponent as LikeIcon } from "@/Presentation/assets/heart.svg";
import type {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
} from "@/Presentation/types/enum/presentation.type.enum";
import { PresentationStatusType } from "@/Presentation/types/enum/presentation.type.enum";
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
  canceled: boolean;
  editAllowed: boolean;
  presentationStatus: string;
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
        console.log("Presentation Detail:", res.data.data);
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
              "https://fastly.picsum.photos/id/171/2048/1536.jpg?hmac=16eVtfmqTAEcr8VwTREQX4kV8dzZKcGWI5ouMlhRBuk"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-16 z-10">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="relative w-full md:w-[430px] shrink-0">
              <img
                src={
                  presentation.thumbnailLink ||
                  "https://fastly.picsum.photos/id/171/2048/1536.jpg?hmac=16eVtfmqTAEcr8VwTREQX4kV8dzZKcGWI5ouMlhRBuk"
                }
                alt="발표 이미지"
                className="w-full rounded-lg shadow-lg aspect-video object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-t from-black/60 to-black/0 z-10 rounded-b-lg" />
              <div className="absolute bottom-[10px] left-[16px] flex space-x-2 z-20">
                <Badge className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md">
                  {
                    PresentationStatusTypeLabelMap[
                      presentation.presentationStatus
                    ]
                  }
                </Badge>
                <Badge className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md">
                  {PresentationCategoryTypeLabelMap[presentation.category]}
                </Badge>
                <div className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md rounded-full inline-flex items-center gap-1">
                  <LikeIcon className="w-[14px] h-[14px] fill-[#b7b7b7] stroke-[#b7b7b7]" />
                  <span className="text-white text-xs">
                    {presentation.likeCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 md:pt-[10px]">
              <h1 className="text-3xl font-semibold leading-snug tracking-tight">
                {presentation.title}
              </h1>
              <p className="mt-4 text-neutral-300 text-base leading-relaxed">
                {presentation.summary}
              </p>
              <div className="mt-6 flex flex-col gap-2 text-sm text-neutral-300">
                <div className="flex gap-2 items-center">
                  <span>{formatDate(presentation.startTime)}</span>
                  <span>|</span>
                  <span>{presentation.userName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-10">
        {presentation.videoLink && (
          <div className="mt-6 space-y-2">
            {presentation.videoLink.includes("youtube.com/watch?v=") && (
              <div className="aspect-video w-full mt-4">
                <iframe
                  className="w-full h-full rounded-md"
                  src={`https://www.youtube.com/embed/${new URLSearchParams(
                    new URL(presentation.videoLink).search
                  ).get("v")}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg pb-6 shadow-sm border">
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-gray-400 mr-2">일시</span>
              <span className="font-semibold text-gray-500">
                {`${new Date(presentation.startTime).getMonth() + 1}월 ${new Date(
                  presentation.startTime
                ).getDate()}일 오후 ${new Date(
                  presentation.startTime
                ).getHours()}:${
                  new Date(presentation.startTime).getMinutes() === 0
                    ? "00"
                    : new Date(presentation.startTime).getMinutes()
                }`}
              </span>
            </div>
            <div>
              <span className="text-gray-400 mr-2">소요시간</span>
              <span className="font-semibold text-gray-500">
                {PresentationPeriodTypeNumberLabelMap[presentation.duration]}분
              </span>
            </div>
            <div>
              <span className="text-gray-400 mr-2">장소</span>
              <span className="font-semibold text-gray-500">
                {PresentationLocationLabelMap[presentation.presentationLocation]}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-2">목차</h2>
          <p>{presentation.outline}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-2">상세 내용</h2>
          <p>{presentation.detail}</p>
        </div>
      </div>
    </>
  );
};

export default PresentationDetailPage;
