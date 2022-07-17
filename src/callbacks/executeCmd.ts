import { ModCallback } from "isaac-typescript-definitions";
import { logMsg, mapToString } from "../debug";
import { state } from "../state";

export function initCbExecuteCmd(mod: Mod): void {
  mod.AddCallback(ModCallback.EXECUTE_CMD, executeCmd);
}

function printMsg(msg: string) {
  logMsg(msg, true);
}

function executeCmd(command: string, parameters: string, _player: EntityPlayer) {
  if (command === "ltmg") {
    const commands = new Map([
      [
        "itemCounts",
        () => {
          for (const [playerIndex, itemCounts] of state.run.itemCounts.entries()) {
            printMsg(`- player ${playerIndex}:`);
            printMsg(mapToString(itemCounts));
          }
        },
      ],
      [
        "itemPlayerPriorities",
        () => {
          for (const [playerIndex, itemPlayerPriorities] of state.run.itemPlayerPriorities.entries()) {
            printMsg(`- player ${playerIndex}:`);
            printMsg(mapToString(itemPlayerPriorities));
          }
        },
      ],
      [
        "itemGroups",
        () => {
          printMsg(mapToString(state.room.itemGroups));
        },
      ],
    ]);

    if (commands.has(parameters)) {
      commands.get(parameters)?.();
    } else if (parameters === "") {
      printMsg([...commands.keys()].join(", "));
    } else {
      printMsg("unknown command");
    }
  }
}
