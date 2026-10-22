import { calculateScenario, configSchema } from "@/lib/energy-engine";
import { calculationError, readCalculationInput } from "@/lib/api-json";

export async function POST(request: Request) {
  try {
    const config = configSchema.parse(await readCalculationInput(request));
    return Response.json(calculateScenario(config), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return calculationError(error);
  }
}
