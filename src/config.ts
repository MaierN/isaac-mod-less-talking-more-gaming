import { saveDataManager } from "isaacscript-common";

export const MOD_NAME = "Less talking. More gaming.";
export const MOD_VERSION = "1.7";

export const config = {
  persistent: {
    enablePrintToConsole: true,
  },
  run: {
    enableMod: true,
  },
};

export function configInit(): void {
  saveDataManager("config", config);
}
