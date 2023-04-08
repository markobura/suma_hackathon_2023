import CodeEditorWindow from "@/components/CodeEditorWindow";

const Question = () => {
  const value = "";
  return (
    <div className="w-full">
      <div className="overlay rounded-md overflow-hidden w-1/2 h-full shadow-4xl">
        <CodeEditorWindow />
      </div>
    </div>
  );
};

export default Question;
