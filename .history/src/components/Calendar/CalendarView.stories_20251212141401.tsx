import React from 'react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';

const createSampleEvents = (): CalendarEvent[] => [
  {
    id: '1',
    title: 'Team Meeting',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
    color: '#3b82f6',
    category: 'Meeting',
    description: 'Weekly sync.'
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    color: '#ef4444',
    category: 'Health',
    description: 'Annual checkup.'
  }
];

const createManyEvents = (count: number): CalendarEvent[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    title: `Event ${i + 1}`,
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + (i + 1) * 60 * 60 * 1000),
    color: ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'][i % 8],
    category: 'Other',
    description: `Description for event ${i + 1}`
  }));

export default {
  title: 'Calendar/CalendarView',
  component: CalendarView
};

export const Default = {
  args: {
    events: createSampleEvents(),
    onEventAdd: () => {},
    onEventUpdate: () => {},
    onEventDelete: () => {},
    initialView: 'month',
    initialDate: new Date()
  }
};

export const Empty = {
  args: {
    events: [],
    onEventAdd: () => {},
    onEventUpdate: () => {},
    onEventDelete: () => {},
    initialView: 'month',
    initialDate: new Date()
  }
};

export const WeekView = {
  args: {
    events: createSampleEvents(),
    onEventAdd: () => {},
    onEventUpdate: () => {},
    onEventDelete: () => {},
    initialView: 'week',
    initialDate: new Date()
  }
};

export const ManyEvents = {
  args: {
    events: createManyEvents(20),
    onEventAdd: () => {},
    onEventUpdate: () => {},
    onEventDelete: () => {},
    initialView: 'month',
    initialDate: new Date()
  }
};

export const InteractiveDemo = {
  render: (args: any) => {
    const [events, setEvents] = React.useState<CalendarEvent[]>(createSampleEvents());
    return (
      <CalendarView
        {...args}
        events={events}
        onEventAdd={e => setEvents(evts => [...evts, e])}
        onEventUpdate={(id, updates) => setEvents(evts => evts.map(e => e.id === id ? { ...e, ...updates } : e))}
        onEventDelete={id => setEvents(evts => evts.filter(e => e.id !== id))}
      />
    );
  },
  args: {
    initialView: 'month',
    initialDate: new Date()
  }
};
