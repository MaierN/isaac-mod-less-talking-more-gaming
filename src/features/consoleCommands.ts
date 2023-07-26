import { mod } from "../mod";

const debugCommands = new Map<string, (params: string[]) => void>();

export function consoleCommandsInit(): void {
  mod.addConsoleCommand("ltmg", (paramString) => {
    const params = paramString.split(" ");
    const command = params[0];
    if (command !== undefined && command.length > 0) {
      if (debugCommands.has(command)) {
        debugCommands.get(command)?.(params.slice(1));
      } else {
        print("unknown command");
      }
    } else {
      print([...debugCommands.keys()].sort().join(", "));
    }
  });
}

export function addDebugCommand(
  name: string,
  callback: (params: string[]) => void,
): void {
  debugCommands.set(name, callback);
}
