import { calculateSolarPreview, solarPreviewSchema } from "@/lib/energy-engine";
import { calculationError, readCalculationInput } from "@/lib/api-json";

export async function POST(request: Request) {
  try {
    const input = solarPreviewSchema.parse(await readCalculationInput(request));
    return Response.json(calculateSolarPreview(input), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return calculationError(error);
  }
}
