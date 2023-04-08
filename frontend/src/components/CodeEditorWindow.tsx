"use client";

import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = () => {
  const [value, setValue] = useState("");

  const handleEditorChange = () => {};

  return (
    <Editor
      height={`100%`}
      width={`100%`}
      language={"javascript"}
      value={value}
      theme="vs-dark"
      defaultValue="// some comment"
      options={{
        fontSize: 12,
      }}
      onChange={(value) => console.log(value)}
    />
  );
};
export default CodeEditorWindow;
