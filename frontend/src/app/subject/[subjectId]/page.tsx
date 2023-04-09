"use client";

import { BACKEND_URL } from "@/constants/api";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface ISection {
  id: number;
  level: string;
  name: string;
  questions: {id: string; name:string;}[]
}

const page = () => {
  const pathname = usePathname();
  const subjectId = pathname.split("/").at(-1);
  const router = useRouter();

  const [sections, setSections] = useState<ISection[]>([]);
  const [subject, setSubject] = useState("");

  useEffect(()=>{
    axios.post(`${BACKEND_URL}courses/courses/${subjectId}/`).then((res) => {
      setSections(res.data.sections);
      setSubject(res.data.name);
    });
  }, []);

  return (
    <div className="w-full h-full flex gap-3">
      <div className="w-1/2 h-full px-4 border-r border-gray-400">
        <p className="text-2xl"> Subject: {subject}</p>
        <div className="flex flex-col gap-3 mt-5">
          {sections.map((section) => (
            <div key={section.id - 1000}>
            <p
              className="text-lg font-bold px-2 py-2 bg-blue-200 border border-black"
              key={section.id}
            >
              {section.name}, level {section.level}
            </p>

            {section.questions.map((question)=>(
              <p
                className="text-base text-blue-500 cursor-pointer border border black px-8 py-2"
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
    </div>
  );
};

export default page;
