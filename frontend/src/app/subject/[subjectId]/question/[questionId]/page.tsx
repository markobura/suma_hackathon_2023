"use client";

import CodeEditorWindow from "@/components/CodeEditorWindow";
import { BACKEND_URL } from "@/constants/api";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const Question = () => {
  const pathname = usePathname();
  const questionId = pathname.split("/").at(-1);
  const [openTab, setOpenTab] = React.useState<"problem" | "test">("problem");
  const [questionTitle, setQuestionTitle] = React.useState("");
  const [questionText, setQuestionText] = React.useState("");
  
  const [execution, setExecution] = React.useState<"Compilation error"|"Failure"|"Success">("Compilation error");
  const [hints, setHints] = React.useState<string[]>([]);
  const [hintsDisplayed, setHintsDisplayed] = React.useState<number>(0);
  const [tested, setTested] = React.useState<boolean>(false);

  const [code, setCode] = React.useState("");

  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  useEffect(()=>{
    axios.post(`${BACKEND_URL}courses/questions/${questionId}/`).then((res) => {
      setQuestionText(res.data.text);
      setQuestionTitle(res.data.name);
    });
  }, []);

  const onSubmitCode = async () => {
    axios
      .post(`${BACKEND_URL}code/check_c/`, {
        program: code,
        input,
      })
      .then((res) => {
        setOutput(res.data.output);
      })
      .catch((err) => {
        setOutput(err.response.data.error);
      });
  };

  return (
    <div className="w-full h-full flex">
      <div className="overlay rounded-md overflow-hidden w-1/2 h-full shadow-4xl">
        <div className="h-4/5">
          <CodeEditorWindow code={code} setCode={setCode} />
        </div>
        <div className="flex gap-4 items-center mt-2">
          <textarea
            id="message"
            rows={4}
            className="block p-2.5 text-sm placeholder-black w-80 text-black bg-blue-900/60 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your input here..."
            onChange={(e)=> {setInput(e.currentTarget.value)}}
          />
          <textarea
            id="message"
            disabled
            rows={4}
            className="block p-2.5 text-sm w-80 placeholder-black bg-blue-900/60 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Output"
            value={output}
          />
        </div>
        <div className="flex flex-row justify-center items-center mt-2">
          <button
            className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white w-1/4 font-bold py-2 px-4 rounded"
            onClick={onSubmitCode}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="w-1/2 h-full">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center">
            <ul className="flex space-x-2">
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
            </ul>
            <div className="p-3 mt-6 w-full">
              <div className={openTab === "problem" ? "block" : "hidden"}>
                <p className="text-xl font-bold text-center">{questionTitle}</p>
                <ReactMarkdown>{questionText}</ReactMarkdown>
              </div>
              <div className={openTab === "test" ? "block" : "hidden"}>
                <div className={tested ? "block" : "hidden"}>
                  <div className={execution==="Compilation error"? "block" : "hidden"}>
                    <div className="w-9/10 py-3 px-2 rounded bg-red-500">
                      <p className="text-white">
                        There is a compilation error in your code, would you like some help finding it?
                      </p>
                    </div>
                  </div>
                  <div className={execution==="Failure"? "block" : "hidden"}>
                    <div className="w-9/10 py-3 px-2 rounded  bg-yellow-500">
                      <p className="text-black">
                        Your solution isn't correct, would you like a hint?
                      </p>
                    </div>
                  </div>
                  <div className={execution==="Success"? "block" : "hidden"}>
                    <div className="w-9/10 py-3 px-2 rounded bg-green-500">
                      <p className="text-white">
                        Your solution is correct! Do you think there's a way to optimize it?
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2 mt-5 mb-5">
                    {hints.slice(0, hintsDisplayed).map((hint, i) => (
                      <div className="w-full rounded bg-blue-300" key={i}>
                        <p className="text-white font-semibold p-2">{hint}</p>
                      </div>
                    ))}
                  </div>
                  <div className={hintsDisplayed < hints.length || hints.length === 0 ? "mt-4 flex justify-center" : "hidden"}>
                    <button
                      className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        if (hints.length === 0) {
                          if (execution === "Compilation error") {
                            axios.post(`${BACKEND_URL}code/compilation_error/`, {program: code, question_id: questionId}).then((res) => {
                              setHints([res.data.gpt_answer.cause]);
                              setHintsDisplayed(1);
                            });
                          } else if (execution === "Failure") {
                            axios.post(`${BACKEND_URL}code/give_hints/`, {program: code, question_id: questionId}).then((res) => {
                              setHints(res.data.gpt_answer.hints);
                              setHintsDisplayed(1);
                            });
                          } else {
                            axios.post(`${BACKEND_URL}code/optimize/`, {program: code, question_id: questionId}).then((res) => {
                              setHints(res.data.gpt_answer.suggestions);
                              setHintsDisplayed(1);
                            });
                          }
                        } else {
                          setHintsDisplayed((prev) => prev + 1);
                        }
                      }}
                    >
                      {execution === "Compilation error" ? 
                      "What's causing it?" : `Show${hintsDisplayed>0? " next":""} ${execution === "Failure"? "hint":"suggestion"}`
                      }
                      
                    </button>
                  </div>
                </div>
                <div className="flex flex-row justify-center mt-4">
                  <button 
                    className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5"
                    onClick={()=>{
                      axios.post(`${BACKEND_URL}code/check_test_examples/`, {program: code, question_id: questionId}).then((res) => {
                        if (res.data.success === null) {
                          setExecution("Compilation error");
                        } else if (res.data.message === "All tests passed") { //TEMP!!!!!!!
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
                    Test {tested?"again":""}
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
