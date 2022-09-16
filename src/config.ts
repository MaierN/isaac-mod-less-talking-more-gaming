import { saveDataManager } from "isaacscript-common";
import { addDebugCommand } from "./features/consoleCommands";

export const MOD_NAME = "Less talking. More gaming.";
export const MOD_VERSION = "1.9";

export const config = {
  run: {
    enableMod: true,
  },
};

export function configInit(): void {
  saveDataManager("config", config);

  addDebugCommand("version", (_params) => {
    print(`${MOD_NAME} v${MOD_VERSION}`);
  });
}
