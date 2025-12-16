"use client"

/**
 * Event Management Hook
 */

import { useState, useCallback, useMemo } from "react"
import type { CalendarEvent } from "../components/Calendar/CalendarView.types"
import { generateEventId, validateEvent } from "../utils/event.utils"

interface UseEventManagerProps {
  initialEvents?: CalendarEvent[]
  onEventAdd?: (event: CalendarEvent) => void
  onEventUpdate?: (id: string, updates: Partial<CalendarEvent>) => void
  onEventDelete?: (id: string) => void
}

export const useEventManager = ({
  initialEvents = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: UseEventManagerProps = {}) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [prefilledDate, setPrefilledDate] = useState<Date | null>(null)

  const addEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id">) => {
      const errors = validateEvent(eventData)
      if (Object.keys(errors).length > 0) {
        return { success: false, errors }
      }

      const newEvent: CalendarEvent = {
        ...eventData,
        id: generateEventId(),
      }

      setEvents((prev) => [...prev, newEvent])
      onEventAdd?.(newEvent)
      return { success: true, event: newEvent }
    },
    [onEventAdd],
  )

  const updateEvent = useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      const currentEvent = events.find((e) => e.id === id)
      if (!currentEvent) return { success: false, errors: { id: "Event not found" } }

      const updatedEvent = { ...currentEvent, ...updates }
      const errors = validateEvent(updatedEvent)
      if (Object.keys(errors).length > 0) {
        return { success: false, errors }
      }

      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)))
      onEventUpdate?.(id, updates)
      return { success: true, event: updatedEvent }
    },
    [events, onEventUpdate],
  )

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
      onEventDelete?.(id)
    },
    [onEventDelete],
  )

  const openCreateModal = useCallback((date?: Date) => {
    setSelectedEvent(null)
    setPrefilledDate(date || null)
    setModalMode("create")
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setPrefilledDate(null)
    setModalMode("edit")
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setPrefilledDate(null)
  }, [])

  return useMemo(
    () => ({
      events,
      setEvents,
      selectedEvent,
      isModalOpen,
      modalMode,
      prefilledDate,
      addEvent,
      updateEvent,
      deleteEvent,
      openCreateModal,
      openEditModal,
      closeModal,
    }),
    [
      events,
      selectedEvent,
      isModalOpen,
      modalMode,
      prefilledDate,
      addEvent,
      updateEvent,
      deleteEvent,
      openCreateModal,
      openEditModal,
      closeModal,
    ],
  )
}
