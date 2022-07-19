import { saveDataManager } from "isaacscript-common";

export const MOD_NAME = "Less talking. More gaming.";
export const MOD_VERSION = "1.3";

export const config = {
  persistent: {
    enablePrintToConsole: false,
  },
  run: {
    enableMod: true,
  },
};

export function initConfig(): void {
  saveDataManager("configState", config);
}
