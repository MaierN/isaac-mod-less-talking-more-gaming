import { MOD_NAME, MOD_VERSION } from "./constants";
import { addDebugCommand } from "./features/consoleCommands";
import { mod } from "./mod";

export const config = {
  run: {
    enableMod: true,
  },
};

export function configInit(): void {
  mod.saveDataManager("config", config);

  addDebugCommand("version", (_params) => {
    print(`${MOD_NAME} v${MOD_VERSION}`);
  });
}
