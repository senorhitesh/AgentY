#!/usr/bin/env bun
import { Command } from "commander";
import { runWakeup } from "./tui/wakeup";
const program = new Command();

program.name("AgentY-build").description("AgentY CLI").version("1.0.0");

program
  .command("wakeup")
  .description("Show the banner and pick cli or telegram")
  .action(async () => {
    await runWakeup();
  });

await program.parseAsync(process.argv);
