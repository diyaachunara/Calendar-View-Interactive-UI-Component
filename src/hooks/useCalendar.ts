"use client"

/**
 * Calendar State Management Hook
 */

import { useState, useCallback, useMemo } from "react"
import type { CalendarViewType } from "../components/Calendar/CalendarView.types"
import { getNextMonth, getPreviousMonth, getNextWeek, getPreviousWeek } from "../utils/date.utils"

interface CalendarState {
  currentDate: Date
  view: CalendarViewType
  selectedDate: Date | null
}

interface UseCalendarOptions {
  initialDate?: Date
  initialView?: CalendarViewType
}

export const useCalendar = (options: UseCalendarOptions = {}) => {
  const { initialDate = new Date(), initialView = "month" } = options

  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: initialView,
    selectedDate: null,
  })

  const goToNextPeriod = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: prev.view === "month" ? getNextMonth(prev.currentDate) : getNextWeek(prev.currentDate),
    }))
  }, [])

  const goToPreviousPeriod = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: prev.view === "month" ? getPreviousMonth(prev.currentDate) : getPreviousWeek(prev.currentDate),
    }))
  }, [])

  const goToToday = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: new Date(),
    }))
  }, [])

  const goToDate = useCallback((date: Date) => {
    setState((prev) => ({
      ...prev,
      currentDate: date,
    }))
  }, [])

  const setView = useCallback((view: CalendarViewType) => {
    setState((prev) => ({
      ...prev,
      view,
    }))
  }, [])

  const selectDate = useCallback((date: Date | null) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date,
    }))
  }, [])

  const setMonth = useCallback((month: number) => {
    setState((prev) => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getFullYear(), month, 1),
    }))
  }, [])

  const setYear = useCallback((year: number) => {
    setState((prev) => ({
      ...prev,
      currentDate: new Date(year, prev.currentDate.getMonth(), 1),
    }))
  }, [])

  return useMemo(
    () => ({
      ...state,
      goToNextPeriod,
      goToPreviousPeriod,
      goToToday,
      goToDate,
      setView,
      selectDate,
      setMonth,
      setYear,
    }),
    [state, goToNextPeriod, goToPreviousPeriod, goToToday, goToDate, setView, selectDate, setMonth, setYear],
  )
}
