"use client";

import CodeEditorWindow from "@/components/CodeEditorWindow";
import { BACKEND_URL } from "@/constants/api";
import axios from "axios";
import React, { useEffect } from "react";

const Question = () => {
  const [openTab, setOpenTab] = React.useState<"problem" | "test">("problem");

  const [hints, setHints] = React.useState<string[]>(["hint 1", "hint 2", "hint 3"]);
  const [hintAmount, setHintAmount] = React.useState<number>(0);

  const [code, setCode] = React.useState("");

  const [output, setOutput] = React.useState("");

  const onSubmitCode = async () => {
    axios
      .post(`${BACKEND_URL}code/check_c/`, {
        program: code,
        input: "",
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
            className="block p-2.5 text-sm w-80 text-gray-900 bg-blue-900/60 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your input here..."
          />
          <button
            className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onSubmitCode}
          >
            Submit
          </button>
          <textarea
            id="message"
            disabled
            rows={4}
            className="block p-2.5 text-sm w-80 text-red-400 bg-blue-900/60 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your input here..."
            value={output}
          />
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
              <div className={openTab === "problem" ? "block" : "hidden"}>Zadatak...</div>
              <div className={openTab === "test" ? "block" : "hidden"}>
                <div>
                  <p className="text-red-500">
                    Your answer had some problems...
                    <span className="text-black font-bold">Would you like to see some hints?</span>
                  </p>
                  <div className="w-full flex flex-col gap-2">
                    {hints.slice(0, hintAmount).map((hint) => (
                      <div className="w-full bg-gray-600">
                        <p className="text-gray-500 font-semibold p-2">{hint}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setHintAmount((prev) => prev + 1)}
                    >
                      Show hint
                    </button>
                  </div>
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
