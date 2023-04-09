"use client";

import { BACKEND_URL } from "@/constants/api";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export interface ISection {
  id: number;
  level: string;
  name: string;
  questions: { id: string; name: string }[];
}

const page = () => {
  const pathname = usePathname();
  const subjectId = pathname.split("/").at(-1);
  const router = useRouter();

  const [sections, setSections] = useState<ISection[]>([]);
  const [subject, setSubject] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  useEffect(() => {
    axios.post(`${BACKEND_URL}courses/courses/${subjectId}/`).then((res) => {
      setSections(res.data.sections);
      setSubject(res.data.name);
      setCourseDescription(res.data.description);
    });
  }, []);

  return (
    <div className="w-full h-full flex gap-3">
      <div className="w-5/12 h-full px-4 border-gray-400">
        <p className="text-2xl"> Course: {subject}</p>
        <div className="flex flex-col gap-3 mt-5">
          {sections.map((section) => (
            <div key={section.id - 1000}>
              <p
                className="text-lg font-bold px-2 py-2 bg-blue-200 border border-black inline-flex justify-between w-full"
                key={section.id}
              >
                <span>{section.name}</span>
                <span className="inline-flex gap-2 justify-center items-center">
                  {Array.from({ length: parseInt(section.level) }).map((_, index) => (
                    <AiFillStar key={index} />
                  ))}
                </span>
              </p>

              {section.questions.map((question) => (
                <p
                  className="text-base text-blue-500 cursor-pointer border black px-8 py-2"
                  key={question.id + 1000}
                  onClick={() => {
                    router.push(`/subject/${subjectId}/question/${question.id}`);
                  }}
                >
                  {question.name}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-7/12 mr-1">
        <div className="px-4 overflow-auto h-full mb-2 border border-primary bg-secondary">
          <ReactMarkdown className="markdown">{courseDescription}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default page;
