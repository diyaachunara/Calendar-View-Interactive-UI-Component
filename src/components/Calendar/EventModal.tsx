"use client"

/**
 * Event Modal Component - Modern Design
 */

import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import type { CalendarEvent } from "./CalendarView.types"
import { Modal } from "../primitives/Modal"
import { Button } from "../primitives/Button"
import { Select } from "../primitives/Select"

interface EventFormData {
  title: string
  description?: string
  startDate: Date
  endDate: Date
  color: string
  category?: string
}

type FormErrors = Partial<Record<keyof EventFormData, string>>

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  event?: CalendarEvent | null
  prefilledDate?: Date | null
  onSave: (eventData: Omit<CalendarEvent, "id">) => { success: boolean; errors?: Record<string, string> }
  onDelete?: (id: string) => void
}

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatTimeForInput = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

const createDateFromInputs = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number)
  const [hours, minutes] = timeStr.split(":").map(Number)
  return new Date(year, month - 1, day, hours, minutes)
}

const validateEvent = (event: Partial<EventFormData>): Record<string, string> => {
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

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  mode,
  event,
  prefilledDate,
  onSave,
  onDelete,
}) => {
  const EVENT_COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Orange", value: "#f97316" },
  ] as const

  const EVENT_CATEGORIES = ["Work", "Personal", "Meeting", "Reminder", "Health", "Other"] as const

  const getInitialFormData = useCallback((): EventFormData => {
    if (event) {
      return {
        title: event.title,
        description: event.description || "",
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        color: event.color || EVENT_COLORS[0].value,
        category: event.category || "",
      }
    }

    const now = prefilledDate ? new Date(prefilledDate) : new Date()
    const startDate = new Date(now)
    if (!prefilledDate) {
      startDate.setHours(startDate.getHours() + 1, 0, 0, 0)
    }
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 1)

    return {
      title: "",
      description: "",
      startDate,
      endDate,
      color: EVENT_COLORS[0].value,
      category: "",
    }
  }, [event, prefilledDate])

  const [formData, setFormData] = useState<EventFormData>(getInitialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData())
      setErrors({})
      setTouched(new Set())
    }
  }, [isOpen, getInitialFormData])

  const handleInputChange = useCallback((field: keyof EventFormData, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => new Set(prev).add(field))
  }, [])

  const handleDateTimeChange = useCallback(
    (field: "startDate" | "endDate", dateStr: string, timeStr: string) => {
      const newDate = createDateFromInputs(dateStr, timeStr)
      handleInputChange(field, newDate)
    },
    [handleInputChange],
  )

  const handleBlur = useCallback(
    (field: keyof EventFormData) => {
      setTouched((prev) => new Set(prev).add(field))
      const validationErrors = validateEvent(formData)
      if (validationErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [formData],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const validationErrors = validateEvent(formData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors as FormErrors)
        setTouched(new Set(Object.keys(formData)))
        return
      }

      const result = onSave({
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        color: formData.color,
        category: formData.category || undefined,
      })

      if (!result.success && result.errors) {
        setErrors(result.errors as FormErrors)
      }
    },
    [formData, onSave],
  )

  const handleDelete = useCallback(() => {
    if (event && onDelete) {
      onDelete(event.id)
    }
  }, [event, onDelete])

  const colorOptions = useMemo(() => EVENT_COLORS.map((c) => ({ value: c.value, label: c.name })), [])

  const categoryOptions = useMemo(
    () => [{ value: "", label: "No Category" }, ...EVENT_CATEGORIES.map((c) => ({ value: c, label: c }))],
    [],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create Event" : "Edit Event"}
      description={mode === "create" ? "Add a new event to your calendar" : "Update event details"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="event-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="event-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            maxLength={100}
            className={`
              w-full px-4 py-2.5 border rounded-xl transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500
              ${touched.has("title") && errors.title ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}
            `}
            placeholder="Enter event title"
            aria-invalid={touched.has("title") && !!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {touched.has("title") && errors.title && (
            <p id="title-error" className="mt-1.5 text-sm text-red-500 font-medium" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="event-description" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            id="event-description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            maxLength={500}
            rows={3}
            className={`
              w-full px-4 py-2.5 border rounded-xl resize-none transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500
              ${touched.has("description") && errors.description ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}
            `}
            placeholder="Add a description (optional)"
            aria-invalid={touched.has("description") && !!errors.description}
          />
          {touched.has("description") && errors.description && (
            <p className="mt-1.5 text-sm text-red-500 font-medium" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        {/* Start Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="start-date"
              type="date"
              value={formatDateForInput(formData.startDate)}
              onChange={(e) =>
                handleDateTimeChange("startDate", e.target.value, formatTimeForInput(formData.startDate))
              }
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 hover:border-slate-300 transition-all"
            />
          </div>
          <div>
            <label htmlFor="start-time" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="start-time"
              type="time"
              value={formatTimeForInput(formData.startDate)}
              onChange={(e) =>
                handleDateTimeChange("startDate", formatDateForInput(formData.startDate), e.target.value)
              }
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 hover:border-slate-300 transition-all"
            />
          </div>
        </div>

        {/* End Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="end-date" className="block text-sm font-semibold text-slate-700 mb-1.5">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="end-date"
              type="date"
              value={formatDateForInput(formData.endDate)}
              onChange={(e) => handleDateTimeChange("endDate", e.target.value, formatTimeForInput(formData.endDate))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 hover:border-slate-300 transition-all"
            />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-semibold text-slate-700 mb-1.5">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              id="end-time"
              type="time"
              value={formatTimeForInput(formData.endDate)}
              onChange={(e) => handleDateTimeChange("endDate", formatDateForInput(formData.endDate), e.target.value)}
              onBlur={() => handleBlur("endDate")}
              className={`
                w-full px-4 py-2.5 border rounded-xl transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500
                ${touched.has("endDate") && errors.endDate ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}
              `}
            />
          </div>
        </div>
        {touched.has("endDate") && errors.endDate && (
          <p className="text-sm text-red-500 font-medium -mt-2" role="alert">
            {errors.endDate}
          </p>
        )}

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Event Color</label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange("color", color.value)}
                className={`
                  w-9 h-9 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                  ${formData.color === color.value ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "hover:scale-110"}
                `}
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.name} color`}
                aria-pressed={formData.color === color.value}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <Select
          id="event-category"
          label="Category"
          options={categoryOptions}
          value={formData.category || ""}
          onChange={(value) => handleInputChange("category", value)}
          placeholder="Select a category"
        />

        {/* Actions */}
        <div className="flex gap-3 pt-5 border-t border-slate-100">
          {mode === "edit" && onDelete && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
