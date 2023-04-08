"use client";

import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = () => {
  const [value, setValue] = useState("");

  const handleEditorChange = () => {};

  return (
    <Editor
      height="85vh"
      width={`100%`}
      language={"javascript"}
      value={value}
      theme="vs-dark"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
};
export default CodeEditorWindow;
