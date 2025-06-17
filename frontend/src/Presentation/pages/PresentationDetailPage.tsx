import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosGetPresentationById } from "@/Presentation/api/axios/axios.custom";

interface IPresentationDetail {
  id: number;
  userName: string;
  category: string;
  startTime: string;
  duration: string;
  presentationLocation: string;
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
  presentationStatus: "DONE" | "UPCOMING" | "CANCELED";
  editAllowed: boolean;
}

const PresentationDetailPage: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const [presentation, setPresentation] = useState<IPresentationDetail | null>(
    null
  );

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

  if (!presentation) return <div>...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center">{presentation.title}</h1>

      <div className="text-center text-gray-600">
        <p className="text-lg font-medium">{presentation.userName}</p>
        <p className="text-sm text-gray-500">
          카테고리: {presentation.category}
        </p>
        <p className="text-sm text-gray-500">
          시작 시간: {presentation.startTime}
        </p>
        <p className="text-sm text-gray-500">
          발표 시간: {presentation.duration}
        </p>
        <p className="text-sm text-gray-500">
          장소: {presentation.presentationLocation}
        </p>
      </div>

      {presentation.thumbnailLink && (
        <div className="w-full">
          <img
            src={presentation.thumbnailLink}
            alt="Thumbnail"
            className="w-full rounded-2xl shadow-md"
          />
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">요약</h2>
        <p>{presentation.summary}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-semibold mb-2">목차</h2>
        <p>{presentation.outline}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-semibold mb-2">상세 내용</h2>
        <p>{presentation.detail}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
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
        <div>
          <p>🎞 녹화 허용:</p>
          <p>{presentation.recordingAllowed ? "예" : "아니오"}</p>
        </div>
        <div>
          <p>👥 공개 허용:</p>
          <p>{presentation.publicAllowed ? "예" : "아니오"}</p>
        </div>
        <div>
          <p>📝 수정 가능:</p>
          <p>{presentation.editAllowed ? "예" : "아니오"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-lg">👍 좋아요: {presentation.likeCount}</div>
        <div className="text-lg">
          🟢 상태: {presentation.presentationStatus}
        </div>
      </div>
    </div>
  );
};

export default PresentationDetailPage;
