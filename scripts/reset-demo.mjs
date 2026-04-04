import process from "node:process";
import { spawn } from "node:child_process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      env: process.env,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });

    child.on("error", reject);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  console.log("Applying demo seed...");
  await run(process.execPath, ["scripts/seed-demo.mjs"]);

  console.log("\nVerifying demo data...");
  await run(process.execPath, ["scripts/verify-demo.mjs"]);

  console.log("\nDemo reset completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
