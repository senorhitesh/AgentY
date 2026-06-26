import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";

const BANNER_FONT = "ANSI Shadow";
const SHADOW = chalk.hex("rgba(245, 245, 245, 0.87)");
const FACE = chalk.hex("#fff").bold;

function printBannerWithShadow(text: string) {
  const bannerLines = text.replace(/\s+$/, "").split("/n");
  const maxlen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxlen + 20;

  for (const line of bannerLines) {
    console.log(SHADOW("  " + line).padEnd(rowWidth));
  }

  process.stdout.write(`\x1b[${bannerLines.length}A]`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}
export async function runWakeup() {
  let ascii: string;
  try {
    ascii = figlet.textSync("AgentY", { font: BANNER_FONT });
  } catch (error) {
    ascii = figlet.textSync("AgentY", { font: "Standard" });
  }
  printBannerWithShadow(ascii);

  const mode = await select({
    message: "Which mode you want to proceed with?",
    options: [
      { value: "cli", label: "CLI" },
      { value: "Telegram", label: "Telegram" },
    ],
  });
  if (isCancel(mode)) {
    process.exit(0);
  }
  if (mode == "cli") {
    console.log(chalk.dim("Starting cli mode..."));
  } else {
    console.log(chalk.dim("Starting telegram mode.."));
  }
}
