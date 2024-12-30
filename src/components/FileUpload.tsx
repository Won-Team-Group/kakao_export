import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'text/plain') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className="w-full max-w-2xl mx-auto p-8 border-2 border-dashed border-gray-300 rounded-lg 
                 hover:border-blue-500 transition-colors cursor-pointer bg-white"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">
          카카오톡 채팅 파일을 드래그하거나 클릭하여 업로드하세요
        </p>
        <p className="text-sm text-gray-500">
          2024년 11월~12월 채팅 내용만 잘라서 .txt 파일로 올려주세요
        </p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                   transition-colors cursor-pointer">
          파일 선택
        </label>
      </div>
    </div>
  );
};
