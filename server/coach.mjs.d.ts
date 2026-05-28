import type { IncomingMessage, ServerResponse } from "node:http";

interface CoachResponse {
  status: number;
  body: Record<string, unknown>;
}

export function createCoachResponse(
  rawBody: string,
  env?: Record<string, string | undefined>,
  fetchImpl?: typeof fetch,
): Promise<CoachResponse>;

export function handleNodeRequest(req: IncomingMessage, res: ServerResponse): Promise<void>;
