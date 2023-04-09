"use client";

import CodeEditorWindow from "@/components/CodeEditorWindow";
import { BACKEND_URL } from "@/constants/api";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { twMerge } from "tailwind-merge";
import { BiArrowBack } from "react-icons/bi";

const Question = () => {
  const pathname = usePathname();
  const questionId = pathname.split("/").at(-1);
  const [openTab, setOpenTab] = React.useState<"problem" | "test">("problem");
  const [questionTitle, setQuestionTitle] = React.useState("");
  const [questionText, setQuestionText] = React.useState("");

  const [execution, setExecution] = React.useState<"Compilation error" | "Failure" | "Success">("Compilation error");
  const [hints, setHints] = React.useState<string[]>([]);
  const [hintsDisplayed, setHintsDisplayed] = React.useState<number>(0);
  const [tested, setTested] = React.useState<boolean>(false);

  const [code, setCode] = React.useState("");

  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState<{ text: string; color: string }>();

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    axios.post(`${BACKEND_URL}courses/questions/${questionId}/`).then((res) => {
      setQuestionText(res.data.text);
      setQuestionTitle(res.data.name);
    });
  }, []);

  const onSubmitCode = async () => {
    axios
      .post<{
        output: string;
        state: "Compiling error" | "Runtime error" | "Executed";
      }>(`${BACKEND_URL}code/check_c/`, {
        program: code,
        input,
      })
      .then((res) => {
        if (res.data.state !== "Executed") setOutput({ text: res.data.output, color: "text-red-500" });
        else setOutput({ text: res.data.output, color: "" });
      })
      .catch((err) => {
        setOutput(err.response.data.error);
      });
  };

  return (
    <div className="w-full h-full flex">
      <div className="overlay rounded-md overflow-hidden w-1/2 h-full shadow-4xl">
        <div className="h-4/6">
          <CodeEditorWindow code={code} setCode={setCode} />
        </div>
        <div className="flex gap-4 items-center mt-2">
          <textarea
            id="message"
            rows={4}
            className="block p-2.5 text-sm placeholder-textPrimary/40 w-1/2 text-textPrimary bg-primary rounded-lg border border-gray-600 resize-none"
            placeholder="Write your input here..."
            onChange={(e) => {
              setInput(e.currentTarget.value);
            }}
          />
          <textarea
            id="message"
            disabled
            rows={4}
            className={twMerge(
              "block p-2.5 text-sm w-1/2 placeholder-stone-600 text-textPrimary bg-primary rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none",
              output?.color
            )}
            placeholder="Output"
            value={output?.text}
          />
        </div>
        <div className="flex flex-row justify-center items-center mt-2">
          <button
            className="bg-orange-400 h-1/2 hover:bg-orange-500 text-white w-full font-bold py-2 px-4 rounded"
            onClick={onSubmitCode}
          >
            Compile and Execute
          </button>
        </div>
      </div>

      <div className="w-1/2 h-full">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center">
            {/* <ul className="flex space-x-2">
              <li>
                <a
                  href="#"
                  onClick={() => setOpenTab("problem")}
                  className="inline-block px-4 py-2 text-gray-600 bg-white rounded shadow"
                >
                  Problem
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setOpenTab("test")}
                  className="inline-block px-4 py-2 text-gray-600 bg-white rounded shadow"
                >
                  Test
                </a>
              </li>
            </ul> */}
            <div className="px-3 w-full">
              <div className={openTab === "problem" ? "block" : "hidden"}>
                <p className="py-2 bg-stone-100 text-2xl font-bold border border-primary text-center">
                  {questionTitle}
                </p>
                <div className="overflow-auto h-[489px] mb-2 border border-primary bg-secondary">
                  <ReactMarkdown className="markdown w-full   p-2">{questionText}</ReactMarkdown>
                </div>
                <button
                  className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded"
                  onClick={() => setOpenTab("test")}
                >
                  TEST
                </button>
              </div>
              <div className={openTab === "test" ? "block" : "hidden"}>
                <div
                  className="flex gap-2 items-center cursor-pointer w-fit border-b border-b-stone-500 mb-4 px-2"
                  onClick={() => setOpenTab("problem")}
                >
                  <BiArrowBack /> <span>Go Back</span>
                </div>
                <div className={tested ? "block" : "hidden"}>
                  <div className={execution === "Compilation error" ? "block" : "hidden"}>
                    <div className="py-3 px-2 rounded bg-red-500">
                      <p className="text-white">
                        There is a compilation error in your code, do you need help finding it?
                      </p>
                    </div>
                  </div>
                  <div className={execution === "Failure" ? "block" : "hidden"}>
                    <div className="py-3 px-2 rounded  bg-yellow-500">
                      <p className="text-black">Your solution isn't correct, would you like a hint?</p>
                    </div>
                  </div>
                  <div className={execution === "Success" ? "block" : "hidden"}>
                    <div className="py-3 px-2 rounded bg-green-500">
                      <p className="text-white">Your solution is correct! Do you think there's a way to optimize it?</p>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2 mt-5 mb-5">
                    {hints.slice(0, hintsDisplayed).map((hint, i) => (
                      <div className="w-full rounded bg-blue-300" key={i}>
                        <p className="text-white font-semibold p-2">{hint}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    className={
                      hintsDisplayed < hints.length || hints.length === 0 ? "mt-4 flex justify-center" : "hidden"
                    }
                  >
                    <button
                      disabled={loading}
                      className={twMerge(
                        "bg-blue-500 h-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52 flex items-center justify-center",
                        loading && "opacity-40 pointer-events-none"
                      )}
                      onClick={async () => {
                        setLoading(true);
                        if (hints.length === 0) {
                          if (execution === "Compilation error") {
                            await axios
                              .post(`${BACKEND_URL}code/compilation_error/`, { program: code, question_id: questionId })
                              .then((res) => {
                                setHints([res.data.gpt_answer.cause]);
                                setHintsDisplayed(1);
                              });
                          } else if (execution === "Failure") {
                            await axios
                              .post(`${BACKEND_URL}code/give_hints/`, { program: code, question_id: questionId })
                              .then((res) => {
                                setHints(res.data.gpt_answer.hints);
                                setHintsDisplayed(1);
                              });
                          } else {
                            await axios
                              .post(`${BACKEND_URL}code/optimize/`, { program: code, question_id: questionId })
                              .then((res) => {
                                setHints(res.data.gpt_answer.suggestions);
                                setHintsDisplayed(1);
                              });
                          }
                          setLoading(false);
                        } else {
                          setHintsDisplayed((prev) => prev + 1);
                        }
                      }}
                    >
                      {loading ? (
                        <div role="flex justify-center items-center">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 mr-2 text-white animate-spin fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <>
                          {execution === "Compilation error"
                            ? "What's causing it?"
                            : `Show${hintsDisplayed > 0 ? " next" : ""} ${
                                execution === "Failure" ? "hint" : "suggestion"
                              }`}
                        </>
                      )}{" "}
                    </button>
                  </div>
                </div>
                <div className="flex flex-row justify-center mt-4">
                  <button
                    className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5"
                    onClick={() => {
                      axios
                        .post(`${BACKEND_URL}code/check_test_examples/`, { program: code, question_id: questionId })
                        .then((res) => {
                          if (res.data.success === null) {
                            setExecution("Compilation error");
                          } else if (res.data.success) {
                            setExecution("Success");
                          } else {
                            setExecution("Failure");
                          }
                          setHints([]);
                          setTested(true);
                          setHintsDisplayed(0);
                        });
                    }}
                  >
                    Test {tested ? "again" : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
