import { log } from "isaacscript-common";
import { configInit } from "./config";
import { MOD_NAME } from "./constants";
import { consoleCommandsInit } from "./features/consoleCommands";
import { itemCounterInit } from "./features/itemCounter";
import { itemProtectionInit } from "./features/itemProtection";
import { offeringInit } from "./features/offering";
import { overlayInit } from "./features/overlay";
import { personsInit } from "./helpers/persons";

main();

function main() {
  configInit();

  personsInit();

  consoleCommandsInit();
  itemCounterInit();
  itemProtectionInit();
  offeringInit();
  overlayInit();

  log(`${MOD_NAME} initialized.`);
}
