import { Injectable, type OnApplicationShutdown } from "@nestjs/common";
import { PostHog } from "posthog-node";

export type GeminiGeneration = {
  traceId: string;
  model: string;
  input: unknown;
  output?: string;
  status?: number;
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
  latencySeconds: number;
  spanName: string;
};

@Injectable()
export class PosthogAiService implements OnApplicationShutdown {
  private client: PostHog | undefined;
  private hasWarnedAboutConfiguration = false;

  captureGeminiGeneration(generation: GeminiGeneration): void {
    const posthog = this.getClient();
    if (!posthog) return;

    try {
      posthog.capture({
        distinctId: generation.traceId,
        event: "$ai_generation",
        properties: {
          $ai_trace_id: generation.traceId,
          $ai_session_id: generation.traceId,
          $ai_span_name: generation.spanName,
          $ai_model: generation.model,
          $ai_provider: "gemini",
          $ai_input: generation.input,
          $ai_output_choices: generation.output ? [{ role: "assistant", content: generation.output }] : undefined,
          $ai_input_tokens: generation.inputTokens,
          $ai_output_tokens: generation.outputTokens,
          $ai_latency: generation.latencySeconds,
          $ai_http_status: generation.status,
          $ai_is_error: Boolean(generation.error),
          $ai_error: generation.error,
        },
      });
    } catch {
      // AI observability must not affect the request that made the model call.
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client?.shutdown(3000).catch(() => {});
  }

  private getClient(): PostHog | undefined {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!token || !host) {
      if (process.env.NODE_ENV !== "production" && !this.hasWarnedAboutConfiguration) {
        const variable = token ? "NEXT_PUBLIC_POSTHOG_HOST" : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
        console.warn(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`);
        this.hasWarnedAboutConfiguration = true;
      }
      return undefined;
    }

    this.client ??= new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
      privacyMode: true,
    });

    return this.client;
  }
}
