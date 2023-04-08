"use client";

import CodeEditorWindow from "@/components/CodeEditorWindow";
import React from "react";

const Question = () => {
  const [openTab, setOpenTab] = React.useState(1);

  return (
    <div className="w-full h-full flex">
      <div className="overlay rounded-md overflow-hidden w-1/2 h-full shadow-4xl">
        <div className="h-4/5">
          <CodeEditorWindow />
        </div>
        <div className="flex gap-4 items-center mt-2">
          <textarea
            id="message"
            rows={4}
            className="block p-2.5 text-sm w-80 text-gray-900 bg-blue-900/60 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your input here..."
          />
          <button className="bg-blue-500 h-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
          <textarea
            id="message"
            disabled
            rows={4}
            className="block p-2.5 text-sm w-80 text-gray-900 bg-blue-900/60 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your input here..."
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
                  onClick={() => setOpenTab(1)}
                  className="inline-block px-4 py-2 text-gray-600 bg-white rounded shadow"
                >
                  Code
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setOpenTab(2)}
                  className="inline-block px-4 py-2 text-gray-600 bg-white rounded shadow"
                >
                  Test
                </a>
              </li>
            </ul>
            <div className="p-3 mt-6 bg-white border">
              <div className={openTab === 1 ? "block" : "hidden"}> aaaaaaaaaa</div>
              <div className={openTab === 2 ? "block" : "hidden"}>bbbbbbb</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
