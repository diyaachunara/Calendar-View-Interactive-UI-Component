"use client"

/**
 * Calendar View - Main Component with Modern Styling
 */

import type React from "react"
import { useState, useCallback } from "react"
import type { CalendarViewProps, CalendarEvent, CalendarViewType } from "./CalendarView.types"
import { CalendarHeader } from "./CalendarHeader"
import { MonthView } from "./MonthView"
import { WeekView } from "./WeekView"
import { EventModal } from "./EventModal"

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = "month",
  initialDate,
}) => {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(initialDate || new Date())
  const [view, setView] = useState<CalendarViewType>(initialView)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [prefilledDate, setPrefilledDate] = useState<Date | null>(null)

  // Navigation handlers
  const goToPreviousPeriod = useCallback(() => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      }
      const next = new Date(prev)
      next.setDate(prev.getDate() - 7)
      return next
    })
  }, [view])

  const goToNextPeriod = useCallback(() => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      }
      const next = new Date(prev)
      next.setDate(prev.getDate() + 7)
      return next
    })
  }, [view])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const handleMonthChange = useCallback((month: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), month, 1))
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setCurrentDate((prev) => new Date(year, prev.getMonth(), 1))
  }, [])

  // Event handlers
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setPrefilledDate(date)
    setModalMode("create")
    setIsModalOpen(true)
  }, [])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setPrefilledDate(null)
    setModalMode("edit")
    setIsModalOpen(true)
  }, [])

  const handleTimeSlotClick = useCallback((date: Date, hour: number) => {
    const clickedDate = new Date(date)
    clickedDate.setHours(hour, 0, 0, 0)
    setSelectedDate(clickedDate)
    setSelectedEvent(null)
    setPrefilledDate(clickedDate)
    setModalMode("create")
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setPrefilledDate(null)
  }, [])

  const handleSave = useCallback(
    (eventData: Omit<CalendarEvent, "id">) => {
      if (modalMode === "create") {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }
        onEventAdd(newEvent)
        handleCloseModal()
        return { success: true }
      } else if (selectedEvent) {
        onEventUpdate(selectedEvent.id, eventData)
        handleCloseModal()
        return { success: true }
      }
      return { success: false, errors: { general: "Unknown error" } }
    },
    [modalMode, selectedEvent, onEventAdd, onEventUpdate, handleCloseModal],
  )

  const handleDelete = useCallback(
    (id: string) => {
      onEventDelete(id)
      handleCloseModal()
    },
    [onEventDelete, handleCloseModal],
  )

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-200/60">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={goToPreviousPeriod}
        onNext={goToNextPeriod}
        onToday={goToToday}
        onViewChange={setView}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      <div className="flex-1 overflow-hidden">
        {view === "month" ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        event={selectedEvent}
        prefilledDate={prefilledDate}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default CalendarView
