'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// טעינה דינמית של React Quill כדי למנוע שגיאות SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
});

import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "כתוב את התוכן כאן..."}
        style={{ direction: 'rtl' }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          direction: rtl;
          text-align: right;
          min-height: 200px;
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          direction: rtl;
          border-radius: 8px 8px 0 0;
        }
        .rich-text-editor .ql-container {
          border-radius: 0 0 8px 8px;
        }
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3,
        .rich-text-editor .ql-editor h4,
        .rich-text-editor .ql-editor h5,
        .rich-text-editor .ql-editor h6 {
          text-align: right;
        }
        .rich-text-editor .ql-editor p {
          text-align: right;
        }
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-right: 20px;
          padding-left: 0;
        }
      `}</style>
    </div>
  );
} 