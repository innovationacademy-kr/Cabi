import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";
import React, { useState } from "react";

export interface Presentation {
  id: number;
  thumbnailLink: string;
  category: string;
  isUpcomming: boolean;
  likeCount: number;
  title: string;
  startTime: string;
  userName: string;
  summary: string;
}

interface PresentationCardProps {
  presentation: Presentation;
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
    isUpcomming,
    likeCount,
    title,
    startTime,
    userName,
    summary,
  } = presentation;

  const date = new Date(startTime);
  const dateStr = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join(".");

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setCount((prev) => prev + (next ? 1 : -1));
    onLike?.(id, next);
  };

  return (
    <Card className="w-[380px] h-[460px] flex flex-col">
      <div className="w-full h-[220px] overflow-hidden rounded-t-lg">
        <img
          src={thumbnailLink}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="pt-4 pb-2 flex-none">
        <div className="flex justify-between items-center">
          <div className="inline-flex flex-none items-center space-x-2">
            <Badge className="bg-[#5177FF] text-white font-normal px-3 py-1 leading-none text-xs">
              {category}
            </Badge>
            <Badge className="bg-[#374678] text-white font-normal px-3 py-1 leading-none text-xs">
              {isUpcomming ? "발표 예정" : "발표 완료"}
            </Badge>
          </div>
          <button
            onClick={handleLike}
            className={`
              inline-flex flex-none w-auto items-center justify-center
              h-6 px-2.5 space-x-1 text-xs font-normal leading-none
              rounded-full
              ${liked ? "bg-[#FF5050] text-white" : "bg-[#CCCCCC]"}
            `}
            aria-pressed={liked}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <Heart className="w-3 h-3" fill="white" stroke="none" />
            <span>{count}</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1 flex items-center text-xs text-[#808080]">
          <span>{dateStr}</span>
          <span
            aria-hidden="true"
            className="mx-[6px] inline-block h-3 w-px bg-[#808080]"
          />
          <span>{userName}</span>
        </p>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
