export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24
  const startMs = start.getTime()
  const endMs = end.getTime()
  return Math.floor((endMs - startMs) / msPerDay)
}

/**
 * Checks if two dates fall on the same day (ignores time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

/**
 * Checks if a date is in the current month
 */
export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth()
}

/**
 * Gets all days in a month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysCount = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysCount }, (_, i) => new Date(year, month, i + 1))
}

/**
 * Gets the calendar grid (42 cells for month view - 6 weeks × 7 days)
 */
export const getCalendarGrid = (date: Date): Date[] => {
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

/**
 * Gets the week grid (7 days starting from Sunday of the given date's week)
 */
export const getWeekGrid = (date: Date): Date[] => {
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

/**
 * Formats a date to display month and year
 */
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

/**
 * Formats a date to display day name
 */
export const formatDayName = (date: Date, short = false): string => {
  return date.toLocaleDateString("en-US", { weekday: short ? "short" : "long" })
}

/**
 * Formats a date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Formats time for input fields (HH:MM)
 */
export const formatTimeForInput = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

/**
 * Formats a date to display time
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Formats a date range
 */
export const formatDateRange = (start: Date, end: Date): string => {
  const startTime = formatTime(start)
  const endTime = formatTime(end)
  return `${startTime} - ${endTime}`
}

/**
 * Gets the next month from a given date
 */
export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

/**
 * Gets the previous month from a given date
 */
export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

/**
 * Gets the next week from a given date
 */
export const getNextWeek = (date: Date): Date => {
  const next = new Date(date)
  next.setDate(date.getDate() + 7)
  return next
}

/**
 * Gets the previous week from a given date
 */
export const getPreviousWeek = (date: Date): Date => {
  const prev = new Date(date)
  prev.setDate(date.getDate() - 7)
  return prev
}

/**
 * Creates a date from date and time inputs
 */
export const createDateFromInputs = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number)
  const [hours, minutes] = timeStr.split(":").map(Number)
  return new Date(year, month - 1, day, hours, minutes)
}

/**
 * Gets time slots for week view (00:00 - 23:00)
 */
export const getTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0")
    slots.push(`${hour}:00`)
  }
  return slots
}

/**
 * Generates list of years for year picker
 */
export const getYearOptions = (range = 10): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear - range; i <= currentYear + range; i++) {
    years.push(i)
  }
  return years
}

/**
 * Gets month names
 */
export const getMonthNames = (): string[] => {
  return [
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
}

/**
 * Gets short day names
 */
export const getShortDayNames = (): string[] => {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}
