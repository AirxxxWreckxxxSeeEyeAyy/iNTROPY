import "server-only";
import { z } from "zod";
import { simulate } from "@/app/model";
import { planeIrradiance } from "@/app/solar-math";
import type {
  Config,
  ScenarioCalculation,
  SolarPreview,
} from "@/app/energy-config";

const finite = (min: number, max: number) =>
  z.number().finite().min(min).max(max);
const directionSchema = z.enum(["North", "South", "East", "West"]);
const solarRowSchema = z
  .object({
    month: finite(0, 11).int(),
    ghi: finite(0, 12),
    dhi: finite(0, 12),
  })
  .strict()
  .refine(
    (row) => row.dhi <= row.ghi,
    "Diffuse sunlight cannot exceed total sunlight.",
  );
const radiationSchema = z
  .object({
    latitude: finite(24, 32),
    longitude: finite(-88, -79),
    month: finite(0, 11).int(),
    ghi: finite(0, 12),
    dhi: finite(0, 12),
    location: z.string().max(100),
    period: z.string().max(100),
  })
  .strict()
  .refine(
    (row) => row.dhi <= row.ghi,
    "Diffuse sunlight cannot exceed total sunlight.",
  );

export const configSchema = z
  .object({
    radiation: radiationSchema.optional(),
    tilt: finite(0, 60),
    area: finite(800, 4000),
    panels: finite(0, 36).int(),
    watts: finite(100, 1000),
    battery: finite(0, 30),
    direction: directionSchema,
    sun: finite(0, 12),
    shade: finite(0, 80),
    ac: finite(0, 6),
    hours: finite(1, 12),
    reserve: finite(0, 100),
    dayRate: finite(0, 100),
    nightRate: finite(0, 100),
    exportRate: finite(0, 100),
    fuel: finite(0, 100),
    burn: finite(0, 100),
    generatorKw: finite(0.1, 50),
    exportOn: z.boolean(),
    efficiency: finite(0.1, 1),
    usable: finite(0.1, 1),
    inverter: finite(0.1, 50),
  })
  .strict();

export function calculateScenario(input: Config): ScenarioCalculation {
  const config = configSchema.parse(input);
  return {
    result: simulate(config),
    solarOnly: simulate({ ...config, battery: 0 }),
  };
}

export const solarPreviewSchema = z
  .object({
    solar: z
      .object({
        latitude: finite(24, 32),
        longitude: finite(-88, -79),
        location: z.string().max(100),
        period: z.string().max(100),
        retrievedAt: z.string().max(100),
        source: z.string().max(1000),
        units: z.string().max(100).optional(),
        rows: z
          .array(solarRowSchema)
          .length(12)
          .refine(
            (rows) => rows.every((row, index) => row.month === index),
            "Expected ordered months.",
          ),
      })
      .strict(),
    month: finite(0, 11).int(),
    tilt: finite(0, 60),
    direction: directionSchema,
  })
  .strict();

export function calculateSolarPreview(
  input: z.infer<typeof solarPreviewSchema>,
): SolarPreview {
  const { solar, month, tilt, direction } = solarPreviewSchema.parse(input);
  const resource = {
    ...solar.rows[month],
    latitude: solar.latitude,
    longitude: solar.longitude,
    location: solar.location,
    period: solar.period,
  };
  return {
    poa: planeIrradiance(resource, tilt, direction),
    allMonths: solar.rows.map(
      (row) => planeIrradiance({ ...resource, ...row }, tilt, direction).daily,
    ),
    options: ["North", "South", "East", "West"].map((facing) => ({
      direction: facing,
      ...planeIrradiance(resource, tilt, facing),
    })),
  };
}
