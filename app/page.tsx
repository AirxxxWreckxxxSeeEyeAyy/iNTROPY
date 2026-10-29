import EnergyStudio from "./energy-studio";
import { initial } from "./energy-config";
import { calculateScenario } from "@/lib/energy-engine";

export default function Home() {
  return (
    <EnergyStudio
      initialScenario={{ config: initial, ...calculateScenario(initial) }}
    />
  );
}
