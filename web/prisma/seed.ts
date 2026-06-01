import "dotenv/config";

import { ensureDemoProject } from "../src/lib/seed-demo";

async function main() {
  const ok = await ensureDemoProject();
  if (!ok) {
    throw new Error(
      "No se pudo ejecutar el seed: verifica DATABASE_URL en web/.env"
    );
  }
  console.log("Seed demo completado (proyecto proj_demo).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
