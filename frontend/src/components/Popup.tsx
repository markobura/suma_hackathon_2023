import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  onClickOutside?: () => void;
}

const Popup = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { show, onClickOutside, className, children, ...rest } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  if (!show) return null;

  return (
    <div ref={ref} className={twMerge("absolute", show ? "block" : "hidden", className)} {...rest}>
      {children}
    </div>
  );
};

export default Popup;
