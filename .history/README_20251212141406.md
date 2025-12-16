# CalendarView Component Assignment

This project implements a fully accessible, production-ready CalendarView React component using TypeScript, Tailwind CSS, and Storybook. It is designed for a hiring assignment and follows strict requirements for accessibility, performance, and code quality.

## Features
- Month and week views
- Add, edit, and delete events
- Accessible (ARIA/WCAG 2.1 AA)
- Responsive (mobile list, desktop grid)
- Keyboard navigation
- Color-coded events and categories
- Uses only provided hooks and primitives
- Fully typed with TypeScript
- Storybook with 5 required stories

## Tech Stack
- React 18
- TypeScript 5
- Tailwind CSS 3
- Storybook (@storybook/react-vite)
- Vite

## Getting Started

### 1. Install dependencies

```
pnpm install
```

### 2. Run Storybook

```
pnpm run storybook
```

### 3. Build for Production

```
pnpm run build
```

### 4. Deploy

This project is ready for instant deployment to Vercel.

## Folder Structure

- `src/components/Calendar/` — CalendarView and related components
- `src/primitives/` — Button, Modal, Select primitives
- `src/hooks/` — useCalendar, useEventManager
- `src/utils/` — date and event utilities
- `.storybook/` — Storybook configuration
- `tailwind.config.js` — Tailwind theme (assignment colors)

## Assignment Requirements
- No forbidden libraries
- React.memo for CalendarCell
- ARIA roles, labels, focus-visible
- Responsive and performant
- Only provided hooks/primitives
- No console errors

---

For more details, see the assignment PDF.
