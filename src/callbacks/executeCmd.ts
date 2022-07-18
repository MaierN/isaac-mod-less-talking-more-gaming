import { ModCallback } from "isaac-typescript-definitions";
import { MOD_NAME, MOD_VERSION } from "../config";
import { logMsg, mapToString, toggleDebug } from "../debug";
import { characterToRealPlayer } from "../playerCtrl";
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
        "version",
        () => {
          printMsg(`${MOD_NAME} ${MOD_VERSION}`);
        },
      ],
      [
        "itemCounts",
        () => {
          for (const [playerIndex, itemCounts] of state.run.itemCounts.entries()) {
            printMsg(`- player ${characterToRealPlayer(playerIndex).toString()}:`);
            printMsg(mapToString(itemCounts));
          }
        },
      ],
      [
        "itemPlayerPriorities",
        () => {
          for (const [playerIndexAndGroup, itemPlayerPriority] of state.run.itemPlayerPriorities.entries()) {
            printMsg(`- player/group ${playerIndexAndGroup}: ${itemPlayerPriority}`);
          }
        },
      ],
      [
        "itemGroups",
        () => {
          printMsg(mapToString(state.room.itemGroups));
        },
      ],
      [
        "debug",
        () => {
          toggleDebug();
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
