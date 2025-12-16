"use client"

/**
 * Select Primitive Component - Modern Design
 */

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  id?: string
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  id,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault()
          if (isOpen) {
            onChange(options[highlightedIndex].value)
            setIsOpen(false)
          } else {
            setIsOpen(true)
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (isOpen) {
            setHighlightedIndex((i) => (i + 1) % options.length)
          } else {
            setIsOpen(true)
          }
          break
        case "ArrowUp":
          e.preventDefault()
          if (isOpen) {
            setHighlightedIndex((i) => (i - 1 + options.length) % options.length)
          } else {
            setIsOpen(true)
          }
          break
        case "Escape":
          setIsOpen(false)
          break
        case "Tab":
          setIsOpen(false)
          break
      }
    },
    [isOpen, highlightedIndex, options, onChange],
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlighted = listRef.current.children[highlightedIndex] as HTMLElement
      highlighted?.scrollIntoView({ block: "nearest" })
    }
  }, [highlightedIndex, isOpen])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${id}-label` : undefined}
        className="w-full px-3 py-2 text-left bg-white border border-slate-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 flex items-center justify-between hover:border-slate-300 transition-colors"
      >
        <span className={selectedOption ? "text-slate-900 font-medium" : "text-slate-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-activedescendant={`option-${highlightedIndex}`}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-3 py-2.5 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl ${
                index === highlightedIndex ? "bg-indigo-50 text-indigo-700" : "text-slate-900 hover:bg-slate-50"
              } ${option.value === value ? "font-semibold" : ""}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
