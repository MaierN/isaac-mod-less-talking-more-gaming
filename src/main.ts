import { enableExtraConsoleCommands, log, upgradeMod } from "isaacscript-common";
import { configInit, MOD_NAME } from "./config";
import { consoleCommandsInit } from "./features/consoleCommands";
import { itemCounterInit } from "./features/itemCounter";
import { itemProtectionInit } from "./features/itemProtection";
import { offeringInit } from "./features/offering";
import { overlayInit } from "./features/overlay";
import { personsInit } from "./helpers/persons";

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  enableExtraConsoleCommands(mod);

  configInit();

  personsInit(mod);

  consoleCommandsInit();
  itemCounterInit(mod);
  itemProtectionInit(mod);
  offeringInit(mod);
  overlayInit(mod);

  log(`${MOD_NAME} initialized.`);
}
