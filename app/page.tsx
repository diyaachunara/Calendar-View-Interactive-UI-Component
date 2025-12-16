"use client"

/**
 * Calendar Demo Page - Stylish Modern Design
 */

import { useState, useCallback } from "react"
import { CalendarView } from "../src/components/Calendar/CalendarView"
import type { CalendarEvent } from "../src/components/Calendar/CalendarView.types"

const createInitialEvents = (): CalendarEvent[] => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  return [
    {
      id: "event-1",
      title: "Team Standup",
      description: "Daily sync with the development team",
      startDate: new Date(currentYear, currentMonth, today.getDate(), 9, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate(), 9, 30),
      color: "#3b82f6",
      category: "Meeting",
    },
    {
      id: "event-2",
      title: "Project Review",
      description: "Quarterly project review meeting",
      startDate: new Date(currentYear, currentMonth, today.getDate(), 14, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate(), 15, 30),
      color: "#10b981",
      category: "Work",
    },
    {
      id: "event-3",
      title: "Lunch with Client",
      startDate: new Date(currentYear, currentMonth, today.getDate() + 1, 12, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + 1, 13, 30),
      color: "#f59e0b",
      category: "Meeting",
    },
    {
      id: "event-4",
      title: "Gym Session",
      description: "Weekly fitness routine",
      startDate: new Date(currentYear, currentMonth, today.getDate() + 2, 18, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + 2, 19, 30),
      color: "#ec4899",
      category: "Health",
    },
    {
      id: "event-5",
      title: "Sprint Planning",
      description: "Plan upcoming sprint tasks",
      startDate: new Date(currentYear, currentMonth, today.getDate() + 3, 10, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() + 3, 12, 0),
      color: "#8b5cf6",
      category: "Work",
    },
    {
      id: "event-6",
      title: "Doctor Appointment",
      startDate: new Date(currentYear, currentMonth, today.getDate() - 1, 11, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate() - 1, 11, 45),
      color: "#ef4444",
      category: "Health",
    },
    {
      id: "event-7",
      title: "Design Review",
      description: "Review new design mockups",
      startDate: new Date(currentYear, currentMonth, today.getDate(), 11, 0),
      endDate: new Date(currentYear, currentMonth, today.getDate(), 12, 0),
      color: "#06b6d4",
      category: "Work",
    },
    {
      id: "event-8",
      title: "Coffee Break",
      startDate: new Date(currentYear, currentMonth, today.getDate(), 15, 30),
      endDate: new Date(currentYear, currentMonth, today.getDate(), 16, 0),
      color: "#f97316",
      category: "Personal",
    },
  ]
}

export default function CalendarDemoPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => createInitialEvents())

  const handleEventAdd = useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event])
  }, [])

  const handleEventUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }, [])

  const handleEventDelete = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Calendar
              </h1>
              <p className="text-slate-500 mt-1">Manage your schedule and events</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                {events.length} events
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-200px)] min-h-[600px]">
          <CalendarView
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            initialView="month"
          />
        </div>
      </div>
    </main>
  )
}
