"use client"

/**
 * Calendar Cell Component - Modern Design with React.memo
 */

import React, { useCallback, useMemo } from "react"
import type { CalendarEvent } from "./CalendarView.types"

interface CalendarCellProps {
  date: Date
  events: CalendarEvent[]
  isToday: boolean
  isCurrentMonth: boolean
  isSelected: boolean
  onClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

const CalendarCellComponent: React.FC<CalendarCellProps> = ({
  date,
  events,
  isToday,
  isCurrentMonth,
  isSelected,
  onClick,
  onEventClick,
}) => {
  const dayNumber = date.getDate()

  const handleClick = useCallback(() => {
    onClick(date)
  }, [date, onClick])

  const handleEventClick = useCallback(
    (e: React.MouseEvent, event: CalendarEvent) => {
      e.stopPropagation()
      onEventClick(event)
    },
    [onEventClick],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick(date)
      }
    },
    [date, onClick],
  )

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [events])

  const visibleEvents = sortedEvents.slice(0, 2)
  const remainingCount = events.length - 2

  const monthName = date.toLocaleDateString("en-US", { month: "long" })
  const year = date.getFullYear()
  const ariaLabel = `${monthName} ${dayNumber}, ${year}. ${events.length} event${events.length !== 1 ? "s" : ""}.`

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        min-h-28 p-2 border-b border-r border-slate-100 cursor-pointer transition-all duration-200
        hover:bg-indigo-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500
        ${!isCurrentMonth ? "bg-slate-50/80" : "bg-white"}
        ${isSelected ? "ring-2 ring-inset ring-indigo-500 bg-indigo-50/30" : ""}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        {isToday ? (
          <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-indigo-200">
            {dayNumber}
          </span>
        ) : (
          <span
            className={`text-sm font-semibold px-2 py-1 rounded-lg ${isCurrentMonth ? "text-slate-800" : "text-slate-400"}`}
          >
            {dayNumber}
          </span>
        )}
      </div>

      <div className="space-y-1.5 overflow-hidden">
        {visibleEvents.map((event) => (
          <button
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg truncate text-white font-medium hover:opacity-90 transition-all hover:translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-sm"
            style={{ backgroundColor: event.color || "#6366f1" }}
            title={event.title}
          >
            {event.title}
          </button>
        ))}

        {remainingCount > 0 && (
          <button
            onClick={handleClick}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold focus:outline-none focus-visible:underline pl-1 hover:pl-2 transition-all"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  )
}

export const CalendarCell = React.memo(CalendarCellComponent)
