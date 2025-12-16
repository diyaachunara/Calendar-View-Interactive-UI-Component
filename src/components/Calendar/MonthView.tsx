"use client"

/**
 * Month View Component - Enhanced Modern Design
 */

import type React from "react"
import { useMemo } from "react"
import type { CalendarEvent } from "./CalendarView.types"
import { CalendarCell } from "./CalendarCell"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  selectedDate: Date | null
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isToday = (date: Date): boolean => isSameDay(date, new Date())

const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth()
}

const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDayOfWeek = firstDay.getDay()

  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDayOfWeek)

  const grid: Date[] = []
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(startDate))
    startDate.setDate(startDate.getDate() + 1)
  }

  return grid
}

const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter((event) => {
    const eventStart = new Date(event.startDate)
    return isSameDay(eventStart, date)
  })
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  selectedDate,
  onDateClick,
  onEventClick,
}) => {
  const calendarGrid = useMemo(() => getCalendarGrid(currentDate), [currentDate])

  return (
    <div className="flex flex-col h-full">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {DAY_NAMES.map((day, index) => (
          <div
            key={day}
            className={`
              p-4 text-center text-xs font-bold uppercase tracking-wider
              ${index === 0 || index === 6 ? "text-indigo-500 bg-indigo-50/30" : "text-slate-500 bg-slate-50/50"}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarGrid.map((date, index) => {
          const dateEvents = getEventsForDate(events, date)
          return (
            <CalendarCell
              key={index}
              date={date}
              events={dateEvents}
              isToday={isToday(date)}
              isCurrentMonth={isCurrentMonth(date, currentDate)}
              isSelected={selectedDate !== null && isSameDay(date, selectedDate)}
              onClick={onDateClick}
              onEventClick={onEventClick}
            />
          )
        })}
      </div>
    </div>
  )
}
