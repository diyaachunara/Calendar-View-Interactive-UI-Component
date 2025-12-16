"use client"

/**
 * Calendar Header Component - Enhanced Modern Design
 */

import type React from "react"
import { useCallback, useMemo } from "react"
import type { CalendarViewType } from "./CalendarView.types"
import { Button } from "../primitives/Button"
import { Select } from "../primitives/Select"

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarViewType
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: CalendarViewType) => void
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const getYearOptions = (range = 10): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear - range; i <= currentYear + range; i++) {
    years.push(i)
  }
  return years
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onMonthChange,
  onYearChange,
}) => {
  const monthOptions = useMemo(() => MONTH_NAMES.map((name, index) => ({ value: String(index), label: name })), [])

  const yearOptions = useMemo(
    () => getYearOptions(10).map((year) => ({ value: String(year), label: String(year) })),
    [],
  )

  const handleMonthChange = useCallback(
    (value: string) => {
      onMonthChange(Number.parseInt(value, 10))
    },
    [onMonthChange],
  )

  const handleYearChange = useCallback(
    (value: string) => {
      onYearChange(Number.parseInt(value, 10))
    },
    [onYearChange],
  )

  const formatMonthYear = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={onToday} size="sm">
          Today
        </Button>

        <div className="flex items-center bg-slate-100/80 rounded-xl p-1.5 shadow-inner">
          <button
            onClick={onPrevious}
            className="p-2.5 rounded-lg hover:bg-white hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={view === "month" ? "Previous month" : "Previous week"}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="p-2.5 rounded-lg hover:bg-white hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={view === "month" ? "Next month" : "Next week"}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Month/Year Display - Desktop */}
        <h2 className="hidden lg:block text-2xl font-bold text-slate-800 ml-2">{formatMonthYear}</h2>
      </div>

      {/* Center - Month/Year Pickers */}
      <div className="flex items-center gap-3">
        <Select
          options={monthOptions}
          value={String(currentDate.getMonth())}
          onChange={handleMonthChange}
          className="w-40"
        />
        <Select
          options={yearOptions}
          value={String(currentDate.getFullYear())}
          onChange={handleYearChange}
          className="w-28"
        />
      </div>

      {/* Right side - View Toggle */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-xl shadow-inner">
        <button
          onClick={() => onViewChange("month")}
          className={`
            px-5 py-2.5 text-sm font-semibold rounded-lg transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
            ${
              view === "month"
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }
          `}
          aria-pressed={view === "month"}
        >
          Month
        </button>
        <button
          onClick={() => onViewChange("week")}
          className={`
            px-5 py-2.5 text-sm font-semibold rounded-lg transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
            ${
              view === "week"
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }
          `}
          aria-pressed={view === "week"}
        >
          Week
        </button>
      </div>
    </header>
  )
}
