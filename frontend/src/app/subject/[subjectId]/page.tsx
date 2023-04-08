"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const pathname = usePathname();
  const subject = pathname.split("/").at(-1);
  const router = useRouter();

  const questions = ["Question 1", "Question 2", "Question 3"];

  return (
    <div>
      <p className="text-2xl"> Subject: {subject}</p>
      <div className="flex flex-col gap-3 mt-5">
        {questions.map((question) => (
          <p
            className="cursor-pointer"
            key={question}
            onClick={() => {
              router.push(`/subject/${subject}/question/${question}`);
            }}
          >
            {question}
          </p>
        ))}
      </div>
    </div>
  );
};

export default page;
