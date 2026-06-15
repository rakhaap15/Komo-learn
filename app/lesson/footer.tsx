"use client";

import { useKey, useMedia } from "react-use";
import { ClipboardPenLineIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  const buttonText =
    status === "none"
        ? "Check"
        : "Continue";

  return (
    <footer
      className={cn(
        "h-[100px] border-t-2",
        status === "correct" && "border-transparent bg-[#5A7863]",
        status === "wrong" && "border-transparent bg-[#5A7863]"
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">

        {/* LEFT SIDE FEEDBACK (tetap boleh ada atau dihapus nanti) */}
        {status === "correct" && (
          <div className="text-[#F4F6F5] font-bold text-base lg:text-2xl flex items-center">
            <ClipboardPenLineIcon className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Keep going....
          </div>
        )}

        {status === "wrong" && (
          <div className="text-[#F4F6F5] font-bold text-base lg:text-2xl flex items-center">
            <ClipboardPenLineIcon className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Keep going....
          </div>
        )}

        {/* BUTTON */}
        <Button
          disabled={disabled}
          className="ml-auto bg-[#5A7863] hover:bg-[#4a6655] text-white"
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
        >
          {buttonText}
        </Button>

      </div>
    </footer>
  );
};