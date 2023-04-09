"use client";

import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/constants/api";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import Popup from "./Popup";

const Navbar = () => {
  const [courses, setCourses] = React.useState<{ id: number; name: string; level: string }[]>([]);
  const [showSubjects, setShowSubjects] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    axios.post(`${BACKEND_URL}courses/courses/`).then((res) => {
      setCourses(res.data);
    });
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-700">
      <div className="flex justify-start gap-4 items-center p-2">
        <Image src="https://flowbite.com/docs/images/logo.svg" width={40} height={32} alt="Flowbite Logo" />
        <div className="flex gap-5">
          <div
            className="text-white cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </div>
          <div
            className="relative text-white cursor-pointer inline-flex justify-center items-center gap-2"
            onClick={() => setShowSubjects(!showSubjects)}
          >
            Courses {showSubjects ? <BiChevronUp /> : <BiChevronDown />}
            <Popup show={showSubjects} onClickOutside={() => setShowSubjects(false)} className="top-[170%] left-0">
              <div>
                <div className="bg-white shadow-md p-2 gap-2 flex flex-col">
                  {courses.map((course, index) => (
                    <span
                      key={course.name}
                      className={twMerge(
                        "text-black cursor-pointer whitespace-nowrap border-b border-b-slate-300 py-2 px-4 hover:bg-stone-300 inline-flex justify-between min-w-[250px]",
                        index === courses.length - 1 && "border-b-0"
                      )}
                      onClick={() => {
                        router.push(`/subject/${course.id}`);
                      }}
                    >
                      {course.name}
                      <span className="inline-flex justify-center items-center">
                        {Array.from({ length: parseInt(course.level) }).map((_, index) => (
                          <AiFillStar key={index} />
                        ))}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
