import { ReactComponent as Like } from "@/Presentation/assets/heart.svg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

export interface IPresentation {
  id: number;
  thumbnailLink: string;
  category: string;
  isUpcoming: boolean;
  likeCount: number;
  title: string;
  startTime: string;
  userName: string;
  summary: string;
}

interface PresentationCardProps {
  presentation: IPresentation;
  onLike?: (id: number, liked: boolean) => void;
}

export const PresentationCard: React.FC<PresentationCardProps> = ({
  presentation,
  onLike,
}) => {
  const {
    id,
    thumbnailLink,
    category,
    isUpcoming,
    likeCount,
    title,
    startTime,
    userName,
    summary,
  } = presentation;

  const date = new Date(startTime);
  const dateStr = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setCount((prev) => prev + (next ? 1 : -1));
    onLike?.(id, next);
  };

  return (
    <Card
      className="
        w-[360px] flex flex-col relative group cursor-pointer
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      <div className="w-[360px] aspect-[16/9] overflow-hidden rounded-t-lg relative">
        <img
          src={thumbnailLink}
          alt={title}
          className="aspect-[9/16] object-cover w-full h-full transition-transform duration-300 ease-in-out"
        />
        <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-t from-black/60 to-black/0 z-10" />
        <div className="absolute bottom-[10px] left-[16px] flex space-x-2 z-10 ">
          <Badge className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md">
            {isUpcoming ? "발표 예정" : "발표 완료"}
          </Badge>
          <Badge className="bg-black/50 text-white font-normal px-3 py-1 leading-none text-xs shadow-md">
            {category}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-4 pb-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold leading-snug mb-1">{title}</h2>
        <p className="text-sm text-[#495057] mt-1 text-muted-foreground leading-relaxed line-clamp-4 mb-2">
          {summary}
        </p>
        <div className="mt-11 h-px bg-[#E5E5E5] mb-3" />
        <div className="flex justify-between items-center mt-auto">
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
            className="
              inline-flex flex-none w-auto items-center justify-center
              h-6 space-x-1 text-xs font-normal leading-none group
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
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
