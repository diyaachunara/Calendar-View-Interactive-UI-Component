"use client"

/**
 * Week View Component - Enhanced Modern Design
 */

import type React from "react"
import { useMemo, useCallback, useState } from "react"
import type { CalendarEvent } from "./CalendarView.types"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  onTimeSlotClick?: (date: Date, hour: number) => void
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isToday = (date: Date): boolean => isSameDay(date, new Date())

const getWeekGrid = (date: Date): Date[] => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const grid: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    grid.push(day)
  }
  return grid
}

const getTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let i = 0; i < 24; i++) {
    slots.push(`${i.toString().padStart(2, "0")}:00`)
  }
  return slots
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter((event) => {
    const eventStart = new Date(event.startDate)
    return isSameDay(eventStart, date)
  })
}

const calculateEventPosition = (event: CalendarEvent): { top: number; height: number } => {
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)

  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()
  const durationMinutes = endMinutes - startMinutes

  const top = (startMinutes / 60) * 64
  const height = Math.max((durationMinutes / 60) * 64, 28)

  return { top, height }
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onTimeSlotClick,
}) => {
  const weekGrid = useMemo(() => getWeekGrid(currentDate), [currentDate])
  const timeSlots = useMemo(() => getTimeSlots(), [])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ date: Date; hour: number } | null>(null)
  const [dragEnd, setDragEnd] = useState<{ hour: number } | null>(null)

  const handleTimeSlotClick = useCallback(
    (date: Date, hour: number) => {
      if (onTimeSlotClick) {
        onTimeSlotClick(date, hour)
      } else {
        const clickedDate = new Date(date)
        clickedDate.setHours(hour, 0, 0, 0)
        onDateClick(clickedDate)
      }
    },
    [onDateClick, onTimeSlotClick],
  )

  const handleMouseDown = useCallback((date: Date, hour: number) => {
    setIsDragging(true)
    setDragStart({ date, hour })
    setDragEnd({ hour })
  }, [])

  const handleMouseMove = useCallback(
    (hour: number) => {
      if (isDragging) {
        setDragEnd({ hour })
      }
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStart && dragEnd && onTimeSlotClick) {
      const startHour = Math.min(dragStart.hour, dragEnd.hour)
      const date = new Date(dragStart.date)
      date.setHours(startHour, 0, 0, 0)
      onTimeSlotClick(date, startHour)
    }
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
  }, [isDragging, dragStart, dragEnd, onTimeSlotClick])

  const renderDayEvents = useCallback(
    (date: Date) => {
      const dayEvents = getEventsForDate(events, date)

      return dayEvents.map((event, index) => {
        const { top, height } = calculateEventPosition(event)
        const width = dayEvents.length > 1 ? 100 / Math.min(dayEvents.length, 3) : 100
        const left = index * width

        return (
          <button
            key={event.id}
            onClick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            className="absolute rounded-xl px-2.5 py-1.5 text-xs text-white overflow-hidden hover:opacity-90 transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-lg"
            style={{
              backgroundColor: event.color || "#6366f1",
              top: `${top}px`,
              height: `${height}px`,
              left: `${left}%`,
              width: `calc(${width}% - 6px)`,
              minHeight: "28px",
            }}
            title={`${event.title}\n${formatTime(new Date(event.startDate))} - ${formatTime(new Date(event.endDate))}`}
          >
            <div className="font-bold truncate">{event.title}</div>
            {height > 40 && (
              <div className="text-white/80 truncate text-[11px] mt-0.5">{formatTime(new Date(event.startDate))}</div>
            )}
          </button>
        )
      })
    },
    [events, onEventClick],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden" onMouseUp={handleMouseUp}>
      {/* Day Headers */}
      <div className="flex border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-20 shrink-0" />
        {weekGrid.map((date, index) => {
          const dayIsToday = isToday(date)
          const isWeekend = index === 0 || index === 6
          return (
            <div
              key={index}
              className={`flex-1 py-4 text-center border-l border-slate-200 ${isWeekend ? "bg-indigo-50/20" : ""}`}
            >
              <div
                className={`text-xs font-bold uppercase tracking-wider ${isWeekend ? "text-indigo-500" : "text-slate-500"}`}
              >
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <button
                onClick={() => onDateClick(date)}
                className={`
                  mt-2 w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center mx-auto
                  transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                  ${dayIsToday ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-800 hover:bg-slate-200"}
                `}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex min-h-full">
          {/* Time Labels */}
          <div className="w-20 shrink-0 bg-slate-50/50">
            {timeSlots.map((time, index) => (
              <div key={time} className="h-16 border-b border-slate-100 pr-4 flex items-start justify-end">
                <span className="text-xs text-slate-400 font-semibold -translate-y-2.5">{index === 0 ? "" : time}</span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekGrid.map((date, dayIndex) => {
            const isWeekend = dayIndex === 0 || dayIndex === 6
            return (
              <div
                key={dayIndex}
                className={`flex-1 border-l border-slate-200 relative ${isWeekend ? "bg-indigo-50/10" : ""}`}
              >
                {/* Time Slot Grid */}
                {timeSlots.map((_, hourIndex) => {
                  const isInDragRange =
                    isDragging &&
                    dragStart &&
                    dragEnd &&
                    isSameDay(dragStart.date, date) &&
                    hourIndex >= Math.min(dragStart.hour, dragEnd.hour) &&
                    hourIndex <= Math.max(dragStart.hour, dragEnd.hour)

                  return (
                    <div
                      key={hourIndex}
                      role="button"
                      tabIndex={0}
                      aria-label={`${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${hourIndex}:00`}
                      className={`
                        h-16 border-b border-slate-100 cursor-pointer transition-colors
                        hover:bg-indigo-50/60 focus:outline-none focus-visible:bg-indigo-100
                        ${isInDragRange ? "bg-indigo-100" : ""}
                      `}
                      onClick={() => handleTimeSlotClick(date, hourIndex)}
                      onMouseDown={() => handleMouseDown(date, hourIndex)}
                      onMouseMove={() => handleMouseMove(hourIndex)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          handleTimeSlotClick(date, hourIndex)
                        }
                      }}
                    />
                  )
                })}

                {/* Events Layer */}
                <div className="absolute inset-0 pointer-events-none px-1">
                  <div className="relative h-full pointer-events-auto">{renderDayEvents(date)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
