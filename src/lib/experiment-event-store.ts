import type { TelemetryEvent } from "@/domain/experiments";

const MAX_EVENTS_PER_INSTANCE = 500;
let events: TelemetryEvent[] = [];

export function getExperimentEvents(): readonly TelemetryEvent[] {
  return events;
}

export function recordExperimentEvent(event: TelemetryEvent): void {
  events = [...events.slice(-(MAX_EVENTS_PER_INSTANCE - 1)), event];
}

export function resetExperimentEventsForTest(): void {
  events = [];
}
