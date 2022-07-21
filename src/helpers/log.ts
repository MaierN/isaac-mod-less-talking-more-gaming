import { config } from "../config";

export function logMsg(msg: string, toConsole = false): void {
  Isaac.DebugString(msg);

  if (config.persistent.enablePrintToConsole || toConsole) {
    print(msg);
  }
}

export function printMsg(msg: string): void {
  logMsg(msg, true);
}
