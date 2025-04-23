'use client';

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface PostFormEditorProps {
  content: string;
  handleContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PostFormEditor = ({ content, handleContentChange }: PostFormEditorProps) => {
  const handleQuillChange = (value: string) => {
    handleContentChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-4 bg-fillStrong p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-labelNeutral mb-2">상세 설명</h2>
      <ReactQuill
        value={content}
        onChange={handleQuillChange}
        className="bg-fillAssistive text-labelNeutral"
      />
    </div>
  );
};

export default PostFormEditor;