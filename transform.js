import fs from 'fs';
import path from 'path';

const file = fs.readFileSync('src/components/acm/eventsData.ts', 'utf-8');

// I will extract the array using regex
const match = file.match(/export const allEvents = (\[[\s\S]*?\]);/);
if (match) {
  let events = eval(match[1]);

  const outputEvents = events.map(ev => {
    let newEv = { ...ev };
    
    // Auto populate startDate and year.
    // The previous events didn't have year. But judging by status, "upcoming" = 2026, "past" = 2024 or 2025.
    // Let's look at the dates and descriptions.
    // HackNova 2026 -> 2026
    // DISFRUTAR 2K25 -> 2025
    // Virtual Code Corner 2024 -> 2024
    let year = 2024;
    if (ev.status === "upcoming" || ev.title.includes("2026")) {
      year = 2026;
    } else if (ev.title.includes("2025") || ev.title.includes("2K25")) {
      year = 2025;
    } else if (ev.title.includes("2024")) {
      year = 2024;
    }

    // Convert e.g., "APR 25" to startDate string
    const months: {[key: string]: string} = {
      JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
      JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
    };
    
    let parts = ev.date.split(' ');
    let monthNum = months[parts[0]];
    let dayStr = parts[1].padStart(2, '0');
    let startDate = `${year}-${monthNum}-${dayStr}`;

    newEv.startDate = startDate;
    newEv.year = year;

    if (ev.type === "hackathon" || ev.type === "workshop") {
      // Just make endDate 1 or 2 days later
      let d = parseInt(dayStr) + 1;
      let dStr = d.toString().padStart(2, '0');
      newEv.endDate = `${year}-${monthNum}-${dStr}`;
    }

    if (ev.status === "upcoming") {
      newEv.venue = "TBD";
    }

    if (ev.status === "past") {
      // 3-6 images
      newEv.images = [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"
      ];
    } else {
      newEv.images = ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"];
    }

    delete newEv.status; // removing hardcoded status
    return newEv;
  });

  const finalCode = `export interface ACMEvent {
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
  images?: string[];
  readonly status: "upcoming" | "ongoing" | "past";
}

export const getEventStatus = (event: Omit<ACMEvent, "status">): "upcoming" | "ongoing" | "past" => {
  const now = new Date();
  
  // Create dates strictly as midnight in local time so we don't get timezone shifts
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

const rawEvents: Omit<ACMEvent, "status">[] = ${JSON.stringify(outputEvents, null, 2)};

export const allEvents: ACMEvent[] = rawEvents.map(event => ({
  ...event,
  get status() { return getEventStatus(event); }
}));
`;

  fs.writeFileSync('src/components/acm/eventsData.ts', finalCode);
} else {
  console.log("No match found");
}
