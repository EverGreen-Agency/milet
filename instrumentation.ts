import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogLoggerProvider = token && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({ "service.name": "milet-nextjs" }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host.replace(/\/$/, "")}/i/v1/logs`,
            timeoutMillis: 2000,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
        })
      ]
    })
  : undefined;

// Keep PostHog logs isolated: only the logger below is exported to PostHog.
export const posthogLogger = posthogLoggerProvider?.getLogger("milet.posthog");

export function register() {
  if (!posthogLoggerProvider && process.env.NODE_ENV !== "production") {
    const missingVariable = token
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
}
