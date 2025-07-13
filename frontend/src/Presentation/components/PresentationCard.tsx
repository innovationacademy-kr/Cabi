import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import {
  PresentationCategoryTypeLabelMap,
  PresentationStatusTypeLabelMap,
  defaultThumbnailMap,
} from "@/Presentation/assets/data/maps";
import { ReactComponent as Like } from "@/Presentation/assets/heart.svg";
import { PresentationCategoryType } from "@/Presentation/types/enum/presentation.type.enum";
import {
  axiosDeletePresentationLike,
  axiosPostPresentationLike,
} from "@/Presentation/api/axios/axios.custom";

export interface IPresentation {
  presentationId: number;
  thumbnailLink: string;
  category: PresentationCategoryType;
  presentationStatus: string;
  likeCount: number;
  likedByMe: boolean;
  title: string;
  startTime: string;
  userName: string;
  summary: string;
}

interface PresentationCardProps {
  presentation: IPresentation;
}

export const PresentationCard: React.FC<PresentationCardProps> = ({
  presentation,
}) => {
  const {
    presentationId,
    thumbnailLink,
    category,
    presentationStatus,
    likeCount,
    likedByMe,
    title,
    startTime,
    userName,
    summary,
  } = presentation;

  const date = new Date(startTime);
  const dateStr = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;

  const [liked, setLiked] = useState(likedByMe);
  const [count, setCount] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (liked) {
        const response = await axiosDeletePresentationLike(
          presentationId.toString()
        );
        if (response.status === 200) {
          setLiked(false);
          setCount((prev) => prev - 1);
        }
      } else {
        const response = await axiosPostPresentationLike(
          presentationId.toString()
        );
        if (response.status === 200) {
          setLiked(true);
          setCount((prev) => prev + 1);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className="
        w-[360px] h-[420px] flex flex-col relative group cursor-pointer
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-lg
        overflow-hidden rounded-lg
      "
    >
      <div className="w-[360px] h-[200px] overflow-hidden relative flex-shrink-0">
        <img
          src={thumbnailLink || defaultThumbnailMap[category]}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out"
          draggable={false}
        />
        <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-t from-black/60 to-black/0 z-10" />
        <div className="absolute bottom-[10px] left-[16px] flex space-x-2 z-10">
          <Badge className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md">
            {PresentationStatusTypeLabelMap[presentationStatus]}
          </Badge>
          <Badge className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md">
            {PresentationCategoryTypeLabelMap[category]}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col justify-between pt-4 pb-4">
        <div>
          <h2 className="text-black text-lg font-semibold leading-snug mb-1 line-clamp-2 break-all">
            {title}
          </h2>
          <p className="text-sm text-[#495057] mt-1 text-muted-foreground leading-relaxed line-clamp-3 mb-2 break-all whitespace-pre-line">
            {summary}
          </p>
        </div>
        <div>
          <div className="h-px bg-[#E5E5E5] mb-3" />
          <div className="flex justify-between items-center">
            <p className="flex items-center text-xs font-light ml-1 text-[#868E96]">
              <span>{dateStr}</span>
              <span className="mx-1">·</span>
              <span>{userName}</span>
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              disabled={isLoading}
              className="
                bg-white inline-flex flex-none w-auto items-center justify-center
                h-6 space-x-1 text-xs font-normal leading-none group p-0
              "
              aria-pressed={liked}
              aria-label={liked ? "좋아요 취소" : "좋아요"}
            >
              <Like
                className={`w-[14px] h-[14px] transition-colors duration-200 ${
                  liked
                    ? "fill-[#ff6b5a] stroke-[#ff6b5a]"
                    : "fill-[#b7b7b7] stroke-[#b7b7b7]"
                }`}
              />
              <span className="text-gray-400 text-xs">{count}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
