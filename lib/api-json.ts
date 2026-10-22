import "server-only";

const MAX_BYTES = 8192;
export class InputError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export async function readCalculationInput(request: Request): Promise<unknown> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new InputError(
      "Cross-origin calculation requests are not accepted.",
      403,
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    throw new InputError("Send an application/json request.", 415);
  }
  const length = request.headers.get("content-length");
  if (length && Number(length) > MAX_BYTES)
    throw new InputError("Calculation input is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("Calculation input is required.");
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new InputError("Calculation input is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new InputError("Calculation input must be valid JSON.");
  }
}

export function calculationError(error: unknown): Response {
  if (error instanceof InputError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  return Response.json(
    { error: "Invalid calculation inputs. Check the supported ranges." },
    { status: 400, headers: { "Cache-Control": "no-store" } },
  );
}
