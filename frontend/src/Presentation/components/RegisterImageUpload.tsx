import React, { useRef, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Control, useFormContext } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegisterImageUploadProps {
  control: Control<any>;
  name: string;
  title: string;
  maxSize?: number; // MB
  accept?: string;
}

const RegisterImageUpload: React.FC<RegisterImageUploadProps> = ({ 
  control, 
  name, 
  title, 
  maxSize = 5,
  accept = "image/*"
}) => {
  const { watch, setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string>("");
  
  // 🔥 변경: 단일 파일
  const currentFile = watch(name) as File | null;

  // 🔥 변경: 단일 파일 처리
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 사용

    // 파일 검증
    if (file.size > maxSize * 1024 * 1024) {
      // toast.error(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      // toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 🔥 변경: 단일 파일 설정
    setValue(name, file);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setValue(name, null);
    setPreview("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              {!currentFile && (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
                    "hover:border-gray-400"
                  )}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFileSelect(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
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

              {/* 숨겨진 파일 입력 - multiple 제거 */}
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {preview && currentFile && (
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
                  >
                    <X className="h-3 w-3 text-black" />
                    
                  </Button>
                  
                  {/* 파일 정보 표시 */}
                  <div className="mt-2 text-sm text-gray-600 text-center">
                    <p>{currentFile.name}</p>
                    <p>{(currentFile.size / 1024 / 1024).toFixed(2)}MB</p>
                  </div>
                  
                  {/* 다시 업로드 버튼 */}
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full text-gray-400"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    다른 이미지 선택
                  </Button> */}
                </div>
              )}
            </div>
          </FormControl>
          
          {/* 🔥 변경: 상태 표시 */}
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>
              <FormMessage />
            </span>
            <span className="text-green-600">
              {currentFile ? "업로드 완료" : "파일을 선택해주세요"}
            </span>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RegisterImageUpload;