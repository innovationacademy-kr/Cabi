import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import {
  axiosAdminDeletePresentationComment,
  axiosAdminGetPresentationComments,
  axiosAdminPatchPresentationComment,
  axiosDeletePresentationComment,
  axiosGetPresentationComments,
  axiosPatchPresentationComment,
  axiosPostPresentationComment,
} from "@/Presentation/api/axios/axios.custom";

interface IPresentationComment {
  commentId: number;
  user: string;
  detail: string;
  dateTime: string;
  mine: boolean;
  banned: boolean;
  updated: boolean;
}

interface CommentSectionProps {
  presentationId: string;
  isAdmin: boolean;
}

const CommentSection = ({ presentationId, isAdmin }: CommentSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<IPresentationComment[]>([]);
  const [input, setInput] = useState("");
  const [editingInput, setEditingInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await axiosAdminGetPresentationComments(presentationId)
        : await axiosGetPresentationComments(presentationId);
      setComments(res.data.data);
    } catch (e) {
      console.error("댓글 로딩 실패", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSubmitting(true);

    try {
      await axiosPostPresentationComment(presentationId, input);
      await fetchComments();
      setInput("");
    } catch (e) {
      console.error("댓글 등록 실패", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (commentId: number, detail: string) => {
    setEditingCommentId(commentId);
    setEditingInput(detail);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInput.trim() || editingCommentId === null) return;

    try {
      await axiosPatchPresentationComment(
        presentationId,
        editingCommentId,
        editingInput
      );
      await fetchComments();
      setEditingCommentId(null);
      setEditingInput("");
    } catch (e) {
      console.error("댓글 수정 실패", e);
    }
  };

  const handleDelete = async (commentId: number) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const originalComments = [...comments];
    setComments(originalComments.filter((c) => c.commentId !== commentId));

    try {
      await axiosDeletePresentationComment(presentationId, commentId);
    } catch (e) {
      console.error("댓글 삭제 실패", e);
      alert("댓글 삭제에 실패했습니다.");
      setComments(originalComments);
    }
  };

  const handleBan = async (commentId: number, currentBannedStatus: boolean) => {
    const confirmAction = window.confirm(
      currentBannedStatus ? "차단을 해제하시겠습니까?" : "차단하시겠습니까?"
    );
    if (!confirmAction) return;

    try {
      const res = await axiosAdminPatchPresentationComment(
        presentationId,
        commentId,
        !currentBannedStatus
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? {
                ...comment,
                banned: res.data.data.banned,
                detail: res.data.data.detail,
              }
            : comment
        )
      );
    } catch (e) {
      console.error("댓글 차단/해제 실패", e);
      alert("댓글 차단/해제에 실패했습니다.");
    }
  };

  const handleAdminDelete = async (commentId: number) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axiosAdminDeletePresentationComment(presentationId, commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (e) {
      console.error("관리자 댓글 삭제 실패", e);
      alert("관리자 댓글 삭제에 실패했습니다.");
    }
  };

  const formatToSimpleDateTime = (isoString?: string): string => {
    if (!isoString) return "날짜 없음";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "날짜 오류";

    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");

    return `${mm}.${dd} ${hh}:${mi}`;
  };

  useEffect(() => {
    fetchComments();
  }, [presentationId]);

  return (
    <div className="mt-10">
      <h3 className="font-bold mb-4 text-xl">댓글</h3>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <ul className="space-y-4 mb-6">
          {comments.map((c) => {
            const isEditing = editingCommentId === c.commentId;

            return (
              <li
                key={`${c.commentId}-${c.dateTime}`}
                className="relative flex gap-3 items-start border-b pb-3 last:border-b-0 last:pb-0"
              >
                <Avatar className="w-8 h-8 bg-gray-200 text-gray-500 text-sm font-bold flex items-center justify-center">
                  {c.user ? c.user[0] : "?"}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <span className="font-semibold">{c.user}</span>
                    <span className="text-xs text-gray-400">
                      {formatToSimpleDateTime(c.dateTime)}
                    </span>
                    {c.mine && (
                      <span className="text-xs text-blue-500">내 댓글</span>
                    )}
                    {c.banned && (
                      <span className="text-xs text-red-500">차단됨</span>
                    )}
                    {c.updated && !c.banned && (
                      <span className="text-xs text-gray-400">(수정됨)</span>
                    )}
                  </div>

                  {isEditing ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex items-start gap-2 w-full"
                    >
                      <textarea
                        value={editingInput}
                        onChange={(e) => setEditingInput(e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="flex-grow min-w-0 text-sm border border-gray-300 rounded px-3 py-2 resize-none"
                        autoFocus
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          type="submit"
                          className="w-16 h-8 text-xs bg-blue-600 text-white font-semibold rounded"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingInput("");
                          }}
                          className="w-16 h-8 text-xs bg-gray-100 mt-1 text-gray-500 border border-gray-300 rounded"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-sm whitespace-pre-line break-all">
                      {c.banned ? "관리자에 의해 삭제된 댓글입니다" : c.detail}
                    </div>
                  )}
                </div>

                {c.mine && !isEditing && !c.banned && !isAdmin && (
                  <div className="absolute top-0 right-0 text-xs text-gray-400 space-x-2">
                    <span
                      onClick={() => handleEdit(c.commentId, c.detail)}
                      className="cursor-pointer hover:underline"
                    >
                      수정
                    </span>
                    <span
                      onClick={() => handleDelete(c.commentId)}
                      className="cursor-pointer hover:underline"
                    >
                      삭제
                    </span>
                  </div>
                )}

                {isAdmin && !isEditing && (
                  <div className="absolute top-0 right-0 text-xs text-gray-400 space-x-2">
                    <span
                      onClick={() => handleBan(c.commentId, c.banned)}
                      className="cursor-pointer hover:underline"
                    >
                      {c.banned ? "차단 해제" : "차단"}
                    </span>
                    <span
                      onClick={() => handleAdminDelete(c.commentId)}
                      className="cursor-pointer hover:underline"
                    >
                      삭제
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!isAdmin && (
        <form onSubmit={handleSubmit} className="flex items-start gap-2 mt-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            disabled={submitting}
            rows={3}
            maxLength={500}
            className="flex-grow min-w-0 text-sm border border-gray-300 bg-white px-3 py-2 rounded resize-none shadow-sm disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="w-16 h-8 text-xs bg-blue-500 text-white font-semibold rounded disabled:bg-blue-200"
          >
            {submitting ? "등록중..." : "등록"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
