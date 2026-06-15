import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    value: number | string;
    variant: "score" | "time" | "level";
};

export const ResultCard = ({ value, variant }: Props) => {
    const imageSrc =
        variant === "score"
            ? "/score.svg"
            : variant === "time"
            ? "/time.svg"
            : "/level.svg";

    const title =
        variant === "score"
            ? "Score"
            : variant === "time"
            ? "Time"
            : "Level";

    const bgColor =
        variant === "score"
            ? "bg-[#E8BE55] border-[#E8BE55]"
            : variant === "time"
            ? "bg-[#3B82F6] border-[#3B82F6]"
            : "bg-[#8B5CF6] border-[#8B5CF6]";

    const textColor =
        variant === "score"
            ? "text-[#E8BE55]"
            : variant === "time"
            ? "text-[#3B82F6]"
            : "text-[#8B5CF6]";

    return (
        <div className={cn("rounded-2xl border-2 w-full", bgColor)}>
            {/* HEADER */}
            <div
                className={cn(
                    "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
                    bgColor
                )}
            >
                {title}
            </div>

            {/* CONTENT */}
            <div
                className={cn(
                    "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
                    textColor
                )}
            >
                <Image
                    alt="Icon"
                    src={imageSrc}
                    height={30}
                    width={30}
                    className="mr-1.5"
                />

                {variant === "time" ? `${value} min` : value}
            </div>
        </div>
    );
};