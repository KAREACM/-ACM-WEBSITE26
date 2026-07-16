export interface ACMEvent {
  title: string;
  date: string;
  type: "hackathon" | "seminar" | "workshop" | "talk" | "other";
  price: string;
  desc: string;
  tags: string[];
  startDate: string;
  endDate?: string;
  year: number;
  venue?: string;
  mode: "online" | "offline";
  images?: string[];
  maxCapacity?: number | null;
  readonly status: "upcoming" | "ongoing" | "past";
}

export const getEventStatus = (event: Omit<ACMEvent, "status">): "upcoming" | "ongoing" | "past" => {
  if (!event.startDate) return "past";
  
  const now = new Date();
  
  const [startYear, startMonth, startDay] = event.startDate.split('-').map(Number);
  const startTime = new Date(startYear, startMonth - 1, startDay).getTime();
  
  let endTime = startTime;
  if (event.endDate) {
    const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
    endTime = new Date(endYear, endMonth - 1, endDay).getTime();
  }
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  if (today < startTime) return "upcoming";
  if (today >= startTime && today <= endTime) return "ongoing";
  return "past";
};

import eventsJson from '../../events.json';

const rawEvents: Omit<ACMEvent, "status">[] = eventsJson as Omit<ACMEvent, "status">[];

export const allEvents: ACMEvent[] = rawEvents.map(event => ({
  ...event,
  get status() { return getEventStatus(event); }
}));
