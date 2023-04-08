"use client";

import React, { useState } from "react";

import Editor from "@monaco-editor/react";

interface ICodeEditorWindowProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

const CodeEditorWindow = ({ code, setCode }: ICodeEditorWindowProps) => {
  const handleEditorChange = () => {};

  return (
    <Editor
      height={`100%`}
      width={`100%`}
      language={"c"}
      value={code}
      theme="vs-dark"
      defaultValue="// some comment"
      options={{
        fontSize: 12,
      }}
      onChange={(value) => setCode(value ?? "")}
    />
  );
};
export default CodeEditorWindow;
