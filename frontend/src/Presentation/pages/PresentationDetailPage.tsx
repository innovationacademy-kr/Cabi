import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import CommentSection from "@/Presentation/components/CommentSection";
import {
  PresentationCategoryTypeLabelMap,
  PresentationLocationLabelMap,
  PresentationPeriodTypeNumberLabelMap,
  PresentationStatusTypeLabelMap,
  defaultThumbnailMap,
} from "@/Presentation/assets/data/maps";
import { ReactComponent as EditIcon } from "@/Presentation/assets/edit.svg";
import { ReactComponent as LikeIcon } from "@/Presentation/assets/heart.svg";
import type {
  PresentationCategoryType,
  PresentationLocation,
  PresentationPeriodType,
} from "@/Presentation/types/enum/presentation.type.enum";
import {
  axiosDeletePresentationLike,
  axiosGetPresentationById,
  axiosPostPresentationLike,
} from "@/Presentation/api/axios/axios.custom";

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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!presentation) return;
    setLiked(presentation.likedByMe);
    setLikeCount(presentation.likeCount);
  }, [presentation]);

  useEffect(() => {
    const fetchPresentation = async () => {
      if (!presentationId) return;
      try {
        const res = await axiosGetPresentationById(presentationId);
        setPresentation(res.data.data);
      } catch (error) {
        console.error("Error fetching presentation:", error);
        // navigate("/presentations");
        window.location.href = "/presentations";
      }
    };
    fetchPresentation();
  }, [presentationId]);

  const handleLike = async () => {
    if (isLoading || !presentation) return;
    setIsLoading(true);
    try {
      if (liked) {
        const response = await axiosDeletePresentationLike(
          presentation.id.toString()
        );
        if (response.status === 200) {
          setLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      } else {
        const response = await axiosPostPresentationLike(
          presentation.id.toString()
        );
        if (response.status === 200) {
          setLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      // 에러 핸들링 필요시 추가
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!presentation)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingAnimation />
      </div>
    );

  const videoId = presentation.recordingAllowed
    ? getYouTubeVideoId(presentation.videoLink || "")
    : null;

  return (
    <>
      {/* 상단 배너 */}
      <div className="relative w-full h-auto text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              presentation.thumbnailLink ||
              defaultThumbnailMap[presentation.category]
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          {presentation.editAllowed && (
            <button
              className="w-12 h-12 absolute top-2 right-2 z-30 px-2 py-0.5"
              onClick={() => navigate(`/presentations/${presentationId}/edit`)}
              title="수정하기"
            >
              <EditIcon style={{ width: 24, height: 24 }} />
            </button>
          )}
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-16 z-10">
          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* 썸네일, Badge, 좋아요 버튼 */}
            <div className="relative w-full md:w-[430px] shrink-0">
              <img
                src={
                  presentation.thumbnailLink ||
                  defaultThumbnailMap[presentation.category]
                }
                alt="발표 이미지"
                className="w-full rounded-lg shadow-lg aspect-video object-cover"
              />
              {/* 아래쪽 블러 처리 */}
              <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-t from-black/60 to-black/0 z-10 rounded-b-lg" />
              {/* Badge (좌측 하단) */}
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
              </div>
              {/* 좋아요 버튼 (우측 하단, 짧고 컴팩트하게!) */}
              <div className="absolute bottom-[10px] right-[16px] z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  disabled={isLoading}
                  className="
      inline-flex items-center
      bg-black/50 text-white text-xs font-normal
      rounded-full shadow-md
      h-6 px-3
      transition focus:outline-none
    "
                  style={{
                    width: "auto",
                    minWidth: 0,
                    flex: "none",
                    justifyContent: "center",
                  }}
                  aria-pressed={liked}
                  aria-label={liked ? "좋아요 취소" : "좋아요"}
                >
                  <LikeIcon
                    className={`w-[14px] h-[14px] mr-1 transition-colors duration-200 ${
                      liked
                        ? "fill-[#ff6b5a] stroke-[#ff6b5a]"
                        : "fill-[#b7b7b7] stroke-[#b7b7b7]"
                    }`}
                  />
                  <span>{likeCount}</span>
                </button>
              </div>
            </div>
            {/* 오른쪽 상세 정보 영역 */}
            <div className="flex flex-col flex-1 md:pt-[10px]">
              <h1 className="text-3xl font-semibold leading-snug tracking-tight text-white">
                {presentation.title}
              </h1>
              <p className="mt-4 text-white text-base leading-relaxed">
                {presentation.summary}
              </p>
              <div className="mt-6 flex flex-col gap-2 text-base text-white">
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

      {/* 아래 상세 영역 */}
      <div className="max-w-4xl mx-auto px-6 py-10 text-base text-black">
        {videoId && (
          <div className="aspect-video w-full mt-4">
            <iframe
              className="w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500">일시</span>
            <span className="text-base text-black">
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
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500">소요시간</span>
            <span className="text-base text-black">
              {PresentationPeriodTypeNumberLabelMap[presentation.duration]}분
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500">장소</span>
            <span className="text-base text-black">
              {PresentationLocationLabelMap[presentation.presentationLocation]}
            </span>
          </div>
        </div>
        <div className="mb-10 mt-3 h-[1.5px] bg-gray-100 w-full" />

        <div className="pb-10">
          <h2 className="text-xl font-bold mb-3">목차</h2>
          <div className="whitespace-pre-line break-all">
            {presentation.outline}
          </div>
        </div>

        <div className="pb-10">
          <h2 className="text-xl font-bold mb-3">상세 내용</h2>
          <div className="whitespace-pre-line break-all">
            {presentation.detail}
          </div>
        </div>

        <div className="pb-10">
          {presentationId && (
            <CommentSection presentationId={presentationId} isAdmin={false} />
          )}
        </div>
      </div>
    </>
  );
};

export default PresentationDetailPage;
