import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class IntakeRateLimiter {
  private readonly attempts = new Map<string, number[]>();
  private readonly windowMs = 15 * 60 * 1000;
  private readonly limit = 3;

  check(key: string): void {
    const now = Date.now();
    const recent = (this.attempts.get(key) ?? []).filter((timestamp) => now - timestamp < this.windowMs);
    if (recent.length >= this.limit) throw new HttpException("Aguarde alguns minutos antes de enviar outra solicitação.", HttpStatus.TOO_MANY_REQUESTS);
    recent.push(now);
    this.attempts.set(key, recent);
  }
}
