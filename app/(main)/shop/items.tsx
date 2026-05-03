"use client";

import { refillHearts } from "@/actions/user-progress";
import { createStripUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL } from "@/constants";
import Image from "next/image";
import { startTransition, useTransition } from "react";
import { toast } from "sonner";


type Props = {
    hearts: number;
    points: number;
    hasActiveSubcription: boolean;
};

export const Items = ({
    hearts,
    points,
    hasActiveSubcription,
}: Props) => {
    const [pending, starTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 2 || points < POINTS_TO_REFILL) {
            return;
        }

        startTransition(() => {
            refillHearts()
                .catch(() => toast.error("Something went wrong"));
        });
    };

    const onUpgrade = () => {
        startTransition (() => {
         createStripUrl()
          .then((response) => {
            if (response.data) {
                window.location.href = response.data;
            }
          })
          .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <ul className="w-full">
          <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
            <Image
            src="/heart.svg"
            alt="Heart"
            height={60}
            width={60}
            />
            <div className="flex-1">
              <p className="text-neutral-700 text-base lg:text-xl font-bold">
                Refill hearts
              </p>
            </div>
            <Button
                onClick={onRefillHearts}
                disabled={pending || hearts === 2 || points < POINTS_TO_REFILL}
            >
                {hearts === 2
                  ? "full"
                  : (
                    <div className="flex items-center">
                        <Image
                        src="/points.svg"
                        alt="Points"
                        height={20}
                        width={20}
                        />
                        <p>
                            {POINTS_TO_REFILL}
                        </p>
                    </div>
                  )
                }
            </Button>
          </div>
          <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
            <Image
            src="/unlimited.svg"
            alt="Unlimited"
            height={60}
            width={60}
            />
            <div className="flex-1">
                <p className="text-neutral-700 text-base lg:text-xl font-bold">
                    Unlimited Hearts
                </p>
            </div>
            <Button
            onClick={onUpgrade}
            disabled={pending}
            >
                {hasActiveSubcription ? "settings" : "upgrade"}
            </Button>
          </div>
        </ul>
    );
};