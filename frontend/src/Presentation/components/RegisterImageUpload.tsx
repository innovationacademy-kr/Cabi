import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Control, useFormContext, useWatch } from "react-hook-form";

interface RegisterImageUploadProps {
  control: Control<any>;
  name: string;
  title: string;
  maxSize?: number; // MB
  accept?: string;
  currentImageUrl?: string | null;
  onRemoveFile?: () => void;
  onFileUpload?: () => void;
  isEditMode?: boolean; // 추가
}

const RegisterImageUpload: React.FC<RegisterImageUploadProps> = ({
  control,
  name,
  title,
  maxSize = 5,
  accept = "image/*",
  currentImageUrl,
  onRemoveFile,
  onFileUpload,
  isEditMode = false, // 기본값 false
}) => {
  const { setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const currentFile = useWatch({ control, name }) as File | null;
  useEffect(() => {
    if (currentFile) {
      console.log("currentFile");
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
    } else if (currentImageUrl && !preview) {
      setPreview(currentImageUrl);
    } else {
      setPreview("");
    }
  }, [currentFile, currentImageUrl]);

  // 단일 파일 처리
  const handleFileSelect = (files: FileList | null) => {
    if (isEditMode) return; // 수정 불가 시 동작 막기
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 사용

    // 파일 검증
    if (file.size > maxSize * 1024 * 1024) {
      // toast.error(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      // toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    //  단일 파일 설정
    setValue(name, file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onFileUpload?.();
  };

  const removeFile = () => {
    if (isEditMode) return;
    setValue(name, null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onRemoveFile?.();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full mb-4">
          <FormLabel className="text-base text-black font-medium sm:text-lg">
            {title}
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {!currentFile && !preview && (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300",
                    "hover:border-gray-400",
                    isEditMode && "cursor-not-allowed opacity-60"
                  )}
                  onDragEnter={(e) => {
                    if (isEditMode) return;
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    if (isEditMode) return;
                    e.preventDefault();
                    setDragActive(false);
                  }}
                  onDragOver={(e) => {
                    if (isEditMode) return;
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    if (isEditMode) return;
                    e.preventDefault();
                    setDragActive(false);
                    handleFileSelect(e.dataTransfer.files);
                  }}
                  onClick={() => {
                    if (isEditMode) return;
                    fileInputRef.current?.click();
                  }}
                  style={isEditMode ? { pointerEvents: "none" } : {}}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    클릭하거나 파일을 드래그해서 업로드
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    최대 {maxSize}MB 이하
                  </p>
                </div>
              )}

              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                disabled={isEditMode}
              />

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="업로드된 이미지"
                    className="w-full max-w-xs h-48 object-cover rounded border mx-auto"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeFile}
                    disabled={isEditMode}
                  >
                    <X className="h-3 w-3 text-black" />
                  </Button>
                  {currentFile && (
                    <div className="mt-2 text-sm text-gray-600 text-center">
                      <p>{currentFile.name}</p>
                      <p>{(currentFile.size / 1024 / 1024).toFixed(2)}MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormControl>

          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>
              <FormMessage />
            </span>
            <span className="text-green-600">
              {currentFile
                ? "업로드 완료"
                : preview
                ? ""
                : "파일을 선택해주세요"}
            </span>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RegisterImageUpload;
