export type LogLevel = "info" | "warn" | "error";

export function logJson(level: LogLevel, event: string, fields: Readonly<Record<string, unknown>> = {}): void {
  process.stdout.write(`${JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: "milet-worker",
    event,
    ...fields,
  })}\n`);
}
