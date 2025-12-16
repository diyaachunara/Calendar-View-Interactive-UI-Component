import type { CalendarEvent } from "../components/Calendar/CalendarView.types"
import { isSameDay } from "./date.utils"

/**
 * Filters events for a specific date
 */
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter((event) => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    const startOfDay = new Date(checkDate)
    const endOfDay = new Date(checkDate)
    endOfDay.setHours(23, 59, 59, 999)

    return (
      isSameDay(eventStart, date) || isSameDay(eventEnd, date) || (eventStart <= endOfDay && eventEnd >= startOfDay)
    )
  })
}

/**
 * Sorts events by start time
 */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}

/**
 * Generates a unique ID for events
 */
export const generateEventId = (): string => {
  return `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Validates event data
 */
export const validateEvent = (event: Partial<CalendarEvent>): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!event.title || event.title.trim().length === 0) {
    errors.title = "Title is required"
  } else if (event.title.length > 100) {
    errors.title = "Title must be 100 characters or less"
  }

  if (event.description && event.description.length > 500) {
    errors.description = "Description must be 500 characters or less"
  }

  if (!event.startDate) {
    errors.startDate = "Start date is required"
  }

  if (!event.endDate) {
    errors.endDate = "End date is required"
  }

  if (event.startDate && event.endDate) {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    if (end <= start) {
      errors.endDate = "End time must be after start time"
    }
  }

  return errors
}

/**
 * Calculates event position and height for week view
 * Using h-14 (56px) per hour slot
 */
export const calculateEventPosition = (event: CalendarEvent): { top: number; height: number } => {
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)

  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()
  const durationMinutes = endMinutes - startMinutes

  // Each hour is 56px tall (h-14)
  const top = (startMinutes / 60) * 56
  const height = Math.max((durationMinutes / 60) * 56, 20) // Minimum 20px height

  return { top, height }
}

/**
 * Groups overlapping events for week view layout
 */
export const groupOverlappingEvents = (events: CalendarEvent[]): CalendarEvent[][] => {
  if (events.length === 0) return []

  const sorted = sortEventsByTime(events)
  const groups: CalendarEvent[][] = []
  let currentGroup: CalendarEvent[] = []
  let groupEnd = new Date(0)

  for (const event of sorted) {
    const eventStart = new Date(event.startDate)

    if (eventStart >= groupEnd && currentGroup.length > 0) {
      groups.push(currentGroup)
      currentGroup = []
      groupEnd = new Date(0)
    }

    currentGroup.push(event)
    const eventEnd = new Date(event.endDate)
    if (eventEnd > groupEnd) {
      groupEnd = eventEnd
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }

  return groups
}

/**
 * Creates sample events for demonstration
 */
export const createSampleEvents = (): CalendarEvent[] => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  return [
    {
      id: generateEventId(),
      title: "Team Standup",
      description: "Daily sync with the development team",
      startDate: new Date(currentYear, currentMonth, today.getDate(), 9, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate(), 9, 30),
      color: "#3b82f6",
      category: "Meeting",
    },
    {
      id: generateEventId(),
      title: "Project Review",
      description: "Quarterly project review meeting",
      startDate: new Date(currentYear, currentMonth, today.getDate(), 14, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate(), 15, 30),
      color: "#22c55e",
      category: "Work",
    },
    {
      id: generateEventId(),
      title: "Lunch with Client",
      startDate: new Date(currentYear, currentMonth, today.getDate() + 1, 12, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + 1, 13, 30),
      color: "#f97316",
      category: "Meeting",
    },
    {
      id: generateEventId(),
      title: "Gym Session",
      description: "Weekly fitness routine",
      startDate: new Date(currentYear, currentMonth, today.getDate() + 2, 18, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + 2, 19, 30),
      color: "#ec4899",
      category: "Health",
    },
    {
      id: generateEventId(),
      title: "Sprint Planning",
      description: "Plan upcoming sprint tasks and priorities",
      startDate: new Date(currentYear, currentMonth, today.getDate() + 3, 10, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + 3, 12, 0),
      color: "#a855f7",
      category: "Work",
    },
    {
      id: generateEventId(),
      title: "Doctor Appointment",
      startDate: new Date(currentYear, currentMonth, today.getDate() - 1, 11, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() - 1, 11, 45),
      color: "#ef4444",
      category: "Health",
    },
  ]
}

/**
 * Creates many sample events for stress testing
 */
export const createManyEvents = (count = 25): CalendarEvent[] => {
  const events: CalendarEvent[] = []
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const titles = [
    "Meeting",
    "Call",
    "Review",
    "Sync",
    "Workshop",
    "Training",
    "Interview",
    "Demo",
    "Presentation",
    "Discussion",
  ]

  const colors = ["#3b82f6", "#22c55e", "#ef4444", "#eab308", "#a855f7", "#ec4899", "#06b6d4", "#f97316"]
  const categories = ["Work", "Personal", "Meeting", "Reminder", "Health", "Other"]

  for (let i = 0; i < count; i++) {
    const dayOffset = Math.floor(Math.random() * 28) - 14
    const hour = Math.floor(Math.random() * 12) + 8
    const duration = Math.floor(Math.random() * 3) + 1

    events.push({
      id: generateEventId(),
      title: `${titles[i % titles.length]} ${i + 1}`,
      description: `Description for event ${i + 1}`,
      startDate: new Date(currentYear, currentMonth, today.getDate() + dayOffset, hour, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + dayOffset, hour + duration, 0),
      color: colors[i % colors.length],
      category: categories[i % categories.length],
    })
  }

  return events
}
