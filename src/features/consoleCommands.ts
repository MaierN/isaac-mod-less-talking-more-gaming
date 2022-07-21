import { addConsoleCommand } from "isaacscript-common";
import { MOD_NAME, MOD_VERSION } from "../config";
import { printMsg } from "../helpers/log";

const debugCommands = new Map<string, (params: string[]) => void>();

export function consoleCommandsInit(): void {
  addConsoleCommand("ltmg", (paramString) => {
    const params = paramString.split(" ");
    const command = params[0];
    if (command !== undefined && command.length > 0) {
      if (debugCommands.has(command)) {
        debugCommands.get(command)?.(params.slice(1));
      } else {
        printMsg("unknown command");
      }
    } else {
      printMsg([...debugCommands.keys()].sort().join(", "));
    }
  });

  addDebugCommand("version", (_params) => {
    printMsg(`${MOD_NAME} v${MOD_VERSION}`);
  });
}

export function addDebugCommand(name: string, callback: (params: string[]) => void): void {
  debugCommands.set(name, callback);
}
