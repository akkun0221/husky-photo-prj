"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { LiveWithPhotoFlag } from "@/entities/live/types";

type Props = {
  lives: LiveWithPhotoFlag[];
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function LiveCalendar({ lives }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const livesByDate = lives.reduce<Record<string, LiveWithPhotoFlag[]>>(
    (acc, live) => {
      const dateKey = live.date.slice(0, 10);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(live);
      return acc;
    },
    {},
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* 背景画像 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: "url('/calender_background.jpeg')" }}
      />
      {/* コンテンツ */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">
            {year}年{month + 1}月
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-500">
          {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid h-[360px] grid-cols-7 grid-rows-6">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayLives = livesByDate[dateKey] ?? [];

            return (
              <div key={dateKey} className="overflow-hidden border-t p-1">
                <span className="block text-xs text-zinc-500">{day}</span>
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {dayLives.map((live) =>
                    live.hasPhotos ? (
                      <Link
                        key={live.id}
                        href={`/lives/${live.id}`}
                        className="truncate rounded bg-amber-300 px-1 py-0.5 text-[10px] text-amber-900 hover:bg-amber-400"
                        title={live.venue}
                      >
                        {live.venue}
                      </Link>
                    ) : (
                      <span
                        key={live.id}
                        className="cursor-not-allowed truncate rounded bg-zinc-200 px-1 py-0.5 text-[10px] text-zinc-400"
                        title={live.venue}
                      >
                        {live.venue}
                      </span>
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
