import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactComponent as CheckIcon } from "@/Cabinet/assets/images/checkIcon.svg";

interface RegisterConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  // formDataToSubmit: z.infer<typeof contactSchema> | null;
  onCancel: () => void;
  onConfirm: () => void;
}

interface RegisterResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  submitSuccess: boolean;
  submitError: string;
  onClose: () => void;
}

export const RegisterConfirmDialog: React.FC<RegisterConfirmDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="text-center p-8 bg-white flex flex-col items-center w-96">
      <DialogTitle className="text-xl font-semibold text-gray-900 mb-6">
        {isEditMode
          ? "발표 정보를 수정하시겠습니까?"
          : "발표를 신청하시겠습니까? "}
      </DialogTitle>
      <DialogDescription>
        {/* {isEditMode
          ? "발표 정보를 수정하시겠습니까? 아래 안내를 확인하세요."
          : "발표를 신청하시겠습니까? 아래 안내를 확인하세요."} */}
      </DialogDescription>

      {/* Content */}
      <div className="space-y-4 text-sm text-gray-600 mb-8">
        <p>
          발표 날짜, 소요시간, 카테고리, 제목, 다시보기 제공 동의 항목은 수정 할
          수 없습니다.
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 w-[240px]">
        <button
          onClick={onConfirm}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          {isEditMode ? "네, 수정할게요" : "네, 신청할게요"}
        </button>
        <button
          onClick={onCancel}
          className="w-full py-3 px-4 border border-blue-300 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
        >
          취소
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

export const RegisterResultDialog: React.FC<RegisterResultDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  submitSuccess,
  submitError,
  onClose,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent
      hideCloseButton
      className="text-center p-8 bg-white flex flex-col items-center w-96"
    >
      <DialogTitle className="text-xl font-semibold text-gray-900 mb-6">
        {submitSuccess ? "성공!" : "실패"}
      </DialogTitle>
      {/* Content */}
      <div className="space-y-4 text-sm text-gray-600 mb-8">
        <p className="text-lg font-medium mb-2">
          {submitSuccess
            ? isEditMode
              ? "수정되었습니다"
              : "신청되었습니다"
            : "처리에 실패했습니다"}
        </p>
        {!submitSuccess && (
          <p className="text-sm text-gray-600">{submitError}</p>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
export const RegisterDialog: React.FC<RegisterResultDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  submitSuccess,
  submitError,
  onClose,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      hideCloseButton
      className="text-center p-8 bg-white flex flex-col items-center w-96"
    >
      <DialogTitle className="text-xl font-semibold text-gray-900 mb-6 cursor-none">
        {submitSuccess ? "성공!" : "실패"}
      </DialogTitle>
      {/* Content */}
      <div className="space-y-4 text-sm text-gray-600 mb-8">
        <p className="text-lg font-medium mb-2">
          {submitSuccess
            ? isEditMode
              ? "수정되었습니다"
              : "신청되었습니다"
            : "처리에 실패했습니다"}
        </p>
        {!submitSuccess && (
          <p className="text-sm text-gray-600">{submitError}</p>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
