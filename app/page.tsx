"use client";

import { useState } from "react";

const GROUP_SIZE = 4;
const GROUP_COUNT = 14;
const TOTAL_SEATS = GROUP_SIZE * GROUP_COUNT;

interface Seat {
  groupNumber: number;
  seatNumber: number;
}

interface DrawnSeat extends Seat {
  drawnAt: number;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function createShuffledSeats(): Seat[] {
  const seats: Seat[] = [];

  for (let group = 1; group <= GROUP_COUNT; group += 1) {
    for (let seat = 1; seat <= GROUP_SIZE; seat += 1) {
      seats.push({ groupNumber: group, seatNumber: seat });
    }
  }

  return shuffle(seats);
}

export default function Home() {
  const [availableSeats, setAvailableSeats] = useState<Seat[]>(() =>
    createShuffledSeats()
  );
  const [drawnSeats, setDrawnSeats] = useState<DrawnSeat[]>([]);
  const [latestSeat, setLatestSeat] = useState<Seat | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleDrawLot = () => {
    if (availableSeats.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setShowResult(false);

    // くじ引き演出（1秒）
    setTimeout(() => {
      const [nextSeat, ...remainingSeats] = availableSeats;
      const drawnSeat: DrawnSeat = {
        ...nextSeat,
        drawnAt: Date.now(),
      };

      setLatestSeat(nextSeat);
      setDrawnSeats((prev) => [drawnSeat, ...prev]);
      setAvailableSeats(remainingSeats);
      setIsDrawing(false);
      setShowResult(true);
    }, 1000);
  };

  const handleReset = () => {
    setAvailableSeats(createShuffledSeats());
    setDrawnSeats([]);
    setLatestSeat(null);
    setShowResult(false);
    setIsDrawing(false);
  };

  const isComplete = availableSeats.length === 0 && drawnSeats.length > 0;

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <h1 className="text-2xl font-bold">GameDay 座席決め</h1>

        <section className="rounded-xl border border-black/10 p-6 dark:border-white/20">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold">残りのくじ:</span>{" "}
              <span className="text-lg font-bold">{availableSeats.length}</span> /{" "}
              {TOTAL_SEATS}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-black/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              リセット
            </button>
          </div>

          <button
            type="button"
            onClick={handleDrawLot}
            disabled={availableSeats.length === 0 || isDrawing}
            className="w-full rounded-lg bg-foreground px-6 py-4 text-lg font-bold text-background transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            {isDrawing ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-background border-t-transparent"></span>
                くじを引いています...
              </span>
            ) : isComplete ? (
              "すべてのくじが引かれました"
            ) : (
              "くじを引く"
            )}
          </button>
        </section>

        {latestSeat && (
          <section
            className={`rounded-xl border-2 border-foreground/20 bg-foreground/5 p-8 text-center transition-all duration-500 dark:border-white/20 dark:bg-white/5 ${
              showResult
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-95 opacity-0"
            }`}
          >
            <p className="mb-2 text-sm font-medium opacity-70">あなたの席は</p>
            <p className="mb-1 text-5xl font-bold">
              グループ {latestSeat.groupNumber}
            </p>
            <p className="text-3xl font-semibold">席 {latestSeat.seatNumber}</p>
          </section>
        )}

        {drawnSeats.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              引いたくじの履歴 ({drawnSeats.length}件)
            </h2>
            <div className="max-h-96 overflow-y-auto rounded-xl border border-black/10 dark:border-white/20">
              <div className="divide-y divide-black/10 dark:divide-white/20">
                {drawnSeats.map((seat, index) => (
                  <div
                    key={seat.drawnAt}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <span className="font-medium opacity-50">#{drawnSeats.length - index}</span>
                    <span className="font-semibold">
                      グループ {seat.groupNumber} - 席 {seat.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
